const fs = require('fs')
const co = require('co')
const inquirer = require('inquirer')
const inquirerAutocompletePrompt = require('inquirer-autocomplete-prompt')
const chalk = require('chalk')
const execa = require('execa')
const wrap = require('word-wrap')
const gitmojiSupport = require('../utils/gitmoji-support')
const conventionSupport = require('../utils/convention-support')
const util = require('../utils/util')

const TEST_ENV = process.env.NODE_ENV === 'testing'

const questions = [
  {
    type: 'input',
    name: 'title',
    message: 'Write a short, imperative tense description of the change:',
    validate(input) {
      if (!input) {
        return chalk.red('Commit title is required.')
      }

      return true
    },
  },
  {
    type: 'input',
    name: 'body',
    message: 'Provide a longer description of the change:',
  },
  {
    type: 'input',
    name: 'reference',
    message: 'List any issues or PRs closed by this change: #',
    validate(input) {
      if (input === '') {
        return true
      }

      if (parseInt(input, 10) === parseFloat(input)) {
        return true
      }

      return chalk.red('Enter the number of the issue without the #. Eg: 12')
    },
  },
  {
    type: 'confirm',
    name: 'signed',
    message: 'Signed commit with GPG (yes):',
    default: 'yes',
  },
  {
    type: 'confirm',
    name: 'confirm',
    message: 'Is this ok? (yes):',
    default: 'yes',
  },
]

inquirer.registerPrompt('autocomplete', inquirerAutocompletePrompt)

/**
 * Format commit message with specified options.
 *
 * @param  {Object} options
 * @return {Object}
 */
const formatCommitMessage = function formatCommitMessage(options) {
  const scope = options.scope ? `(${options.scope})` : ''
  const type = options.type ? `${options.type}${scope}: ` : ''
  const gitmoji = options.gitmoji ? `${options.gitmoji} ` : ''
  const title = `${gitmoji}${type}${options.title}`
  const reference = options.reference ? `Close #${options.reference}` : ''
  const message = wrap(options.body, { width: 72, trim: true, indent: '' })

  let body = ''

  if (message) {
    body = reference ? `${message}\n\n${reference}` : message
  } else {
    body = reference
  }

  return {
    title,
    body,
  }
}

/**
 * exec git command with specified options.
 *
 * @param  {Object} options
 * @return {Promise}
 */
const gitCommit = function gitCommit(options) {
  let { title, body } = formatCommitMessage(options)

  title = util.escapeQuotation(title)
  body = util.escapeQuotation(body)

  let shell = 'git commit '

  if (options.signed) {
    shell += `-s -S -m "${title}" -m "${body}"`
  } else {
    shell += `-m "${title}" -m "${body}"`
  }

  shell = shell.replace(/`/g, '\\`')

  // test environment
  if (TEST_ENV) return shell

  return execa.shell(shell)
}

/**
 * Add content to file "COMMIT_EDITMSG" in git hook mode.
 *
 * @param  {Object} options
 * @param  {String} COMMIT_EDITMSG file path
 */
const gitHook = function gitHook(options, COMMIT_EDITMSG) {
  const { title, body } = formatCommitMessage(options)
  const content = `${title}\n\n${body}\n`

  return new Promise((resolve, reject) => {
    fs.readFile(COMMIT_EDITMSG, (err, data) => {
      if (err) return reject(err)

      const cont = content + data

      /* eslint no-shadow: ["error", { allow: ["err"] }] */
      return fs.writeFile(COMMIT_EDITMSG, cont, (err) => {
        if (err) return reject(err)

        return resolve()
      })
    })
  })
}

/**
 * main function.
 *
 * @param  {Object} options
 */
const main = function main(options) {
  co(function* fn() {
    const cwd = process.cwd()
    const isGitRepo = yield util.isGitRepo(cwd)

    if (!isGitRepo) {
      return Promise.reject(
        new Error(
          `This operation must be run in a work tree.\nCurrent working directory "${cwd}" is outside of the work tree of the repository.`
        )
      )
    }

    if (!options.byHook) {
      // without parameter `--by-hook`
      // check if hook exists.
      const hookFilePath = util.getHookFilePath()
      const hookFileStatus = yield util.exists(hookFilePath)

      if (hookFileStatus) {
        const result = yield util.checkIfHookExists(hookFilePath)

        if (result) {
          throw new Error('gitmit hook is existent. you can run "git commit"')
        }
      }
    }

    if (options.withEmoji) {
      const gitmojiQuestion = gitmojiSupport()

      questions.unshift(gitmojiQuestion)
    }

    if (options.withConvention) {
      const conventionQuestions = yield conventionSupport()

      questions.unshift(...conventionQuestions)
    }

    return yield inquirer.prompt(questions)
  })
    .then((answers) => {
      if (!answers.confirm) return Promise.reject(new Error('Aborting commit.'))

      if (options.byHook) {
        const COMMIT_EDITMSG = options.args[options.args.length - 1]
        return gitHook(answers, COMMIT_EDITMSG)
      }

      return gitCommit(answers)
    })
    .then((result) => {
      // Variable result will have value when exec git command.
      if (result) {
        util.print(result.stdout, 'success')
      }
    })
    .catch((err) => {
      util.print(err.message, 'error')
    })
}

module.exports = main
