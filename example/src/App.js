import React, { Component, PropTypes } from 'react'
import { DragDropContext } from 'react-dnd'
import HTML5Backend from 'react-dnd-html5-backend'
import { Link } from 'react-router'

@DragDropContext(HTML5Backend)
export default class App extends Component {
  render() {

    return (
      <div>
        <h1>Teams</h1>

        <p>
          Choose either <Link to="plain">plain example</Link> or
          {' '}
          <Link to="immutable">immutable example</Link>.
        </p>

        <div className="content">
          {this.props.children}
        </div>
      </div>
    )
  }
}

// App.propTypes = {
//   teams: PropTypes.array.isRequired,
//   load: PropTypes.func.isRequired,
//   addPlayer: PropTypes.func.isRequired,
//   deleteItem: PropTypes.func.isRequired,
//   update: PropTypes.func.isRequired,
//   move: PropTypes.func.isRequired,
//   moveToList: PropTypes.func.isRequired,
//   toggleProperty: PropTypes.func.isRequired,
// }

// export default connect(state => ({
//   teams: state.teams
// }), teamActions)(App)
