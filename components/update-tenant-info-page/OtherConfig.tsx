import { Layout, Input, Select, Row, Button, Col } from 'antd';
import { timeZone } from '../../data_common/timezone';
import React from 'react';
const InputGroup = Input.Group;
const { Content } = Layout;
const { Option } = Select;

const renderCurrency = datas => {
  if (datas) {
    return datas.map((item, _index) => {
      return <Option value={item._id.toString()} key={item._id.toString()}>{`${item.name} (${item.code})`}</Option>;
    });
  } else {
    return null;
  }
};

const renderTimezone = datas => {
  if (datas) {
    return datas.map((item, _index) => {
      return <Option value={item.name} key={item.name}>{item.gmt} {item.name}</Option>;
    });
  }
};

interface Indexstate {
  timeZone: {
    zone: string;
    gmt: string;
    name: string;
  };
}


class OtherConfig extends React.Component<any, Indexstate> {
  constructor(props) {
    super(props);
  }

  renderGmt(selectedZone) {
    if (selectedZone) {
      return selectedZone.gmt;
    }
  }

  onChangeTimeZone = (input: string) => {
    const timeZoneArray = timeZone.filter((val) => val.name === input);
    const timeZoneFiltered = timeZoneArray.length ? timeZoneArray[0] : null;
    if (timeZoneFiltered) {
      this.props.changeTenantInput({
        otherConfigs: {
          timeZone: {
            name: timeZoneFiltered.name,
            gmt: timeZoneFiltered.gmt,
            offset: timeZoneFiltered.offset
          }
        }
      })
    }
  }

  update = () => {
    if (this.props.tenantInfo.otherConfigs) {
      const updatedData = {
        _id: this.props.tenantInfo._id,
        timeZone: this.props.tenantInfo.otherConfigs.timeZone ? this.props.tenantInfo.otherConfigs.timeZone : {},
        primaryCurrency: this.props.tenantInfo.otherConfigs.primaryCurrency ? this.props.tenantInfo.otherConfigs.primaryCurrency : ""
      }
      this.props.updateConfiguration(updatedData);
    } else return;
  }

  render() {
    const sortedDataTimeZone = this.props.tenantInfo.otherConfigs && this.props.tenantInfo.otherConfigs.timeZone ? timeZone.concat({
      gmt: this.props.tenantInfo.otherConfigs.timeZone.gmt,
      name: this.props.tenantInfo.otherConfigs.timeZone.name,
      offset: this.props.tenantInfo.otherConfigs.timeZone.offset
    } as any).sort((a, b) => {
      if (a.gmt < b.gmt) {
        return -1;
      }
      if (a.gmt > b.gmt) {
        return 1;
      }
      return 0;
    }) : timeZone.sort((a, b) => {
      if (a.gmt < b.gmt) {
        return -1;
      }
      if (a.gmt > b.gmt) {
        return 1;
      }
      return 0;
    });

    return (
      <Layout style={{ background: '#ffffff' }}>
        <Row className='margin-bottom-large' style={{ padding: '20px 10px 0px 10px' }}>
          <Content style={{ fontSize: 18, fontWeight: 'bold' }}>
          {this.props.languageState.UPDATE_TENANT_OTHER_CONFIG_LABEL.translated}
          </Content>
        </Row>
        <Row gutter={10}>
          <Col span={12} style={{ padding: '10px' }}>
            <Row>
              <Content className='margin-bottom-small'>{this.props.languageState.UPDATE_TENANT_OTHER_CONFIG_TIME_ZONE.translated}</Content>
              <div>
                <Select
                  placeholder='Please select'
                  disabled={this.props.disableInput}
                  value={this.props.tenantInfo.otherConfigs ? this.props.tenantInfo.otherConfigs.timeZone ? this.props.tenantInfo.otherConfigs.timeZone.name : "" : ""}
                  style={{ width: '100%' }}
                  onChange={(val) => this.onChangeTimeZone(val.toString() as string)}>
                  {renderTimezone(sortedDataTimeZone)}
                </Select>
              </div>
            </Row>
          </Col>
          <Col span={12} style={{ padding: '10px' }}>
            <Row>
              <Content className='margin-bottom-small'>{this.props.languageState.UPDATE_TENANT_OTHER_CONFIG_PRIMARY_CURRENCY.translated}</Content>
              <InputGroup>
                <div>
                  <Select
                    placeholder='Please select'
                    disabled={this.props.disableInput}
                    value={this.props.currencies && this.props.currencies.length ? this.props.tenantInfo.otherConfigs ? this.props.tenantInfo.otherConfigs.primaryCurrency ? this.props.tenantInfo.otherConfigs.primaryCurrency.toString() : "" : "" : ""}
                    style={{ width: '100%' }}
                    onChange={(val) => this.props.changeTenantInput({ otherConfigs: { primaryCurrency: val } })}
                  >
                    {renderCurrency(this.props.currencies)}
                  </Select>
                </div>
              </InputGroup>
            </Row>
          </Col>
          {this.props.disableInput ? <div></div> :
            <Col span={24}>
              <Row style={{ marginLeft: '5px' }}>
                <Button
                  type="primary"
                  onClick={this.update}
                >
                  Save</Button>
              </Row>
            </Col>
          }
        </Row>
      </Layout>
    );
  }
}

export default OtherConfig;
