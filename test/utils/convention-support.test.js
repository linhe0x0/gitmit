const fs = require('fs')
const os = require('os')
const path = require('path')
const test = require('ava')
const should = require('should')
const rewire = require('rewire')
const del = require('del')
const conventionSupport = rewire('../../src/utils/convention-support')
const homedir = os.homedir()
const cwd = process.cwd()

const mock = {
  create(path, content) {
    return new Promise((resolve, reject) => {
      fs.writeFile(path, content || '', (err) => {
        if (err) return reject(err)

        resolve(path)
      })
    })
  },

  clean(path) {
    return del(path, {
      force: true,
    })
  },
}

test.serial(
  '#getConventionalFile: should return current directory if the current directory has file that named .conventional-commit-types.json',
  async (t) => {
    const file = await mock.create(
      path.resolve(cwd, '.conventional-commit-types.json')
    )

    const getConventionalFile = conventionSupport.__get__('getConventionalFile')

    const result = await getConventionalFile()

    await mock.clean(file)

    result.should.equal(file)
  }
)

test.serial(
  "#getConventionalFile: should return home directory if the current directory doesn't has file that named .conventional-commit-types.json but home directory has.",
  async (t) => {
    const file = await mock.create(
      path.resolve(homedir, '.conventional-commit-types.json')
    )

    const getConventionalFile = conventionSupport.__get__('getConventionalFile')

    const result = await getConventionalFile()

    await mock.clean(file)

    result.should.equal(file)
  }
)

test.serial(
  '#getConventionalFile: should return current directory if both current directory and home directory have file that named .conventional-commit-types.json',
  async () => {
    const home = await mock.create(
      path.resolve(homedir, '.conventional-commit-types.json')
    )
    const current = await mock.create(
      path.resolve(cwd, '.conventional-commit-types.json')
    )

    const getConventionalFile = conventionSupport.__get__('getConventionalFile')

    const result = await getConventionalFile()

    await mock.clean([home, current])

    result.should.equal(current)
  }
)

test.serial('#conventionSupport: ', async (t) => {
  const result = await conventionSupport()

  result[0].should.have.property('choices').which.is.an.Array()
})

test('#mapTypesToChoices: should get an error if the parameter types is not defined', (t) => {
  const mapTypesToChoices = conventionSupport.__get__('mapTypesToChoices')
  const error = t.throws(() => {
    mapTypesToChoices()
  })

  t.is(error.message, 'There are no conventional commit types.')
})

test('#mapTypesToChoices: should get an Array if the parameter types is defined', (t) => {
  const mapTypesToChoices = conventionSupport.__get__('mapTypesToChoices')
  const result = mapTypesToChoices({ feat: { description: 'A new feature' } })

  result.should.be.an.Array()
})

test('#mapScopesToTips: should return an empty string if the parameter is not defined', (t) => {
  const mapScopesToTips = conventionSupport.__get__('mapScopesToTips')
  const result = mapScopesToTips()

  result.should.be.empty().which.is.a.String()
})

test('#mapScopesToTips: should return an string if the parameter is defined', (t) => {
  const mapScopesToTips = conventionSupport.__get__('mapScopesToTips')
  const result = mapScopesToTips({ a: '1' })

  result.should.be.not
    .empty()
    .which.is.a.String()
    .and.startWith('(')
    .and.endWith(')')
})
