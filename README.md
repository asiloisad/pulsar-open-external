# open-external

![Tag](https://img.shields.io/github/v/tag/bacadra/atom-open-external?style=for-the-badge)
![LastCommit](https://img.shields.io/github/last-commit/bacadra/atom-open-external?style=for-the-badge)
![RepoSize](https://img.shields.io/github/repo-size/bacadra/atom-open-external?style=for-the-badge)
![Licence](https://img.shields.io/github/license/bacadra/atom-open-external?style=for-the-badge)

![open-external](https://github.com/bacadra/atom-open-external/raw/master/assets/open-external.png)

![tree-view-external](https://github.com/bacadra/atom-open-external/raw/master/assets/tree-view-external.png)

Many files cannot be displayed in human-readable form and the corresponding Atom editor plugins do not exist. In this case, the most convenient way of exploring it is to open it in an external program.

## Installation

### Atom Text Editor

The official Atom packages store has been disabled. To get latest version run the shell command

    apm install bacadra/atom-open-external

and obtain the package directly from Github repository.

### Pulsar Text Editor

The package has compability with [Pulsar](https://pulsar-edit.dev/) and can be install

    pulsar -p install bacadra/atom-open-external

or directly [open-external](https://web.pulsar-edit.dev/packages/open-external) from Pulsar package store.

## Usage

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

# Contributing

If you have ideas on how to improve the package, see bugs or want to support new features - feel free to share it via GitHub.

See my other packages for Atom & Pulsar Text Editors:

* [autocomplete-sofistik](https://github.com/bacadra/atom-autocomplete-sofistik)
* [bib-finder](https://github.com/bacadra/atom-bib-finder)
* [hydrogen-run](https://github.com/bacadra/atom-hydrogen-run)
* [image-paste](https://github.com/bacadra/atom-image-paste)
* [language-sofistik](https://github.com/bacadra/atom-language-sofistik)
* [linter-ruff](https://github.com/bacadra/atom-linter-ruff)
* [navigation-panel](https://github.com/bacadra/atom-navigation-panel)
* [open-external](https://github.com/bacadra/atom-open-external)
* [pdf-viewer](https://github.com/bacadra/atom-pdf-viewer)
* [project-files](https://github.com/bacadra/atom-project-files)
* [regex-aligner](https://github.com/bacadra/atom-regex-aligner)
* [sofistik-tools](https://github.com/bacadra/atom-sofistik-tools)
* [super-select](https://github.com/bacadra/atom-super-select)
* [word-map](https://github.com/bacadra/atom-word-map)
