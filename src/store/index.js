import reducer from './reducer';
import {createStore, applyMiddleware} from 'redux';

export default function initStore() {
  const store = createStore(
    reducer,
    applyMiddleware(),
    // Middleware will not be applied to this sample.
  );
  return store;
}
