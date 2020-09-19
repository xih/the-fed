import { put, call, all, take, takeLatest } from "redux-saga/effects"
import { getErrorMsg } from "../utils"
import axios from 'axios'

import {
  PlaidActions,
  PlaidAsyncActions,
  PlaidAsyncTypes,
} from "../Stores/Plaid/Actions"

export function* createPlaidLinkToken({ payload }) {
  yield put(PlaidAsyncActions.createPlaidLinkTokenLoading())

  try {
    const { userId } = payload

    const response = yield call([axios, axios.post],
      "http://localhost:5001/flames-4cfe9/us-central1/createPlaidLinkToken", { // hardcoding firebase functions link
      data: {
        uid: userId,
      }
    })
    
    const linkToken = response.data?.result.link_token

    yield put(PlaidActions.setLinkToken(linkToken))
    yield put(PlaidAsyncActions.createPlaidLinkTokenSuccess())

  } catch (e) {
    const errorMsg = getErrorMsg(e)
    yield put(PlaidAsyncActions.createPlaidLinkTokenLoading({ message: errorMsg }))
  }
}

export default function* rootPlaidSaga() {
  yield all([takeLatest(PlaidAsyncTypes.CREATE_PLAID_LINK_TOKEN, createPlaidLinkToken)])
}