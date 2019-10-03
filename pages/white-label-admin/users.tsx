import * as React from 'react';
import { Button, Input, Col, Row, Icon, Table, Tooltip, Tag, Select, Layout, Popconfirm } from 'antd';
import moment from 'moment';
import AppLayout from '../../layout/AdminLayout';
import initStore from '../../rematch/store';
import withRematch from '../../rematch/withRematch';
import './users.css';
import { getUsersService } from '../../service-proxies';
import Router from 'next/router';
const Content = Layout.Content;

class UsersPage extends React.Component<any, any> {
  static async getInitialProps(props: any) {
    if (!props.req) {
      const usersPageState = props.store.getState().usersPageModel;
      const usersService = getUsersService(props.store.getState().profileModel.token);
      const result = await usersService.find(
        usersPageState.search,
        usersPageState.filter,
        usersPageState.pageNumber,
        usersPageState.pageSize,
        usersPageState.sortBy,
        usersPageState.asc
      );

      props.store.dispatch.usersPageModel.fetchDataSuccess({ result });
    } else {
      props.store.dispatch.usersPageModel.fetchDataSuccess({ result: props.query.users });
    }
  }

  onChangeEditButton = (record) => {
    Router.push(`/admin/edit-profile-by-admin/${record._id}/${record.roles[0]}`);
  }

