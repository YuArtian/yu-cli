const EventEmitter = require('events')

module.exports = class Creator extends EventEmitter {
  constructor(name, context, promptModules){
    super()
    this.name = name
    this.context = context

  }
}