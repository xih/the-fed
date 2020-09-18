/* eslint-disable no-use-before-define */

import checkPropTypes from "check-prop-types"
import { has, chunk, flatten, noop, pick } from "lodash"
import SCHEMAS, { COLLECTION_NAMES } from "../Schemas"
import { db } from "../Firebase/firebase.utils"

class ApiService {
  constructor() {
    this.firestore = db
    this.COLLECTION_NAMES = COLLECTION_NAMES
    this.get = this.get.bind(this)
    this.getBy = this.getBy.bind(this)
    this.batchGet = this.batchGet.bind(this)
    this.add = this.add.bind(this)
    this.addSub = this.addSub.bind(this)
    this.update = this.update.bind(this)
    this.batchAdd = this.batchAdd.bind(this)
    this.delete = this.delete.bind(this)
  }

  async _doAdd({ ref, data, id, collectionName }) {
    // TODO: Explore adding converters via "withConverter"
    const _data = this.constructFullData(collectionName, {
      createdAt: new Date().getTime(),
      ...data,
    })
    return (await !!id) ? ref.doc(id).set(_data) : ref.add(_data)
  }

  async get({ collectionName, id, withError = true }) {
    const doc = await this.firestore.collection(collectionName).doc(id).get()
    if (!doc.exists) {
      if (withError) {
        throw new Error(
          `Document ${id} does not exist in collection ${collectionName}`
        )
      }
      return null
    }
    return { id, ...doc.data() }
  }

  async getBy({ collectionName, field, value, withError = true }) {
    const snapshot = await this.firestore
      .collection(collectionName)
      .where(field, "==", value)
      .get()
    const doc = snapshot?.docs?.[0]
    if (!doc || !doc.exists) {
      if (withError) {
        throw new Error(
          `Document with "${field}" equal to "${value}" does not exist in collection ${collectionName}`
        )
      }
      return null
    }
    return { id: doc.id, ...doc.data() }
  }

  /**
   * Returns all fetched docs as an object keyed by doc ID
   * @param {String} collectionName
   * @param {String} field - field to look up the document by, defaults to firestore ID
   * @param {Array} set - values to look up by using field
   * @param {String[]} fields - document fields to select
   * @param {String} omitId - document ID to ignore when selecting fields
   */
  async batchGet({
    collectionName,
    field = db.FieldPath.documentId(),
    set,
    fields = [],
    omitId,
  }) {
    const chunks = chunk(set, 10)
    const ref = this.firestore.collection(collectionName)
    const promises = chunks.map(async (singleChunk) => {
      const snapshot = await ref.where(field, "in", singleChunk).get()
      return snapshot.docs.length ? snapshot.docs : []
    })
    const docs = await Promise.all(promises)
    return flatten(docs).reduce((data, doc) => {
      if (doc.exists) {
        const docData = doc.data()
        let returnData = docData
        if (doc.id !== omitId && fields.length) {
          returnData = pick(docData, [...fields, "createdAt", "updatedAt"])
        }
        data[doc.id] = { id: doc.id, ...returnData }
      }
      return data
    }, {})
  }

  /**
   *
   * Batch add
   * data is an object with ids as keys and document data as values
   * {
   *  id: data,
   *  id: data,
   * }
   */
  async batchAdd({ collectionName, data }) {
    const batch = this.firestore.batch()
    const ref = this.firestore.collection(collectionName)

    Object.entries(data).forEach(([id, value]) => {
      const docId = ref.doc(id)
      batch.set(docId, value)
    })

    return batch.commit()
  }

  /**
   * Creates a new record
   * Will use provided ID, otherwise autogenerates ID
   */
  add({ collectionName, id, data }) {
    const ref = this.firestore.collection(collectionName)
    if (this.isValidSchema(collectionName, data)) {
      return this._doAdd({
        ref,
        data,
        id,
        collectionName,
      })
    }
  }

  addSub({ collectionName, id, subCollectionName, data }) {
    const ref = this.firestore
      .collection(collectionName)
      .doc(id)
      .collection(subCollectionName)
    if (this.isValidSchema(subCollectionName, data)) {
      return this._doAdd({ ref, data, collectionName: subCollectionName })
    }
  }

  async update({ collectionName, id, data, returnUpdated = false }) {
    const ref = this.firestore.collection(collectionName)
    if (this.isValidSchema(collectionName, data, true)) {
      const _data = {
        updatedAt: new Date().getTime(),
        ...data,
      }
      await ref.doc(id).update(_data)
      if (returnUpdated) {
        return this.get({ collectionName, id })
      }
    }
  }

  singleListen({ id, collectionName, onComplete = noop }) {
    if (!id) return noop

    return this.firestore
      .collection(collectionName)
      .doc(id)
      .onSnapshot((doc) => {
        if (doc) {
          const entity = {
            [doc.id]: { id: doc.id, ...doc.data() },
          }
          onComplete(entity)
        }
      })
  }

  batchListen({
    ids,
    collectionName,
    entityHandler = noop,
    onComplete = noop,
  }) {
    if (!ids?.length) return []

    const chunks = chunk(ids, 10)
    const ref = this.firestore.collection(collectionName)
    return chunks.map((idChunk) => {
      const unsub = ref
        .where(db.FieldPath.documentId(), "in", idChunk)
        .onSnapshot((querySnapshot) => {
          let entities = {}
          if (querySnapshot?._changes?.length) {
            entities = querySnapshot._changes.reduce((data, { doc }) => {
              if (doc.exists) {
                const entity = { id: doc.id, ...doc.data() }
                data[doc.id] = entity
                entityHandler(entity)
              }
              return data
            }, {})
          }
          onComplete(entities)
        })
      return unsub
    })
  }

  isValidSchema(name, data, isUpdate) {
    let schema = SCHEMAS[name]
    if (!schema) {
      throw new Error(
        `Schema for collection ${name} not found. Make sure to add it to App/Schemas/index.js`
      )
    }
    if (isUpdate) {
      const updateSchema = Object.keys(data).reduce((partialSchema, key) => {
        if (!has(schema, key)) {
          throw new Error(`${key} is not in the schema for collection ${name}`)
        }
        partialSchema[key] = schema[key]
        return partialSchema
      }, {})
      schema = updateSchema
    }
    const result = checkPropTypes(schema, data, "field", name)
    if (!result) return true
    throw new Error(result)
  }

  constructFullData(name, data) {
    const schema = SCHEMAS[name]
    const fullData = { ...data }
    Object.keys(schema).forEach((key) => {
      if (!has(fullData, key)) fullData[key] = null
    })
    return fullData
  }

  // TODO: call cloud function istead of this
  async delete({ collectionName, id }) {
    const ref = this.firestore.collection(collectionName)
    await ref.doc(id).delete()
  }
}

const service = new ApiService()
export default service
