const execa = require('execa')
const chalk = require('chalk')
const logTransformer = require("strong-log-transformer")
const FilterStream = require('streamfilter')

const colorWheel = ["cyan", "magenta", "blue", "yellow", "green", "red"]
const NUM_COLORS = colorWheel.length
let currentColor = 0

const textFilter = new FilterStream((chunk, encoding, cb) => {
  const mustBeFiltered = chunk.toString().includes('[webpack.Progress]')
  if (mustBeFiltered) {
    cb(true)
  } else {
    cb(false)
  }
})

module.exports = function runCommand(context, cmd) {
  const projectName = context.split('/').pop()
  const [file, ...args] = cmd.split(' ')
  const subprocess = execa(file, args, { cwd: context })

  const colorName = colorWheel[currentColor % NUM_COLORS]
  currentColor++
  const stdoutOpts = { tag: chalk.bold[colorName](projectName) }
  const stderrOpts = { tag: chalk[colorName](projectName) }

  subprocess.stdout.pipe(logTransformer(stdoutOpts)).pipe(process.stdout)
  subprocess.stderr.pipe(logTransformer(stderrOpts)).pipe(textFilter).pipe(process.stderr)
}
