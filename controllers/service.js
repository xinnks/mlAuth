// mlAuth client service Controller

const { appSalt1, appSalt2 } = require("./../vars")
const appDb = require("./../db/apps")
const { hashPassword, createHexToken, nowInSeconds, sendAccountChangesNotification } = require("./../utils")
const Session = require("./../auth/session")

/**
 * @description Creates a new App
 */
async function createNewApp(req, res) {
  let {
    account,
    name,
    life_span: magicLinkTimeout,
    callback_url: callbackUrl,
    production,
  } = req.body
  let { email, id: ownerId } = account

  let { client, secret } = generateAppKeys(email, name, callbackUrl)

  if (await appIsDuplicate(name, ownerId))
    return res.status(409).json({
      message: "App with this name already exists",
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

/**
 * @description Regenerates App's keys
 */
async function regenerateAppKeys(req, res) {
  let { account, app_id: appId } = req.body
  let { email } = account

  let appInfo = await getAppInformation(appId)

  if (!appInfo)
    return res.status(404).json({
      message: "App not found",
    })

  let { client, secret } = generateAppKeys(
    email,
    appInfo.name,
    appInfo.callbackUrl
  )

  let updatedKeys = {
    client,
    secret: hashPassword(secret, appSalt1),
  }

  const { status: appUpdateStatus, data: appUpdateResponse } =
    await appDb.updateApp(appId, updatedKeys)

  if (appUpdateStatus !== "success")
    return res.json({
      message: `Failed to change app keys. ${updateResponse}`,
    })

  await sendAccountChangesNotification(
    account.firstName,
    account.email,
    appInfo.name
  )

  appUpdateResponse.secret = secret
  res.json({
    app: appUpdateResponse,
    message: "Updated app keys",
  })
}

/**
 * @description Updates an app's information
 */
async function updateAppInformation(req, res) {
  let {
    name,
    production,
    callback_url: callbackUrl,
    life_span: lifeSpan,
    account,
    app_id: appId,
  } = req.body

  if (!appId)
    return res.status(422).json({
      message: "Missing parameters. [ap_id]",
    })

  let appInfo = await getAppInformation(appId)

  if (!appInfo)
    return res.status(404).json({
      message: "App not found",
    })

  let updatedInfo = {
    name: name || appInfo.name,
    production: production ? !!production : appInfo.production,
    magicLinkTimeout: lifeSpan || appInfo.magicLinkTimeout,
    callbackUrl: callbackUrl || appInfo.callbackUrl,
  }

  const { status: appUpdateStatus, data: appUpdateResponse } =
    await appDb.updateApp(appId, updatedInfo)

  if (appUpdateStatus !== "success")
    return res.json({
      message: "Failed to update app" + appUpdateResponse,
    })

  await sendAccountChangesNotification(
    account.firstName,
    account.email,
    appInfo
  )

  delete appUpdateResponse.secret
  res.json({
    app: appUpdateResponse,
    message: "App updated",
  })
}

/**
 * @description Deletes an app
 */
async function deleteApp(req, res) {
  const { app_id: appId } = req.body
  if (!appId)
    return res.status(422).json({
      message: "Missing parameters. [app_id]",
    })

  const exists = await getAppInformation(appId)
  if (!exists)
    return res.status(404).json({
      message: "App doesn't exist",
    })

  const { status: appDeleteStatus, data } = await appDb.deleteApp(appId)
  if (appDeleteStatus !== "success")
    return res.status(500).json({
      message: "Failed to delete app",
    })

  return res.status(204).json({
    data,
    message: "App deleted",
  })
}

/**
 * @description Log's out users from mlAuth's website session
 */
async function logOut(req, res) {
  let { sessionToken } = req.body

  let { status, data } = await new Session(sessionToken).delete()

  if (status !== "success")
    return res.status(500).json({
      message: "Failed to log out",
    })

  res.json({
    data,
    message: "Logged out",
  })
}

// HELPERS

/**
 * @description fetches app information from the database
 * @param {String} appId id of the app whose info is to be fetched
 * @returns {Object|Boolean}
 */
async function getAppInformation(appId) {
  const { status, data } = await appDb.findSingleApp({ id: appId })
  if (status !== "success") return null
  return data
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

/**
 * @description Checks if an app with the provided name exists for this user
 * @param {*} name - Name of the app
 * @param {*} ownerId - Id of the app's owner
 */
async function appIsDuplicate(name, ownerId) {
  const { status, data } = await appDb.findManyApps({
    name,
    ownerId,
  })

  return status === "success" && data.length
}

module.exports = {
  createNewApp,
  regenerateAppKeys,
  updateAppInformation,
  deleteApp,
  logOut,
}
