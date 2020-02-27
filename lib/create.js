const path = require('path')
const chalk = require('chalk')
const execa = require('execa')
const shell = require("shelljs");
const inquirer = require('inquirer')

module.exports = async function create(entry) {
  const context = path.resolve(process.cwd(), entry)
  const templateDir = path.resolve(__dirname, 'template')

  console.log('开发中...')

  return

  shell.exec(`vue --version`)

  shell.exec(`pwd`, { cwd: context })

  console.log(process.cwd())
  console.log(templateDir + '/sample')

  const vueCmdPath = path.resolve(process.cwd(), 'node_modules/.bin/vue')

  // shell.exec(`vue create --preset ${templateDir}/sample okr`)

  shell.exec(`node ${vueCmdPath} create --preset ${templateDir}/sample okr`)

  // shell.exec(`vue create okr`, { cwd: context })

  // const { type, name } = await inquirer.prompt([
  //   {
  //     name: 'type',
  //     type: 'list',
  //     message: '请选择要创建的项目类型',
  //     choices: [
  //       { name: '子项目', value: 'sub' },
  //       { name: '主项目', value: 'main' },
  //     ],
  //   },
  //   {
  //     name: 'name',
  //     type: 'input',
  //     message: `请输入项目的名称（${chalk.gray('如：fe-oa-okr')}）`,
  //     validate: function (input) {
  //       const done = this.async();
  //       if (input) {
  //         done(null, true);
  //       } else {
  //         done('项目名称为必填项');
  //       }
  //     }
  //   },
  // ])

  // console.log('res:', [type, name])
}
