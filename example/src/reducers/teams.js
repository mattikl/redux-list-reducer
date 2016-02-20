import listreducer from '../../../lib'
import Api from '../mockApi'

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
  initialState: [],
  itemsField: 'players',
  wrappedReducer
})

export default reducer

export function load() {
  return dispatch => api.getTeams().then(teams => dispatch({
    type: LOAD,
    result: teams
  }))
}

export function addPlayer(name, team) {
  return dispatch => api.createPlayer(name).then(player => dispatch(actions.push(player, team)))
}

export const deleteItem = actions.del
export const update = actions.update
export const move = actions.move
export const moveToList = actions.moveToList
