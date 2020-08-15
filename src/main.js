import * as yamlFront from "yaml-front-matter";

(function () {
  console.log("Journal Templates | Loading");

  Hooks.once("init", () => {
    console.log("Journal Templates | Initializing");

    // if template plugin or toolbar button not already loaded, load them
    if (!CONFIG.TinyMCE.plugins.includes("template")) CONFIG.TinyMCE.plugins += " template";
    if (!CONFIG.TinyMCE.toolbar.includes("template"))
      CONFIG.TinyMCE.toolbar = CONFIG.TinyMCE.toolbar.replace(/save/, "template save");

    // Fetch the templates from the server
    FilePicker.browse("user", `modules/journal-templates/templates`)
      .then((resp) => {
        // For each template file
        return resp.files.map((file) => {
          // Fetch the file contents
          return fetch(file).then((response) => {
            // Get the body text
            return response.text().then((fileContents) => {
              // Parse the template to retrieve the YAML front matter
              try {
                let parsed = yamlFront.loadFront(fileContents);
                if (!parsed.title) throw "No template title";
                if (!parsed.description) throw "No template description";
                // Run the template through Handlebars
                let rendered = Handlebars.compile(parsed.__content)(parsed);
                console.log("Journal Templates | Loaded", file);
                // Return the rendered template
                return {
                  title: parsed.title,
                  description: parsed.description,
                  content: rendered,
                };
              } catch (err) {
                console.error("Journal Templates | Error parsing", file, "-", err);
                ui.notifications.warn(`Unable to load Journal Template ${file}: ${err}`);
              }
            });
          });
        });
      })
      .then((loading) => {
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
            // Patch over the original Foundry _createEditor function for the JournalSheet class
            (function (_createEditor) {
              // Cache the original method
              JournalSheet.prototype._createEditor = function () {
                // Add the loaded templates to the editor template list (filtering out nulls because they didn't load)
                arguments[1] = Object.assign(arguments[1], { templates });
                // Now, call the original method
                return _createEditor.apply(this, arguments);
              };
            })(JournalSheet.prototype._createEditor);
          });
      });
  });
})();
