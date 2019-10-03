import * as React from "react";
import { Avatar, Layout, Row, Col, Button, Icon } from "antd";
import Link from 'next/link';
import * as _ from 'lodash';
import withRematch from "../rematch/withRematch";
import initStore from "../rematch/store";
import moment from 'moment';
import { getTuitionsService, getUsersService, getTutorSchedulesService, getCourseService } from "../service-proxies";
import UserLayout from "../layout/UserLayout";
import './tutor-preference.css';
import { extendMoment } from 'moment-range';
import NotificationDashboard from '../components/NotificationDashboard';
import Tutorial from '../components/Tutorial';
const extendedMoment = extendMoment(moment);

class TutorDashboard extends React.Component<any, any> {
  state = {
    newestSeeMore: [] as any,
    unreadMessageCount: 0,
    unreadConversations: [],
    userNotifications: {} as any,
    unreadData: [],
    isFirstTimeLoggedIn: this.props.profileState.firstTimeLoggedIn || false
  }

  static async getInitialProps(props: any) {
    const usersService = getUsersService();
    const tutorSchedulesService = getTutorSchedulesService();
    const resultSchedules = await tutorSchedulesService.find(
      new Date(extendedMoment().startOf('week').toString()).toUTCString() as any,
      new Date(extendedMoment().endOf('week').toString()).toUTCString() as any,
      props.store.getState().profileModel._id
    );
    var infoUser: any = await usersService.findTutorById(
      props.store.getState().profileModel._id
    );
    const courses = await usersService.findTutorCoursesById(
      props.store.getState().profileModel._id
    );
    if (!props.req) {
      const tuitionsService = getTuitionsService(props.store.getState().profileModel.token);
      props.store.dispatch.tutorDashboardPageModel.fetchDataUserSuccess({ infoUser: infoUser, courses: courses, schedules: resultSchedules });

      let result: any;
      if (props.store.getState().profileModel.roles.indexOf('tutor') > -1) {
        result = await tuitionsService.getNewestBookings(
          props.store.getState().profileModel._id,
        );

        const upcomingTuitions = await tuitionsService.getUpcomingTuitions(props.store.getState().profileModel._id);

        props.store.dispatch.tutorDashboardPageModel.fetchUpcomingTuitionsSuccess({ result: upcomingTuitions });
        props.store.dispatch.tutorDashboardPageModel.fetchNewestBookingsSuccess({ result });
      }
    } else {
      props.store.dispatch.tutorDashboardPageModel.fetchUpcomingTuitionsSuccess({ result: props.query.upcomingTuitions });
      props.store.dispatch.tutorDashboardPageModel.fetchNewestBookingsSuccess({ result: props.query.newestBookings });
      props.store.dispatch.tutorDashboardPageModel.fetchDataUserSuccess({ infoUser: infoUser, courses: courses, schedules: resultSchedules });
    }

    const coursesService = getCourseService();
    const coursesAvailableLookup = await coursesService.getAllCourses();
    return {
      coursesLookup: coursesAvailableLookup
    };
  }

  endTutorial = async () => {
    this.setState({
      isFirstTimeLoggedIn: false
    });
    // call request here
    const usersService = getUsersService();
    await usersService.update({
      _id: this.props.profileState._id,
      firstTimeLoggedIn: false
    } as any);
    window.location.reload();
  }

  inputDateInUserTimezone = (date: any = new Date().toString()) => {
    const browserTimezone = - new Date().getTimezoneOffset() / 60;
    const userTimezone = this.props.profileState.timeZone && this.props.profileState.timeZone.offset ? this.props.profileState.timeZone.offset : browserTimezone;
    const deltaTimezone = userTimezone - browserTimezone;

    return new Date(new Date(date).getTime() + deltaTimezone * 60 * 60 * 1000);
  }

