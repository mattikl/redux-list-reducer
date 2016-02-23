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

const {reducer, actionCreators} = listreducer({
  key: 'teams',
  initialState: [], // initial data is loaded asynchronously from the mock API
  itemsProperty: 'players',
  wrappedReducer
})

// the reducer is exported as the default export and the
// action creators as named exports in style of Redux Ducks

export default reducer

// We create async actions for loading data from the mocked API
// and adding new data. load() calls our own action while
// addPlayer() calls an action creator from the library

export function load() {
  return dispatch => api.getTeams().then(teams => dispatch({
    type: LOAD,
    result: teams
  }))
}

export function addPlayer(name, team) {
  return dispatch => api.createPlayer(name).then(player => dispatch(actionCreators.push(player, team)))
}

// We can use the following action creators straight from the library

export const deleteItem = actionCreators.del
export const update = actionCreators.update
export const move = actionCreators.move
export const moveToList = actionCreators.moveToList
