#! /usr/bin/env node

const path = require('path')
const chalk = require('chalk')
const minimist = require('minimist')
const didYouMean = require('didyoumean')
const program = require('commander')
const semver = require('semver')
const pkg = require('../package.json')

const { version, engines: { node: requiredVersion } } = pkg
const cliPath = path.resolve(__dirname, '../')

checkNodeVersion(requiredVersion, '@mfv/cli')

program
  .command('create [entry]')
  .description('初始项目')
  .action(() => {
    const argv = minimist(process.argv.slice(3))
    const { _: [entry = '.'] } = argv
    logContext(entry)
    require('../lib/create')(entry, cliPath)
  })

program
  .command('exec [script]')
  .description('执行脚本')
  // .option('--parallel', '是否并行执行脚本, 默认为串行')
  .action(() => {
    const argv = minimist(process.argv.slice(3))
    const { _: [script], parallel = false } = argv
    const entry = process.cwd()

    if (!script) {
      console.log(chalk.red('请输入要执行的脚本'))
      process.exit(0)
    }

    logContext(entry)
    require('../lib/exec')(entry, script, parallel)
  })

program
  .command('install')
  .alias('i')
  .description('安装依赖')
  .action(() => {
    const entry = process.cwd()
    logContext(entry)
    require('../lib/exec')(entry, 'npm i')
  })

program
  .command('list [entry]')
  .alias('ls')
  .description('查看 entry 目录下的项目列表')
  .action(() => {
    const argv = minimist(process.argv.slice(3))
    const { _: [entry = '.'] } = argv
    logContext(entry)
    require('../lib/list')(entry)
  })
  .on('--help', () => {
    console.log(chalk.bold('Examples:\n'))
    console.log('  $ launch list')
    console.log('  $ launch list ./')
    console.log('  $ launch ls ./\n')
  })

program
  .command('serve [entry]')
  .description('启动服务')
  .option('--script', '指定需要执行的脚本，默认为：npm run serve')
  .action(() => {
    const argv = minimist(process.argv.slice(3))
    const { _: [entry = '.'], script = 'npm run serve' } = argv
    logContext(entry)
    require('../lib/serve')(entry, script)
  })

program
  .command('info')
  .description('打印开发环境信息')
  .action(() => {
    require('../lib/info')()
  })

program
  .arguments('<command>')
  .action((cmd) => {
    program.outputHelp()
    console.log(`  ` + chalk.red(`Unknown command ${chalk.yellow(cmd)}.\n`))
    suggestCommands(cmd)
  })

program.on('--help', () => {
  console.log(`\n  Run ${chalk.cyan(`launch <command> --help`)} for detailed usage of given command.\n`)
})

program.version(version)

// program.commands.forEach(c => c.on('--help', () => console.log()))

program.parse(process.argv)

if (!process.argv.slice(2).length) {
  program.outputHelp()
}

function checkNodeVersion(wanted, id) {
  if (!semver.satisfies(process.version, wanted)) {
    console.log(chalk.red(
      `You are using Node ${process.version}, but this version of ${id} requires Node ${wanted}.\nPlease upgrade your Node version.`
    ))
    process.exit(1)
  }
}

function suggestCommands(unknownCommand) {
  const availableCommands = program.commands.map(cmd => cmd._name)

  const suggestion = didYouMean(unknownCommand, availableCommands)
  if (suggestion) {
    console.log(`  ` + chalk.red(`Did you mean ${chalk.yellow(suggestion)}?`))
  }
}

function logContext(context) {
  console.log(chalk.bold.red('context:'), path.resolve(process.cwd(), context))
}
