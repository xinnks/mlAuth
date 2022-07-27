const userDb = require("./../db/users")
const appDb = require("./../db/apps")
const sessionDb = require("./../db/sessions")
const magicLinkDb = require("./../db/magic-links")
const { sendAccountChangesNotification } = require("./../utils")
const Mail = require("./../mail")

/**
 * @description Updates a user account's information
 */
async function updateAccountInformation(req, res) {
  let { first_name: firstName, last_name: lastName, account } = req.body

  if (!firstName && !lastName)
    return res.status(422).json({
      message: "Missing parameters. [first_name, last_name]",
    })

  if (firstName === account.firstName)
    if (lastName === account.lastName)
      return res.json({
        account,
        message: "No changes made"
      })

  let accountUpdateInfo
  accountUpdateInfo = {}
  if (firstName) accountUpdateInfo.firstName = firstName
  if (lastName) accountUpdateInfo.lastName = lastName
  if(lastName)
    accountUpdateInfo.lastName = lastName

  const { status: accountUpdateStatus, data: accountUpdateResponse } =
    await userDb.updateUser(account.id, accountUpdateInfo)

  if (accountUpdateStatus !== "success")
    return res.json({
      message: "Failed to update account" + accountUpdateResponse,
    })

  await sendAccountChangesNotification(
    accountUpdateResponse.firstName,
    accountUpdateResponse.email,
  )

  res.json({
    account: accountUpdateResponse,
    message: "Account updated",
  })
}

/**
 * @description Delete all user information from service
 */
async function deleteAccount(req, res) {
  let { account } = req.body

  if(await deleteAllUserSessions(account.id) !== "success")
  if ((await deleteAllUserSessions(account.id)) !== "success")
    res.status(500).json({
      message: "Failed to delete user's sessions",
    })

  if(await deleteAllUserApps(account.id) !== "success")
  if ((await deleteAllUserApps(account.id)) !== "success")
    res.status(500).json({
      message: "Failed to delete user's apps",
    })

  if(await deleteUserAccount(account.id) !== "success")
  if ((await deleteUserAccount(account.id)) !== "success")
    res.status(500).json({
      message: "Failed to delete user's account",
    })

  await sendAccountDeletionNotification(account.firstName, account.email)

  res.json({
    account,
    message: "Account deleted",
  })
}

/**
 * @description Deletes all sessions belonging to user
 * @param {String} userId
 * */
async function deleteAllUserSessions(userId){
  if(!userId) return null;
  if (!userId) return null
  const { status: sessionDeletionStatus } = await sessionDb.deleteSessions({
    userId,
  })
  return sessionDeletionStatus
}

/**
 * @description Deletes all apps belonging to user
 * @param {String} userId
 * */
async function deleteAllUserApps(userId){
  if(!userId) return null;
  if (!userId) return null
  const { status: appsDeletionStatus } = await appDb.deleteApps({
    ownerId: userId,
  })
  return appsDeletionStatus
}

/**
 * @description Deletes a user
 * @param {String} userId
 * */
async function deleteUserAccount(userId){
  if(!userId) return null;
  if (!userId) return null
  const { status: accountDeletionStatus } = await userDb.deleteUser(userId)
  return accountDeletionStatus
}

/**
 * @description Sends an email to user notifying them of the deletion of their account
 * @param {String} firstName - User's first name
 * @param {String} email - Receiver's email
 * @returns
 */
async function sendAccountDeletionNotification(firstName, email) {
  return new Mail().notifyOnAccountDeletion({ firstName, email })
}

module.exports = {
  updateAccountInformation,
  deleteAccount,
}
