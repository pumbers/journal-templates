# Journal Templates for Foundry VTT

Create your own library of Journal Entry templates for any game system in Foundry VTT.

This module can be added to any game system or world. When the world starts, it will load templates from the `journal-templates` folder within the world and make them available to the TinyMCE Editor used to write journal entries. If, for some reason, templates are not loading correctly, a warning message will be displayed - check the browser console for more detailed error messages.

The `templates` icon is added to the editor toolbar.

![](screen_shot_editor_toolbar.png)

Click on the stamp icon and select a template.

![](screen_shot_template.png)

A template is a text file with some [YAML](https://www.w3schools.io/file/yaml-introduction/) FrontMatter followed by the HTML template itself:

```
---
title: Some Template
description: Some template to generate text from
---
<h1>Example Template</h1>
<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur efficitur, arcu ac pharetra tincidunt, leo ex malesuada purus, sit amet pellentesque turpis orci a sem. Integer nec ante varius, dapibus lectus eget, rhoncus ex. Suspendisse massa tortor, porttitor vel ipsum vitae, porttitor condimentum enim. Aliquam et dolor nunc. Fusce malesuada congue mi, nec scelerisque libero. Vivamus non sodales eros, id venenatis massa. Vivamus non diam mollis, cursus massa placerat, fringilla quam. Nam sit amet mi vel risus fringilla cursus quis hendrerit ante. Vestibulum eget lacinia ex. Suspendisse ac blandit leo. In hac habitasse platea dictumst. Donec interdum, neque ut placerat faucibus, nisl augue semper lacus, vel maximus neque ipsum ac nulla.</p>
<hr />
<p>&nbsp;</p>
<table style="background-color: white;" border="1">
<thead>
<tr style="background-color: grey; color:white;">
<td><strong>Top Left</strong></td>
<td>Middle Left</td>
<td>Middle Right</td>
<td>Top Right</td>
</tr>
</thead>
<tbody>
<tr>
<td>&nbsp;</td>
<td>&nbsp;</td>
<td>&nbsp;</td>
<td>&nbsp;</td>
</tr>
<tr>
<td>&nbsp;</td>
<td>&nbsp;</td>
<td>&nbsp;</td>
<td>&nbsp;</td>
</tr>
</tbody>
</table>
```

The front matter **must** contain `title` and `description` fields, they’re used to describe the template as it’s being chosen. It can optionally contain any other field.

Template files ending in `.html` will be rendered as-is, template files ending in `.hbs` will be rendered using Handlebars and any fields from the front matter can be included in the body of the template using `{{field_name}}`. For example: if a template contains `{{title}}` then the title field from the front matter is inserted.

The easiest way to create a template is to build it as a journal entry in Foundry VTT, then click the _show code_ `< >` button on the toolbar and copy the HTML code for the entry, then paste it into a template file. Don’t forget to add the `title` and `description` front matter. But, if you feel up to writing your own HTML, go for it - just make sure it works with the editor before you use it in a game.

Templates can be entire journal pages (as shown above), or just small reusable page snippets.
