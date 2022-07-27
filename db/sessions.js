const prisma = require(".")
const { result } = require("../utils")

/**
 * @description Creates a new session
 * @param {Object} data - Session data { userId, token, lifespan }
 * @returns {Object}
 */
async function createSession(data) {
  try {
    const response = await prisma.session.create({
      data,
    })
    return result("success", response)
  } catch (error) {
    return result("error", error)
  }
}

/**
 * @description Finds a session
 * @param {Object} searchQuery - Query to be used to identify users
 * @param {Object} returnFields - Joins to be added to returned data
 * @returns {Object}
 */
async function findSession(searchQuery, returnFields = null) {
  try {
    const response = await prisma.session.findUnique({
      where: searchQuery,
      include: returnFields,
    })
    return result("success", response)
  } catch (error) {
    return result("error", error)
  }
}

/**
 * @description Updates a session's data
 * @param {Object} id - Token id
 * @param {Object} changes - Changes to be made
 * @returns {Object}
 */
async function updateSession(id, changes) {
  try {
    const response = await prisma.session.update({
      where: id,
      data: changes,
    })
    return result("success", response)
  } catch (error) {
    return result("error", error)
  }
}

/**
 * @description Deletes a session
 * @param {Object} deletionParameter - Attributes to identify item to delete
 * @returns {Object}
 */
async function deleteSession(deletionParameter) {
  try {
    const response = await prisma.session.delete({
      where: deletionParameter,
    })
    return result("success", response)
  } catch (error) {
    return result("error", error)
  }
}

/**
 * @description Deletes multiple sessions
 * @param {Object} deletionParameter - Attributes to identify item to delete
 * @returns {Object}
 */
async function deleteSessions(deletionParameter) {
  try {
    const response = await prisma.session.deleteMany({
      where: deletionParameter,
    })
    return result("success", response)
  } catch (error) {
    return result("error", error)
  }
}

module.exports = {
  createSession,
  findSession,
  updateSession,
  deleteSession,
  deleteSessions,
}
