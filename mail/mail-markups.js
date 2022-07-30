const { mlAuthService, appUrl: mlAuthUrl } = require("./../vars")

const mlAuthLogo = `
  <tr>
    <td align="center" class="sm-px-6">
      <table class="sm-w-full" style="width: 75%" cellpadding="0" cellspacing="0" role="presentation">
        <tr>
          <td class="sm-pb-2" style="display: flex; width: 100%; padding-bottom: 8px">
            <div style="display: flex; justify-content: center; border-top-left-radius: 12px; border-bottom-left-radius: 12px; background-color: #f9e80f; padding-left: 8px; padding-right: 8px">
              <img alt="mlAuth logo" src="https://res.cloudinary.com/djx5h4cjt/image/upload/c_scale,w_60/v1656599841/mlAuth/mlAuth.png" style="width: 48px; align-self: center">
            </div>
            <div style="display: inline-flex; flex: 1 1 0%; align-items: center; justify-content: center; border-top-right-radius: 12px; border-bottom-right-radius: 12px; background-color: #fcf487; padding-left: 8px">
              <span style="padding-top: 16px; padding-bottom: 16px; font-size: 24px; font-weight: 600; color: #1f2937">mlAuth</span>
            </div>
          </td>
        </tr>
      </table>
    </td>
  </tr>`

const footerMarkup = `
  <tr>
    <td style="padding: 32px; text-align: center; font-size: 12px; color: #4b5563">
      <p style="margin: 0 0 16px; display: flex; align-items: center; justify-content: center; text-transform: uppercase">
        <span>Powered By </span>
        <a href="${mlAuthUrl}" style="margin-left: 8px; margin-right: 8px">
          <img alt="mlAuth" src="https://res.cloudinary.com/djx5h4cjt/image/upload/c_scale,w_60/v1656599841/mlAuth/mlAuth.png" style="width: 32px; align-self: center">
        </a>
      </p>
      <p style="margin: 0; font-style: italic">Securely authenticate your users</p>
      <p style="margin: 0">
        <a href="${mlAuthUrl}" class="hover-text-decoration-underline" style="text-decoration: none; color: #3b82f6">Website</a> &bull;
        <a href="${mlAuthUrl}/docs/" class="hover-text-decoration-underline" style="text-decoration: none; color: #3b82f6">Docs</a>
      </p>
    </td>
  </tr>`

const dynamicEmailHeader = (appName) =>
  appName === mlAuthService ? mlAuthLogo : ``

