import * as yamlFront from "yaml-front-matter";

(function () {
  Hooks.once("ready", () => {
    console.log("Journal Templates | Initializing");

    // if template plugin or toolbar button not already loaded, load them
    if (!CONFIG.TinyMCE.plugins.includes("template")) CONFIG.TinyMCE.plugins += " template";
    if (!CONFIG.TinyMCE.toolbar.includes("template"))
      CONFIG.TinyMCE.toolbar = CONFIG.TinyMCE.toolbar.replace(/save/, "template save");

    // Fetch the templates from the server
    let location = `worlds/${game.data.world.name}/journal-templates`;
    console.log(`Journal Templates | Loading from ${location}`);
    FilePicker.browse("user", location)
      .then((resp) => {
        if (resp?.target !== location) {
          console.log(`Journal Templates | No template folder found at ${location}`);
          return [];
        }
        // For each template file
        return resp.files?.map((file) => {
          // Fetch the file contents
          return fetch(file).then((response) => {
            // Get the body text
            return response.text().then((fileContents) => {
              // Parse the template to retrieve the YAML front matter
              try {
                let parsed = yamlFront.loadFront(fileContents);
                if (!parsed.title) throw game.i18n.translations.JOURNAL_TEMPLATES.errorNoTitle;
                if (!parsed.description) throw game.i18n.translations.JOURNAL_TEMPLATES.errorNoDescription;
                // Run the template through Handlebars
                let rendered = file.endsWith("hbs") ? Handlebars.compile(parsed.__content)(parsed) : parsed.__content;
                console.log("Journal Templates | Loaded", file);
                // Return the rendered template
                return {
                  title: parsed.title,
                  description: parsed.description,
                  content: rendered,
                };
              } catch (err) {
                console.error("Journal Templates | Error parsing", file, "-", err);
                ui.notifications.warn(game.i18n.format("JOURNAL_TEMPLATES.errorLoading", { file, err }));
              }
            });
          });
        });
      })
      .then((loading) => {
        // No file found at template location, so skip the following
        if (!loading?.length) return;
        // Wait for all templates to load
        Promise.all(loading)
          // Filter out any that failed and returned null
          .then((loaded) => loaded.filter((l) => l))
          // Send the remaining to the Foundry function patch
          .then((templates) => {
            console.log(
              "Journal Templates | Loaded",
              templates.map((t) => t.title)
            );
            ui.notifications.info(game.i18n.format("JOURNAL_TEMPLATES.loaded", { count: templates.length }));
            // Patch over the original Foundry activateEditor function for the JournalSheet class
            (function (activateEditor) {
              // Cache the original method
              JournalSheet.prototype.activateEditor = function (name, options = {}, initialContent = "") {
                // Now, call the original method with templates added
                console.log("Journal Templates | Opening Journal Editor,", templates?.length || 0, "template(s) ready");
                return activateEditor.apply(this, [name, Object.assign(options, { templates }), initialContent]);
              };
            })(JournalSheet.prototype.activateEditor);
          });
      })
      .catch((err) => {
        console.log("error", err);
      });
  });
})();
