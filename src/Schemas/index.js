import { PropTypes } from "prop-types"

export const COLLECTION_NAMES = {
  USERS: "USERS",
}

const USER_SHORT_SCHEMA = {
  firstName: PropTypes.string,
  lastName: PropTypes.string,
}

const USER_SCHEMA = {
  ...USER_SHORT_SCHEMA,
}

export default {
  [COLLECTION_NAMES.USERS]: USER_SCHEMA,
}
