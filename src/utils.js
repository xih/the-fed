import { createActions, createReducer as _createReducer } from "reduxsauce"
import { put, race, take } from "redux-saga/effects"
import { replace } from "lodash"

export const createReducer = (state, reducerObj) => {
  const initialState = {
    ...state,
    isLoading: {},
    errors: {},
  }
  return _createReducer(initialState, reducerObj)
}

export const createAsyncAction = (actionName) => {
  const { Types: ParentTypes, Creators: ParentCreators } = createActions({
    [actionName]: ["payload"],
  })

  const familyType = Object.values(ParentTypes)[0]
  const parentCreator = Object.values(ParentCreators)[0]
  const wrappedParentCreator = (...args) => {
    const action = parentCreator(...args)
    return {
      ...action,
      familyType,
    }
  }

  const { Types: ChildTypes, Creators: ChildCreators } = createActions({
    [`${actionName}Loading`]: null,
    [`${actionName}Success`]: ["payload"],
    [`${actionName}Failure`]: ["error"],
  })

  const wrappedChildCreators = {}
  Object.entries(ChildCreators).forEach(([key, childCreator]) => {
    wrappedChildCreators[key] = (...args) => {
      const action = childCreator(...args)
      return {
        ...action,
        familyType,
      }
    }
  })

  return {
    AsyncTypes: {
      ...ParentTypes,
      ...ChildTypes,
    },
    AsyncCreators: {
      [actionName]: wrappedParentCreator,
      ...wrappedChildCreators,
    },
  }
}

export const createManyAsyncActions = (asyncActionName) =>
  asyncActionName.reduce(
    (data, name) => {
      const {
        AsyncTypes: _AsyncTypes,
        AsyncCreators: _AsyncCreators,
      } = createAsyncAction(name)
      return {
        AsyncTypes: {
          ...data.AsyncTypes,
          ..._AsyncTypes,
        },
        AsyncCreators: {
          ...data.AsyncCreators,
          ..._AsyncCreators,
        },
      }
    },
    { AsyncTypes: {}, AsyncCreators: {} }
  )

const loadingReducer = (state, { familyType }) => ({
  ...state,
  isLoading: {
    ...state.isLoading,
    [familyType]: true,
  },
  errors: {
    ...state.errors,
    [familyType]: null,
  },
})

const successReducer = (state, { familyType }) => ({
  ...state,
  isLoading: {
    ...state.isLoading,
    [familyType]: false,
  },
  errors: {
    ...state.errors,
    [familyType]: null,
  },
})

const failureReducer = (state, { error, familyType }) => ({
  ...state,
  isLoading: {
    ...state.isLoading,
    [familyType]: false,
  },
  errors: {
    ...state.errors,
    [familyType]: error.message,
  },
})

/**
 * Used in conjuction with `createAsyncAction`
 * Maps the appropriate reducer for each action in thet async action family
 *
 * createAsyncReducers([
 *   'MY_ACTION_1_LOADING',
 *   'MY_ACTION_1_SUCCESS',
 *   'MY_ACTION_1_FAILURE',
 *   'MY_ACTION_2_LOADING',
 *   'MY_ACTION_2_SUCCESS',
 *   'MY_ACTION_2_FAILURE',
 * ]) returns the following:
 * {
 *   MY_ACTION_1_LOADING: loadingReducer,
 *   MY_ACTION_1_SUCCESS: successReducer,
 *   MY_ACTION_1_FAILURE: failureReducer,
 *   MY_ACTION_2_LOADING: loadingReducer,
 *   MY_ACTION_2_SUCCESS: successReducer,
 *   MY_ACTION_2_FAILURE: failureReducer,
 * }
 * @param {String[]} asyncActionTypes
 * @returns {Object}
 */
export const createAsyncReducers = (asyncActionTypes) => {
  return asyncActionTypes.reduce((reducerObj, actionType) => {
    const _actionType = actionType.toLowerCase()
    if (_actionType.indexOf("_loading") > -1) {
      reducerObj[actionType] = loadingReducer
    } else if (_actionType.indexOf("_success") > -1) {
      reducerObj[actionType] = successReducer
    } else if (_actionType.indexOf("_failure") > -1) {
      reducerObj[actionType] = failureReducer
    }
    return reducerObj
  }, {})
}

export const getErrorMsg = (e) => {
  const errorMsg = e.message.split(`[${e.code}]`)[1] || ""
  return errorMsg.trim() || e.message
}

export const generateEntity = (id, data) => ({ [id]: { ...data, id } })

export const setEntities = (state, { entities }) => ({
  ...state,
  entities: {
    ...state.entities,
    ...entities,
  },
})

/**
 * Utility saga for bubbling up errors from other sagas
 * Instead of using `yield take`, use this saga to wait for an async action response
 * If the async action responds with a failure, the error will be rethrown
 */
export function* waitForResponse(AsyncTypes, action) {
  yield put(action)
  const familyType = action.type
  const SUCCESS_ACTION = AsyncTypes[`${familyType}_SUCCESS`]
  const FAILURE_ACTION = AsyncTypes[`${familyType}_FAILURE`]
  const { failure } = yield race({
    success: take(SUCCESS_ACTION),
    failure: take(FAILURE_ACTION),
  })

  if (failure) {
    throw new Error(failure.error.message)
  }
}
