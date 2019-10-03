import * as React from "react";
import { Checkbox } from "antd";

class CheckBoxInput extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {};
  }

  render() {
    const inputValue = this.props.createInputs.filter(
      item => item._id === this.props.value._id
    );

    return (
      <Checkbox
        checked={inputValue.length}
        onChange={() =>
          this.props.handleCreateInputs({ _id: this.props.value._id })
        }
      />
    );
  }
}

export default CheckBoxInput;
