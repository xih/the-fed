import { createActions, createReducer as _createReducer } from 'reduxsauce'
import { put, race, take } from 'redux-saga/effects'
import { replace } from 'lodash'

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
    [actionName]: ['payload'],
  })

  console.log('types', ParentTypes)
  console.log('Creators', ParentCreators)
  const familyType = Object.values(ParentTypes)[0]
  const parentCreator = Object.values(ParentCreators)[0]
  const wrappedParentCreator = (...args) => {
    const action = parentCreator(...args)
    return {
      ...action,
      familyType
    }
  }

  console.log('what is the wrapped parentCreators', wrappedParentCreator)
  console.log('parentCreator', parentCreator)

  const { Types: ChildTypes, Creators: ChildCreators } = createActions({
    [`${actionName}Loading`]: null,
    [`${actionName}Success`]: ['payload'],
    [`${actionName}Failure`]: ['error'],
  })


  console.log('childtypes', ChildTypes)
  console.log('ChildCreators', ChildCreators)


  const wrappedChildCreators = {}
  Object.entries(ChildCreators).forEach(([key, childCreator]) => {
    wrappedChildCreators[key] = (...args) => {
      const action = childCreator(...args)
      return {
        ...action,
        familyType
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
    }
  }
}

console.log('hello~$~~~~', createAsyncAction('fetchProfile'))


export const createManyAsyncActions = (asyncActionName) => (
  asyncActionName.reduce((data, name) => {
    const { AsyncTypes: _AsyncTypes, AsyncCreators: _AsyncCreators } = createAsyncAction(name)
    return {
      AsyncTypes: {
        ...data.AsyncTypes,
        ..._AsyncTypes,
      }, 
      AsyncCreators: {
        ...data.AsyncCreators,
        ..._AsyncCreators,
      }
    }

  }, { AsyncTypes: {}, AsyncCreators: {} })
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
  }
})

const successReducer = (state, { familyType }) => ({
  ...state,
  isLoading: {
    ...state.isLoading,
    [familyType]: false,
  },
  errors: {
    ...state.errors,
    [familyType]: null
  }
})

const failureReducer = (state, { error, familyType }) => ({
  ...state,
  isLoading: {
    ...state.isLoading,
    [familyType]: false,
  },
  errors: {
    ...state.errors,
    [familyType]: error.message
  }
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
    if (_actionType.indexOf('_loading') > -1 ) {
      reducerObj[actionType] = loadingReducer
    } else if (_actionType.indexOf('_success') > -1 ) {
      reducerObj[actionType] = successReducer
    } else if (_actionType.indexOf('_failure') > -1) {
      reducerObj[actionType] = failureReducer
    }
    return reducerObj
  }, {})
}

export const getErrorMsg = (e) => {
  const errorMsg = e.message.split(`[${e.code}]`)[1] || '';
  return errorMsg.trim() || e.message
}
