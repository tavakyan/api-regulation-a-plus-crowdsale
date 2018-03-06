const makeApp = require('./utils/appMaker')
const dbInit = require('./utils/db/dbInit')
const queue = require('./utils/queue/queueInit')
const models = require('./models')

const PORT = process.env.PORT || 3000

const env = process.env.NODE_ENV || /* istanbul ignore next */ 'development'
const isDevelopment = env === 'development'

const forceSync = () =>
  process.env.NODE_ENV === 'test' /* istanbul ignore next */ ||
  (process.env.FORCE_DATABASE_RESET && process.env.I_KNOW_WHAT_I_AM_DOING)

const start = async () => {
  const result = await dbInit()

  /* istanbul ignore if */
  if (isDevelopment) console.log(result.message) // eslint-disable-line no-console

  await models.sequelize.sync({ force: forceSync() })
  const app = makeApp()
  const server = await app.listen(PORT)
  queue.add({ data: 'Yeehahaaa' })
  return { server, db: models.sequelize }
}

module.exports = {
  start
}
