import { Layout, Button, Row, Col, Input, Slider, message } from 'antd';
import React from 'react';
import './configuration.css';
import withRematch from '../../rematch/withRematch';
import initStore from '../../rematch/store';
import AppLayout from '../../layout/AdminLayout';
import { getTenantsService } from '../../service-proxies/index';
const Content = Layout.Content;

class CommissionFee extends React.Component<any, any> {

  state = {
    firstPayment: 75,
    nextPayment: 75
  };

  async componentDidMount() {
    const tenantService = getTenantsService();
    var tenantInfo = await tenantService.findTenantDetail(this.props.profileState.tenant._id);
    this.setState({
      firstPayment: tenantInfo.commissionFee ? tenantInfo.commissionFee.firstPayment || 75 : 75,
      nextPayment: tenantInfo.commissionFee ? tenantInfo.commissionFee.nextPayment || 75 : 75
    })
  }

  changeFirstPayment = (value) => {
    this.setState({
      firstPayment: value
    })
  }

  changeNextPayment = (value) => {
    this.setState({
      nextPayment: value
    })
  }

  update = async () => {
    try {
      if (this.state.firstPayment < 0) {
        throw new Error(this.props.languageState.WHITE_LABEL_COMMISSION_FEE_PAGE_UPDATE_VALIDATE_1.translated);
      }
      if (this.state.firstPayment > 100) {
        throw new Error(this.props.languageState.WHITE_LABEL_COMMISSION_FEE_PAGE_UPDATE_VALIDATE_2.translated);
      }
      if (this.state.nextPayment < 0) {
        throw new Error(this.props.languageState.WHITE_LABEL_COMMISSION_FEE_PAGE_UPDATE_VALIDATE_3.translated);
      }
      if (this.state.nextPayment > 100) {
        throw new Error(this.props.languageState.WHITE_LABEL_COMMISSION_FEE_PAGE_UPDATE_VALIDATE_4.translated);
      }
      await getTenantsService().updateCommissionFee({
        _id: this.props.profileState.tenant ? this.props.profileState.tenant._id : "",
        firstPayment: this.state.firstPayment,
        nextPayment: this.state.nextPayment
      })
      message.success(this.props.languageState.WHITE_LABEL_COMMISSION_FEE_PAGE_UPDATE_SUCCESS.translated);
    } catch (error) {
      message.error(error.message || this.props.languageState.WHITE_LABEL_COMMISSION_FEE_PAGE_STH_WENT_WRONG.translated, 4);
    }
  }

  render() {
    return (
      <AppLayout profileState={this.props.profileState} profileReducers={this.props.profileReducers} languageState={this.props.languageState}>
        <Layout style={{ margin: '0px 30px', background: 'white' }}>
          <div>
            <Row>
              <Content style={{ fontWeight: "bold", fontSize: 20, margin: '30px 0px 20px 0px' }}>
                {this.props.languageState.WHITE_LABEL_COMMISSION_FEE_PAGE_CONFIGURATION.translated}
            </Content>
            </Row>
            <Row>
              <Row gutter={{ md: 30, xs: 20 }} className='table-header-container'>
                <Col md={5}>
                  <h4><b>{this.props.languageState.WHITE_LABEL_COMMISSION_FEE_PAGE_SCENARIO.translated}</b></h4>
                </Col>
                <Col md={14}>
                  <h4><b>{this.props.languageState.WHITE_LABEL_COMMISSION_FEE_PAGE_COMMISSION_FEE.translated}</b></h4>
                </Col>
                <Col md={5}>
                </Col>
              </Row>

              <Row gutter={{ md: 30, xs: 20 }} className='table-content-container'>
                <Col md={5}>
                  <h4>{this.props.languageState.WHITE_LABEL_COMMISSION_FEE_PAGE_FIRST_PAYMENT.translated}</h4>
                </Col>
                <Col md={14}>
                  <Col md={14}>
                    <Slider min={0} max={100} value={this.state.firstPayment} onChange={(value) => this.changeFirstPayment(value)}></Slider>
                  </Col>
                  <Col md={10}>
                    <Input addonAfter="%" type="number" value={this.state.firstPayment} onChange={(e) => this.changeFirstPayment(e.target.value)}></Input>
                  </Col>
                </Col>
              </Row>

              <Row gutter={{ md: 30, xs: 20 }} className='table-content-container'>
                <Col md={5}>
                  <h4>{this.props.languageState.WHITE_LABEL_COMMISSION_FEE_PAGE_NEXT_PAYMENT.translated}</h4>
                </Col>
                <Col md={14}>
                  <Col md={14}>
                    <Slider min={0} max={100} value={this.state.nextPayment} onChange={(value) => this.changeNextPayment(value)}></Slider>
                  </Col>
                  <Col md={10}>
                    <Input addonAfter="%" type="number" value={this.state.nextPayment} onChange={(e) => this.changeNextPayment(e.target.value)}></Input>
                  </Col>
                </Col>
              </Row>

              <Row style={{ padding: '0px 20px' }}>
                <Col md={19} style={{ textAlign: 'right' }}>
                  <Button type="primary" onClick={this.update}>{this.props.languageState.WHITE_LABEL_COMMISSION_FEE_PAGE_UPDATE.translated}</Button>
                </Col>
              </Row>
            </Row>

          </div>


        </Layout>
      </AppLayout>
    );
  }
}

const mapState = (rootState: any) => {
  return {
    profileState: rootState.profileModel,
    languageState: rootState.languageModel,
  };
};

const mapDispatch = (rootReducer: any) => {
  return {
    profileReducers: rootReducer.profileModel,
  };
};

export default withRematch(initStore, mapState, mapDispatch)(CommissionFee);