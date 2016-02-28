import Immutable, { List } from 'immutable'

function initializeProperty() {
  return Immutable.Set()
}

function createGuarantees(properties) {
  return (state) => {
    return state.map(list => {
      if (!Immutable.Map.isMap(list)) {
        throw new Error('list objects must be Immutable.Map')
      }

      properties.forEach(property => {
        if (!list.get(property)) {
          list = list.set(property, initializeProperty())
        }
      })

      return list
    })
  }
}

export default (actions, itemsProperty, initialState = List(), wrappedReducer, properties) => {
  const guaranteeProperties = createGuarantees(properties)

  if (!List.isList(initialState)) {
    throw new Error('initialState must be Immutable.List')
  }

  function reducer(state = guaranteeProperties(initialState), action) {
    switch (action.type) {
      case actions.PUSH:
        return state.map(list => list === action.list
          ? list.set(itemsProperty, list.get(itemsProperty).push(action.item))
          : list
        )
      case actions.DELETE:
        return state.map(list =>
          list.set(itemsProperty,
                   list.get(itemsProperty).filter(item => item !== action.item))
        )
      case actions.UPDATE: // TODO test
        return state.map(list =>
          list.set(itemsProperty,
                   list.get(itemsProperty).map(item => item === action.item ? action.newItem : item))
        )
      case actions.MOVE:
        return _move(state, action)
      case actions.MOVE_TO_LIST:
        return _moveToList(state, action)
      case actions.TOGGLE_PROPERTY:
        return _toggleProperty(state, action)
      default: {
        const newState = typeof wrappedReducer === 'function' ?
          wrappedReducer(state, action) : state

        if (!List.isList(newState)) {
          throw new Error('state must be Immutable.List')
        }

        return guaranteeProperties(newState)
      }
    }
  }

  function _move(state, action) {
    if (action.item === action.toItem) {
      return state
    }

    /*eslint-disable indent*/
    return state.map(list =>
      list.set(itemsProperty,
               list.get(itemsProperty).flatMap(item => {
        if (item === action.item) {
          return List()
        }

        if (item === action.toItem) {
          return action.before ? List([action.item, item]) : List([item, action.item])
        }

        return List([item])
      })))
    /*eslint-enable indent*/
  }

  function _moveToList(state, action) {
    return state.map(list => {
      const found = list.get(itemsProperty).find(item => item === action.item)
      const isMoveTarget = list === action.list

      // cannot move item to its own list
      if (found && isMoveTarget) {
        return list
      }

      if (found) {
        return list.set(itemsProperty,
                        list.get(itemsProperty).filter(item => item !== action.item)
        )
      }

      if (isMoveTarget) {
        return list.set(itemsProperty, list.get(itemsProperty).push(action.item))
      }

      return list
    })
  }

  function _toggleProperty(state, action) {
    return state.map(list => {
      const found = list.get(itemsProperty).find(item => item === action.item)
      if (!found) return list

      const property = list.get(action.property)

      const newValue = property.has(action.item) ? property.delete(action.item) : property.add(action.item)
      return list.set(action.property, newValue)
    })
  }

  return reducer
}
