const ACTION_PREFIX = 'listreducer/'

const ACTIONS = [
  'PUSH',
  'UPDATE',
  'DELETE',
  'MOVE',
  'MOVE_TO_LIST'
]

export default function (params = {}) {
  const {
    initialState,
    wrappedReducer,
    itemsProperty
  } = params

  if (!itemsProperty) {
    throw new Error('itemsProperty must be defined for listreducer')
  }

  if (wrappedReducer !== undefined && ! typeof wrappedReducer === 'function') {
    throw new Error('wrappedReducer is defined, but it is not a function')
  }

  const format = params.format || 'plain'
  const key = params.key || ''

  // `key` is appended to each actions, so that `listreducer` can be
  // used multiple times in the same application. Otherwise all
  // `listreducer` instances respond to the same actions
  const actions = ACTIONS.reduce((acc, name) => ({
    ...acc,
    [name]: `${ACTION_PREFIX}${name}-${key}`
  }), {})

  let createReducer

  if (format === 'plain') {
    createReducer = require('./plainReducer')
  } else if (format === 'immutable') {
    createReducer = require('./immutableReducer')
  } else {
    throw new Error(`Unknown format ${format}`)
  }

  /*
   * ACTION CREATORS
   */

  const push = (item, list) => ({
    type: actions.PUSH,
    item,
    list
  })

  const del = (item) => ({
    type: actions.DELETE,
    item
  })

  const update = (item, newItem) => ({
    type: actions.UPDATE,
    item,
    newItem
  })

  const move = (item, toItem, before = true) => ({
    type: actions.MOVE,
    item,
    toItem,
    before
  })

  const moveToList = (item, list) => ({
    type: actions.MOVE_TO_LIST,
    item,
    list
  })

  return {
    reducer: createReducer(actions, itemsProperty, initialState, wrappedReducer),
    actionCreators: {
      push,
      del,
      update,
      move,
      moveToList
    }
  }
}
