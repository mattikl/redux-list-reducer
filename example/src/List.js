import React, { Component, PropTypes } from 'react'
import { DropTarget } from 'react-dnd'
import Immutable from 'immutable'

import Item from './Item'

// This file implements a list component that accepts either a plain JS
// or `Immutable.Map` as a prop. Still searching for best ways to handle
// immutable data in React components, some thoughts here:
// https://gist.github.com/jlongster/028c83ed09d99c09983a

// You can drop to a list if it's empty
const target = {
  drop(targetProps, monitor) {
    const targetTeam = targetProps.team
    const sourceProps = monitor.getItem()
    const sourcePlayer = sourceProps.player

    const count = isImmutable(targetTeam)
      ? targetTeam.get('players').count()
      : targetTeam.players.length

    if (!count) {
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
    const updatedPlayer = _set(player, 'name', name)

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
        <span>Team {_get(team, 'name')}</span>
        <ul>
          {_get(team, 'players').map((player, index) =>
            _get(team, 'selected').has(player) ?
              <li key={index}>
                <input
                  ref="editplayer"
                  defaultValue={_get(player, 'name')}
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
                {_get(player, 'name')}
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

// helpers to make this component work with ImmutableJS and plain objects

const isImmutable = obj => Immutable.Map.isMap(obj)
const _get = (obj, property) => isImmutable(obj) ? obj.get(property) : obj[property]
const _set = (obj, property, value) => isImmutable(obj) ? obj.set(property, value) : { ...obj, [property]: value}
