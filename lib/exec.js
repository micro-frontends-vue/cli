const path = require('path')
const readDirectory = require('./utils/readDirectory')
const resolveProjects = require('./utils/resolveProjects')
const runCommand = require('./utils/runCommand')

module.exports = function exec(entry, cmd) {
  const context = path.resolve(process.cwd(), entry)
  const [mainProject, subProjects] = resolveProjects(readDirectory(context))
  const projects = subProjects.map(({ name }) => name)

  if (mainProject) {
    projects.push(mainProject.name)
  }

  for (const project of projects) {
    const projectContext = path.resolve(context, project)

    try {
      runCommand(projectContext, cmd)
    } catch (err) {
      console.error(err)
      process.exit(1)
    }
  }
}
