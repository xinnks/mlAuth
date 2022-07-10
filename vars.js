const dotenv = require("dotenv")
dotenv.config()

module.exports = {
  node_env: process.env.NODE_ENV,
  mlAuthService: process.env.APP_NAME,
  appPort: process.env.PORT,
  appUrl: process.env.MLAUTH_CLIENT_URL,
  appSalt1: process.env.SALT_1,
  appSalt2: process.env.SALT_2,
  appFromEmail: process.env.FROM_EMAIL,
  faunaSecret: process.env.FAUNA_SECRET,
  mailjetApiKey: process.env.MAILJET_API_KEY,
  mailjetApiSecret: process.env.MAILJET_API_SECRET,
  mlauthServiceClient: process.env.MLAUTH_SERVICE_CLIENT,
  mlauthServiceSecret: process.env.MLAUTH_SERVICE_SECRET,
  appsCollection: process.env.APPS_COLLECTION,
  magicLinksCollection: process.env.MAGIC_LINKS_COLLECTION,
  appSessionsCollection: process.env.APP_SESSIONS_COLLECTION,
  timeOut: process.env.TIMEOUT,
}
