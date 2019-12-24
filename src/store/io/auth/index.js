import SInfo from 'react-native-sensitive-info';

const getSavedAuthInfo = async () => {
  const authInfo = await SInfo.getItem('SIFIR_TOKEN', {
    sharedPreferencesName: 'Sifir',
    keychainService: 'SifirKeychain',
  });
  return JSON.parse(authInfo || '{}');
};

const saveAuthInfo = async authInfo => {
  return await SInfo.setItem('SIFIR_TOKEN', JSON.stringify(authInfo), {
    sharedPreferencesName: 'Sifir',
    keychainService: 'SifirKeychain',
  });
};

module.exports = {getSavedAuthInfo, saveAuthInfo};