function magicLinkMailMarkup(url, appName) {
  return new String(`
  <!DOCTYPE html>
  <html lang="en" xmlns:v="urn:schemas-microsoft-com:vml">
    <head>
      <meta charset="utf-8">
      <meta name="x-apple-disable-message-reformatting">
      <meta http-equiv="x-ua-compatible" content="ie=edge">
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <meta name="format-detection" content="telephone=no, date=no, address=no, email=no">
      <meta name="color-scheme" content="light dark">
      <meta name="supported-color-schemes" content="light dark">
      <!--[if mso]>
      <noscript>
        <xml>
          <o:OfficeDocumentSettings xmlns:o="urn:schemas-microsoft-com:office:office">
            <o:PixelsPerInch>96</o:PixelsPerInch>
          </o:OfficeDocumentSettings>
        </xml>
      </noscript>
      <style>
        td,th,div,p,a,h1,h2,h3,h4,h5,h6 {font-family: "Segoe UI", sans-serif; mso-line-height-rule: exactly;}
      </style>
      <![endif]-->
      <title>Log In to ${appName}</title>
      <style>
        .hover-border-2:hover {
          border-width: 2px !important;
        }
        .hover-border-gray-700:hover {
          border-color: #374151 !important;
        }
        .hover-bg-primary-600:hover {
          background-color: #f8e50d !important;
        }
        .hover-text-gray-700:hover {
          color: #374151 !important;
        }
        .hover-text-decoration-underline:hover {
          text-decoration: underline;
        }
        @media (max-width: 600px) {
          .sm-h-8 {
            height: 32px !important;
          }
          .sm-w-full {
            width: 100% !important;
          }
          .sm-px-6 {
            padding-left: 24px !important;
            padding-right: 24px !important;
          }
          .sm-pb-2 {
            padding-bottom: 8px !important;
          }
          .sm-pb-3 {
            padding-bottom: 12px !important;
          }
        }
      </style>
    </head>
    <body style="word-break: break-word; -webkit-font-smoothing: antialiased; margin: 0; width: 100%; background-color: #e5e7eb; padding: 0">
      <div role="article" aria-roledescription="email" aria-label="Log In to ${appName}" lang="en">
        <table style="width: 100%; font-family: ui-sans-serif, system-ui, -apple-system, 'Segoe UI', sans-serif" cellpadding="0" cellspacing="0" role="presentation">
          <tr>
            <td align="center" style="background-color: #e5e7eb; padding-top: 24px; padding-bottom: 24px">
              <table class="sm-w-full" style="width: 600px" cellpadding="0" cellspacing="0" role="presentation">
                ${dynamicEmailHeader(appName)}
                <tr>
                  <td class="sm-pb-3" style="padding: 0 16px 8px; text-align: center">
                    <h1 style="font-size: 24px; font-weight: 600; color: #000">Log in to ${appName}</h1>
                  </td>
                </tr>
                <tr>
                  <td align="center" class="sm-px-6">
                    <table class="sm-w-full" style="width: 75%" cellpadding="0" cellspacing="0" role="presentation">
                      <tr>
                        <td class="sm-px-6" style="background-color: #fff; padding: 48px; text-align: center">
                          <p style="margin: 0; font-size: 18px; font-weight: 600">Hey there,</p>
                          <p style="font-size: 16px; color: #374151">Follow this link to login</p>
                          <div class="sm-h-8" style="line-height: 24px">&zwnj;</div>
                          <a href="${url}" class="hover-bg-primary-600 hover-text-gray-700 hover-border-2 hover-border-gray-700" style="text-decoration: none; display: inline-block; border-radius: 9999px; border-width: 0px; background-color: #374151; padding: 20px 24px; font-size: 14px; font-weight: 600; text-transform: uppercase; line-height: 1; color: #fff">
                            <!--[if mso]><i style="letter-spacing: 24px; mso-font-width: -100%; mso-text-raise: 26pt;">&nbsp;</i><![endif]-->
                            <span style="mso-text-raise: 13pt">Log in &rarr;</span>
                            <!--[if mso]><i style="letter-spacing: 24px; mso-font-width: -100%;">&nbsp;</i><![endif]-->
                          </a>
                          <div class="sm-h-8" style="line-height: 24px">&zwnj;</div>
                          <p style="font-size: 16px; color: #374151">If the link above doesn't work, copy and visit the link below on your browser.</p>
                          <p style="font-size: 16px; color: #374151"><i>${url}</i></p>
                        </td>
                      </tr>
                      <tr>
                        <td style="height: 2px; background-color: #d1d5db; padding: 8px"></td>
                      </tr>
                      ${footerMarkup}
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </div>
    </body>
  </html>
  `)
}

