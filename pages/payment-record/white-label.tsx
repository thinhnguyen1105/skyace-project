import React from 'react';
import { Button, Col, Row, Icon, Table, Tag, Layout } from 'antd';
import moment from 'moment';
import AppLayout from '../../layout/AdminLayout';
import initStore from '../../rematch/store';
import withRematch from '../../rematch/withRematch';
import './transactions.css';
import { getTenantsService } from '../../service-proxies';
const Content = Layout.Content;


class TransactionsPage extends React.Component<any, any> {
  static async getInitialProps(props: any) {
    const tenantService = getTenantsService();
    if (!props.req) {
      var partnerInfo = await tenantService.findTenantDetail(props.query.partnerId);
      props.store.dispatch.partnerPaymentPageModel.fetchPartnerInfoSuccess(partnerInfo);
      var distributorPayment = await tenantService.getPartnerPayments(props.query.partnerId);
      props.store.dispatch.partnerPaymentPageModel.fetchPartnerPaymentSuccess(distributorPayment);
      var distributorPaycheck = await tenantService.getPartnerPaycheck(props.query.partnerId);
      props.store.dispatch.partnerPaymentPageModel.fetchPartnerPaycheckSuccess(distributorPaycheck);
    } else {
      props.store.dispatch.partnerPaymentPageModel.fetchPartnerInfoSuccess(props.query.partnerInfo);
      props.store.dispatch.partnerPaymentPageModel.fetchPartnerPaymentSuccess(props.query.partnerPayment);
      props.store.dispatch.partnerPaymentPageModel.fetchPartnerPaycheckSuccess(props.query.partnerPaycheck);
    }
  }

  render() {
    // const actionButtons = (record: any) => {
    //   return (
    //     <div className="action-buttons">
    //       <Tooltip title={record.isActive ? 'Deactivate User' : 'Activate User'}>
    //         <Button
    //           type="primary"
    //           icon={this.props.currentUser.isActive ? 'lock' : 'unlock'}
    //           className="button"
    //           onClick={() => record.isActive ? this.props.deactivateUser({userId: record._id}) : this.props.activateUser({userId: record._id})}
    //           style={{marginRight: '12px'}}
    //         />
    //       </Tooltip>
    //     </div>
    //   );
    // };

    const statusTag = (paid: boolean, payload: any) => {
      return (
        <div onClick={() => this.props.updatePaycheck(payload)}>
          <Tag color={paid ? 'green' : 'red'}>{paid ? 'Paid' : 'Not Paid'}</Tag>
        </div>
      );
    }

    const columns = [
      {
        title: 'From',
        dataIndex: 'startDate',
        key: 'startDate',
        render: (_value, record, _index) => `${moment((record as any).startDate).format('DD MMM YYYY')}`,
        // sorter: true,
      },
      {
        title: 'To',
        dataIndex: 'endDate',
        key: 'endDate',
        render: (_value, record, _index) => `${moment((record as any).endDate).format('DD MMM YYYY')}`,
        // sorter: true,
      },
      {
        title: 'Total',
        dataIndex: 'total',
        key: 'total',
        render: (_value, _record, _index) => _value + ' SGD'
      },
      {
        title: 'Status',
        dataIndex: 'status',
        key: 'status',
        render: (_value, record, _index) => {
          const endTag = moment(record.endDate).format('DD-MM-YYYY');
          return statusTag(this.props.partnerPaycheck.indexOf(endTag) >= 0, {
            date: endTag,
            _id: this.props.partnerInfo._id,
          });
        }
      }
    ];

    return (
      <AppLayout profileState={this.props.profileState} profileReducers={this.props.profileReducers} languageState={this.props.languageState}>
        <div className="transactions-page">
          <Row className='margin-bottom-large'>
            <Content style={{ fontWeight: "bold", fontSize: 20, marginBottom: 20 }}>
              Partner Payment Record | {this.props.partnerInfo ? this.props.partnerInfo.companyProfile && this.props.partnerInfo.companyProfile.partnerCenterName ? this.props.partnerInfo.companyProfile.partnerCenterName : this.props.partnerInfo.name : ""}
            </Content>
            <hr />
          </Row>

          <div className="transactions-table">
            <Table
              size="middle"
              loading={this.props.isBusy}
              rowKey={record => moment((record as any).start).format('DD-MM-YYYY')}
              columns={columns}
              dataSource={this.props.partnerPayment || []}
            />
          </div>
        </div>
      </AppLayout>
    );
  }
}

const mapState = (rootState: any) => {
  return {
    ...rootState.partnerPaymentPageModel,
    profileState: rootState.profileModel,
    languageState: rootState.languageModel,
  };
};

const mapDispatch = (rootReducer: any) => {
  return {
    ...rootReducer.partnerPaymentPageModel,
    profileReducers: rootReducer.profileModel,
  };
};

export default withRematch(initStore, mapState, mapDispatch)(TransactionsPage);