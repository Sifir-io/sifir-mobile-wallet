/**
 * Helper that generates a Sifir transport interface bridging to a Native http module to proxy on (Tor) via Orbot
 * Signs outgoing requests with device keys
 * Validates responses with Node public keys
 * @TODO clean up stuff and abstract it
 */
import {NativeModules} from 'react-native';
import base64 from 'base-64';
const {TorBridge} = NativeModules;

const rnTorTransport = ({onionUrl, verifySigFn, signFn}) => {
  const _verifyRespSignature = async headers => {
    const {
      'content-signature': [sig],
    } = JSON.parse(headers);
    // verifySign expects decoded armored sig
    const decodedSig = base64.decode(sig);
    console.log('sig', sig, decodedSig);
    await verifySigFn(decodedSig);
    return true;
  };
  const _signPayload = async payload => {
    return base64.encode(await signFn(payload));
  };
  if (!onionUrl || !onionUrl.length || !/^http:\/\/.+$/.test(onionUrl)) {
    throw 'Cannot initalize Tor transport without a valid OnionURL';
  }
  const get = async (command, payload) => {
    const url = `${onionUrl}/${command}/${payload ? payload : ''}`;
    const payloadSignature = await _signPayload(url);
    const {body, headers} = await TorBridge.sendRequest(
      url,
      'GET',
      '',
      payloadSignature,
    );
    if (!(await _verifyRespSignature(headers))) {
      throw 'Invalid message signature!';
    }
    return JSON.parse(body);
  };
  const post = async (command, payload) => {
    const jsonPayload = JSON.stringify(payload);
    const payloadSignature = await _signPayload(jsonPayload);
    const {body, headers} = await TorBridge.sendRequest(
      `${onionUrl}/${command}`,
      'POST',
      jsonPayload,
      payloadSignature,
    );
    if (!(await _verifyRespSignature(headers))) {
      throw 'Invalid message signature!';
    }
    return JSON.parse(body);
  };

  return {get, post};
};
module.exports = {rnTorTransport};
