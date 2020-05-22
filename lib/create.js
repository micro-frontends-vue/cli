const path = require('path')
const fs = require('fs-extra')
const chalk = require('chalk')
const execa = require('execa')
const shell = require("shelljs")
const inquirer = require('inquirer')
const templatePaths = require('./constants').templatePaths

module.exports = async function create(entry, cliPath) {
  const context = path.resolve(process.cwd(), entry)

  // shell.exec(`vue --version`)
  // shell.exec(`pwd`, { cwd: context })

  const { type, name } = await inquirer.prompt([
    {
      name: 'type',
      type: 'list',
      message: '请选择要创建的项目类型',
      choices: [
        { name: '子项目', value: 'child' },
        { name: '主项目', value: 'main' },
      ],
    },
    {
      name: 'name',
      type: 'input',
      message: `请输入项目的名称（${chalk.gray('如：fe-oa-okr')}）`,
      validate: function (input) {
        const done = this.async();
        if (input) {
          done(null, true);
        } else {
          done('项目名称为必填项');
        }
      }
    },
  ])

  let templatePath = templatePaths[type]

  if (!templatePath) {
    throw new Error(`不支持的 template 类型: ${type}`)
  }

  const templateCachePath = path.resolve(cliPath, '.templates')

  if (!fs.existsSync(templateCachePath)) {
    fs.mkdirSync(templateCachePath)
  }

  if (!fs.existsSync(path.resolve(templateCachePath, type))) {
    shell.exec(`git clone ${templatePath} ${type}`, { cwd: templateCachePath })
  }

  if (fs.existsSync(path.resolve(context, name))) {
    const { force } = await inquirer.prompt([
      {
        name: 'force',
        type: 'confirm',
        message: '文件夹已存在, 是否继续, 继续将会覆盖已有文件夹',
      },
    ])

    if (force) {
      fs.removeSync(path.resolve(context, name))
    } else {
      process.exit(0)
    }
  }

  fs.copySync(path.resolve(templateCachePath, type), path.resolve(context, name))
  fs.removeSync(path.resolve(context, name, '.git'))
  fs.removeSync(path.resolve(context, name, 'package-lock.json'))

  console.log(chalk.green(`创建成功: ${path.resolve(context, name)}`))
}
