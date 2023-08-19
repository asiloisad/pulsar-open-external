# open-external

<p align="center">
  <a href="https://github.com/bacadra/pulsar-open-external/tags">
  <img src="https://img.shields.io/github/v/tag/bacadra/pulsar-open-external?style=for-the-badge&label=Latest&color=blue" alt="Latest">
  </a>
  <a href="https://github.com/bacadra/pulsar-open-external/issues">
  <img src="https://img.shields.io/github/issues-raw/bacadra/pulsar-open-external?style=for-the-badge&color=blue" alt="OpenIssues">
  </a>
  <a href="https://github.com/bacadra/pulsar-open-external/blob/master/package.json">
  <img src="https://img.shields.io/github/languages/top/bacadra/pulsar-open-external?style=for-the-badge&color=blue" alt="Language">
  </a>
  <a href="https://github.com/bacadra/pulsar-open-external/blob/master/LICENSE">
  <img src="https://img.shields.io/github/license/bacadra/pulsar-open-external?style=for-the-badge&color=blue" alt="Licence">
  </a>
</p>

![open-external](https://github.com/bacadra/pulsar-open-external/raw/master/assets/open-external.png)

![tree-view-external](https://github.com/bacadra/pulsar-open-external/raw/master/assets/tree-view-external.png)

Many files cannot be displayed in human-readable form and the corresponding Pulsar editor plugins do not exist. In this case, the most convenient way of exploring it is to open it in an external program.

## Installation

To install `open-external` search for [open-external](https://web.pulsar-edit.dev/packages/open-external) in the Install pane of the Pulsar settings or run `ppm install open-external`.

Alternatively, run `ppm install bacadra/pulsar-open-external` to install a package directly from Github repository.

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

# Contributing [🍺](https://www.buymeacoffee.com/asiloisad)

If you have any ideas on how to improve the package, spot any bugs, or would like to support the development of new features, please feel free to share them via GitHub.
