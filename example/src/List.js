import React, { Component, PropTypes } from 'react'
import { DropTarget } from 'react-dnd'

import Item from './Item'


// You can drop to a list if it's empty
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

  // abusing refs to keep the example simple and in one place

  _addPlayer = event => {
    const name = event.target.value
    if (name === '') return
    this.refs.addnew.value = ''
    this.refs.addnew.focus()
    this.props.addPlayer(name, this.props.team)
  }

  _editPlayer = (player, name) => {
    // it's important here that we don't mutate the player
    // object but create a new one
    const updatedPlayer = {
      ...player,
      name
    }
    this.props.update(player, updatedPlayer)

    // Calling `toggleProperty` here has no effect here on the UI,
    // because `updatedPlayer` is now displayed. This call
    // just removes the reference to `player` and allows it to be GC'd
    this.props.toggleProperty('selected', player)
  }

  _onAddNewKeyDown = event => {
    if (event.keyCode === 13) {
      this.refs.addnew.blur()
    }
  }

  render() {
    const {
      team,
      deleteItem,
      update,
      move,
      connectDropTarget,
      toggleProperty } = this.props

    return connectDropTarget(
      <div>
        <span>Team {team.name}</span>
        <ul>
          {team.players.map((player, index) =>
            team.selected.has(player) ?
              <li key={index}>
                <input
                  ref="editplayer"
                  defaultValue={player.name}
                  placeholder="Edit player"
                  onBlur={event => this._editPlayer(player, event.target.value)}
                  onKeyDown={event => event.keyCode === 13 && this.refs.editplayer.blur()}
                />
              </li>

            : <Item
                key={index}
                player={player}
                onMove={move}
              >
                {player.name}
                {' '}
                <button onClick={deleteItem.bind(null, player)}>delete</button>
                {' '}
                <button onClick={toggleProperty.bind(null, 'selected', player)}>Edit</button>
              </Item>
          )}
          <li key="addnew">
            <input
              ref="addnew"
              placeholder="Add new"
              onBlur={this._addPlayer}
              onKeyDown={this._onAddNewKeyDown}
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
  toggleProperty: PropTypes.func.isRequired,
}
