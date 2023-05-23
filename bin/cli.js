#! /usr/bin/env node


const program = require('commander')
const inquirer = require('inquirer');
const package = require('../package.json')

// 定义当前版本
program.version(`v${package.version}`)


// bin/cli.js
// ...
program.on('--help', () => {}) // 添加--help

// const templates = require('./templates.js')

const path = require("path")
const downloadGitRepo = require('download-git-repo')

const ora = require('ora') // 引入ora

// 定义loading
const loading = ora('正在下载模版...')
const { getGitReposList } = require('./api.js') // 新增


program
  .command('create')
  .description('创建模版')
  .action(async () => {
    const { name } = await inquirer.prompt({
      type: 'input',
      name: 'name',
      message: '请输入项目名称：'
    })
    console.log("项目名称：", name)
    // 目标文件夹 = 用户命令行所在目录 + 项目名称
    const dest = path.join(process.cwd(), name)

    // 添加获取模版列表接口和loading
    const getRepoLoading = ora('获取模版列表...')
    getRepoLoading.start()
    const templates = await getGitReposList('MengPY')
    getRepoLoading.succeed('获取模版列表成功!')

    // 新增选择模版代码
  	const { template } = await inquirer.prompt({
      type: 'list',
      name: 'template',
      message: '请选择模版：',
      choices: templates // 模版列表
    })
    console.log('模版：', template)

    // 开心下载模版
    // 开始loading
    loading.start()
    downloadGitRepo(template, dest, (err) => {
      if (err) {
        loading.fail('创建模版失败：' + err.message) // 失败loading
      } else {
        loading.succeed('创建模版成功!') // 成功loading
        console.log(`\ncd ${name}`)
        console.log('npm i')
        console.log('npm start\n')
      }
    })

  });

// 解析用户执行命令传入参数
program.parse(process.argv)
