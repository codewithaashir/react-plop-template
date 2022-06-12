/* eslint-disable prettier/prettier */
const fs = require('fs')
const path = require('path')
const { directoryPath, extensions, projects, httpVerbs, seperateFolderList } = require('./package-constants')
const getConfig = async () => {
  let data = await fs.readFileSync(directoryPath,
    'utf-8',
  )
  data = data && JSON.parse(data.toString())
  return data
}
const saveConfig = async (data) => {
  ensureDirectoryExistence(directoryPath);
  data = JSON.stringify(data, null, 2)
  await fs.writeFileSync(directoryPath, data)
}

const ensureDirectoryExistence = (filePath) => {
  let dirname = path.dirname(filePath);
  if (fs.existsSync(dirname)) {
    return true;
  }
  ensureDirectoryExistence(dirname);
  fs.mkdirSync(dirname);
} 
module.exports = {
  defaultServiceType: 1,
  defaultExtension: 'jsx',
  defaultFramework: 'react',
  frameworks: projects,
  defaultTestSeperate: false,
  getConfig,
  availableTypes: () => {
    return httpVerbs
  },
  availableseperateFolderList: () => {
    return seperateFolderList
  },
  availableExtensions: (option) => {
    return option && option.includes('*')
      ? extensions
      : ['js', 'ts']
  },
  helpers: (plop) => {
    plop.setHelper('switch', function (value, options) {
      this.switch_value = value
      this.switch_break = false
      return options.fn(this)
    })
    plop.setHelper('upperCase', function (text) {
      return text.toUpperCase()
    })
    plop.setHelper('lowerCase', function (text) {
      return text.toLowerCase()
    })
    plop.setHelper('extensionSplit', function (text) {
      return text.includes('x') ? text.split('x')[0] : text
    })
    plop.setHelper('case', function (value, options) {
      if (value === this.switch_value) {
        this.switch_break = true
        return options.fn(this)
      }
    })
    plop.setHelper('default', function (value, options) {
      if (this.switch_break === false) {
        return value
      }
    })
    plop.setActionType('framework/library', function (answers, config, plop) {
      // do something
      this.defaultFramework = answers['framework/library']
      saveConfig({ project: this.defaultFramework })
      return `added successfully`
    })

    plop.setActionType('extension', async function (answers, config, plop) {
      // do something
      this.defaultExtension = answers['extension']
      let data = await getConfig()
      saveConfig({ ...data, extension: this.defaultExtension })
      return `added successfully`
    })

    plop.setActionType('isTestSeperate', async function (answers, config, plop) {
      // do something
      this.defaultTestSeperate = answers['isTestSeperate']
      let data = await getConfig()
      saveConfig({ ...data, isTestSeperate: this.defaultTestSeperate })
      return `added successfully`
    }) 

    return
  },
}
