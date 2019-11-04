import {combineReducers} from 'redux';

import accountsListReducer from './accountsList/reducer';
import accountReducer from './account/reducer';

export default combineReducers({
  accountsList: accountsListReducer,
  account: accountReducer,
});
