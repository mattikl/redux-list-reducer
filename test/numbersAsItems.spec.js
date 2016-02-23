import { expect } from 'chai'
import listreducer from '../src'

describe('listreducer (numbers as items)', () => {

  // this tests a use case where the items themselves are kept in a different
  // reducer and their IDs are the list reducer items

  const lists = [
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
  ]

  const {reducer, actionCreators} = listreducer({
    initialState: [],
    itemsProperty: 'items'
  })

  it('returns state when action is unknown', () => {
    expect(reducer(lists, {type: '@@@@'})).to.eql(lists)
  })

  it('can push an item', () => {
    const action = actionCreators.push(5, lists[1])
    const state = reducer(lists, action)
    expect(state[1].items[2]).to.eql(5)
  })

  it('can delete an item', () => {
    const action = actionCreators.del(lists[0].items[0])
    const state = reducer(lists, action)
    expect(state[0].items.length).to.equal(1)
    expect(state[1].items.length).to.equal(2)
    expect(state[0].items[0]).to.equal(3)
  })

  it('can move an item before another item', () => {
    const action = actionCreators.move(lists[0].items[0], lists[1].items[0])
    const state = reducer(lists, action)
    expect(state[0].items.length).to.equal(1)
    expect(state[1].items.length).to.equal(3)
    expect(state[1].items).to.eql([2, 4, 5])
  })

  it('returns state if item is moved to itself', () => {
    const action = actionCreators.move(lists[0].items[0], lists[0].items[0])
    const state = reducer(lists, action)
    expect(state).to.eql(lists)
  })

  it('can move an item to another list', () => {
    const action = actionCreators.moveToList(lists[0].items[1], lists[2])
    const state = reducer(lists, action)
    expect(state[0].items.length).to.equal(1)
    expect(state[1].items.length).to.equal(2)
    expect(state[2].items.length).to.equal(1)
    expect(state[2].items[0]).to.eql(3)
  })

})
