const path = require('path')
const globby = require('globby')

module.exports = function readDirectory(context) {
  return globby
    .sync(['**'], { onlyDirectories: true, cwd: context, deep: 1 })
    .map((dir) => ({ name: dir, fullPath: path.resolve(context, dir) }));
}
