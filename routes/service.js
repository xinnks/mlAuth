const express = require("express")
const router = express.Router()
const { serviceSessionAuthentication } = require("./../middlewares")
const {
  createNewApp,
  regenerateAppKeys,
  updateAppInformation,
  deleteApp,
  logOut,
} = require("./../controllers/service")
const {
  updateAccountInformation,
} = require("./../controllers/account")
const Cors = require("cors")
const corsOptions = {
  origin: "*",
  optionsSuccessStatus: 200,
}

// middlewares
router.use(Cors(corsOptions))
router.use(serviceSessionAuthentication)

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
router.post("/create-app", createNewApp)

/**
 * @description Receives keys generation requests
 */
router.post("/generate-keys", regenerateAppKeys)

/**
 * @description Receives user update requests
 */
router.post("/update-account", updateAccountInformation)
/**
 * @description Receives app update requests
 */
router.post("/update-app", updateAppInformation)

/**
 * @description Receives app deletion requests
 */
router.post("/delete-app", deleteApp)

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
