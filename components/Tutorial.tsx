import * as React from 'react';
// import EnjoyHint from 'enjoyhint';
import { Layout, Row, Col, Badge, Popover, Menu, Icon, Dropdown, Upload, Tag, Button, Form, Input, Select, AutoComplete, Table, DatePicker, Checkbox, Popconfirm, Tabs, Modal, Avatar, Card } from 'antd';
import Link from 'next/link';
import Head from 'next/head';
import dynamic from "next/dynamic";
import * as Scroll from 'react-scroll'
import { Element, scroller } from 'react-scroll';
const AvatarEditor: any = dynamic(import("react-avatar-editor"));
import moment from 'moment';
import { extendMoment } from 'moment-range';
import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop';
import Calendar from 'react-big-calendar';
import 'react-big-calendar/lib/addons/dragAndDrop/styles.css';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import './custom-calendar.css';
import '../layout/UserLayoutHeader.css';
import '../layout/Header.css';
Calendar.setLocalizer(Calendar.momentLocalizer(moment));
const DragAndDropCalendar = withDragAndDrop(Calendar);
const extendedMoment = extendMoment(moment);
const Content = Layout.Content;


const FormItem = Form.Item;
const Option = Select.Option;
const { RangePicker } = DatePicker;
const TabPane = Tabs.TabPane;

