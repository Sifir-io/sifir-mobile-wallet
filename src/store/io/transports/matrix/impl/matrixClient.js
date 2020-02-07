import {getSyncMatrixClient} from 'cyphernode-js-sdk-transports';
import axios from 'axios';
const getAuthedMatrixClient = async ({user, password, server, deviceId}) => {
  try {
    const client = await getSyncMatrixClient({
      user,
      password,
      baseUrl: server,
      deviceId,
      request: async (options, cb) => {
        const opts = {
          ...options,
          url: options.uri,
          data: options.body,
          params: options.qs,
        };
        try {
          const resp = await axios.request(opts);
          console.log('resolvingreq');
          cb(null, resp, JSON.stringify(resp.data));
        } catch (err) {
          console.log('matrixerr', err);
          cb(err);
        }
      },
    });
    return client;
  } catch (err) {
    throw err;
  }
};

module.exports = {
  getAuthedMatrixClient,
};
