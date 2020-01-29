import SInfo from 'react-native-sensitive-info';

const savePGPKeys = async ({pubKeyArmored, privKeyArmored}) => {
    return await SInfo.setItem(
        'SIFIR_PGP_KEYS',
        JSON.stringify({pubKeyArmored, privKeyArmored}),
        {
            sharedPreferencesName: 'Sifir',
            keychainService: 'SifirKeychain',
        },
    );
};
const loadPGPKeys = async () => {
    const keysString = await SInfo.getItem('SIFIR_PGP_KEYS', {
        sharedPreferencesName: 'Sifir',
        keychainService: 'SifirKeychain',
    });
    return JSON.parse(keysString || '{}');
};
const getSavedAuthInfo = async () => {
    const authInfo = await SInfo.getItem('SIFIR_TOKEN', {
        sharedPreferencesName: 'Sifir',
        keychainService: 'SifirKeychain',
    })
    return authInfo;
};

const saveAuthInfo = async (authInfo) => {
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
    loadPGPKeys
};
