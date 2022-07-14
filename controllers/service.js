// mlAuth client service Controller

const { appSalt1, appSalt2 } = require("./../vars")
const appDb = require("./../db/apps")
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
 * @description Creates a new App
 */
async function createNewApp(req, res) {
  let { account, name, life_span: magicLinkTimeout, callback_url: callbackUrl, production } = req.body
  let { email, id: ownerId } = account

  let { client, secret } = generateAppKeys(
    email,
    name,
    callbackUrl
  )

  if(await appIsDuplicate(name, ownerId))
    return res.status(409).json({
      message: "App with this name already exists"
    })

  let appData = {
    ownerId,
    name,
    magicLinkTimeout,
    callbackUrl: callbackUrl || timeOut,
    production,
    client,
    secret: hashPassword(secret, appSalt1),
  }

  const { status: appCreationStatus, data: appCreationResponse } =
    await appDb.createApp(appData)

  if (appCreationStatus !== "success")
    return res.json({
      message: `Failed to create app. ${appCreationResponse}`,
    })

  await sendAccountChangesNotification(
    account.firstName,
    account.email,
    account.name
  )

  appCreationResponse.secret = secret
  res.status(201).json({
    app: appCreationResponse,
    message: "App created",
  })
}
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

/**
 * @description Sends a notification email to a user
 * @param {String} firstName - User's first name
 * @param {String} email - Receiver's email
 * @param {String} appName - Name of app
 * @returns
 */
async function sendAccountChangesNotification(firstName, email, appName) {
  return new Mail().notifyOnAccountChanges({ firstName, email }, appName)
}

/**
 * @description Checks if an app with the provided name exists for this user
 * @param {*} name - Name of the app
 * @param {*} ownerId - Id of the app's owner
 */
async function appIsDuplicate(name, ownerId){
  const {status, data} = await appDb.findManyApps({
    name,
    ownerId
  })

  return status === "success" && data.length
}

module.exports = {
  createNewApp,
  deleteApp,
  generateAppKeys,
  logOut,
}
