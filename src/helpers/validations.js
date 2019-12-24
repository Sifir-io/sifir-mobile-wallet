import base64 from 'base-64';

const validatedTokenHash = tokenHash => {
  if (!tokenHash || !tokenHash.length) {
    return {};
  }
  try {
    const json_string = base64.decode(tokenHash);
    const decodedToken = JSON.parse(json_string);
    const {key, token: tokenJSONString} = decodedToken;
    const token = JSON.parse(tokenJSONString);
    return {key, token};
  } catch (err) {
    return {};
  }
};

export {validatedTokenHash};
