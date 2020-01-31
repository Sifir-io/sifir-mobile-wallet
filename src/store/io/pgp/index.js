/**
 * Helper that generates a Sifir transport interface bridging to a Native http module to proxy on (Tor) via Orbot
 */
import {NativeModules} from 'react-native';

const {PgpBridge} = NativeModules;

/**
 * @param privatekeyArmored
 * @param passphrase
 * @returns {Promise<{pubkeyArmored:string,fingerprint:string,hexkeyId:string}>}
 */
const initAndUnlockKeys = async ({privatekeyArmored, passphrase}) => {
  const {
    pubkeyArmored,
    fingerprint,
    hexkeyId,
  } = await PgpBridge.initAndUnlockKeys(privatekeyArmored, passphrase);
  return {pubkeyArmored, fingerprint, hexkeyId};
};

/**
 * @param email
 * @param passphrase
 * @returns {Promise<{pubkeyArmored:string,fingerprint:string,hexkeyId:string}>}
 */
const makeNewPgpKey = async ({passphrase, email, user}) => {
  const key = await PgpBridge.genNewKey(passphrase, email, user);
  return key;
};
const signMessageWithArmoredKey = async ({msg, privKey, passphrase}) => {
  const {armoredSignature, message} = await PgpBridge.signMessageWithArmoredKey(
    msg,
    privKey,
    passphrase,
  );
  return {armoredSignature, message};
};
/**
Sign a plaintext message using unlocked key
*/
const signMessage = async ({msg}) => {
  return await PgpBridge.signMessage(msg);
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
  const {
    encryptedMsg,
    signature,
  } = await PgpBridge.encryptMessageWithArmoredPub(msg, pubKey);
  return {signature, encryptedMsg};
};
const decryptMessage = async ({msg, privKey, passphrase = null}) => {
  return await PgpBridge.decryptMessage(msg);
};
module.exports = {
  makeNewPgpKey,
  initAndUnlockKeys,
  signMessage,
  signMessageWithArmoredKey,
  verifySignedMessage,
  encryptMessage,
  decryptMessage,
};
