const dotenv = require("dotenv")
dotenv.config()
const fetch = require("node-fetch")

const {
  magicLinkMailMarkup,
  verifyAccount,
  accountChangesMarkup,
} = require("./mail-markups")
const { appFromEmail, mlAuthService } = require("./../vars")

class Mail {
  constructor() {
    this.headers = {
      Authorization:
        "Basic " +
        btoa(
          `${process.env.MAILJET_API_KEY}:${process.env.MAILJET_API_SECRET}`
        ),
      "Content-Type": "application/json",
    }
  }

  /**
   * @description This function sends an email
   * @param { Object } data => Email details
   * @returns { Boolean }
   **/
  async sendEmail(data) {
    // return true
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
   * @param { Object } details => Email details
   * @returns { Boolean }
   **/
  async sendMagicLink(appName, email, url) {
    // return true
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
   * @description This function sends a service account verification email
   * @param { Object } details => Service account details
   * @returns { Boolean }
   **/
  async verifyAccount({ firstName, email }, url) {
    // return true
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
   * @param { Object } details => app account details
   * @returns { Boolean }
   **/
  async notifyOnAccountChanges({ firstName, email }, appName) {
    // return true
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
          textPart: `Hello ${firstName}, \n\n Changes have been made to your ${appName} service account.\n\n If you did not make these changes, please notify us.`,
          HTMLPart: accountChangesMarkup(firstName, appName),
        },
      ],
    }

    return this.sendEmail(data)
  }
}

module.exports = Mail
