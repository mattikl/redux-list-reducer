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
    throw new Error('wrappedReducer must be a function')
  }

  const key = params.key || ''

  // `key` is appended to each actions, so that `listreducer` can be
  // used multiple times in the same application. Otherwise all
  // `listreducer` instances respond to the same actions
  const actions = ACTIONS.reduce((acc, name) => ({
    ...acc,
    [name]: `${ACTION_PREFIX}${name}-${key}`
  }), {})

  function reducer(state = initialState, action) {
    switch (action.type) {
      case actions.PUSH:
        return state.map(list => list === action.list ?
          {
            ...list,
            [itemsProperty]: [...list[itemsProperty], action.item]
          } : list
        )
      case actions.DELETE:
        return state.map(list => ({
          ...list,
          [itemsProperty]: list[itemsProperty].filter(item => item !== action.item)
        }))
      case actions.UPDATE:
        return state.map(list => ({
          ...list,
          [itemsProperty]: list[itemsProperty].map(item => item === action.item ? action.newItem : item)
        }))
      case actions.MOVE:
        return _move(state, action)
      case actions.MOVE_TO_LIST:
        return _moveToList(state, action)
      default:
        return typeof wrappedReducer === 'function' ?
          wrappedReducer(state, action) : state
    }
  }

  function _move(state, action) {
    if (action.item === action.toItem) {
      return state
    }

    return state.map(list => ({
      ...list,
      [itemsProperty]: Array.prototype.concat.apply([], list[itemsProperty].map(item => {
        if (item === action.item) {
          return []
        }

        if (item === action.toItem) {
          return action.before ? [action.item, item] : [item, action.item]
        }

        return [item]
      }))
    }))
  }

  function _moveToList(state, action) {
    return state.map(list => {
      const found = list[itemsProperty].find(item => item === action.item)
      const isMoveTarget = list === action.list

      // cannot move item to its own list
      if (found && isMoveTarget) {
        return list
      }

      if (found) {
        return {
          ...list,
          [itemsProperty]: list[itemsProperty].filter(item => item !== action.item)
        }
      }

      if (isMoveTarget) {
        return {
          ...list,
          [itemsProperty]: [...list[itemsProperty], action.item]
        }
      }

      return list
    })
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
    reducer,
    actionCreators: {
      push,
      del,
      update,
      move,
      moveToList
    }
  }
}
