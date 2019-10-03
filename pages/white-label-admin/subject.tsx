import * as React from 'react';
import { Button, Icon, Row, Col, Tag, Input, Popconfirm, Table, Modal, Layout, message } from 'antd';
import './student.css';
import initStore from '../../rematch/store';
import withRematch from '../../rematch/withRematch';
import AppLayout from '../../layout/AdminLayout';
import { getMetadataService } from '../../service-proxies';

const Content = Layout.Content;

class UserConfigTable extends Table<any> { }

class SubjectPage extends React.Component<any, any> {
  slugify = (string) => {
    const a = 'àáäâãåèéëêìíïîòóöôùúüûñçßÿœæŕśńṕẃǵǹḿǘẍźḧ·/_,:;'
    const b = 'aaaaaaeeeeiiiioooouuuuncsyoarsnpwgnmuxzh------'
    const p = new RegExp(a.split('').join('|'), 'g')
    return string.toString().toLowerCase()
      .replace(/\s+/g, '-') // Replace spaces with
      .replace(p, c => b.charAt(a.indexOf(c))) // Replace special characters
      .replace(/&/g, '-and-') // Replace & with ‘and’
      .replace(/[^\w\-]+/g, '') // Remove all non-word characters
      .replace(/\-\-+/g, '-') // Replace multiple — with single -
      .replace(/^-+/, '') // Trim — from start of text .replace(/-+$/, '') // Trim — from end of text
  }

  componentDidMount() {
    this.props.fetchSubjectsEffect();
  }

  filterCountry = (value) => {
    if (value) {
      this.props.filterCourse({ country: value });
    } else {
      this.props.filterCourse();
    }
  }

  handleOk = async () => {
    try {
      const newSubject = await getMetadataService().createSubject({
        ...this.props.inputs,
        slug: this.slugify(this.props.inputs.name),
        isActive: true
      });
      this.props.createSuccess(newSubject);
      this.props.toggleCreateModal(false);
    } catch (err) {
      message.error(err.message || 'Internal server error');
    }
  }

  handleCancel = () => {
    this.props.toggleCreateModal(false);
  }

  handleUpdateOk = async () => {
    try {
      await getMetadataService().updateSubject(this.props.updateInputs);
      this.props.updateData(this.props.updateInputs);
      this.props.toggleUpdateModal(false);
    } catch (err) {
      message.error(err.message || 'Internal server error');
    }
  }

  handleUpdateCancel = () => {
    this.props.toggleUpdateModal(false);
  }

  showCreateModal = () => {
    this.props.toggleCreateModal(true);
  }

  showUpdateModal = (record) => {
    this.props.toggleUpdateModal(true);
    this.props.changeUpdateInputs(record);
  }

  switchTag = async (record: any) => {
    try {
      await getMetadataService().updateSubject({
        ...record,
        isActive: record.isActive ? false: true,
      })
      this.props.updateData({
        ...record,
        isActive: record.isActive ? false: true,
      })
    } catch (err) {
      message.error(err.message || 'Internal server error');
    }
  }

