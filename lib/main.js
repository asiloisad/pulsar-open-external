'use babel'

import { CompositeDisposable, Disposable } from 'atom'
import { shell } from 'electron'
import path from 'path'
import fs from "fs"
import cp from "child_process"

export default {

  config: {
    flag: {
      order: 1,
      title: 'Toggle state of external opener',
      description: 'Files with the extensions listed open in an external program',
      type: 'boolean',
      default: true,
    },
    list: {
      order: 2,
      title: 'Unsupported extensions',
      description: 'List of file extensions to open externally',
      type: 'array',
      default: ['doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'rtf', 'exe', 'dwg', 'dxf', 'sofistik', 'cdb', 'plb'],
    },
  },

  activate() {
    this.disposables = new CompositeDisposable()
    this.disposables.add(
      atom.commands.add('atom-workspace', {
        'open-external:toggle': () => {
          atom.config.set('open-external.flag', value = !atom.config.get('open-external.flag'))
          if (value) {
            atom.notifications.addInfo('open-external has been activated')
          } else {
            atom.notifications.addInfo('open-external has been deactivated')
          }
        },
      }),
      atom.commands.add('atom-text-editor:not([mini])', {
        'open-external:open': () => this.editorOpenExternal(),
        'open-external:show': () => this.editorShowInFolder(),
        'open-external:atom-selected': () => this.selectedOpenInteral(),
        'open-external:open-selected': () => this.selectedOpenExternal(),
        'open-external:show-selected': () => this.selectedShowInFolder(),
      }),
      atom.commands.add('.image-view, .pdf-viewer', {
        'open-external:open': () => this.editorOpenExternal(),
        'open-external:show': () => this.editorShowInFolder(),
      }),
      atom.commands.add('.platform-win32 .image-view', {
        'open-external:edit-in-paint': () => this.editInPaint(),
      }),
      atom.commands.add('.tree-view', {
        'open-external:open': () => this.treeOpenExternal(),
        'open-external:show': () => this.treeShowInFolder(),
      }),
      atom.commands.add('atom-text-editor[data-grammar~="latex"]', {
        'open-external:atom-TeX-PDF': () => this.texOpenInteral(),
        'open-external:open-TeX-PDF': () => this.texOpenExternal(),
        'open-external:show-TeX-PDF': () => this.texShowInFolder(),
      }),
      atom.config.observe('open-external.flag', (value) => {
        this.flag = value
      }),
      atom.config.observe('open-external.list', (value) => {
        this.list = value
      }),
      atom.workspace.addOpener((uri) => {
        if (this.flag && this.list.includes(path.extname(uri).substring(1))) {
          return this.openExternal(uri)
        }
      }),
    )
    this.treeView = null
  },

  deactivate() {
    this.disposables.dispose()
  },

  // ==== Generic ===== //

  openInternal(itemPath) { // atom
    return atom.workspace.open(itemPath)
  },

  openExternal(itemPath) { // open
    return shell.openPath(itemPath)
  },

  showInFolder(itemPath) { // show
    return shell.showItemInFolder(itemPath)
  },

  // ==== Editor ===== //

  getEditorPath() {
    try { return atom.workspace.getActiveTextEditor().getPath() } catch (e) { return }
  },

  editorOpenExternal() {
    let editorPath = this.getEditorPath() ; if (!editorPath) { return }
    return this.openExternal(editorPath)
  },

  editorShowInFolder() {
    let editorPath = this.getEditorPath() ; if (!editorPath) { return }
    return this.showInFolder(editorPath)
  },

  // ==== Tree ===== //

  consumeTreeView(object) {
    this.treeView = object
    return new Disposable(() => { this.treeView = null })
  },

  treeOpenExternal() {
    if (!this.treeView) { return }
    let selectedPaths = this.treeView.selectedPaths()
    return selectedPaths.map((itemPath) => { this.openExternal(itemPath) })
  },

  treeShowInFolder() {
    if (!this.treeView) { return }
    let selectedPaths = this.treeView.selectedPaths()
    return selectedPaths.map((itemPath) => { this.showInFolder(itemPath) })
  },

  // ==== Selected ===== //

  getSelectedPath() {
    let editor = atom.workspace.getActiveTextEditor()
    if (!editor) { return }
    let editorPath = editor.getPath()
    if (!editorPath) { return }
    let text = editor.getSelectedText()
    if (!text) { return }
    return path.join(path.dirname(editorPath), text)
  },

  selectedOpenInteral() {
    let filePath = this.getSelectedPath() ; if (!filePath) { return }
    return this.openInternal(filePath)
  },

  selectedOpenExternal() {
    let filePath = this.getSelectedPath() ; if (!filePath) { return }
    return this.openExternal(filePath)
  },

  selectedShowInFolder() {
    let filePath = this.getSelectedPath() ; if (!filePath) { return }
    return this.showInFolder(filePath)
  },

  // ==== TeX PDF ===== //

  getTexPath() {
    let editorPath = this.getEditorPath() ; if (!editorPath) { return }
    if (editorPath.slice(-4)!=='.tex') {
      return atom.notifications.addError(`Cannot open PDF file of "${editorPath}", because it is not .tex file`)
    }
    let pdfPath = editorPath.slice(0, -4).concat('.pdf')
    if (!fs.existsSync(pdfPath)) {
      return atom.notifications.addError(`Cannot open PDF file "${pdfPath}", because it does not exists`)
    }
    return pdfPath
  },

  texOpenInteral() {
    let filePath = this.getTexPath() ; if (!filePath) { return }
    return this.openInternal(filePath)
  },

  texOpenExternal() {
    let filePath = this.getTexPath() ; if (!filePath) { return }
    return this.openExternal(filePath)
  },

  texShowInFolder() {
    let filePath = this.getTexPath() ; if (!filePath) { return }
    return this.showInFolder(filePath)
  },

  // ==== Other ===== //

  editInPaint() {
    let itemPath = atom.workspace.getActivePaneItem().getPath()
    let supexts = ['bmp', 'jpeg', 'jpg', 'gif', 'png', 'tiff']
    let extension = path.extname(itemPath).toLowerCase().substring(1)
    if (!supexts.includes(extension)) { return }
    return cp.exec(`mspaint "${itemPath}"`, () => {})
  },
}
