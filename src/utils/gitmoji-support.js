const { gitmojis } = require('../data/gitmojis')

const mapGitmojisToChoices = function mapGitmojisToChoices(data) {
  return data.map(item => ({
    name: `${item.emoji}  - ${item.description}`,
    value: item.code,
    short: `${item.emoji}  - ${item.description}`,
  }))
}

const gitmojiSupport = function gmojiSupport() {
  const choices = mapGitmojisToChoices(gitmojis)

  return {
    type: 'list',
    name: 'gitmoji',
    message: 'Choose a gitmoji:',
    choices,
  }
}

module.exports = gitmojiSupport
