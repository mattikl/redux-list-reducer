import React, { Component, PropTypes } from 'react'

import List from './List'

export default class Teams extends Component {
  render() {
    const { teams, heading, actions } = this.props

    return (
      <div>
        <h2>{heading}</h2>

        <p>
          Drag the players around, add new, edit, delete.
        </p>

        { teams.map((team, index) =>
          <List
            key={index}
            team={team}
            {...actions}

          />
          )
        }
      </div>
    )
  }
}

Teams.propTypes = {
  teams: PropTypes.any.isRequired,
  actions: PropTypes.object.isRequired,
}
