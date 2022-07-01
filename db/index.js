const faunadb = require("faunadb")
const { faunaSecret } = require("./../vars")
const {
  Create,
  Collection,
  Match,
  Index,
  Get,
  Ref,
  Select,
  Let,
  Var,
  Update,
  Map,
  Paginate,
  Lambda,
  If,
  IsNonEmpty,
  Delete,
} = faunadb.query

/**
 * @description This function creates a database connection and carries out data transactions
 */
class Database {
  constructor() {
    const secret = faunaSecret
    this.client = new faunadb.Client({
      secret,
    })
  }

  /**
   * @description Returns a result object
   * @param {String} status => The status being returned, either success or error
   * @param {*} data => The data being returned
   * @returns
   */
  result(status, data) {
    return {
      status,
      data,
    }
  }

  /**
   * @description => This function stores new document into an existing database collection
   * @param {String} collection => Name of the collection the data is being added to
   * @param {Object} data => The document data that is being stored
   * @returns
   */
  async create(collection, data) {
    try {
      const response = await this.client.query(
        Select(
          ["data"],
          Create(Collection(collection), {
            data,
          })
        )
      )
      return this.result("success", response)
    } catch (error) {
      return this.result("error", error)
    }
  }

  /**
   * @description This functio updates data already existing inside a collection
   * @param {String} collection => Name of the collectio the document to update is stored in
   * @param {String} refId => The reference id of the document to update
   * @param {Object} data The new data to add to the document being updated
   * @returns
   */
  async update(collection, refId, data) {
    try {
      const response = await this.client.query(
        Let(
          {
            item: Update(Ref(Collection(collection), refId), { data }),
          },
          {
            refId: Select(["ref", "id"], Var("item")),
            data: Select(["data"], Var("item")),
          }
        )
      )
      return this.result("success", response)
    } catch (error) {
      return this.result("error", error)
    }
  }

  /**
   * @description This function finds a document inside the database by checking an existing index
   * @param {String} index => Name of the index to search the document through
   * @param {*} query => The query to search the document via
   * @returns
   */
  async find(index, query) {
    try {
      const response = await this.client.query(
        If(
          IsNonEmpty(Match(Index(index), query)),
          Let(
            { item: Get(Match(Index(index), query)) },
            {
              refId: Select(["ref", "id"], Var("item")),
              data: Select(["data"], Var("item")),
            }
          ),
          null
        )
      )
      return this.result("success", response)
    } catch (error) {
      return this.result("error", error)
    }
  }

  /**
   * @description This function filters the docs within a collection using the given query and returns an array of results
   * @param { Object } query => The query to match the document to find
   * @param { String } index => Collection index name
   * @param { Object } dataToReturn => Object projecting the data fields to be returned
   **/
  async findMany(index, query) {
    try {
      const response = await this.client.query(
        Select(
          ["data"],
          Map(
            Paginate(Match(Index(index), query)),
            Lambda(
              "docRef",
              Let(
                { item: Get(Var("docRef")) },
                {
                  refId: Select(["ref", "id"], Var("item")),
                  data: Select(["data"], Var("item")),
                }
              )
            )
          )
        )
      )
      return this.result("success", response)
    } catch (error) {
      return this.result("error", error)
    }
  }

  /**
   * @description This functio delete a document from a collectio within the database
   * @param {String} refId => The reference id of the document to be deleted
   * @param {String} collection => The name of the collection to delete the document from
   * @returns
   */
  async delete(collection, refId) {
    try {
      const response = await this.client.query(
        Delete(Ref(Collection(collection), refId))
      )
      return this.result("success", response)
    } catch (error) {
      return this.result("error", error)
    }
  }
}

module.exports = Database
