const fuzzy = require('fuzzy')
const { gitmojis } = require('../data/gitmojis')

const mapGitmojisToChoices = function mapGitmojisToChoices(data) {
  return data.map(item => ({
    name: `${item.emoji}  - ${item.description}`,
    value: item.code,
    short: `${item.emoji}  - ${item.description}`,
  }))
}

const searchEmoji = function searchEmoji(answers, input) {
  const choices = mapGitmojisToChoices(gitmojis)

  input = input || ''

  return new Promise(function(resolve) {
    var fuzzyResult = fuzzy.filter(input, choices, {
      extract: function(el) {
        return el.short
      }
    })

    resolve(fuzzyResult.map(function(el) {
      return el.original
    }))
  })
}

const gitmojiSupport = function gmojiSupport() {
  return {
    type: 'autocomplete',
    name: 'gitmoji',
    message: 'Choose a gitmoji:',
    source: searchEmoji,
  }
}

module.exports = gitmojiSupport
