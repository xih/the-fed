import { createReducer, createAsyncReducers } from "../../utils"
import { PlaidTypes, PlaidAsyncTypes } from "./Actions"

const INITIAL_STATE = {
  linkToken: "",
  publicToken: "",
}

export const setLinkToken = (state, { linkToken }) => {
  return {
    ...state,
    linkToken
  }
}

// eslint-disable-next-line import/prefer-default-export
export const reducer = createReducer(INITIAL_STATE, {
  ...createAsyncReducers(Object.values(PlaidAsyncTypes)),
  [PlaidTypes.SET_LINK_TOKEN]: setLinkToken,
})
