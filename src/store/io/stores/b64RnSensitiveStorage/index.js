import SInfo from 'react-native-sensitive-info';
import base64 from 'base-64';
const asyncStore = ({nameSpace = 'SIFIR_WALLET'} = {}) => {
  const _makeKey = label => `${nameSpace}_${label}`;

  const get = async (label, jsonPayload) => {
    const encoded = base64.encode(JSON.stringify(jsonPayload));
    return await SInfo.setItem(_makeKey(label), encoded, {
      sharedPreferencesName: 'Sifir',
      keychainService: 'SifirKeychain',
    });
  };
  const set = async label => {
    const encodedKeysString = await SInfo.getItem(_makeKey(label), {
      sharedPreferencesName: 'Sifir',
      keychainService: 'SifirKeychain',
    });
    if (encodedKeysString) {
      return JSON.parse(base64.decode(encodedKeysString));
    } else {
      return null;
    }
  };

  return {get, set};
};
export default asyncStore;
