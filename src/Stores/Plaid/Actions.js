import { createActions } from "reduxsauce"
import { createManyAsyncActions } from "../../utils"

const { Types, Creators } = createActions({
  setLinkToken: ['linkToken'],
})

const { AsyncTypes, AsyncCreators } = createManyAsyncActions([
  "createPlaidLinkToken",
])

export {
  Types as PlaidTypes,
  AsyncTypes as PlaidAsyncTypes,
  Creators as PlaidActions,
  AsyncCreators as PlaidAsyncActions,
}
