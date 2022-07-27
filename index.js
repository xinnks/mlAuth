const dotenv = require("dotenv")
dotenv.config()
const express = require("express")
const Cors = require("cors")
const corsOptions = {
  origin: "*",
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  preflightContinue: false,
  optionsSuccessStatus: 200,
}
const corsPass = Cors(corsOptions)

const app = express()
const { service, magicLinks, auth } = require("./routes")
const PORT = process.env.PORT || 3331

app.options("*", corsPass)
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

/*
 * The index route
 */
app.get("/", (request, response) => {
  response.status(200).json({
    message: "mlAuth 2022.",
  })
})

app.use("/auth", auth)
app.use("/service", service)
app.use("/ml", magicLinks)

app.listen(PORT, () => console.log("running server on " + PORT))
