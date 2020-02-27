const chalk = require('chalk')
const envinfo = require('envinfo')

module.exports = function info() {
  console.log(chalk.bold.red('Environment Info:'))
  envinfo.run(
    {
      System: ['OS', 'CPU'],
      Binaries: ['Node', 'Yarn', 'npm'],
      Browsers: ['Chrome', 'Edge', 'Firefox', 'Safari'],
      npmPackages: '/**/{typescript,*vue*,@vue/*/}',
      npmGlobalPackages: ['@vue/cli'],
    },
    {
      showNotFound: true,
      duplicates: true,
      fullTree: true
    }
  ).then(console.log)
}
