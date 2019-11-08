import * as types from './types';
import {FULFILLED, PENDING, REJECTED} from '../../utils';
import {GET, fetch} from '../../utils';

export const getWallet = () => dispatch => {
  dispatch({type: types.WALLET_DATA_SHOW + PENDING});
  fetch(GET, '/account').then(({data}) => {
    const action = {
      type: types.WALLET_DATA_SHOW + FULFILLED,
      payload: data,
    };
    dispatch(action);
  });
};
