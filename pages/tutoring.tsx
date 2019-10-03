import * as React from 'react';
import { Layout, Row, Col, Button, Icon, Table, Popconfirm, Tabs, Input, DatePicker, Form, message, Pagination, Select, AutoComplete } from 'antd';
import moment from 'moment';
import './tutor-preference.css';
import initStore from '../rematch/store';
import withRematch from '../rematch/withRematch';
import { getUsersService, getCourseService, getTuitionsService, getMetadataService } from '../service-proxies';
import AddTeacherSubjectModal from '../components/AddTeacherSubjectModal';
import AddGroupTuitionModal from '../components/AddGroupTuitionModal';
import EditPeriodModal from '../components/EditPeriodModal';
import UserLayout from '../layout/UserLayout';
import PriceInput from '../components/PriceInput';
import '../pages/styles.css';
import './login-student/informationTutor.css';

import Calendar from 'react-big-calendar';
import { extendMoment } from 'moment-range';

Calendar.setLocalizer(Calendar.momentLocalizer(moment));
const extendedMoment = extendMoment(moment);

const TabPane = Tabs.TabPane;
const Option = Select.Option;

const DEFAULT = {
  PAGE_SIZE: 5
}

class TutoringPage extends React.Component<any, any> {
  static async getInitialProps(props: any) {
    let tutorInfo: any = {};
    const profilePageState = props.store.getState().profileModel;
    if (!props.req) {
      const usersService = getUsersService(props.store.getState().profileModel.token);
      // console.log('props', props.query.profile._id);
      tutorInfo = await usersService.findTutorById(profilePageState._id);
      const courses = await usersService.findTutorCoursesById(
        profilePageState._id
      );
      props.store.dispatch.editProfilePageModel.fetchCoursesSuccess({ result: courses });

      // Fetch Group Tuitions
      const groupTuitions = await getTuitionsService().getGroupTuitionByTutorId(profilePageState._id);
      props.store.dispatch.tutoringPageModel.fetchGroupTuitionsSuccess({ results: groupTuitions });

      const coursesService = getCourseService();
      const coursesAvailableLookup = await coursesService.getAllCourses();
      props.store.dispatch.editProfilePageModel.fetchCoursesLookupSuccess({ result: coursesAvailableLookup });

    } else {
      tutorInfo = props.query.tutorInfo;
      props.store.dispatch.editProfilePageModel.fetchCoursesSuccess({ result: props.query.coursesByTutorId });
      props.store.dispatch.editProfilePageModel.fetchCoursesLookupSuccess({ result: props.query.coursesAvailable });
      // Fetch Group Tuitions
      const groupTuitions = await getTuitionsService().getGroupTuitionByTutorId(profilePageState._id);
      props.store.dispatch.tutoringPageModel.fetchGroupTuitionsSuccess({ results: groupTuitions });
    }

    const subjects = await getMetadataService().getAllSubjects();
    const levels = await getMetadataService().getAllLevels();
    const grades = await getMetadataService().getAllGrades();

    return {
      tutorInfo,
      subjects: subjects.data,
      levels: levels.data,
      grades: grades.data,
    }
  }

  state = {
    currentPage: 1
  }

  searchCourse = async () => {
    const filteredCourses = await getCourseService().filterCourse(this.props.searchInput);
    this.props.fetchCoursesLookupSuccess({ result: filteredCourses });
  }

  createTeacherSubject = async (courseId, _hourlyRate) => {
    const input = {
      course: courseId,
      hourlyRate: 0,
      tutor: this.props.profileState._id
    };
    const result = await getUsersService().createCourseForTutor(input);
    this.props.createCourseForTutorSuccess(result);
    this.props.toggleCreateCourseModal(false);
  }

  updateTeacherSubject = async (_id, hourlyRate) => {
    const input = {
      _id,
      hourlyRate
    };
    const result = await getUsersService().updateCourseForTutor(input);
    this.props.updateCourseForTutorSuccess(result);
  }

  updateManyTeacherSubject = async () => {
    const updateArrays = this.props.hourlyRateInputs.filter((val) => val.value > 0);
    var promiseArray = updateArrays.map((val) => {
      const exchangeRate = this.props.profileState ? this.props.profileState.currency && this.props.profileState.currency.exchangeRate ? this.props.profileState.currency.exchangeRate : 1 : 1;
      return this.updateTeacherSubject(val._id, Number(val.value * exchangeRate));
    });
    Promise.all(promiseArray).then(() => {
      this.props.clearhourlyRateInputs();
    });
  }

  openCreateSubjectModal = () => {
    this.props.toggleCreateCourseModal(true);
  }

  hideCreateSubjectModal = () => {
    this.props.toggleCreateCourseModal(false);
  }

  openCreateGroupModal = () => {
    this.props.toggleCreateGroupModal(true);
  }

  hideCreateGroupModal = () => {
    this.props.toggleCreateGroupModal(false);
  }

  inputDateInUserTimezone = (date: any = new Date().toString()) => {
    const browserTimezone = - new Date().getTimezoneOffset() / 60;
    const userTimezone = this.props.profileState.timeZone && this.props.profileState.timeZone.offset ? this.props.profileState.timeZone.offset : browserTimezone;
    const deltaTimezone = userTimezone - browserTimezone;

    return new Date(new Date(date).getTime() + deltaTimezone * 60 * 60 * 1000);
  }

  changeEndReg = (_id, data) => {
    var fieldName = 'endReg' + _id;
    var startRegFieldName = 'startReg' + _id;
    this.props.form.setFieldsValue({ fieldName: data })
    this.props.form.validateFields([fieldName, startRegFieldName], (err, _val) => {
      if (err) {
        console.log(err);
      } else {
        // DO NOTHING
      }
    });
    this.props.changeUpdateGroupTuitionInput({ data: { _id: _id, course: { endReg: data } } });
  }

