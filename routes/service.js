const express = require("express")
const router = express.Router()
const { serviceSessionAuthentication } = require("./../middlewares")
const {
  regenerateAppKeys,
  deleteApp,
  logOut,
} = require("./../controllers/service")
const Cors = require("cors")
const corsOptions = {
  origin: "*",
  optionsSuccessStatus: 200,
}

// middlewares
router.use(serviceSessionAuthentication)
router.use(Cors(corsOptions))

/*
 service creation route
*/
router.post("/", (req, res) => {
  res.json({
    message: "Services Home Page",
  })
})

/**
 * @description Receives keys generation requests
 */
router.post("/generate-keys", regenerateAppKeys)

/**
 * @description Receives app deletion requests
 */
router.get("/delete", deleteApp)

/**
 * @description Receives logout requests
 */
router.post("/logout", logOut)

/**
 * @description Use the router and 401 anything falling through
 */
router.use("/service", router, (req, res) => {
  res.sendStatus(401)
})

module.exports = router
