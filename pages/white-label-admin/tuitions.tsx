import React from 'react';
import { Button, Col, Row, Icon, Table, Tag, Layout, Popconfirm } from 'antd';
import moment from 'moment';
import AppLayout from '../../layout/AdminLayout';
import initStore from '../../rematch/store';
import withRematch from '../../rematch/withRematch';
import './tuitions.css';
import { getTuitionsService } from '../../service-proxies';
import Link from 'next/link';

const Content = Layout.Content;

class TuitionsPage extends React.Component<any, any> {
  static async getInitialProps(props: any) {
    if (!props.req) {
      const tuitionsPageState = props.store.getState().tuitionsPageModel;
      const tuitionsService = getTuitionsService(props.store.getState().profileModel.token);
      const result = await tuitionsService.findTuitions(
        tuitionsPageState.search,
        tuitionsPageState.isCompleted,
        tuitionsPageState.isCanceled,
        tuitionsPageState.pageNumber,
        tuitionsPageState.pageSize,
        tuitionsPageState.sortBy,
        tuitionsPageState.asc,
        tuitionsPageState.status,
      );

      props.store.dispatch.tuitionsPageModel.fetchDataSuccess({ result });
    } else {
      props.store.dispatch.tuitionsPageModel.fetchDataSuccess({ result: props.query.tuitions });
    }
  }

