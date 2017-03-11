const chalk = require('chalk')
const { gitmojis } = require('../data/gitmojis')

/**
 * Output emoji list.
 *
 * @param  {Array} data
 */
const printMojiList = function printMojiList(data) {
  data.forEach((item) => {
    console.log(`${item.emoji}  - ${chalk.blue(item.code)} - ${item.description}`)
  })
}

/**
 * Search gitmojis with specified keywords.
 *
 * @param  {Array} gitmojis
 * @param  {Array} keywords
 * @return {Array} result of search.
 */
const filterGitmojisWithKeywords = function filterGitmojisWithKeywords(data, keywords) {
  return data.filter((item) => {
    const words = item.description.toLowerCase()

    for (let i = 0, len = keywords.length; i < len; i += 1) {
      const keyword = keywords[i].toLowerCase()

      if (words.indexOf(keyword) !== -1) {
        return true
      }
    }

    return false
  })
}

/**
 * sub-command `search`
 *
 * @param  {Array} keywords
 */
const search = function search(keywords) {
  const results = filterGitmojisWithKeywords(gitmojis, keywords)

  printMojiList(results)
}

module.exports = search
