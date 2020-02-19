import * as matrix from './matrix';
import * as tor from './tor';

//FIXME does transport really need devicePgpKey ? after we're paired isnot most of it handled by the pgp class
// can even be used to get fingerprint
const getTransportFromToken = async ({token, devicePgpKey, nodePubkey}) => {
  const {eventType} = token;
  let transport;
  switch (eventType) {
    case 'matrix':
      transport = matrix.getTransport(token, devicePgpKey, nodePubkey);
      break;
    case 'tor':
      transport = await tor.getTransport(token, devicePgpKey, nodePubkey);
      break;
    default:
      throw `${eventType} is not valid pairing type`;
  }
  return transport;
};
const pairDeviceWithNodeUsingToken = async ({token, key, devicePgpKey}) => {
  const {eventType} = token;
  let transport;
  switch (eventType) {
    case 'matrix':
      transport = matrix.pairWithNode({token, key, devicePgpKey});
      break;
    case 'tor':
      transport = await tor.pairWithNode({token, key, devicePgpKey});
      break;
    default:
      throw `${eventType} is not valid pairing type`;
  }
  return transport;
};

export {getTransportFromToken, pairDeviceWithNodeUsingToken};
