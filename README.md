# open-external

Open files and directories in external programs. Useful for files that cannot be viewed in Pulsar or require specialized applications.

![open-external](https://github.com/asiloisad/pulsar-open-external/raw/master/assets/nots.png)

![tree-view-external](https://github.com/asiloisad/pulsar-open-external/raw/master/assets/menu.png)

## Features

- **External open**: Launch files with system default programs.
- **Show in folder**: Reveal files in system file manager.
- **Selected path**: Open or reveal paths from text selection.
- **Service**: Register custom handlers for file types.

## Installation

To install `open-external` search for [open-external](https://web.pulsar-edit.dev/packages/open-external) in the Install pane of the Pulsar settings or run `ppm install open-external`. Alternatively, you can run `ppm install asiloisad/pulsar-open-external` to install a package directly from the GitHub repository.

## Commands

Commands available in `atom-workspace`:

- `open-external:toggle`: (`Alt+U`) quick switch.

Commands available in `atom-text-editor:not([mini])`:

- `open-external:open`: (`Alt+F12`) open active file in external program,
- `open-external:show`: (`Ctrl+F12`) show active file in system default file manager,
- `open-external:open-selected`: get selected path and open it in external program,
- `open-external:show-selected`: get selected path and show it in system default file manager.

Commands available in `.image-view`, `.image-editor`, `.pdf-viewer`:

- `open-external:open`: (`Alt+F12`) open active file in external program,
- `open-external:show`: (`Ctrl+F12`) show active file in system default file manager.

Commands available in `.tree-view`:

- `open-external:open`: (`Alt+F12`) open active item in external program,
- `open-external:show`: (`Ctrl+F12`) show active item in system default file manager.

## Service

The package provides a `open-external` service for other packages. This enables packages to:

- Override the default file opening behavior for specific file types
- Implement custom file viewers or launchers
- Add logging, validation, or other pre/post-processing
- Integrate with specialized applications

### Quick example

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

## Contributing

Got ideas to make this package better, found a bug, or want to help add new features? Just drop your thoughts on GitHub — any feedback's welcome!
