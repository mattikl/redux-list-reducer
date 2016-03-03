import { combineReducers } from 'redux'
import teams from './teams'
import teamsImmutable from './teamsImmutable'

export default combineReducers({
  teams,
  teamsImmutable
})
