const util = require('../utils/util')

/**
 * Get git commit hook file path.
 */
const hookFilePath = util.getHookFilePath()

/**
 * Add gitmit to git commit hook.
 *
 * @param  {Object} options options of command.
 */
const init = function init(options) {
  const withEmoji = options.parent.withEmoji ? '-e' : ''
  const withConvention = options.parent.withConvention ? '-c' : ''

  // The content that need to be added to the file "prepare-commit-msg".
  const hookFileContent = [
    '',
    '#!/bin/sh',
    '# <gitmit-hook>',
    '# gitmit as a commit hook',
    'exec < /dev/tty',
    `gitmit ${withEmoji} ${withConvention} --by-hook $1`,
    '# </gitmit-hook>',
  ].join('\n')

  // check if the file exists.
  util
    .exists(hookFilePath)
    .then((result) => {
      if (result) {
        // check if gitmit hook exists when file "prepare-commit-msg" is existent.
        return util.checkIfHookExists(hookFilePath)
      }

      return false
    })
    .then((exist) => {
      if (exist) {
        throw new Error('gitmit hook is existent.')
      }

      // Add gitmit hook to file "prepare-commit-msg"
      return util.writeFile(hookFilePath, hookFileContent, {
        mode: 0o775,
        flag: 'a+',
      })
    })
    .then(() => {
      util.print('gitmit commit hook created succesfully.', 'success')
    })
    .catch((err) => {
      util.print(err, 'error')
    })
}

/**
 * Remove gitmit to git commit hook.
 */
const remove = function remove() {
  util
    .readFile(hookFilePath)
    .then((data) => {
      const regexp = /#\s<gitmit-hook>(?:.*\n)*#\s<\/gitmit-hook>/g

      const cont = data.replace(regexp, '')

      return util.writeFile(hookFilePath, cont)
    })
    .then(() => {
      util.print('Remove gitmit hook succesfully.', 'success')
    })
    .catch((err) => {
      util.print(err, 'error')
    })
}

/**
 * sub-command `hook`
 *
 * @param {Object} options options of command.
 */
const hook = function hook(options) {
  if (options.init) {
    // Add gitmit to git commit hook.
    init(options)
  } else if (options.remove) {
    // Remove gitmit from git commit hook.
    remove()
  } else {
    util.print('You need to run this command with --init or --remove.', 'error')
  }
}

module.exports = hook