function verifyAccount(firstName, url) {
  return new String(`
  <!DOCTYPE html>
    <html lang="en" xmlns:v="urn:schemas-microsoft-com:vml">
    <head>
      <meta charset="utf-8">
      <meta name="x-apple-disable-message-reformatting">
      <meta http-equiv="x-ua-compatible" content="ie=edge">
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <meta name="format-detection" content="telephone=no, date=no, address=no, email=no">
      <meta name="color-scheme" content="light dark">
      <meta name="supported-color-schemes" content="light dark">
      <!--[if mso]>
      <noscript>
        <xml>
          <o:OfficeDocumentSettings xmlns:o="urn:schemas-microsoft-com:office:office">
            <o:PixelsPerInch>96</o:PixelsPerInch>
          </o:OfficeDocumentSettings>
        </xml>
      </noscript>
      <style>
        td,th,div,p,a,h1,h2,h3,h4,h5,h6 {font-family: "Segoe UI", sans-serif; mso-line-height-rule: exactly;}
      </style>
      <![endif]-->
      <title>Confirm Your mlAuth Registration</title>
      <style>
        .hover-border-2:hover {
          border-width: 2px !important;
        }
        .hover-border-gray-700:hover {
          border-color: #374151 !important;
        }
        .hover-bg-primary-600:hover {
          background-color: #f8e50d !important;
        }
        .hover-text-gray-700:hover {
          color: #374151 !important;
        }
        .hover-text-decoration-underline:hover {
          text-decoration: underline;
        }
        @media (max-width: 600px) {
          .sm-h-8 {
            height: 32px !important;
          }
          .sm-w-full {
            width: 100% !important;
          }
          .sm-px-6 {
            padding-left: 24px !important;
            padding-right: 24px !important;
          }
          .sm-px-8 {
            padding-left: 32px !important;
            padding-right: 32px !important;
          }
          .sm-pb-2 {
            padding-bottom: 8px !important;
          }
          .sm-pb-3 {
            padding-bottom: 12px !important;
          }
        }
      </style>
    </head>
    <body style="word-break: break-word; -webkit-font-smoothing: antialiased; margin: 0; width: 100%; background-color: #e5e7eb; padding: 0">
      <div role="article" aria-roledescription="email" aria-label="Confirm your mlAuth registration" lang="en">
        <table style="width: 100%; font-family: ui-sans-serif, system-ui, -apple-system, 'Segoe UI', sans-serif" cellpadding="0" cellspacing="0" role="presentation">
          <tr>
            <td align="center" style="background-color: #e5e7eb; padding-top: 24px; padding-bottom: 24px">
              <table class="sm-w-full" style="width: 600px" cellpadding="0" cellspacing="0" role="presentation">
                <tr>
                  <td align="center" class="sm-px-6">
                    <table class="sm-w-full" style="width: 75%" cellpadding="0" cellspacing="0" role="presentation">
                      <tr>
                        <td class="sm-pb-2" style="display: flex; width: 100%; padding-bottom: 8px">
                          <div style="display: flex; justify-content: center; border-top-left-radius: 12px; border-bottom-left-radius: 12px; background-color: #f9e80f; padding-left: 8px; padding-right: 8px">
                            <img alt="mlAuth logo" src="https://res.cloudinary.com/djx5h4cjt/image/upload/c_scale,w_60/v1656599841/mlAuth/mlAuth.png" style="width: 48px; align-self: center">
                          </div>
                          <div style="display: inline-flex; flex: 1 1 0%; align-items: center; justify-content: center; border-top-right-radius: 12px; border-bottom-right-radius: 12px; background-color: #fcf487; padding-left: 8px">
                            <span style="padding-top: 16px; padding-bottom: 16px; font-size: 24px; font-weight: 600; color: #1f2937">mlAuth</span>
                          </div>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                <tr>
                  <td class="sm-pb-3" style="padding-bottom: 8px; text-align: center">
                    <h1 style="font-size: 24px; font-weight: 600; color: #000">Confirm your registration</h1>
                  </td>
                </tr>
                <tr>
                  <td align="center" class="sm-px-8">
                    <table class="sm-w-full" style="width: 75%" cellpadding="0" cellspacing="0" role="presentation">
                      <tr>
                        <td class="sm-px-6" style="background-color: #fff; padding: 48px; text-align: center">
                          <p style="margin: 0; font-size: 18px; font-weight: 600">Hello ${firstName},</p>
                          <p style="font-size: 16px; color: #374151">Follow this link to confirm your account:</p>
                          <div class="sm-h-8" style="line-height: 24px">&zwnj;</div>
                          <a href="${url}" class="hover-bg-primary-600 hover-text-gray-700 hover-border-2 hover-border-gray-700" style="text-decoration: none; display: inline-block; border-radius: 9999px; border-width: 0px; background-color: #374151; padding: 20px 24px; font-size: 14px; font-weight: 600; text-transform: uppercase; line-height: 1; color: #fff">
                            <!--[if mso]><i style="letter-spacing: 24px; mso-font-width: -100%; mso-text-raise: 26pt;">&nbsp;</i><![endif]-->
                            <span style="mso-text-raise: 13pt">Confirm &rarr;</span>
                            <!--[if mso]><i style="letter-spacing: 24px; mso-font-width: -100%;">&nbsp;</i><![endif]-->
                          </a>
                          <div class="sm-h-8" style="line-height: 24px">&zwnj;</div>
                          <p style="font-size: 16px; color: #374151">If the link above doesn't work, copy and visit the link below on your browser.</p>
                          <p style="font-size: 16px; color: #374151"><i>${url}</i></p>
                        </td>
                      </tr>
                      <tr>
                        <td style="height: 2px; background-color: #d1d5db; padding: 8px"></td>
                      </tr>
                      ${footerMarkup}
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </div>
    </body>
    </html>
  `)
}

