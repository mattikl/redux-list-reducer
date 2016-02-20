import React, { Component } from 'react'
import { connect } from 'react-redux'
import { DragDropContext } from 'react-dnd'
import HTML5Backend from 'react-dnd-html5-backend'

import List from './List'
import * as teamActions from './reducers/teams'

@DragDropContext(HTML5Backend)
class App extends Component {
  componentDidMount() {
    this.props.load()
  }

  render() {
    const { teams, ...actions } = this.props

    return (
      <div>
        <h1>Teams</h1>
        { teams && teams.length ?
            teams.map((team, index) => <List key={index} team={team} {...actions} />)
          : <p>Loading teams...</p>
        }
      </div>
    )
  }
}

export default connect(state => ({
  teams: state.teams
}), teamActions)(App)
