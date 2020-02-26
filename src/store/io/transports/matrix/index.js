import {getAuthedMatrixClient} from './impl/matrixClient.js';
import {cypherNodeMatrixTransport} from 'cyphernode-js-sdk-transports';
import {log, error} from '@io/events/';
import {decryptMessage, encryptMessage, verifySignedMessage} from '@io/pgp';
import base64 from 'base-64';
let _client = null;
const getClient = async token => {
  if (_client) {
    return _client;
  }
  _client = await getAuthedMatrixClient(token);
  return _client;
};
const getTransport = async (token, devicePgpKey, nodePubkey) => {
  const {user, nodeDeviceId} = token;
  const {fingerprint} = devicePgpKey;
  const client = await getClient({...token, deviceId: fingerprint});

  const inboundMiddleware = async ({event, acccountUser}) => {
    const {body} = event.getContent();
    const {encryptedData, signature} = JSON.parse(body);
    const decryptyedData = await decryptMessage(base64.decode(encryptedData));
    const isValid = await verifySignedMessage({
      msg: decryptyedData,
      armoredSignature: base64.decode(signature),
      armoredKey: nodePubkey,
    });
    let err = null;
    if (!isValid) {
      error('invalid inbound message signature', decryptyedData, signature);
      err = 'invalid signature for inbound matrix message';
    }
    return {...JSON.parse(decryptyedData), err};
  };
  const outboundMiddleware = async (msg: string) => {
    const payload = JSON.parse(msg);
    const payloadToEnc = JSON.stringify({
      ...payload,
      fingerprint: fingerprint.toUpperCase(),
    });
    const {signature, encryptedMsg} = await encryptMessage({
      msg: payloadToEnc,
      pubKey: nodePubkey,
    });
    return JSON.stringify({
      encryptedData: base64.encode(encryptedMsg),
      signature: base64.encode(signature),
    });
  };
  const nodeUser = user.replace('-dev', '');
  return await cypherNodeMatrixTransport({
    nodeAccountUser: nodeUser,
    nodeDeviceId,
    client,
    inboundMiddleware,
    outboundMiddleware,
    debug: log,
  });
};
const pairWithNode = async ({token, key, devicePgpKey}) => {
  const {user, pairingEvent, nodeDeviceId, nodeKeyId} = token;
  const {fingerprint: deviceId, pubkeyArmored} = devicePgpKey;

  const client = await getClient({...token, deviceId});
  const pairingPromise = new Promise((res, rej) => {
    const timeOut = setTimeout(
      () => rej('Failed to get pairing response'),
      15000,
    );
    client.on('toDeviceEvent', async event => {
      if (event.getType() !== pairingEvent) {
        return;
      }
      clearTimeout(timeOut);
      res(event.getContent());
    });
  });
  const nodeUser = user.replace('-dev', '');
  await client.sendToDevice(pairingEvent, {
    [nodeUser]: {
      [nodeDeviceId]: {
        devicePubkey: pubkeyArmored,
        deviceId,
        token,
        nodeKeyId,
        key,
      },
    },
  });
  return await pairingPromise;
};

module.exports = {getClient, pairWithNode, getTransport};
