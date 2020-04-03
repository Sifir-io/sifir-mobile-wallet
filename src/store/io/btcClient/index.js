import {btcClient} from 'sifir-js-sdk';
let _btcClient = null;
export default async ({transport}) => {
  if (!_btcClient) {
    _btcClient = btcClient({
      transport,
    });
  }
  return _btcClient;
};
