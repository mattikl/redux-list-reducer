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

* `push(item)`
* `del(item)`
* `update(item)`
* `move(item, toItem, before = true)`
* `moveToList(item, list)`

### Usage

See the example app under [example/](https://github.com/mattikl/redux-list-reducer/tree/master/example) and tests. Particularly, [teams.js](https://github.com/mattikl/redux-list-reducer/blob/master/example/src/reducers/teams.js) shows how the library is used.

To run the example, you first need to build `redux-list-reducer` first:

```
npm install
npm run build
cd example
npm install
npm start
```

And now you should have the example running on localhost port 5000.

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

### Thanks

* The example app is based on [react-hot-boilerplate](react-hot-boilerplate)
  and uses [react-dnd](http://gaearon.github.io/react-dnd/)
* Book [SurviveJS - Webpack and React](http://survivejs.com/) provides a
  detailed walk-through of [implementing Drag and Drop](http://survivejs.com/webpack_react/implementing_dnd/) much like in the example app
