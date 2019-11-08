import * as reducers from './states';
import {createStore, applyMiddleware, combineReducers} from 'redux';
import thunkMiddleware from 'redux-thunk';

const rootReducer = (state, action) => {
  return combineReducers(reducers)(state, action);
};

export default createStore(rootReducer, applyMiddleware(thunkMiddleware));
