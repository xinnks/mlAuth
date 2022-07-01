const dotenv = require("dotenv")
dotenv.config()
const express = require("express")
const Cors = require("cors")
const { createHexToken, hashPassword, nowInSeconds } = require("./utils")
const { appSalt1, appSalt2 } = require("./vars")
const corsOptions = {
  origin: "*",
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  preflightContinue: false,
  optionsSuccessStatus: 200,
}
const corsPass = Cors(corsOptions)

const Mail = require("./mail")
const { createAccount, generateAppKeys } = require("./controllers/services")

const app = express()
const { services, magicLinks } = require("./routes")
const PORT = process.env.PORT || 3331

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.options("*", corsPass)

/*
* The index route
*/
app.get("/", (request, response) => {
  response.status(200).json({
    status: "success",
    message: "mlAuth 2022.",
  })
})

/**
 * This route verifies a magic link's token to authenticated a user into an app/service
 * */
app.get("/test-email", async (request, response) => {
  const emailDetails = {
    email: "xinnks@gmail.com",
    url: "http://localhost:8787/login/testToken",
  }
  const sent = await new Mail("Test Service").sendEmail(emailDetails)
  response.status(200).json({
    status: sent ? "success" : "failure",
    message: sent ? "Email Sent" : "Failed to send email",
  })
})

app.use("/service", services)
app.use("/ml", magicLinks)

app.listen(PORT, () => console.log("running server on " + PORT))