  changeStartReg = (_id, data) => {
    var fieldName = 'startReg' + _id;
    var endRegFieldName = 'endReg' + _id;
    this.props.form.setFieldsValue({ fieldName: data });
    this.props.form.validateFields([fieldName, endRegFieldName], (err, _val) => {
      if (err) {
        console.log(err);
      } else {
        // DO NOTHING
      }
    })
    this.props.changeUpdateGroupTuitionInput({ data: { _id: _id, course: { startReg: data } } });
  }

  changeStatus = (_id, value) => {
    if (value === "Active") {
      this.props.changeUpdateGroupTuitionInput({ data: { _id: _id, isActive: true } });
    } else if (value === 'Inactive') {
      this.props.changeUpdateGroupTuitionInput({ data: { _id: _id, isActive: false } });
    } else if (value === 'Pending') {
      this.props.changeUpdateGroupTuitionInput({ data: { _id: _id, isActive: true } });
    }
  }

  updateGroupTuition = async (_id) => {
    this.props.form.validateFields(['country' + _id, 'subject' + _id, 'level' + _id, , 'grade' + _id, 'hourlyRate' + _id, 'session' + _id, 'hourPerSession' + _id, 'minClassSize' + _id, 'maxClassSize' + _id, 'endReg' + _id], async (err, _val) => {
      if (err) {
        console.log(err);
      } else {
        const inputs = this.props.groupTuitions.filter(value => value._id === _id);
        if (inputs.length) {
          if (inputs[0].period.length === Number(inputs[0].course.session)) {
            // TODO: Check session length
            var checkSessionlength = true;
            inputs[0].period.forEach((val) => {
              if (new Date(val.end).getTime() - new Date(val.start).getTime() !== inputs[0].course.hourPerSession * 60 * 60 * 1000) {
                checkSessionlength = false;
              }
            })
            if (checkSessionlength) {
              await this.props.updateGroupTuition(inputs[0]);
            } else {
              message.error(this.props.languageState.TUTORING_PAGE_UPDATE_VALIDATE_1.translated + " " + inputs[0].course.hourPerSession + ' hour(s).', 2);
            }
          } else {
            message.error(this.props.languageState.TUTORING_PAGE_UPDATE_VALIDATE_3.translated  + ' ' + inputs[0].course.session + ' ' + this.props.languageState.TUTORING_PAGE_UPDATE_VALIDATE_2.translated, 2);
          }
        } else {
          message.error(this.props.languageState.TUTORING_PAGE_WENT_WRONG.translated);
        }
      }
    });
  }

  changePeriods = () => {
    if (this.props.editPeriodData) {
      if (this.props.editPeriodData.period) {
        if (this.props.editPeriodData.period.length && this.props.editPeriodData.period.length === Number(this.props.editPeriodData.session)) {
          this.props.changePeriods({
            data: {
              _id: this.props.editPeriodData._id,
              period: this.props.editPeriodData.period
            }
          })
          this.props.hideEditPeriodModal();
        } else {
          if (!this.props.editPeriodData.period.length && this.props.editPeriodData.session) {
            message.error(this.props.languageState.TUTORING_PAGE_CHANGE_VALIDATE_1.translated + " " + this.props.editPeriodData.session + " " + this.props.languageState.TUTORING_PAGE_CHANGE_VALIDATE_2.translated);
          } else {
            message.error(this.props.languageState.TUTORING_PAGE_WENT_WRONG.translated);
          }
        }
      } else {
        message.error(this.props.languageState.TUTORING_PAGE_WENT_WRONG.translated);
      }
    } else {
      message.error(this.props.languageState.TUTORING_PAGE_WENT_WRONG.translated);
    }
  }

  handlePagination = (page, _pageSize) => {
    this.setState({
      currentPage: page
    })
  }

  changeLevel = (_id, value) => {
    const fieldName = 'grade' + _id;
    const obj = {};
    obj[fieldName] = ''
    this.props.form.setFieldsValue(obj);
    this.props.changeUpdateGroupTuitionInput({ data: { _id: _id, course: { level: value, grade: "" } } })
  }