  render() {
    const actionButtons = (record: any) => {
      return (
        <div className="action-buttons">
          {record.roles[0] === 'sysadmin' || record.roles[0] === 'franchise' ? <div></div> : <Popconfirm
            title="Are you sure to login as this user?"
            onConfirm={() => this.props.impersonate({ userId: record._id })}
          >
            <Tooltip title={this.props.languageState.WHITE_LABEL_USER_PAGE_IMPERSONATE_TOOLTIP.translated}>
              <Button
                type="primary"
                icon="login"
                className="button"
                style={{ marginRight: '12px' }}
              />
            </Tooltip>
          </Popconfirm>}
          {
            record.isActive ?
              <Popconfirm
                title="Are you sure you want to deactivate this user?"
                onConfirm={() => this.props.deactivateUser({ userId: record._id })}
              >
                <Tooltip title={'Deactivate User'}>
                  <Button
                    type="primary"
                    icon={'lock'}
                    className="button"
                    style={{ marginRight: '12px' }}
                  />
                </Tooltip>
              </Popconfirm> :
              <Tooltip title={'Activate User'}>
                <Button
                  type="primary"
                  icon={'unlock'}
                  className="button"
                  onClick={() => this.props.activateUser({ userId: record._id })}
                  style={{ marginRight: '12px' }}
                />
              </Tooltip>
          }
          <Tooltip title={"Edit profile user"}>
            <Button
              type="primary"
              icon="edit"
              className="button"
              onClick={() => this.onChangeEditButton(record)}
              style={{ marginRight: '12px' }}
            />
          </Tooltip>
        </div>
      );
    };

    const activeTag = (isActive: boolean) => (
      <Tag color={isActive ? 'green' : 'red'}>
        {isActive ? this.props.languageState.WHITE_LABEL_USER_PAGE_ACTIVE.translated : this.props.languageState.WHITE_LABEL_USER_PAGE_INACTIVE.translated}
      </Tag>
    );

    const emailConfirmedTag = (emailConfirmed: boolean) => (
      <Tag color={emailConfirmed ? 'green' : 'red'}>
        {emailConfirmed ? 'Yes' : 'No'}
      </Tag>
    );

    const roleTag = (roles: string[]) => {
      if (roles.indexOf('student') > -1) {
        return (
          <Tag color='green'>Student</Tag>
        );
      } else if (roles.indexOf('tutor') > -1) {
        return (
          <Tag color='geekblue'>Tutor</Tag>
        );
      } else if (roles.indexOf('admin') > -1) {
        return (
          <Tag color='orange'>Admin</Tag>
        );
      } else if (roles.indexOf('franchise') > -1) {
        return (
          <Tag color='red'>Distributor</Tag>
        );
      } else if (roles.indexOf('sysadmin') > -1) {
        return (
          <Tag color='red'>System Admin</Tag>
        );
      }
    };

    const columns = [
      {
        title: 'Role',
        dataIndex: 'roles',
        key: 'roles',
        width: '10%',
        render: (_value, record, _index) => roleTag(record.roles),
      },
      {
        title: this.props.languageState.WHITE_LABEL_USER_PAGE_FULL_NAME.translated,
        dataIndex: 'fullName',
        key: 'fullName',
        width: '10%',
        sorter: true,
      },
      {
        title: 'Email',
        dataIndex: 'email',
        key: 'email',
        width: '10%',
        sorter: true,
      },
      {
        title: 'Phone Number',
        dataIndex: 'phone',
        key: 'phone',
        width: '5%',
        sorter: true,
        render: (_value, record, _index) => record.phone ? `${record.phone.phoneID}${record.phone.phoneNumber}` : '',
      },
      {
        title: this.props.languageState.WHITE_LABEL_USER_PAGE_CREATED_AT.translated,
        dataIndex: 'createdAt',
        key: 'createdAt',
        width: '10%',
        render: (value, _record, _index) => value ? moment(value).format('YYYY-MM-DD') : '',
      },
      {
        title: this.props.languageState.WHITE_LABEL_USER_PAGE_MODIFIED_AT.translated,
        dataIndex: 'updatedAt',
        key: 'updatedAt',
        width: '10%',
        sorter: true,
        render: (value, _record, _index) => value ? moment(value).format('YYYY-MM-DD') : '',
      },
      {
        title: 'Status',
        dataIndex: 'isActive',
        key: 'isActive',
        width: '10%',
        sorter: true,
        render: (_value, record, _index) => activeTag(record.isActive),
      },
      {
        title: this.props.languageState.WHITE_LABEL_USER_PAGE_EMAIL_CONFIRMED.translated,
        dataIndex: 'emailConfirmed',
        key: 'emailConfirmed',
        width: '10%',
        sorter: true,
        render: (_value, record, _index) => emailConfirmedTag(record.emailConfirmed),
      },
      {
        title: this.props.languageState.WHITE_LABEL_USER_PAGE_ACTIONS.translated,
        dataIndex: 'actions',
        key: 'actions',
        width: '15%',
        render: (_value, record, _index) => actionButtons(record),
      },
    ];

    return (
      <AppLayout profileState={this.props.profileState} profileReducers={this.props.profileReducers} languageState={this.props.languageState}>
        <div className="users-page">
          <Row>
            <Content style={{ fontWeight: "bold", fontSize: 20, margin: '0px 0px 20px 0px' }}>
              Users
          </Content>
            <hr />
          </Row>
          <div className="users-filter">
            <Row type="flex" gutter={24}>
              <Col lg={12} md={24} xs={24}>
                <div className="search">
                  <Input.Search
                    className="search-input"
                    style={{ width: '100%' }}
                    placeholder={this.props.languageState.WHITE_LABEL_USER_PAGE_SEARCH_PLACEHOLDER.translated}
                    value={this.props.search}
                    onChange={(e: React.FormEvent<HTMLInputElement>) => {
                      this.props.searchChangeReducer({ searchValue: (e.target as any).value.toLowerCase() });
                      this.props.searchChangeEffect({ searchValue: (e.target as any).value.toLowerCase() });
                    }}
                  />
                </div>
              </Col>

              <Col lg={12} md={24} xs={24}>
                <div className="filter">
                  <Select allowClear={true} placeholder='Filter By Role' value={this.props.filter ? this.props.filter : undefined} style={{ width: '100%' }} onChange={(value) => {
                    this.props.filterChangeReducer({ filterValue: value });
                    this.props.filterChangeEffect({ filterValue: value });
                  }}>
                    <Select.Option value="student">Student</Select.Option>
                    <Select.Option value="tutor">Tutor</Select.Option>
                    <Select.Option value="admin">Admin</Select.Option>
                    <Select.Option value="franchise">Distributor</Select.Option>
                    <Select.Option value="sysadmin">System Admin</Select.Option>
                  </Select>
                </div>
              </Col>
            </Row>

            <Row type="flex">
              <Col span={24} className='button-flex'>
                <div className="refresh">
                  <Button
                    type="primary"
                    onClick={() => {
                      this.props.fetchDataReducer({
                        search: this.props.search,
                        filter: this.props.filter,
                        pageNumber: this.props.pageNumber,
                        pageSize: this.props.pageSize,
                        sortBy: this.props.sortBy,
                        asc: this.props.asc
                      });
                      this.props.fetchDataEffect({
                        search: this.props.search,
                        filter: this.props.filter,
                        pageNumber: this.props.pageNumber,
                        pageSize: this.props.pageSize,
                        sortBy: this.props.sortBy,
                        asc: this.props.asc
                      });
                    }}
                  >
                    <Icon type="sync" /> {this.props.languageState.WHITE_LABEL_USER_PAGE_REFRESH.translated}
                  </Button>
                </div>
                <div className="refresh">
                  <a href={`/api/users/export-users?_id=${this.props.profileState.tenant._id}`}>
                    <Button type="primary" disabled={!this.props.data.length}>
                      <Icon type="export" /> Export Users
                    </Button>
                  </a>
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
    ...rootState.usersPageModel,
    profileState: rootState.profileModel,
    languageState: rootState.languageModel,
  };
};

const mapDispatch = (rootReducer: any) => {
  return {
    ...rootReducer.usersPageModel,
    profileReducers: rootReducer.profileModel,
  };
};

export default withRematch(initStore, mapState, mapDispatch)(UsersPage);