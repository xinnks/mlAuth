const express = require("express")
const router = express.Router()
const { serviceSessionAuthentication } = require("./../middlewares")
const {
  generateAppKeys,
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

/*
 keys creation route route
*/
router.post("/generate-keys", generateAppKeys)

/*
 app delete route [PENDING]
*/
router.get("/delete", deleteApp)

/*
 login session ending route
*/
router.post("/logout", logOut)

// use the router and 401 anything falling through
router.use("/service", router, (req, res) => {
  res.sendStatus(401)
})

module.exports = router
