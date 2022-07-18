const { result } = require("../utils")
const prisma = require("./")

/**
 * Creates a magic link
 * @param {Object} {appId, id, token, lifespan, app, createdAt}
 * @returns {Object}
 */
async function createLink(data) {
  try {
    const response = await prisma.magicLink.create({
      data,
    })
    return result("success", response)
  } catch (error) {
    return result("error", error)
  }
}

/**
 * @description Finds a magic link
 * @param {Object} searchQuery
 * @param {Object} returnFields
 * @returns {Object}
 */
async function findLink(searchQuery, returnFields = null) {
  try {
    const response = await prisma.magicLink.findUnique({
      where: searchQuery,
      include: returnFields,
    })
    return result("success", response)
  } catch (error) {
    return result("error", error)
  }
}

/**
 * @description Finds multiple magic links
 * @param {Object} searchQuery
 * @param {Object} returnFields
 * @returns {Object}
 */
async function findLinks(searchQuery, returnFields = null) {
  try {
    const response = await prisma.magicLink.findMany({
      where: searchQuery,
      include: returnFields,
    })
    return result("success", response)
  } catch (error) {
    return result("error", error)
  }
}

/**
 * Deletes a magic link
 * @param {String} token
 * @returns {Object}
 */
async function deleteLink(id) {
  try{
    const response = await prisma.magicLink.delete({
      where: { id },
    })
    return result("success", response)
  } catch (error) {
    return result("error", error)
  }
}

module.exports = {
  createLink,
  findLink,
  findLinks,
  deleteLink,
}