  render() {

    const columnsTeacherSubject = [
      {
        title: this.props.languageState.TUTORING_PAGE_SUBJECT.translated,
        dataIndex: 'course.subject',
        key: 'subject',
        width: '13%',
        render: (_value, _record, _index) => (
          <span style={{ width: '100%' }}>
            {_value === 'trial' ? "Trial" : _value}
          </span>
        ),
        sorter: (a: any, b: any) => {
          if (a.course.subject !== b.course.subject) {
            return a.course.subject.localeCompare(b.course.subject);
          } else {
            if (a.course.level !== b.course.level) {
              return a.course.level.localeCompare(b.course.level);
            } else {
              if (a.course.grade !== b.course.grade) {
                return a.course.grade.localeCompare(b.course.grade);
              } else {
                if (a.course.country !== b.course.country) {
                  return a.course.country.localeCompare(b.course.country);
                } else {
                  if (a.course.session !== b.course.session) {
                    return a.course.session - b.course.session;
                  } else {
                    if (a.course.hourPerSession !== b.course.hourPerSession) {
                      return a.course.hourPerSession - b.course.hourPerSession;
                    } else {
                      return a.hourlyRate - b.hourlyRate;
                    }
                  }
                }
              }
            }
          }
        }
      },
      {
        title: this.props.languageState.TUTORING_PAGE_ACADEMIC_LEVEL.translated,
        dataIndex: 'course.level',
        key: 'academicLevel',
        width: '15%',
        render: (_value, _record, _index) => (
          <span style={{ width: '100%' }}>
            {_value === 'trial' ? "-" : _value}
          </span>
        ),
        sorter: (a: any, b: any) => {
          if (a.course.level !== b.course.level) {
            return a.course.level.localeCompare(b.course.level)
          } else {
            if (a.course.subject !== b.course.subject) {
              return a.course.subject.localeCompare(b.course.subject);
            } else {
              if (a.course.grade !== b.course.grade) {
                return a.course.grade.localeCompare(b.course.grade);
              } else {
                if (a.course.country !== b.course.country) {
                  return a.course.country.localeCompare(b.course.country);
                } else {
                  if (a.course.session !== b.course.session) {
                    return a.course.session - b.course.session;
                  } else {
                    if (a.course.hourPerSession !== b.course.hourPerSession) {
                      return a.course.hourPerSession - b.course.hourPerSession;
                    } else {
                      return a.hourlyRate - b.hourlyRate;
                    }
                  }
                }
              }
            }
          }
        }
      },
      {
        title: this.props.languageState.TUTORING_PAGE_GRADE.translated,
        dataIndex: 'course.grade',
        key: 'grade',
        width: '13%',
        render: (_value, _record, _index) => (
          <span style={{ width: '100%' }}>
            {_value === 'trial' ? "-" : _value}
          </span>
        ),
        sorter: (a: any, b: any) => {
          if (a.course.grade !== b.course.grade) {
            return a.course.grade.localeCompare(b.course.grade)
          } else {
            if (a.course.subject !== b.course.subject) {
              return a.course.subject.localeCompare(b.course.subject);
            } else {
              if (a.course.level !== b.course.level) {
                return a.course.level.localeCompare(b.course.level);
              } else {
                if (a.course.country !== b.course.country) {
                  return a.course.country.localeCompare(b.course.country);
                } else {
                  if (a.course.session !== b.course.session) {
                    return a.course.session - b.course.session;
                  } else {
                    if (a.course.hourPerSession !== b.course.hourPerSession) {
                      return a.course.hourPerSession - b.course.hourPerSession;
                    } else {
                      return a.hourlyRate - b.hourlyRate;
                    }
                  }
                }
              }
            }
          }
        }
      },
      {
        title: this.props.languageState.TUTORING_PAGE_SYLLABUS_COUNTRY.translated,
        dataIndex: 'course.country',
        key: 'country',
        width: '15%',
        render: (_value, _record, _index) => (
          <span style={{ width: '100%' }}>
            {_value === 'trial' ? "-" : _value}
          </span>
        ),
        sorter: (a: any, b: any) => {
          if (a.course.country !== b.course.country) {
            return a.course.country.localeCompare(b.course.country)
          } else {
            if (a.course.subject !== b.course.subject) {
              return a.course.subject.localeCompare(b.course.subject);
            } else {
              if (a.course.level !== b.course.level) {
                return a.course.level.localeCompare(b.course.level);
              } else {
                if (a.course.grade !== b.course.grade) {
                  return a.course.grade.localeCompare(b.course.grade);
                } else {
                  if (a.course.session !== b.course.session) {
                    return a.course.session - b.course.session;
                  } else {
                    if (a.course.hourPerSession !== b.course.hourPerSession) {
                      return a.course.hourPerSession - b.course.hourPerSession;
                    } else {
                      return a.hourlyRate - b.hourlyRate;
                    }
                  }
                }
              }
            }
          }
        }
      },
      {
        title: this.props.languageState.TUTORING_PAGE_LESSONS.translated,
        dataIndex: 'course.session',
        key: 'session',
        width: '10%',
        render: (value, _record, _index) => (
          <span>{value}</span>
        ),
        sorter: (a: any, b: any) => {
          if (a.course.session !== b.course.session) {
            return a.course.session - b.course.session
          } else {
            if (a.course.subject !== b.course.subject) {
              return a.course.subject.localeCompare(b.course.subject);
            } else {
              if (a.course.level !== b.course.level) {
                return a.course.level.localeCompare(b.course.level);
              } else {
                if (a.course.grade !== b.course.grade) {
                  return a.course.grade.localeCompare(b.course.grade);
                } else {
                  if (a.course.country !== b.course.country) {
                    return a.course.country.localeCompare(b.course.country);
                  } else {
                    if (a.course.hourPerSession !== b.course.hourPerSession) {
                      return a.course.hourPerSession - b.course.hourPerSession;
                    } else {
                      return a.hourlyRate - b.hourlyRate;
                    }
                  }
                }
              }
            }
          }
        }
      },
      {
        title: this.props.languageState.TUTORING_PAGE_HOURS_PER_LESSON.translated,
        dataIndex: 'course.hourPerSession',
        key: 'hourPerSession',
        width: '10%',
        render: (value, _record, _index) => (
          <span>{value}</span>
        ),
        sorter: (a: any, b: any) => {
          if (a.course.hourPerSession !== b.course.hourPerSession) {
            return a.course.hourPerSession - b.course.hourPerSession
          } else {
            if (a.course.subject !== b.course.subject) {
              return a.course.subject.localeCompare(b.course.subject);
            } else {
              if (a.course.level !== b.course.level) {
                return a.course.level.localeCompare(b.course.level);
              } else {
                if (a.course.grade !== b.course.grade) {
                  return a.course.grade.localeCompare(b.course.grade);
                } else {
                  if (a.course.country !== b.course.country) {
                    return a.course.country.localeCompare(b.course.country);
                  } else {
                    if (a.course.session !== b.course.session) {
                      return a.course.session - b.course.session;
                    } else {
                      return a.hourlyRate - b.hourlyRate;
                    }
                  }
                }
              }
            }
          }
        }
      },
      {
        title: this.props.languageState.TUTORING_PAGE_HOURLY_RATE.translated,
        dataIndex: '',
        key: 'hourlyRate',
        width: '20%',
        render: (value, _record, _index) => {
          if (value.course && value.course.subject === 'trial') {
            return (
              <div style={{ display: 'flex', justifyContent: "space-between", alignItems: 'center' }}>
                <Input value={value.hourlyRate} disabled={true} />
                <span style={{ minWidth: '50px', marginLeft: '10px' }}>{this.props.profileState ? (this.props.profileState.currency && this.props.profileState.currency.code) ? this.props.profileState.currency.code : "SGD" : "SGD"}</span>
              </div>
            );
          } else {
            return (
              <div style={{ display: 'flex', justifyContent: "space-between", alignItems: 'center' }}>
                <PriceInput value={value} exchangeRate={this.props.profileState ? this.props.profileState.currency ? this.props.profileState.currency.exchangeRate : 1 : 1} handleHourlyRateChange={this.props.handleChangeHourlyRateInput} hourlyRateInputs={this.props.hourlyRateInputs} />
                <span style={{ minWidth: '50px', marginLeft: '10px' }}>{this.props.profileState ? (this.props.profileState.currency && this.props.profileState.currency.code) ? this.props.profileState.currency.code : "SGD" : "SGD"}</span>
              </div>
            );
          }
        },
        sorter: (a: any, b: any) => {
          if (a.hourlyRate !== b.hourlyRate) {
            return a.hourlyRate - b.hourlyRate
          } else {
            if (a.course.subject !== b.course.subject) {
              return a.course.subject.localeCompare(b.course.subject);
            } else {
              if (a.course.level !== b.course.level) {
                return a.course.level.localeCompare(b.course.level);
              } else {
                if (a.course.grade !== b.course.grade) {
                  return a.course.grade.localeCompare(b.course.grade);
                } else {
                  if (a.course.country !== b.course.country) {
                    return a.course.country.localeCompare(b.course.country);
                  } else {
                    if (a.course.session !== b.course.session) {
                      return a.course.session - b.course.session;
                    } else {
                      return a.course.hourPerSession - b.course.hourPerSession;
                    }
                  }
                }
              }
            }
          }
        }
      },
      {
        title: ``,
        dataIndex: '_id',
        key: 'delete',
        width: '5%',
        render: (_value, _record, _index) => (
          <Popconfirm
            placement='top'
            title={this.props.languageState.TUTORING_PAGE_DELETE_CONFIRM.translated}
            onConfirm={() => this.props.deleteTutoringTeacherSubject(_value)}
            okText='Yes'
            cancelText='No'
          >
            <Button className='dynamic-delete-button'><Icon type='delete'></Icon></Button>
          </Popconfirm>
        )
      },
    ];

    const columns = [
      {
        title: this.props.languageState.TUTORING_PAGE_DATE.translated,
        dataIndex: 'date',
        key: 'date',
        render: (_text, record, _index) => extendedMoment(record.start).format('DD MMM YYYY')
      },
      {
        title: this.props.languageState.TUTORING_PAGE_TIME.translated,
        dataIndex: 'time',
        key: 'time',
        render: (_text, record, _index) => `${extendedMoment(record.start).format('HH:mm')} - ${extendedMoment(record.end).format('HH:mm')}`
      }
    ];

    const { getFieldDecorator } = this.props.form;

    const exchangeRate = this.props.profileState ? this.props.profileState.currency ? this.props.profileState.currency.exchangeRate : 1 : 1;
    const currency = this.props.profileState ? this.props.profileState.currency ? this.props.profileState.currency.code : 'SGD' : 'SGD';

    return (
      <UserLayout profileState={this.props.profileState} profileReducers={this.props.profileReducers} editProfilePageState={this.props.profileState} languageState={this.props.languageState}>
        <Layout style={{ background: '#fff', padding: '0px 30px 20px 30px' }}>
          <Row style={{ marginTop: '40px' }}>
            <Row>
              <Col span={12}>
                <h1 id='teaching-experience'>{this.props.languageState.TUTORING_PAGE_SUBJECTS.translated}</h1>
              </Col>
              <Col span={10}>
              </Col>
            </Row>
            <hr />
            <Tabs defaultActiveKey="1" animated={false}>
              <TabPane tab={this.props.languageState.TUTORING_PAGE_INDIVIDUAL.translated} key="1">
                <Layout style={{ padding: 20, marginTop: 0 }} className='white-theme' id="teaching-subject">
                  <div style={{ position: 'absolute', right: '0px', top: '2px' }}>
                    <Button type='primary' onClick={this.openCreateSubjectModal} style={{ marginRight: 20, float: 'right' }}>
                      <Icon type='plus' /> Add subject
                    </Button>
                  </div>
                  <Table
                    rowKey={(record) => record._id}
                    size='middle'
                    columns={columnsTeacherSubject}
                    dataSource={this.props.tutorCourses.filter(val => !val.groupTuition)}
                    locale={{ emptyText: this.props.languageState.TUTORING_PAGE_INDIVIDUAL_EMPTY.translated }}
                    pagination={{ position: 'bottom', pageSize: 10 }}
                  />

                  <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '10px 10px' }}>
                    <Button type="primary" icon="save" disabled={!this.props.hourlyRateInputs.length} onClick={() => this.updateManyTeacherSubject()}>Save</Button>
                  </div>


