import * as React from "react";
import { Row, Col, Input, Button, Popconfirm, Modal, Icon, AutoComplete, message, Layout } from "antd";
import AppLayout from "../../layout/AdminLayout";
import initStore from "../../rematch/store";
import withRematch from "../../rematch/withRematch";
import { currency } from "../../data_common/Common-Currency";
import "./exchange-rate.css";

const Content = Layout.Content;
class ExchangeRatePage extends React.Component<any, any> {
  static async getInitialProps(props: any) {
    if (!props.req) {
      await props.store.dispatch.exchangeRatePageModel.fetchDataEffect();
    } else {
      props.store.dispatch.exchangeRatePageModel.fetchDataSuccess({ results: props.query.currencies.results });
    }
  }

  handleOk = () => {
    if (!this.props.createInputCode || !this.props.createInputName || !this.props.createInputExchangeRate) {
      message.error('Missing input!', 3);
      return;
    } else {
      if (currency.map(val => val.code).indexOf(this.props.createInputCode) < 0) {
        message.error('Currency code must be in the list.');
      } else if (currency.map(val => val.name).indexOf(this.props.createInputName) < 0) {
        message.error('Currency name must be in the list.');
      } else {
        this.props.createCurrencyEffect({
          code: this.props.createInputCode,
          exchangeRate: this.props.createInputExchangeRate,
          name: this.props.createInputName
        });
      }
    }
  }

  syncRealtime = async () => {
    const dataInput = this.props.data.map(val => val.code);
    await this.props.getRealtimeCurrenciesExchange(dataInput);
    await this.props.updateDataEffect({ data: this.props.data })
  }

  changeCreateInputName = (value) => {
    this.props.changeCreateInputName(value);
    const filterCurrency = currency.filter(val => val.name === value);
    if (filterCurrency.length) {
      const code = filterCurrency[0].code;
      this.props.changeCreateInputCode(code)
    }
  }

  changeCreateInputCode = (value) => {
    this.props.changeCreateInputCode(value);
    const filterCurrency = currency.filter(val => val.code === value);
    if (filterCurrency.length) {
      const name = filterCurrency[0].name;
      this.props.changeCreateInputName(name)
    }
  }