  render() {
    const activeTag = (record: any) => (
      <Tag color={record.isActive ? 'green' : 'red'} onClick={() => this.switchTag(record)}>
        {record.isActive ? 'Active' : 'Inactive'}
      </Tag>
    );
    const Column = Table.Column;
    return (
      <AppLayout profileState={this.props.profileState} profileReducers={this.props.profileReducers} languageState={this.props.languageState}>
        <div style={{ padding: '0 30px 30px' }}>
          <Row>
            <Content style={{ fontWeight: "bold", fontSize: 20, margin: '30px 0px 20px 0px' }}>
              Subjects
          </Content>
          </Row>
          <Row>
            <div className='headline-wrapper'>
              <div className='button-container' style={{ justifyContent: 'flex-start' }}>
                <div>
                  <Button type='primary' className='button-container__button' onClick={this.showCreateModal}>Add New</Button>
                  <Modal
                    title="Create new subject"
                    visible={this.props.createModalVisible}
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}
                    okText="Create"
                    cancelButtonProps={{style: {background: "red", color: "white", minWidth: "55px"}, type: 'danger'}}
                  > 
                    <div>
                      <div>
                        <h4>Subject's name</h4>
                        <Input type="text" placeholder="Name" value={this.props.inputs.name} onChange={(e) => this.props.changeInput({name: e.target.value})}/>
                      </div>
                      <div style={{marginTop: '15px'}}>
                        <h4>Subject's description</h4>
                        <Input type="text" placeholder="Description" value={this.props.inputs.description} onChange={(e) => this.props.changeInput({description: e.target.value})}/>
                      </div>
                    </div>
                  </Modal>
                </div>
              </div>
              {/* <div className='search-form-container' style={{ justifyContent: 'flex-end', marginRight: '20px' }}>
                <Form layout='inline' className='search-form' onSubmit={this._searchCourse}>
                  <Form.Item>
                    <Input placeholder='Search' value={this.props.searchInput} onChange={(e) => this.props.searchInputChange({ keyword: e.target.value })} />
                  </Form.Item>
                </Form>
              </div> */}
            </div>

            {/* Error Message Display Area */}
            <div>
              <h3 style={{ textAlign: 'center', color: 'red' }}>{this.props.error}</h3>
            </div>
            {/* End error message*/}

            <div style={{ background: 'white' }}>
              <Row>
                <Col span={24}>
                  <UserConfigTable
                    className='user-table'
                    bordered
                    size='small'
                    scroll={{ x: 0, y: 500 }}
                    dataSource={this.props.data}
                    rowKey={record => record._id}
                  >
                    <Column
                      title='Name'
                      dataIndex='name'
                      key='name'
                      width={150}
                      sorter={(a: any, b: any) => a.name.localeCompare(b.name)}
                    />
                    <Column
                      title='Description'
                      dataIndex='description'
                      key='description'
                      width={150}
                      sorter={(a: any, b: any) => a.description.localeCompare(b.description)}
                    />
                    <Column
                      title='Status'
                      dataIndex='status'
                      key='status'
                      width={150}
                      render={(_value, record: any) => {
                        return activeTag(record)
                      }}
                    />
                    <Column
                      title='Action'
                      key='action'
                      width={100}
                      render={(_record) => (
                        <div style={{ }}>
                          {/* Update button */}
                          <a style={{ margin: '0px 10px' }} onClick={() => this.showUpdateModal(_record)}><Icon type='edit' /></a>
                          <Modal
                            title="Update subject"
                            visible={this.props.updateModalVisible}
                            onOk={this.handleUpdateOk}
                            onCancel={this.handleUpdateCancel}
                            okText="Update"
                            cancelButtonProps={{style: {background: "red", color: "white", minWidth: "55px"}, type: 'danger'}}
                          > 
                            <div>
                              <div>
                                <h4>Subject's name</h4>
                                <Input type="text" placeholder="Name" value={this.props.updateInputs.name} onChange={(e) => this.props.changeUpdateInputs({name: e.target.value})}/>
                              </div>
                              <div style={{marginTop: '15px'}}>
                                <h4>Subject's description</h4>
                                <Input type="text" placeholder="Description" value={this.props.updateInputs.description} onChange={(e) => this.props.changeUpdateInputs({description: e.target.value})}/>
                              </div>
                            </div>
                          </Modal>
                        </div>
                      )}
                    />
                  </UserConfigTable>
                </Col>
              </Row>
            </div>
          </Row>
        </div>
      </AppLayout>
    );
  }
}

const mapState = (rootState: any) => {
  return {
    ...rootState.subjectPageModel,
    profileState: rootState.profileModel,
    dataLookupState: rootState.dataLookupModel,
    languageState: rootState.languageModel
  };
};

const mapDispatch = (rootReducer: any) => {
  return {
    ...rootReducer.subjectPageModel,
    profileReducers: rootReducer.profileModel,
    dataLookup: rootReducer.dataLookupModel
  };
};

export default withRematch(initStore, mapState, mapDispatch)(SubjectPage);
