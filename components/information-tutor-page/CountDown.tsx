import * as React from 'react';
import Countdown from 'react-countdown-now';

class CountDown extends React.Component<any, any> {
  shouldComponentUpdate() {
    return false;
  };

  render() {
    return (
      <Countdown
        date={Date.now() + 10 * 60 * 1000}
        onComplete={() => {
          this.props.onClosePaymentModal();
          this.props.openSessionExpiredModal();
        }}
      />
    );
  }
};

export default CountDown;