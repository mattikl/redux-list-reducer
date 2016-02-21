# redux-list-reducer

`redux-list-reducer` is a factory function for creating
[Redux](http://rackt.github.io/redux) reducers that
operate on lists.

**This is an early version, do not use in production yet,
expect the interface to change.**

The lists are expected to contain JavaScript objects, and each object
can exists only once in all lists. Currently, object identity is used
to identify both lists and objects. The user is expected to handle the
data in immutable fashion.

Idea is to develop a well-tested and performant implementation of basic
actions with lists.

Supported actions:

* `push(item, list)`
* `del(item)`
* `update(item, newItem)`
* `move(item, toItem, before = true)`
* `moveToList(item, list)`

### Usage

See the example app under [example/](https://github.com/mattikl/redux-list-reducer/tree/master/example) and tests. Particularly, [teams.js](https://github.com/mattikl/redux-list-reducer/blob/master/example/src/reducers/teams.js) shows how the library is used.

In your [reducer](http://redux.js.org/docs/basics/Reducers.html) implementation that operates on lists of data:

```javascript
import listreducer from 'redux-list-reducer'

// Define your own reducer
// Rather than exporting this directly to use in `combineReducers`, pass this
// as an argument to `listreducer`. Redux never calls this function directly,
// but listReducer first tries to match its own actions, then if none
// match it calls this function with the current state and action.

const wrappedReducer = (state, action) => {
  switch (action.type) {
    case LOAD:
      return action.result
    default:
      return state
  }
}

// Create the final reducer and get the default actions

const {reducer, actions} = listreducer({
  initialState: [],
  itemsProperty: 'items',
  wrappedReducer
})

export default reducer

// Define your actions (they can use actions exported by listreducer or
// be completely independed), export them and the listreducer actions
// you want to expose to the user

```

The state `listreducer` operates on is an array list list objects.
This can either be passed as `initialState` or loaded by the actions
in `wrappedReducer`. The following could have been used as `initialState`
in the example above:

```javascript
const initialState = [
  {
    items: [
      {name: 'foo'},
      {name: 'bar'},
    ]
  },
  {
    items: [
      {name: 'baz'},
    ]
  }
]
```

The property `items` was defined as `itemsProperty` in when calling
`listreducer` above.


### Installation

Install from npm as a dependency of your project:

```
npm install redux-list-reducer --save
```

If you want to hack on the project, clone the repo, build it, then use `npm link` to
access it from your project:

```
git clone https://github.com/mattikl/redux-list-reducer
cd redux-list-reducer
npm install
npm build
npm link
cd /path/to/your/project
npm link redux-list-reducer
```

### Motivation

I started implementing drag & drop within a list and between lists, then realized
that with current tools all complexity lies in the reducer implementation.

I have yet to see any reducer factory gain widespread usage, so I am still
hesitant about the feasibility of this idea. I'm going to use this in a couple
of real world projects to test the idea.

From a design perspective, extensibility of this reducer is key. Currently,
the implementation places strict constraints on data and the only way to
extend provided actions is to redefine them in `wrappedReducer`.

Comments and ideas welcome.

### TODO

* [ ] more documentation
* [ ] error handling & safety checks
* [ ] validate `params`
* [ ] a version that uses `immutable-js`

### Thanks

* The example app is based on [react-hot-boilerplate](react-hot-boilerplate)
  and uses [react-dnd](http://gaearon.github.io/react-dnd/)
* Book [SurviveJS - Webpack and React](http://survivejs.com/) provides a
  detailed walk-through of [implementing Drag and Drop](http://survivejs.com/webpack_react/implementing_dnd/) much like in the example app
