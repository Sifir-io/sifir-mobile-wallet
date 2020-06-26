import {wasabiClient} from 'sifir-js-sdk';
let _wasabi = null;
export default async ({transport}) => {
  if (!_wasabi) {
    _wasabi = wasabiClient({
      transport,
    });
  }
  return _wasabi;
};