  cancelTuition = async (_id) => {
    await getTuitionsService().cancelTuition(_id);
    this.props.updateToCancel(_id);
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

    const columns = [
      {
        title: 'Course ID',
        dataIndex: 'referenceId',
        key: 'referenceId',
        width: 200,
        render: (_value, record, _index) => {
          return (
            <div>
              {`${record.course.subject.slice(0, 2).toUpperCase()}${record.course.level.slice(0, 1).toUpperCase()}${String(record.course.grade).slice(0, 1).toUpperCase()}-${moment((record as any).createdAt).format('YYMMDD')}-${moment((record as any).createdAt).format('HHmmSS')}`}
            </div>
          )
        },
        sorter: true,
      },
      {
        title: 'Details',
        dataIndex: 'details',
        key: 'details',
        width: 400,
        render: (_value, record, _index) => {
          return (
            <div>
              {record.course.country === 'trial' ? 'Free Trial' : `${record.course.country}: ${record.course.grade} - ${record.course.subject}`}
            </div>
          )
        },
      },
      {
        title: 'Tutor',
        dataIndex: 'tutor',
        key: 'tutor',
        width: 200,
        render: (_value, record, _index) => {
          return (
            <div>
              {record.tutor ?
                <Link href={`/admin/edit-profile-by-admin/${record.tutor._id}/tutor`}>
                  <a style={{ color: 'gray' }}>
                    <div>{record.tutor.fullName}</div>
                  </a></Link> : ""}
            </div>
          )
        },
        sorter: true,
      },
      {
        title: 'Student',
        dataIndex: 'student',
        key: 'student',
        width: 200,
        render: (_value, record, _index) => {
          return (
            <div>
              {record.student ?
                <Link href={`/admin/edit-profile-by-admin/${record.student._id}/student`}>
                  <a style={{ color: 'gray' }}>
                    <div>{record.student.fullName}</div>
                  </a>
                </Link> : ""}
            </div>
          )
        },
        sorter: true,
      },
      {
        title: 'Period',
        dataIndex: 'periods',
        key: 'periods',
        width: 250,
        render: (_value, record, _index) => record.sessions[0] ? `${moment(record.sessions[0].start).format('DD MMM YYYY')} - ${moment(record.sessions[record.sessions.length - 1].start).format('DD MMM YYYY')}` : '',
      },
      {
        title: 'Status',
        dataIndex: 'status',
        key: 'status',
        render: (_value, record, _index) => {
          if (record.isCanceled === true) {
            return (
              <Tag color={'red'}>
                Cancel
              </Tag>
            )
          } else {
            if (record.isPendingReview) {
              return (
                <Popconfirm title="Are you sure to update this course's status to Canceled?" onConfirm={() => this.cancelTuition(record._id)}>
                  <Tag color={'orange'}>Pending Review</Tag>
                </Popconfirm>
              )
            }
            else if (record.isActive === true) {
              if (record.isCompleted) {
                return (
                  <Tag color={'green'}>
                    {'Completed'}
                  </Tag>  
                )
              } else {
                return (
                  <Tag color={record.isActive ? 'green' : 'red'}>
                    {record.isActive ? 'Active' : 'Inactive'}
                  </Tag>
                )
              }
            } else {
              return (
                <Tag color={record.isActive ? 'green' : 'red'}>
                  {record.isActive ? 'Active' : 'Inactive'}
                </Tag>
              )
            }
          }

        },
        // sorter: true,
        width: 100,
        filters: [{
          text: 'Active',
          value: 'active',
        }, {
          text: 'Completed',
          value: 'completed',
        }, {
          text: 'Canceled',
          value: 'canceled',
        }, {
          text: 'Pending Review',
          value: 'pending-review',
        }]
      }
    ];

    return (
      <AppLayout profileState={this.props.profileState} profileReducers={this.props.profileReducers} languageState={this.props.languageState}>
        <div className="tuitions-page">
          <Row className='margin-bottom-large'>
            <Content style={{ fontWeight: "bold", fontSize: 20, marginBottom: 20 }}>
              {this.props.languageState.WHITE_LABEL_TUITION_PAGE_TITLE.translated}
            </Content>
            <hr />
          </Row>
          <div className="tuitions-filter">
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
                        isCompleted: this.props.isCompleted,
                        isCanceled: this.props.isCanceled,
                        pageNumber: this.props.pageNumber,
                        pageSize: this.props.pageSize,
                        sortBy: this.props.sortBy,
                        asc: this.props.asc,
                        status: this.props.status
                      });
                      this.props.fetchDataEffect({
                        search: this.props.search,
                        isCompleted: this.props.isCompleted,
                        isCanceled: this.props.isCanceled,
                        pageNumber: this.props.pageNumber,
                        pageSize: this.props.pageSize,
                        sortBy: this.props.sortBy,
                        asc: this.props.asc,
                        status: this.props.status
                      });
                    }}
                  >
                    <Icon type="sync" /> {this.props.languageState.WHITE_LABEL_TUITION_PAGE_REFRESH.translated}
                  </Button>
                </div>
                <div className="refresh">
                  <a href={`/api/tuitions/export-tuitions?_id=${this.props.profileState.tenant._id}`}>
                    <Button type="primary" disabled={!this.props.data.length}>
                      <Icon type="export" /> Export Tuitions
                    </Button>
                  </a>
                </div>
              </Col>
            </Row>
          </div>

          <div className="tuitions-table">
            <Table
              size="middle"
              loading={this.props.isBusy}
              rowKey={record => (record as any)._id}
              columns={columns}
              dataSource={this.props.data}
              onChange={(pagination, filters, sorter) => {
                this.props.fetchDataReducer({
                  search: this.props.search,
                  isCompleted: filters.isFinished ? filters.isFinished.length === 0 || filters.isFinished.length === 2 ? undefined : filters.isFinished.indexOf('current') > -1 ? false : true : undefined,
                  isCanceled: filters.isCanceled ? filters.isCanceled.length === 0 || filters.isCanceled.length === 2 ? undefined : filters.isCanceled.indexOf('no') > -1 ? false : true : undefined,
                  pageNumber: pagination.current,
                  pageSize: pagination.pageSize,
                  sortBy: sorter.field ? sorter.field : this.props.sortBy,
                  asc: sorter.order ? sorter.order === 'ascend' ? true : false : this.props.asc,
                  status: filters.status || []
                });
                this.props.fetchDataEffect({
                  search: this.props.search,
                  isCompleted: filters.isFinished ? filters.isFinished.length === 0 || filters.isFinished.length === 2 ? undefined : filters.isFinished.indexOf('current') > -1 ? false : true : undefined,
                  isCanceled: filters.isCanceled ? filters.isCanceled.length === 0 || filters.isCanceled.length === 2 ? undefined : filters.isCanceled.indexOf('no') > -1 ? false : true : undefined,
                  pageNumber: pagination.current,
                  pageSize: pagination.pageSize,
                  sortBy: sorter.field ? sorter.field : this.props.sortBy,
                  asc: sorter.order ? sorter.order === 'ascend' ? true : false : this.props.asc,
                  status: filters.status || []
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

          {/* <Modal
            className="role-modal"
            title='Create/Edit Role'
            okText='Save'
            cancelText='Cancel'
            onOk={this.onCreateRoleFormSubmit}
            onCancel={this.props.closeAddRoleModal}
            visible={this.props.addRoleModalVisible}
          >
            {this.props.errorMessage && (
              <div style={{ height: '21px', lineHeight: '21px', color: '#f5222d', textAlign: 'center' }}>
                {this.props.errorMessage}
              </div>
            )}

            <div className="input-role-name">
              <div style={{ padding: '12px 0' }}>
                <span style={{ color: 'red' }}>*</span> Role Name:
              </div>
              <div style={{margin: '0 24px'}}>
                <Input
                  placeholder='Role Name'
                  value={this.props.currentRole.name}
                  onChange={(e) => this.props.roleInfoChange({name: e.target.value})}
                />
                <Checkbox
                  checked={this.props.currentRole.isDefault}
                  onChange={(e: any) => this.props.roleInfoChange({isDefault: e.target.checked})}
                  style={{ padding: '24px 0' }}
                >
                  Set As Default
                </Checkbox>
              </div>
            </div>

            <div className="select-permissions">
              <div style={{ padding: '12px 0' }}>
                <span style={{ color: 'red' }}>*</span> Role Permissions:
              </div>
              <div style={{margin: '0 24px'}}>
                <Tree
                  checkable={true}
                  multiple={true}
                  checkedKeys={this.props.currentRole.permissions}
                  onCheck={(checkedKeys, _e) => this.props.roleInfoChange({permissions: checkedKeys})}
                >
                  {data.map((item, _index) => (
                    <Tree.TreeNode
                      title={item.title}
                      key={item.key}
                    >
                      {item.children.map((child) => (
                        <Tree.TreeNode
                          title={child.title}
                          key={child.value}
                        />
                      ))}
                    </Tree.TreeNode>
                  ))}
                </Tree>
              </div>
            </div>
          </Modal> */}
        </div>
      </AppLayout>
    );
  }
}

const mapState = (rootState: any) => {
  return {
    ...rootState.tuitionsPageModel,
    profileState: rootState.profileModel,
    languageState: rootState.languageModel,
  };
};

const mapDispatch = (rootReducer: any) => {
  return {
    ...rootReducer.tuitionsPageModel,
    profileReducers: rootReducer.profileModel,
  };
};

export default withRematch(initStore, mapState, mapDispatch)(TuitionsPage);