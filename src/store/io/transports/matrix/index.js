import {getAuthedMatrixClient} from './impl/matrixClient.js';
import {cypherNodeMatrixTransport} from 'cyphernode-js-sdk-transports';
import base64 from 'base-64';

let _client = null;
const getClient = async token => {
  if (_client) {
    return _client;
  }
  _client = await getAuthedMatrixClient(token);
  return _client;
};
// FIXME middleware
const getTransport = async (token, devicePgpKey, nodePubkey) => {
  const {user, nodeDeviceId} = token;
  const client = getClient(token);
  return await cypherNodeMatrixTransport({
    // FIXME check this payload
    nodeAccountUser: user,
    nodeDeviceId,
    client,
    msgTimeout: 7000,
    // debug: console.log,
  });
};
const pairWithNode = async ({token, key, devicePgpKey}) => {
  const client = await getClient(token);
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

module.exports = {getClient, pairWithNode, getTransport};
