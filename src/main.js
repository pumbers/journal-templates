import * as yamlFront from "yaml-front-matter";

(function () {
  console.log("Journal Templates | Loading");

  Hooks.once("init", () => {
    console.log("Journal Templates | Initializing");

    CONFIG.TinyMCE.plugins += " template";
    CONFIG.TinyMCE.toolbar = CONFIG.TinyMCE.toolbar.replace(/save/, "template save");

    FilePicker.browse("user", `modules/journal-templates/templates`)
      .then((resp) => {
        // console.log("files", resp.files);
        return resp.files.map((file) => {
          // console.log("loading", file);
          return fetch(file).then((response) => {
            // console.log("...response", response);
            return response.text().then((fileContents) => {
              // console.log("...fileContents", fileContents);
              try {
                let parsed = yamlFront.loadFront(fileContents);
                if (!parsed.title) throw "No template title";
                console.log("Journal Templates | Loaded", file);
                return { title: parsed.title, description: parsed.description, content: parsed.__content };
              } catch (err) {
                console.error("Journal Templates | Error parsing", file, "-", err);
              }
            });
          });
        });
      })
      .then((loading) => {
        Promise.all(loading).then((templates) => {
          // console.log("Journal Templates | Loaded", templates);
          // Patch over the original Foundry _createEditor function for the JournalSheet class
          (function (_createEditor) {
            // Cache the original method
            JournalSheet.prototype._createEditor = function () {
              // console.log("JournalSheet._createEditor()", arguments, templates);
              // Add the loaded templates to the editor template list (filtering out nulls because they didn't load)
              arguments[1] = Object.assign(arguments[1], { templates: templates.filter((t) => t) });
              // Now, call the original method
              return _createEditor.apply(this, arguments);
            };
          })(JournalSheet.prototype._createEditor);
        });
      });
  });
})();
