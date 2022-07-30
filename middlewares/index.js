const { basicAuthentication } = require("./../auth")
const {
  comparePasswordHashes,
  result,
  generateAppKeys,
  insecureProductionAppAccess,
  hashPassword,
} = require("./../utils")
const { appSalt1, mlauthServiceClient } = require("./../vars")
const Session = require("./../auth/session")
const appDb = require("./../db/apps")

/**
 * @description Authenticates concurrent HTTP requests on the mlAuth client
 */
async function serviceSessionAuthentication(req, res, next) {
  let { sessionToken } = req.body

  if (!sessionToken)
    return res.status(401).json({
      message: "Authentication failed",
    })

  let { status: sessionStatus, data: sessionData } = await new Session(
    sessionToken
  ).verify()

  if (sessionStatus !== "success")
    return res.status(401).json({
      message: sessionData,
    })

  let { user } = sessionData

  req.body = {
    ...req.body,
    session: sessionData,
    account: user,
  }

  next()
}

/**
 * @description Authenticates apps trying to use the service to make magic link requests & verifications
 * @returns 
 */
async function appAuthentication(req, res, next) {
  let { status: bAStatus, data: credentials } = basicAuthentication(req)
  if (bAStatus !== "success")
    return res.status(401).json({
      message: credentials,
    })

  let { client, secret } = credentials

  const { status: appFindStatus, data: appInfo } = await appDb.findSingleApp(
    { client },
    { owner: true }
  )
  if (appFindStatus !== "success" || !appInfo)
    return res.status(404).json({
      message: "App not found",
    })

  if (insecureProductionAppAccess(appInfo, req)) {
    let { client: newClient, secret: newSecret } = generateAppKeys(
      email,
      appInfo.name,
      appInfo.callbackUrl
    )

    const { status: appUpdateStatus, data: appUpdateResponse } =
      await appDb.updateApp(appInfo.id, {
        client: newClient,
        secret: hashPassword(newSecret, appSalt1),
      })

    if (appUpdateStatus === "success")
      await sendAccountChangesNotification(
        account.firstName,
        account.email,
        appInfo.name
      )

    return res.status(401).json({
      message: "Production apps can only be accessed via 'https' protocol",
    })
  }

  let { secret: storedSecret } = appInfo
  if (!comparePasswordHashes(secret, storedSecret, appSalt1))
    return res.status(401).json({
      message: "Wrong credentials. Failed to authenticate service",
    })

  // return app's user data when in mlAuth front-end client
  if (appInfo.client === mlauthServiceClient) {
    req.body.account = appInfo.owner
  }
  delete appInfo.secret
  delete appInfo.owner

  req.body = {
    ...req.body,
    app: appInfo,
  }

  return next()
}

module.exports = {
  appAuthentication,
  serviceSessionAuthentication,
}
