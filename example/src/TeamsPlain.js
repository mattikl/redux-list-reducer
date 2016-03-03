import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'

import Teams from './Teams'
import * as teamActions from './reducers/teams'

class TeamsPlain extends Component {
  componentDidMount() {
    if (!this.props.teams.length) {
      this.props.load()
    }
  }

  render() {
    const { teams, ...actions } = this.props

    if (teams.length) {
      return <Teams
        heading="Plain example"
        teams={teams}
        actions={actions}
      />
    } else {
      return <p>Loading teams...</p>
    }
  }
}

TeamsPlain.propTypes = {
  teams: PropTypes.array.isRequired,
  load: PropTypes.func.isRequired,
  addPlayer: PropTypes.func.isRequired,
  deleteItem: PropTypes.func.isRequired,
  update: PropTypes.func.isRequired,
  move: PropTypes.func.isRequired,
  moveToList: PropTypes.func.isRequired,
  toggleProperty: PropTypes.func.isRequired,
}

export default connect(state => ({
  teams: state.teams
}), teamActions)(TeamsPlain)
