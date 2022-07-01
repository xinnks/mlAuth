const crypto = require("crypto")

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
  let result = crypto
    .createHash("sha256")
    .update(`${Date.now()}${text.replaceAll(" ")}`, "utf-8")
    .update(crypto.createHash("sha256").update(salt, "utf-8").digest())
    .digest("hex")
  return length && length > 0 ? result.slice(0, length) : result
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
 * @returns {Integer}
 */
function nowInSeconds() {
  return Date.now()
}

module.exports = {
  UnauthorizedException,
  BadRequestException,
  createHexToken,
  hashPassword,
  comparePasswordHashes,
  result,
  nowInSeconds,
}
