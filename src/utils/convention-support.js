const path = require('path')
const os = require('os')
const co = require('co')

const util = require('./util')

const homedir = os.homedir()
const cwd = process.cwd()

const files = [
  path.resolve(cwd, '.conventional-commit-types.json'),
  path.resolve(homedir, '.conventional-commit-types.json'),
  path.resolve(__dirname, '../data/conventional-commit-types.json'),
]

const getConventionalFile = co.wrap(function* getConventionalFile() {
  for (let i = 0, len = files.length; i < len; i += 1) {
    const result = yield util.exists(files[i])

    if (result) {
      return Promise.resolve(files[i])
    }
  }

  return Promise.reject(new Error('Error: No such file.'))
})

const mapTypesToChoices = function mapTypesToChoices(types) {
  const choices = []

  if (!types) {
    throw new Error('There are no conventional commit types.')
  }

  Object.keys(types).forEach((key) => {
    choices.push({
      name: `${key} - ${types[key].description}`,
      value: key,
      short: `${key} - ${types[key].description}`,
    })
  })

  return choices
}

const mapScopesToTips = function mapScopesToTips(scopes) {
  let result = ''

  if (!scopes) {
    return result
  }

  const tips = Object.keys(scopes).join(', ')

  result = `(${tips})`

  return result
}

const conventionSupport = co.wrap(function* conventionSupport() {
  const conventionalFile = yield getConventionalFile()
  const conventional = yield util.readFile(conventionalFile, JSON.parse)

  const typeChoices = mapTypesToChoices(conventional.types)
  const scopeTips = mapScopesToTips(conventional.scopes)

  return [{
    type: 'list',
    name: 'type',
    message: 'Select the type of change that you\'re committing:',
    choices: typeChoices,
  }, {
    type: 'input',
    name: 'scope',
    message: `Denote the scope of this change ${scopeTips}:`,
  }]
})

module.exports = conventionSupport
