export default (actions, itemsProperty, initialState = [], wrappedReducer) => {
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

  return reducer
}
