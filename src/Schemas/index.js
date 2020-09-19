import { PropTypes } from "prop-types"

export const COLLECTION_NAMES = {
  USERS: "USERS",
  FINANCIAL_INSTITUTIONS: 'FINANCIAL_INSTITUTIONS',
}

const ACCOUNT_ID = PropTypes.string

const USER_SHORT_SCHEMA = {
  firstName: PropTypes.string,
  lastName: PropTypes.string,
}

const ACCOUNT_SCHEMA = {
  id: ACCOUNT_ID,
  mask: PropTypes.number,
  name: PropTypes.string,
  subtype: PropTypes.string,
  type: PropTypes.string,
}

const FINANCIAL_INSTITUTION_SCHEMA = {
  name: PropTypes.string,
  id: PropTypes.string,
  financialAccounts: PropTypes.objectOf(PropTypes.shape(ACCOUNT_SCHEMA)), // object keyed by election ID
}

const USER_SCHEMA = {
  ...USER_SHORT_SCHEMA,
  financialInstitutions: PropTypes.arrayOf(PropTypes.shape(FINANCIAL_INSTITUTION_SCHEMA))
}

export default {
  [COLLECTION_NAMES.USERS]: USER_SCHEMA,
  [COLLECTION_NAMES.FINANCIAL_INSTITUTIONS]: FINANCIAL_INSTITUTION_SCHEMA,
}
