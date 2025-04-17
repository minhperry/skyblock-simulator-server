import log4js from 'log4js'

log4js.configure({
  appenders: {
    console: {type: 'stdout'},
    app: {type: 'file', filename: 'logs/app.log'}
  },
  categories: {
    default: {appenders: ['console', 'app'], level: 'debug'}
  }
})

export const getLogger = (name: string) => log4js.getLogger(name)
