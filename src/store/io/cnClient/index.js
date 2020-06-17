import {cnClient} from 'sifir-js-sdk';
let client = null;
export default async ({transport}) => {
  if (!client) {
    client = cnClient({transport});
  }
  return client;
};
