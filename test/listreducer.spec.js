import { expect } from 'chai'
import listreducer from '../src'

describe('listreducer()', () => {
  const {reducer, actionCreators} = listreducer({itemsProperty: 'items'})

  it('is a function', () => {
    expect(listreducer).to.be.a('function')
  })

  it('returns a reducer function and object of action creators', () => {
    expect(reducer).to.be.a('function')
    expect(actionCreators).to.be.a('object')
  })

  it('returns all implemented action creators', () => {
    ['push', 'update', 'del', 'move', 'moveToList'].forEach(name => {
      expect(actionCreators[name]).to.be.a('function')
    })
  })

  it('must get itemsProperty', () => {
    expect(listreducer).to.throw(Error)
  })
})
