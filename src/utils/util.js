const fs = require('fs')
const p = require('path')

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
      if (err) return reject(err)

      if (parse === undefined) return resolve(data)

      if (typeof parse !== 'function') return reject(new Error('parameter parse is not a function.'))

      /* eslint no-shadow: ["error", { allow: ["err"] }] */
      try {
        return resolve(parse(data))
      } catch (err) {
        return reject(err)
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
exports.isGitRepo = function isGitDirectory(dir) {
  const dirname = p.resolve(dir, '.git')

  return exports.exists(dirname)
}
