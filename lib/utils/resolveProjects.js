const fs = require('fs')
const path = require('path')

module.exports = function resolveProjects(projects) {
  let mainProject = null
  const subProjects = []

  for (const project of projects) {
    const { fullPath } = project
    const packagePath = path.resolve(fullPath, 'package.json')
    const stackConfigPath = path.resolve(fullPath, 'stack.config.js')

    if (!fs.existsSync(packagePath)) {
      continue
    }

    if (!fs.existsSync(stackConfigPath)) {
      continue
    }

    const stackConfig = require(stackConfigPath)

    if (typeof stackConfig !== 'object') {
      continue
    }

    const { type } = stackConfig

    if (type === 'base') {
      mainProject = project
    } else if (type === 'child') {
      subProjects.push(project)
    }
  }

  return [mainProject, subProjects]
}
