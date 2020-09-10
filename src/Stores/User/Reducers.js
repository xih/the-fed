import { createReducer, createAsyncReducers } from '../../utils'
import { UserTypes, UserAsyncTypes } from './Actions'

const INITIAL_STATE = {
  currentUser: {},
}

export const setFirebaseUserData = (state, { userData }) => {
  const newUserData = {
    id: userData.uid,
    email: userData.email,
    metaData: userData.metadata
  }
  return {
    ...state,
    currentUser: newUserData,
  }
}

export const reducer = createReducer(INITIAL_STATE, {
  ...createAsyncReducers(Object.values(UserAsyncTypes)),
  // [UserTypes.SET_FIREBASE_USER_DATA]: setFirebaseUserData
})