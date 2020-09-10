import { put, call, all, takeLatest } from 'redux-saga/effects'
import { UserAsyncActions, UserActions, UserAsyncTypes } from '../Stores/User/Actions'
import { auth } from 'Firebase/firebase.utils'
import { get } from 'lodash'
import { getErrorMsg } from '../utils'

const firebaseAuth = auth

function* signup() {
  yield put(UserAsyncActions.signupLoading)
  console.log('signup')
}

export function* login({ payload }) {
  yield put(UserAsyncActions.loginLoading())
  console.log('payload', payload)

  try {
    const response = yield call(
      [firebaseAuth, firebaseAuth.signInWithEmailAndPassword],
      payload.email,
      payload.password
    )
    const user = get(response, 'user')

    console.log("~~~user!!", user)
    if (!user) {
      throw new Error('An error occurred while attempting to log in.')
    }

    yield setUserInState(user)
    yield put(UserAsyncActions.loginSuccess())
  } catch (e) {
    const errorMsg = getErrorMsg(e)
    yield put(UserAsyncActions.loginFailure({ message: errorMsg }))
  }
}


function* setUserInState(user) {
  yield put(UserActions.setFirebaseUserData(user))

}

// function* setUserInState(user) {
//   yield put(UserActions.setFirebaseUserData(user));
//   yield waitForResponse(
//     UserAsyncTypes,
//     UserAsyncActions.fetchProfile({ userId: user.uid }),
//   );
//   yield waitForResponse(
//     JourneyAsyncTypes,
//     JourneyAsyncActions.getJourney(),
//   );
//   NavigationService.navigateAndReset('LoggedIn');
// }


export default function* rootAuthSaga() {
  yield all([
    // takeLatest(UserAsyncTypes.SIGNUP, signup)
    takeLatest(UserAsyncTypes.LOGIN, login)
  ])
}