  render() {
    return (
      <AppLayout
        profileState={this.props.profileState}
        profileReducers={this.props.profileReducers}
        languageState={this.props.languageState}
      >
        <div className="exchange-rate-page">
          <Row className='margin-bottom-large'>
            <Content style={{ fontWeight: "bold", fontSize: 20, marginBottom: 20 }}>
              Currency Exchange Rate
          </Content>
            <hr />
            <h3 style={{ marginTop: 20 }}>Base currency: SGD</h3>
          </Row>
          <Row gutter={12}>
            {this.props.data.length ? this.props.data.filter((val) => val.code !== 'SGD').map((val, index) => {
              return (<Col xs={24} lg={12} style={{ display: 'flex', justifyContent: 'center' }} key={index}>
                <Col xs={{ span: 24, offset: 0 }} style={{ display: 'flex', alignItems: 'center' }}>
                  <Col xs={6} lg={4} style={{ margin: '10px 0px', padding: '0px 5px', textAlign: 'center' }}>
                    <span style={{ fontSize: '16px' }}>1 <b>{val.code}</b> = </span>
                  </Col>
                  <Col xs={9} lg={12} style={{ margin: '10px 0px', padding: '0px 5px' }}>
                    <Input type="number" style={{ width: '100%', display: 'inline-block' }} value={val.exchangeRate} onChange={(e) => this.props.changeRateInput({ _id: val._id, exchangeRate: e.target.value })} />
                  </Col>
                  <Col xs={6} lg={4} style={{ margin: '10px 0px', padding: '0px 5px' }}>
                    <span style={{ fontSize: '16px' }}><b>SGD</b></span>
                  </Col>
                  <Col xs={3} lg={3}>
                    <Popconfirm placement="topRight" title={this.props.languageState.EXCHANGE_RATE_PAGE_DELETE_PROMPT.translated} onConfirm={() => this.props.deleteCurrencyEffect({_id: val._id})} okText="Yes" cancelText="No">
                      <Button icon="delete" type="primary"></Button>
                    </Popconfirm>
                  </Col>
                </Col>
              </Col>);
            }) : ""}
          </Row>
          <Row>
            <Col xs={20} style={{marginTop: '20px', textAlign : 'right'}}>
              <Button type="primary" style={{backgroundColor: '#f55555', color: 'white', marginRight: '20px', border: '0px'}} onClick={this.syncRealtime}><Icon type="sync"></Icon>{this.props.languageState.EXCHANGE_RATE_PAGE_SYNC_REALTIME.translated}</Button>
              <Button type="primary" onClick={() => this.props.toggleCreateModal(true)} style={{backgroundColor: 'green', color: 'white', marginRight: '20px', border: '0px'}}>{this.props.languageState.EXCHANGE_RATE_PAGE_CREATE.translated}</Button>
              <Button loading={this.props.isUpdating} type="primary" onClick={() => this.props.updateDataEffect({data : this.props.data})}>{this.props.languageState.EXCHANGE_RATE_PAGE_UPDATE.translated}</Button>
              <Modal
                title={this.props.languageState.EXCHANGE_RATE_PAGE_CREATE_MODAL.translated}
                visible={this.props.createModalVisible}
                onOk={this.handleOk}
                onCancel={() => this.props.toggleCreateModal(false)}
                okText="Create"
                cancelButtonProps={{ style: { background: "red", color: "white", minWidth: "55px" }, type: 'danger' }}
              >
                <Row gutter={12}>
                  <Col xs={24} style={{marginBottom: '15px'}}>
                    <h4 style={{display: 'inline-block'}}>{this.props.languageState.EXCHANGE_RATE_PAGE_NAME.translated}</h4>
                    {/* <Input placeholder="Enter currency's name" value={this.props.createInputName} onChange={(e) => this.props.changeCreateInputName(e.target.value)}></Input> */}
                    <AutoComplete
                      style={{ width: '100%' }}
                      placeholder="Currency's name"
                      dataSource={currency.filter(val => this.props.data.map((i) => i.code).indexOf(val.code) < 0 && val.code !== 'SGD').map(val => val.name)}
                      value={this.props.createInputName}
                      filterOption={(inputValue, option) => (option.props.children as any).toString().toUpperCase().indexOf(inputValue.toUpperCase()) !== -1}
                      onChange={(value) => this.changeCreateInputName(value)}
                    />
                  </Col>
                  <Col xs={24} lg={12}>
                    <h4 style={{display: 'inline-block'}}>{this.props.languageState.EXCHANGE_RATE_PAGE_CODE.translated}</h4>
                    {/* <Input placeholder="Enter currency's code" value={this.props.createInputCode} onChange={(e) => this.props.changeCreateInputCode(e.target.value)}></Input> */}
                    <AutoComplete
                      style={{ width: '100%' }}
                      placeholder="Currency's code"
                      dataSource={currency.map(val => val.code).filter(val => this.props.data.map((i) => i.code).indexOf(val) < 0 && val !== 'SGD')}
                      value={this.props.createInputCode}
                      filterOption={(inputValue, option) => (option.props.children as any).toString().toUpperCase().indexOf(inputValue.toUpperCase()) !== -1}
                      onChange={(value) => this.changeCreateInputCode(value)}
                    />
                  </Col>
                  <Col xs={24} lg={12}>
                    <h4 style={{display: 'inline-block'}}>{this.props.languageState.EXCHANGE_RATE_PAGE_EXCHANGE_RATE.translated}</h4>
                    <Input type="number" style={{width: '60%'}} value={this.props.createInputExchangeRate} placeholder="= ..." onChange={(e) => this.props.changeCreateInputExchangeRate(e.target.value)}></Input>
                    <h4 style={{display: 'inline-block', paddingLeft: '10px'}}>SGD</h4>
                  </Col>
                </Row>
              </Modal>
            </Col>
          </Row>
        </div>
      </AppLayout>
    );
  }
}

const mapState = (rootState: any) => {
  return {
    ...rootState.exchangeRatePageModel,
    profileState: rootState.profileModel,
    languageState: rootState.languageModel,
  };
};

const mapDispatch = (rootReducer: any) => {
  return {
    ...rootReducer.exchangeRatePageModel,
    profileReducers: rootReducer.profileModel
  };
};

export default withRematch(initStore, mapState, mapDispatch)(ExchangeRatePage);
