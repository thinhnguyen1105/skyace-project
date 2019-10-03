import React from 'react';
import { Button, Col, Row, Icon, Table, Tag, Layout } from 'antd';
import moment from 'moment';
import AppLayout from '../../layout/AdminLayout';
import initStore from '../../rematch/store';
import withRematch from '../../rematch/withRematch';
import './transactions.css';
import { getUsersService } from '../../service-proxies';
const Content = Layout.Content;


class TransactionsPage extends React.Component<any, any> {
  static async getInitialProps(props: any) {
    const userService = getUsersService();
    if (!props.req) {
      var distributorInfo = await userService.findById(props.query.userId);
      props.store.dispatch.distributorPaymentPageModel.fetchDistributorInfoSuccess(distributorInfo);
      var distributorPayment = await userService.getDistributorPayment(props.query.userId);
      props.store.dispatch.distributorPaymentPageModel.fetchDistributorPaymentSuccess(distributorPayment);
      var distributorPaycheck = await userService.getDistributorPaycheck(props.query.userId);
      props.store.dispatch.distributorPaymentPageModel.fetchDistributorPaycheckSuccess(distributorPaycheck);
    } else {
      props.store.dispatch.distributorPaymentPageModel.fetchDistributorInfoSuccess(props.query.distributorInfo);
      props.store.dispatch.distributorPaymentPageModel.fetchDistributorPaymentSuccess(props.query.distributorPayment);
      props.store.dispatch.distributorPaymentPageModel.fetchDistributorPaycheckSuccess(props.query.distributorPaycheck);
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
        dataIndex: 'start',
        key: 'start',
        render: (_value, record, _index) => `${moment((record as any).start).format('DD MMM YYYY')}`,
        // sorter: true,
      },
      {
        title: 'To',
        dataIndex: 'end',
        key: 'end',
        render: (_value, record, _index) => `${moment((record as any).end).format('DD MMM YYYY')}`,
        // sorter: true,
      },
      {
        title: 'Fixed Amount',
        dataIndex: 'fixedAmount',
        key: 'fixedAmount',
        render: (_value, _record, _index) => _value + ' SGD'
      },
      {
        title: 'Partners Amount',
        dataIndex: 'totalIncome',
        key: 'totalIncome',
        render: (_value, _record, _index) => _value + ' SGD'
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
          const endTag = moment(record.end).format('DD-MM-YYYY');
          return statusTag(this.props.distributorPaycheck.indexOf(endTag) >= 0, {
            date: endTag,
            _id: this.props.distributorInfo._id,
          });
        }
      }
    ];

    return (
      <AppLayout profileState={this.props.profileState} profileReducers={this.props.profileReducers} languageState={this.props.languageState}>
        <div className="transactions-page">
          <Row className='margin-bottom-large'>
            <Content style={{ fontWeight: "bold", fontSize: 20, marginBottom: 20 }}>
              Distributor Payment Record | {this.props.distributorInfo.distributorInfo && this.props.distributorInfo.distributorInfo.companyName ? this.props.distributorInfo.distributorInfo.companyName : this.props.distributorInfo.fullName}
            </Content>
            <hr />
          </Row>

          <div className="transactions-table">
            <Table
              size="middle"
              loading={this.props.isBusy}
              rowKey={record => moment((record as any).start).format('DD-MM-YYYY')}
              columns={columns}
              dataSource={this.props.distributorPayment || []}
            />
          </div>
        </div>
      </AppLayout>
    );
  }
}

const mapState = (rootState: any) => {
  return {
    ...rootState.distributorPaymentPageModel,
    profileState: rootState.profileModel,
    languageState: rootState.languageModel,
  };
};

const mapDispatch = (rootReducer: any) => {
  return {
    ...rootReducer.distributorPaymentPageModel,
    profileReducers: rootReducer.profileModel,
  };
};

export default withRematch(initStore, mapState, mapDispatch)(TransactionsPage);