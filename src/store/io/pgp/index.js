/**
 * Helper that generates a Sifir transport interface bridging to a Native http module to proxy on (Tor) via Orbot
 */
import {NativeModules} from 'react-native';

const {PgpBridge} = NativeModules;

/**
 * True of false if key is unlocked
 * @param privateKeyArmored
 * @param passphrase
 * @returns {Promise<*>}
 */
const initAndUnlockKeys = async ({privateKeyArmored, passphrase}) => {
  return await PgpBridge.initAndUnlockKeys(privateKeyArmored, passphrase);
};

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
/**
 * Will encrypt a message with a provided armored pubKey
 * If initAndUnlockKeys has been called on a private key it will
 * return a detached signature for the message
 * @param msg
 * @param pubKey
 * @returns {Promise<{encryptedMsg:string,signature?:string}>}
 */
const encryptMessage = async ({msg, pubKey}) => {
  const {encryptedMsg,signature} = await PgpBridge.encryptMessageWithArmoredPub(msg,pubKey);
  return encryptedMessage;
};
const decryptMessage = async ({msg, privKey, passphrase=null}) => {
  return await PgpBridge.decryptMessage(msg);
};
module.exports = {
  makeNewPgpKey,
  initAndUnlockKeys,
  signMessageWithArmoredKey,
  verifySignedMessage,
  encryptMessage,
  decryptMessage,
};
