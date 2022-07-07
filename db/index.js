const { PrismaClient } = require("@prisma/client")

let prisma = new PrismaClient({
  errorFormat: "pretty",
})

if (process.env.NODE_ENV === "production") {
  prisma = new PrismaClient({
    errorFormat: "minimal",
  })
}

module.exports = prisma
