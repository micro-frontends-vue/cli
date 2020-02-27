const fs = require('fs')
const path = require('path')

module.exports = function resolveProjects(projects) {
  let mainProject = null
  const subProjects = []

  for (const project of projects) {
    const { fullPath } = project
    const packagePath = path.resolve(fullPath, 'package.json')

    if (!fs.existsSync(packagePath)) {
      continue
    }

    const packageJson = JSON.parse(fs.readFileSync(packagePath))

    if (typeof packageJson !== 'object') {
      continue
    }

    if (!packageJson.mfv) {
      continue
    }

    if (packageJson.mfv === 'main') {
      mainProject = project
    } else if (packageJson.mfv === 'sub') {
      subProjects.push(project)
    }
  }

  return [mainProject, subProjects]
}
