const {
  magicLinkTokenIndex,
  magicLinksCollection,
  appUrl,
  appSalt2,
  timeOut,
  mlauthServiceClient,
} = require("./../vars")
const Session = require("./../auth/session")
const magicLinksDb = require("./../db/magic-links")
const appsDb = require("./../db/apps")
const usersDb = require("./../db/users")
const { createHexToken, nowInSeconds, hashPassword } = require("./../utils")
const Mail = require("./../mail")

/**
 * @description Receives a login request from an authenticated client
 * Sends a magic link to the provided email
 * Responds to the client with JSON and a 201 status code
 */
async function createMagicLink(req, res) {
  const {
    app: {
      name: appName,
      callbackUrl,
      id: appId,
      magicLinkTimeout,
      client: appClientKey,
    },
    email,
  } = req.body
  if (!email)
    return res.status(422).json({
      message: `Missing credentials: [email]`,
    })

  // If visiting mlAuth's client site
  // User must be registered to proceed with making a magic link request
  if (appClientKey === mlauthServiceClient) {
    if (!(await checkAccountEmail(email)))
      return res.status(404).json({
        message: "Account doesn't exist!",
      })
  }

  let { exists, data: activeMagicLink } = await checkForActiveMagicLink(
      appId,
      email,
      magicLinkTimeout || timeOut
    ),
    token

  if (exists) {
    ;({ token } = activeMagicLink)

    await notifyUser({ appName, callbackUrl }, email, token)

    return res.json({
      data: activeMagicLink,
      message: "Sent previous login request",
    })
  }

  token = createHexToken(`${email}${appName}${nowInSeconds()}`, appSalt2)

  let magicLinkData = {
    token,
    email,
    lifespan: parseInt(magicLinkTimeout || timeOut),
    appId,
  }
  const { status: creationStatus, data: creationResponse } =
    await magicLinksDb.createLink(magicLinkData)

  if (creationStatus !== "success")
    return res.status(401).json({
      message: creationResponse,
    })

  await notifyUser({ appName, callbackUrl }, email, token)

  res.json({
    data: creationResponse,
    message: "Created a login request",
  })
}

/**
 * @description Receives a login verification request
 * Sends a magic link to the provided email
 * Responds to the client with JSON and a 201 status code
 */
async function verifyMagicLink(req, res) {
  let finalData,
    finalMessage = "Magic link is active",
    { app, account, token: magicLinkToken } = req.body

  if (!magicLinkToken)
    return res.status(401).json({
      message: "Missing credentials. [token]",
    })

  const { status: findStatus, data: magicLinkData } =
    await magicLinksDb.findLink({
      token: magicLinkToken,
    })

  if (findStatus !== "success" || !magicLinkData)
    return res.status(401).json({
      message: "Unknown magic link",
    })

  finalData = {
    magicLink: magicLinkData,
  }

  if (!checkMagicLinkValidity(magicLinkData))
    return res.json({
      magicLink: magicLinkData,
      message: "Magic link has expired",
    })

  // Gets user data based on log in request email
  // starts a login session for the mlAuth front-end client
  if (app.client === mlauthServiceClient) {
    let { status: fetchUserStatus, data: userData } =
      await usersDb.findSingleUser({
        email: magicLinkData.email,
      })
    if (fetchUserStatus !== "success" || !userData)
      return res.status(404).json({
        message: "User not found",
      })

    let sessionToken = hashPassword(magicLinkToken, appSalt2)
    let { status: sessionInitiateStatus, data: sessionData } =
      await new Session(sessionToken).create(userData.id, timeOut)

    if (sessionInitiateStatus !== "success")
      return res.status(500).json({
        data: null,
        message: "Failed to start session",
      })

    finalData.apps = []
    let { status: appsFetchStatus, data: fetchedApps } =
      await appsDb.findManyApps({
        ownerId: userData.id,
      })

    if (appsFetchStatus == "success" && fetchedApps.length)
      finalData.apps = fetchedApps.map((app) => {
        delete app.secret
        return app
      })

    delete sessionData.appId
    delete userData.verificationToken
    finalData.session = sessionData
    finalData.account = userData
    finalMessage = "Session started"
  }

  await magicLinksDb.deleteLink(magicLinkData.id)

  res.json({
    ...finalData,
    message: finalMessage,
  })
}

/// HELPERS

async function checkForActiveMagicLink(appId, authUserEmail, timeout) {
  let { status, data: magicLinks } = await magicLinksDb.findLinks({
    email: authUserEmail,
    appId,
  })
  if (status !== "success" || !magicLinks.length) return { exists: false }

  const requestUnderTimeout = (element) =>
    nowInSeconds() - Date.parse(element.createdAt) < timeout - 20000

  let index = magicLinks.findIndex(requestUnderTimeout)

  if (index === -1) return { exists: false }

  return { exists: true, data: magicLinks[index] }
}

async function checkMagicLinkValidity({ createdAt, lifespan }) {
  return nowInSeconds() - Date.parse(createdAt) < lifespan - 10000
}

/**
 * @description Checks if email belongs to a registered user
 * @param {String} email - Account email
 * */
async function checkAccountEmail(email) {
  let { status: fetchUserStatus, data: userData } =
    await usersDb.findSingleUser({
      email,
    })

  return fetchUserStatus === "success" && userData
}

async function notifyUser({ appName, callbackUrl }, email, token) {
  let loginUrl = `${callbackUrl}?token=${token}`,
    sent = false

  while (!sent) {
    sent = new Mail().sendMagicLink(appName, email, loginUrl)
  }

  return true
}

module.exports = {
  createMagicLink,
  verifyMagicLink,
}
