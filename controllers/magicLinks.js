const {
  magicLinkTokenIndex,
  magicLinksCollection,
  appUrl,
  appSalt2,
  timeOut,
  magicLinksEmailIndex,
  mlauthServiceClient,
} = require("./../vars")
const Session = require("./../auth/session")
const Database = require("./../db")
const db = new Database()
const {
  hashPassword,
  createHexToken,
  nowInSeconds,
  comparePasswordHashes,
  result,
} = require("./../utils")
const Mail = require("./../mail")

/**
 * @description Receives a login request from an authenticated client
 * Sends a magic link to the provided email
 * Responds to the client with JSON and a 201 status code
 */
async function createMagicLink(req, res) {
  const {
    app: { name: appName, callbackUrl, id: appId, magicLinkTimeout },
    email,
  } = req.body
  if (!email)
    return res.status(403).json({
      message: `Missing credentials: [email]`,
    })

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
    magicLinkData
  )

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
 * Verifies a magic link
 */
async function verifyMagicLink(req, res) {
  let { account, token } = req.body,
    finalData,
    finalMessage = "Magic link is active"

  if (!token)
    return res.status(403).json({
      message: "Missing credentials. [token]",
    })

  const { status: findStatus, data: magicLinkData } = await db.find(
    magicLinkTokenIndex,
    token
  )

  if (findStatus !== "success" || !magicLinkData)
    return res.status(401).json({
      message: "Unknown token",
    })

  finalData = {
    magicLink: magicLinkData.data,
  }

  if (!checkMagicLinkValidity(magicLinkData))
    return res.json({
      magicLink: magicLinkData,
      message: "Magic link has expired",
    })

  // starts a login session for the mlAuth front-end client
  if (account.client === mlauthServiceClient) {
    let { status: sessionStatus, data: sessionData } = await new Session(
      token
    ).create(account.refId, account.lifeSpan || timeOut)

    if (sessionStatus !== "success")
      return res.json({
        data: null,
        message: "Failed to start session",
      })
    delete sessionData.appRefId
    finalData.session = sessionData
    finalData.account = account
    finalMessage = "Session started"
  }

  await db.delete(magicLinksCollection, magicLinkData.refId)

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
  verifyMagicLink
}
