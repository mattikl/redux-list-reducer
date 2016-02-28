function initializeProperty() {
  return new Set()
}

function createGuarantees(properties) {
  return (state) => {
    return state.map(list => {
      if (typeof list !== 'object') {
        throw new Error('list objects must be of type "object"')
      }

      properties.forEach(property => {
        if (!list.property) {
          list[property] = initializeProperty()
        }
      })

      return list
    })
  }
}

export default (actions, itemsProperty, initialState = [], wrappedReducer, properties) => {
  const guaranteeProperties = createGuarantees(properties)

  if (!Array.isArray(initialState)) {
    throw new Error('initialState must be array')
  }

  function reducer(state = guaranteeProperties(initialState), action) {
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
      case actions.TOGGLE_PROPERTY:
        return _toggleProperty(state, action)
      default: {
        const newState = typeof wrappedReducer === 'function' ?
          wrappedReducer(state, action) : state

        if (!Array.isArray(newState)) {
          throw new Error('state must be array')
        }

        return guaranteeProperties(newState)
      }
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

  function _toggleProperty(state, action) {
    return state.map(list => {
      const found = list[itemsProperty].find(item => item === action.item)
      let property = list[action.property]
      if (found) {
        // TODO doing it inplace like this ruins redux time travel
        // fix if plainReducer is here to stay
        if (property.has(action.item)) {
          property.delete(action.item)
        } else {
          property.add(action.item)
        }
      }

      return {
        ...list,
        [action.property]: property
      }
    })
  }

  return reducer
}
