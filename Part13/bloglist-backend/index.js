const app = require('./app')
const config = require('./utils/config')
const { connectToDatabase } = require('./utils/db')
const logger = require('./utils/logger')

const start = async () => {
  await connectToDatabase()
  app.listen(config.PORT, () => {
    logger.info(`Server Running on port ${config.PORT}`)
  })
}

start()
