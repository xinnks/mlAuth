const { result } = require("../utils")
const prisma = require("./")

/**
 * Creates a new app
 * @param {Object} ({ ownerId, id, name, secret, client, callbackUrl, magicLinkTimeout, production, owner, magicLinks, createdAt })
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
 * @param {Object} searchQuery
 * @param {Object} returnFields
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
 * @param {Object} searchQuery
 * @param {Object} returnFields
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

module.exports = {
  createApp,
  findSingleApp,
  findManyApps,
  updateApp,
  deleteApp,
}
