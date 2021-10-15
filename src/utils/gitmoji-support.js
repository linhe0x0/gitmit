const fuzzy = require('fuzzy')

const { gitmojis } = require('../data/gitmojis.json')

const mapGitmojisToChoices = function mapGitmojisToChoices(data) {
  return data.map((item) => ({
    name: `${item.emoji}  - ${item.description}`,
    value: item.code,
    short: `${item.emoji}  - ${item.description}`,
  }))
}

const searchEmoji = function searchEmoji(answers, input) {
  const choices = mapGitmojisToChoices(gitmojis)

  const keyword = input || ''

  return new Promise(function search(resolve) {
    const fuzzyResult = fuzzy.filter(keyword, choices, {
      extract: function extract(el) {
        return el.short
      },
    })

    resolve(
      fuzzyResult.map(function map(el) {
        return el.original
      })
    )
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
