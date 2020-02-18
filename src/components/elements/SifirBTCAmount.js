import {PureComponent} from 'react';
import {C} from '@common/index';
import {log} from '@io/events';
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
