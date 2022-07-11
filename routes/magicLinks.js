const router = require("express").Router()
const { appAuthentication } = require("./../middlewares")
const Cors = require("cors")
const corsOptions = {
  origin: "*",
  optionsSuccessStatus: 200,
}
const {
  createMagicLink,
  verifyMagicLink,
} = require("./../controllers/magicLinks")

// middlewares
router.use(appAuthentication)
router.use(Cors(corsOptions))

/*
 magic link index route
*/
router.post("/", (req, res) => {
  res.json({
    message: "Magic Links Home Page",
  })
})

/**
 * This route receives a login request from an authenticated client
 * Sends a magic link to the provided email
 * Responds to the client with JSON and a 201 status code
 * */
router.post("/login", createMagicLink)

/**
 * This route verifies a magic link's token to authenticated a user into an app/service
 * */
router.post("/verify", verifyMagicLink)

// use the router and 401 anything falling through
router.use("/ml", router, (req, res) => {
  res.sendStatus(401)
})

module.exports = router