function accountChangesMarkup(firstName, appName = null) {
  return new String(`
  <!DOCTYPE html>
  <html lang="en" xmlns:v="urn:schemas-microsoft-com:vml">
    <head>
      <meta charset="utf-8">
      <meta name="x-apple-disable-message-reformatting">
      <meta http-equiv="x-ua-compatible" content="ie=edge">
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <meta name="format-detection" content="telephone=no, date=no, address=no, email=no">
      <meta name="color-scheme" content="light dark">
      <meta name="supported-color-schemes" content="light dark">
      <!--[if mso]>
      <noscript>
        <xml>
          <o:OfficeDocumentSettings xmlns:o="urn:schemas-microsoft-com:office:office">
            <o:PixelsPerInch>96</o:PixelsPerInch>
          </o:OfficeDocumentSettings>
        </xml>
      </noscript>
      <style>
        td,th,div,p,a,h1,h2,h3,h4,h5,h6 {font-family: "Segoe UI", sans-serif; mso-line-height-rule: exactly;}
      </style>
      <![endif]-->
      <title>Account Changes</title>
      <style>
        .hover-text-decoration-underline:hover {
          text-decoration: underline;
        }
        @media (max-width: 600px) {
          .sm-h-8 {
            height: 32px !important;
          }
          .sm-w-full {
            width: 100% !important;
          }
          .sm-px-6 {
            padding-left: 24px !important;
            padding-right: 24px !important;
          }
          .sm-pb-2 {
            padding-bottom: 8px !important;
          }
        }
      </style>
    </head>
    <body style="word-break: break-word; -webkit-font-smoothing: antialiased; margin: 0; width: 100%; background-color: #e5e7eb; padding: 0">
      <div role="article" aria-roledescription="email" aria-label="Account Changes" lang="en">
        <table style="width: 100%; font-family: ui-sans-serif, system-ui, -apple-system, 'Segoe UI', sans-serif" cellpadding="0" cellspacing="0" role="presentation">
          <tr>
            <td align="center" style="background-color: #e5e7eb; padding-top: 24px; padding-bottom: 24px">
              <table class="sm-w-full" style="width: 600px" cellpadding="0" cellspacing="0" role="presentation">
                <tr>
                  <td align="center" class="sm-px-6">
                    <table class="sm-w-full" style="width: 75%" cellpadding="0" cellspacing="0" role="presentation">
                      <tr>
                        <td class="sm-pb-2" style="display: flex; width: 100%; padding-bottom: 8px">
                          <div style="display: flex; justify-content: center; border-top-left-radius: 12px; border-bottom-left-radius: 12px; background-color: #f9e80f; padding-left: 8px; padding-right: 8px">
                            <img alt="mlAuth logo" src="https://res.cloudinary.com/djx5h4cjt/image/upload/c_scale,w_60/v1656599841/mlAuth/mlAuth.png" style="width: 48px; align-self: center">
                          </div>
                          <div style="display: inline-flex; flex: 1 1 0%; align-items: center; justify-content: center; border-top-right-radius: 12px; border-bottom-right-radius: 12px; background-color: #fcf487; padding-left: 8px">
                            <span style="padding-top: 16px; padding-bottom: 16px; font-size: 24px; font-weight: 600; color: #1f2937">mlAuth</span>
                          </div>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                <tr>
                  <td align="center" class="sm-px-6">
                    <h1 style="font-size: 24px; font-weight: 600; color: #000">Account changes made</h1>
                  </td>
                </tr>
                <tr>
                  <td align="center" class="sm-px-6">
                    <table class="sm-w-full" style="width: 75%" cellpadding="0" cellspacing="0" role="presentation">
                      <tr>
                        <td class="sm-px-6" style="background-color: #fff; padding: 48px; text-align: center">
                          <p style="margin: 0; font-size: 18px; font-weight: 600">Hey there,</p>
                          <p style="font-size: 16px; color: #374151">Changes have been made to your ${
                            appName ? appName + " app" : "account"
                          }.</p>
                          <div class="sm-h-8" style="line-height: 24px">&zwnj;</div>
                          <p style="font-size: 16px; color: #374151">If you did not make these changes, please notify us.</p>
                          <p style="font-size: 16px; color: #374151">Thanks.</p>
                        </td>
                      </tr>
                      <tr>
                        <td style="height: 2px; background-color: #d1d5db; padding: 8px; text-align: center">
                          The mlAuth Team.
                        </td>
                      </tr>
                      ${footerMarkup}
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </div>
    </body>
  </html>
  `)
}

