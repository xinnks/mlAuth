const userDb = require("./../db/users");
const { sendAccountChangesNotification } = require("./../utils")

/**
 * @description Updates a user account's information
 */
async function updateAccountInformation(req, res) {
  let {
    first_name: firstName,
    last_name: lastName,
    account,
  } = req.body

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
  if(firstName)
    accountUpdateInfo.firstName = firstName
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

module.exports = {
  updateAccountInformation,
}