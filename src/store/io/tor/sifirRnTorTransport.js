/**
 * Helper that generates a Sifir transport interface bridging to a Native http module to proxy on (Tor) via Orbot
 */
import {NativeModules} from 'react-native';

const {TorBridge} = NativeModules;

const rnTorTransport = ({onionUrl}) => {
  if (!onionUrl || !onionUrl.length || !/^http:\/\/.+$/.test(onionUrl))
    throw 'Cannot initalize Tor transport without a valid OnionURL';
  const get = async (command, payload) => {
    const url = `${onionUrl}/${command}/${payload ? payload : ''}`;
    // TODO sign get request url
    const resp = await TorBridge.sendRequest(
      url,
      'GET',
      '',
      'iD8DBQFIYQCSi0P7OS4VvkwRAm7nAKC1Ra4RmhtgPFEIckxu0uACoVWVIwCg0u2B5u2gS2tSO7LXagplAF+AwI0=;=FfiF',
    );
    console.log('got resp', resp);
    // TODO verify resp signature
    return JSON.parse(resp);
  };
  const post = async (command, body) => {
    const payload = JSON.stringify(body);
    // TODO sign payload
    const resp = await TorBridge.sendRequest(
      `${onionUrl}/${command}`,
      'POST',
      payload,
      'iD8DBQFIYQCSi0P7OS4VvkwRAm7nAKC1Ra4RmhtgPFEIckxu0uACoVWVIwCg0u2B5u2gS2tSO7LXagplAF+AwI0=;=FfiF',
    );
    console.log('got resp', resp);
    // TODO verify resp signature
    return JSON.parse(resp);
  };

  return {get, post};
};
module.exports = {rnTorTransport};
