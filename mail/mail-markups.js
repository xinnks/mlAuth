const css = require("./css")
const { mlAuthService } = require("./../vars")
const mlAuthLogo = `
  <div class="flex flex-col justify-center items-center space-x-4 p-8 m-6">
    <img alt="mlAuth logo" class="w-20 self-center" src="https://res.cloudinary.com/djx5h4cjt/image/upload/c_scale,w_120/v1656599841/mlAuth/mlAuth.png" />
    <div>
      <h1 class="text-2xl font-bold">mlAuth</h1>
    </div>
  </div>`

function magicLinkMailMarkup(url, appName) {
  return new String(`
  <!DOCTYPE html>
  <html>

  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width,initial-scale=1">
    <title>Login to ${appName}</title>
    <meta name="description" content="User Authentication Simplified">
    
    <style>
      ${css}
    </style>
  </head>

  <body>
    <div style="min-height: 100vh;" class="p-0 m-0 w-full bg-gray-200">

      <main class="flex flex-col items-center justify-around py-8 px-8">

        <h1 class="p-8 m-6 text-4xl font-bold">
          ${appName}
        </h1>

        <p class="p-4 m-4 width-full text-xl">
          Hey,
        </p>

        <p class="p-4 m-4 width-full text-xl">
          Follow this link to login.
        </p>

        <div
          class="flex flex-col p-4 m-4 max-w-lg mx-auto bg-white rounded-xl shadow-lg sm:py-4">
          <p class="p-4 max-w-lg text-4xl text-center">
            <a href="${url}">${url}</a>
          </p>
        </div>

        <p class="p-4 m-4 width-full text-xl">
          If you did not make this request, please ignore this email.
        </p>

        <p class="p-4 m-4 width-full text-xl">
          Thanks, ${appName} Team.
        </p>

      </main>

    </div>
  </body>

  </html>
  `)
}

function verifyAccount(firstName, url) {
  return new String(`
  <!DOCTYPE html>
  <html>

  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width,initial-scale=1">
    <title>Verify Your mlAuth Account</title>
    <meta name="description" content="Verify the email for your mlAuth account">
    
    <style>
      ${css}
    </style>
  </head>

  <body>
    <div style="min-height: 100vh;" class="p-0 m-0 w-full bg-gray-200">

      <main class="flex flex-col items-center justify-around py-8 px-8">

        ${mlAuthLogo}

        <p class="p-4 m-4 width-full text-xl">
          Hello ${firstName},
        </p>

        <p class="p-4 m-4 width-full text-xl">
          Visit this link to verify your email and activate your mlAuth account.
        </p>

        <div
          class="flex flex-col p-4 m-4 max-w-lg mx-auto bg-white rounded-xl shadow-lg sm:py-4">
          <p class="p-4 max-w-lg text-4xl text-center">
            <a href="${url}">${url}</a>
          </p>
        </div>

        <p class="p-4 m-4 width-full text-xl">
          If you did not make this request, please ignore this email.
        </p>

        <p class="p-4 m-4 width-full text-xl">
          Thanks, ${mlAuthService} Team.
        </p>

      </main>

    </div>
  </body>

  </html>
  `)
}

function accountChangesMarkup(firstName, appName) {
  return new String(`
  <!DOCTYPE html>
  <html>

  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width,initial-scale=1">
    <title>Account Changes</title>
    <meta name="description" content="User Authentication Simplified">
    
    <style>
      ${css}
    </style>
  </head>

  <body>
    <div style="min-height: 100vh;" class="p-0 m-0 w-full bg-gray-200">

      <main class="flex flex-col items-center justify-around py-8 px-8">

        ${mlAuthLogo}

        <p class="p-4 m-4 width-full text-xl">
          Hello ${firstName},
        </p>

        <p class="p-4 m-4 width-full text-xl">
          Changes have been made to your ${appName} service account.
        </p>

        <p class="p-4 m-4 width-full text-xl">
          If you did not make these changes, please notify us.
        </p>

        <p class="p-4 m-4 width-full text-xl">
          Thanks, ${mlAuthService} Team.
        </p>

      </main>

    </div>
  </body>

  </html>
  `)
}

module.exports = {
  magicLinkMailMarkup,
  verifyAccount,
  accountChangesMarkup,
}
