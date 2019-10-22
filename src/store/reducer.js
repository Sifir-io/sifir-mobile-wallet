import {combineReducers} from 'redux';

import accountsReducer from './accounts/reducer';
import transactionsReducer from './transactions/reducer';

export default combineReducers({
  accounts: accountsReducer,
  transactions: transactionsReducer,
});
