import SInfo from 'react-native-sensitive-info';
import {encryptMessage, decryptMessage, makeNewPgpKey} from '@io/pgp';

const generateAndSaveKeys = async ({email, name, passphrase}) => {
  const {pubKeyArmored, privKeyArmored} = await makeNewPgpKey({
    passphrase,
    email,
    name,
  });
  return await SInfo.setItem(
    'SIFIR_KEYS',
    JSON.stringify({pubKeyArmored, privKeyArmored}),
    {
      sharedPreferencesName: 'Sifir',
      keychainService: 'SifirKeychain',
    },
  );
};

const loadKeys = async ({passphrase}) => {
  const keysString = await SInfo.getItem('SIFIR_TOKEN', {
    sharedPreferencesName: 'Sifir',
    keychainService: 'SifirKeychain',
  });
  return JSON.parse(keysString || '{}');
};
const getSavedAuthInfo = async ({passphrase}) => {
  const [authInfoEnc, {pubKeyArmored, privKeyArmored}] = await Promise.all([
    SInfo.getItem('SIFIR_TOKEN', {
      sharedPreferencesName: 'Sifir',
      keychainService: 'SifirKeychain',
    }),
    loadKeys,
  ]);
  if (!pubKeyArmored || !privKeyArmored) throw 'Missing keys, gen keys first';
  const authInfo = decryptMessage({
    msg: authInfoEnc,
    privKey: privKeyArmored,
    passphrase,
  });
  return JSON.parse(authInfo || '{}');
};

const saveAuthInfo = async (authInfo, passphrase) => {
  const {pubKeyArmored} = await loadKeys({passphrase});
  if (!pubKeyArmored) throw 'Cannot save auth info before generating keys';
  const encAuthInfo = encryptMessage({
    msg: JSON.stringify(authInfo),
    pubKey: pubKeyArmored,
  });
  return await SInfo.setItem('SIFIR_TOKEN', encAuthInfo, {
    sharedPreferencesName: 'Sifir',
    keychainService: 'SifirKeychain',
  });
};

const deleteAuthInfo = async authInfo => {
  return await SInfo.deleteItem('SIFIR_TOKEN', {
    sharedPreferencesName: 'Sifir',
    keychainService: 'SifirKeychain',
  });
};

module.exports = {
  getSavedAuthInfo,
  saveAuthInfo,
  deleteAuthInfo,
  generateAndSaveKeys,
};
