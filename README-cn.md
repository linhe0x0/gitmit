# gitmit

[![Build Status](https://travis-ci.org/sqrthree/gitmit.svg?branch=master)](https://travis-ci.org/sqrthree/gitmit)
[![Coverage Status](https://coveralls.io/repos/github/sqrthree/gitmit/badge.svg?branch=master)](https://coveralls.io/github/sqrthree/gitmit?branch=master)
[![gitmoji badge](https://img.shields.io/badge/gitmoji-%20😜%20😍-FFDD67.svg?style=flat)](https://gitmoji.carloscuesta.me/)
[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg?style=flat-square)](https://github.com/semantic-release/semantic-release)

> gitmit是一个交互式命令行工具，让你可以轻松使用 emoji 表情和规范性的 commit message 格式。灵感来自 [gitmoji.carloscuesta.me](https://gitmoji.carloscuesta.me/) 和 [commitizen.github.io/cz-cli](http://commitizen.github.io/cz-cli/)。

[English](./README.md)

## 安装

环境依赖：[Node.js](http://nodejs.org/)、[npm](http://npmjs.org/)

执行以下命令即可安装 `gitmit` 命令到全局环境：

```
$ npm i -g gitmit
```

## 使用

### 查看帮助信息

你可以使用 `--help` 参数来查看帮助信息和使用案例。

```
$ gitmit --help
```

### 常规使用

在 Git 目录，当需要执行 commit 操作时，直接使用 `gitmit` 即可。之后便可以根据提示语进行操作。

### 使用 emoji

```
$ gitmit -e
```

### 规范 commit 信息格式

很多项目都会约定好 commit 信息按照某种格式进行规范。例如 [Angular 团队](https://github.com/angular/angular.js/blob/master/CONTRIBUTING.md#-git-commit-guidelines)。`gitmit` 能够通过交互式问答的形式约束团队按照特定格式书写 commit 信息。只需要使用 `-c` 参数即可。

```
$ gitmit -c
```

当然，你也可以和 `-e` 参数同时使用。

```
$ gitmit -c -e
```

### 自定义 commit 信息格式

`gitmit` 默认使用 [Angular 团队](https://github.com/angular/angular/commits/master) 的提交规范，当然，你也可以根据自己的项目需要自定义规范。只需要在当前项目文件夹中创建一个 `.conventional-commit-types.json` 文件即可。文件内容格式请参考 [github.com/sqrthree/gitmit/blob/master/src/data/conventional-commit-types.json](https://github.com/sqrthree/gitmit/blob/master/src/data/conventional-commit-types.json)。

如果觉得每个项目都创建一个太麻烦，也可以在自己的用户目录下创建一个 `.conventional-commit-types.json` 文件。程序会按照 **当前目录** => **用户目录** => ** 默认文件** 的顺序进行查找。

### 搜索表情

你可以提供一些关键字来搜索与之匹配的 emoji 表情：

```
$ gitmit search bug
$ gitmit search bug lint
```

### 更新表情

如果支持的表情有了更新，你可以通过 `update` 命令来进行更新：

```
gitmit update
```

### Hook 模式

如若想自己把控最终的 commit 信息内容，但是又想使用 `gitmit` 的交互式问答辅助，则推荐使用 `hook` 模式，执行该命令后，会自动在 `.git/hook` 文件夹中创建一个 `hook`，之后像之前一样使用 `git commit` 命令即可。

```
$ gitmit hook --init  // 初始化 gitmit Hook

$ gitmit hook --remove // 删除 gitmit hook
```

祝您玩的开心。:)
