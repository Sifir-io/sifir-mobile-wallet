import {signMessage, verifySignedMessage} from '@io/pgp/';
import {rnTorTransport} from './sifirRnTorTransport';
import base64 from 'base-64';
import {log, error} from '@io/events/';
const getTransport = (token, devicePgpKey, nodePubkey) => {
  const {onionUrl} = token;
  const {fingerprint} = devicePgpKey;
  const payloadSigner = async ({command, payload}) => {
    const payloadToSign = JSON.stringify({
      command,
      payload: payload || null,
    });
    const armoredSignature = await signMessage({msg: payloadToSign});
    return base64.encode(`${armoredSignature};${fingerprint.toUpperCase()}`);
  };
  const payloadSignatureVerifier = async (payload, headers) => {
    // The reason this is here is that when we're paring for the very first time we don't have the nodes pubkey yet, thus confirming is bit of a hack
    // that the is the only time this should be the case, after that the transport should always check the signature on incoming message
    // TODO we need to get the nodes fingerprintt...
    // for now we just check with the public key we have in the token
    if (!nodePubkey) {
      return true;
    }
    const {'content-signature': signatureb64} = JSON.parse(headers);
    const signature = base64.decode(signatureb64);
    const [sig, sigfingerprint] = signature.split(';');
    if (!sig || !sigfingerprint) {
      throw 'missing sig or fingerprint on request';
    }
    try {
      return await verifySignedMessage({
        msg: payload,
        armoredSignature: sig,
        armoredKey: nodePubkey,
      });
    } catch (err) {
      error(
        'error validating signature of incoming message',
        err,
        sigfingerprint,
        sig,
      );
      return false;
    }
  };

  const torClient = rnTorTransport({
    onionUrl,
    payloadSigner,
    payloadSignatureVerifier,
  });
  return torClient;
};
const pairWithNode = async ({token, key, devicePgpKey}) => {
  const client = getTransport(token, devicePgpKey, null);
  const {nodeKeyId} = token;
  const {fingerprint: deviceId} = devicePgpKey;
  const {pubkeyArmored} = devicePgpKey;
  // TODO check nodePubkey's finger print matches the one we scanned in QR
  return await client.post('pairing-event', {
    devicePubkey: pubkeyArmored,
    deviceId,
    nodeKeyId,
    token,
    key,
  });
};
export {getTransport, pairWithNode};
