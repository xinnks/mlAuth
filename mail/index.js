const dotenv = require("dotenv")
dotenv.config()
const fetch = require("node-fetch")

const {
  magicLinkMailMarkup,
  verifyAccount,
  accountChangesMarkup,
  accountDeletionMarkup,
} = require("./mail-markups")
const { appFromEmail, mlAuthService } = require("./../vars")

class Mail {
  constructor() {
    const keys = Buffer.from(
      `${process.env.MAILJET_API_KEY}:${process.env.MAILJET_API_SECRET}`,
      "utf8"
    )
    this.headers = {
      Authorization: `Basic ${keys.toString("base64")}`,
      "Content-Type": "application/json",
    }
  }

  /**
   * @description This function sends an email
   * @param { Object } data => Email details
   * @returns { Boolean }
   **/
  async sendEmail(data) {
    try {
      await fetch(`https://api.mailjet.com/v3.1/send`, {
        method: "POST",
        headers: this.headers,
        body: JSON.stringify(data),
      })
      return true
    } catch (error) {
      console.log(error)
      return false
    }
  }

  /**
   * @description This function sends a magic link email to an email address
   * @param { String } appName => Name of app sending the magic link
   * @param { String } email => Receiving email address
   * @param { String } url => Magic link url
   * @returns { Boolean }
   **/
  async sendMagicLink(appName, email, url) {
    const data = {
      Messages: [
        {
          From: {
            Email: appFromEmail,
            Name: appName,
          },
          To: [
            {
              Email: email,
              Name: "",
            },
          ],
          Subject: "Login to " + appName,
          TextPart: `Hey, \n\n Visit this link to login.\n\n ${url}\n\n Thanks, ${appName}`,
          HTMLPart: magicLinkMailMarkup(url, appName),
        },
      ],
    }

    return this.sendEmail(data)
  }

  /**
   * @description This function sends an account verification email
   * @param { Object } user => User's data
   * @param { String } user.firstName => User's first name
   * @param { String } user.email => User's email
   * @param { String } url => Account verification url
   * @returns { Boolean }
   **/
  async verifyAccount({ firstName, email }, url) {
    const data = {
      Messages: [
        {
          From: {
            Email: appFromEmail,
            Name: mlAuthService,
          },
          To: [
            {
              Email: email,
              Name: firstName,
            },
          ],
          Subject: "Verify Your mlAuth Account",
          textPart: `Hello ${firstName}, \n\n Visit this link to verify your email and activate your mlAuth account.\n\n ${url}\n\n Thanks`,
          HTMLPart: verifyAccount(firstName, url),
        },
      ],
    }

    return this.sendEmail(data)
  }

  /**
   * @description This function sends a notification email to an account on account details changes
   * @param { Object } user => User's data
   * @param { String } user.firstName => User's first name
   * @param { String } user.email => User's email
   * @param { String|null } appName => Name of the app that changes have been made to
   * @returns { Boolean }
   **/
  async notifyOnAccountChanges({ firstName, email }, appName = null) {
    const data = {
      Messages: [
        {
          From: {
            Email: appFromEmail,
            Name: mlAuthService,
          },
          To: [
            {
              Email: email,
              Name: firstName,
            },
          ],
          Subject: "Account Changes",
          textPart: `Hello ${firstName}, \n\n Changes have been made to your ${appName} app account.\n\n If you did not make these changes, please notify us.`,
          HTMLPart: accountChangesMarkup(firstName, appName),
        },
      ],
    }

    return this.sendEmail(data)
  }

  /**
   * @description This function sends a notification email to a user notifying them of the deletion of their account
   * @param { Object } user => User's data
   * @param { String } user.firstName => User's first name
   * @param { String } user.email => User's email
   * @returns { Boolean }
   **/
  async notifyOnAccountDeletion({ firstName, email }) {
    const data = {
      Messages: [
        {
          From: {
            Email: appFromEmail,
            Name: mlAuthService,
          },
          To: [
            {
              Email: email,
              Name: firstName,
            },
          ],
          Subject: "Account Deletion",
          textPart: `Hey ${firstName}, \n\n It's been fun having you here.\n\n Though sad to see you go, we know every beginning has an end. \n\n Tchao! dev.`,
          HTMLPart: accountDeletionMarkup(firstName),
        },
      ],
    }

    return this.sendEmail(data)
  }
}

module.exports = Mail
