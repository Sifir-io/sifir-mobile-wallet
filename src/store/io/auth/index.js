import SInfo from 'react-native-sensitive-info';
import base64 from 'base-64';
/** @param key objec */
const savePGPKeys = async key => {
  const encoded = base64.encode(JSON.stringify(key));
  return await SInfo.setItem('SIFIR_PGP_KEYS', encoded, {
    sharedPreferencesName: 'Sifir',
    keychainService: 'SifirKeychain',
  });
};
const loadPGPKeys = async () => {
  const encodedKeysString = await SInfo.getItem('SIFIR_PGP_KEYS', {
    sharedPreferencesName: 'Sifir',
    keychainService: 'SifirKeychain',
  });
  if (encodedKeysString) {
    return JSON.parse(base64.decode(encodedKeysString));
  } else {
    return null;
  }
};
const deletePgpKeys = async authInfo => {
  return await SInfo.deleteItem('SIFIR_PGP_KEYS', {
    sharedPreferencesName: 'Sifir',
    keychainService: 'SifirKeychain',
  });
};
const getSavedAuthInfo = async () => {
  const authInfo = await SInfo.getItem('SIFIR_TOKEN', {
    sharedPreferencesName: 'Sifir',
    keychainService: 'SifirKeychain',
  });
  if (authInfo) {
    return base64.decode(authInfo);
  } else {
    return authInfo;
  }
};

const saveAuthInfo = async authInfo => {
  const encoded = base64.encode(authInfo);
  return await SInfo.setItem('SIFIR_TOKEN', encoded, {
    sharedPreferencesName: 'Sifir',
    keychainService: 'SifirKeychain',
  });
};

const deleteAuthInfo = async () => {
  return await SInfo.deleteItem('SIFIR_TOKEN', {
    sharedPreferencesName: 'Sifir',
    keychainService: 'SifirKeychain',
  });
};

module.exports = {
  getSavedAuthInfo,
  saveAuthInfo,
  deleteAuthInfo,
  savePGPKeys,
  loadPGPKeys,
  deletePgpKeys,
};
