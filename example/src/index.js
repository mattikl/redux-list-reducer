import React from 'react'
import ReactDOM from 'react-dom'
import { createStore, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import { Provider } from 'react-redux'
import { Router, Route, browserHistory } from 'react-router'

import App from './App'
import TeamsPlain from './TeamsPlain'
import TeamsImmutable from './TeamsImmutable'
import rootReducer from './reducers/index'

const store = createStore(
  rootReducer,
  applyMiddleware(thunk)
)

ReactDOM.render(
  <Provider store={store}>
    <Router history={browserHistory}>
      <Route path="/" component={App}>
        <Route path="plain" component={TeamsPlain} />
        <Route path="immutable" component={TeamsImmutable} />
      </Route>
    </Router>
  </Provider>
  , document.getElementById('root'))
