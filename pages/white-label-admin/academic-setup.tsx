import * as React from 'react';
import { Breadcrumb, Button, Icon, Row, Col, Form, Input, Popconfirm, Table, AutoComplete, Layout } from 'antd';
import './student.css';
import initStore from '../../rematch/store';
import withRematch from '../../rematch/withRematch';
import AppLayout from '../../layout/AdminLayout';
import UpdateCourseModal from '../../components/academic-setup-page/UpdateCourseModal';
import CreateNewCourseModal from '../../components/academic-setup-page/CreateNewCourseModal';
const Content = Layout.Content;

interface IAcademicSetup {
  _id: string;
  country: string;
  level: string;
  grade: string;
  subject: any;
  noOfSession: number;
  hourPerSession: number;
  state: object;
}

class UserConfigTable extends Table<IAcademicSetup> { }

class AcademicSetup extends React.Component<any, any> {
  componentDidMount() {
    this.props.fetchCoursesEffect();
    this.props.fetchAllCountriesEffect();
    this.props.fetchLevelsEffect();
    this.props.fetchSubjectsEffect();
    this.props.fetchGradesEffect();
  }

  _deleteCourse = (_id) => {
    this.props.deleteCourseEffect({ _id });
  }

  _openUpdateModal = (data) => {
    this.props.showUpdateModal({ _id: data._id });
    this.props.initUpdateCourseInput({ data });
  }

  _hideUpdateModal = () => {
    this.props.hideUpdateModal();
    this.props.changeUpdateCourseInput({ data: {} });
  }

  _searchCourse = (e) => {
    e.preventDefault();
    this.props.searchEffect({ keyword: this.props.searchInput });
  }

  filterCountry = (value) => {
    if (value) {
      this.props.filterCourse({ country: value });
    } else {
      this.props.filterCourse();
    }
  }

