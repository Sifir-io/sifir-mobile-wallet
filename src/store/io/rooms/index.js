const getRoomsList = async () => {
  try {
    //for the test
    let response = await fetch(
      'https://my-json-server.typicode.com/Daniel21594/demo/listData',
      {
        method: 'GET',
      },
    );

    return await response.json();
  } catch (error) {
    return {error};
  }
};

const getMessages = async () => {
  try {
    //for the test
    let response = await fetch(
      'https://my-json-server.typicode.com/Daniel21594/demo/messages',
      {
        method: 'GET',
      },
    );

    return await response.json();
  } catch (error) {
    return {error};
  }
};
module.exports = {getRoomsList, getMessages};
