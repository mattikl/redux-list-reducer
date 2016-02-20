import { expect } from 'chai'
import listreducer from '../src'

describe('listreducer()', () => {
  const {reducer, actions} = listreducer()

  it('is a function', () => {
    expect(listreducer).to.be.a('function')
  })

  it('returns a reducer function and object of actions', () => {
    expect(reducer).to.be.a('function')
    expect(actions).to.be.a('object')
  })

  it('returns all implemented actions', () => {
    ['push', 'update', 'del', 'move', 'moveToList'].forEach(name => {
      expect(actions[name]).to.be.a('function')
    })
  })
})
