/**
 * Reducers specify how the application's state changes in response to actions sent to the store.
 *
 * @see https://redux.js.org/basics/reducers
 */
import { createReducer, createAsyncReducers } from "../../utils"
import { StartupAsyncTypes } from "./Actions"

const INITIAL_STATE = {}

/**
 * @see https://github.com/infinitered/reduxsauce#createreducer
 */
export const reducer = createReducer(INITIAL_STATE, {
  ...createAsyncReducers(Object.values(StartupAsyncTypes)),
})
