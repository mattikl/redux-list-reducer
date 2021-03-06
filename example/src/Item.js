import React, { Component, PropTypes } from 'react'
import {DragSource, DropTarget} from 'react-dnd'

// items are both drag and drop targets

const source = {
  beginDrag(props) {
    return {
      player: props.player
    }
  }
}

const target = {
  drop(targetProps, monitor) {
    const targetPlayer = targetProps.player
    const sourceProps = monitor.getItem()
    const sourcePlayer = sourceProps.player

    if (sourcePlayer !== targetPlayer) {
      targetProps.onMove(sourcePlayer, targetPlayer)
    }
  }
}

@DragSource('Item', source, (connect) => ({
  connectDragSource: connect.dragSource(),
}))
@DropTarget('Item', target, (connect) => ({
  connectDropTarget: connect.dropTarget()
}))
export default class Item extends Component {
  render() {
    const {
      connectDragSource,
      connectDropTarget,
      player,
      onMove } = this.props

    return connectDragSource(connectDropTarget(
      <li>
        {this.props.children}
      </li>
    ))
  }
}

Item.propTypes = {
  player: PropTypes.object.isRequired,
  onMove: PropTypes.func.isRequired,
}
