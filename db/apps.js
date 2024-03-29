const { result } = require("../utils")
const prisma = require("./")

/**
 * Creates a new app
 * @param {Object} data - Object containing these parameters { email, firstName, lastName, verified, verificationToken }
 * @returns {Object}
 */
async function createApp(data) {
  try {
    const response = await prisma.app.create({
      data,
    })
    return result("success", response)
  } catch (error) {
    return result("error", error)
  }
}

/**
 * Finds a single app
 * @param {Object} searchQuery - Parameters to query for
 * @param {Object} returnFields - Extra models to return
 * @returns {Object}
 */
async function findSingleApp(searchQuery, returnFields = null) {
  try {
    const response = await prisma.app.findUnique({
      where: searchQuery,
      include: returnFields,
    })
    return result("success", response)
  } catch (error) {
    return result("error", error)
  }
}

/**
 * Finds multiple apps
 * @param {Object} searchQuery - Parameters to query for
 * @param {Object} returnFields - Extra models to return
 * @returns {Object}
 */
async function findManyApps(searchQuery, returnFields = null) {
  try {
    const response = await prisma.app.findMany({
      where: searchQuery,
      include: returnFields,
    })
    return result("success", response)
  } catch (error) {
    return result("error", error)
  }
}

/**
 * Updates an app
 * @param {String} id
 * @param {Object} changes
 * @returns {Object}
 */
async function updateApp(id, changes) {
  try {
    const response = await prisma.app.update({
      where: { id },
      data: changes,
    })
    return result("success", response)
  } catch (error) {
    return result("error", error)
  }
}

/**
 * Deletes an app
 * @param {String} id - App id
 * @returns {Object}
 */
async function deleteApp(id) {
  try {
    const response = await prisma.app.delete({
      where: { id },
    })
    return result("success", response)
  } catch (error) {
    return result("error", error)
  }
}

/**
 * @description Deletes all user app
 * @param {Object} deletionParameter - Attributes to identify item to delete
 * @returns {Object}
 */
async function deleteApps(deletionParameter) {
  try {
    const response = await prisma.app.deleteMany({
      where: deletionParameter,
    })
    return result("success", response)
  } catch (error) {
    return result("error", error)
  }
}

module.exports = {
  createApp,
  findSingleApp,
  findManyApps,
  updateApp,
  deleteApp,
  deleteApps,
}
