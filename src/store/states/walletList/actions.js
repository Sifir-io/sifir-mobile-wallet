import * as types from './types';
import {FULFILLED, PENDING, REJECTED} from '../../utils';
import {GET, fetch} from '../../utils';

export const getWalletList = () => dispatch => {
  dispatch({type: types.WALLETLIST_DATA_UPDATE + PENDING});
  fetch(GET, '/accounts').then(({data}) => {
    const action = {
      type: types.WALLETLIST_DATA_UPDATE + FULFILLED,
      payload: data,
    };
    dispatch(action);
  });
};
