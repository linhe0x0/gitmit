const fs = require('fs')
const co = require('co')
const inquirer = require('inquirer')
const chalk = require('chalk')
const execa = require('execa')
const gitmojiSupport = require('../utils/gitmoji-support')
const conventionSupport = require('../utils/convention-support')
const util = require('../utils/util')

const TEST_ENV = (process.env.NODE_ENV === 'testing')

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
    message: 'Signed commit (yes):',
    default: 'yes',
  },
  {
    type: 'confirm',
    name: 'confirm',
    message: 'Is this ok? (yes):',
    default: 'yes',
  },
]

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
  const title = `${type}${gitmoji}${options.title}`
  const reference = options.reference ? `(#${options.reference})` : ''
  const body = `${options.body} ${reference}`

  return {
    title,
    body: body.trim(),
  }
}

/**
 * exec git command with specified options.
 *
 * @param  {Object} options
 * @return {Promise}
 */
const gitCommit = function gitCommit(options) {
  const { title, body } = formatCommitMessage(options)

  let shell = 'git commit '

  if (options.signed) {
    shell += `-s -m "${title}" -m "${body}"`
  } else {
    shell += `-m "${title}" -m "${body}"`
  }

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
  }).then((answers) => {
    if (!answers.confirm) return Promise.reject('Aborting commit.')

    if (options.byHook) {
      const COMMIT_EDITMSG = options.args[options.args.length - 1]
      return gitHook(answers, COMMIT_EDITMSG)
    }

    return gitCommit(answers)
  }).then((result) => {
    // Variable result will have value when exec git command.
    if (result) {
      console.log()
      console.log(chalk.green(result.stdout))
    }
  }, (err) => {
    console.log(chalk.red(err.stdout || err))
  })
  .catch(console.error)
}

module.exports = main