class Tutorial extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      screen: 1,
      activeKey: '1',
      step: 0,
      init: false,
      groupModal: false,
      tutoringMenu: false,
      dropDownMenuVisible: true,
      createIndividualModal: false,
      rescheduleModalVisible: false,
      materialModal: false,
      demoCourses: [
        {
          _id: "0123",
          isDeleted: false,
          course: {
            subject: 'Demo Tutorial',
            level: 'Demo',
            grade: 'Demo',
            country: 'Singapore',
            session: 1,
            hourPerSession: 1,
            isDeleted: false
          }
        }
      ]
    };
  }

  nextStep = () => {
    this.setState({
      step: this.state.step + 1
    })
  }

  openTutoringMenu = () => {
    if (this.state.step === 5) {
      this.setState({
        tutoringMenu: true
      })
    }
  }

  hideCreateIndModalOnStep = () => {
    if (this.state.step === 12) {
      this.setState({
        createIndividualModal: false
      })
    }
  }

  switchTab = () => {
    if (this.state.step === 13) {
      this.setState({
        activeKey: '2'
      })
    }
    if (this.state.step === 17) {
      this.setState({
        groupModal: false
      })
    }
  }

  openCreateSubjectModal = () => {
    this.props.toggleCreateCourseModal(true);
  }

  openCreateGroupModal = () => {
    this.setState({
      groupModal: true
    })
  }

  showCreateIndividualModal = () => {
    this.setState({
      createIndividualModal: true
    })
  }

  hideCreateIndividualModal = () => {
    this.setState({
      createIndividualModal: false
    })
  }

  hideGroupModal = () => {
    this.setState({
      groupModal: false
    })
  }

  componentDidMount() {
    const endTutorial = () => {
      this.props.endTutorial();
    }

    const nextStep = () => {
      this.nextStep();
    }

    const openTutoringMenu = () => {
      this.openTutoringMenu();
    }

    const hideCreateIndModalOnStep = () => {
      this.hideCreateIndModalOnStep();
    }

    const switchTab = () => {
      this.switchTab();
    }

    const a = setInterval(() => {
      if ((window as any).jQuery) {
        if (this.state.init) {

        } else {
          var enjoyhint_instance = new EnjoyHint({
            onSkip: () => {
              endTutorial();
            },
            onEnd: () => {
              endTutorial();
            },
            onNext: () => {
              hideCreateIndModalOnStep();
              openTutoringMenu();
              switchTab();
              nextStep();
            }
          });

          //simple config. 
          //Only one step - highlighting(with description) "New" button 
          //hide EnjoyHint after a click on the button.
          var enjoyhint_script_steps = [
            {
              'click #enjoyhint-profile-anchor': 'Click My Profile in this dropdown menu to view and edit your profile',
              'showNext': false,
              'showSkip': false
            },
            {
              'click #enjoyhint-profile-avatar': 'Click here to upload/ edit your avatar',
              'showNext': true
            },
            {
              'click #enjoyhint-profile-main-contact': 'Here to edit your basic information',
              'showNext': true
            },
            {
              'click #enjoyhint-submit-basic-btn': 'Submit your information here',
              'showNext': true
            },
            {
              'click #enjoyhint-about-me': 'Tell your students a little about you',
              'showNext': true
            },
            {
              'click #enjoyhint-education': 'Your education and certifications',
              'showNext': true
            },
            {
              'click #enjoyhint-exp': 'Your teaching experience',
              'showNext': true
            },
            {
              'click #enjoyhint-tutoring-anchor': 'Click here to set up your first tuition',
              'showNext': false,
              'showSkip': false
            },
            {
              'click .ant-tabs-tab-active': 'Set up your 1 on 1 tuition',
              'showNext': true
            },
            {
              'click #enjoyhint-individual-btn': 'Create new tuition here',
              'showNext': false,
              'showSkip': false
            },
            {
              'click #enjoyhint-search-individual': "Search for your pre-defined course here",
              'showNext': true
            },
            {
              'click #enjoyhint-lookup-table': "Select your pre-defined course here",
              'showNext': true
            },
            {
              'click #enjoyhint-price-input': "Then fill the hourly rate for your tuition",
              'showNext': true,
            },
            {
              'click .ant-tabs-tab-active': "Set up your group tuition",
              'showNext': true,
            },
            {
              'click #enjoyhint-add-group-btn': "Add new group tuition",
              'showNext': false,
              'showSkip': false
            },
            {
              'click #enjoyhint-group-tuition-first-half': "Fill all the necessary informations",
              'showNext': true
            },
            {
              'click #enjoyhint-group-tuition-second-half': 'Then select the period for your tuition',
              'showNext': true
            },
            {
              'click #enjoyhint-availability-anchor': 'To set up your availability, click here',
              'showNext': false,
              'showSkip': false
            },
            {
              'click #enjoyhint-availability-instructions': 'Read the instructions carefully',
              'showNext': true,
            },
            {
              'click #enjoyhint-avail-dnd-calendar': 'Then choose your availability from this calendar.',
              'showNext': true,
              // "skipButton": { text: "Finish" }
            },
            {
              'click #enjoyhint-my-tuition-anchor': 'To view your tuitions, click here',
              'showNext': false,
              'showSkip': false,
            },
            {
              'click #enjoyhint-go-to-tuition-button': 'Go to a specific tuition',
              'showNext': false,
              'showSkip': false,
            },
            {
              'click #enjoyhint-session-card': 'Go to a specific session',
              'showNext': false,
              'showSkip': false,
            },
            {
              'click #enjoyhint-session-start-class': 'Click here to join class',
              'showNext': true,
              // "skipButton": { text: "Finish" }
            },
            {
              'click #enjoyhint-session-reschedule': 'Click here to reschedule session',
              'showNext': false,
              'showSkip': false,
            },
            {
              'click #enjoyhint-session-reschedule-dndc': 'Select new period for your session',
              'showNext': true,
            },
            {
              'click #enjoyhint-session-reschedule-save-btn': 'Save your change here',
              'showNext': false,
            },
            {
              'click #enjoyhint-upload-material-btn': 'To upload material for this session, click here',
              'showNext': false, 
            },
            {
              'click #enjoyhint-session-material-upload-btn': 'Click here to upload file',
              'showNext': true
            },
            {
              'click #enjoyhint-session-material-save-btn': 'Then click here to save your file',
              'showNext': false 
            },
            {
              'click #enjoyhint-material-table': 'Your files will appear here',
              'showNext': true,
              "skipButton": { text: "Finish" }
            }
          ];

          //set script config
          enjoyhint_instance.set(enjoyhint_script_steps);

          //run Enjoyhint script
          enjoyhint_instance.run();
          this.setState({ init: true })
          clearInterval(a);
        }
      }
    }, 100)
  }

  changeScreen = (val: number) => {
    this.setState({
      screen: val,
      dropDownMenuVisible: false,
      tutoringMenu: val === 5 ? false : this.state.tutoringMenu
    })
  }

  onClickProfile = () => {
    const scroll = Scroll.animateScroll;

    scroll.scrollTo(0, {
      duration: 500,
      delay: 100,
      smooth: true,
      containerId: 'ContainerElementID',
      offset: 50,
    });
  }

  onClickAboutMe = () => {
    scroller.scrollTo('aboutMe', {
      duration: 800,
      delay: 0,
      smooth: 'easeInOutQuart'
    });
  }

  onClickEducation = () => {
    scroller.scrollTo('education', {
      duration: 800,
      delay: 0,
      smooth: 'easeInOutQuart'
    });
  }

  onClickExperience = () => {
    const scroll = Scroll.animateScroll;
    scroll.scrollToBottom({
      duration: 500,
      delay: 100,
      smooth: true,
      containerId: 'ContainerElementID',
      offset: 50,
    });
  }

  inputDateInUserTimezone = (date: any = new Date().toString()) => {
    const browserTimezone = - new Date().getTimezoneOffset() / 60;
    const userTimezone = this.props.profileState.timeZone && this.props.profileState.timeZone.offset ? this.props.profileState.timeZone.offset : browserTimezone;
    const deltaTimezone = userTimezone - browserTimezone;

    return new Date(new Date(date).getTime() + deltaTimezone * 60 * 60 * 1000);
  }

  render() {
    const displayName = this.props.profileState.fullName ? this.props.profileState.fullName : this.props.profileState.email ? this.props.profileState.email : 'New User';
    const { Footer } = Layout;

    const { getFieldDecorator } = this.props.form;

    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 8 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
      },
    };

    const columnsTeacherExperience = [
      {
        title: `Period`,
        dataIndex: 'year',
        key: 'year',
        width: '30%',
        render: (_value, record, index) => {
          return (
            <RangePicker
              placeholder={['Start month', 'End month']}
              format="MMM-YYYY"
              value={record.year.map(item => { return moment(item) })}
              mode={['month', 'month']}
              onPanelChange={(value, mode) => {
                this.props.handleYearChange({ value, mode, index })
              }}
            />
          )
        }
      },
      {
        title: `Experience`,
        dataIndex: 'experience',
        key: 'experience',
        width: '65%',
        render: (_value, record, index) => (
          <Input placeholder='Experience' value={record.experience}
            onChange={(event) => {
              this.props.handleExperienceChange({ event, index });
            }}
          />
        )
      },
      {
        title: ``,
        dataIndex: 'delete',
        key: 'delete',
        width: '5%',
        render: (_value, _record, index) => (
          <Button className='dynamic-delete-button' onClick={(event) => this.props.handleDeleteTeacherExperience({ event, index })}><Icon type='delete'></Icon></Button>
        )
      },
    ];

    const columnsTeacherSubject = [
      {
        title: `Subject`,
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
        title: `Academic Level`,
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
        title: `Grade`,
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
        title: `Syllabus Country`,
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
        title: `Lessons`,
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
        title: `Hours Per Lesson`,
        dataIndex: 'course.hourPerSession',
        key: 'hourPerSession',
        width: '15%',
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
        title: `Hourly Rate`,
        dataIndex: '',
        key: 'hourlyRate',
        width: '15  %',
        render: (value, _record, _index) => {
          return (
            <div style={{ display: 'flex', justifyContent: "space-between", alignItems: 'center' }} id="enjoyhint-price-input">
              <Input value={value.hourlyRate} />
              <span style={{ minWidth: '50px', marginLeft: '10px' }}>SGD</span>
            </div>
          );
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
            title='Are you sure to delete this course?'
            onConfirm={() => this.props.deleteTutoringTeacherSubject(_value)}
            okText='Yes'
            cancelText='No'
          >
            <Button className='dynamic-delete-button'><Icon type='delete'></Icon></Button>
          </Popconfirm>
        )
      },
    ];

    const dropdownMenu = (
      <Menu className='user-menu' selectedKeys={[]}>
        <Menu.Item id="enjoyhint-profile-anchor" onClick={() => this.changeScreen(2)}>
          <Link>
            <a>
              <Icon type="appstore-o" />
              &nbsp; My Profile
            </a>
          </Link>
        </Menu.Item>
        <Menu.Divider />

        <Menu.Item>
          <a>
            <Icon type="key" theme="outlined" />
            &nbsp; Change Password
            </a>
        </Menu.Item>
        <Menu.Divider />

        <Menu.Item key='logout'>
          <a>
            <Icon type='logout' className='user-menu-item-icon' />
            &nbsp; Log Out
          </a>
        </Menu.Item>
      </Menu>
    );

    const groupColumns = [
      {
        title: 'Date',
        dataIndex: 'date',
        key: 'date',
        render: (_text, record, _index) => extendedMoment(record.start).format('DD MMM YYYY')
      },
      {
        title: 'Time',
        dataIndex: 'time',
        key: 'time',
        render: (_text, record, _index) => `${extendedMoment(record.start).format('HH:mm')} - ${extendedMoment(record.end).format('HH:mm')}`
      },
      {
        title: 'Actions',
        dataIndex: 'actions',
        key: 'actions',
        render: (_text, record, _index) => groupActionButtons(record)
      }
    ];

    const groupActionButtons = (record: any) => {
      return (
        <div className="action-buttons">
          <Button
            type="primary"
            icon='delete'
            className="button"
            style={{ marginRight: '12px' }}
          />
        </div>
      );
    };

    const phoneIdSelector = () => {
      return (
        <AutoComplete
          value={this.props.phoneID}
          dataSource={[]}
          placeholder="Country Code"
          filterOption={(inputValue, option) => (option as any).props.children.toString().toUpperCase().indexOf(inputValue.toUpperCase()) !== -1}
          onChange={value => value}
          style={{ width: 200, height: 30 }}
        />
      );
    };

    const columnsTeacherSubjectModal = [
      {
        title: ``,
        dataIndex: '',
        key: 'create',
        width: '5%',
        render: (value, _record, _index) => {
          return <Checkbox
            checked={false}
          />
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
          <span>{value === 'trial' ? "-" : value.name}</span>
        ),
        sorter: (a: any, b: any) => a.level.localeCompare(b.level)
      },
      {
        title: `Grades`,
        dataIndex: 'grade',
        key: 'grade',
        width: '15%',
        render: (value, _record, _index) => (
          <span>{value === 'trial' ? "-" : value.name}</span>
        ),
        sorter: (a: any, b: any) => a.grade.localeCompare(b.grade)
      },
      {
        title: `Subject`,
        dataIndex: 'subject',
        key: 'subject',
        width: '15%',
        render: (value, _record, _index) => (
          <span>{value === 'trial' ? "Trial" : value.name}</span>
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

    const availActionButtons = (record: any) => {
      return (
        <div className="action-buttons">
          <Popconfirm
            title="Demo"
            placement='bottomRight'
            okText='Save'
            cancelText='Cancel'
            icon={null}
            visible={false}
          >
            <Button
              type="primary"
              icon="edit"
              className="button"
              style={{ marginRight: '12px' }}
            />
          </Popconfirm>

          <Button
            type="primary"
            icon='delete'
            className="button"
            style={{ marginRight: '12px' }}
          />
        </div>
      );
    };

    const availColumns = [
      {
        title: 'Date',
        dataIndex: 'date',
        key: 'date',
        render: (_text, record, _index) => extendedMoment(record.start).format('DD MMM YYYY')
      },
      {
        title: 'Time',
        dataIndex: 'time',
        key: 'time',
        render: (_text, record, _index) => `${extendedMoment(record.start).format('HH:mm')} - ${extendedMoment(record.end).format('HH:mm')}`
      },
      {
        title: 'Actions',
        dataIndex: 'actions',
        key: 'actions',
        render: (_text, record, _index) => availActionButtons(record)
      }
    ];

    const sessionColumns = [
      {
        title: this.props.languageState.SESSION_DETAIL_PAGE_UPLOAD_BY.translated,
        dataIndex: "uploadBy",
        key: "uploadBy"
      },
      {
        title: this.props.languageState.SESSION_DETAIL_PAGE_FILE_NAME.translated,
        dataIndex: "fileName",
        key: "fileName"
      },
      {
        title: this.props.languageState.SESSION_DETAIL_PAGE_UPLOAD_DATE.translated,
        dataIndex: "uploadDate",
        key: "uploadDate",
        render: (_text, record, _index) => extendedMoment(record.uploadDate).format('DD MMM YYYY'),
      },
      {
        title: this.props.languageState.SESSION_DETAIL_PAGE_ACTIONS.translated,
        dataIndex: 'actions',
        key: "actions",
        render: (_text, record, _index) => (
          <div className='action-buttons'>
            <a style={{ display: 'inline-block', marginRight: '12px' }}>
              <Button type="primary" icon='download'>
                {this.props.languageState.SESSION_DETAIL_PAGE_DOWNLOAD.translated}
              </Button>
            </a>

            <Popconfirm title={this.props.languageState.SESSION_DETAIL_PAGE_DELETE_CONFIRM.translated} okText='Yes' cancelText='No' onConfirm={() => false}>
              <Button type="primary" icon='delete'>
                {this.props.languageState.SESSION_DETAIL_PAGE_DELETE.translated}
              </Button>
            </Popconfirm>
          </div>
        )
      }
    ];

    return (
      <div>
        <Head>
          <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/2.2.4/jquery.min.js"></script>
          <script src='/static/enjoyhint/dist/enjoyhint.min.js'></script>
          <link rel="stylesheet" href="/static/enjoyhint/dist/enjoyhint.css"></link>
        </Head>
        <Layout style={{ background: '#ffffff', display: 'flex', minHeight: '100vh', flexDirection: 'column' }}>
          <Layout.Header
            className='userlayout-header'
            style={{
              background: '#ffff',
              boxShadow: '7px 0px 11px 1px rgba(0, 0, 0, 0.2)',
              zIndex: 5,
              padding: 0
            }}
          >
            <Row>
              <Col span={16} className="responsive-big-menu">
                <Menu mode="horizontal" className='student-menu' style={{
                  borderBottom: 'none',
                  height: '64px',
                  lineHeight: '60px',
                  fontWeight: 500,
                  zIndex: 1
                }} openKeys={this.state.tutoringMenu ? ['tutor-3'] : []}>
                  <Menu.Item key="tutor-0">
                    <div style={{ height: '60px', padding: '11px 0' }}>
                      <img
                        src='/static/images/skyace-no-cloud.png'
                        style={{
                          width: 'auto',
                          height: '42px',
                          display: 'block',
                          margin: '0 auto',
                        }}
                      />
                    </div>
                  </Menu.Item>
                  <Menu.Item key="tutor-1">
                    <Link>
                      <a><Icon type="dashboard" />My Dashboard</a>
                    </Link>
                  </Menu.Item>
                  <Menu.Item key="tutor-2"  id="enjoyhint-my-tuition-anchor" onClick={() => this.changeScreen(5)}>
                    <Link>
                      <a><Icon type="home" /> My Tuitions</a>
                    </Link>
                  </Menu.Item>
                  <Menu.SubMenu title={<span><Icon type="team" /><span>Tutoring</span></span>} key="tutor-3">
                    <Menu.Item key="subject" id="enjoyhint-tutoring-anchor" onClick={() => this.changeScreen(3)}>
                      <Link>
                        <a><Icon type="book" /> Subjects</a>
                      </Link>
                    </Menu.Item>

                    <Menu.Item key="availability" id="enjoyhint-availability-anchor" onClick={() => this.changeScreen(4)}>
                      <Link>
                        <a><Icon type="calendar" /> Availability</a>
                      </Link>
                    </Menu.Item>
                  </Menu.SubMenu>
                </Menu>
              </Col>

              <Col xs={8}>
                <div className="custom-dropdown" style={{ textAlign: 'right', paddingRight: '24px' }}>
                  <Popover
                    content={<div></div>}
                    placement="bottomRight"
                    trigger="click"
                    arrowPointAtCenter={true}
                    onVisibleChange={(visible) => (visible)}
                  >
                    <span className="notification-button" style={{ cursor: 'pointer', display: 'inline-block', marginRight: '24px' }}>
                      <Badge count={0}>
                        <a>
                          <img src='/static/chat.png' style={{ width: 20 }} />
                        </a>
                      </Badge>
                    </span>
                  </Popover>

                  <Dropdown overlay={dropdownMenu} visible={this.state.dropDownMenuVisible}>
                    <span className="responsive-display-name" style={{ cursor: 'pointer', display: 'inline-block' }}>
                      {displayName} &nbsp; <Icon type='down' />
                    </span>
                  </Dropdown>
                </div>
              </Col>
            </Row>

          </Layout.Header>
          {
            this.state.screen === 1 ?
              <Layout style={{ background: "#fff", padding: "40px 30px 20px 30px" }}>
                <h1> Hello, {this.props.profileState.fullName || this.props.profileState.firstName + ' ' + this.props.profileState.lastName}</h1>
                <hr />
                <Row className="dashboard-row">
                  <h2>Notifications</h2>
                  <Col xs={24} style={{ textAlign: 'left' }}>
                    <p style={{ color: '#f5222d', textAlign: 'left' }}>You don't have any new notifications.</p>
                  </Col>
                </Row>

                <Row className="dashboard-row">
                  <h2>Upcoming Tuitions</h2>
                  <div style={{ textAlign: 'left', color: '#f5222d' }}>
                    {`You don't have any upcoming tuitions.`}
                  </div>
                </Row>

                <Row className="dashboard-row">
                  <h2>My tuition bookings</h2>
                  <div style={{ textAlign: 'left', color: '#f5222d' }}>
                    {`You don't have any current tuition bookings.`}
                  </div>
                </Row>

              </Layout> : <div></div>
          }

          {
            this.state.screen === 2 ?
              <Layout className='edit-profile-user' style={{ background: '#fff', padding: '0px 30px 20px 30px' }}>
                <Menu mode='horizontal' style={{ marginBottom: '30px', margin: '0px -40px', position: 'sticky', top: '0px', zIndex: 1 }}>
                  <Menu.Item key='profile'><a onClick={this.onClickProfile} ><b>Profile</b></a>
                  </Menu.Item>

                  <Menu.Item key='biography'><a onClick={this.onClickAboutMe}><b>About Me</b></a>
                  </Menu.Item>

                  <Menu.Item key='my-education'><a onClick={this.onClickEducation}><b>Education</b></a>
                  </Menu.Item>

                  <Menu.Item key='teaching-experience'><a onClick={this.onClickExperience}><b>Experience</b></a>
                  </Menu.Item>
                </Menu>

                <Layout style={{ background: 'white', marginBottom: 50 }}>
                  <Row className='edit-base-profile'>
                    <Row>
                      <Layout className='white-theme' style={{ marginTop: 0 }}>
                        <h1 id='profile' style={{ fontWeight: 'bold' }}>Profile</h1>
                        <AvatarEditor
                          id="enjoyhint-profile-avatar"
                          image={this.props.imageTemporary}
                          width={200}
                          height={200}
                          border={20}
                          scale={this.props.avatarZoomValue}
                          rotate={this.props.avatarRotateValue}
                          borderRadius={100}
                        />
                        <Upload
                          className='upload-button'
                          beforeUpload={(_file) => false}
                          showUploadList={false}
                        >
                          <Button>
                            <Icon type='upload' /> Click to Upload
                    </Button>
                        </Upload>
                      </Layout>
                    </Row>
                    <Row>
                      <Layout className='white-theme' id="enjoyhint-profile-main-contact">
                        <Form>
                          <Col span={11}>
                            <FormItem {...formItemLayout} label='Given Name'>
                              {getFieldDecorator('firstName', {
                                rules: [
                                  { required: true, message: 'Please input your first name!', whitespace: true },
                                  { pattern: /.{2,15}/, message: "Name must be between 2 and 15 characters" }
                                ],
                                initialValue: null,
                                validateTrigger: 'onBlur',
                                validateFirst: true,
                              })(
                                <Input
                                  name='firstName'
                                  placeholder='Given Name'
                                  onChange={(e) => this.props.userInfoChange({ firstName: e.target.value })}
                                />
                              )}
                            </FormItem>
                            <FormItem {...formItemLayout} label='Email Address'>
                              {getFieldDecorator('emailAddress', {
                                rules: [
                                  { required: true, message: 'Please input your email!', whitespace: true }
                                ],
                                initialValue: null,
                                validateTrigger: 'onBlur',
                                validateFirst: true,
                              })(
                                <Input
                                  name='emailAddress'
                                  placeholder='Email Address'
                                  disabled={true}
                                />
                              )}
                            </FormItem>
                            <FormItem {...formItemLayout} label='Gender'>
                              {getFieldDecorator('gender', {
                                initialValue: null,
                              })(
                                <Select
                                  placeholder='Select your gender'
                                  onChange={(value) => this.props.userInfoChange({ gender: value })}
                                >
                                  <Option key='male' value='male'>Male</Option>
                                  <Option key='female' value='female'>Female</Option>
                                </Select>
                              )}
                            </FormItem>
                            <FormItem {...formItemLayout} label='Nationality'>
                              {getFieldDecorator('nationality', {
                                initialValue: null,
                              })(
                                <AutoComplete
                                  dataSource={[]}
                                  placeholder="Select your nationality."
                                  filterOption={(inputValue, option) => (option as any).props.children.toString().toUpperCase().indexOf(inputValue.toUpperCase()) !== -1}
                                  onChange={(value) => this.props.userInfoChange({ biography: { language: this.props.biography.language, nationality: value, aboutMe: this.props.biography.aboutMe, secondaryLanguage: this.props.biography.secondaryLanguage } })}
                                />
                              )}
                            </FormItem>
                            <FormItem {...formItemLayout} label='National ID/ Passport No.'>
                              {getFieldDecorator('nationalID', {
                                initialValue: null,
                              })(
                                <Input
                                  placeholder='Input your national ID/ Passport No'
                                  onChange={(e) => this.props.userInfoChange({ nationalID: e.target.value })}
                                />
                              )}
                            </FormItem>
                            <FormItem
                              {...formItemLayout}
                              label="Currency"
                            >
                              {getFieldDecorator('curency', {
                                rules: [
                                  { required: true, message: 'Currency is required!', whitespace: true },
                                ],
                                initialValue: null
                              })(
                                <Select
                                  placeholder='Your Currency'
                                  onChange={(value) => this.props.onChangeCurrency(value.toString())}
                                >
                                  {
                                    this.props.currencies ? this.props.currencies.map((item) => (<Option value={item._id} key={item.code}>{`${item.name} (${item.code})`}</Option>)) : ''
                                  }
                                </Select>
                              )}
                            </FormItem>
                            <FormItem
                              {...formItemLayout}
                              label="Payment Method"
                            >
                              {getFieldDecorator('paymentMethod', {
                                initialValue: null,
                              })(
                                <Select
                                  placeholder='Select a payment'
                                  onChange={(value) => this.props.userInfoChange({ paymentMethod: value })}
                                >
                                  <Option key='none' value='none'>None</Option>
                                  <Option key='localBank' value='localBank'>Local Bank</Option>
                                  <Option key='paypal' value='paypal'>Paypal</Option>
                                </Select>
                              )}
                            </FormItem>

                            <FormItem
                              {...formItemLayout}
                              label="Bank Name"
                            >
                              {getFieldDecorator('bankName', {
                                initialValue: null,
                              })(
                                <Input
                                  onChange={(e) => this.props.userInfoChange({ bankName: e.target.value })}
                                />
                              )}
                            </FormItem>
                            <FormItem
                              {...formItemLayout}
                              label="Account Holder Name"
                            >
                              {getFieldDecorator('accountHolderName', {
                                initialValue: null,
                              })(
                                <Input
                                  onChange={(e) => this.props.userInfoChange({ accountHolderName: e.target.value })}
                                />
                              )}
                            </FormItem>
                            <FormItem
                              {...formItemLayout}
                              label="Account Number"
                            >
                              {getFieldDecorator('account number', {
                                initialValue: null,
                                rules: [
                                  { pattern: /^\d+$/, message: 'Please key in numbers only', whitespace: true },
                                ],
                              })(
                                <Input
                                  onChange={(e) => e}
                                />
                              )}
                            </FormItem>
                            {/* <FormItem {...tailFormItemLayout} > */}
                            <Button type="primary" id="enjoyhint-submit-basic-btn">Save & Continue</Button>
                            {/* </FormItem> */}
                          </Col>
                          <Col span={11} offset={2} className="date-input-container">
                            <FormItem {...formItemLayout} label='Family Name'>
                              {getFieldDecorator('lastname', {
                                rules: [
                                  { required: true, message: 'Please input your last name!', whitespace: true },
                                  { pattern: /.{2,15}/, message: "Name must be between 2 and 15 characters" },
                                ],
                                initialValue: null,
                                validateTrigger: 'onBlur',
                                validateFirst: true,
                              })(
                                <Input
                                  name='lastName'
                                  placeholder='Last Name'
                                  onChange={(e) => this.props.userInfoChange({ lastName: e.target.value })}
                                />
                              )}
                            </FormItem>
                            <FormItem {...formItemLayout} label="Mobile Number">
                              {getFieldDecorator('phone', {
                                rules: [
                                  { required: true, message: "Please input your phone number" },
                                  { pattern: /^\d{4,15}$/, message: "Phone number must be from 4 - 15 digits" },
                                  {
                                    validator: (_rule, _value, callback) => {
                                      if (!this.props.phoneID) {
                                        callback("Please Select Your Country Code");
                                      }
                                      callback();
                                    }
                                  }
                                ],
                                validateTrigger: 'onBlur',
                                validateFirst: true,
                                initialValue: null,
                              })(
                                <Input
                                  addonBefore={phoneIdSelector()}
                                  style={{ width: '100%' }}
                                  name='phoneNumber'
                                  placeholder='Mobile Number'
                                  onChange={(e) => this.props.userInfoChange({ phoneNumber: e.target.value })} />
                              )}
                            </FormItem>

                            <FormItem
                              {...formItemLayout}
                              label={(
                                <span>Date of Birth</span>
                              )}
                            >
                              {getFieldDecorator('dayofbirth', {
                                rules: [],
                                validateTrigger: ['onBlur', 'onChange'],
                                initialValue: null,
                              })(
                                <Input
                                  style={{ width: '100%' }}
                                  type="date"
                                  min="1900-01-01"
                                  onChange={(e) => this.props.userInfoChange({ dob: new Date(e.target.value as any) })}
                                />
                              )}
                              {/* <div className="custom-antd-date-picker">
                          <DatePicker
                            value={this.props.dob ? moment(this.validateDate(this.props.dob)) : moment()}
                            style={{ position: 'absolute', right: '0px', bottom: '14px' }}
                            format="DD MMM YYYY"
                            allowClear={false}
                            showToday={false}
                            placeholder='Date Of Birth'
                            onChange={(value) => this.changeBirthday(value)}
                          />
                        </div> */}
                            </FormItem>
                            <FormItem {...formItemLayout} label='Currently Based In'>
                              {getFieldDecorator('basedIn', {
                                initialValue: null,
                              })(
                                <Select
                                  placeholder='Select your currently based in'
                                  onChange={(value) => this.props.userInfoChange({ currentlyBasedIn: value })}
                                >
                                  <Option value="demo">Demo</Option>
                                </Select>
                              )}
                            </FormItem>
                            <FormItem
                              {...formItemLayout}
                              label="Time Zone"
                            >
                              {getFieldDecorator('timeZone', {
                                rules: [
                                  { required: true, message: 'Timezone is required!', whitespace: true },
                                ],
                                initialValue: null,
                              })(
                                <Select
                                  placeholder='Your Time Zone'
                                  onChange={(value) => value}
                                >
                                  {
                                    <Option value="demo">Demo</Option>
                                  }
                                </Select>
                              )}
                            </FormItem>
                            <FormItem
                              {...formItemLayout}
                              label="Trial Session"
                            >
                              {getFieldDecorator('trialSession', {
                                initialValue: 0,
                              })(
                                <Select
                                  placeholder='Allow Trial Session'
                                  onChange={(value) => this.props.userInfoChange({ hourlyPerSessionTrial: value })}
                                >
                                  <Option key='none' value={0} >None</Option>
                                  <Option key='30m' value={0.5} >30 minutes</Option>
                                  <Option key='60m' value={1} >60 minutes</Option>
                                </Select>
                              )}
                            </FormItem>
                          </Col>
                        </Form>
                      </Layout>
                    </Row>
                  </Row>
                </Layout>

                <Row style={{ padding: 20 }} id="enjoyhint-about-me">
                  <Row>
                    <Col span={12}>
                      <Element name="aboutMe" >
                        <h1 id='biography'>About Me</h1>
                      </Element>
                    </Col>
                    <Col span={10}></Col>
                  </Row>

                  <hr style={{ marginBottom: '40px' }} />
                  <Row>
                    <Row>
                      <Col span={15}>
                        <h4>Primary Speaking Language <a style={{ color: '#f5222d' }}>*</a></h4>
                        <AutoComplete
                          style={{ width: '100%' }}
                          value={""}
                          dataSource={[]}
                          placeholder="The main language you will be teaching in."
                          filterOption={(inputValue, option) => (option as any).props.children.toString().toUpperCase().indexOf(inputValue.toUpperCase()) !== -1}
                          onChange={(value) => this.props.userInfoChange({ biography: { language: value, nationality: this.props.biography.nationality, aboutMe: this.props.biography.aboutMe, secondaryLanguage: this.props.biography.secondaryLanguage } })}
                        />
                      </Col>
                      <Col span={1}></Col>
                      <Col span={8}>
                        <h4>Secondary Languages</h4>
                        <AutoComplete
                          style={{ width: '100%' }}
                          value={""}
                          dataSource={[]}
                          placeholder='Other languages you can speak'
                          filterOption={(inputValue, option) => (option as any).props.children.toString().toUpperCase().indexOf(inputValue.toUpperCase()) !== -1}
                          onChange={(value) => this.props.userInfoChange({ biography: { language: this.props.biography.language, nationality: this.props.biography.nationality, aboutMe: this.props.biography.aboutMe, secondaryLanguage: value } })}
                        />
                      </Col>
                    </Row>
                    <Row style={{ marginTop: '15px' }}>
                      <Col span={15}>
                        <h4>Description <a style={{ color: '#f5222d' }}>*</a></h4>
                        <Input.TextArea
                          placeholder="Tell the students a little about yourself."
                          value={""}
                          onChange={(e) => this.props.userInfoChange({ biography: { language: this.props.biography.language, nationality: this.props.biography.nationality, aboutMe: e.target.value, secondaryLanguage: this.props.biography.secondaryLanguage } })}
                          style={{ width: '100%' }}
                          autosize={true}
                        />
                      </Col>
                      <Col span={24} style={{ marginTop: '20px' }}>
                        <Button
                          type='primary'
                        >Save & Continue</Button>
                      </Col>
                    </Row>
                  </Row>
                </Row>
                <Row style={{ marginTop: '40px', padding: 20 }} id="enjoyhint-education">
                  <Row>
                    <Col span={12} >
                      <Element name="education" className='education-header' >
                        Education
                </Element>
                    </Col>
                    <Col span={10}>
                    </Col>
                  </Row>
                  <hr style={{ marginBottom: '40px' }} />
                  <div>
                    <Col span={8} >
                      <h4>Current Education <a style={{ color: '#f5222d' }}>*</a></h4>
                      <Select
                        style={{ width: '95%' }}
                        value={""}
                        onChange={(value) => this.props.userInfoChange({
                          education: {
                            highestEducation: value,
                            major: this.props.education ? this.props.education.major : null,
                            university: this.props.education.university,
                            fileListDocument: this.props.education.fileListDocument
                          }
                        })}
                      >
                        {
                          <Option value={"demo"}>Demo</Option>
                        }
                      </Select>
                    </Col>
                    <Col span={8} style={{}}>
                      <h4>Major <a style={{ color: '#f5222d' }}>*</a></h4>
                      <Input
                        style={{ width: '95%' }}
                        value={""}
                        onChange={(e) => this.props.userInfoChange({
                          education: {
                            major: e.target.value,
                            highestEducation: this.props.education.highestEducation,
                            university: this.props.education.university,
                            fileListDocument: this.props.education.fileListDocument
                          }
                        })}
                      />
                    </Col>
                    <Col span={8} style={{}}>
                      <h4>Institution <a style={{ color: '#f5222d' }}>*</a></h4>
                      <Input
                        style={{ width: '95%', marginBottom: '15px' }}
                        value={""}
                        onChange={(e) => this.props.userInfoChange({
                          education: {
                            university: e.target.value,
                            highestEducation: this.props.education.highestEducation,
                            major: this.props.education.major,
                            fileListDocument: this.props.education.fileListDocument
                          }
                        })}
                      />
                    </Col>
                    <h4>File Upload (File size should not exceed 10mb)</h4>
                    <div style={{ padding: '0px ' }}>
                      <Col span={12} style={{ marginBottom: '12px' }}>
                        <Upload
                          fileList={[]}
                          onChange={(info) => info}>
                          <Button>
                            <Icon type='upload' /> Click to Upload
                    </Button>
                        </Upload>
                      </Col>
                      <Col span={12} style={{ marginBottom: '12px' }}>
                        <Upload
                          fileList={[]}
                          onChange={(info) => info}>
                          <Button>
                            <Icon type='upload' /> Click to Upload
                    </Button>
                        </Upload>
                      </Col>
                      <Col span={12} style={{ marginBottom: '12px' }}>
                        <Upload
                          fileList={[]}
                          onChange={(info) => info}>
                          <Button>
                            <Icon type='upload' /> Click to Upload
                    </Button>
                        </Upload>
                      </Col>
                      <Col span={12} style={{ marginBottom: '12px' }}>
                        <Upload
                          fileList={[]}
                          onChange={(info) => info}>
                          <Button>
                            <Icon type='upload' /> Click to Upload
                    </Button>
                        </Upload>
                      </Col>
                    </div>
                    <Col span={24} style={{ marginTop: '20px' }}>
                      <Button
                        type='primary'
                      >Save & Continue</Button>
                    </Col>
                  </div>

                </Row>
                <Row style={{ marginTop: '40px', padding: 20 }} id='enjoyhint-exp'>
                  <Row>
                    <Col span={12}>
                      <h1 id='teaching-experience'>Experience</h1>
                    </Col>
                    <Col span={10}>
                    </Col>
                  </Row>
                  <hr />
                  <Table
                    rowKey={(record) => record}
                    size='middle'
                    columns={columnsTeacherExperience}
                    dataSource={[]}
                    pagination={false}
                    locale={{ emptyText: 'No Experience' }}
                  />

                  <Col span={24} style={{ marginTop: '20px' }}>
                    <Button type='primary' onClick={() => this.props.addFieldTeacherExperience()} style={{ marginRight: 10 }}>
                      Add field
            </Button>
                    <Button
                      style={{ width: 85 }}
                      type="primary"
                      onClick={() => false}
                    >
                      Save
              </Button>
                  </Col>
                </Row>
              </Layout> : <div></div>
          }

          {
            this.state.screen === 3 ?
              <Layout style={{ background: '#fff', padding: '0px 30px 20px 30px' }}>
                <Row style={{ marginTop: '40px' }}>
                  <Row>
                    <Col span={12}>
                      <h1 id='teaching-experience'>Subjects</h1>
                    </Col>
                    <Col span={10}>
                    </Col>
                  </Row>
                  <hr />
                  <Tabs activeKey={this.state.activeKey} animated={false}>
                    <TabPane tab="Individual tuition" key="1">
                      <Layout style={{ padding: 20, marginTop: 0 }} className='white-theme' id="teaching-subject">
                        <Table
                          rowKey={(record) => record._id}
                          size='middle'
                          columns={columnsTeacherSubject}
                          dataSource={this.state.demoCourses}
                          locale={{ emptyText: 'You have no individual tuition.' }}
                          pagination={{ position: 'bottom', pageSize: 10 }}
                        />

                        <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '10px 10px' }}>
                          <Button type='primary' onClick={this.showCreateIndividualModal} style={{ marginRight: 10 }} id="enjoyhint-individual-btn">
                            <Icon type='plus' /> Add subject
                          </Button>
                          <Button type="primary" icon="save">Save</Button>
                        </div>

                        <Modal
                          width={1200}
                          title="Create new subject"
                          visible={this.state.createIndividualModal}
                          onOk={this.hideCreateIndividualModal}
                          onCancel={this.hideCreateIndividualModal}
                          okText="Create"
                          cancelButtonProps={{ style: { display: 'none' } }}
                          okButtonProps={{ id: "enjoyhint-create-indi-btn" }}
                          style={{ zIndex: 22 }}
                        >
                          <div>
                            <div id="enjoyhint-search-individual">
                              <Form>
                                <h3>Find Course:</h3>
                                <Form.Item style={{ width: '20%', display: 'inline-block', padding: '0px 10px' }}>
                                  <AutoComplete
                                    dataSource={[]}
                                    placeholder="Country"
                                    filterOption={(inputValue, option) => (option as any).props.children.toString().toUpperCase().indexOf(inputValue.toUpperCase()) !== -1}
                                    onChange={(value) => value}
                                  />
                                </Form.Item>
                                <Form.Item style={{ width: '20%', display: 'inline-block', padding: '0px 10px' }}>
                                  <Select placeholder='Select Level' style={{ minWidth: '150' }} onChange={(value) => value}>
                                  </Select>
                                </Form.Item>
                                <Form.Item style={{ width: '20%', display: 'inline-block', padding: '0px 10px' }}>
                                  <Select placeholder='Select Grade' style={{ minWidth: '150px' }} onChange={(value) => value}>
                                  </Select>
                                </Form.Item>
                                <Form.Item style={{ width: '20%', display: 'inline-block', padding: '0px 10px' }}>
                                  <Select
                                    style={{ minWidth: '150px' }}
                                    placeholder='Select Subject'
                                    onChange={(value) => value}
                                  >
                                  </Select>
                                </Form.Item>
                                <Form.Item style={{ width: '20%', display: 'inline-block', padding: '0px 10px' }}>
                                  <Button type="primary">Search</Button>
                                </Form.Item>
                              </Form>
                            </div>
                            <div id="enjoyhint-lookup-table">
                              <Table
                                rowKey={(record) => record._id}
                                size='middle'
                                columns={columnsTeacherSubjectModal}
                                dataSource={this.props.coursesLookup}
                                locale={{ emptyText: 'No Teaching Subject' }}
                              />
                            </div>
                          </div>
                        </Modal>
                      </Layout>
                    </TabPane>
                    <TabPane tab="Group tuition" key="2">
                      <Layout style={{ padding: 20, marginTop: 0 }} className='white-theme' id="teaching-subject">
                        <div style={{ position: 'absolute', right: '0px', top: '2px' }}>
                          <Button type='primary' id="enjoyhint-add-group-btn" onClick={this.openCreateGroupModal} style={{ float: "right" }} >
                            <Icon type='plus' /> Add group tuition
                          </Button>
                        </div>
                        <p style={{ textAlign: 'center' }}>You have no group tuition.</p>

                        <Modal
                          width={1200}
                          title="Create new group tuition"
                          visible={this.state.groupModal}
                          onOk={this.hideGroupModal}
                          onCancel={this.hideGroupModal}
                          okText="Create"
                          cancelButtonProps={{ style: { display: 'none' } }}
                          footer={[<Button id="enjoyhint-group-tuition-save-btn" key="submit" type="primary" onClick={this.hideGroupModal}>
                            Save
                        </Button>
                          ]}
                        >
                          <div>
                            <Form>
                              <Row>
                                <Row id="enjoyhint-group-tuition-first-half">
                                  <Col xs={24} sm={12} md={8} lg={5}>
                                    <h4 style={{ textAlign: 'left', padding: '0px 10px' }}>Country</h4>
                                    <Form.Item style={{ width: '100%', display: 'block', padding: '0px 10px' }}>
                                      {getFieldDecorator('country', {
                                      })(
                                        <AutoComplete
                                          placeholder="Country"
                                        />
                                      )}
                                    </Form.Item>
                                  </Col>
                                  <Col xs={24} sm={12} md={8} lg={5}>
                                    <h4 style={{ textAlign: 'left', padding: '0px 10px' }}>Subject</h4>
                                    <Form.Item style={{ width: '100%', display: 'block', padding: '0px 10px' }}>
                                      {getFieldDecorator('subject', {
                                      })(
                                        <Select
                                          placeholder="Subject"
                                        >
                                        </Select>
                                      )}
                                    </Form.Item>
                                  </Col>
                                  <Col xs={24} sm={12} md={8} lg={5}>
                                    <h4 style={{ textAlign: 'left', padding: '0px 10px' }}>Level</h4>
                                    <Form.Item style={{ width: '100%', display: 'block', padding: '0px 10px' }}>
                                      {getFieldDecorator('level', {
                                      })(
                                        <Select
                                          placeholder="Level"
                                        >
                                        </Select>
                                      )}
                                    </Form.Item>
                                  </Col>
                                  <Col xs={24} sm={12} md={8} lg={5}>
                                    <h4 style={{ textAlign: 'left', padding: '0px 10px' }}>Grade</h4>
                                    <Form.Item style={{ width: '100%', display: 'block', padding: '0px 10px' }}>
                                      {getFieldDecorator('grade', {
                                      })(
                                        <Select
                                          placeholder="Grade"
                                        >
                                        </Select>
                                      )}
                                    </Form.Item>
                                  </Col>
                                  <Col xs={24} sm={12} md={8} lg={4}>
                                    <h4 style={{ textAlign: 'left', padding: '0px 10px' }}>Hourly rate</h4>
                                    <div style={{ display: 'flex' }}>
                                      <Form.Item style={{ width: 'auto', display: 'block', padding: '0px 10px', marginBottom: '0px' }}>
                                        {getFieldDecorator('hourlyRate', {
                                        })(
                                          <Input
                                            style={{ display: 'inline-block' }}
                                            type="number"
                                            placeholder="Hourly Rate"
                                          />
                                        )}
                                      </Form.Item>
                                      <span style={{ display: 'flex', alignItems: 'center' }}>{this.props.profileState ? (this.props.profileState.currency && this.props.profileState.currency.code) ? this.props.profileState.currency.code : "SGD" : "SGD"}</span>
                                    </div>
                                  </Col>
                                  <Col xs={24} sm={12} md={8} lg={5}>
                                    <h4 style={{ textAlign: 'left', padding: '0px 10px' }}>Number of lessons</h4>
                                    <Form.Item style={{ width: '100%', display: 'block', padding: '0px 10px' }}>
                                      {getFieldDecorator('session', {

                                      })(
                                        <Input
                                          type="number"
                                          placeholder="Number of lessons"
                                        />
                                      )}
                                    </Form.Item>
                                  </Col>
                                  <Col xs={24} sm={12} md={8} lg={5}>
                                    <h4 style={{ textAlign: 'left', padding: '0px 10px' }}>Duration</h4>
                                    <Form.Item style={{ width: '100%', display: 'block', padding: '0px 10px' }}>
                                      {getFieldDecorator('hourPerSession', {

                                      })(
                                        <Select
                                          style={{ width: '100%' }}
                                          placeholder="Lesson's duration ( hour )"
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
                                  <Col xs={24} sm={12} md={8} lg={5}>
                                    <h4 style={{ textAlign: 'left', padding: '0px 10px' }}>Class size</h4>
                                    <Col xs={12}>
                                      <Form.Item style={{ display: 'inline-block', padding: '0px 10px', width: '100%' }}>
                                        {getFieldDecorator('minClassSize', {

                                        })(
                                          <div style={{ display: 'flex', alignItems: 'center' }}>
                                            <span style={{ marginRight: '5px' }}>Min</span>
                                            <Input
                                              width='100%'
                                              type="number"
                                              min="2"
                                            />
                                          </div>
                                        )}
                                      </Form.Item>
                                    </Col>
                                    <Col xs={12}>
                                      <Form.Item style={{ display: 'inline-block', padding: '0px 10px', width: '100%' }}>
                                        {getFieldDecorator('maxClassSize', {

                                        })(
                                          <div style={{ display: 'flex', alignItems: 'center' }}>
                                            <span style={{ marginRight: '5px' }}>Max</span>
                                            <Input
                                              type="number"
                                              min="2"
                                            />
                                          </div>
                                        )}
                                      </Form.Item>
                                    </Col>
                                  </Col>
                                  <Col xs={24} sm={12} md={10} lg={9}>
                                    <h4 style={{ textAlign: 'left', padding: '0px 10px' }}>Registration period</h4>
                                    <Col xs={12}>
                                      <Form.Item style={{ display: 'inline-block', padding: '0px 10px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center' }}>
                                          <span style={{ marginRight: '10px' }}>From</span>
                                          <DatePicker
                                            style={{ display: 'inline-block' }}
                                            format="DD MMM YYYY"
                                            allowClear={false}
                                            showToday={true}
                                            placeholder='From'
                                          />
                                        </div>
                                      </Form.Item>
                                    </Col>
                                    <Col xs={12}>
                                      <Form.Item style={{ display: 'inline-block', padding: '0px 10px' }}>
                                        {getFieldDecorator('Reg', {

                                        })(
                                          <div style={{ display: 'flex', alignItems: 'center' }}>
                                            <span style={{ marginRight: '10px' }}>To</span>
                                            <DatePicker
                                              style={{ display: 'inline-block' }}
                                              format="DD MMM YYYY"
                                              allowClear={false}
                                              showToday={true}
                                              placeholder='To'
                                            />
                                          </div>
                                        )}
                                      </Form.Item>
                                    </Col>
                                  </Col>
                                </Row>
                                <Row id="enjoyhint-group-tuition-second-half">
                                  <Col xs={24}>
                                    <h4 style={{ paddingLeft: '10px', marginBottom: '0px' }}>Lesson Schedule</h4>
                                  </Col>
                                  <Col xs={24} lg={16} className="custom-calendar">
                                    <DragAndDropCalendar
                                      key={1}
                                      selectable={false}
                                      defaultDate={this.inputDateInUserTimezone()}
                                      defaultView={Calendar.Views.WEEK}
                                      events={[]}
                                      style={{ minHeight: '800px', width: '734px', marginLeft: '10px', marginRight: '24px' }}
                                      scrollToTime={new Date(1970, 1, 1, 6)}
                                      popup={true}
                                      views={['month', 'week']}
                                      formats={{
                                        timeGutterFormat: (date, culture, localizer) =>
                                          localizer.format(date, 'HH:mm', culture),
                                        eventTimeRangeFormat: ({ start, end }, culture, localizer) => {
                                          let s = localizer.format(start, 'HH:mm', culture);
                                          let e = localizer.format(end, 'HH:mm', culture);
                                          return `${s} - ${e}`;
                                        },
                                        agendaTimeRangeFormat: ({ start, end }, culture, localizer) => {
                                          let s = localizer.format(start, 'HH:mm', culture);
                                          let e = localizer.format(end, 'HH:mm', culture);
                                          return `${s} - ${e}`;
                                        },
                                        dayRangeHeaderFormat: ({ start, end }, culture, localizer) => {
                                          let s = localizer.format(start, 'MMM DD', culture);
                                          let e = localizer.format(end, 'MMM DD', culture);
                                          return `${s} - ${e}`;
                                        }
                                      }}
                                    />
                                  </Col>
                                  <Col xs={24} lg={8} style={{ marginTop: '20px' }}>
                                    <Table
                                      size='small'
                                      pagination={false}
                                      columns={groupColumns}
                                      rowKey={(_record, index) => index.toString()}
                                      dataSource={[]}
                                    />
                                  </Col>
                                </Row>
                              </Row>
                            </Form>
                            <div>
                              <h4>1. A sum equal to 25% of all respective charges will be applied by SkyAce Learning. You will receive 75% of the fees that you charge.</h4>
                              <h4>2. Please send us an email at support@skyace-learning.com if the subject you intend to teach is not in the list provided.</h4>
                              <h4>3. Please allow at least two weeks' registration period for all group tuitions.</h4>
                            </div>
                          </div>
                        </Modal>
                      </Layout>
                    </TabPane>
                  </Tabs>
                </Row>
              </Layout> : <div></div>
          }
          {
            this.state.screen === 4 ?
              <div style={{ background: 'white', margin: '20px', padding: '20px' }}>
                <Row gutter={24}>
                  <Col xs={24} sm={24} md={24} lg={15}>
                    <Row style={{ padding: '0px 20px 0px 20px' }} id="enjoyhint-availability-instructions">
                      <Row style={{ marginBottom: 16 }}>
                        <h1 style={{}}>Availability</h1>
                        <h2>Instruction</h2>
                        <Content>1. All listed timings are in your local time zone.</Content>
                        <Content>2. You can set or edit your availability by clicking or dragging across the time slots.</Content>
                        <Content>3. To remove availability, hover to the date selection to delete.</Content>
                        <Content>4. All additions or removals are automatically saved.</Content>
                      </Row>
                      <Row style={{ marginBottom: 10 }}>
                        <Col span={8}>
                          <Row>
                            <Col span={8}>
                              <div style={{ width: 70, height: 20, background: '#44FF55', borderRadius: 5 }}></div>
                            </Col>
                            <Col span={14}>
                              <Content>
                                <Col span={1}>
                                  <span>: </span>
                                </Col>
                                <Col span={23}>
                                  <span>Available</span>
                                </Col>
                              </Content>
                            </Col>
                          </Row>
                        </Col>
                        <Col span={8}>
                          <Row>
                            <Col span={8}>
                              <div style={{ width: 70, height: 20, background: '#FFFFFF', borderRadius: 5, border: '1px solid' }}></div>
                            </Col>
                            <Col span={14}>
                              <Content>
                                <Col span={1}>
                                  <span>: </span>
                                </Col>
                                <Col span={23}>
                                  <span>Not Available</span>
                                </Col>
                              </Content>
                            </Col>
                          </Row>
                        </Col>
                        <Col span={8}>
                          <Row>
                            <Col span={8}>
                              <div style={{ width: 70, height: 20, background: '#AAAAAA', borderRadius: 5 }}></div>
                            </Col>
                            <Col span={14}>
                              <Col span={1}>
                                <span>: </span>
                              </Col>
                              <Col span={23}>
                                <span>Booked by Student</span>
                              </Col>
                            </Col>
                          </Row>
                        </Col>

                      </Row>
                      <Row>
                        <Col span={8}>
                          <Row>
                            <Col span={8}>
                              <div style={{ width: 70, height: 20, background: '#FF6666', borderRadius: 5 }}></div>
                            </Col>
                            <Col span={14}>
                              <Content>
                                <Col span={1}>
                                  <span>: </span>
                                </Col>
                                <Col span={23}>
                                  <span>Group Tuition</span>
                                </Col>
                              </Content>
                            </Col>
                          </Row>
                        </Col>
                        <Col span={8}>
                          <Row>
                            <Col span={8}>
                              <div style={{ width: 70, height: 20, background: '#FFAAAA', borderRadius: 5 }}></div>
                            </Col>
                            <Col span={14}>
                              <Content>
                                <Col span={1}>
                                  <span>: </span>
                                </Col>
                                <Col span={23}>
                                  <span>Blocked for Group Tuition</span>
                                </Col>
                              </Content>
                            </Col>
                          </Row>
                        </Col>

                      </Row>
                    </Row>
                    <Row id="enjoyhint-avail-dnd-calendar">
                      <DragAndDropCalendar
                        views={['month', 'week']}
                        selectable={true}
                        defaultDate={this.inputDateInUserTimezone()}
                        defaultView={Calendar.Views.WEEK}
                        events={[]}
                        style={{ height: '800px', padding: '20px 0px 20px 20px', marginRight: '24px' }}
                        scrollToTime={new Date(1970, 1, 1, 6)}
                        resizable={true}
                        popup={true}
                        formats={{
                          timeGutterFormat: (date, culture, localizer) =>
                            localizer.format(date, 'HH:mm', culture),
                          eventTimeRangeFormat: ({ start, end }, culture, localizer) => {
                            let s = localizer.format(start, 'HH:mm', culture);
                            let e = localizer.format(end, 'HH:mm', culture);
                            return `${s} - ${e}`;
                          },
                          agendaTimeRangeFormat: ({ start, end }, culture, localizer) => {
                            let s = localizer.format(start, 'HH:mm', culture);
                            let e = localizer.format(end, 'HH:mm', culture);
                            return `${s} - ${e}`;
                          },
                          dayRangeHeaderFormat: ({ start, end }, culture, localizer) => {
                            let s = localizer.format(start, 'MMM DD', culture);
                            let e = localizer.format(end, 'MMM DD', culture);
                            return `${s} - ${e}`;
                          }
                        }}
                      />
                    </Row>
                  </Col>
                  <Col xs={24} sm={24} md={24} lg={9} >
                    <h2>Availability Slots</h2>
                    <Table
                      size='small'
                      pagination={false}
                      columns={availColumns}
                      dataSource={[]}
                    />
                  </Col>
                </Row>
              </div> : <div></div>
          }

          {
            this.state.screen === 5 ?
              <Layout style={{ background: "#fff", padding: "40px 30px 20px 30px" }}>
                <h1> Hello, {this.props.profileState.fullName || this.props.profileState.firstName + ' ' + this.props.profileState.lastName}</h1>
                <hr />
                <Row className="dashboard-row">
                  <h2>Notifications</h2>
                  <Col xs={24} style={{ textAlign: 'left' }}>
                    <p style={{ color: '#f5222d', textAlign: 'left' }}>You don't have any new notifications.</p>
                  </Col>
                </Row>

                <Row className="dashboard-row">
                  <h2>Upcoming Tuitions</h2>
                  <div style={{ textAlign: 'left'}}>
                  <Row style={{ marginTop: "20px", paddingLeft: "20px" }}>
                    <Col span={4}>
                      <Avatar
                        size="large"
                        style={{ width: "100px", height: "100px" }}
                        src={'/static/default.png'}
                        icon="user"
                      />
                      <p>
                        <b>Student Skyace</b>
                      </p>
                    </Col>
                    <Col xs={24} sm={24} md={16} lg={12} style={{ paddingTop: "10px" }}>
                      <div>
                        <b>
                          <span>
                            <a style={{ color: "#000" }}>
                              <Icon type="book" /> Singapore: ITE or Vocational - English
                            </a>
                          </span>
                        </b>
                      </div>
                        <div>
                          <div>
                            <Icon type="credit-card" /> {`Post Secondary - 1 lesson`}
                          </div>
                          <div>
                            <Icon type="solution" theme="outlined" /> ENPI-190219-170263
                          </div>
                        </div>
                      <div>
                        <Icon type="clock-circle-o" /> {`1 hour per lesson`}
                      </div>
                    </Col>
                    <Col xs={4} sm={4} md={4} lg={8} className='button-go-to-tuition'>
                      <div>
                        <Button className='button-go-to-tuition-detail' id='enjoyhint-go-to-tuition-button' type="primary" onClick={() => this.changeScreen(6)}>
                          <a>Go to tuition</a>
                        </Button>
                      </div>
                    </Col>
                  </Row>
                  </div>
                </Row>

                <Row className="dashboard-row">
                  <h2>My tuition bookings</h2>
                  <div style={{ textAlign: 'left', color: '#f5222d' }}>
                    {`You don't have any current tuition bookings.`}
                  </div>
                </Row>

              </Layout> : <div></div>
          }

          {
            this.state.screen === 6 ?
            <Layout style={{ background: "white", padding: 40 }}>
              <div className="common-info">
                <Row gutter={24}>
                  <Col span={12}>
                    <h1>Singapore - English: ITE or Vocational</h1>
                  </Col>
                  <Col span={12} style={{ height: '56px', lineHeight: '56px', textAlign: 'right' }}>
                      <Button
                      style={{ minWidth: '242px', textAlign: 'center', background: '#f4424e', color: '#ffffff', border: '1px solid #f4424e' }}
                    >
                      {this.props.languageState.TUITION_DETAIL_PAGE_CANCEL_TUITION.translated}
                    </Button>
                  </Col>
                </Row>

                <Row gutter={24}>
                  <Col span={24}>
                    <table style={{ border: '1px solid #e8e8e8', width: '100%' }}>
                      <tbody>
                        <tr style={{ border: '1px solid #e8e8e8', height: '36px' }}>
                          <td style={{ border: '1px solid #e8e8e8', padding: '0 16px', fontWeight: 'bold' }}><Icon type="book" /> {this.props.languageState.TUITION_DETAIL_PAGE_TUITION_SUBJECT.translated}</td>
                          <td colSpan={5} style={{ border: '1px solid #e8e8e8', padding: '0 16px', fontWeight: 'bold' }}>
                            Singapore - English: Post Secondary
                          </td>
                        </tr>
                        <tr style={{ border: '1px solid #e8e8e8', height: '36px' }}>
                          <td style={{ border: '1px solid #e8e8e8', padding: '0 16px', fontWeight: 'bold' }}><Icon type="solution" theme="outlined" /> {this.props.languageState.TUITION_DETAIL_PAGE_TUITION_ID.translated}</td>
                          <td colSpan={5} style={{ border: '1px solid #e8e8e8', padding: '0 16px', fontWeight: 'bold' }}>
                            ENPI-190219-170263
                          </td>
                        </tr>
                        <tr style={{ border: '1px solid #e8e8e8', height: '36px' }}>
                          <td style={{ border: '1px solid #e8e8e8', padding: '0 16px', fontWeight: 'bold' }}><Icon type="bars" /> {this.props.languageState.TUITION_DETAIL_PAGE_NUMBER_OF_LESSONS.translated}</td>
                          <td style={{ border: '1px solid #e8e8e8', padding: '0 16px', fontWeight: 'bold' }}>1</td>
                          <td style={{ border: '1px solid #e8e8e8', padding: '0 16px', fontWeight: 'bold' }}><Icon type="bars" /> {this.props.languageState.TUITION_DETAIL_PAGE_HOURS_PER_LESSON.translated}</td>
                          <td style={{ border: '1px solid #e8e8e8', padding: '0 16px', fontWeight: 'bold' }}>1 hour</td>
                          <td style={{ border: '1px solid #e8e8e8', padding: '0 16px', fontWeight: 'bold' }}><Icon type="clock-circle-o" /> {this.props.languageState.TUITION_DETAIL_PAGE_HOURLY_RATE.translated}</td>
                          <td style={{ border: '1px solid #e8e8e8', padding: '0 16px', fontWeight: 'bold' }}>100 SGD per hour
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </Col>
                </Row>
              </div>

              <div className="detailed-info" style={{ marginTop: '30px' }}>
                <div className="detailed-info-description">
                  <Row style={{ marginBottom: 20 }}>
                    <a style={{ fontWeight: 600, color: 'black', fontSize: 21, marginTop: 10, marginRight: 15 }}>{this.props.languageState.TUITION_DETAIL_PAGE_STUDENT.translated}: Student Skyace</a>
                    <Avatar src={'/static/default.png'}></Avatar>
                  </Row>
                  <h2 style={{ fontWeight: 600 }}>{this.props.languageState.TUITION_DETAIL_PAGE_COURSE_DETAIL.translated}</h2>

                  <p>{this.props.languageState.TUITION_DETAIL_PAGE_REFER_TO_BELOW.translated}</p>
                  <p>{this.props.languageState.TUITION_DETAIL_PAGE_LEAVE_STUDENT.translated}</p>
                  <p>{this.props.languageState.TUITION_DETAIL_PAGE_STUDENT_LATE.translated}</p>
                </div>
                <div className="sessions-list">
                  <Card title={
                    <div style={{ fontWeight: 'bold' }}>
                      <div>Lesson 1 - Lesson 1</div>
                    </div>}>
                    <Row type="flex" gutter={24}>
                      <Col span={6} style={{ marginBottom: '12px' }} id='enjoyhint-session-card' onClick={() => this.changeScreen(7)}>
                        <Card.Grid
                          style={{
                            width: '100%',
                            fontWeight: 'bold',
                            cursor: 'pointer',
                            position: 'relative',
                            background: '#1890ff',
                            color: '#ffffff'
                          }}
                        >
                          {this.props.languageState.TUITION_DETAIL_PAGE_LESSON.translated} 1
                          <br />
                          <span style={{position: 'absolute', top: '10px', right: '10px'}}><Tag color="orange">Paid</Tag></span>
                          <div>Start: {moment().format('DD MMM YYYY - HH:mm')}</div>
                          <div>
                            {this.props.languageState.TUITION_DETAIL_PAGE_COURSE_LESSON_END.translated}: {moment().format('DD MMM YYYY - HH:mm')} &nbsp;
                          </div>
                        </Card.Grid>
                      </Col>
                    </Row>
                  </Card>
                </div>
              </div>
            </Layout>
            : <div></div>
          }

          {
            this.state.screen === 7 ?
            <Layout style={{ background: "white", padding: 40 }}>
            <div className="session-info">
              <h1>Singapore - English - ITE or Vocational By Tutor: Skyace</h1>
                <p>
                  {this.props.languageState.SESSION_DETAIL_PAGE_LESSON_START_AT.translated} <b>{extendedMoment().format('HH:mm')}</b><b>, </b><b>{extendedMoment().format(' DD MMM YYYY')}</b>
                  {this.props.languageState.SESSION_DETAIL_PAGE_LESSON_CLASS_APROXX.translated}
                </p>
              <div className="buttons">
                <Button
                  id='enjoyhint-session-start-class'
                  type="primary"
                  style={{ marginRight: '12px'}}
                >
                  <span>{this.props.languageState.SESSION_DETAIL_PAGE_JOIN_CLASS.translated}</span>
                </Button>
                <Button type="primary" id='enjoyhint-session-reschedule' onClick={() => this.setState({rescheduleModalVisible: true})}>
                  {this.props.languageState.SESSION_DETAIL_PAGE_RESCHEDULE.translated}
                </Button>

                <Modal
                  title={this.props.languageState.SESSION_DETAIL_PAGE_RESCHEDULE_MODAL_TITLE.translated}
                  visible={this.state.rescheduleModalVisible}
                  onOk={() => this.setState({rescheduleModalVisible: false})}
                  onCancel={() => this.setState({rescheduleModalVisible: false})}
                  width={920}
                  footer={[<Button id="enjoyhint-session-reschedule-save-btn" key="submit" type="primary" onClick={() => this.setState({rescheduleModalVisible: false})}>
                    Save
                  </Button>]}
                  destroyOnClose={true}
                >
                  <div id='enjoyhint-session-reschedule-dndc'>
                    <DragAndDropCalendar
                      views={['month', 'week']}
                      selectable={true}
                      defaultDate={this.inputDateInUserTimezone(new Date())}
                      defaultView={Calendar.Views.WEEK}
                      events={[]}
                      style={{ height: '65vh', padding: '20px 0px 20px 20px' }}
                      scrollToTime={new Date(1970, 1, 1, 6)}
                      popup={true}
                      formats={{
                        timeGutterFormat: (date, culture, localizer) =>
                          localizer.format(date, 'HH:mm', culture),
                        eventTimeRangeFormat: ({ start, end }, culture, localizer) => {
                          let s = localizer.format(start, 'HH:mm', culture);
                          let e = localizer.format(end, 'HH:mm', culture);
                          return `${s} - ${e}`;
                        },
                        agendaTimeRangeFormat: ({ start, end }, culture, localizer) => {
                          let s = localizer.format(start, 'HH:mm', culture);
                          let e = localizer.format(end, 'HH:mm', culture);
                          return `${s} - ${e}`;
                        },
                        dayRangeHeaderFormat: ({ start, end }, culture, localizer) => {
                          let s = localizer.format(start, 'MMM DD', culture);
                          let e = localizer.format(end, 'MMM DD', culture);
                          return `${s} - ${e}`;
                        }
                      }}
                    />
                  </div>
                </Modal>
              </div>
            </div>

            <div className="session-material" style={{ marginTop: "64px" }}>
              <Row gutter={24}>
                <Col span={12}>
                  <h1>{this.props.languageState.SESSION_DETAIL_PAGE_LESSON_MATERIALS.translated}</h1>
                </Col>
                <Col span={12} style={{ height: '56px', lineHeight: '56px', textAlign: 'right' }}>
                  <Button id='enjoyhint-upload-material-btn' type="primary" icon='upload' onClick={() => this.setState({materialModal: true})}>
                    {this.props.languageState.SESSION_DETAIL_PAGE_UPLOAD_MATERIAL.translated}
                  </Button>
                  <Modal
                    title={this.props.languageState.SESSION_DETAIL_PAGE_UPLOAD_MATERIAL.translated}
                    visible={this.state.materialModal}
                    footer={[<Button id="enjoyhint-session-material-save-btn" key="submit" type="primary" onClick={() => this.setState({materialModal: false})}>
                      Save
                    </Button>]}
                    okText='Save'
                  >
                    <div className="uploadMaterrial" id='enjoyhint-session-material-upload-btn'>
                      <Upload.Dragger
                        fileList={[]}
                      >
                        <p className="ant-upload-drag-icon">
                          <Icon type="inbox" />
                        </p>
                        <p className="ant-upload-text">{this.props.languageState.SESSION_DETAIL_PAGE_UPLOAD_TEXT.translated}</p>
                      </Upload.Dragger>
                      </div>
                  </Modal>
                </Col>
              </Row>
              <div id='enjoyhint-material-table'>
                <Table
                  dataSource={[]}
                  columns={sessionColumns}
                  rowKey={(record : any) => record._id}
                />
              </div>
            </div>

            <div className="session-material" style={{ marginTop: "64px" }}>
              <Row gutter={24}>
                <Col span={24}>
                  <h1>Recordings</h1>
                </Col>
              </Row>
              <div>
                <p>This session has no recording or recordings are being processed.</p>
                <p>Note: Link will be expired in 7 days from end time.</p>
              </div>
            </div>
          </Layout> : <div></div>
          }
          <Footer>
            Copyright © 2018 SkyAce™ Learning. All Rights Reserved
          </Footer>
        </Layout>
      </div>
    );
  }
}

export default Form.create()(Tutorial);