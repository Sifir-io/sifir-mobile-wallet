import {getAuthedMatrixClient} from './impl/matrixClient.js';
import {cypherNodeMatrixTransport} from 'cyphernode-js-sdk-transports';

let _client = null;
const getClient = async token => {
  if (_client) {
    return _client;
  }
  _client = await getAuthedMatrixClient(token);
  return _client;
};
const getTransport = async (client, {user, nodeDeviceId}) => {
  return await cypherNodeMatrixTransport({
    nodeAccountUser: user,
    nodeDeviceId,
    client,
    msgTimeout: 7000,
    // debug: console.log,
  });
};
const pairMatrixClient = async (client, {token, key}) => {
  const {user, pairingEvent, nodeDeviceId} = token;
  // Await for pairing ACK
  const pairingPromise = new Promise((res, rej) => {
    const timeOut = setTimeout(
      () => rej('Failed to get pairing ACK before timeout'),
      30000,
    );
    client.on('toDeviceEvent', event => {
      if (event.getType() !== 'pairing:bridgeup') {
        return;
      }
      clearTimeout(timeOut);
      res(event.getContent());
    });
  });

  await client.sendToDevice(pairingEvent, {
    [user]: {
      [nodeDeviceId]: {
        key: key,
        token: token,
      },
    },
  });

  await pairingPromise;

  return client;
};

module.exports = {getClient, pairMatrixClient, getTransport};
