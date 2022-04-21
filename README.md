## open-external

![open-external](https://github.com/bacadra/atom-open-external/raw/master/assets/open-external.png)

![tree-view-external](https://github.com/bacadra/atom-open-external/raw/master/assets/tree-view-external.png)

Many files cannot be displayed in human-readable form and the corresponding Atom editor plugins do not exist. In this case, the most convenient way of exploring it is to open it in an external program.

In `atom-workspace` space there are available commands:

* `open-external:toggle-unsupported-flag`: (default `Alt-U`) quick switch of external opener state

In `atom-text-editor` and `.image-view` spaces there are available commands:

* `open-external:open-external`: (default `Alt-F12`) open active file external
* `open-external:show-in-folder`: (defualt `Ctrl-F12`) show active file in system default file manager

In `.platform-win32 .image-view` space there are available commands:

* `open-external:edit-in-paint`: open image in paint editor

In `.tree-view` space there are available commands:

* `open-external:open-external`: (default `Alt-F12`) open active item external
* `open-external:show-in-folder`: (default `Ctrl-F12`) show active item in system default file manager

In `atom-text-editor[data-grammar~="latex"]` space there are available commands:

* `open-external:open-TeX-PDF-internal`: open `.pdf` file associated with`.tex` file
* `open-external:open-TeX-PDF-external`: open `.pdf` file associated with`.tex` file external
