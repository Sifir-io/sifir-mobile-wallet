/**
 * Helper that generates a Sifir transport interface bridging to a Native http module to proxy on (Tor) via Orbot
 * Signs outgoing requests with device keys
 * Validates responses with Node public keys
 * @TODO clean up stuff and abstract it
 */
import {NativeModules} from 'react-native';
const {TorBridge} = NativeModules;

const rnTorTransport = ({
  onionUrl,
  verifySigFn,
  payloadSigner,
  payloadSignatureVerifier,
}) => {
  if (!onionUrl || !onionUrl.length || !/^http:\/\/.+$/.test(onionUrl)) {
    throw 'Cannot initalize Tor transport without a valid OnionURL';
  }
  const get = async (command, payload) => {
    const url = `${onionUrl}/${command}/${payload ? payload : ''}`;
    const payloadSignature = await payloadSigner({command, payload});
    console.log('get', payloadSignature, command, payload);
    const {body, headers} = await TorBridge.sendRequest(
      url,
      'GET',
      '',
      payloadSignature,
    );
    if (!(await payloadSignatureVerifier(body, headers))) {
      throw 'Invalid message signature!';
    }
    return JSON.parse(body);
  };
  const post = async (command, payload) => {
    const jsonPayload = JSON.stringify(payload);
    const payloadSignature = await payloadSigner({command, payload});
    const {body, headers} = await TorBridge.sendRequest(
      `${onionUrl}/${command}`,
      'POST',
      jsonPayload,
      payloadSignature,
    );
    if (!(await payloadSignatureVerifier(body, headers))) {
      throw 'Invalid message signature!';
    }
    return JSON.parse(body);
  };

  return {get, post};
};
module.exports = {rnTorTransport};
