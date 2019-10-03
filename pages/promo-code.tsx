import * as React from 'react';
import { Button, Input, Col, Row, Icon, Table, Tooltip, Switch, Layout, Popconfirm, Modal, Form, Select, Checkbox } from 'antd';
import moment from 'moment';
// import config from '../api/config';
import AppLayout from '../layout/AdminLayout';
import initStore from '../rematch/store';
import withRematch from '../rematch/withRematch';
import './white-label-admin/users.css';
import { getPromoCodeService } from '../service-proxies';
import UpdateCode from '../components/promo-code-page/UpdateCode';
import AddCode from '../components/promo-code-page/AddCode';
const Content = Layout.Content;

class PromoCodePage extends React.Component<any, any> {
  static async getInitialProps(props: any) {
    if (!props.req) {
      const promoCodePageState = props.store.getState().promoCodePageModel;
      const promoCodeService = getPromoCodeService(props.store.getState().profileModel.token);
      const result = await promoCodeService.find(
        promoCodePageState.search,
        promoCodePageState.filter,
        promoCodePageState.pageNumber,
        promoCodePageState.pageSize,
        promoCodePageState.sortBy,
        promoCodePageState.asc
      );

      props.store.dispatch.promoCodePageModel.fetchDataSuccess({result});
    } else {
      props.store.dispatch.promoCodePageModel.fetchDataSuccess({result: props.query.promoCodes});
    }
  }

  fetchData = () => {
    // this.props.fetchDataReducer({
    //   search: this.props.search,
    //   filter: this.props.filter,
    //   pageNumber: this.props.pageNumber,
    //   pageSize: this.props.pageSize,
    //   sortBy: this.props.sortBy,
    //   asc: this.props.asc
    // });
    this.props.fetchDataEffect({
      search: this.props.search,
      filter: this.props.filter,
      pageNumber: this.props.pageNumber,
      pageSize: this.props.pageSize,
      sortBy: this.props.sortBy,
      asc: this.props.asc
    });
  }

