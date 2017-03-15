# gitmit

[![Build Status](https://travis-ci.org/sqrthree/gitmit.svg?branch=master)](https://travis-ci.org/sqrthree/gitmit)
[![Coverage Status](https://coveralls.io/repos/github/sqrthree/gitmit/badge.svg?branch=master)](https://coveralls.io/github/sqrthree/gitmit?branch=master)
[![gitmoji badge](https://img.shields.io/badge/gitmoji-%20😜%20😍-FFDD67.svg?style=flat)](https://gitmoji.carloscuesta.me/)
[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg?style=flat-square)](https://github.com/semantic-release/semantic-release)

> gitmit is a interactive command line tool so that you can easily use emoji and conventional commit format. Inspire by [gitmoji.carloscuesta.me](https://gitmoji.carloscuesta.me/) and [commitizen.github.io/cz-cli](http://commitizen.github.io/cz-cli/).

[中文介绍](./README-cn.md)

## Installation

Please make sure you have been installed [Node.js](http://nodejs.org/).

Installation is as simple as running the following command with [npm](http://npmjs.org/):

```
$ npm i -g gitmit
```

## Document

### Output help information

`gitmit` will output help information and examples when `--help` is used.

```
$ gitmit --help
```

### Usage

Just simply use `gitmit` instead of `git commit` when committing. Then `gitmit` will start the interactive commit client, to auto generate your commit based on your prompts.

```
$ gitmit
```

### Emoji support

If you want to use emoji in commit message such as [github.com/sqrthree/gitmit](https://github.com/sqrthree/gitmit), just with `-m` option.

```
$ gitmit -e
```

### Commit with convention

As you know, lots of projects have some commit message conventions. when you use `gitmit` with `-c` option, you'll be prompted to fill out any required commit fields at commit time. No more digging through CONTRIBUTING.md to find what the preferred format is.

```
$ gitmit -c
```

Also, you can use `gitmit` with both `-c` and `-e`

```
$ gitmit -c -e
```
### Custom your own conventions

Default, we will use [AngularJS's commit message convention](https://github.com/angular/angular.js/blob/master/CONTRIBUTING.md#-git-commit-guidelines). but you can custom your own conventions with a `.conventional-commit-types.json` file.

If your project directory has a `.conventional-commit-types.json` file such as [src/data/conventional-commit-types.json](https://github.com/sqrthree/gitmit/blob/master/src/data/conventional-commit-types.json), `gitmit` will autoload your custom file when you run it in this directory.

If you want to keep it wherever you are, yon can create a `.conventional-commit-types.json` file in your home directory, `gitmit` will autoload it.


### search emoji

Search using specific keywords to find the right gitmoji.

```
$ gitmit search bug
$ gitmit search bug lint
```

### update emoji

```
$ gitmit update
```

### Hook support

Run command `hook` with `--init` option, `gitmit` will auto add a hook to your `.git` config. After you add your changes and commit them, the prompts will begin and your commit message will be built.

```
$ gitmit hook --init // init a git hook.

... // do anythings what you want.

$ git add .
$ git commit
```

You can alse init a hook with `-e` and `-c`:

```
$ gitmit hook --init -e
```

If you want remove `gitmit` hook, just run `gitmit hook` with `--remove` option.

```
$ gitmit hook --remove // remove gitmit hook
```

Have fun. :)
