import { put, call, all, take, takeLatest, select } from "redux-saga/effects"
import { getErrorMsg } from "../utils"
import axios from 'axios'
import ApiService from '../Services/ApiService'
import {
  PlaidActions,
  PlaidAsyncActions,
  PlaidAsyncTypes,
} from "../Stores/Plaid/Actions"
import { getUserId } from '../Stores/User/Selectors'
import { UserAsyncActions } from '../Stores/User/Actions'

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
    yield put(PlaidAsyncActions.createPlaidLinkTokenFailure({ message: errorMsg }))
  }
}

export function* exchangePublicToken({ payload }) {
  yield put(PlaidAsyncActions.exchangePublicTokenLoading())

  try {
    const { token, metadata } = payload
    const { public_token, institution, accounts, account, account_id, link_session_id } = metadata


    // each user should have an accounts array to it
    // and also just store all the data into firebase straight away
    const userId = yield select(getUserId)

    // const fullInstitutionData = {
    //   institutionName: institution.name,
    //   accounts,
    //   account,
    //   account_id,
    //   link_session_id,
    //   public_token,
    //   userId: userId,
    // }

    // const addFinancialInstitutionPayload = {
    //   collectionName: ApiService.COLLECTION_NAMES.FINANCIAL_INSTITUTIONS,
    //   // id: institution.institution_id,
    //   data: fullInstitutionData
    // }


    // yield call(ApiService.add, addFinancialInstitutionPayload)
    // TODO: update the user schema to add a reference to the financialInstitutionID

    const response = yield call([axios, axios.post],
      "http://localhost:5001/flames-4cfe9/us-central1/exchangePublicToken", { // hardcoding firebase functions for emulator
      data: {
        userId: userId,
        publicToken: token
      }
    })


    yield put(PlaidAsyncActions.exchangePublicTokenSuccess())
  } catch (e) {
    const errorMsg = getErrorMsg(e)
    yield put(PlaidAsyncActions.exchangePublicTokenFailure({ message: errorMsg }))
  }
}

export function* addFinancialInstitution({ payload }) {
  yield put(PlaidAsyncActions.addFinancialInstitutionLoading())
  try {
    const userId = select(getUserId)
    console.log('add financialInstitution', userId)

    yield put(PlaidAsyncActions.addFinancialInstitutionSuccess()) 

  } catch (e) {
    const errorMsg = getErrorMsg(e)
    yield put(PlaidAsyncActions.addFinancialInstitutionFailure({ message: errorMsg }))
  }
}

export default function* rootPlaidSaga() {
  yield all([
    takeLatest(PlaidAsyncTypes.CREATE_PLAID_LINK_TOKEN, createPlaidLinkToken),
    takeLatest(PlaidAsyncTypes.EXCHANGE_PUBLIC_TOKEN, exchangePublicToken),
    takeLatest(PlaidAsyncTypes.ADD_FINANCIAL_INSTITUTION, addFinancialInstitution),
  ])
}