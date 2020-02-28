const fs = require('fs')
const path = require('path')
const chalk = require('chalk')
const inquirer = require('inquirer')
const readDirectory = require('./utils/readDirectory')
const resolveProjects = require('./utils/resolveProjects')
const runCommand = require('./utils/runCommand')

module.exports = async function serve(entry, cmd) {
  const context = path.resolve(process.cwd(), entry)
  const [mainProject, subProjects] = resolveProjects(readDirectory(context))

  if (!mainProject) {
    console.log(chalk.red(
      `目录: ${context} 下未发现有效的主项目, 请检查目录是否正确后再试!`
    ))
    process.exit(1)
  }

  const choices = [
    { name: `${mainProject.name}（主项目）`, value: mainProject.name, checked: true },
    ...subProjects.map(({ name }) => ({ name, value: name, }))
  ]

  const { projects } = await inquirer.prompt([
    {
      name: 'projects',
      type: 'checkbox',
      message: '请选择要启动的项目',
      choices,
    },
  ])

  for (const project of projects) {
    const projectContext = path.resolve(context, project)
    const packagePath = path.resolve(projectContext, 'package.json')
    const packageJson = JSON.parse(fs.readFileSync(packagePath))

    if (typeof packageJson.scripts !== 'object') {
      console.log(chalk.bold.red('警告:'), `${packagePath} 内无 scripts 字段`)
      process.exit(1)
    }

    const script = cmd.split(' ').pop()
    if (!packageJson.scripts[script]) {
      console.log(chalk.bold.red('警告:'), `${packagePath} 内无 ${script} 命令`)
      process.exit(1)
    }

    try {
      runCommand(projectContext, cmd)
    } catch (err) {
      console.error(err)
      process.exit(1)
    }
  }
}
