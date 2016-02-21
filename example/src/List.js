import React, { Component, PropTypes } from 'react'
import { DropTarget } from 'react-dnd'

import Item from './Item'

const target = {
  drop(targetProps, monitor) {
    const targetTeam = targetProps.team
    const sourceProps = monitor.getItem()
    const sourcePlayer = sourceProps.player

    if (!targetTeam.players.length) {
      targetProps.moveToList(sourcePlayer, targetTeam)
    }
  }
}

@DropTarget('Item', target, (connect) => ({
  connectDropTarget: connect.dropTarget()
}))
export default class List extends Component {
  _addPlayer = event => {
    const name = event.target.value
    if (name === '') return
    this.refs.addnew.value = ''
    this.refs.addnew.focus()
    this.props.addPlayer(name, this.props.team)
  }

  _onKeyDown = event => {
    if (event.keyCode === 13) {
      this.refs.addnew.blur()
    }
  }

  render() {
    const { team, deleteItem, update, move, connectDropTarget } = this.props

    return connectDropTarget(
      <div>
        <span>Team {team.name}</span>
        <ul>
          {team.players.map((player, index) =>
            <Item
              key={index}
              player={player}
              onMove={move}
            >
              {player.name}
              {' '}
              <button onClick={deleteItem.bind(null, player)}>delete</button>
              {' '}
              <button onClick={update.bind(null, player, {...player, name: player.name + ' rocks'})}>...rocks</button>
            </Item>
          )}
          <li key="addnew">
            <input
              ref="addnew"
              placeholder="Add new"
              onBlur={this._addPlayer}
              onKeyDown={this._onKeyDown}
            />
          </li>
        </ul>
      </div>
    )
  }
}

List.propTypes = {
  team: PropTypes.object.isRequired,
  addPlayer: PropTypes.func.isRequired,
  deleteItem: PropTypes.func.isRequired,
  update: PropTypes.func.isRequired,
  moveToList: PropTypes.func.isRequired,
}
