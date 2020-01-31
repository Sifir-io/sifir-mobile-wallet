import SInfo from 'react-native-sensitive-info';

const savePGPKeys = async key => {
  return await SInfo.setItem('SIFIR_PGP_KEYS', JSON.stringify(key), {
    sharedPreferencesName: 'Sifir',
    keychainService: 'SifirKeychain',
  });
};
const loadPGPKeys = async () => {
  const keysString = await SInfo.getItem('SIFIR_PGP_KEYS', {
    sharedPreferencesName: 'Sifir',
    keychainService: 'SifirKeychain',
  });
  if (keysString) {
    return JSON.parse(keysString);
  } else {
    return null;
  }
};
const deletePgpKeys = async authInfo => {
  console.log('DELETEING KEYS');
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
  return authInfo;
};

const saveAuthInfo = async authInfo => {
  return await SInfo.setItem('SIFIR_TOKEN', JSON.stringify(authInfo), {
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
  savePGPKeys,
  loadPGPKeys,
  deletePgpKeys,
};
