const { Disposable } = require('atom')

/**
 * Service that manages external file opening handlers.
 * Allows other packages to register custom handlers that can override default behavior.
 */
class OpenExternalService {
  constructor(defaultHandler) {
    this.defaultHandler = defaultHandler
    this.customHandlers = []
  }

  /**
   * Register a custom handler that can take over opening external files.
   * Handlers are called in reverse registration order (last registered = first called).
   * 
   * @param {Object} handler - Handler object with methods
   * @param {Function} handler.canHandle - Function(filePath) => boolean - whether this handler can process the file
   * @param {Function} handler.openExternal - Function(filePath) => Promise/void - open file externally
   * @param {Function} [handler.showInFolder] - Function(filePath) => Promise/void - show file in folder (optional)
   * @param {Number} [handler.priority] - Priority level (higher = called first), default: 0
   * @returns {Disposable} - Dispose to unregister the handler
   */
  registerHandler(handler) {
    if (!handler || typeof handler.canHandle !== 'function' || typeof handler.openExternal !== 'function') {
      throw new Error('Handler must have canHandle() and openExternal() methods')
    }

    const handlerEntry = {
      handler,
      priority: handler.priority || 0
    }

    // Insert handler in priority order (higher priority first)
    let inserted = false
    for (let i = 0; i < this.customHandlers.length; i++) {
      if (handlerEntry.priority > this.customHandlers[i].priority) {
        this.customHandlers.splice(i, 0, handlerEntry)
        inserted = true
        break
      }
    }
    if (!inserted) {
      this.customHandlers.push(handlerEntry)
    }

    return new Disposable(() => {
      const index = this.customHandlers.indexOf(handlerEntry)
      if (index >= 0) {
        this.customHandlers.splice(index, 1)
      }
    })
  }

  /**
   * Open a file using a registered handler or the default handler.
   * 
   * @param {String} filePath - Path to the file to open
   * @returns {Promise|*} - Result from the handler
   */
  async openExternal(filePath) {
    // Try custom handlers first (in priority order)
    for (const { handler } of this.customHandlers) {
      try {
        if (handler.canHandle(filePath)) {
          return await handler.openExternal(filePath)
        }
      } catch (error) {
        console.error('Error in custom handler canHandle/openExternal:', error)
      }
    }

    // Fall back to default handler
    return this.defaultHandler.openExternal(filePath)
  }

  /**
   * Show a file in its containing folder using a registered handler or the default handler.
   * 
   * @param {String} filePath - Path to the file to show
   * @returns {Promise|*} - Result from the handler
   */
  async showInFolder(filePath) {
    // Try custom handlers first (in priority order)
    for (const { handler } of this.customHandlers) {
      try {
        if (handler.canHandle(filePath) && handler.showInFolder) {
          return await handler.showInFolder(filePath)
        }
      } catch (error) {
        console.error('Error in custom handler showInFolder:', error)
      }
    }

    // Fall back to default handler
    return this.defaultHandler.showInFolder(filePath)
  }

  /**
   * Check if a custom handler can handle a specific file.
   * 
   * @param {String} filePath - Path to check
   * @returns {Boolean} - True if a custom handler can handle this file
   */
  hasCustomHandler(filePath) {
    return this.customHandlers.some(({ handler }) => {
      try {
        return handler.canHandle(filePath)
      } catch (error) {
        console.error('Error in custom handler canHandle:', error)
        return false
      }
    })
  }

  /**
   * Get information about registered handlers.
   * 
   * @returns {Array} - Array of handler info objects
   */
  getHandlerInfo() {
    return this.customHandlers.map(({ handler, priority }) => ({
      priority,
      hasShowInFolder: typeof handler.showInFolder === 'function',
      name: handler.name || 'Unnamed handler'
    }))
  }

  /**
   * Clear all custom handlers.
   */
  clearHandlers() {
    this.customHandlers = []
  }
}

module.exports = OpenExternalService