                  <AddTeacherSubjectModal
                    visible={this.props.createSubjectModal}
                    lookupInput={this.props.dataLookupState ? this.props.dataLookupState.course : []}
                    handleSearch={this.props.handleSearchCourseInput}
                    searchCourse={this.searchCourse}
                    createInputs={this.props.createSubjectInputs}
                    coursesLookup={this.props.coursesLookup}
                    hideModal={() => {
                      this.props.clearCreateInputs();
                      this.props.toggleCreateCourseModal(false);
                    }}
                    hourlyRateInputs={this.props.hourlyRateInputs}
                    handleCreateInputs={this.props.handleCreateInputs}
                    createTeacherSubject={this.createTeacherSubject}
                    searchInput={this.props.searchInput}
                    clearHourlyRateInputs={this.props.clearhourlyRateInputs}
                    levels={this.props.levels}
                    grades={this.props.grades}
                    subjects={this.props.subjects}
                    languageState={this.props.languageState}
                  />
                </Layout>
              </TabPane>
              <TabPane tab={this.props.languageState.TUTORING_PAGE_GROUP.translated} key="2">
                <Layout style={{ padding: 20, marginTop: 0 }} className='white-theme' id="teaching-subject">
                  <div style={{ position: 'absolute', right: '0px', top: '2px' }}>
                    <Button type='primary' onClick={this.openCreateGroupModal} style={{ float: "right" }} >
                      <Icon type='plus' /> Add group tuition
                    </Button>
                  </div>
                  {this.props.groupTuitions && this.props.groupTuitions.length ? this.props.groupTuitions.slice((this.state.currentPage - 1) * DEFAULT.PAGE_SIZE, this.state.currentPage * DEFAULT.PAGE_SIZE).filter(value => !!value.course).map((val, index) => (
                    <Row style={{ margin: '20px 0px' }}>
                      <Col xs={2} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', paddingTop: '5px' }}>
                        <h3>{index + (this.state.currentPage - 1) * DEFAULT.PAGE_SIZE + 1}</h3>
                      </Col>
                      <Col xs={22}>
                        <Row>
                          <Col xs={24} sm={12} md={8} lg={5}>
                            <h4 style={{ textAlign: 'left', padding: '0px 10px' }}>Country</h4>
                            <Form.Item key={index} style={{ width: '100%', display: 'block', padding: '0px 10px' }}>
                              {getFieldDecorator('country' + val._id, {
                                initialValue: val.course.country,
                                rules: [
                                  { required: true, message: 'Please input country!', whitespace: true }
                                ],
                                validateTrigger: 'onBlur',
                              })(
                                <AutoComplete
                                  style={{ width: '100%' }}
                                  placeholder="Country"
                                  dataSource={this.props.dataLookupState.course.country ? this.props.dataLookupState.course.country.map((item) => item.name) : []}
                                  filterOption={(inputValue, option) => (option.props.children as any).toString().toUpperCase().indexOf(inputValue.toUpperCase()) !== -1}
                                  onChange={(value) => this.props.changeUpdateGroupTuitionInput({ data: { _id: val._id, course: { country: value } } })}
                                  disabled={!!val.students.length}
                                />
                              )}
                            </Form.Item>
                          </Col>
                          <Col xs={24} sm={12} md={8} lg={5}>
                            <h4 style={{ textAlign: 'left', padding: '0px 10px' }}>Subject</h4>
                            <Form.Item key={index} style={{ width: '100%', display: 'block', padding: '0px 10px' }}>
                              {getFieldDecorator('subject' + val._id, {
                                initialValue: val.course.subject,
                                rules: [
                                  { required: true, message: 'Please input subject!', whitespace: true }
                                ],
                                validateTrigger: 'onBlur',
                              })(
                                <Select
                                  style={{ width: '100%' }}
                                  placeholder="Subject"
                                  onChange={(value) => this.props.changeUpdateGroupTuitionInput({ data: { _id: val._id, course: { subject: value } } })}
                                  disabled={!!val.students.length}
                                >
                                  {
                                    this.props.subjects.filter(val => val.name !== 'trial').map((item) => (<Option value={item.name} key={item._id}>{item.name}</Option>))
                                  }
                                </Select>
                              )}
                            </Form.Item>
                          </Col>
                          <Col xs={24} sm={12} md={8} lg={5}>
                            <h4 style={{ textAlign: 'left', padding: '0px 10px' }}>Level</h4>
                            <Form.Item style={{ width: '100%', display: 'block', padding: '0px 10px' }}>
                              {getFieldDecorator('level' + val._id, {
                                initialValue: val.course.level,
                                rules: [
                                  { required: true, message: 'Please input level!', whitespace: true }
                                ],
                                validateTrigger: 'onBlur',
                              })(
                                <Select
                                  style={{ width: '100%' }}
                                  placeholder="Level"
                                  onChange={(value) => this.changeLevel(val._id, value)}
                                  disabled={!!val.students.length}
                                >
                                  {
                                    this.props.levels.filter(val => val.name !== 'trial').map((item) => item._id ? (<Option value={item.name} key={item._id}>{item.name}</Option>) : "")
                                  }
                                </Select>
                              )}
                            </Form.Item>
                          </Col>
                          <Col xs={24} sm={12} md={8} lg={5}>
                            <h4 style={{ textAlign: 'left', padding: '0px 10px' }}>Grade</h4>
                            <Form.Item style={{ width: '100%', display: 'block', padding: '0px 10px' }}>
                              {getFieldDecorator('grade' + val._id, {
                                initialValue: val.course.grade || "",
                                rules: [
                                  { required: true, message: 'Please input grade!', whitespace: true }
                                ],
                                validateTrigger: 'onBlur',
                              })(
                                <Select
                                  style={{ width: '100%' }}
                                  placeholder="Grade"
                                  onChange={(value) => this.props.changeUpdateGroupTuitionInput({ data: { _id: val._id, course: { grade: value } } })}
                                  disabled={!!val.students.length}
                                >
                                  {
                                    val.course.level ?
                                      this.props.grades.filter((item) => item.level.name === val.course.level).map((item) => item._id ?
                                        (<Option value={item.name} key={item._id}>{item.name}</Option>) : "") : <Option value="" key="0" disabled={true}>You have to select level first.</Option>
                                  }
                                </Select>
                              )}
                            </Form.Item>
                          </Col>
                          <Col xs={24} sm={12} md={8} lg={4}>
                            <h4 style={{ textAlign: 'left', padding: '0px 10px' }}>Hourly rate</h4>
                            <div style={{ display: 'flex' }}>
                              <Form.Item style={{ width: 'auto', display: 'block', padding: '0px 10px', marginBottom: '0px' }}>
                                {getFieldDecorator('hourlyRate' + val._id, {
                                  initialValue: Number(val.course.hourlyRate / exchangeRate).toFixed(2) || 0,
                                  rules: [
                                    {
                                      validator: (_rule, value, callback) => {
                                        if (value && value > 1) {
                                          if (value <= 200 / exchangeRate) {
                                            callback();
                                          } else {
                                            callback('Hourly rate cannot more than ' + (200 / exchangeRate).toFixed(2) + ' ' + currency)
                                          }
                                        } else {
                                          callback("Min. value is 1");
                                        }
                                      }
                                    }
                                  ],
                                  validateTrigger: 'onBlur',
                                })(
                                  <Input
                                    style={{ display: 'inline-block' }}
                                    type="number"
                                    placeholder="Hourly Rate"
                                    onChange={(e) => this.props.changeUpdateGroupTuitionInput({ data: { _id: val._id, course: { hourlyRate: Number(e.target.value) * exchangeRate } } })}
                                    disabled={!!val.students.length}
                                  />
                                )}
                              </Form.Item>
                              <span style={{ display: 'flex', alignItems: 'center' }}>{this.props.profileState ? (this.props.profileState.currency && this.props.profileState.currency.code) ? this.props.profileState.currency.code : "SGD" : "SGD"}</span>
                            </div>
                          </Col>
                          <Col xs={24} sm={12} md={8} lg={5}>
                            <h4 style={{ textAlign: 'left', padding: '0px 10px' }}>Number of lessons</h4>
                            <Form.Item style={{ width: '100%', display: 'block', padding: '0px 10px' }}>
                              {getFieldDecorator('session' + val._id, {
                                initialValue: val.course.session,
                                rules: [
                                  {
                                    validator: (_rule, value, callback) => {
                                      if (value && value > 0) {
                                        callback();
                                      } else {
                                        callback("Please input number of lessons");
                                      }
                                    }
                                  }
                                ],
                                validateTrigger: 'onBlur',
                              })(
                                <Input
                                  type="number"
                                  placeholder="Number of lessons"
                                  onChange={(e) => this.props.changeUpdateGroupTuitionInput({ data: { _id: val._id, course: { session: e.target.value } } })}
                                  disabled={!!val.students.length}
                                />
                              )}
                            </Form.Item>
                          </Col>
                          <Col xs={24} sm={12} md={8} lg={5}>
                            <h4 style={{ textAlign: 'left', padding: '0px 10px' }}>Duration</h4>
                            <Form.Item style={{ width: '100%', display: 'block', padding: '0px 10px' }}>
                              {getFieldDecorator('hourPerSession' + val._id, {
                                initialValue: val.course.hourPerSession,
                                rules: [
                                  {
                                    validator: (_rule, value, callback) => {
                                      if (value && value > 0) {
                                        callback();
                                      } else {
                                        callback("Please input lesson's duration");
                                      }
                                    }
                                  }
                                ],
                                validateTrigger: 'onBlur',
                              })(
                                <Select
                                  style={{ width: '100%' }}
                                  placeholder="Lesson's duration ( hour )"
                                  onChange={(value) => this.props.changeUpdateGroupTuitionInput({ data: { _id: val._id, course: { hourPerSession: value } } })}
                                  disabled={!!val.students.length}
                                >
                                  <Option value={1} key="1">1</Option>
                                  <Option value={1.5} key="1.5">1.5</Option>
                                  <Option value={2} key="2">2</Option>
                                  <Option value={2.5} key="2.5">2.5</Option>
                                  <Option value={3} key="3">3</Option>
                                </Select>
                              )}
                            </Form.Item>
                          </Col>
                          <Col xs={24} sm={24} md={16} lg={14}>
                            <h4 style={{ textAlign: 'left', padding: '0px 10px' }}>Class size</h4>
                            <Col xs={12}>
                              <Form.Item style={{ display: 'inline-block', padding: '0px 10px', width: '100%' }}>
                                {getFieldDecorator('minClassSize' + val._id, {
                                  initialValue: val.course.minClassSize,
                                  rules: [
                                    {
                                      validator: (_rule, value, callback) => {
                                        if (value && value >= 2) {
                                          callback();
                                        } else {
                                          callback('Class size must be at least 2!');
                                        }
                                      }
                                    }
                                  ],
                                  validateTrigger: 'onBlur',
                                })(
                                  <div style={{ display: 'flex', alignItems: 'center' }}>
                                    <span style={{ marginRight: '5px' }}>Min</span>
                                    <Input
                                      type="number"
                                      min="2"
                                      defaultValue={val.course.minClassSize}
                                      onChange={(e) => this.props.changeUpdateGroupTuitionInput({ data: { _id: val._id, course: { minClassSize: e.target.value } } })}
                                    // disabled={!!val.students.length}
                                    />
                                  </div>
                                )}
                              </Form.Item>
                            </Col>
                            <Col xs={12}>
                              <Form.Item style={{ display: 'inline-block', padding: '0px 10px', width: '100%' }}>
                                {getFieldDecorator('maxClassSize' + val._id, {
                                  initialValue: val.course.maxClassSize,
                                  rules: [
                                    {
                                      validator: (_rule, value, callback) => {
                                        if (value && value >= 2) {
                                          callback();
                                        } else {
                                          callback('Class size must be at least 2!');
                                        }
                                      }
                                    }
                                  ],
                                  validateTrigger: 'onBlur',
                                })(
                                  <div style={{ display: 'flex', alignItems: 'center' }}>
                                    <span style={{ marginRight: '5px' }}>Max</span>
                                    <Input
                                      type="number"
                                      min="2"
                                      defaultValue={val.course.maxClassSize}
                                      onChange={(e) => this.props.changeUpdateGroupTuitionInput({ data: { _id: val._id, course: { maxClassSize: e.target.value } } })}
                                    // disabled={!!val.students.length}
                                    />
                                  </div>
                                )}
                              </Form.Item>
                            </Col>
                          </Col>
                          <Col xs={24} sm={24} md={18} lg={16} style={{ marginBottom: 20 }}>
                            <h4 style={{ textAlign: 'left', padding: '0px 10px' }}>Registration period</h4>
                            <Col xs={12} style={{ display: 'flex', alignItems: 'center', paddingLeft: '10px' }}>
                              <span>From</span>
                              <Form.Item style={{ display: 'inline-block', padding: '0px 10px', marginBottom: '0px', width: '100%' }}>
                                {getFieldDecorator('startReg' + val._id, {
                                  initialValue: moment(val.course.startReg),
                                  rules: [
                                    {
                                      validator: (_rule, value, callback) => {
                                        if (value && moment(val.course.endReg).diff(moment(value), 'days') >= 13) {
                                          callback();
                                        } else {
                                          callback("Please allow at least two weeks' registration period for all group tuitions!");
                                        }
                                      }
                                    }
                                  ]
                                })(
                                  <DatePicker
                                    style={{ display: 'inline-block', width: '100%' }}
                                    // value={moment(val.course.startReg)}
                                    format="DD MMM YYYY"
                                    allowClear={false}
                                    showToday={true}
                                    placeholder='From'
                                    onChange={(value) => this.changeStartReg(val._id, value)}
                                    disabled={!!val.students.length}
                                  />
                                )}
                              </Form.Item>
                            </Col>
                            <Col xs={12} style={{ display: 'flex', alignItems: 'center' }}>
                              <span>To</span>
                              <Form.Item style={{ display: 'inline-block', padding: '0px 10px', marginBottom: '0px', width: '100%' }}>
                                {getFieldDecorator('endReg' + val._id, {
                                  initialValue: moment(val.course.endReg),
                                  rules: [
                                    {
                                      validator: (_rule, value, callback) => {
                                        if (value && moment(new Date(value)).diff(moment(val.course.startReg), 'days') >= 13) {
                                          callback();
                                        } else {
                                          callback("Please allow at least two weeks' registration period for all group tuitions!");
                                        }
                                      }
                                    }
                                  ]
                                })(
                                  <DatePicker
                                    style={{ display: 'inline-block', width: '100%' }}
                                    // defaultValue={moment(val.course.endReg)}
                                    format="DD MMM YYYY"
                                    allowClear={false}
                                    showToday={true}
                                    placeholder='To'
                                    onChange={(value) => this.changeEndReg(val._id, value)}
                                    disabled={!!val.students.length}
                                  />
                                )}
                              </Form.Item>
                            </Col>
                          </Col>
                          <Col xs={24} style={{ display: 'flex' }}>
                            <Col xs={24} sm={24} md={24} lg={12}>
                              <h4 style={{ textAlign: 'left', padding: '0px 10px' }}>
                                <span>Lesson Schedule</span>
                                <Button disabled={!!val.students.length} style={{ float: 'right', marginBottom: '10px' }} onClick={() => this.props.openEditPeriodModal({ _id: val._id, period: val.period, hourPerSession: val.course.hourPerSession, session: val.course.session })}>Edit Schedule</Button>
                              </h4>
                              <Table
                                size='small'
                                pagination={false}
                                columns={columns}
                                rowKey={(_record, index) => index.toString()}
                                dataSource={val.period.sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime()).map((item) => ({
                                  ...item,
                                  start: this.inputDateInUserTimezone(item.start),
                                  end: this.inputDateInUserTimezone(item.end)
                                }))}
                              />
                            </Col>
                            {/* <Col xs={24} sm={12} md={10} lg={9}>
                              <h4 style={{ textAlign: 'left', padding: '0px 10px' }}>Registration period</h4>
                              <Col xs={12} style={{ display: 'flex', alignItems: 'center', paddingLeft: '10px' }}>
                                <span>From</span>
                                <Form.Item style={{ display: 'inline-block', padding: '0px 10px', marginBottom: '0px' }}>
                                  {getFieldDecorator('startReg' + val._id, {
                                    initialValue: moment(val.course.startReg),
                                    rules: [
                                      {
                                        validator: (_rule, _value, callback) => {
                                          callback();
                                        }
                                      }
                                    ]
                                  })(
                                    <DatePicker
                                      style={{ display: 'inline-block' }}
                                      // value={moment(val.course.startReg)}
                                      format="DD MMM YYYY"
                                      allowClear={false}
                                      showToday={true}
                                      placeholder='From'
                                      onChange={(value) => this.changeStartReg(val._id, value)}
                                      disabled={!!val.students.length}
                                    />
                                  )}
                                </Form.Item>
                              </Col>
                              <Col xs={12} style={{ display: 'flex', alignItems: 'center' }}>
                                <span>To</span>
                                <Form.Item style={{ display: 'inline-block', padding: '0px 10px', marginBottom: '0px' }}>
                                  {getFieldDecorator('endReg' + val._id, {
                                    initialValue: moment(val.course.endReg),
                                    rules: [
                                      {
                                        validator: (_rule, _value, callback) => {
                                          callback();
                                        }
                                      }
                                    ]
                                  })(
                                    <DatePicker
                                      style={{ display: 'inline-block' }}
                                      // defaultValue={moment(val.course.endReg)}
                                      format="DD MMM YYYY"
                                      allowClear={false}
                                      showToday={true}
                                      placeholder='To'
                                      onChange={(value) => this.changeEndReg(val._id, value)}
                                      disabled={!!val.students.length}
                                    />
                                  )}
                                </Form.Item>
                              </Col>
                            </Col> */}
                            <Col xs={24} style={{ display: 'flex' }}>
                              {/* <Col xs={24} lg={12}>
                                <h4 style={{ textAlign: 'left', padding: '0px 10px' }}>
                                  <span>{this.props.languageState.TUTORING_PAGE_PERIOD.translated}</span>
                                  <Button disabled={!!val.students.length} style={{ float: 'right', marginBottom: '10px' }} onClick={() => this.props.openEditPeriodModal({ _id: val._id, period: val.period, hourPerSession: val.course.hourPerSession, session: val.course.session })}>Edit period</Button>
                                </h4>
                                <Table
                                  size='small'
                                  pagination={false}
                                  columns={columns}
                                  rowKey={(_record, index) => index.toString()}
                                  dataSource={val.period.sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime()).map((item) => ({
                                    ...item,
                                    start: this.inputDateInUserTimezone(item.start),
                                    end: this.inputDateInUserTimezone(item.end)
                                  }))}
                                />
                              </Col> */}
                              <Col xs={24} sm={24} md={24} lg={6} style={{ display: 'flex', paddingLeft: '15px' }}>
                                <h4 style={{ marginBottom: '0px' }}>
                                  <span>Status:</span>
                                  <Select
                                    disabled={!!val.students.length || val.isCompleted || val.isCanceled}
                                    style={{ width: '100%', marginTop: '15px', color: val.isActive ? val.students.length >= val.course.minClassSize ? "green" : "green" : val.students.length >= val.course.minClassSize ? val.isCompleted || val.isCanceled ? "#f08223" : "red" : "red" }}
                                    value={val.isActive ? val.students.length >= val.course.minClassSize ? "Active" : "Pending" : val.students.length >= val.course.minClassSize ? val.isCompleted || val.isCanceled ? "Completed" : "Inactive" : "Inactive"}
                                    // value={val.isCanceled ? "Inactive" : val.isCompleted ? "Completed" : val.isActive ? (val.students.length >= val.course.minClassSize ? "Active" : "Pending") : "Inactive"}
                                    onChange={(value) => this.changeStatus(val._id, value)}>
                                    {val.students.length >= val.course.minClassSize ?
                                      <Select.Option value="Active" style={{ color: 'green' }}>Active</Select.Option> :
                                      <Select.Option value="Pending" style={{ color: 'green' }}>Pending</Select.Option>}
                                    <Select.Option value="Inactive" style={{ color: 'red' }}>Inactive</Select.Option>
                                    <Select.Option value="Completed" style={{ color: "#f08223" }} disabled>Completed</Select.Option>
                                  </Select>
                                </h4>
                              </Col>
                              <Col xs={24} lg={6} style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'flex-end' }}>
                                <Button type="primary" style={{ margin: '0px 10px' }} onClick={() => this.updateGroupTuition(val._id)}>Save</Button>
                                <Popconfirm placement="leftTop" title="Are you sure to delete this tuition?" onConfirm={() => this.props.deleteGroupTuition(val._id)} okText="Yes" cancelText="No">
                                  <Button disabled={!!val.students.length} type="primary" style={{ backgroundColor: val.students.length ? '#f5f5f5' : 'red', color: val.students.length ? 'rgba(0, 0, 0, 0.25)' : 'white', border: '0px', margin: '0px 10px' }}>Delete</Button>
                                </Popconfirm>
                              </Col>
                            </Col>
                          </Col>
                          {val.students.length ?
                            <Col xs={24} style={{ marginTop: '20px' }}>
                              <p>* You can only update the class size because there's at least one student in this group.</p>
                            </Col> : <div></div>
                          }
                        </Row>
                      </Col>
                      <Col xs={24} style={{ marginTop: '20px' }}>
                        <hr />
                      </Col>
                    </Row>
                  )
                  ) : <p style={{ textAlign: 'center' }}>You have no group tuition.</p>}
                  <div>
                    <Row>
                      <Pagination current={this.state.currentPage} pageSize={DEFAULT.PAGE_SIZE} total={this.props.groupTuitions.length || 0} onChange={this.handlePagination} style={{ float: 'right', marginTop: '-20px', marginBottom: '11px' }} />
                    </Row>
                  </div>
                  {/* To prevent conflict between 2 DragAndDropCalendar, we have to do it like below */}
                  {this.props.createGroupModal ?
                    <AddGroupTuitionModal
                      visible={true}
                      profileState={this.props.profileState}
                      createGroupTuitionInput={this.props.createGroupTuitionInput}
                      loadTutorSchedules={this.props.loadTutorSchedules}
                      schedulesData={this.props.schedulesData}
                      changeCreateGroupTuitionInput={this.props.changeCreateGroupTuitionInput}
                      selectEvent={this.props.selectEvent}
                      selectedEvent={this.props.selectedEvent}
                      dataLookupState={this.props.dataLookupState}
                      deletePeriod={this.props.deletePeriod}
                      hideModal={() => {
                        this.props.clearCreateGroupTuitionInput();
                        this.props.toggleCreateGroupModal(false);
                      }}
                      createGroupTuition={this.props.createGroupTuition}
                      levels={this.props.levels}
                      subjects={this.props.subjects}
                      grades={this.props.grades}
                      languageState={this.props.languageState}
                    /> : <div></div>
                  }
                  {
                    this.props.editPeriodModal ?
                      <EditPeriodModal
                        visible={true}
                        profileState={this.props.profileState}
                        editPeriodData={this.props.editPeriodData}
                        loadTutorSchedules={this.props.loadTutorSchedules}
                        schedulesData={this.props.schedulesData}
                        changeUpdateGroupTuitionInput={this.props.changeUpdateGroupTuitionInput}
                        selectEvent={this.props.selectEvent}
                        selectedEvent={this.props.selectedEvent}
                        hideModal={this.props.hideEditPeriodModal}
                        createGroupTuition={this.props.createGroupTuition}
                        changeEditPeriodData={this.props.changeEditPeriodData}
                        deleteEditPeriodData={this.props.deleteEditPeriodData}
                        selectedGroupPeriod={this.props.selectedGroupPeriod}
                        changePeriods={this.changePeriods}
                        languageState={this.props.languageState}
                      /> : <div></div>
                  }
                </Layout>
              </TabPane>
            </Tabs>
          </Row>
        </Layout>
      </UserLayout >
    );
  }
}

const mapState = (rootState: any) => {
  return {
    ...rootState.editProfilePageModel,
    ...rootState.tutoringPageModel,
    profileState: rootState.profileModel,
    dataLookupState: rootState.dataLookupModel,
    languageState: rootState.languageModel,
  };
};

const mapDispatch = (rootReducer: any) => {
  return {
    ...rootReducer.editProfilePageModel,
    ...rootReducer.tutoringPageModel,
    profileReducers: rootReducer.profileModel,
    dataLookup: rootReducer.dataLookupModel,
  };
};

export default withRematch(initStore, mapState, mapDispatch)(Form.create()(TutoringPage));