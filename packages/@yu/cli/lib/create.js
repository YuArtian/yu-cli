const path = require('path')
const fs = require('fs-extra')
const inquirer = require('inquirer')

const { clearConsole } = require('./util/clearConsole')
const { getPromptModules } = require('./util/createTools')
const { stopSpinner, chalk, error } = require('@yu/cli-shared-utils')
const validateProjectName = require('validate-npm-package-name')

async function create (projectName, options){
  const cwd = options.cwd || process.cwd()
  // 是否在当前目录构建
  const inCurrent = projectName === '.'
  // 项目名称
  const name = inCurrent ? path.relative('../', cwd) : projectName
  // 目标目录
  const targetDir = path.resolve(cwd, projectName || '.')
  // 校验项目名称
  const result = validateProjectName(name)
  if (!result.validForNewPackages) {
    console.error(chalk.red(`无效的项目名称: "${name}"`))
    result.errors && result.errors.forEach(err => {
      console.error(chalk.red.dim('Error: ' + err))
    })
    result.warnings && result.warnings.forEach(warn => {
      console.error(chalk.red.dim('Warning: ' + warn))
    })
    exit(1)
  }
  // 如果构建目录已存在
  if (fs.existsSync(targetDir) && !options.merge) {
    if (options.force) {
      await fs.remove(targetDir)
    } else {
      await clearConsole()
      if (inCurrent) {
        const { ok } = await inquirer.prompt([
          {
            name: 'ok',
            type: 'confirm',
            message: `要在当前目录创建项目嘛？`
          }
        ])
        if (!ok) {
          return
        }
      } else {
        const { action } = await inquirer.prompt([
          {
            name: 'action',
            type: 'list',
            message: `目标路径 ${chalk.cyan(targetDir)} 已经存在. 请选择:`,
            choices: [
              { name: '覆盖', value: 'overwrite' },
              { name: '合并', value: 'merge' },
              { name: '取消', value: false }
            ]
          }
        ])
        if (!action) {
          return
        } else if (action === 'overwrite') {
          console.log(`\n正在删除 ${chalk.cyan(targetDir)}...`)
          await fs.remove(targetDir)
        }
      }
    }
  }

  const creator = new Creator(name, targetDir, getPromptModules())
  await creator.create(options)
}

module.exports = (...args) => {
  return create(...args).catch(err => {
    stopSpinner(false)
    error(err)
  })
}