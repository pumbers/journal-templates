import * as yamlFront from "yaml-front-matter";

(function () {
  console.log("Journal Templates | Loading");

  Hooks.once("init", () => {
    console.log("Journal Templates | Initializing", yamlFront);

    CONFIG.TinyMCE.plugins += " template";
    CONFIG.TinyMCE.toolbar = CONFIG.TinyMCE.toolbar.replace(/save/, "template save");

    (function (_createEditor) {
      // Cache the original method
      JournalSheet.prototype._createEditor = function () {
        console.log("JournalSheet._createEditor()", arguments);
        // Extra function logic here
        let additionalOptions = {
          templates: [
            {
              title: "Test Template",
              description: "A template to test with.",
              url: "modules/journal-templates/templates/test.html",
            },
          ],
        };
        arguments[1] = { ...arguments[1], ...additionalOptions };
        // Now, call the original method
        return _createEditor.apply(this, arguments);
      };
    })(JournalSheet.prototype._createEditor);
  });
})();
