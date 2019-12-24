import React, {PureComponent} from 'react';
import {C} from '@common/index';

export default class SifirBTCAmount extends PureComponent {
  formatAmount = (amount, unit = C.STR_BTC) => {
    const amountStr = amount;
    return `${amountStr} ${unit}`;
  };

  render() {
    const {amount, unit} = this.props;
    return this.formatAmount(amount, unit);
  }
}

export {SifirBTCAmount};
