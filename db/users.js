const prisma = require(".")
const { result } = require("../utils")

/**
 * @description Creates a new user
 * @param {Object} ({ email, firstName, lastName, verified, apps, sessions, updatedAt })
 * @returns {Object}
 */
async function createUser(data) {
  try {
    const response = await prisma.user.create({
      data,
    })
    console.log(response)
    return result("success", response)
  } catch (error) {
    console.log(error)
    return result("error", error)
  }
}

/**
 * @description Finds a single user
 * @param {Object} searchQuery - Query to be used to identify users
 * @param {Object} returnFields - Joins to be added to returned data
 * @returns {Object}
 */
async function findSingleUser(searchQuery, returnFields = null) {
  try {
    const response = await prisma.user.findUnique({
      where: searchQuery,
      include: returnFields,
    })
    console.log(response)
    return result("success", response)
  } catch (error) {
    console.log(error)
    return result("error", error)
  }
}

/**
 * @description Finds users
 * @param {Object} searchQuery - Query to be used to identify users
 * @param {Object} returnFields - Joins to be added to returned data
 * @returns {Object}
 */
async function findManyUsers(searchQuery, returnFields = null) {
  try {
    const response = await prisma.user.findMany({
      where: searchQuery,
      include: returnFields,
    })
    console.log(response)
    return result("success", response)
  } catch (error) {
    console.log(error)
    return result("error", error)
  }
}

/**
 * @description Updates user data
 * @param {String} id - User's id
 * @param {Object} changes - changes to be made
 * @returns {Object}
 */
async function updateUser(id, changes) {
  try {
    const response = await prisma.user.update({
      where: { id },
      data: changes,
    })
    console.log(response)
    return result("success", response)
  } catch (error) {
    console.log(error)
    return result("error", error)
  }
}

/**
 * @description Deletes a user
 * @param {String} id
 * @returns {Object}
 */
async function deleteUser(id) {
  try {
    const response = await prisma.user.delete({
      where: { id },
    })
    console.log(response)
    return result("success", response)
  } catch (error) {
    console.log(error)
    return result("error", error)
  }
}

module.exports = {
  createUser,
  findSingleUser,
  findManyUsers,
  updateUser,
  deleteUser,
}
