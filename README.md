# redux-list-reducer

`redux-list-reducer` is a factory function for creating
[Redux](http://rackt.github.io/redux) reducers that
operate on lists.

**This is an early version and still a work in progress, do not use in production yet,
expect the interface to change.**

Read **[Thoughts](#thoughts)** before using this module.

### Current Approach

The reducer works on lists, which are expected to contain unique items
among all lists. The items can be of any type as long as for any
two items a and b `a !== b` holds. At the moment there are no
checks that the user doesn't include the same item twice.

There are two practical options for items:

* items are JavaScript objects
* the objects themselves are kept in a separate recuder and the items are
  object IDs (integer or UUID) (normalized schema)

The user is expected to handle the data in immutable fashion. Currently either
JavaScript collections (default) or [ImmutableJs](https://facebook.github.io/immutable-js/)
can be used. The idea is to develop a well-tested and performant implementation of basic actions with lists.

Exported action creators:

| Action creator  | Explanation |
| --------------- | ------- |
| `push(item, list)` | Add `item` to `list` |
| `del(item)` | Delete `item` if it exists on any list, otherwise return the current state |
| `update(item, newItem)` | Update `item` with `newItem` |
| `move(item, toItem, before = true)` | Move `item` before/after `toItem` (Currently if `toItem` is not found `item` just gets deleted) |
| `moveToList(item, list)` | Moves `item` to `list`, use this if the list is empty |
| `toggleProperty(property, item)` | See [Properties](#properties) |

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

const {reducer, actionCreators} = listreducer({
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

To use ImmutableJS, you need pass `format: 'immutable'` to listreducer, and the
state needs to be an `Immutable.List` and the list objects `Immutable.Map`.
To use the `initialState` from above:

```javascript
import Immutable from 'immutable'

const {reducer, actionCreators} = listreducer({
  initialState: Immutable.fromJS(initialState),
  format: 'immutable'
  itemsProperty: 'items',
  wrappedReducer // needs to operate on Immutable objects
})
```

#### Properties

Properties can be used to track if an item is e.g. selected or being edited.
Used properties must be passed to `listreducer` as params:

```javascript
const {reducer, actionCreators} = listreducer({
  itemsProperty: 'items',
  properties: ['selected', 'editing']
})
```

Checking if property is active for item: `list[property].has(item)`. For example,
if we're using React and rendering a list of players in a team, showing either
`<EditPlayer>` or `<Player>` component based on property `editing`:

```javascript
<ul>
  {
    team.players.map((player, index) =>
      team.editing.has(player) ?
          <EditPlayer ... />
        : <Player ... />
    )
  }
</ul>
```

Then the editing state of the player can be toggled with
`this.props.toggleProperty('selected', player)` assuming the `toggleProperty`
action creator is bound to the component.

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

For larger applications the correct approach seems to be normalizing
nested API objects, then placing each object in its own context reducer,
and the list reducers contain IDs to these objects. [flux-react-router-example](https://github.com/gaearon/flux-react-router-example) is an example of this using [normalizr](https://github.com/gaearon/normalizr). This can be accomplished in placing list items
in a separate reducer and storing their IDs in the list reducer.

I have yet to see any reducer factory gain widespread usage. It looks like the primary
design goal is to keep reducers so simple that no factories are needed. [redux-crud](https://github.com/Versent/redux-crud) is an example of a library that provides standard actions and reducers for Redux CRUD Applications, and you can also wrap its recuder in your own reducer.

When using a factory like this, you need to understand how it works. The question is how much of
its internals you need to understand, and can you count on the internals to stay the same
(semantic versioning provides guarantees that the interface won't change in a backwards incompatible
manner but says nothing about the internals). The factory approach helps you to start out quick,
so it may be a good tool for prototyping.

On the one hand using object identity instead of external IDs feels more correct,
ot the other using IDs can make things much simpler.

I will continue developing this project and learning more, but can say nothing at the moment where this
project is going. Comments and ideas welcome.

### Thanks

* The example app is based on [react-hot-boilerplate](react-hot-boilerplate)
  and uses [react-dnd](http://gaearon.github.io/react-dnd/)
* Book [SurviveJS - Webpack and React](http://survivejs.com/) provides a
  detailed walk-through of [implementing Drag and Drop](http://survivejs.com/webpack_react/implementing_dnd/) much like in the example app
