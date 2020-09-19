import { createActions } from "reduxsauce"
import { createManyAsyncActions } from "../../utils"

const { Types, Creators } = createActions({
  setFirebaseUserData: ["userData"],
  setUserEntities: ["entities"],
})

// TYPE - SET_FIREBASE_USER_DATA,
// Creators = parameters - { type: SET_FIREBASE_USER_DATA, userData: {}}

const { AsyncTypes, AsyncCreators } = createManyAsyncActions([
  "login",
  "signup",
  "fetchProfile",
])

export {
  Types as UserTypes,
  AsyncTypes as UserAsyncTypes,
  Creators as UserActions,
  AsyncCreators as UserAsyncActions,
}
