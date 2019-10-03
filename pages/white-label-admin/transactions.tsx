import React from 'react';
import { Button, Col, Row, Icon, Table, Tag, Layout, Tooltip, Modal, Input, message } from 'antd';
import moment from 'moment';
import AppLayout from '../../layout/AdminLayout';
import initStore from '../../rematch/store';
import withRematch from '../../rematch/withRematch';
import './transactions.css';
import { getTransactionService } from '../../service-proxies';
import Router from 'next/router';
import Link from 'next/link';
const Content = Layout.Content;


class TransactionsPage extends React.Component<any, any> {
  static async getInitialProps(props: any) {
    if (!props.req) {
      const transactionsPageState = props.store.getState().transactionsPageModel;
      const transactionsService = getTransactionService(props.store.getState().profileModel.token);
      const result = await transactionsService.findTransactions(
        transactionsPageState.search,
        transactionsPageState.pageNumber,
        transactionsPageState.pageSize,
        transactionsPageState.sortBy,
        transactionsPageState.asc
      );

      props.store.dispatch.transactionsPageModel.fetchDataSuccess({ result });
    } else {
      props.store.dispatch.transactionsPageModel.fetchDataSuccess({ result: props.query.transactions });
    }
  }

  state = {
    remarks : "",
    selected: null,
    remarkModal: false
  }

  onClickName = (record) => {
    Router.push(`/admin/edit-profile-by-admin/${record._id}/${record.roles[0]}`);
  }

  changeRemarks = (text) => {
    this.setState({
      remarks: text
    })
  }

  openRemarkModal = (record) => {
    this.setState({
      selected: record,
      remarkModal: true,
    })
  }
  
  hideRemarkModal = () => {
    this.setState({
      selected: null,
      remarkModal: false
    })
  }

  saveRemarks = async () => {
    await getTransactionService().update({
      _id: this.state.selected ? (this.state.selected as any)._id : null,
      studentRemark: this.state.remarks
    });
    this.props.editData({
      _id: this.state.selected ? (this.state.selected as any)._id : null,
      studentRemark: this.state.remarks
    })
    this.setState({
      remarks: "",
      selected: null,
      remarkModal : false
    })
  }

  generateTuitionReferenceId = (tuition: any) => {
    // console.log('tuition', tuition);
    if (tuition) {
      const createdAt = moment(tuition.createdAt).format('HHmmSS');
      return tuition.courseForTutor ? tuition.course ? 
      (tuition.courseForTutor.isGroup ?  
        `${tuition.course.subject.slice(0, 2).toUpperCase()}${tuition.course.level.slice(0, 1).toUpperCase()}${String(tuition.course.grade).slice(0, 1).toUpperCase()}-${moment((tuition as any).createdAt).format('YYMMDD')}-${createdAt}-GROUP` :
        `${tuition.course.subject.slice(0, 2).toUpperCase()}${tuition.course.level.slice(0, 1).toUpperCase()}${String(tuition.course.grade).slice(0, 1).toUpperCase()}-${moment((tuition as any).createdAt).format('YYMMDD')}-${createdAt}`) 
        : "" : "";
      // return "";
    } else {
      return "";
    }
  }

