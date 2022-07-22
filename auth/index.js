const { result } = require("./../utils")
const Session = require("./../auth/session")

/**
 * Parse HTTP Basic Authorization value for apps using the mlAuth service.
 * @param {Request} request
 * @throws {BadRequestException}
 * @returns {{ user: string, pass: string }}
 */
function basicAuthentication(request) {
  const {
    headers: { authorization },
  } = request

  const [scheme, encoded] = authorization.split(" ")

  if (!encoded || scheme !== "Basic") {
    return result("failure", "Malformed authorization header.")
  }

  const decoded = Buffer.from(encoded, "base64").toString("utf8")

  const index = decoded.indexOf(":")

  if (index === -1 || /[\0-\x1F\x7F]/.test(decoded)) {
    return result("failure", "Invalid authorization value.")
  }

  return result("success", {
    client: decoded.substring(0, index),
    secret: decoded.substring(index + 1),
  })
}

module.exports = {
  basicAuthentication,
}
