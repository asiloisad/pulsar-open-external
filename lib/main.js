'use babel'

import { CompositeDisposable } from 'atom'
import { shell } from 'electron'
import path from 'path'
import fs from "fs"
import cp from "child_process"

export default {

  config: {
    flag: {
      order: 1,
      title: 'Toggle state of external opener',
      description: 'External opener can be turn ON/OFF depend like you want use it',
      type: 'boolean',
      default: true,
    },
    list: {
      order: 2,
      title: 'Unsupported extensions',
      description: 'List of file extensions which will be open external by default, without dot and separated by comma',
      type: 'array',
      default: ['doc','docx','xls','xlsx','ppt','pptx','rtf','exe','dwg','dxf','sofistik','cdb','plb'],
    },
  },

  activate() {
    this.disposables = new CompositeDisposable()
    this.disposables.add(
      atom.commands.add('atom-workspace', {
        'open-external:toggle-unsupported-flag': () => {
          atom.config.set('open-external.flag', value = !atom.config.get('open-external.flag'))
          if (value) {
            atom.notifications.addInfo('open-external has been activated')
          } else {
            atom.notifications.addInfo('open-external has been deactivated')
          }
        },
      }),
      atom.commands.add('atom-text-editor, .image-view, .pdf-viewer', {
        'open-external:open-external': () => this.editorOpenExternal(),
        'open-external:show-in-folder': () => this.editorShowInFolder(),
      }),
      atom.commands.add('.platform-win32 .image-view', {
        'open-external:edit-in-paint': () => this.editInPaint(),
      }),
      atom.commands.add('.tree-view', {
        'open-external:open-external': () => this.treeOpenExternal(),
        'open-external:show-in-folder': () => this.treeShowInFolder(),
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
          return shell.openPath(uri)
        }
      }),
    )
  },

  deactivate() {
    this.disposables.dispose()
  },

  consumeTreeView(object) {
    this.treeView = object
  },

  openExternal(itemPath) {
    shell.openPath(itemPath)
  },

  showInFolder(itemPath) {
    shell.showItemInFolder(itemPath)
  },

  editorOpenExternal() {
    let editor = atom.workspace.getActiveTextEditor()
    this.openExternal(editor.getPath())
  },

  editorShowInFolder() {
    let editor = atom.workspace.getActiveTextEditor()
    this.showInFolder(editor.getPath())
  },

  treeOpenExternal() {
    let selectedPaths = this.treeView.selectedPaths()
    for (let itemPath of selectedPaths) { this.openExternal(itemPath) }
  },

  treeShowInFolder() {
    let selectedPaths = this.treeView.selectedPaths()
    for (let itemPath of selectedPaths) { this.showInFolder(itemPath) }
  },

  texOpenPDF(mode) {
    let editor = atom.workspace.getActiveTextEditor()
    if (!editor) { return }
    let editorPath = editor.getPath()
    if (!editorPath) { return }
    if (editorPath.slice(-4)!=='.tex') {
      return atom.notifications.addError(`Can not open PDF file of "${editorPath}", because it is not .tex file`)
    }
    let pdfPath = editorPath.slice(0, -4).concat('.pdf')
    if (!fs.existsSync(pdfPath)) {
      return atom.notifications.addError(`Can not open PDF file "${pdfPath}", because it does not exists`)
    } else if (mode===1) {
      atom.workspace.open(pdfPath)
    } else if (mode===2) {
      shell.openPath(pdfPath)
    }
  },

  editInPaint() {
    let editor = atom.workspace.getActivePaneItem()
    if (!editor) { return }
    let filePath = editor.getPath()
    if (!editorPath) { return }
    cp.exec(`mspaint "${filePath}"`, () => {})
  },
}
