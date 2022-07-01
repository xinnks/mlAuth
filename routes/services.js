const express = require("express")
const router = express.Router()
const { serviceSessionAuthentication } = require("./../middlewares")
const {
  createAccount,
  verifyAccount,
  generateAppKeys,
  logOut,
} = require("./../controllers/services")
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
 app creation route
*/
router.post("/register", createAccount)

/*
 post registration app account verification route
*/
router.post("/verify", verifyAccount)

/*
 keys creation route route
*/
router.post("/generate-keys", generateAppKeys)

/*
 login session ending route
*/
router.post("/logout", logOut)

// use the router and 401 anything falling through
router.use("/service", router, (req, res) => {
  res.sendStatus(401)
})

module.exports = router
