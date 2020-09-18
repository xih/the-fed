import { put, call, all, takeLatest } from "redux-saga/effects"
import { auth } from "Firebase/firebase.utils"
import { get } from "lodash"
import { push } from "connected-react-router"
import {
  UserAsyncActions,
  UserActions,
  UserAsyncTypes,
} from "../Stores/User/Actions"
import { getErrorMsg, generateEntity, waitForResponse } from "../utils"
import ApiService from "../Services/ApiService"

const firebaseAuth = auth

function* createUserProfile(firebaseUser, profileData = {}) {
  const fullProfileData = {
    ...profileData,
    financialInstitutions: [],
    lastViewedAt: {},
  }
  const addUserPayload = {
    collectionName: ApiService.COLLECTION_NAMES.USERS,
    id: firebaseUser.uid,
    data: fullProfileData,
  }

  yield call(ApiService.add, addUserPayload)
}

function* setUserInState(user) {
  yield put(UserActions.setFirebaseUserData(user))
  yield waitForResponse(
    UserAsyncTypes,
    UserAsyncActions.fetchProfile({ userId: user.uid })
  )
  yield put(push("/plaidlink"))
}

export function* fetchProfile({ payload }) {
  yield put(UserAsyncActions.fetchProfileLoading())
  try {
    const id = payload.userId
    const profileData = yield call(ApiService.get, {
      collectionName: ApiService.COLLECTION_NAMES.USERS,
      id,
    })
    console.log("profile data ", profileData)
    const entity = generateEntity(id, profileData)
    console.log("what is the entity", entity)

    yield put(UserActions.setUserEntities(entity))
    yield put(UserAsyncActions.fetchProfileSuccess())
  } catch (e) {
    const errorMsg = getErrorMsg(e)
    yield put(UserAsyncActions.fetchProfileFailure({ message: errorMsg }))
  }
}

export function* signup({ payload }) {
  yield put(UserAsyncActions.signupLoading())

  try {
    const response = yield call(
      [firebaseAuth, firebaseAuth.createUserWithEmailAndPassword],
      payload.email,
      payload.password
    )
    const user = get(response, "user")

    if (!user) {
      throw new Error("An error occurred while attempting to sign up.")
    }

    yield createUserProfile(user, {
      firstName: payload.firstName,
      lastName: payload.lastName,
    })
    yield setUserInState(user)
    yield put(UserAsyncActions.signupSuccess())
  } catch (e) {
    const errorMsg = getErrorMsg(e)
    yield put(UserAsyncActions.signupFailure({ message: errorMsg }))
  }
}

export function* login({ payload }) {
  yield put(UserAsyncActions.loginLoading())

  try {
    const response = yield call(
      [firebaseAuth, firebaseAuth.signInWithEmailAndPassword],
      payload.email,
      payload.password
    )
    const user = get(response, "user")

    if (!user) {
      throw new Error("An error occurred while attempting to log in.")
    }

    yield setUserInState(user)
    yield put(UserAsyncActions.loginSuccess())
  } catch (e) {
    const errorMsg = getErrorMsg(e)
    yield put(UserAsyncActions.loginFailure({ message: errorMsg }))
  }
}

export default function* rootAuthSaga() {
  yield all([
    takeLatest(UserAsyncTypes.SIGNUP, signup),
    takeLatest(UserAsyncTypes.LOGIN, login),
    takeLatest(UserAsyncTypes.FETCH_PROFILE, fetchProfile),
  ])
}
