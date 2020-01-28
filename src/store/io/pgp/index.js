/**
 * Helper that generates a Sifir transport interface bridging to a Native http module to proxy on (Tor) via Orbot
 */
import {NativeModules} from 'react-native';

const {PgpBridge} = NativeModules;

const makeNewPgpKey = async ({passphrase, email, name}) => {
  const key = await PgpBridge.genNewKey(passphrase, email, name);
  return key;
};
const signMessageWithArmoredKey = async ({msg, privKey, passphrase}) => {
  const {armoredSignature, message} = await PgpBridge.signMessage(
    msg,
    privKey,
    passphrase,
  );
  return {armoredSignature, message};
};
const verifySignedMessage = async ({msg, armoredSignature, armoredKey}) => {
  const isGood = await PgpBridge.verifySignedMessage(
    msg,
    armoredSignature,
    armoredKey,
  );
  return isGood;
};
// TODO these functions , note if optional keys provided with sign or check sign

const encryptMessage = async ({msg, pubKey, passphrase, privKey = null}) => {
  const encryptedMessage = msg;
  return encryptedMessage;
};
const decryptMessage = async ({msg, privKey, passphrase, pubKey = null}) => {
  const decryptedMessage = msg;
  return decryptedMessage;
};
module.exports = {
  makeNewPgpKey,
  signMessageWithArmoredKey,
  verifySignedMessage,
  encryptMessage,
  decryptMessage,
};
