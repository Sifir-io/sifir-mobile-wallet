import {sifirClient} from 'sifir-js-sdk';
let client = null;
export default async ({transport}) => {
  if (!client) {
    client = sifirClient({transport});
  }
  return client;
};
