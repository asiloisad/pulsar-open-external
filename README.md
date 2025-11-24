# open-external

Open file or dir in external program. Many files cannot be displayed in human readable form, and there are no Pulsar plug-ins to do this. In this case, the most convenient way to explore them is to open them in an external program.

![open-external](https://github.com/asiloisad/pulsar-open-external/raw/master/assets/nots.png)

![tree-view-external](https://github.com/asiloisad/pulsar-open-external/raw/master/assets/menu.png)

## Installation

To install `open-external` search for [open-external](https://web.pulsar-edit.dev/packages/open-external) in the Install pane of the Pulsar settings or run `ppm install open-external`. Alternatively, you can run `ppm install asiloisad/pulsar-open-external` to install a package directly from the GitHub repository.

## Usage

In `atom-workspace` space there are available commands:

- `open-external:toggle`: (default `Alt-U`) quick switch

In `atom-text-editor` and `.image-view` spaces there are available commands:

- `open-external:open`: (default `Alt-F12`) open active file in external program
- `open-external:show`: (defualt `Ctrl-F12`) show active file in system default file manager
- `open-external:atom-selected`: get selected path and open it Pulsar
- `open-external:open-selected`: get selected path and open it in external program
- `open-external:show-selected`: get selected path and show it in system default file manager

In `.platform-win32 .image-view` space there are available commands:

- `open-external:edit-in-paint`: open image in paint editor

In `.tree-view` space there are available commands:

- `open-external:open`: (default `Alt-F12`) open active item in external program
- `open-external:show`: (default `Ctrl-F12`) show active item in system default file manager

In `atom-text-editor[data-grammar~="latex"]` space there are available commands:

- `open-external:atom-TeX-PDF`: (default `F7`) open `.pdf` file associated with`.tex` file in Pulsar
- `open-external:open-TeX-PDF`: (default `F8`) open `.pdf` file associated with`.tex` file in external program
- `open-external:show-TeX-PDF`: show `.pdf` file associated with`.tex` file in system default file manager

## Service API

The `open-external` package provides a service that allows other packages to register custom handlers for opening external files. This enables packages to:

- Override the default file opening behavior for specific file types
- Implement custom file viewers or launchers
- Add logging, validation, or other pre/post-processing
- Integrate with specialized applications

### Quick Example

In your package's `package.json`:

```json
{
  "consumedServices": {
    "open-external": {
      "versions": {
        "^1.0.0": "consumeOpenExternalService"
      }
    }
  }
}
```

In your package's main file:

```javascript
module.exports = {
  consumeOpenExternalService(service) {
    // Register a custom handler
    return service.registerHandler({
      name: 'My Custom Handler',
      priority: 10,

      canHandle(filePath) {
        return filePath.endsWith('.myext')
      },

      openExternal(filePath) {
        // Your custom opening logic
        console.log('Opening', filePath)
      }
    })
  }
}
```

# Contributing

Got ideas to make this package better, found a bug, or want to help add new features? Just drop your thoughts on GitHub — any feedback’s welcome!
