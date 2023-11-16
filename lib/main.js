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
      atom.commands.add('atom-text-editor, .image-view, .pdf-viewer', {
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
        'open-external:open-TeX-PDF-internal': () => this.texOpenPDF(1),
        'open-external:open-TeX-PDF-external': () => this.texOpenPDF(2),
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

  consumeTreeView(object) {
    this.treeView = object
    return new Disposable(() => { this.treeView = null })
  },

  getEditorPath() {
    try { return atom.workspace.getActiveTextEditor().getPath() } catch (e) { return }
  },

  openExternal(itemPath) {
    return shell.openPath(itemPath)
  },

  showInFolder(itemPath) {
    return shell.showItemInFolder(itemPath)
  },

  editorOpenExternal() {
    let editorPath = this.getEditorPath() ; if (!editorPath) { return }
    return this.openExternal(editorPath)
  },

  editorShowInFolder() {
    let editorPath = this.getEditorPath() ; if (!editorPath) { return }
    return this.showInFolder(editorPath)
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

  texOpenPDF(mode) {
    let editorPath = this.getEditorPath() ; if (!editorPath) { return }
    if (editorPath.slice(-4)!=='.tex') {
      atom.notifications.addError(`Cannot open PDF file of "${editorPath}", because it is not .tex file`)
      return
    }
    let pdfPath = editorPath.slice(0, -4).concat('.pdf')
    if (!fs.existsSync(pdfPath)) {
      atom.notifications.addError(`Cannot open PDF file "${pdfPath}", because it does not exists`)
      return
    } else if (mode===1) {
      return atom.workspace.open(pdfPath)
    } else if (mode===2) {
      return shell.openPath(pdfPath)
    }
  },

  editInPaint() {
    let editorPath = this.getEditorPath() ; if (!editorPath) { return }
    return cp.exec(`mspaint "${editorPath}"`, () => {})
  },
}
