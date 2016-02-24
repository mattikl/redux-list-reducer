import { expect } from 'chai'
import listreducer from '../src'

describe('listreducer (immutable)', () => {
  it('is not yet supported', () => {
    const createReducer = () => listreducer({
      format: 'immutable',
      itemsProperty: 'items'
    })
    expect(createReducer).to.throw(/immutable format not supported/)
  })
})
