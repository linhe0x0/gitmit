const path = require('path')
const fs = require('fs')
const axios = require('axios')
const ora = require('ora')

const rawUrl = 'https://raw.githubusercontent.com/sqrthree/gitmit/master/src/data/gitmojis.json'
const cacheFile = path.resolve(__dirname, '../data/gitmojis.json')

axios.defaults.timeout = 5000

/**
 * sub-command `update`
 */
const update = function update() {
  const spinner = ora('Fetching data.')

  spinner.start()

  axios.get(rawUrl).then((res) => {
    const data = JSON.stringify(res.data, null, 2)

    fs.writeFile(cacheFile, data, (err) => {
      if (err) throw err

      spinner.succeed('Fetch data successfully.')
    })
  }).catch((err) => {
    spinner.fail('Failed to fetch data.')
    console.error(err)
  })
}

module.exports = update
