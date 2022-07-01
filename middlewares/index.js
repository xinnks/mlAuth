const { basicAuthentication } = require("./../auth")
const { comparePasswordHashes, result } = require("./../utils")
const { appSalt1, appClientIndex, appRefIdIndex } = require("./../vars")
const Database = require("./../db")
const Session = require("./../auth/session")
const db = new Database()

// authenticates concurrent service requests on the mlAuth client
async function serviceSessionAuthentication(req, res, next) {
  let { body, headers, url } = req

  if (url === "/register" || url === "/verify") return next()

  if (!body.sessionToken)
    return res.status(403).json({
      message: "Authentication failed",
    })

  let { status: sessionStatus, data: sessionData } = await new Session(
    body.sessionToken
  ).verify()

  if (sessionStatus !== "success")
    return res.status(203).json({
      message: "session expired",
    })

  let {
    refId,
    data: { appRefId },
  } = sessionData
  
  const { status: appStatus, data: appData } = await db.find(
    appRefIdIndex,
    appRefId
  )
  if (appStatus !== "success" || !appData) return result("failure", appData)

  req.body = {
    ...req.body,
    session: {
      ...sessionData,
    },
    account: {
      ...Object.assign(appData.data, { refId: appData.refId }),
    },
  }

  next()
}

// authenticates apps trying to make magic link requests & verification
async function appAuthentication(req, res, next) {
  let { body, headers, url, method } = req

  let { status: bAStatus, data: credentials } = basicAuthentication(req)
  if (bAStatus !== "success")
    return res.status(401).json({
      message: credentials,
    })

  let { client, secret } = credentials

  const { status, data: response } = await db.find(appClientIndex, client)
  if (status !== "success" || !response) return result("failure", response)

  let { data, refId } = response
  if (!comparePasswordHashes(secret, data.secret, appSalt1))
    return res.json({
      message: "Wrong credentials. Failed to authenticate service",
    })

  let userData = data.user
  delete data.secret
  delete data.user
  req.body = {
    ...req.body,
    account: Object.assign(data, { ...userData, refId }),
  }

  return next()
}

module.exports = {
  appAuthentication,
  serviceSessionAuthentication,
}
