import listreducer from '../../../lib'
import Api from '../mockApi'

// see mockApi.js for initial data layout
const api = new Api()

const LOAD = 'example/teams/LOAD'

const wrappedReducer = (state, action) => {
  switch (action.type) {
    case LOAD:
      return action.result
    default:
      return state
  }
}

const {reducer, actions} = listreducer({
  key: 'teams',
  initialState: [], // initial data is loaded asynchronously from the mock API
  itemsField: 'players',
  wrappedReducer
})

// the reducer is exported as the default export and the
// actions as named exports in style of Redux Ducks

export default reducer

// We create async actions for loading data from the mocked API
// and adding new data. load() calls our own action while
// addPlayer() calls an action from the library

export function load() {
  return dispatch => api.getTeams().then(teams => dispatch({
    type: LOAD,
    result: teams
  }))
}

export function addPlayer(name, team) {
  return dispatch => api.createPlayer(name).then(player => dispatch(actions.push(player, team)))
}

// We can use the following actions straight from the library

export const deleteItem = actions.del
export const update = actions.update
export const move = actions.move
export const moveToList = actions.moveToList
