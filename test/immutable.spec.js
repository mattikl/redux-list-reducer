import Immutable from 'immutable'
import { expect } from 'chai'
import listreducer from '../src'

describe('listreducer (immutable)', () => {

  // This is the initialState without the `selected` property
  // An Immutable.Set object gets set for each property
  // when the reducer is called with any action not handle by listreducer
  const rawLists = Immutable.fromJS([
    {
      name: 'foo',
      items: [
        2,
        3,
      ]
    },
    {
      name: 'bar',
      items: [
        4,
        5,
      ]
    },
    {
      name: 'baz',
      items: []
    },
  ])

  const {reducer, actionCreators} = listreducer({
    key: 'reducer',
    format: 'immutable',
    itemsProperty: 'items',
    properties: ['selected']
  })

  const lists = reducer(rawLists, {type: '@@@@'})

  it('returns state when action is unknown', () => {
    expect(reducer(lists, {type: '@@@@'})).to.eql(lists)
  })

  it('can push an item', () => {
    const action = actionCreators.push(5, lists.get(1))
    const state = reducer(lists, action)
    expect(state.get(1).get('items').get(2)).to.eql(5)
  })

  it('can delete an item', () => {
    const action = actionCreators.del(2)
    const state = reducer(lists, action)
    expect(state.get(0).get('items').count()).to.equal(1)
    expect(state.get(1).get('items').count()).to.equal(2)
    expect(state.get(0).get('items').get(0)).to.equal(3)
  })

  it('can move an item before another item', () => {
    const action = actionCreators.move(2, 4)
    const state = reducer(lists, action)
    expect(state.get(0).get('items').count()).to.equal(1)
    expect(state.get(1).get('items').count()).to.equal(3)
    // expect(state[1].items).to.eql([2, 4, 5])
  })

  it('returns state if item is moved to itself', () => {
    const action = actionCreators.move(2, 2)
    const state = reducer(lists, action)
    expect(state).to.eql(lists)
  })

  it('can move an item to another list', () => {
    const action = actionCreators.moveToList(3, lists.get(2))
    const state = reducer(lists, action)
    expect(state.get(0).get('items').count()).to.equal(1)
    expect(state.get(1).get('items').count()).to.equal(2)
    expect(state.get(2).get('items').count()).to.equal(1)
    expect(state.get(2).get('items').get(0)).to.eql(3)
  })

  it('sets property to false by default', () => {
    const state = reducer(lists, '@@@@')
    expect(state.get(0).get('selected').has(3)).to.equal(false)
  })

  it('can toggle property', () => {
    const action = actionCreators.toggleProperty('selected', 3)
    const state = reducer(lists, action)
    expect(state.get(0).get('selected').has(3)).to.equal(true)
    const newState = reducer(state, action)
    expect(newState.get(0).get('selected').has(3)).to.equal(false)
  })

})
