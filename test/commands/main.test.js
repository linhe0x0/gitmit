const { test } = require('ava')
const should = require('should')
const rewire = require('rewire')
const main = rewire('../../src/commands/main')

const formatCommitMessage = main.__get__('formatCommitMessage')
const gitCommit = main.__get__('gitCommit')

test('#formatCommitMessage: title', (t) => {
  const result = formatCommitMessage({
    scope: 'scope',
    type: 'type',
    gitmoji: ':bug:',
    title: 'title'
  })

  result.title.should.equal(':bug: type(scope): title')
})

test('#formatCommitMessage: title', (t) => {
  const result = formatCommitMessage({
    type: 'type',
    gitmoji: ':bug:',
    title: 'title'
  })

  result.title.should.equal(':bug: type: title')
})

test('#formatCommitMessage: title', (t) => {
  const result = formatCommitMessage({
    gitmoji: ':bug:',
    title: 'title'
  })

  result.title.should.equal(':bug: title')
})

test('#formatCommitMessage: title', (t) => {
  const result = formatCommitMessage({
    type: 'type',
    title: 'title'
  })

  result.title.should.equal('type: title')
})

test('#formatCommitMessage: title', (t) => {
  const result = formatCommitMessage({
    scope: 'scope',
    type: 'type',
    title: 'title'
  })

  result.title.should.equal('type(scope): title')
})

test('#formatCommitMessage: title', (t) => {
  const result = formatCommitMessage({
    title: 'title'
  })

  result.title.should.equal('title')
})

test('#formatCommitMessage: body', (t) => {
  const result = formatCommitMessage({
    reference: '1',
    body: 'body'
  })

  result.body.should.equal('body\n\nClose #1')
})

test('#formatCommitMessage: body', (t) => {
  const result = formatCommitMessage({
    reference: '',
    body: 'body'
  })

  result.body.should.equal('body')
})

test('#formatCommitMessage: body', (t) => {
  const result = formatCommitMessage({
    reference: '1',
    body: ''
  })

  result.body.should.equal('Close #1')
})

test('#gitCommit', (t) => {
  const result = gitCommit({
    title: 'title',
    body: 'body'
  })

  result.should.be.equal('git commit -m "title" -m "body"')
})

test('#gitCommit', (t) => {
  const result = gitCommit({
    title: 'title',
    body: ''
  })

  result.should.be.equal('git commit -m "title" -m ""')
})

test('#gitCommit', (t) => {
  const result = gitCommit({
    title: 'title',
    body: 'body',
    signed: true
  })

  result.should.be.equal('git commit -s -m "title" -m "body"')
})
