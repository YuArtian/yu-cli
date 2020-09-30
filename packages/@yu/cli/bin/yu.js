#!/usr/bin/env node

const { chalk, semver } = require('@yu/cli-shared-utils')
const requiredVersion = require('../package.json').engines.node

function checkNodeVersion(wanted, id) {
  if (!semver.satisfies(process.version, wanted, { includePrerelease: true })) {
    console.log(chalk.red(
      '检测到当前 Node 版本为' + process.version + '\n' +
      id + ' 需要 Node ' + wanted + '.\n使用前请先升级 Node 版本'
    ))
    process.exit(1)
  }
}
// Node 版本检查
checkNodeVersion(requiredVersion, '@soul/cli')

const { program } = require('commander')
const minimist = require('minimist')

program
  .version(`@soul/cli ${require('../package').version}`)
  .usage('<command> [options]')
// soul create
program
  .command('create <app-name>')
  .description('使用 @soul/cli 创建一个新应用')
  .option('-d, --default', '跳过选项，使用默认配置')
  .action((name, cmd) => {
    const options = cleanArgs(cmd)
    // console.log('options',options)
    if (minimist(process.argv.slice(3))._.length > 1) {
      console.log(chalk.yellow('\n 输入的参数过多，将只采用第一个参数作为项目名称'))
    }

    require('../lib/create')(name, options)
  })
// soul --help
program.on('--help', () => {
  console.log()
  console.log(`  运行 ${chalk.cyan(`soul <command> --help`)} 获取详细信息`)
  console.log()
})
// 只输入 soul 时，给出提示
if (!process.argv.slice(2).length) {
  program.outputHelp()
}

// 设置 commander 解析参数
program.parse(process.argv);

/* 横杠转大写 */
function camelize (str) {
  return str.replace(/-(\w)/g, (_, c) => c ? c.toUpperCase() : '')
}
/* 清除多余参数 */
function cleanArgs (cmd) {
  const args = {}
  cmd.options.forEach(o => {
    const key = camelize(o.long.replace(/^--/, ''))
    if (typeof cmd[key] !== 'function' && typeof cmd[key] !== 'undefined') {
      args[key] = cmd[key]
    }
  })
  return args
}