function accountDeletionMarkup(firstName) {
  return new String(`
  <!DOCTYPE html>
  <html lang="en" xmlns:v="urn:schemas-microsoft-com:vml">
    <head>
      <meta charset="utf-8">
      <meta name="x-apple-disable-message-reformatting">
      <meta http-equiv="x-ua-compatible" content="ie=edge">
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <meta name="format-detection" content="telephone=no, date=no, address=no, email=no">
      <meta name="color-scheme" content="light dark">
      <meta name="supported-color-schemes" content="light dark">
      <!--[if mso]>
      <noscript>
        <xml>
          <o:OfficeDocumentSettings xmlns:o="urn:schemas-microsoft-com:office:office">
            <o:PixelsPerInch>96</o:PixelsPerInch>
          </o:OfficeDocumentSettings>
        </xml>
      </noscript>
      <style>
        td,th,div,p,a,h1,h2,h3,h4,h5,h6 {font-family: "Segoe UI", sans-serif; mso-line-height-rule: exactly;}
      </style>
      <![endif]-->
      <title>Account Deletion</title>
      <style>
        .hover-text-decoration-underline:hover {
          text-decoration: underline;
        }
        @media (max-width: 600px) {
          .sm-w-full {
            width: 100% !important;
          }
          .sm-px-6 {
            padding-left: 24px !important;
            padding-right: 24px !important;
          }
          .sm-pb-2 {
            padding-bottom: 8px !important;
          }
          .sm-pb-3 {
            padding-bottom: 12px !important;
          }
        }
      </style>
    </head>
    <body style="word-break: break-word; -webkit-font-smoothing: antialiased; margin: 0; width: 100%; background-color: #e5e7eb; padding: 0">
      <div role="article" aria-roledescription="email" aria-label="Account Deletion" lang="en">
        <table style="width: 100%; font-family: ui-sans-serif, system-ui, -apple-system, 'Segoe UI', sans-serif" cellpadding="0" cellspacing="0" role="presentation">
          <tr>
            <td align="center" style="background-color: #e5e7eb; padding-top: 24px; padding-bottom: 24px">
              <table class="sm-w-full" style="width: 600px" cellpadding="0" cellspacing="0" role="presentation">
                <tr>
                  <td align="center" class="sm-px-6">
                    <table class="sm-w-full" style="width: 75%" cellpadding="0" cellspacing="0" role="presentation">
                      <tr>
                        <td class="sm-pb-2" style="display: flex; width: 100%; padding-bottom: 8px">
                          <div style="display: flex; justify-content: center; border-top-left-radius: 12px; border-bottom-left-radius: 12px; background-color: #f9e80f; padding-left: 8px; padding-right: 8px">
                            <img alt="mlAuth logo" src="https://res.cloudinary.com/djx5h4cjt/image/upload/c_scale,w_60/v1656599841/mlAuth/mlAuth.png" style="width: 48px; align-self: center">
                          </div>
                          <div style="display: inline-flex; flex: 1 1 0%; align-items: center; justify-content: center; border-top-right-radius: 12px; border-bottom-right-radius: 12px; background-color: #fcf487; padding-left: 8px">
                            <span style="padding-top: 16px; padding-bottom: 16px; font-size: 24px; font-weight: 600; color: #1f2937">mlAuth</span>
                          </div>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                <tr>
                  <td class="sm-pb-3" style="padding: 0 16px 8px; text-align: center">
                    <h1 style="font-size: 24px; font-weight: 600; color: #000">Farewell ${firstName} 👋</h1>
                  </td>
                </tr>
                <tr>
                  <td align="center" class="sm-px-6">
                    <table class="sm-w-full" style="width: 75%" cellpadding="0" cellspacing="0" role="presentation">
                      <tr>
                        <td class="sm-px-6" style="background-color: #fff; padding: 48px">
                          <p style="margin: 0; font-size: 18px; font-weight: 600">Hey ${firstName},</p>
                          <p style="font-size: 16px; color: #374151">It's been fun having you here.</p>
                          <p style="font-size: 16px; color: #374151">Though sad to see you go, we know every beginning has an end.</p>
                          <p style="font-size: 16px; color: #374151"><i>Tchao! dev.</i></p>
                          <p style="font-size: 16px; color: #374151">
                            With 💓 and lots of ☕, <br> <span style="font-weight: 600">The ${mlAuthService} Team</span>.</p>
                        </td>
                      </tr>
                      <tr>
                        <td style="height: 2px; background-color: #d1d5db; padding: 8px; text-align: center">
                        </td>
                      </tr>
                      ${footerMarkup}
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </div>
    </body>
  </html>
  `)
}

module.exports = {
  magicLinkMailMarkup,
  verifyAccount,
  accountChangesMarkup,
  accountDeletionMarkup,
}