  render() {
    const actionButtons = (record: any) => {
      return (
        <div className="action-buttons">
          <Tooltip title={'Key in remarks'}>
            <Button
              type="primary"
              icon="edit"
              className="button"
              onClick={() => this.openRemarkModal(record)}
              style={{marginRight: '12px'}}
            />
          </Tooltip>
          <Tooltip title={'Download Invoice'}>
            <Button
              type="primary"
              icon="download"
              className="button"
              onClick={() => {message.success('Under development',3)}}
            />
          </Tooltip>
        </div>
      );
    };

    const statusTag = (paid: boolean, option: string, canceled: boolean) => {
      return (
        <Tag color={canceled ? 'red' : (paid ? 'green' : 'yellow')}>{canceled ? 'Canceled' : (paid ? (option === 'partiallyPay' ? 'Partially Paid' : 'Fully Paid') : 'Not Paid')}</Tag>
      );
    }

    const columns = [
      {
        title: 'Transaction Date',
        dataIndex: 'createdAt',
        key: 'createdAt',
        render: (_value, record, _index) => `${moment((record as any).createdAt).format('DD MMM YYYY, HH:mm')}`,
        sorter: true,
      },
      {
        title: 'Paypal ID',
        dataIndex: 'paymentToken',
        key: 'paymentToken',
        render: (_value, record, _index) => {
          return (
            <div>
              {record.isDiscount100 ? 'DISCOUNT_100%' : record.paymentToken}
            </div>
          )
        }
      },
      {
        title: 'Course ID',
        dataIndex: 'tuition',
        key: 'tuition',
        render: (_value, record, _index) => {
          return (
            <div>
              { record.tuition ?
                <Link href={`/calendar/tuition-detail/${record.tuition._id}`}><div style={{cursor: 'pointer'}}>{this.generateTuitionReferenceId(record.tuition)}</div></Link> :
                (record.groupTuition ?  <Link href={`/calendar/group-tuition-detail/${record.groupTuition._id}`}><div style={{cursor: 'pointer'}}>{this.generateTuitionReferenceId(record.groupTuition)}</div></Link> : "")
              }
            </div>
          )
        }
      },
      {
        title: 'Tutor',
        dataIndex: 'tutor',
        key: 'tutor',
        render: (_value, record, _index) => {
          return (
            <div>
              {record.tutor ?
                <Link href={`/admin/edit-profile-by-admin/${record.tutor._id}/tutor`}><div>{record.tutor.fullName}</div></Link> : ""}
            </div>
          )
        },
        sorter: true,
      },
      {
        title: 'Student',
        dataIndex: 'student',
        key: 'student',
        render: (_value, record, _index) => {
          return (
            <div>
              {record.student ?
                <Link href={`/admin/edit-profile-by-admin/${record.student._id}/student`}><div>{record.student.fullName}</div></Link> : ""}
            </div>
          )
        },
        sorter: true,
      },
      {
        title: 'Status',
        dataIndex: 'paid',
        key: 'paid',
        render: (_value, record, _index) => statusTag(record.paid, record.option, record.isTuitionCanceled),
      },
      {
        title: 'Promo Amount',
        dataIndex: 'promoAmount',
        key: 'promoAmount',
        render: (_value, record, _index) => {
          return (
            record.promoCode ? (record.promoCode.type === '%' ? (record.startAmount * record.promoCode.value / 100) : (Number(record.promoCode.value) > Number(record.startAmount) ? 'SGD ' + record.startAmount : 'SGD ' + record.promoCode.value )) : 0
          )
        }
      },
      {
        title: 'Promo Code',
        dataIndex: 'promoCode',
        key: 'promoCode',
        render: (_value, record, _index) => {
          return (
            record.promoCode ? record.promoCode.name : "None"
          )
        }
      },
      {
        title: 'Final amount',
        dataIndex: 'amountOfMoney',
        key: 'amountOfMoney',
        render: (_value, record, _index) => {
          let total: number = 0;
          if (record.paymentDetail && record.paymentDetail.transactions) {
            for (let item of record.paymentDetail.transactions) {
              total += Number(item.amount.total);
            }
  
            return `${record.paymentDetail.transactions[0].amount.currency} ${total}`;
          } else {
            return 0;
          }
        },
      },
      {
        title: 'Remarks',
        dataIndex: 'studentRemark',
        key: 'studentRemark',
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
        <div className="transactions-page">
          <Row className='margin-bottom-large'>
            <Content style={{ fontWeight: "bold", fontSize: 20, marginBottom: 20 }}>
              {this.props.languageState.WHITE_LABEL_TRANSACTION_PAGE_STUDENT_TRANSACTION.translated}
            </Content>
            <hr />
          </Row>
          <div className="transactions-filter">
            {/* <Row type="flex" gutter={24}>
              <Col lg={12} md={24} xs={24}>
                <div className="search">
                  <Input.Search
                    className="search-input"
                    style={{ width: '100%' }}
                    placeholder='Search'
                    value={this.props.search}
                    onChange={(e: React.FormEvent<HTMLInputElement>) => {
                      this.props.searchChangeReducer({searchValue: (e.target as any).value.toLowerCase()});
                      this.props.searchChangeEffect({searchValue: (e.target as any).value.toLowerCase()});
                    }}
                  />
                </div>
              </Col>

              <Col lg={12} md={24} xs={24}>
                <div className="filter">
                  <Select allowClear={true} placeholder='Filter By Status' style={{width: '100%'}} onChange={(value) => {
                    this.props.filterChangeReducer({filterValue: value});
                    this.props.filterChangeEffect({filterValue: value});
                  }}>
                    <Select.Option value="current">Current</Select.Option>
                    <Select.Option value="finished">Finished</Select.Option>
                    <Select.Option value="canceled">Canceled</Select.Option>
                  </Select>
                </div>
              </Col>
            </Row> */}

            <Row type="flex">
              <Col span={24} className='button-flex'>
                <div className="refresh">
                  <Button
                    type="primary"
                    onClick={() => {
                      this.props.fetchDataReducer({
                        search: this.props.search,
                        pageNumber: this.props.pageNumber,
                        pageSize: this.props.pageSize,
                        sortBy: this.props.sortBy,
                        asc: this.props.asc
                      });
                      this.props.fetchDataEffect({
                        search: this.props.search,
                        pageNumber: this.props.pageNumber,
                        pageSize: this.props.pageSize,
                        sortBy: this.props.sortBy,
                        asc: this.props.asc
                      });
                    }}
                  >
                    <Icon type="sync" /> {this.props.languageState.WHITE_LABEL_ROLES_PAGE_REFRESH.translated}
                  </Button>
                </div>
                <div className="refresh">
                  <a href={`/api/transaction/export-transactions?_id=${this.props.profileState.tenant._id}`}>
                    <Button type="primary" disabled={!this.props.data.length}>
                      <Icon type="export" /> Export Transactions
                    </Button>
                  </a>
                </div>
              </Col>
            </Row>
          </div>

          <div className="transactions-table">
            <Table
              size="middle"
              loading={this.props.isBusy}
              rowKey={record => (record as any)._id}
              columns={columns}
              dataSource={this.props.data || []}
              onChange={(pagination, _filters, sorter) => {
                this.props.fetchDataReducer({
                  search: this.props.search,
                  pageNumber: pagination.current,
                  pageSize: pagination.pageSize,
                  sortBy: sorter.field ? sorter.field : this.props.sortBy,
                  asc: sorter.order ? sorter.order === 'ascend' ? true : false : this.props.asc,
                });
                this.props.fetchDataEffect({
                  search: this.props.search,
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

          <Modal
            className=""
            title='Key In Remarks'
            okText='Save'
            cancelText='Cancel'
            onOk={this.saveRemarks}
            onCancel={this.hideRemarkModal}
            visible={this.state.remarkModal}
          >
            <div>
              <Input type="text" placeholder="Remarks" onChange={(e) => this.changeRemarks(e.target.value)}>
              </Input>
            </div>
          </Modal>
        </div>
      </AppLayout>
    );
  }
}

const mapState = (rootState: any) => {
  return {
    ...rootState.transactionsPageModel,
    profileState: rootState.profileModel,
    languageState: rootState.languageModel,
  };
};

const mapDispatch = (rootReducer: any) => {
  return {
    ...rootReducer.transactionsPageModel,
    profileReducers: rootReducer.profileModel,
  };
};

export default withRematch(initStore, mapState, mapDispatch)(TransactionsPage);