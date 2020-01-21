import * as types from '@types/index';
import {createReducer, FULFILLED, PENDING, REJECTED} from '@utils/index';
const initialState = {
  loading: false,
  loaded: false,
  error: '',
  roomsList: [],
};

const Rooms = createReducer(initialState)({
  [types.GET_ROOMS_LIST + PENDING]: state => ({
    ...state,
    loading: true,
    loaded: false,
  }),
  [types.GET_ROOMS_LIST + FULFILLED]: (state, {payload: {roomsList}}) => ({
    ...state,
    loading: false,
    loaded: true,
    error: null,
    roomsList,
  }),
  [types.GET_ROOMS_LIST + REJECTED]: (state, {payload: {error}}) => ({
    ...state,
    error,
    loading: false,
    loaded: false,
  }),
  [types.GET_ROOM_MSG + PENDING]: state => ({
    ...state,
    loading: true,
    loaded: false,
  }),
  [types.GET_ROOM_MSG + FULFILLED]: (state, {payload: {roomMsg}}) => ({
    ...state,
    loading: false,
    loaded: true,
    error: null,
    roomMsg,
  }),
  [types.GET_ROOM_MSG + REJECTED]: (state, {payload: {error}}) => ({
    ...state,
    error,
    loading: false,
    loaded: false,
  }),
});

export default Rooms;
