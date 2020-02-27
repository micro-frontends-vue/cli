const path = require('path')
const chalk = require('chalk')
const readDirectory = require('./utils/readDirectory')
const resolveProjects = require('./utils/resolveProjects')

module.exports = function list(entry, args) {
  const context = path.resolve(process.cwd(), entry)
  const [mainProject, subProjects] = resolveProjects(readDirectory(context))

  if (!mainProject) {
    console.log(chalk.red(
      `目录: ${context} 下未发现有效的主项目, 请检查目录是否正确后再试!`
    ))
    process.exit(1)
  }

  console.log(chalk.bold.red('主项目:'), mainProject.name)
  console.log(chalk.bold.red('子项目:'), subProjects.map(({ name }) => name).join(', '))
}
