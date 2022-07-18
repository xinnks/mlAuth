const express = require("express")
const router = express.Router()
const { createAccount, verifyAccount } = require("./../controllers/auth")
const Cors = require("cors")
const corsOptions = {
  origin: "*",
  optionsSuccessStatus: 200,
}

// middlewares
router.use(Cors(corsOptions))

/**
 * @description User registration route
 */
router.post("/register", createAccount)

/**
 * @description Use account verification route
 */
router.post("/verify", verifyAccount)

module.exports = router
