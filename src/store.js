import thunk from 'redux-thunk';
import { applyMiddleware, compose, combineReducers, createStore } from 'redux';

import map from './map,reducer';

const middleware = [thunk];

const rootReducer = combineReducers({
  map
});

let store;

if (process.env.NODE_ENV === 'development') {
  // 1. Add redux dev tools (development mode only).
  // 2. Create store composed of reducers and middleware.
  const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
  store = createStore(rootReducer, composeEnhancers(applyMiddleware(...middleware)));
} else {
  // 1. Create store composed of reducers and middleware.
  store = createStore(rootReducer, applyMiddleware(...middleware));
}

export default store;
