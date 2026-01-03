# open-external

Open files and directories in external programs. Useful for files that cannot be viewed in Pulsar or require specialized applications.

## Features

- **External open**: Launch files with system default programs.
- **Show in folder**: Reveal files in system file manager.
- **Service**: Register custom handlers for file types.

## Installation

To install `open-external` search for [open-external](https://web.pulsar-edit.dev/packages/open-external) in the Install pane of the Pulsar settings or run `ppm install open-external`. Alternatively, you can run `ppm install asiloisad/pulsar-open-external` to install a package directly from the GitHub repository.

## Commands

Commands available in `atom-workspace`:

- `open-external:toggle`: (`Alt+U`) quick switch.

Commands available in `atom-text-editor:not([mini])`, `.image-view`, `.image-editor`, `.pdf-viewer`:

- `open-external:open`: (`Alt+F12`) open active file in external program,
- `open-external:show`: (`Ctrl+F12`) show active file in file manager.

Commands available in `.tree-view`:

- `open-external:open`: (`Alt+F12`) open selected items in external programs,
- `open-external:show`: (`Ctrl+F12`) show selected items in file manager.

## Service

The package provides a `open-external` service for other packages. This enables packages to:

- Override the default file opening behavior for specific file types
- Implement custom file viewers or launchers
- Integrate with specialized applications

### API

```javascript
service.registerHandler(handler)  // Returns Disposable
service.openExternal(filePath)    // Opens file externally
service.showInFolder(filePath)    // Shows file in file manager
```

### Handler object

```javascript
{
  priority: 10,                    // Required: higher = called first
  openExternal(filePath) { ... },  // Optional: return null to pass to next handler
  showInFolder(filePath) { ... },  // Optional: return null to pass to next handler
}
```

### Example

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
    return service.registerHandler({
      priority: 10,

      openExternal(filePath) {
        if (!filePath.endsWith('.myext')) return null;
        // Custom opening logic
        console.log('Opening', filePath);
        return true;
      }
    });
  }
}
```

## Contributing

Got ideas to make this package better, found a bug, or want to help add new features? Just drop your thoughts on GitHub — any feedback's welcome!
