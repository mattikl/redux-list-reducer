# redux-list-reducer

`redux-list-reducer` is a factory function for creating
[Redux](http://rackt.github.io/redux) reducers that
operate on lists.

**This is an early version and still a work in progress, do not use in production yet,
expect the interface to change.**

Read **[Thoughts](#thoughts)** before using this module.

### Current Approach

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

### Thoughts

I started implementing drag & drop within a list and between lists, then realized
that with current tools all complexity lies in the reducer implementation.
This module is my attempt to abstract away that complexity and make reducer
implementation simple. For simple data models it succeeds in this, as can be
seen in the [example app](https://github.com/mattikl/redux-list-reducer/tree/master/example).

However, for larger applications the correct approach seems to be normalizing
nested API objects, then placing each object in its own context reducer,
and the list reducers contain IDs to these objects. [flux-react-router-example](https://github.com/gaearon/flux-react-router-example) is an example of this using [normalizr](https://github.com/gaearon/normalizr).

I have yet to see any reducer factory gain widespread usage. It looks like the primary
design goal is to keep reducers so simple that no factories are needed. [redux-crud](https://github.com/Versent/redux-crud) is an example of a library that provides standard actions and reducers for Redux CRUD Applications, and you can also wrap its recuder in your own reducer.

When using a factory like this, you need to understand how it works. The question is how much of
its internals you need to understand, and can you count on the internals to stay the same
(semantic versioning provides guarantees that the interface won't change in a backwards incompatible
manner but says nothing about the internals). The factory approach helps you to start out quick,
so it may be a good tool for prototyping.

On the one hand using object identity instead of external IDs feels more correct,
ot the other using IDs can make things much simpler.

I will continue playing with this idea and learning more, but can say nothing at the where this
project is going. Comments and ideas welcome.

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