  render() {
    const actionButtons = (record: any) => {
      return (
        <div className="action-buttons">
          <Tooltip title={"Edit code"}>
            <Button
              type="primary"
              icon="edit"
              onClick={() => this.props.openUpdateModal(record)}
              className="button"
              style={{marginRight: '12px'}}
            />
          </Tooltip>
          <Popconfirm
            title="Are you sure to delete this promo code?"
            onConfirm={() => this.props.deleteCode({_id : record._id})}
          >
            <Tooltip title={'Delete code'}>
              <Button
                type="primary"
                icon={'delete'}
                className="button"
                style={{marginRight: '12px'}}
              />
            </Tooltip>
          </Popconfirm>
        </div>
      );
    };

    const activeTag = (record: any) => (
      <Switch checked={record.isActive} onChange={(value) => this.props.updateCode({...record, isActive: value})}></Switch>
    );

    const columns = [
      {
        title: 'Code',
        dataIndex: 'name',
        key: 'name',
        width: '10%',
        sorter: true,
      },
      {
        title: 'Description',
        dataIndex: 'description',
        key: 'description',
        width: '10%',
        sorter: true,
      },
      {
        title: 'Value',
        dataIndex: 'value',
        key: 'value',
        width: '10%',
        sorter: true,
        render: (_value, record, _index) => record.value + ' ' + record.type
      },
      {
        title: 'Quantity',
        dataIndex: 'quantity',
        key: 'quantity',
        width: '10%',
        sorter: true,
        render: (_value, record, _index) => record.isInfinite ? 'Infinite' : record.quantity
      },
      {
        title: 'Start Date',
        dataIndex: 'startDate',
        key: 'startDate',
        width: '10%',
        sorter: true,
        render: (_value, record, _index) => moment(_value).format('DD MMM YYYY')
      },
      {
        title: 'End Date',
        dataIndex: 'endDate',
        key: 'endDate',
        width: '10%',
        sorter: true,
        render: (_value, record, _index) => moment(_value).format('DD MMM YYYY')
      },
      {
        title: 'Active Status',
        dataIndex: 'isActive',
        key: 'isActive',
        width: '10%',
        sorter: true,
        render: (_value, record, _index) => activeTag(record),
      },
      {
        title: 'Actions',
        dataIndex: 'actions',
        key: 'actions',
        width: '10%',
        render: (_value, record, _index) => actionButtons(record),
      },
    ];

    return (
      <AppLayout profileState={this.props.profileState} profileReducers={this.props.profileReducers} languageState={this.props.languageState}>
        <div className="users-page">
        <Row>
            <Content style={{ fontWeight: "bold", fontSize: 20 }}>
              Promo Codes
            </Content>
          </Row>
          <div className="users-filter">
            <Row type="flex" gutter={24}>
              <Col lg={12} md={24} xs={24}>
                <div className="search">
                  <Form onSubmit={(e) => {
                    e.preventDefault();
                    this.fetchData();
                  }}>
                    <Input.Search
                      className="search-input"
                      style={{ width: '100%' }}
                      placeholder='Search Code'
                      value={this.props.search}
                      onChange={(e) => this.props.changeSearch((e.target as any).value)}
                    />
                  </Form>
                </div>
              </Col>

            </Row>

            <Row type="flex">
              <Col span={24} className='button-flex'>
                <div className="refresh">
                  <Button
                    type="primary"
                    onClick={this.fetchData}
                  >
                    <Icon type="sync" /> Refresh
                  </Button>
                </div>
                <div className="refresh">
                  <Button
                    type="primary"
                    onClick={() => this.props.toggleCreateCodeModal(true)}
                  >
                    <Icon type="plus" /> Add New
                  </Button>
                </div>
              </Col>
            </Row>
          </div>

          <div className="users-table">
            <Table
              size="middle"
              loading={this.props.isBusy}
              rowKey={record => (record as any)._id}
              columns={columns}
              dataSource={this.props.data}
              onChange={(pagination, _filters, sorter) => {
                this.props.fetchDataReducer({
                  search: this.props.search,
                  filter: this.props.filter,
                  pageNumber: pagination.current,
                  pageSize: pagination.pageSize,
                  sortBy: sorter.field ? sorter.field : this.props.sortBy,
                  asc: sorter.order ? sorter.order === 'ascend' ? true : false : this.props.asc,
                });
                this.props.fetchDataEffect({
                  search: this.props.search,
                  filter: this.props.filter,
                  pageNumber: pagination.current,
                  pageSize: pagination.pageSize,
                  sortBy: sorter.field ? sorter.field : this.props.sortBy,
                  asc: sorter.order ? sorter.order === 'ascend' ? true : false : this.props.asc,
                });
              }}
              pagination={{
                total: this.props.total,
                showSizeChanger: true,
                pageSize: this.props.pageSize,
                current: this.props.pageNumber,
                pageSizeOptions: [10, 20, 50].map((item) => String(item)),
              }}
            />
          </div>
          <AddCode
            clearInput={this.props.clearInput}
            toggleCreateCodeModal={this.props.toggleCreateCodeModal}
            changeCreateInput={this.props.changeCreateInput}
            createData={this.props.createData}
            createNewCode={this.props.createNewCode}
            createModal={this.props.createModal}
            languageState={this.props.languageState}
          />
          <UpdateCode
            clearInput={this.props.clearUpdateInput}
            updateData={this.props.updateData}
            changeUpdateInput={this.props.changeUpdateInput}
            selected={this.props.selected}
            closeUpdateModal={this.props.closeUpdateModal}
            updateModal={this.props.updateModal}
            updateCode={this.props.updateCode}
            languageState={this.props.languageState}
          ></UpdateCode>
        </div>
      </AppLayout>
    );
  }
}

const mapState = (rootState: any) => {
  return {
    ...rootState.promoCodePageModel,
    profileState: rootState.profileModel,
    languageState: rootState.languageModel,
  };
};

const mapDispatch = (rootReducer: any) => {
  return {
    ...rootReducer.promoCodePageModel,
    profileReducers: rootReducer.profileModel,
  };
};

export default withRematch(initStore, mapState, mapDispatch)(Form.create()(PromoCodePage));