  render() {
    const Column = Table.Column;
    return (
      <AppLayout profileState={this.props.profileState} profileReducers={this.props.profileReducers} languageState={this.props.languageState}>
        <div style={{ padding: '0 30px 30px' }}>
          <Row>
            <Content style={{ fontWeight: "bold", fontSize: 20, margin: '30px 0px 20px 0px' }}>
              {this.props.languageState.WHITE_LABEL_ACADEMIC_SETUP_PAGE_ACADEMIC_SETUP.translated}
          </Content>
          </Row>
          <Row>
            <div className='headline-wrapper'>
              <div className='button-container' style={{ justifyContent: 'flex-start' }}>
                <div>
                  <Button type='primary' className='button-container__button' onClick={this.props.showCreateModal}>{this.props.languageState.WHITE_LABEL_ACADEMIC_SETUP_PAGE_ADD_NEW.translated}</Button>
                  <CreateNewCourseModal
                    visible={this.props.createModalVisible}
                    hideModal={this.props.hideCreateModal}
                    handleChange={this.props.changeCreateCourseInput}
                    handleSubmit={this.props.createCourseEffect}
                    handleCreateMultiple={this.props.createMultipleCourseEffect}
                    createInput={this.props.createInput}
                    lookupInput={this.props.dataLookupState ? this.props.dataLookupState.course : []}
                    levels={this.props.levels}
                    grades={this.props.grades}
                    subjects={this.props.subjects}
                    languageState={this.props.languageState}
                  />
                </div>
                <div className='option-wrapper' style={{ marginBottom: 0 }}>
                  <div className='option-wrapper__other-option-wrapper'>
                    <AutoComplete
                      className='option-wrapper__other-option-wrapper__select-box'
                      dataSource={this.props.countries ? this.props.countries.map((item) => item.name) : []}
                      placeholder="Country"
                      filterOption={(inputValue, option) => (option.props.children as any).toString().toUpperCase().indexOf(inputValue.toUpperCase()) !== -1}
                      onChange={(value) => this.filterCountry(value === 'All countries' ? "" : value)}
                    />
                  </div>
                </div>
              </div>
              <div className='search-form-container' style={{ justifyContent: 'flex-end', marginRight: '20px' }}>
                <Form layout='inline' className='search-form' onSubmit={this._searchCourse}>
                  <Form.Item>
                    <Input placeholder='Search' value={this.props.searchInput} onChange={(e) => this.props.searchInputChange({ keyword: e.target.value })} />
                  </Form.Item>
                </Form>
              </div>
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
                    dataSource={this.props.courses}
                    rowKey={record => record._id}
                  >
                    <Column
                      title={this.props.languageState.WHITE_LABEL_ACADEMIC_SETUP_PAGE_COUNTRY.translated}
                      dataIndex='country'
                      key='country'
                      width={150}
                      sorter={(a: any, b: any) => a.country.localeCompare(b.country)}
                    />
                    <Column
                      title={this.props.languageState.WHITE_LABEL_ACADEMIC_SETUP_PAGE_ACADEMIC_LEVEL.translated}
                      dataIndex='level'
                      key='level'
                      width={150}
                      sorter={(a: any, b: any) => a.level.localeCompare(b.level)}
                      render={(_val, record) => {
                        return <div>{record.level ? record.level.name : ""}</div>
                      }}
                    />
                    <Column
                      title={this.props.languageState.WHITE_LABEL_ACADEMIC_SETUP_PAGE_GRADE.translated}
                      dataIndex='grade'
                      key='grade'
                      width={150}
                      sorter={(a: any, b: any) => a.grade.localeCompare(b.grade)}
                      render={(_val, record) => {
                        return <div>{record.grade ? record.grade.name : ""}</div>
                      }}
                    />
                    <Column
                      title={this.props.languageState.WHITE_LABEL_ACADEMIC_SETUP_PAGE_SUBJECT.translated}
                      dataIndex='subject'
                      key='subject'
                      width={150}
                      sorter={(a: any, b: any) => a.subject.localeCompare(b.subject)}
                      render={(_val, _record) => (
                        <span>{_record.subject ? _record.subject.name : ''}</span>
                      )}
                    />
                    <Column
                      title={this.props.languageState.WHITE_LABEL_ACADEMIC_SETUP_PAGE_NO_OF_LESSON.translated}
                      dataIndex='session'
                      key='session'
                      width={150}
                      sorter={(a: any, b: any) => Number(a.session) - Number(b.session)}
                    />
                    <Column
                      title={this.props.languageState.WHITE_LABEL_ACADEMIC_SETUP_PAGE_HOURS_PER_LESSON.translated}
                      dataIndex='hourPerSession'
                      key='hourPerSession'
                      width={150}
                      sorter={(a: any, b: any) => Number(a.hourPerSession) - Number(b.hourPerSession)}
                    />
                    <Column
                      title={this.props.languageState.WHITE_LABEL_ACADEMIC_SETUP_PAGE_ACTION.translated}
                      key='action'
                      width={100}
                      render={(_record) => (
                        <div style={{ textAlign: 'center' }}>
                          {/* Update button */}
                          <a style={{ margin: '0px 10px' }} onClick={() => this._openUpdateModal(_record)}><Icon type='edit' /></a>
                          <UpdateCourseModal
                            visible={this.props.updateModalVisible === _record._id}
                            hideModal={this._hideUpdateModal}
                            handleChange={this.props.changeUpdateCourseInput}
                            handleSubmit={this.props.updateCourseEffect}
                            handleCreateMultiple={this.props.createMultipleCourseEffect}
                            updateInput={this.props.updateInput}
                            initialInput={_record}
                            lookupInput={this.props.dataLookupState ? this.props.dataLookupState.course : []}
                            levels={this.props.levels}
                            grades={this.props.grades}
                            subjects={this.props.subjects}
                            languageState={this.props.languageState}
                          />

                          {/* Delete button */}
                          <Popconfirm
                            placement='top'
                            title={this.props.languageState.WHITE_LABEL_ACADEMIC_SETUP_PAGE_DELETE_CONFIRM.translated}
                            onConfirm={() => this._deleteCourse(_record._id)}
                            okText='Yes'
                            cancelText='No'
                          >
                            <a style={{ margin: '0px 10px' }}><Icon type='delete' /></a>
                          </Popconfirm>
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
    ...rootState.coursePageModel,
    profileState: rootState.profileModel,
    dataLookupState: rootState.dataLookupModel,
    languageState: rootState.languageModel,
  };
};

const mapDispatch = (rootReducer: any) => {
  return {
    ...rootReducer.coursePageModel,
    profileReducers: rootReducer.profileModel,
    dataLookup: rootReducer.dataLookupModel
  };
};

export default withRematch(initStore, mapState, mapDispatch)(AcademicSetup);
