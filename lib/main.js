const { CompositeDisposable, Disposable } = require("atom");
const { shell } = require("electron");
const path = require("path");
const fs = require("fs");
const cp = require("child_process");
const OpenExternalService = require("./service");

/**
 * Open External Package
 * Provides commands to open files with external applications.
 * Supports tree-view, editor, and selected text contexts.
 */
module.exports = {
  /**
   * Activates the package and registers commands for opening files externally.
   */
  activate() {
    this.disposables = new CompositeDisposable();

    // Initialize service with default handlers
    this.service = new OpenExternalService({
      openExternal: (itemPath) => shell.openPath(itemPath),
      showInFolder: (itemPath) => shell.showItemInFolder(itemPath),
    });
    this.disposables.add(
      atom.commands.add("atom-workspace", {
        "open-external:toggle": () => {
          atom.config.set(
            "open-external.flag",
            (value = !atom.config.get("open-external.flag"))
          );
          if (value) {
            atom.notifications.addInfo("open-external has been activated");
          } else {
            atom.notifications.addInfo("open-external has been deactivated");
          }
        },
      }),
      atom.commands.add("atom-text-editor:not([mini])", {
        "open-external:open": () => this.editorOpenExternal(),
        "open-external:show": () => this.editorShowInFolder(),
        "open-external:open-selected": () => this.selectedOpenExternal(),
        "open-external:show-selected": () => this.selectedShowInFolder(),
      }),
      atom.commands.add(".image-view, .image-editor, .pdf-viewer", {
        "open-external:open": () => this.editorOpenExternal(),
        "open-external:show": () => this.editorShowInFolder(),
      }),
      atom.commands.add(
        ".platform-win32 .image-view, .platform-win32 .image-editor",
        {
          "open-external:edit-in-paint": () => this.editInPaint(),
        }
      ),
      atom.commands.add(".tree-view", {
        "open-external:open": () => this.treeOpenExternal(),
        "open-external:show": () => this.treeShowInFolder(),
      }),
      atom.config.observe("open-external.flag", (value) => {
        this.flag = value;
      }),
      atom.config.observe("open-external.list", (value) => {
        this.list = value;
      }),
      atom.workspace.addOpener((uri) => {
        if (this.flag && this.list.includes(path.extname(uri).substring(1))) {
          return this.openExternal(uri);
        }
      })
    );
    this.treeView = null;
  },

  /**
   * Deactivates the package and disposes resources.
   */
  deactivate() {
    this.disposables.dispose();
  },

  // ==== Service Provider ===== //

  /**
   * Provides the open-external service API for other packages.
   * @returns {Object} Service object with open and show methods
   */
  provideOpenExternalService() {
    return {
      registerHandler: (handler) => this.service.registerHandler(handler),
      openExternal: (filePath) => this.service.openExternal(filePath),
      showInFolder: (filePath) => this.service.showInFolder(filePath),
      hasCustomHandler: (filePath) => this.service.hasCustomHandler(filePath),
      getHandlerInfo: () => this.service.getHandlerInfo(),
    };
  },

  // ==== Generic ===== //

  /**
   * Opens a file with its default external application.
   * @param {string} itemPath - The file path to open
   * @returns {Promise} Promise that resolves when opened
   */
  openExternal(itemPath) {
    // open
    return this.service.openExternal(itemPath);
  },

  /**
   * Shows a file in the system file manager.
   * @param {string} itemPath - The file path to show
   * @returns {Promise} Promise that resolves when shown
   */
  showInFolder(itemPath) {
    // show
    return this.service.showInFolder(itemPath);
  },

  // ==== Editor ===== //

  /**
   * Gets the file path of the active pane item.
   * @returns {string|undefined} The file path or undefined
   */
  getEditorPath() {
    try {
      return atom.workspace.getActivePaneItem().getPath();
    } catch (e) {
      return;
    }
  },

  /**
   * Opens the active editor's file with its external application.
   */
  editorOpenExternal() {
    let editorPath = this.getEditorPath();
    if (!editorPath) {
      return;
    }
    return this.openExternal(editorPath);
  },

  /**
   * Shows the active editor's file in the system file manager.
   */
  editorShowInFolder() {
    let editorPath = this.getEditorPath();
    if (!editorPath) {
      return;
    }
    return this.showInFolder(editorPath);
  },

  // ==== Tree ===== //

  /**
   * Consumes the tree-view service.
   * @param {Object} object - The tree-view service object
   * @returns {Disposable} Disposable to unregister the service
   */
  consumeTreeView(object) {
    this.treeView = object;
    return new Disposable(() => {
      this.treeView = null;
    });
  },

  /**
   * Opens selected tree-view items with their external applications.
   */
  treeOpenExternal() {
    if (!this.treeView) {
      return;
    }
    let selectedPaths = this.treeView.selectedPaths();
    return selectedPaths.map((itemPath) => {
      this.openExternal(itemPath);
    });
  },

  /**
   * Shows selected tree-view items in the system file manager.
   */
  treeShowInFolder() {
    if (!this.treeView) {
      return;
    }
    let selectedPaths = this.treeView.selectedPaths();
    return selectedPaths.map((itemPath) => {
      this.showInFolder(itemPath);
    });
  },

  // ==== Selected ===== //

  /**
   * Gets the file path from selected text relative to the editor's directory.
   * @returns {string|undefined} The resolved path or undefined
   */
  getSelectedPath() {
    let editor = atom.workspace.getActiveTextEditor();
    if (!editor) {
      return;
    }
    let editorPath = editor.getPath();
    if (!editorPath) {
      return;
    }
    let text = editor.getSelectedText();
    if (!text) {
      return;
    }
    return path.join(path.dirname(editorPath), text);
  },

  /**
   * Opens the file referenced by selected text with its external application.
   */
  selectedOpenExternal() {
    let filePath = this.getSelectedPath();
    if (!filePath) {
      return;
    }
    return this.openExternal(filePath);
  },

  /**
   * Shows the file referenced by selected text in the system file manager.
   */
  selectedShowInFolder() {
    let filePath = this.getSelectedPath();
    if (!filePath) {
      return;
    }
    return this.showInFolder(filePath);
  },

  // ==== Other ===== //

  /**
   * Opens the current image in Microsoft Paint (Windows only).
   */
  editInPaint() {
    let itemPath = atom.workspace.getActivePaneItem().getPath();
    let supexts = ["bmp", "jpeg", "jpg", "gif", "png", "tiff"];
    let extension = path.extname(itemPath).toLowerCase().substring(1);
    if (!supexts.includes(extension)) {
      return;
    }
    return cp.execFile("mspaint", [itemPath], () => {});
  },
};
