const { CompositeDisposable, Disposable } = require("atom");
const { shell } = require("electron");
const path = require("path");

module.exports = {

  activate() {
    this.customHandlers = [];
    this.disposables = new CompositeDisposable(
      atom.commands.add("atom-workspace", {
        "open-external:toggle": () =>
          this.toggleWatcher(),
      }),
      atom.commands.add("atom-text-editor:not([mini]), .image-view, .image-editor, .pdf-viewer", {
        "open-external:open": () =>
          this.itemOpenExternal(),
        "open-external:show": () =>
          this.itemShowInFolder(),
      }),
      atom.commands.add(".tree-view", {
        "open-external:open": () =>
          this.treeOpenExternal(),
        "open-external:show": () =>
          this.treeShowInFolder(),
      }),
      atom.config.observe("open-external.flag", (value) => {
        this.flag = value;
      }),
      atom.config.observe("open-external.list", (value) => {
        this.list = value;
      }),
      atom.workspace.addOpener((uri) => {
        if (this.flag && this.list.includes(
          path.extname(uri).substring(1))
        ) {
          return this.openExternal(uri);
        }
      })
    );
    this.treeView = null;
  },

  deactivate() {
    this.disposables.dispose();
  },

  toggleWatcher() {
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

  provideOpenExternalService() {
    return {
      registerHandler: (handler) =>
        this.registerHandler(handler),
      openExternal: (filePath) =>
        this.openExternal(filePath),
      showInFolder: (filePath) =>
        this.showInFolder(filePath),
    };
  },

  /**
   * @param {Object} handler - { openExternal?(path), showInFolder?(path), priority }
   * Return null/undefined from methods to pass to next handler.
   * @returns {Disposable}
   */
  registerHandler(handler) {
    if (!handler || typeof handler.priority !== "number") {
      throw new Error(
        "Handler must have openExternal() or showInFolder() and priority"
      );
    }

    let inserted = false;
    for (let i = 0; i < this.customHandlers.length; i++) {
      if (handler.priority > this.customHandlers[i].priority) {
        this.customHandlers.splice(i, 0, handler);
        inserted = true;
        break;
      }
    }
    if (!inserted) {
      this.customHandlers.push(handler);
    }

    return new Disposable(() => {
      const index = this.customHandlers.indexOf(handler);
      if (index >= 0) {
        this.customHandlers.splice(index, 1);
      }
    });
  },

  async openExternal(filePath) {
    for (const handler of this.customHandlers) {
      if (!handler.openExternal) continue;
      try {
        const result = await handler.openExternal(filePath);
        if (result != null) return '';
      } catch (error) {
        console.error("Error in custom handler openExternal:", error);
      }
    }
    return shell.openPath(filePath);
  },

  async showInFolder(filePath) {
    for (const handler of this.customHandlers) {
      if (!handler.showInFolder) continue;
      try {
        const result = await handler.showInFolder(filePath);
        if (result != null) return '';
      } catch (error) {
        console.error("Error in custom handler showInFolder:", error);
      }
    }
    return shell.showItemInFolder(filePath);
  },

  getItemPath() {
    try {
      return atom.workspace.getActivePaneItem().getPath();
    } catch (e) {
      return;
    }
  },

  itemOpenExternal() {
    let itemPath = this.getItemPath();
    if (itemPath) {
      return this.openExternal(itemPath);
    }
  },

  itemShowInFolder() {
    let itemPath = this.getItemPath();
    if (itemPath) {
      return this.showInFolder(itemPath);
    }
  },

  consumeTreeView(object) {
    this.treeView = object;
    return new Disposable(() => {
      this.treeView = null;
    });
  },

  treeOpenExternal() {
    if (!this.treeView) {
      return;
    }
    let selectedPaths = this.treeView.selectedPaths();
    return selectedPaths.map((itemPath) => {
      this.openExternal(itemPath);
    });
  },

  treeShowInFolder() {
    if (!this.treeView) {
      return;
    }
    let selectedPaths = this.treeView.selectedPaths();
    return selectedPaths.map((itemPath) => {
      this.showInFolder(itemPath);
    });
  },
};
