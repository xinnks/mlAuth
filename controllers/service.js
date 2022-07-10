// App Controller
const {
  appSalt1,
  appSalt2,
  appsCollection,
  appUrl,
  timeOut,
  appClientIndex,
} = require("../vars")
const Database = require("../db/index.old")
const db = new Database()
const {
  hashPassword,
  createHexToken,
  nowInSeconds,
  comparePasswordHashes,
  result,
} = require("../utils")
const Mail = require("../mail")
const Session = require("../auth/session")

/**
 * Generates new keys for an app
 */
async function generateAppKeys(req, res) {
  let { callback_url: callbackUrl, life_span: lifeSpan, account } = req.body
  let { appName, email, refId } = account

  let client = await createHexToken(
    `${email}${appName}${callbackUrl}${nowInSeconds()}`,
    appSalt2
  )

  let nakedSecret = await createHexToken(
    `${email}${appName}${callbackUrl}${nowInSeconds()}`,
    appSalt1,
    32
  )

  let keysData = {
    lifeSpan: lifeSpan || timeOut,
    callbackUrl,
    client,
    secret: hashPassword(nakedSecret, appSalt1),
    updatedAt: nowInSeconds(),
  }

  const { status: updateStatus, data: updateResponse } = await db.update(
    appsCollection,
    refId,
    keysData
  )

  if (updateStatus !== "success")
    return res.json({
      message: "Failed to add app keys. " + updateResponse,
    })

  await sendAccountChangesNotification(updateResponse.data)

  res.json({
    keys: {
      client,
      secret: nakedSecret,
      callbackUrl,
      lifeSpan: lifeSpan || timeOut,
    },
    message: "Added app keys",
  })
}

/**
 * Deletes an app
 */
async function deleteApp(req, res) {}

async function authenticateApp(client, secret) {
  const { status, data: response } = await db.find(appClientIndex, client)
  if (status !== "success") return result("failure", response)

  let { name, callbackUrl, secret: docSecret } = response
  if (comparePasswordHashes(secret, docSecret, appSalt1))
    return result("success", { name, callbackUrl, user })

  return result("failure", "Failed to authenticate app")
}

/**
 * Log out
 */
async function logOut(req, res) {
  let { token: sessionToken } = req.body

  let { status, data } = await new Session(sessionToken).delete()

  if (status !== "success")
    return res.status(500).json({
      message: "Failed to log out",
    })

  res.json({
    message: "Logged out",
  })
}

// HELPERS

async function sendAccountChangesNotification(response) {
  let notified = await new Mail(response.appName).notifyOnAccountChanges(
    response
  )
  return notified
}

module.exports = {
  deleteApp,
  generateAppKeys,
  logOut,
}
