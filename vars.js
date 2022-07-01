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
  appClientIndex: process.env.APP_CLIENT_INDEX,
  appRefIdIndex: process.env.APP_REF_ID_INDEX,
  appVerificationTokenIndex: process.env.APP_VERIFICATION_TOKEN_INDEX,
  magicLinksCollection: process.env.MAGIC_LINKS_COLLECTION,
  magicLinkTokenIndex: process.env.MAGIC_LINK_TOKEN_INDEX,
  magicLinksEmailIndex: process.env.MAGIC_LINKS_EMAIL_INDEX,
  appSessionsCollection: process.env.APP_SESSIONS_COLLECTION,
  appSessionTokenIndex: process.env.APP_SESSION_TOKEN_INDEX,
  timeOut: process.env.TIMEOUT,
}