  paginationChange = (pageNumber, pageSize) => {
    this.props.handleFilterChange({
      pageNumber,
      pageSize,
    });
    this.props.fetchData({
      isStudent: this.props.profileState.roles.indexOf('student') > -1 ? true : false,
      userId: this.props.profileState._id,
      isFinished: this.props.viewType === 'current' ? false : true,
      pageNumber,
      pageSize,
      sortBy: this.props.sortBy,
      asc: this.props.asc
    });
  }

  calculateLesson = (array, _id) => {
    return array.findIndex((val) => {
      return val === _id;
    }) + 1;
  }

  toggleNewestView = (_id) => {
    if (this.state.newestSeeMore && this.state.newestSeeMore.length && this.state.newestSeeMore.indexOf(_id) >= 0) {
      this.setState({
        newestSeeMore: this.state.newestSeeMore.filter(val => val !== _id)
      })
    } else {
      this.setState({
        newestSeeMore: [...this.state.newestSeeMore, _id]
      })
    }
  }

  render() {
    return (
      <div>
        {!this.state.isFirstTimeLoggedIn ?
          <UserLayout profileState={this.props.profileState} profileReducers={this.props.profileReducers} editProfilePageState={this.props.editProfilePageState} languageState={this.props.languageState}>
            <Layout style={{ background: "#fff", padding: "40px 30px 20px 30px" }}>
              {this.props.courseForTutor && this.props.courseForTutor.length && this.props.schedulesForTuTor && this.props.schedulesForTuTor.total > 0 && this.props.dob
                ? null
                : <Row style={{ background: '#fff', padding: 20, borderRadius: 10, marginBottom: 20, border: '1px solid' }}>
                  <h3>{this.props.languageState.TUTOR_DASHBOARD_PAGE_CHECK_INFO.translated}</h3>
                  <Row>
                    <a href={'/edit-profile-user'}>{this.props.languageState.TUTOR_DASHBOARD_PAGE_PROFILE.translated}</a>
                  </Row>
                  <Row>
                    <span><a href={'/tutoring/subjects'}>{this.props.languageState.TUTOR_DASHBOARD_PAGE_TUTORING_SUBJECTS.translated}</a></span>
                  </Row>
                  <Row>
                    <span><a href={'/calendar/tutor'}>{this.props.languageState.TUTOR_DASHBOARD_PAGE_TUTORING_AVAILABILITY.translated}</a></span>
                  </Row>
                </Row>}
              <h1> {this.props.languageState.TUTOR_DASHBOARD_PAGE_HELLO.translated}
            , {this.props.profileState.fullName || this.props.profileState.firstName + ' ' + this.props.profileState.lastName}</h1>
              <hr />
              <Row className="dashboard-row">
                <h2>{this.props.languageState.TUTOR_DASHBOARD_PAGE_NOTIFICATIONS.translated}</h2>
                <Col xs={24} style={{ textAlign: 'left' }}>
                  <NotificationDashboard
                    profileState={this.props.profileState}
                    languageState={this.props.languageState}
                  />
                </Col>
              </Row>

              <Row className="dashboard-row">
                <h2>{this.props.languageState.TUTOR_DASHBOARD_PAGE_UPCOMING_TUITION.translated}</h2>

                {this.props.upcomingTuitions.length === 0 ? (
                  <div style={{ textAlign: 'left', color: '#f5222d' }}>
                    {this.props.languageState.TUTOR_DASHBOARD_PAGE_MESSAGE_DONT_HAVE_UPCOMING_TUITIONS.translated}
                  </div>
                ) : this.props.upcomingTuitions.map((item, index) => (
                  <Row key={index}>
                    <Col xs={24} style={{ margin: '10px 0px' }}>
                      <Col span={4} style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start' }}>
                        <div>
                          <Avatar
                            size="large"
                            style={{ width: "100px", height: "100px", display: "flex", alignItems: "center", justifyContent: "center" }}
                            src={item.courseForTutor && item.courseForTutor.isGroup ? '/static/group-tuition.png' : (item.student.imageUrl || '/static/default.png')}
                            icon="user"
                          />
                          <p>
                            <b>{item.courseForTutor && item.courseForTutor.isGroup ? this.props.languageState.TUTOR_DASHBOARD_PAGE_GROUP_TUITION.translated : item.student.fullName}</b>
                          </p>
                        </div>
                      </Col>
                      <Col xs={24} sm={24} md={16} lg={12} style={{ paddingTop: "10px" }}>
                        <div>
                          <b>
                            <span>
                              <Link href={item.courseForTutor && item.courseForTutor.isGroup ? `/calendar/group-tuition-detail/${item._id}` : `/calendar/tuition-detail/${item._id}`}>
                                {item.course.country === 'trial'
                                  ? <a style={{ color: "#000" }}>
                                    <Icon type="book" /> {this.props.languageState.TUTOR_DASHBOARD_PAGE_FREE_TRIAL.translated}
                              </a>
                                  : <a style={{ color: "#000" }}>
                                    <Icon type="book" /> {`${item.course.country}: ${item.course.grade} - ${item.course.subject}`}
                                  </a>}
                              </Link>
                            </span>
                          </b>
                        </div>
                        {item.course.country === 'trial'
                          ? <div>
                            <Icon type="credit-card" /> {item.course.session} {this.props.languageState.TUTOR_DASHBOARD_PAGE_LESSON.translated}
                      </div>
                          : <div>
                            <Icon type="credit-card" /> {`${item.course.level} - ${item.course.session} ${this.props.languageState.TUTOR_DASHBOARD_PAGE_LESSONS.translated}`}
                          </div>}

                        <div>
                          <Icon type="clock-circle-o" /> {`${item.course.hourPerSession} ${item.course.hourPerSession > 1 ? this.props.languageState.TUTOR_DASHBOARD_PAGE_HOURS.translated : this.props.languageState.TUTOR_DASHBOARD_PAGE_HOUR.translated} ${this.props.languageState.TUTOR_DASHBOARD_PER_LESSONS.translated}`}
                        </div>
                        {
                          item.courseForTutor && item.courseForTutor.isGroup ?
                            (
                              <div>
                                <Icon type="team" theme="outlined" style={{ marginRight: '5px' }} />
                                {Array.apply(null, { length: item.course.maxClassSize } as any).map((_val, index) => index < item.students.length ? 1 : 0).map((val) => {
                                  return <img src={val ? '/static/user-black.png' : '/static/user-gray.png'} style={{ width: '16px', height: '16px', marginRight: '5px' }} />
                                })}
                                <span>{`(${item.students.length} ${this.props.languageState.TUTOR_DASHBOARD_PAGE_OF.translated} ${item.course.maxClassSize} ${this.props.languageState.TUTOR_DASHBOARD_PAGE_SLOT_TAKEN.translated}`}</span>
                              </div>
                            ) : <div></div>
                        }
                        <div>
                          <Icon type="calendar" /> {`${this.props.languageState.TUTOR_DASHBOARD_LESSON_$.translated}${this.calculateLesson(item.sessions, item.upcomingSessions[0]._id)} :
                        ${this.inputDateInUserTimezone(item.upcomingSessions[0].start).toLocaleDateString()}, ${this.inputDateInUserTimezone(item.upcomingSessions[0].start).toLocaleTimeString()} - ${this.inputDateInUserTimezone(item.upcomingSessions[0].end).toLocaleTimeString()}`}
                        </div>
                      </Col>
                      <Col xs={4} sm={4} md={4} lg={8} className='button-go-to-tuition'>
                        <Link href={item.courseForTutor && item.courseForTutor.isGroup ? `/calendar/group-tuition-detail/${item._id}` : `/calendar/tuition-detail/${item._id}`}>
                          <Button className='button-go-to-tuition-detail' type="primary">
                          <a>{this.props.languageState.TUTOR_DASHBOARD_GOTO_TUITION.translated}</a>
                          </Button>
                        </Link>
                      </Col>
                    </Col>
                    {index === this.props.upcomingTuitions.length - 1 ?
                      <div></div> :
                      <Col span={20} style={{ float: 'left' }}>
                        <hr></hr>
                      </Col>
                    }
                  </Row>
                ))
                }
              </Row>

              <Row className="dashboard-row">
              <h2>{this.props.languageState.TUTOR_DASHBOARD_MY_TUITION_BOOKINGS.translated}</h2>
                {this.props.newestBookings.length === 0 ? (
                  <div style={{ textAlign: 'left', color: '#f5222d' }}>
                    {`${this.props.languageState.TUTOR_DASHBOARD_MESSANGE_BOOKINGS.translated}`}
                  </div>
                ) : this.props.newestBookings.map((item, index) => (
                  <Row>
                    <Col xs={24} key={index} style={{ margin: '10px 0px' }}>
                      <Col span={4} style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start' }}>
                        {item.courseForTutor && item.courseForTutor.isGroup ?
                          <div>
                            <Avatar
                              size="large"
                              style={{ width: "100px", height: "100px", display: "flex", alignItems: "center", justifyContent: "center" }}
                              src='/static/group-tuition.png'
                            />
                            <p>
                              <b>{this.props.languageState.TUTOR_DASHBOARD_GROUP_TUITION.translated}</b>
                            </p>
                          </div> :
                          <div>
                            <Avatar
                              size="large"
                              style={{ width: "100px", height: "100px", display: "flex", alignItems: "center", justifyContent: "center" }}
                              src={item.student.imageUrl || '/static/default.png'}
                              icon="user"
                            />
                            <p>
                              <b>{item.student.fullName}</b>
                            </p>
                          </div>}
                      </Col>
                      <Col xs={24} sm={24} md={16} lg={12} style={{ paddingTop: "10px" }}>
                        <div>
                          <b>
                            <span>
                              <Link href={item.courseForTutor && item.courseForTutor.isGroup ? `/calendar/group-tuition-detail/${item._id}` : `/calendar/tuition-detail/${item._id}`}>
                                {item.course.country === 'trial'
                                  ? <a style={{ color: "#000" }}>
                                    <Icon type="book" /> {this.props.languageState.TUTOR_DASHBOARD_PAGE_FREE_TRIAL.translated}
                              </a>
                                  : <a style={{ color: "#000" }}>
                                    <Icon type="book" /> {`${item.course.country}: ${item.course.grade} - ${item.course.subject}`}
                                  </a>}
                              </Link>
                            </span>
                          </b>
                        </div>
                        {item.course.country === 'trial'
                          ? <div>
                            <Icon type="credit-card" /> {item.course.session} {this.props.languageState.TUTOR_DASHBOARD_PAGE_LESSON.translated}
                          </div>
                          : <div>
                            <Icon type="credit-card" /> {`${item.course.level} - ${item.course.session} ${this.props.languageState.TUTOR_DASHBOARD_PAGE_LESSONS.translated}`}
                          </div>}
                        <div>
                          <Icon type="clock-circle-o" /> {`${item.course.hourPerSession} ${item.course.hourPerSession > 1 ? this.props.languageState.TUTOR_DASHBOARD_PAGE_HOURS.translated : this.props.languageState.TUTOR_DASHBOARD_PAGE_HOUR.translated} ${this.props.languageState.TUTOR_DASHBOARD_PER_LESSONS.translated}`}
                        </div>
                        {
                          item.courseForTutor && item.courseForTutor.isGroup ?
                            (
                              <div>
                                <Icon type="team" theme="outlined" style={{ marginRight: '5px' }} />
                                {Array.apply(null, { length: item.course.maxClassSize } as any).map((_val, index) => index < item.students.length ? 1 : 0).map((val) => {
                                  return <img src={val ? '/static/user-black.png' : '/static/user-gray.png'} style={{ width: '16px', height: '16px', marginRight: '5px' }} />
                                })}
                                <span>{`(${item.students.length} ${this.props.languageState.TUTOR_DASHBOARD_PAGE_OF.translated} ${item.course.maxClassSize} ${this.props.languageState.TUTOR_DASHBOARD_PAGE_SLOT_TAKEN.translated}`}</span>
                              </div>
                            ) : <div></div>
                        }
                        <div>
                          <Icon type="check-circle" theme="outlined" /> Status : {item.courseForTutor && item.courseForTutor.isGroup ?
                            (item.isActive ?
                              (item.students.length >= item.course.minClassSize ? <span style={{ color: 'green' }}>{this.props.languageState.TUTOR_DASHBOARD_PAGE_ACTIVE.translated}</span> : <span style={{ color: 'green' }}>{this.props.languageState.TUTOR_DASHBOARD_PAGE_PENDING.translated}</span>)
                              : item.students.length >= item.course.minClassSize ? item.isCanceled ? <span style={{ color: 'red' }}>{this.props.languageState.TUTOR_DASHBOARD_PAGE_CANCELED.translated}</span> : <span style={{ color: '#f08223' }}>{this.props.languageState.TUTOR_DASHBOARD_PAGE_COMPLETED.translated}</span> : <span style={{ color: 'red' }}>{this.props.languageState.TUTOR_DASHBOARD_PAGE_INACTIVE.translated}</span>)
                            : (item.isCanceled ? <span style={{ color: 'red' }}>{this.props.languageState.TUTOR_DASHBOARD_PAGE_CANCELED.translated}</span> : item.isCompleted ? <span style={{ color: '#f08223' }}>{this.props.languageState.TUTOR_DASHBOARD_PAGE_COMPLETED.translated}</span> : <span style={{ color: 'green' }}>{this.props.languageState.TUTOR_DASHBOARD_PAGE_ACTIVE.translated}</span>)
                          }
                        </div>
                        <div>
                          <Icon type="calendar" /> Lessons
                      {
                            item.courseForTutor && item.courseForTutor.isGroup ?
                              <Row>
                                {item.period.length ?
                                  item.period.length > 4 ?
                                    <div>
                                      {this.state.newestSeeMore.indexOf(item._id) >= 0 ?
                                        item.period.map((period, index) => (
                                          <Col span={12}>
                                            <span style={{ marginRight: '5px' }}>{`#${index + 1}`}</span>
                                            <span>{`${this.inputDateInUserTimezone(period.start).toLocaleDateString()}, ${this.inputDateInUserTimezone(period.start).toLocaleTimeString()} - ${this.inputDateInUserTimezone(period.end).toLocaleTimeString()}`}</span>
                                          </Col>
                                        )) :
                                        item.period.slice(0, 4).map((period, index) => (
                                          <Col span={12} key={index}>
                                            <span style={{ marginRight: '5px' }}>{`#${index + 1}`}</span>
                                            <span>{`${this.inputDateInUserTimezone(period.start).toLocaleDateString()}, ${this.inputDateInUserTimezone(period.start).toLocaleTimeString()} - ${this.inputDateInUserTimezone(period.end).toLocaleTimeString()}`}</span>
                                          </Col>
                                        ))
                                      }
                                      <Col span={24}>
                                        <a onClick={() => this.toggleNewestView(item._id)}>{this.state.newestSeeMore.indexOf(item._id) >= 0 ? this.props.languageState.TUTOR_DASHBOARD_PAGE_SEE_LESS.translated : this.props.languageState.TUTOR_DASHBOARD_PAGE_SEE_MORE.translated}</a>
                                      </Col>
                                    </div>
                                    : <div>
                                      {item.period.map((period, index) => (
                                        <Col span={12}>
                                          <span style={{ marginRight: '5px' }}>{`#${index + 1}`}</span>
                                          <span>{`${this.inputDateInUserTimezone(period.start).toLocaleDateString()}, ${this.inputDateInUserTimezone(period.start).toLocaleTimeString()} - ${this.inputDateInUserTimezone(period.end).toLocaleTimeString()}`}</span>
                                        </Col>
                                      ))}
                                    </div>
                                  : <div></div>}
                              </Row> :
                              <Row>
                                {item.sessions.length ?
                                  item.sessions.length > 4 ?
                                    <div>
                                      {this.state.newestSeeMore.indexOf(item._id) >= 0 ?
                                        item.sessions.map((session, index) => (
                                          <Col span={12}>
                                            <span style={{ marginRight: '5px' }}>{`#${index + 1}`}</span>
                                            <span>{`${this.inputDateInUserTimezone(session.start).toLocaleDateString()}, ${this.inputDateInUserTimezone(session.start).toLocaleTimeString()} - ${this.inputDateInUserTimezone(session.end).toLocaleTimeString()}`}</span>
                                          </Col>
                                        )) :
                                        item.sessions.slice(0, 4).map((session, index) => (
                                          <Col span={12}>
                                            <span style={{ marginRight: '5px' }}>{`#${index + 1}`}</span>
                                            <span>{`${this.inputDateInUserTimezone(session.start).toLocaleDateString()}, ${this.inputDateInUserTimezone(session.start).toLocaleTimeString()} - ${this.inputDateInUserTimezone(session.end).toLocaleTimeString()}`}</span>
                                          </Col>
                                        ))
                                      }
                                      <Col span={24}>
                                        <a onClick={() => this.toggleNewestView(item._id)}>{this.state.newestSeeMore.indexOf(item._id) >= 0 ? this.props.languageState.TUTOR_DASHBOARD_PAGE_SEE_LESS.translated : this.props.languageState.TUTOR_DASHBOARD_PAGE_SEE_MORE.translated}</a>
                                      </Col>
                                    </div>
                                    : <div>
                                      {item.sessions.map((session, index) => (
                                        <Col span={12}>
                                          <span style={{ marginRight: '5px' }}>{`#${index + 1}`}</span>
                                          <span>{`${this.inputDateInUserTimezone(session.start).toLocaleDateString()}, ${this.inputDateInUserTimezone(session.start).toLocaleTimeString()} - ${this.inputDateInUserTimezone(session.end).toLocaleTimeString()}`}</span>
                                        </Col>
                                      ))}
                                    </div>
                                  : <div></div>}
                              </Row>
                          }
                        </div>
                      </Col>
                      <Col xs={4} sm={4} md={4} lg={8} className='button-go-to-tuition' >
                        <Link href={item.courseForTutor && item.courseForTutor.isGroup ? `/calendar/group-tuition-detail/${item._id}` : `/calendar/tuition-detail/${item._id}`}>
                          <Button className='button-go-to-tuition-detail' type="primary">
                            <a>{this.props.languageState.TUTOR_DASHBOARD_PAGE_GO_TO_TUITION.translated}</a>
                          </Button>
                        </Link>
                      </Col>
                    </Col>
                  </Row>
                ))
                }
              </Row>

            </Layout>
          </UserLayout>
          : <Tutorial profileState={this.props.profileState} endTutorial={this.endTutorial} coursesLookup={this.props.coursesLookup} languageState={this.props.languageState}></Tutorial>}
      </div>
    );
  }
}

const mapState = (rootState: any) => {
  return {
    ...rootState.tutorDashboardPageModel,
    profileState: rootState.profileModel,
    editProfilePageState: rootState.editProfilePageModel,
    languageState: rootState.languageModel,
  };
};

const mapDispatch = (rootReducer: any) => {
  return {
    ...rootReducer.tutorDashboardPageModel,
    profileReducers: rootReducer.profileModel,
    editProfilePageReducers: rootReducer.editProfilePageModel,
  };
};

export default withRematch(initStore, mapState, mapDispatch)(
  TutorDashboard
);
