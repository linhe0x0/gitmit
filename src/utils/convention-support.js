const path = require('path')
const os = require('os')

const util = require('./util')

const homedir = os.homedir()
const cwd = process.cwd()

const getConventionalFile = async function getConventionalFile() {
  const files = [
    path.resolve(cwd, '.conventional-commit-types.json'),
    path.resolve(homedir, '.conventional-commit-types.json'),
    path.resolve(__dirname, '../data/conventional-commit-types.json'),
  ]

  // eslint-disable-next-line no-restricted-syntax
  for (const item of files) {
    // eslint-disable-next-line no-await-in-loop
    const result = await util.exists(item)

    if (result) {
      return item
    }
  }

  return Promise.reject(new Error('Error: No such file.'))
}

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

const conventionSupport = async function conventionSupport() {
  const conventionalFile = await getConventionalFile()
  const conventional = await util.readFile(conventionalFile, JSON.parse)

  const typeChoices = mapTypesToChoices(conventional.types)
  const scopeTips = mapScopesToTips(conventional.scopes)

  return [
    {
      type: 'list',
      name: 'type',
      message: "Select the type of change that you're committing:",
      choices: typeChoices,
    },
    {
      type: 'input',
      name: 'scope',
      message: `Denote the scope of this change ${scopeTips}:`,
    },
  ]
}

module.exports = conventionSupport
