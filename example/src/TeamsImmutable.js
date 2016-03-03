import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'

import Teams from './Teams'
import * as teamActions from './reducers/teamsImmutable'

class TeamsImmutable extends Component {
  componentDidMount() {
    if (!this.props.teams.count()) {
      this.props.load()
    }
  }

  render() {
    const { teams, ...actions } = this.props

    if (teams.count()) {
      return <Teams
        heading="Immutable example"
        teams={teams}
        actions={actions}
      />
    } else {
      return <p>Loading teams...</p>
    }
  }
}

TeamsImmutable.propTypes = {
  teams: PropTypes.object.isRequired,
  load: PropTypes.func.isRequired,
  addPlayer: PropTypes.func.isRequired,
  deleteItem: PropTypes.func.isRequired,
  update: PropTypes.func.isRequired,
  move: PropTypes.func.isRequired,
  moveToList: PropTypes.func.isRequired,
  toggleProperty: PropTypes.func.isRequired,
}

export default connect(state => ({
  teams: state.teamsImmutable
}), teamActions)(TeamsImmutable)
