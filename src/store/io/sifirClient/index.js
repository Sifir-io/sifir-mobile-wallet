import {sifirClient} from 'sifir-js-sdk';
let client = null;
export default async ({transport}) => {
  if (!client) {
    // FIXME sifir to {transport}
    client = sifirClient(transport);
  }
  return client;
};
