import * as React from 'react';
import { Input } from 'antd';

class PriceInput extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
    };
  }

  render() {
    const inputValue = this.props.hourlyRateInputs.filter((item) => item._id === this.props.value._id);
    return (
      <Input placeholder='hourly rate' value={inputValue.length ? Number(inputValue[0].value) : Number((this.props.value.hourlyRate / this.props.exchangeRate).toFixed(2)) || 0}
        onChange={(event) => {
          if (!isNaN(event.target.value as any)) {
            return this.props.handleHourlyRateChange({ _id: this.props.value._id, value: Number(event.target.value) });
          } else {
            return false;
          }
        }}
      />
    );
  }
}

export default PriceInput;