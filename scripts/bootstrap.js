// create package.json and README for packages that don't have one yet

const fs = require('fs')
const path = require('path')
const baseVersion = require('../packages/@yu/cli-service/package.json').version

const packagesDir = path.resolve(__dirname, '../packages/@yu')
const files = fs.readdirSync(packagesDir)

files.forEach(pkg => {
  if (pkg.charAt(0) === '.') return

  const isPlugin = /^cli-plugin-/.test(pkg)
  const desc = isPlugin
    ? `${pkg.replace('cli-plugin-', '')} plugin for yu-cli`
    : `${pkg.replace('cli-', '')} for yu-cli`

  const pkgPath = path.join(packagesDir, pkg, `package.json`)
  if (!fs.existsSync(pkgPath)) {
    const json = {
      'name': `@yu/${pkg}`,
      'version': baseVersion,
      'description': desc,
      'main': 'index.js',
      'publishConfig': {
        'access': 'public'
      },
      "repository": {
        "type": "git",
        "url": "git+https://github.com/YuArtian/yu-cli.git"
      },
      'keywords': [
        'yu',
        'cli'
      ],
      "author": "Yu <312364705@qq.com>",
      "homepage": "https://github.com/YuArtian/yu-cli#readme",
      'license': 'MIT'
    }
    fs.writeFileSync(pkgPath, JSON.stringify(json, null, 2))
  }

  const readmePath = path.join(packagesDir, pkg, `README.md`)
  if (!fs.existsSync(readmePath)) {
    fs.writeFileSync(readmePath, `# @yu/${pkg}\n\n> ${desc}`)
  }

  const npmIgnorePath = path.join(packagesDir, pkg, `.npmignore`)
  if (!fs.existsSync(npmIgnorePath)) {
    fs.writeFileSync(npmIgnorePath, `__tests__\n__mocks__`)
  }
})
