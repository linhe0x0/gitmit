const path = require('path')
const { test } = require('ava')
const tempfile = require('tempfile')
const del = require('del')
const util = require('../../src/utils/util')
const mock = require('mock-fs')

const nonexistentFile = tempfile('.json')

let existentJSONFile = path.resolve(process.cwd(), 'existent.json')
let syntaxErrorFile = path.resolve(process.cwd(), 'syntax-error.json')
let hookFileWithContent = path.resolve(process.cwd(), 'hook-with-content')
let hookFileWithoutContent = path.resolve(process.cwd(), 'hook-without-content')

test.before('mock file', (t) => {
  mock({
    'existent.json': '{"a": 1}',
    'syntax-error.json': 'abc',
    'hook-with-content': '#gitmit',
    'hook-without-content': ''
  })
})

test.after((t) => {
  mock.restore()
})

test('#exists: should return true if the file is exist', async (t) => {
  const result = await util.exists(existentJSONFile)

  t.true(result)
})

test('#exists: should return false if the file is not exist', async (t) => {
  const result = await util.exists(nonexistentFile)

  t.false(result)
})

test('#readFile: should get some contents if read an existent file', async (t) => {
  const result = await util.readFile(existentJSONFile)

  t.truthy(result)
  t.is(typeof result, 'string')
})

test('#readFile: should get an error if read a nonexistent file.', async (t) => {
  const error = await t.throws(util.readFile(nonexistentFile))

  t.is(error.code, 'ENOENT')
})

test('#readFile: should get an Object if read a JSON file with parameter JSON.parse', async (t) => {
  const result = await util.readFile(existentJSONFile, JSON.parse)

  t.truthy(result)
  t.is(typeof result, 'object')
})

test('#readFile: should get an error if read a syntax error file with parameter JSON.parse', async (t) => {
  const error = await t.throws(util.readFile(syntaxErrorFile, JSON.parse))

  t.is(error.message, 'Unexpected token a in JSON at position 0')
})

test('#readFile: should get an error if read a JSON file with parameter 1', async (t) => {
  const error = await t.throws(util.readFile(existentJSONFile, 1))

  t.is(error.message, 'parameter parse is not a function.')
})

test('#writeFile: ', async (t) => {
  const error = await t.throws(util.writeFile(existentJSONFile, 'test', { flag: 'wx' }))

  t.is(error.code, 'ENOENT')
})

test('#writeFile: ', async (t) => {
  const path = await util.writeFile('./testing.txt', 'testing')

  t.is(path, './testing.txt')
})

test('#checkIfHookExists: should return true if check an hook file that has gitmit', async (t) => {
  const result = await util.checkIfHookExists(hookFileWithContent)

  t.true(result)
})

test('#checkIfHookExists: should return false if check an empty file', async (t) => {
  const result = await util.checkIfHookExists(hookFileWithoutContent)

  t.false(result)
})

test('#getHookFilePath', async (t) => {
  const cwd = process.cwd()
  const result = await util.getHookFilePath()

  t.is(result, `${cwd}/.git/hooks/prepare-commit-msg`)
})
