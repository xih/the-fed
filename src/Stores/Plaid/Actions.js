import { createActions } from "reduxsauce"
import { createManyAsyncActions } from "../../utils"

const { Types, Creators } = createActions({
  setLinkToken: ['linkToken'],
  setFinancialInstitutionAndAccounts: ['financialData'],
})

const { AsyncTypes, AsyncCreators } = createManyAsyncActions([
  "createPlaidLinkToken",
  'exchangePublicToken',
  'addAllAccountsForOneFinancialInstitution'
])

export {
  Types as PlaidTypes,
  AsyncTypes as PlaidAsyncTypes,
  Creators as PlaidActions,
  AsyncCreators as PlaidAsyncActions,
}
