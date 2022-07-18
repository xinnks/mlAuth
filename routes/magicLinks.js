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
router.use(Cors(corsOptions))
router.use(appAuthentication)

/*
 magic link index route
*/
router.post("/", (_req, res) => {
  res.json({
    message: "Magic Links Home Page",
  })
})

/**
 * @description This route receives login requests
 * */
router.post("/login", createMagicLink)

/**
 * @description This route receives magic links verification requests
 * */
router.post("/verify", verifyMagicLink)

/**
 * @description Use the router and return 401 responses to anything falling through
 */
router.use("/ml", router, (_req, res) => {
  res.sendStatus(401)
})

module.exports = router
