const execa = require('execa')
const chalk = require('chalk')

module.exports = function runCommandSync(context, cmd) {
  console.log()
  console.log(chalk.bgGray(`runCommandSync "${cmd}" in ${context}`))
  console.log()

  const [file, ...args] = cmd.split(' ')

  try {
    const { stdout } = execa.sync(file, args, { cwd: context })
    console.log(stdout)
  } catch (err) {
    console.log(err.stderr || err.stdout)
  }
}
