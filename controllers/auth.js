// Authentication Controller

const { appSalt2, appUrl } = require("../vars")
const db = require("../db/users")
const {
  createHexToken,
  nowInSeconds,
  getMissingParameters,
} = require("../utils")
const Mail = require("../mail")

/**
 * @description Creates a new user's account
 * Sends account verification email
 * */
async function createAccount(req, res) {
  const missing = getMissingParameters(
      ["first_name", "last_name", "email"],
      req.body
    ),
    { first_name: firstName, last_name: lastName, email } = req.body
  if (missing.length)
    return res.status(422).json({
      message: `Missing parameters. [${missing}]`,
    })

  let verificationToken = createHexToken(`${email}${nowInSeconds()}`, appSalt2)

  let newAccount = {
    email,
    firstName,
    lastName,
    verificationToken,
  }

  const { status: registrationStatus, data: response } = await db.createUser(
    newAccount
  )

  if (registrationStatus !== "success")
    return res.status(500).json({
      message: response,
    })

  await sendVerificationNotification(response)

  res.status(201).json({
    data: response,
    message: "Account created",
  })
}

/**
 * @description Verifies a newly registered user's account to complete the registration
 */
async function verifyAccount(req, res) {
  const missing = getMissingParameters(["token"], req.body)
  if (missing.length)
    return res.status(422).json({
      message: `Missing parameters. [${missing}]`,
    })

  const { token: verificationToken } = req.body
  const { status: findStatus, data: foundData } = await db.findSingleUser({
    verificationToken,
  })
  if (findStatus !== "success" || !foundData)
    return res.status(401).json({
      message: "Invalid token",
    })

  const updatedAccountData = {
    verificationToken: null,
    verified: true,
  }

  const { status: updateStatus, data: updatedData } = await db.updateUser(
    foundData.id,
    updatedAccountData
  )
  if (updateStatus !== "success")
    return res.status(500).json({
      message: `Internal error when updating data. [${updatedData}]`,
    })

  res.json({
    account: updatedData,
    message: "Account verified",
  })
}

// HELPERS

/**
 * @description Sends account verification email to a newly registered user
 * @param {String} firstName
 * @param {String} email
 * @param {String} verificationToken
 * */
async function sendVerificationNotification({
  firstName,
  email,
  verificationToken,
}) {
  let validationUrl = `${appUrl}/verify?token=${verificationToken}`,
    sent = false

  while (!sent) {
    sent = new Mail().verifyAccount({ firstName, email }, validationUrl)
  }

  return true
}

module.exports = {
  createAccount,
  verifyAccount,
}
