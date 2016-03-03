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
