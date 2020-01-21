import * as types from '@types/index';
import {FULFILLED, PENDING, REJECTED} from '@utils/index';
import {getRoomsList, getMessages} from '@io/rooms';

const loadRoomList = () => async (dispatch, getState) => {
  dispatch({type: types.GET_ROOMS_LIST + PENDING});

  var roomsList = await getRoomsList();
  if (roomsList.error !== undefined) {
    dispatch({
      type: types.GET_ROOMS_LIST + REJECTED,
      payload: {error: roomsList.error},
    });
    return;
  }
  dispatch({type: types.GET_ROOMS_LIST + FULFILLED, payload: {roomsList}});
};

const loadRoomMsg = () => async (dispatch, getState) => {
  dispatch({type: types.GET_ROOM_MSG + PENDING});

  var roomMsg = await getMessages();
  if (roomMsg.error !== undefined) {
    dispatch({
      type: types.GET_ROOM_MSG + REJECTED,
      payload: {error: roomMsg.error},
    });
    return;
  }
  dispatch({type: types.GET_ROOM_MSG + FULFILLED, payload: {roomMsg}});
};

export {loadRoomList, loadRoomMsg};
