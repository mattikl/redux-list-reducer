import { expect } from 'chai'
import listreducer from '../src'

describe('listreducer (with lists)', () => {
  const teams = [
    {
      name: 'foo',
      players: [
        {name: 'Tom'},
        {name: 'Rob'},
      ]
    },
    {
      name: 'bar',
      players: [
        {name: 'Bob'},
        {name: 'Jim'},
      ]
    },
    {
      name: 'baz',
      players: []
    },
  ]

  const {reducer, actionCreators} = listreducer({
    initialState: [],
    itemsProperty: 'players',
    properties: ['selected']
  })

  it('returns state when action is unknown', () => {
    expect(reducer(teams, {type: '@@@@'})).to.eql(teams)
  })

  it('can push an item', () => {
    const action = actionCreators.push({name: 'Tim'}, teams[1])
    const state = reducer(teams, action)
    expect(state[1].players[2]).to.eql({name: 'Tim'})
  })

  it('can delete an item', () => {
    const action = actionCreators.del(teams[0].players[0])
    const state = reducer(teams, action)
    expect(state[0].players.length).to.equal(1)
    expect(state[1].players.length).to.equal(2)
    expect(state[0].players[0].name).to.equal('Rob')
  })

  it('can move an item before another item', () => {
    const action = actionCreators.move(teams[0].players[0], teams[1].players[0])
    const state = reducer(teams, action)
    expect(state[0].players.length).to.equal(1)
    expect(state[1].players.length).to.equal(3)
    expect(state[1].players.map(p => p.name)).to.eql(['Tom', 'Bob', 'Jim'])
  })

  it('returns state if item is moved to itself', () => {
    const action = actionCreators.move(teams[0].players[0], teams[0].players[0])
    const state = reducer(teams, action)
    expect(state).to.eql(teams)
  })

  it('can move an item to another list', () => {
    const action = actionCreators.moveToList(teams[0].players[1], teams[2])
    const state = reducer(teams, action)
    expect(state[0].players.length).to.equal(1)
    expect(state[1].players.length).to.equal(2)
    expect(state[2].players.length).to.equal(1)
    expect(state[2].players[0]).to.eql({name: 'Rob'})
  })

  it('sets property to false by default', () => {
    const state = reducer(teams, '@@@@')
    expect(state[0].selected.has(teams[0].players[1])).to.equal(false)
  })

  it('can toggle property', () => {
    const action = actionCreators.toggleProperty('selected', teams[0].players[1])
    const state = reducer(teams, action)
    expect(state[0].selected.has(teams[0].players[1])).to.equal(true)
    const newState = reducer(state, action)
    expect(state[0].selected.has(teams[0].players[1])).to.equal(false)
  })
})
