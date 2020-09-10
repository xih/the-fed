import { createActions } from 'reduxsauce'
import { createManyAsyncActions } from '../../utils.js'

const { Types, Creators } = createActions({
  setFirebaseData: ["userData"]
})

const { AsyncTypes, AsyncCreators } = createManyAsyncActions([
  'login',
  'signup'
])

export {
  Types as UserTypes,
  AsyncTypes as UserAsyncTypes,
  Creators as UserActions,
  AsyncCreators as UserAsyncActions
}

