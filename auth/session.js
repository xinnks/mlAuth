// Session manager for the mlAuth client

const { nowInSeconds, result } = require("./../utils")
const { timeOut } = require("./../vars")
const sessionDb = require("./../db/sessions")
const usersDb = require("./../db/users")

class Session {
  constructor(token) {
    this.token = token
  }

  /**
   * @description Creates a new session
   * @param {String} userId - Id of user the session belongs to
   * @param {Integer} lifeSpan - Lifespan of the session to be created
   * @returns {Object}
   */
  async create(userId, lifeSpan) {
    let sessionData = {
      userId,
      lifespan: parseInt(lifeSpan || timeOut),
      token: this.token,
      createdAt: new Date().toISOString()
    }

    const { status, data: createResponse } = await sessionDb.createSession(
      sessionData
    )

    if (status !== "success") return result("failure", createResponse)

    return result("success", createResponse)
  }

  /**
   * @description - Verifies a session's validity and expiration status
   */
  async verify() {
    const { status: sessionStatus, data: sessionData } =
      await sessionDb.findSession({
        token: this.token,
      })
    if (sessionStatus !== "success" || !sessionData)
      return result("failure", "Unknown session")

    let { updatedAt, lifespan, id } = sessionData

    return nowInSeconds() - Date.parse(updatedAt) < lifespan - 10000
      ? this.refresh(id)
      : result("failure", "Session expired")
  }

  /**
   * @description Increases a session's duration
   * @param {String} sessionId - Session id
   */
  async refresh(sessionId) {
    const { status: updateStatus, data: response } =
      await sessionDb.updateSession(
        { id: sessionId },
        { updatedAt: new Date().toISOString() }
      )

    if (updateStatus !== "success") return result("failure", response)

    const { status: userStatus, data: userInfo } = await usersDb.findSingleUser(
      {
        id: response.userId,
      }
    )

    if (userStatus === "success") response.user = userInfo

    return result("success", response)
  }

  /**
   * @description - Deletes a session
   */
  async delete() {
    const { status: sessionStatus, data: sessionData } =
      await sessionDb.findSession({
        token: this.token,
      })
    if (sessionStatus !== "success" || !sessionData) return false

    let { status: deletionStatus, data: deletedData } =
      await sessionDb.deleteSession({
        token: this.token,
      })

    if (deletionStatus !== "success") return result("failure", deletedData)

    return result("success", "Session ended")
  }
}

module.exports = Session
