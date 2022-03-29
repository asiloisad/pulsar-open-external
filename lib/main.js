'use babel'

import { CompositeDisposable } from 'atom'
const { shell } = require('electron')
var fs = require("fs")
const path = require('path');

export default {

  config: {
    flag: {
      title: "Toggle state of external opener",
      description: "External opener can be turn ON/OFF depend like you want use it",
      type: 'boolean',
      default: true,
    },
    list: {
      title: "Unsupported extensions",
      description: "List of file extensions which will be open external by default, without dot and separated by comma",
      type: "array",
      default: ['doc','docx','xls','xlsx','ppt','pptx','rtf','exe','dwg','sofistik','cdb','plb'],
    },
  },

  activate() {
    this.disposables = new CompositeDisposable()

    this.disposables.add(

      atom.commands.add('atom-text-editor', {
        'open-external:open-external'  : () => this.openExternal(),
        'open-external:show-in-folder' : () => this.showInFolder(),
      }),

      atom.commands.add('.tree-view', {
        'open-external:open-external'  : () => this.treeOpenExternal(),
        'open-external:show-in-folder' : () => this.treeShowInFolder(),
      }),

      atom.commands.add('atom-text-editor[data-grammar~="latex"]', {
        'open-external:open-TeX-PDF-internal': () => this.texOpenPDF(1),
        'open-external:open-TeX-PDF-external': () => this.texOpenPDF(2),
      }),

      atom.commands.add('atom-workspace', {
        'open-external:toggle-unsupported-flag': () => {
          atom.config.set('open-external.flag', value = !atom.config.get('open-external.flag'))
          if (value) {
            atom.notifications.addInfo('External opener has been activated')
          } else {
            atom.notifications.addInfo('External opener has been deactivated')
          }
        },
      }),

      atom.config.observe('open-external.flag', (value) => {
        this.UF_flag = value
      }),

      atom.config.observe('open-external.list', (value) => {
        this.UF_list = value
      }),

      atom.workspace.addOpener( (uri) => {
        if (!this.UF_flag) {
          return
        } else if (this.UF_list.includes(path.extname(uri).substring(1))) {
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

  openExternal() {
    editor = atom.workspace.getActiveTextEditor()
    shell.openPath(editor.getPath())
  },

  treeOpenExternal() {
    selectedPaths = this.treeView.selectedPaths()
    for (let itemPath of selectedPaths) { shell.openPath(itemPath) }
  },

  showInFolder() {
    editor = atom.workspace.getActiveTextEditor()
    shell.showItemInFolder(editor.getPath())
  },

  treeShowInFolder() {
    selectedPaths = this.treeView.selectedPaths()
    for (let itemPath of selectedPaths) { shell.showItemInFolder(itemPath) }
  },

  texOpenPDF(mode) {
    editor = atom.workspace.getActiveTextEditor()
    editorPath = editor.getPath()
    if (editorPath.slice(-4)!=='.tex') {
      atom.notifications.addError(`Can not open PDF file of "${editorPath}", because it is not .tex file`)
      return
    }
    pdfPath = editorPath.slice(0, -4).concat('.pdf')
    if (!fs.existsSync(pdfPath)) {
      atom.notifications.addError(`Can not open PDF file "${pdfPath}", because it does not exists`)
      return
    } else if (mode===1) {
        atom.workspace.open(pdfPath)
    } else if (mode===2) {
        shell.openPath(pdfPath)
    }
  },

}
