package com.sifir;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

import java.util.HashMap;
import java.util.Map;

import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.Arguments;
import com.proton.gopenpgp.helper.Helper;
import com.proton.gopenpgp.crypto.Crypto;


public class PgpBridge extends ReactContextBaseJavaModule {
    private static ReactApplicationContext reactContext;

    public PgpBridge(ReactApplicationContext context) {
        super(context);
        this.reactContext = context;

    }

    @Override
    public String getName() {
        return "PgpBridge";
    }

    @ReactMethod
    public void genNewKey(String pass, String email, String name, Promise promise) {
        try {
            byte[] passphrase = pass.getBytes();
            String ecKey = Helper.generateKey(name, email, passphrase, "x25519", 0);
            com.proton.gopenpgp.crypto.Key keyObj = Crypto.newKeyFromArmored(ecKey);
            com.proton.gopenpgp.crypto.Key unlockedKeyObj = keyObj.unlock(passphrase);
            com.proton.gopenpgp.crypto.KeyRing keyRing = Crypto.newKeyRing(unlockedKeyObj);

            WritableMap reply = Arguments.createMap();
            reply.putString("privKeyArmored",ecKey);
            reply.putString("pubKeyArmored",unlockedKeyObj.getArmoredPublicKey());
            reply.putString("fingerPrint",unlockedKeyObj.getFingerprint());
            reply.putString("hexKeyId",unlockedKeyObj.getHexKeyID());
            promise.resolve(reply);
        } catch (Exception e) {
            promise.reject(e);
        }
    }

    @ReactMethod
    public void signMessage(String msg, String privKey, String pass, Promise promise) {
        try {
            byte[] passphrase = pass.getBytes();
            com.proton.gopenpgp.crypto.PlainMessage plainText = Crypto.newPlainMessageFromString(msg);

            com.proton.gopenpgp.crypto.Key privKeyObj = Crypto.newKeyFromArmored(privKey);
            com.proton.gopenpgp.crypto.Key unlockedKeyObj = privKeyObj.unlock(passphrase);
            com.proton.gopenpgp.crypto.KeyRing signingKeyRing = Crypto.newKeyRing(unlockedKeyObj);
            com.proton.gopenpgp.crypto.PGPSignature pgpSignature = signingKeyRing.signDetached(plainText);

            WritableMap reply = Arguments.createMap();
            reply.putString("armoredSignature", pgpSignature.getArmored());
            reply.putString("message", plainText.getString());
            promise.resolve(reply);
        } catch (Exception e) {
            promise.reject(e);
        }
    }

    @ReactMethod
    public void verifySignedMessage(String msgToVerify,String armoredMessageSignature, String pubKey, Promise promise) {
        try {
            com.proton.gopenpgp.crypto.PlainMessage plainText = Crypto.newPlainMessageFromString(msgToVerify);
            com.proton.gopenpgp.crypto.PGPSignature pgpSignature = Crypto.newPGPSignatureFromArmored(armoredMessageSignature);
            com.proton.gopenpgp.crypto.Key pubKeyObj = Crypto.newKeyFromArmored(pubKey);
            com.proton.gopenpgp.crypto.KeyRing signingKeyRing = Crypto.newKeyRing(pubKeyObj);
            signingKeyRing.verifyDetached(plainText,pgpSignature,Crypto.getUnixTime());
            promise.resolve(true);
        } catch (Exception e){
            promise.reject(e);
        }
    }
}
