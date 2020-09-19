import { compact, uniq } from 'lodash';

export const getLinkToken = (state) => state.plaid?.linkToken

export const getAccounts = (state) => state.plaid?.financialData?.accounts

