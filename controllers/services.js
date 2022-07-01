const {
  faunaSecret,
  appSalt1,
  appSalt2,
  appsCollection,
  appUrl,
  timeOut,
  appClientIndex,
  appVerificationTokenIndex,
} = require("./../vars")
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
const Session = require("./../auth/session")

async function createAccount(req, res) {
  let {
    first_name: firstName,
    last_name: lastName,
    app_name: appName,
    email,
  } = req.body
  if (!firstName || !lastName || !appName || !email)
    return res.status(403).json({
      message: "missing credentials",
    })

  let verificationToken = await createHexToken(
    `${email}${appName}${nowInSeconds()}`,
    appSalt2
  )

  let newAccount = {
    user: { firstName, lastName },
    appName,
    email,
    verificationToken,
    createdAt: nowInSeconds(),
    verified: false,
  }

  const { status: createStatus, data: response } = await db.create(
    appsCollection,
    newAccount
  )

  if (createStatus !== "success")
    return res.status(500).json({
      message:
        "Experienced internal error trying to create an account. " + response,
    })

  let verify = await sendVerificationNotification(response)

  res.json({
    account: response,
    message: "Created account",
  })
}

/**
 * Verifies an app's account to complete registration
 */
async function verifyAccount(req, res) {
  const { token } = req.body
  if (!token)
    return res.status(403).json({
      message: "Unknown token",
    })
  const { status: findStatus, data: foundData } = await db.find(
    appVerificationTokenIndex,
    token
  )
  if (findStatus !== "success" || typeof foundData !== "object")
    return res.status(401).json({
      message: "Invalid token",
    })

  let newData = {
    verificationToken: null,
    verified: true,
  }

  let { refId, data } = foundData
  let { status: updateStatus, data: updatedData } = await db.update(
    appsCollection,
    refId,
    newData
  )
  if (updateStatus !== "success")
    return res.status(500).json({
      message: "Internal error when updating data. " + updatedData,
    })

  res.json({
    account: updatedData,
    message: "Account verified",
  })
}

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

async function sendVerificationNotification({
  app,
  user: { firstName },
  email,
  verificationToken,
}) {
  let validationUrl = `${appUrl}/verify?token=${verificationToken}`

  let verifyAccount = await new Mail(app).verifyAccount(
    { firstName, email },
    validationUrl
  )
  return verifyAccount
}

async function sendAccountChangesNotification(response) {
  let notified = await new Mail(response.appName).notifyOnAccountChanges(
    response
  )
  return notified
}

module.exports = {
  createAccount,
  updateApp,
  deleteApp,
  verifyAccount,
  generateAppKeys,
  logOut,
}
