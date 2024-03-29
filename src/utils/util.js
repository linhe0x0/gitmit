const fs = require('fs')
const childProcess = require('child_process')
const chalk = require('chalk')

/**
 * Verify whether the specified file exists.
 *
 * @param  {String} path
 * @return {Promise}
 */
exports.exists = function exists(path) {
  return new Promise((resolve) => {
    fs.access(path, fs.constants.R_OK, (err) => {
      if (err) {
        resolve(false)
      } else {
        resolve(true)
      }
    })
  })
}

/**
 * promise-based fs.readFile.
 *
 * @param  {String} path
 * @param  {Function=} parse
 * @return {Promise}
 */
exports.readFile = function readFile(path, parse) {
  return new Promise((resolve, reject) => {
    fs.readFile(path, { encoding: 'utf8' }, (err, data) => {
      if (err) {
        reject(err)
        return
      }

      if (parse === undefined) {
        resolve(data)
        return
      }

      if (typeof parse !== 'function') {
        reject(new Error('parameter parse is not a function.'))
        return
      }

      /* eslint no-shadow: ["error", { allow: ["err"] }] */
      try {
        const result = parse(data)
        resolve(result)
      } catch (err) {
        reject(err)
      }
    })
  })
}

/**
 * promise-based fs.writeFile
 *
 * @param  {String} path
 * @param  {String} cont
 * @param  {Object=} options
 * @return {Promise}
 */
exports.writeFile = function writeFile(path, cont, options = {}) {
  return new Promise((resolve, reject) => {
    fs.writeFile(path, cont, options, (err) => {
      if (err) return reject(err)

      return resolve(path)
    })
  })
}

/**
 * check whether the hook exists
 *
 * @param  {String} hook file path
 * @return {Boolean}
 */
exports.checkIfHookExists = function checkHook(hook) {
  return exports.readFile(hook).then((data) => {
    const regexp = /gitmit/g

    if (regexp.test(data)) {
      return true
    }

    return false
  })
}

/**
 * get git commit hook file path.
 *
 * @return {String}
 */
exports.getHookFilePath = function getHookFilePath() {
  const hookFile = 'prepare-commit-msg'
  const cwd = process.cwd()
  const hookFilePath = `${cwd}/.git/hooks/${hookFile}`

  return hookFilePath
}

/**
 * Check whether the specified directory is a Git repository.
 *
 * @param  {String}  dir
 * @return {Promise}
 */
exports.isGitRepo = function isGitDirectory(cwd) {
  return new Promise((resolve, reject) => {
    childProcess.exec(
      'git rev-parse --is-inside-work-tree',
      {
        cwd,
      },
      (err, stdout, stderr) => {
        if (err) {
          if (err.message.indexOf('not a git repository') !== -1) {
            resolve(false)
            return
          }

          reject(err)
          return
        }

        if (stderr) {
          reject(new Error(stderr))
          return
        }

        resolve(stdout.indexOf(true) !== -1)
      }
    )
  })
}

exports.print = function print(message, type = 'defaults') {
  const TEST_ENV = process.env.NODE_ENV === 'testing'

  const types = {
    defaults: 'gray',
    primary: 'blue',
    success: 'green',
    warning: 'yellow',
    error: 'red',
  }

  /* eslint no-console: ["error", { allow: ["log"] }] */
  console.log()
  return TEST_ENV ? message : console.log(chalk[types[type]](message))
}

/**
 * escape quotation marks
 * @param  {String} str source string
 * @return {String}     result
 */
exports.escapeQuotation = function escapeQuotation(str) {
  return str.replace(/"/g, '\\"')
}
