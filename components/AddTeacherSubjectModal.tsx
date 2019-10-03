import * as React from 'react';
import { Form, Modal, Select, Button, Table, AutoComplete } from 'antd';
import CheckBoxInput from './CheckboxInput';

const Option = Select.Option;

class AddTeacherSubjectModal extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
    };
  }

  createTeacherSubjects = () => {
    var promiseArray = this.props.createInputs.map((val) => {
      return this.props.createTeacherSubject(val._id);
    });
    Promise.all(promiseArray).then(() => {
      this.props.hideModal();
    });
  }

  render() {
    const columnsTeacherSubject = [
      {
        title: ``,
        dataIndex: '',
        key: 'create',
        width: '5%',
        render: (value, _record, _index) => {
          return (<CheckBoxInput value={value} handleCreateInputs={this.props.handleCreateInputs} createInputs={this.props.createInputs} />);
        }
      },
      {
        title: `Syllabus Country`,
        dataIndex: 'country',
        key: 'country',
        width: '15%',
        render: (value, _record, _index) => (
          <span>{value === 'trial' ? "-" : value}</span>
        ),
        sorter: (a: any, b: any) => a.country.localeCompare(b.country)
      },
      {
        title: `Academic Level`,
        dataIndex: 'level',
        key: 'academicLevel',
        width: '15%',
        render: (value, _record, _index) => (
          <span>{value.name === 'trial' ? "-" : value.name}</span>
        ),
        sorter: (a: any, b: any) => a.level.localeCompare(b.level)
      },
      {
        title: `Grades`,
        dataIndex: 'grade',
        key: 'grade',
        width: '15%',
        render: (value, _record, _index) => (
          <span>{value.name === 'trial' ? "-" : value.name}</span>
        ),
        sorter: (a: any, b: any) => a.grade.localeCompare(b.grade)
      },
      {
        title: `Subject`,
        dataIndex: 'subject',
        key: 'subject',
        width: '15%',
        render: (value, _record, _index) => (
          <span>{value.name === 'trial' ? "Trial" : value.name}</span>
        ),
        sorter: (a: any, b: any) => a.subject.localeCompare(b.subject)
      },
      {
        title: `Lessons`,
        dataIndex: 'session',
        key: 'session',
        width: '15%',
        render: (value, _record, _index) => (
          <span>{value}</span>
        ),
        sorter: (a: any, b: any) => a.session - b.session
      },
      {
        title: `Hours Per Lesson`,
        dataIndex: 'hourPerSession',
        key: 'hourPerSession',
        width: '20%',
        render: (value, _record, _index) => (
          <span>{value}</span>
        ),
        sorter: (a: any, b: any) => a.hourPerSession - b.hourPerSession
      }
    ];

    return (
      <Modal
        width={1200}
        title={this.props.languageState.ADD_TEACHER_SUBJECT_MODAL_PAGE_MODAL_TITLE.translated}
        visible={this.props.visible}
        onOk={this.createTeacherSubjects}
        onCancel={this.props.hideModal}
        okText={this.props.languageState.ADD_TEACHER_SUBJECT_MODAL_PAGE_OK_TEXT.translated}
        footer={null}
        cancelButtonProps={{ style: { display: 'none' } }}
      >
        <div>
          <Form>
            <h3>Find Course:</h3>
            <Form.Item style={{ width: '20%', display: 'inline-block', padding: '0px 10px' }}>
              <AutoComplete
                dataSource={this.props.lookupInput.country ? this.props.lookupInput.country.map((item) => item.name).filter((item) => item !== 'All countries') : []}
                placeholder={this.props.languageState.ADD_TEACHER_SUBJECT_MODAL_PAGE_COUNTRY_PLACEHOLDER.translated}
                filterOption={(inputValue, option) => (option as any).props.children.toString().toUpperCase().indexOf(inputValue.toUpperCase()) !== -1}
                onChange={(value) => this.props.handleSearch({ data: { country: value } })}
              />
            </Form.Item>
            <Form.Item style={{ width: '20%', display: 'inline-block', padding: '0px 10px' }}>
              <Select placeholder={this.props.languageState.ADD_TEACHER_SUBJECT_MODAL_PAGE_SELECT_LEVEL_PLACEHOLDER.translated} style={{ minWidth: '150' }} onChange={(value) => this.props.handleSearch({ data: { level: value, grade: '' } })}>
                <Option value={""} key={"nokey"}>{this.props.languageState.ADD_TEACHER_SUBJECT_MODAL_PAGE_SELECT_ALL_LEVELS.translated}</Option>
                {
                  this.props.levels.map((item) => item._id ? (<Option value={item._id} key={item._id}>{item.name}</Option>) : "")
                }
              </Select>
            </Form.Item>
            <Form.Item style={{ width: '20%', display: 'inline-block', padding: '0px 10px' }}>
              <Select placeholder={this.props.languageState.ADD_TEACHER_SUBJECT_MODAL_PAGE_SELECT_GRADE_PLACEHOLDER.translated} value={this.props.searchInput.grade || undefined} style={{ minWidth: '150px' }} onChange={(value) => this.props.handleSearch({ data: { grade: value } })}>
                {
                  this.props.searchInput.level ?
                    this.props.grades.filter((item) => item.level._id === this.props.searchInput.level).map((item) => item._id ?
                      (<Option value={item._id} key={item._id}>{item.name}</Option>) : "") : <Option value={undefined} key="0" disabled={true}>You have to select level first.</Option>
                }
              </Select>
            </Form.Item>
            <Form.Item style={{ width: '20%', display: 'inline-block', padding: '0px 10px' }}>
              <Select
                style={{ minWidth: '150px' }}
                placeholder={this.props.languageState.ADD_TEACHER_SUBJECT_MODAL_PAGE_SELECT_SUBJECT_PLACEHOLDER.translated}
                onChange={(value) => this.props.handleSearch({ data: { subject: value } })}
              >
                <Option value={""} key={"nokey"}>{this.props.languageState.ADD_TEACHER_SUBJECT_MODAL_PAGE_SELECT_ALL_SUBJECTS.translated}</Option>
                {
                  this.props.subjects.map((item) => item._id ? (<Option value={item._id} key={item._id}>{item.name}</Option>) : "")
                }
              </Select>
            </Form.Item>
            <Form.Item style={{ width: '20%', display: 'inline-block', padding: '0px 10px' }}>
              <Button type="primary" onClick={this.props.searchCourse}>{this.props.languageState.ADD_TEACHER_SUBJECT_MODAL_PAGE_SEARCH_BUTTON_TEXT.translated}</Button>
            </Form.Item>
          </Form>
          <Table
            rowKey={(record) => record._id}
            size='middle'
            columns={columnsTeacherSubject}
            dataSource={this.props.coursesLookup}
            locale={{ emptyText: this.props.languageState.ADD_TEACHER_SUBJECT_MODAL_PAGE_NO_TEACHING_SUBJECT.translated }}
          />
          <div style={{position: 'absolute', bottom: '35px', left: '35px'}}>
            <Button type="primary" onClick={this.createTeacherSubjects}>{this.props.languageState.ADD_TEACHER_SUBJECT_MODAL_PAGE_CREATE_BUTTON_TEXT.translated}</Button>
          </div>
        </div>
      </Modal>
    );
  }
}

export default Form.create()(AddTeacherSubjectModal);
