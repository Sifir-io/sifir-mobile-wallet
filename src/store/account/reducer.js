import {Images} from '@common';

const defaultState = {
  txnData: [
    {
      key: '0',
      imgURL: Images.icon_send,
      s1: '3 Minutes ago',
      s2: 'Sent - #42151',
      s3: '0.51 BTC',
    },
    {
      key: '1',
      imgURL: Images.icon_receive,
      s1: '3 Minutes ago',
      s2: 'Sent - #42151',
      s3: '0.51 BTC',
    },
    {
      key: '2',
      imgURL: Images.icon_chanel,
      s1: '3 Minutes ago',
      s2: 'Sent - #42151',
      s3: '0.51 BTC',
    },
    {
      key: '3',
      imgURL: Images.icon_send,
      s1: '3 Minutes ago',
      s2: 'Sent - #42151',
      s3: '0.51 BTC',
    },
    {
      key: '4',
      imgURL: Images.icon_send,
      s1: '3 Minutes ago',
      s2: 'Sent - #42151',
      s3: '0.51 BTC',
    },
    {
      key: '5',
      imgURL: Images.icon_send,
      s1: '3 Minutes ago',
      s2: 'Sent - #42151',
      s3: '0.51 BTC',
    },
    {
      key: '6',
      imgURL: Images.icon_send,
      s1: '3 Minutes ago',
      s2: 'Sent - #42151',
      s3: '0.51 BTC',
    },
    {
      key: '7',
      imgURL: Images.icon_send,
      s1: '3 Minutes ago',
      s2: 'Sent - #42151',
      s3: '0.51 BTC',
    },
    {
      key: '8',
      imgURL: Images.icon_send,
      s1: '3 Minutes ago',
      s2: 'Sent - #42151',
      s3: '0.51 BTC',
    },
    {
      key: '9',
      imgURL: Images.icon_send,
      s1: '3 Minutes ago',
      s2: 'Sent - #42151',
      s3: '0.51 BTC',
    },
  ],
  walletName: 'GHASSANS',
  walletType: 'WALLET',
  balanceAmount: '14.51',
  balanceType: 'SAT',
};

export default account = (state = defaultState, action) => {
  switch (action.type) {
    default:
      return state;
  }
};
