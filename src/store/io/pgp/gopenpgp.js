/**
 * Helper that generates a Sifir transport interface bridging to a Native http module to proxy on (Tor) via Orbot
 */
import {NativeModules} from 'react-native';

const {PgpBridge} = NativeModules;

const makeNewPgpKey = async ({passphrase, email, name}) => {
  const key = await PgpBridge.genNewKey(passphrase, email, name);
  console.log('ggggo', key);
  return key;
};
const signMessageWithArmoredKey = async ({msg, privKey, passphrase}) => {
  const {armoredSignature, message} = await PgpBridge.signMessage(
    msg,
    privKey,
    passphrase,
  );
  console.log('signed', {armoredSignature, message});
  return {armoredSignature, message};
};
const verifySignedMessage = async ({msg, armoredSignature, armoredKey}) => {
  console.log('sending', msg, armoredSignature, armoredKey);
  const isGood = await PgpBridge.verifySignedMessage(
    msg,
    armoredSignature,
    armoredKey,
  );
  console.log('sign ve', isGood);
  return isGood;
};
module.exports = {
  makeNewPgpKey,
  signMessageWithArmoredKey,
  verifySignedMessage,
};
