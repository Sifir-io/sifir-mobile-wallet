/**
 * Helper that generates a Sifir transport interface bridging to a Native http module to proxy on (Tor) via Orbot
 */
import {NativeModules} from 'react-native';

const {TorBridge} = NativeModules;

const rnTorTransport = ({onionUrl}) => {
  if (!onionUrl || !onionUrl.length || !/^http:\/\/.+$/.test(onionUrl))
    throw 'Cannot initalize Tor transport without a valid OnionURL';
  const get = async (command, payload) => {
    const resp = await TorBridge.sendRequest(
      `${onionUrl}/${command}/${payload ? payload : ''}`,
      'GET',
      '',
    );
    return JSON.parse(resp);
  };
  const post = async (command, body) => {
    const resp = await TorBridge.sendRequest(
      `${onionUrl}/${command}`,
      'POST',
      JSON.stringify(body),
    );
    return JSON.parse(resp);
  };

  return {get, post};
};
module.exports = {rnTorTransport};
