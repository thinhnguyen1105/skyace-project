import * as React from 'react';
import { Row, Col, Layout, Menu, Icon, Popover, Badge, Button, Dropdown, Input, Select, Checkbox, Avatar, Card, Tag, Popconfirm, Modal, Table } from 'antd';
import Head from 'next/head';
import Link from 'next/link';
import Calendar from 'react-big-calendar';
import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop';
import TeacherInformation from '../components/TeacherInformation';
import * as Scroll from 'react-scroll';
import TutorOverview from '../components/information-tutor-page/TutorOverview';
import moment from 'moment';
import 'react-big-calendar/lib/addons/dragAndDrop/styles.css';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { extendMoment } from 'moment-range';

const extendedMoment = extendMoment(moment);

const DragAndDropCalendar = withDragAndDrop(Calendar);
Calendar.setLocalizer(Calendar.momentLocalizer(moment));

class StudentTutorial extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      screen: 1,
      init: false,
      rescheduleModalVisible: false
    }
  }

  changeScreen = (screen) => {
    this.setState({
      screen
    })
  }

  inputDateInUserTimezone = (date: any = new Date().toString()) => {
    const browserTimezone = - new Date().getTimezoneOffset() / 60;
    const userTimezone = this.props.profileState.timeZone && this.props.profileState.timeZone.offset ? this.props.profileState.timeZone.offset : browserTimezone;
    const deltaTimezone = userTimezone - browserTimezone;

    return new Date(new Date(date).getTime() + deltaTimezone * 60 * 60 * 1000);
  }

  componentDidMount() {
    const endTutorial = () => {
      this.props.endTutorial();
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
              //
            }
          });

          //simple config. 
          //Only one step - highlighting(with description) "New" button 
          //hide EnjoyHint after a click on the button.
          var enjoyhint_script_steps = [
            {
              'click #enjoyhint-find-a-tutor-anchor': 'Click here to start finding your tutor',
              'showNext': false,
              'showSkip': false
            },
            {
              'click #enjoyhint-find-a-tutor-info': 'Click on a tutor to view detail information',
              'showNext': false,
              'showSkip': false
              // "skipButton": { text: "Finish" }
            },
            {
              'click #enjoyhint-teaches-anchor': 'Select your course here',
              'showNext': true,
            },
            {
              'click #enjoyhint-booking-dndc': 'Select your suitable period here',
              'showNext': true,
            },
            {
              'click #enjoyhint-my-tuition-anchor': 'To view your tuitions, click here',
              'showNext': false,
              'showSkip': false,
            },
            {
              'click #enjoyhint-go-to-tuition-btn': 'Go to a specific tuition',
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
              "skipButton": { text: "Finish" }
            },
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

  render() {
    const displayName = this.props.profileState.fullName ? this.props.profileState.fullName : this.props.profileState.email ? this.props.profileState.email : 'New User';
    const { Footer } = Layout;
    const dropdownMenu = (
      <Menu className='user-menu' selectedKeys={[]}>
        <Menu.Item>
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

    const tutor = {
      _id: '5b83a25f5639322b42f5d340',
      email: 'test5@gmail.com',
      firstName: 'Skyace',
      lastName: 'Tutor',
      fullName: 'Skyace Tutor',
      hourlyPerSessionTrial: 0,
      biography: {
        language: 'English',
        nationality: 'Singapore',
        aboutMe: 'Welcome to Skyace.',
        race: 'Singapore',
        gender: 'Male',
        yearsOfExp: 5
      },
      education: {
        highestEducation: 'Secondary',
        major: 'Mathematics',
        university: 'University5'
      },
      teacherExperience: [],
      teacherSubject: {
        listSubject: []
      },
      externalLogin: {
        google: {},
        facebook: {}
      },
      permissions: [],
      roles: [
        'tutor'
      ],
      emailConfirmed: true,
      phone: {
        phoneID: '+355',
        phoneNumber: '243254'
      },
      age: 30,
      rating: 0,
      courseForTutor: [
        {
          tuitions: [],
          isDeleted: false,
          _id: '5b83a25f5639322b42f5d349',
          course: {
            _id: '5b83a25f5639322b42f5d33b',
            subject: 'Physics',
            country: 'Japan',
            level: 'Post Secondary',
            grade: 'Polytechnics',
            session: 9,
            hourPerSession: 1.5,
            isDeleted: false,
            tenant_id: '5b59880ef172d619186f024a',
            __v: 0,
            isConverted: true,
            academicEnd: 'February',
            academicStart: 'January'
          },
          tutor: '5b83a25f5639322b42f5d340',
          hourlyRate: 50,
          tenant_id: '5b59880ef172d619186f024a',
          __v: 0
        }
      ],
      groupTuitionFakeUsers: [],
      firstTimeLoggedIn: true,
      isImported: false,
      distributorPaycheck: [],
      lang: 'en',
      tenant: '5b59880ef172d619186f024a',
      isActive: true,
      createdAt: '2019-02-22T10:00:07.600Z',
      updatedAt: '2019-02-22T10:00:07.600Z',
      esSortingHourlyRate: [
        50
      ],
      esSortingSubject: [
        'Physics'
      ]
    }

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

    const { Content } = Layout;
    const ScrollLink = Scroll.Link;

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
                  <Menu.Item key="student-1" id='enjoyhint-find-a-tutor-anchor' onClick={() => this.changeScreen(2)}>
                    <Link>
                      <a><Icon type="search" />{this.props.languageState.USER_LAYOUT_HEADER_FIND_TUTOR_LINK_TITLE.translated}</a>
                    </Link>
                  </Menu.Item>
                  <Menu.Item key="student-2" id='enjoyhint-my-tuition-anchor' onClick={() => this.changeScreen(4)}>
                    <Link>
                      <a><Icon type="home" />{this.props.languageState.USER_LAYOUT_HEADER_MY_TUITIONS_LINK_TITLE.translated}</a>
                    </Link>
                  </Menu.Item>
                  <Menu.Item key="student-3">
                    <Link>
                      <a><Icon type="table" />{this.props.languageState.USER_LAYOUT_HEADER_MY_CALENDAR_LINK_TITLE.translated}</a>
                    </Link>
                  </Menu.Item>
                  {/* <Menu.SubMenu title={<span><Icon type="team" /><span>Tutoring</span></span>} key="tutor-3">
                    <Menu.Item key="subject">
                      <Link>
                        <a><Icon type="book" /> Subjects</a>
                      </Link>
                    </Menu.Item>

                    <Menu.Item key="availability" id="enjoyhint-availability-anchor" onClick={() => this.changeScreen(4)}>
                      <Link>
                        <a><Icon type="calendar" /> Availability</a>
                      </Link>
                    </Menu.Item>
                  </Menu.SubMenu> */}
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
                <h1>{this.props.languageState.MY_TUITION_PAGE_TITLE.translated}</h1>
                <Button.Group>
                  <Button
                    value="current"
                    size='large'
                    type={'primary'}
                    style={{ minWidth: '180px', textAlign: 'center' }}
                  >
                    {this.props.languageState.MY_TUITION_PAGE_CURRENT.translated}
                  </Button>
                  <Button
                    value="completed"
                    size='large'
                    type={'default'}
                    style={{ minWidth: '180px', textAlign: 'center' }}
                  >
                    {this.props.languageState.MY_TUITION_PAGE_COMPLETED.translated}
                  </Button>
                  <Button
                    value="request-canceled"
                    size='large'
                    type={'default'}
                    style={{ minWidth: '180px', textAlign: 'center' }}
                  >
                    Request Cancel
                  </Button>
                </Button.Group>
                <div style={{ marginTop: '24px', textAlign: 'center', color: '#f5222d' }}>
                  {`${this.props.languageState.MY_TUITION_PAGE_NONE_TUITION.translated} current ${this.props.languageState.MY_TUITION_PAGE_TUITION.translated}.`}
                </div>
              </Layout> : <div></div>
          }

          {
            this.state.screen === 2 ? <div>
              <Row style={{ background: "#bbe3f7", padding: "20px 30px 20px 30px" }}>
                <Col
                  xs={24}
                  lg={12}
                  xl={12}
                >
                  <Input.Search
                    style={{ paddingRight: "10px" }}
                    placeholder={this.props.languageState.HEADER_LOGIN_STUDENT_SEARCH_INPUT_PLACEHOLDER.translated}
                  />
                </Col>
                <Col xs={24} lg={12} xl={12} className="responsive-toggle-option" style={{ display: 'flex', justifyContent: 'flex-end', flexWrap: 'wrap' }}>
                  <div className="responsive-toggle-container" style={{ marginRight: '0px' }}>
                    <div style={{ display: 'inline-block' }}>
                      <Button onClick={this.props.toggleOptions}>
                        <Icon type="bar-chart" /> {this.props.languageState.HEADER_LOGIN_STUDENT_BUTTON_FILTER_TEXT.translated}
                      </Button>
                    </div>

                    <div style={{ display: 'inline-block', marginLeft: '24px' }}>
                      <Select
                        value={`Sort by: Tutor name (A-Z)`}
                        style={{ width: '100%' }}
                      >
                      </Select>
                    </div>
                  </div>
                </Col>
              </Row>
              <div style={{ padding: '40px' }}>
                <Row style={{ marginBottom: 20 }}>
                  <Col xs={24}>
                    <h2 className="responsive-title">{this.props.languageState.FIND_A_TUTOR_PAGE_FIND_A_TUTOR.translated}</h2>
                  </Col>
                </Row>
                <Row>
                  <Col span={24} id='enjoyhint-find-a-tutor-info'>
                    <TeacherInformation
                      currency={this.props.profileState ? (this.props.profileState.currency ? this.props.profileState.currency.code : 'SGD') : 'SGD'}
                      exchangeRate={this.props.profileState ? (this.props.profileState.currency ? this.props.profileState.currency.exchangeRate : 1) : 1}
                      dataLookup={this.props.dataLookupState.findaTutor}
                      _source={tutor}
                      _id={tutor._id}
                      asc={this.props.asc}
                      onClick={() => this.changeScreen(3)}
                      profileState={this.props.profileState}
                      languageState={this.props.languageState}
                    />
                  </Col>
                </Row>
              </div>
            </div> : <div></div>
          }

          {
            this.state.screen === 3 ?
              <Layout style={{ padding: '20px 50px 20px 50px', background: 'white' }}>
                <Content style={{ background: 'white' }}>
                  <h1 style={{ fontWeight: 'bold' }}>Tutor Profile</h1>
                  <Row gutter={6} align='middle' style={{ fontWeight: 'bold', marginBottom: 20, position: 'sticky', top: '0px', zIndex: 5 }}>
                    <Menu mode='horizontal' style={{}}>
                      <Menu.Item className="menu-scroll-link-item">
                        <ScrollLink activeClass="active-scroll-link" style={{ marginRight: '15px' }} to="about" spy={true} smooth={true} duration={500}>
                          About
                    </ScrollLink>
                      </Menu.Item>
                      <Menu.Item className="menu-scroll-link-item">
                        <ScrollLink activeClass="active-scroll-link" style={{ marginRight: '15px' }} to="schedule" spy={true} smooth={true} duration={500}>
                          Schedule
                    </ScrollLink>
                      </Menu.Item>
                      <Menu.Item className="menu-scroll-link-item">
                        <ScrollLink activeClass="active-scroll-link" to="rating" spy={true} smooth={true} duration={500}>
                          Ratings
                    </ScrollLink>
                      </Menu.Item>
                    </Menu>
                  </Row>
                  <div id="about">
                    <Layout style={{ borderRadius: 5, background: '#f4f5f5', marginBottom: 40 }}>
                      <Content className="responsive-content-container">
                        <TutorOverview
                          tutorInfo={tutor as any}
                          dataLookupState={this.props.dataLookupState}
                          profileState={this.props.profileState}
                          languageState={this.props.languageState}
                          scheduleATrial={undefined as any}
                          isBookedTrial={undefined as any}
                        />
                      </Content>
                    </Layout>

                    <Content>
                      <h3>About Me</h3>
                      <Row >
                        <p><b>Speak: </b> {tutor.biography ? tutor.biography.language : ''}</p>
                      </Row>
                      <hr style={{ marginBottom: 20 }} />

                      <h3>Education</h3>
                      <Row align='bottom' style={{ display: 'flex', justifyContent: 'space-between' }}>
                      </Row>
                      <hr style={{ marginBottom: 20 }} />

                      <h3>Teaching Experience</h3>
                      <Row align='bottom'>
                      </Row>
                      <hr style={{ marginBottom: 20 }} />
                    </Content>
                  </div>
                  <div id="schedule" >
                    <h3>Teaches</h3>
                    <Content>
                      <Row align='bottom' id='enjoyhint-teaches-anchor'>
                        <div ref='checkbox-group'>
                          <Checkbox.Group style={{ width: '100%' }}>
                            <Row type='flex'>
                              {tutor.courseForTutor.filter(val => val.course.country === 'trial').map((item, index) => (
                                <Col span={24} key={index} style={{ marginBottom: '8px', fontWeight: 500 }}>
                                  <Checkbox disabled={this.props.isBookedTrial} value={item._id}>{`Trial | ${item.course.session} Lesson | Free`}</Checkbox>
                                </Col>
                              ))}
                              {tutor.courseForTutor.filter(val => val.hourlyRate > 0).length && tutor.courseForTutor.filter((course) => course.hourlyRate > 0).map((item, index) => (
                                <Col span={24} key={index} style={{ marginBottom: '8px', fontWeight: 500 }}>
                                  <Checkbox value={item._id}>{`${item.course.country} | ${item.course.grade} | ${item.course.subject} | ${item.course.session} Lessons | ${(item.hourlyRate)}/hour ${(item.course.academicStart, item.course.academicEnd)}`}</Checkbox>
                                </Col>
                              ))}
                            </Row>
                          </Checkbox.Group>
                        </div>
                      </Row>
                      <hr style={{ marginBottom: 20 }} />

                      <h3>Available Time</h3>
                      <Row type='flex' gutter={24}>
                        <Col lg={15} md={24} sm={24} xs={24}>
                          <Row style={{ padding: '0px 20px 0px 20px' }}>
                            <Row style={{ marginBottom: 16 }}>
                              <Content>1. All listed timings are in your local time zone.</Content>
                              <Content>2. You can select or edit lessons by clicking or dragging across the time slots.</Content>
                              <Content>3. To remove, hover to the selected time slot to delete.</Content>
                              <Content>4. You may choose to repeat lessons based on same day/time for subsequent weeks or choose your own dates.</Content>
                            </Row>
                            <Row style={{ marginBottom: 10 }}>
                              <Col className='label' xs={24} sm={24} md={12} lg={8}>
                                <Row gutter={4}>
                                  <Col xs={12} sm={12} md={9} lg={7}>
                                    <div className='available-label'></div>
                                  </Col>
                                  <Col className='nowrap' xs={12} sm={12} md={15} lg={17}>
                                    <span>: Available</span>
                                  </Col>
                                </Row>
                              </Col>
                              <Col className='label' xs={24} sm={24} md={12} lg={8}>
                                <Row gutter={4}>
                                  <Col xs={12} sm={12} md={9} lg={7}>
                                    <div className='not-available-label'></div>
                                  </Col>
                                  <Col className='nowrap' xs={12} sm={12} md={15} lg={17}>
                                    <span>: Not Available</span>
                                  </Col>
                                </Row>
                              </Col>
                              <Col className='label' xs={24} sm={24} md={12} lg={8}>
                                <Row gutter={4}>
                                  <Col xs={12} sm={12} md={9} lg={7}>
                                    <div className='booked-by-student-label'></div>
                                  </Col>
                                  <Col className='nowrap' xs={12} sm={12} md={15} lg={17}>
                                    <span>: Booked by Others</span>
                                  </Col>
                                </Row>
                              </Col>
                              <Col className='label' xs={24} sm={24} md={12} lg={8}>
                                <Row gutter={4}>
                                  <Col xs={12} sm={12} md={9} lg={7}>
                                    <div className='group-tuition-label'></div>
                                  </Col>
                                  <Col className='nowrap' xs={12} sm={12} md={15} lg={17}>
                                    <span>: Group Tuition</span>
                                  </Col>
                                </Row>
                              </Col>
                              <Col className='label' xs={24} sm={24} md={12} lg={8}>
                                <Row gutter={4}>
                                  <Col xs={12} sm={12} md={9} lg={7}>
                                    <div className='blocked-for-group-tuition-label'></div>
                                  </Col>
                                  <Col className='nowrap' xs={12} sm={12} md={15} lg={17}>
                                    <span>: Blocked For Group</span>
                                  </Col>
                                </Row>
                              </Col>
                              <Col className='label' xs={24} sm={24} md={12} lg={8}>
                                <Row gutter={4}>
                                  <Col xs={12} sm={12} md={9} lg={7}>
                                    <div className='currently-on-hold-label'></div>
                                  </Col>
                                  <Col className='nowrap' xs={12} sm={12} md={15} lg={17}>
                                    <span>: Currently On Hold</span>
                                  </Col>
                                </Row>
                              </Col>
                              <Col className='label' xs={24} sm={24} md={12} lg={8}>
                                <Row gutter={4}>
                                  <Col xs={12} sm={12} md={9} lg={7}>
                                    <div className='your-selection-label'></div>
                                  </Col>
                                  <Col className='nowrap' xs={12} sm={12} md={15} lg={17}>
                                    <span>: Your Selection</span>
                                  </Col>
                                </Row>
                              </Col>
                              <Col className='label' xs={24} sm={24} md={12} lg={8}>
                                <Row gutter={4}>
                                  <Col xs={12} sm={12} md={9} lg={7}>
                                    <div className='your-others-booking-label'></div>
                                  </Col>
                                  <Col className='nowrap' xs={12} sm={12} md={15} lg={17}>
                                    <span>: Your Others Booking</span>
                                  </Col>
                                </Row>
                              </Col>
                            </Row>
                          </Row>
                          <div style={{ background: '#ffffff' }} id='enjoyhint-booking-dndc'>
                            <Scroll.Element name="schedules">
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
                            </Scroll.Element>
                          </div>
                        </Col>
                      </Row>
                      <hr />
                    </Content>
                  </div>
                  <Content id="rating" style={{ minHeight: '650px', paddingTop: '80px' }}>
                    <div style={{ marginTop: '-30px' }}>
                      <h3>Ratings</h3>
                      <p>There is currently no ratings.</p>
                    </div>
                  </Content>
                </Content>
              </Layout> : <div></div>
          }

          {
            this.state.screen === 4 ?
              <Layout style={{ background: "#fff", padding: "40px 30px 20px 30px" }}>
                <h1>{this.props.languageState.MY_TUITION_PAGE_TITLE.translated}</h1>
                <Button.Group>
                  <Button
                    value="current"
                    size='large'
                    type={'primary'}
                    style={{ minWidth: '180px', textAlign: 'center' }}
                  >
                    {this.props.languageState.MY_TUITION_PAGE_CURRENT.translated}
                  </Button>
                  <Button
                    value="completed"
                    size='large'
                    type={'default'}
                    style={{ minWidth: '180px', textAlign: 'center' }}
                  >
                    {this.props.languageState.MY_TUITION_PAGE_COMPLETED.translated}
                  </Button>
                  <Button
                    value="request-canceled"
                    size='large'
                    type={'default'}
                    style={{ minWidth: '180px', textAlign: 'center' }}
                  >
                    Request Cancel
                  </Button>
                </Button.Group>
                <div style={{ marginTop: '24px' }}>
                  <Row style={{ marginTop: "20px", paddingLeft: "20px" }}>
                    <Col span={4}>
                      <Avatar
                        size="large"
                        style={{ width: "100px", height: "100px" }}
                        src={'/static/default.png'}
                        icon="user"
                      />
                      <p><b>Tutor Skyace</b></p>
                    </Col>
                    <Col xs={24} sm={24} md={16} lg={12} style={{ paddingTop: "10px" }}>
                      <div>
                        <b>
                          <span>
                            <Link>
                              <a style={{ color: "#000" }}>
                                <Icon type="book" /> Singapore: ITE or Vocational - English
                              </a>
                            </Link>
                          </span>
                        </b>
                      </div>

                      <div>
                        <div>
                          <Icon type="credit-card" /> 1 lesson
                        </div>
                        <div>
                          <Icon type="solution" theme="outlined" /> ENPI-190219-170263
                        </div>
                      </div>
                      <Icon type="clock-circle-o" /> 1 hour per lesson
                    </Col>
                    <Col xs={4} sm={4} md={4} lg={8} className='button-go-to-tuition'>
                      <div>
                        <Link>
                          <Button className='button-go-to-tuition-detail' id='enjoyhint-go-to-tuition-btn' type="primary" onClick={() => this.changeScreen(5)}>
                            <a>{this.props.languageState.MY_TUITION_PAGE_GO_TO_TUITION.translated}</a>
                          </Button>
                        </Link>
                      </div>
                    </Col>
                  </Row>
                </div>
              </Layout> : <div></div>
          }

          {
            this.state.screen === 5 ? 
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
                    <a style={{ fontWeight: 600, color: 'black', fontSize: 21, marginTop: 10, marginRight: 15 }}>{this.props.languageState.TUITION_DETAIL_PAGE_STUDENT.translated}: Tutor Skyace</a>
                    <Avatar src={'/static/default.png'}></Avatar>
                  </Row>
                  <h2 style={{ fontWeight: 600 }}>{this.props.languageState.TUITION_DETAIL_PAGE_COURSE_DETAIL.translated}</h2>

                  <p>{this.props.languageState.TUITION_DETAIL_PAGE_REFER_TO_BELOW.translated}</p>
                  <p>{this.props.languageState.TUITION_DETAIL_PAGE_LEAVE_TUTOR.translated}</p>
                  <p>{this.props.languageState.TUITION_DETAIL_PAGE_TUTOR_LATE.translated}</p>
                </div>
                <div className="sessions-list">
                  <Card title={
                    <div style={{ fontWeight: 'bold' }}>
                      <div>Lesson 1 - Lesson 1</div>
                    </div>}>
                    <Row type="flex" gutter={24}>
                      <Col span={6} style={{ marginBottom: '12px' }} id='enjoyhint-session-card' onClick={() => this.changeScreen(6)}>
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
            this.state.screen === 6 ?
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
                  <Button type="primary" icon='upload'>
                    {this.props.languageState.SESSION_DETAIL_PAGE_UPLOAD_MATERIAL.translated}
                  </Button>
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
    )
  }
}

export default StudentTutorial;