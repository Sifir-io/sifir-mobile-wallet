import {btcClient} from 'cyphernode-js-sdk';
let _btcClient = null;
export default async ({transport}) => {
  if (!_btcClient) {
    _btcClient = btcClient({
      transport,
    });
  }
  return _btcClient;
};
