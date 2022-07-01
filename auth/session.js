// Session manager for the mlAuth client
const { createHexToken, nowInSeconds, result } = require("./../utils")
const {
  appSessionsCollection,
  appSessionTokenIndex,
  appRefIdIndex,
  timeOut,
} = require("./../vars")
const Database = require("./../db")
const db = new Database()

class Session {
  constructor(token) {
    this.token = token
  }

  async create(appRefId, lifeSpan = timeOut) {
    let sessionData = {
      appRefId,
      lifeSpan,
      token: this.token,
      createdAt: nowInSeconds(),
      updatedAt: nowInSeconds(),
    }

    const { status, data: createResponse } = await db.create(
      appSessionsCollection,
      sessionData
    )

    if (status !== "success") return result("failure", createResponse)

    return result("success", createResponse)
  }

  async verify() {
    const { status: sessionStatus, data: sessionData } = await db.find(
      appSessionTokenIndex,
      this.token
    )
    if (sessionStatus !== "success" || !sessionData)
      return result("failure", "Unknown session")
    let {
      data: { updatedAt, lifeSpan },
      refId,
    } = sessionData

    if (nowInSeconds() - updatedAt > lifeSpan - 10000)
      return result("failure", "Session expired")

    return this.refresh(refId)
  }

  async refresh(sessionRefId) {
    const { status: updateStatus, data: response } = await db.update(
      appSessionsCollection,
      sessionRefId,
      { updatedAt: nowInSeconds() }
    )

    if (updateStatus !== "success") return result("failure", response)

    return result("success", response)
  }

  async delete() {
    const { status: sessionStatus, data: sessionData } = await db.find(
      appSessionTokenIndex,
      this.token
    )
    if (sessionStatus !== "success" || !sessionData) return false

    let { status: deletionStatus, data: deletedData } = await db.delete(
      appSessionsCollection,
      sessionData.refId
    )

    if (deletionStatus !== "success") return result("failure", deletedData)

    return result("success", "Session ended")
  }
}

module.exports = Session
