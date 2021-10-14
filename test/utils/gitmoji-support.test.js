const test = require('ava')
const should = require('should')
const gitmojiSupport = require('../../src/utils/gitmoji-support')

test('#gitmojiSupport: should return inquirer prompt format', (t) => {
  const result = gitmojiSupport()

  result.should.have.property('source')
})
