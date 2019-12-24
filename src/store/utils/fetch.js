/**
 * FOR TESTING ONLY
 */
import axios from 'axios';
import {SIFIR_API_HOST} from './constants';

export default (method, path, data) => {
  return axios({
    method,
    url: `${SIFIR_API_HOST}${path}`,
    data,
  });
};
