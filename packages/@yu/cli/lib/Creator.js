const EventEmitter = require('events')

module.exports = class Creator extends EventEmitter {
  constructor(name, context, promptModules){
    super()
    this.name = name
    this.context = context
    const { presetPrompt } = this.resolveIntroPrompts()

    this.presetPrompt = presetPrompt
    console.log('presetPrompt',presetPrompt)
  }

  resolveIntroPrompts () {
    const presetChoices = [
      {
        name: '微前端主入口',
        value: 'mfe_entry',
      },
      {
        name: '微前端应用（Vue）',
        value: 'mfe_app_vue',
      },
    ]
    const presetPrompt = {
      name: 'preset',
      type: 'list',
      message: `为应用选择一个预设`,
      choices: [
        ...presetChoices,
      ]
    }

    return {
      presetPrompt
    }
  }
}