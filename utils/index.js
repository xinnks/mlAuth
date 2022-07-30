const crypto = require("crypto")
const Mail = require("./../mail")

function UnauthorizedException(reason) {
  this.status = 401
  this.statusText = "Unauthorized"
  this.reason = reason
}

function BadRequestException(reason) {
  this.status = 400
  this.statusText = "Bad Request"
  this.reason = reason
}

function createHexToken(text, salt, length = null) {
  return crypto
    .createHash("sha256")
    .update(`${Date.now()}${text.replaceAll(" ")}`, "utf-8")
    .update(crypto.createHash("sha256").update(salt, "utf-8").digest())
    .digest("hex")
}

function hashPassword(password, salt) {
  return crypto
    .createHash("sha256")
    .update(password, "utf-8")
    .update(crypto.createHash("sha256").update(salt, "utf-8").digest())
    .digest("base64")
}

function comparePasswordHashes(password, passwordHash, salt) {
  let attemptPasswordHash = hashPassword(password, salt)
  return passwordHash === attemptPasswordHash
}

/**
 * @description Returns an array of missing parameters
 * @param { Array } required Required parameters
 * @param { Object } provided Provided parameters, likely a request body
 */
function getMissingParameters(required, provided) {
  return required.filter((key) => !Object.keys(provided).includes(key))
}

/**
 * @description Returns a result object
 * @param {String} status => The status being returned, either success or error
 * @param {*} data => The data being returned
 * @returns
 */
function result(status, data) {
  return {
    status,
    data,
  }
}

/**
 * @description Returns current time in seconds
 * @returns {Number}
 */
function nowInSeconds() {
  return Date.now()
}

/**
 * @description Sends a notification email to a user
 * @param {String} firstName - User's first name
 * @param {String} email - Receiver's email
 * @param {String|null} appName - Name of app
 * @returns
 */
async function sendAccountChangesNotification(
  firstName,
  email,
  appName = null
) {
  return new Mail().notifyOnAccountChanges({ firstName, email }, appName)
}

/**
 * @description Generates "client" and "secret" keys
 * @param {String} email user's email
 * @param {String} appName name of the app which the keys are to be generated for
 * @param {String} callbackUrl app's callback url
 * @returns {Object}
 */
function generateAppKeys(email, appName, callbackUrl) {
  if (!email || !appName || !callbackUrl) throw new Error("Parameters missing")

  const client = createHexToken(
      `${email}${appName}${callbackUrl}${nowInSeconds()}`,
      appSalt2
    ),
    secret = createHexToken(
      `${email}${appName}${callbackUrl}${nowInSeconds()}`,
      appSalt1
    )
  return { client, secret }
}

module.exports = {
  UnauthorizedException,
  BadRequestException,
  createHexToken,
  hashPassword,
  comparePasswordHashes,
  result,
  nowInSeconds,
  getMissingParameters,
  sendAccountChangesNotification,
  generateAppKeys,
}
