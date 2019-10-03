import React from 'react';
import { getTuitionsService, getUsersService } from '../../service-proxies';
import UserLayout from '../../layout/UserLayout';
import AlertLoginModal from '../../components/information-tutor-page/AlertLoginModal';
import withRematch from '../../rematch/withRematch';
import initStore from '../../rematch/store';
import ShowMore from 'react-show-more';
import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop';
import { extendMoment } from 'moment-range';
import Calendar from 'react-big-calendar';
import _ from 'lodash';
import moment from 'moment';
import './informationTutor.css';
import './editProfileStudent.css';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import 'react-big-calendar/lib/addons/dragAndDrop/styles.css';
import '../../pages/styles.css';
import { Layout, Col, Row, Spin, Table, Button, message, Modal, List, Rate, Icon } from 'antd';
import RegisterForm from '../../components/landing-page/RegisterForm';
import LoginForm from '../../components/landing-page/LoginForm';
import GroupTuitionOverview from '../../components/GroupTuitionOverview';
import GroupBilling from '../../components/information-tutor-page/GroupBilling';
import PaypalButton from '../../components/paypal/PaypalButton';
import PaypalCurrencies from '../../data_common/PaypalCurrencies';
import ResetPasswordForm from '../../components/landing-page/ResetPasswordForm';
import * as Scroll from 'react-scroll';

const ScrollLink = Scroll.Link;
const { Content } = Layout;

Calendar.setLocalizer(Calendar.momentLocalizer(moment));
const DragAndDropCalendar = withDragAndDrop(Calendar);
const extendedMoment = extendMoment(moment);

class InformationGroupTutor extends React.Component<any, any> {
  static async getInitialProps(props: any) {
    let groupInfo: any = {};
    let tutorInfo: any = {};
    let ratings: any = {};

    const tuitionService = getTuitionsService();
    if (!props.req) {
      groupInfo = await tuitionService.findGroupTuitionByTuitionId(props.query.groupId);
      const usersService = getUsersService(props.store.getState().profileModel.token);
      tutorInfo = await usersService.findTutorById(groupInfo.tutor._id);
      ratings = await usersService.getRatings({
        userId: groupInfo.tutor._id,
        pageSize: 5,
        pageNumber: 1
      })
    } else {
      groupInfo = props.query.groupInfo;
      tutorInfo = props.query.tutorInfo;
      ratings = props.query.ratings;
    }

    props.store.dispatch.informationTutorPageModel.loadRatingSuccess(ratings);

    var studentTuitionList = null as any;
    if (props.store.getState().profileModel) {
      if (props.store.getState().profileModel._id) {
        studentTuitionList = await getTuitionsService().findAllTuitionsByStudentId(props.store.getState().profileModel._id, false, false);
      } else {
        studentTuitionList = null
      }
    } else {
      studentTuitionList = null
    }

    return {
      groupInfo,
      tutorInfo,
      studentTuitionList: studentTuitionList ? (studentTuitionList.data && studentTuitionList.data.length ? studentTuitionList.data : []) : []
    };
  }

  state = {
    duplicatedGroupSessions: [],
    errorModal: false,
    startDayInCalendar: new Date(),
    errorType: null
  }

  async componentDidMount() {
    window.onbeforeunload = () => {
      if (this.props.profileState && this.props.profileState._id) {
        this.props.cancelSlot({
          tuition_id: this.props.groupInfo._id,
          student_id: this.props.profileState._id
        })
      } else return;
    };
  }

  eventStyleGetter = (event, _start, _end, _isSelected) => {
    const completedSchedule = {
      backgroundColor: '#DDFFCC',
      borderRadius: '5px',
      opacity: 1,
      color: '#000000',
      border: '1px solid #DDFFCC',
      display: 'block',
      cursor: 'not-allowed',
      pointerEvents: 'none'
    };

    const currentStudentBooked = {
      backgroundColor: '#FFDD88',
      borderRadius: '5px',
      opacity: 1,
      color: '#000000',
      border: '1px solid #FFDD88',
      display: 'block',
      cursor: 'not-allowed',
      pointerEvents: 'none'
    };

    const otherStudentBooked = {
      backgroundColor: '#AAAAAA',
      borderRadius: '5px',
      opacity: 1,
      color: '#ffffff',
      border: '1px solid #AAAAAA',
      display: 'block',
      cursor: 'not-allowed',
      pointerEvents: 'none'
    };

    const tutorAvailbleSchedule = {
      backgroundColor: '#44FF55',
      borderRadius: '5px',
      opacity: 1,
      color: '#000000',
      border: '1px solid #44FF55',
      display: 'block',
      cursor: 'not-allowed',
      pointerEvents: 'none',
    };

    const currentSelection = {
      backgroundColor: '#44AAFF',
      borderRadius: '5px',
      opacity: 1,
      zIndex: 2,
      color: '#ffffff',
      border: '1px solid #44AAFF',
      display: 'block',
      pointerEvents: 'none'
    };

    const groupTuitionBooked = {
      backgroundColor: '#FF6666',
      borderRadius: '5px',
      zIndex: 2,
      opacity: 1,
      color: '#ffffff',
      display: 'block',
      border: '1px solid #FF6666',
      pointerEvents: 'none'
    }

    if (new Date(event.end).getTime() < new Date().getTime()) {
      return {
        style: completedSchedule,
      };
    } else {
      if (event.type === 'tutor') {
        if (event.isGroup) {
          if (event.isFromOtherBooked) {
            return {
              style: currentStudentBooked
            }
          } else {
            return {
              style: groupTuitionBooked
            }
          }
        } else {
          return {
            style: tutorAvailbleSchedule
          }
        }
      } else if (((event.type === 'student' || event.type === 'trial') && event.owner === this.props.profileState._id && event._id) || event.isFromOtherBooked) {
        return {
          style: currentStudentBooked
        };
      } else if (event.type === 'student' && event.owner !== this.props.profileState._id && event._id) {
        return {
          style: otherStudentBooked
        };
      } else {
        return {
          style: currentSelection
        };
      }
    }
  }

  calculateLocaleHourlyRate = (input) => {
    const exchangeRate = this.props.profileState ? this.props.profileState.currency && this.props.profileState.currency.exchangeRate ? this.props.profileState.currency.exchangeRate : 1 : 1;
    const currency = this.props.profileState ? this.props.profileState.currency && this.props.profileState.currency.code ? this.props.profileState.currency.code : 'SGD' : 'SGD'
    return Math.round((input / exchangeRate)).toLocaleString() + ' ' + currency;
  }

  inputDateInUserTimezone = (date: any = new Date().toString()) => {
    const browserTimezone = - new Date().getTimezoneOffset() / 60;
    const userTimezone = this.props.profileState.timeZone && this.props.profileState.timeZone.offset ? this.props.profileState.timeZone.offset : browserTimezone;
    const deltaTimezone = userTimezone - browserTimezone;

    return new Date(new Date(date).getTime() + deltaTimezone * 60 * 60 * 1000);
  }

  outputDateInUserTimezone = (date: any = new Date().toString()) => {
    const browserTimezone = - new Date().getTimezoneOffset() / 60;
    const userTimezone = this.props.profileState.timeZone && this.props.profileState.timeZone.offset ? this.props.profileState.timeZone.offset : browserTimezone;
    const deltaTimezone = userTimezone - browserTimezone;

    return new Date(new Date(date).getTime() - deltaTimezone * 60 * 60 * 1000);
  }

  convertLocalToUTC = (date) => {
    return date.toUTCString();
  }

  navigate = (thisDay: any, viewType: string, _navigateType: string) => {
    this.setState({
      startDayInCalendar: thisDay
    })
    this.props.loadTutorSchedules({
      start: this.convertLocalToUTC(new Date(extendedMoment(thisDay).startOf(viewType as any).toString())),
      end: this.convertLocalToUTC(new Date(extendedMoment(thisDay).endOf(viewType as any).toString())),
      tutorId: this.props.tutorInfo._id
    });
  }

  handleViewChange = (viewType: string) => {
    this.props.loadTutorSchedules({
      start: this.convertLocalToUTC(new Date(extendedMoment(this.state.startDayInCalendar).startOf(viewType as any).toString())),
      end: this.convertLocalToUTC(new Date(extendedMoment(this.state.startDayInCalendar).endOf(viewType as any).toString())),
      tutorId: this.props.tutorInfo._id
    });
  }

  checkBooking = async () => {
    try {
      const results = await getTuitionsService().checkBookingCondition({
        tuition_id: this.props.groupInfo._id,
        student_id: this.props.profileState._id
      }) as any;
      if (results.code === 'SUCCESS') {
        // TODO : Proceed to payment
        // TODO : Hold slot
        this.props.holdSlot({
          tuition_id: this.props.groupInfo._id,
          student_id: this.props.profileState._id
        });
        this.props.openPaymentModal();
      } else {
        if ((results.code === "ERROR" || results.code === "ERROR_GROUP") && results.data && results.data.length) {
          // TODO : Show error modal
          this.setState({
            duplicatedGroupSessions: results.data,
            errorModal: true,
            errorType: results.code
          })
        }
      }
    } catch (error) {
      message.error(error.message, 4);
    }
  }

  onClosePaymentModal = async () => {
    await this.props.cancelSlot({
      tuition_id: this.props.groupInfo ? this.props.groupInfo._id : "",
      student_id: this.props.profileState ? this.props.profileState._id : ""
    })
    this.props.closeGroupPaymentModal();
  }

  bookGroupTuition = async () => {
    try {
      const results = await getTuitionsService().bookGroupTuition({
        tuition_id: this.props.groupInfo._id,
        student_id: this.props.profileState._id
      }) as any;
      if (results.code === 'SUCCESS') {
        message.success(this.props.languageState.INFORMATION_GROUP_TUITION_PAGE_BOOKING_SUCCESSFUL.translated, 3);
      } else {
        message.error(this.props.languageState.INFORMATION_GROUP_TUITION_PAGE_STH_WENT_WRONG.translated, 4);
      }
    } catch (error) {
      message.error(error.message, 4);
    }
  }

  loadMoreRatings = () => {
    this.props.loadMoreRatings({
      userId: this.props.tutorInfo._id,
      pageSize: 5,
      pageNumber: this.props.ratings && this.props.ratings.data ? Math.floor(this.props.ratings.data.length / 5) + 1 : 1
    })
  }

  generateTuitionReferenceId = (tuition: any, isGroup?: boolean) => {
    if (tuition) {
      const createdAt = moment(tuition.createdAt).format('HHmmSS');
      return tuition.courseForTutor ? (tuition.courseForTutor.isGroup || isGroup) ?
        `${tuition.course.subject.slice(0, 2).toUpperCase()}${tuition.course.level.slice(0, 1).toUpperCase()}${String(tuition.course.grade).slice(0, 1).toUpperCase()}-${moment((tuition as any).createdAt).format('YYMMDD')}-${createdAt}-GROUP` :
        `${tuition.course.subject.slice(0, 2).toUpperCase()}${tuition.course.level.slice(0, 1).toUpperCase()}${String(tuition.course.grade).slice(0, 1).toUpperCase()}-${moment((tuition as any).createdAt).format('YYMMDD')}-${createdAt}`
        : "";
    } else {
      return "";
    }
  }

  render() {
    console.log('duplicatedGroupSessions', this.state.duplicatedGroupSessions);
    const columns = [
      {
        title: 'Lesson',
        dataIndex: 'lesson',
        key: 'lesson',
        render: (_text, _record, index) => `Lesson ${index + 1}`
      },
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
      }
    ];

    let studentEvents: any[] = [];
    if (this.props.studentTuitionList && this.props.studentTuitionList.length) {
      [...this.props.studentTuitionList].map((item) => {
        studentEvents = item.courseForTutor && item.courseForTutor.isGroup ?
          [...studentEvents, ...item.period] :
          [...studentEvents, ...item.sessions]
      });
    }

    studentEvents = studentEvents.map((val) => {
      val.isFromOtherBooked = true;
      return val;
    })

    return (
      <UserLayout
        profileState={this.props.profileState || null}
        profileReducers={this.props.profileReducers}
        openLoginModal={this.props.openLoginModal}
        openRegisterModal={this.props.openRegisterModal}
        editProfilePageState={this.props.editProfilePageState}
        languageState={this.props.languageState}
      >
        <div>
          <AlertLoginModal
            loginAlertModalVisible={this.props.loginAlertModalVisible}
            closeLoginAlertModal={this.props.closeLoginAlertModal}
            openLoginModal={this.props.openLoginModal}
            openRegisterModal={this.props.openRegisterModal}
            languageState={this.props.languageState}
          />

          <Modal
            title="Booking conflicts"
            visible={this.state.errorModal}
            style={{ fontWeight: 'bold', padding: 20 }}
            destroyOnClose={true}
            onOk={() => this.setState({ errorModal: false, duplicatedGroupSessions: [], errorType: null })}
            onCancel={() => this.setState({ errorModal: false, duplicatedGroupSessions: [], errorType: null })}
            footer={null}
            width='600px'
          >
            <div>
              {
                this.state.duplicatedGroupSessions.map((item: any) => {
                  // this.state.errorType === "ERROR" ?
                  //     `Lesson #${item.index + 1} of this course is in overlapped with lesson ${extendedMoment(this.inputDateInUserTimezone(item.session.start)).format('DD MMM YYYY HH:mm')} - ${extendedMoment(this.inputDateInUserTimezone(item.session.end)).format('DD MMM YYYY HH:mm')} in your ${item.session.course ? `${item.session.course.country} - ${item.session.course.grade} - ${item.session.course.subject} course` : 'group tuition'} by tutor ${item.session.tutor.fullName}`
                  //     : `Lesson #${item.index + 1} of this course is in overlapped with group tuition ${item.tuition.course ? item.tuition.course.subject : ""} of tutor ${item.tuition.tutor.fullName}`
                  return this.state.errorType === "ERROR" ?
                    <div style={{ marginBottom: ' 15px' }}>- The date/time of lesson #{item.index + 1} overlaps with one of your existing bookings ({this.generateTuitionReferenceId(item.session.tuition)} with {item.session.tutor.fullName}). Please check before you attempt to book again.</div> :
                    <div style={{ marginBottom: ' 15px' }}>- The date/time of lesson #{item.index + 1} overlaps with one of your existing bookings ({this.generateTuitionReferenceId(item.tuition, true)} with {item.tuition.tutor.fullName}). Please check before you attempt to book again.</div>
                })
              }
            </div>
          </Modal>

          <Modal
            title={this.props.languageState.INFORMATION_TUTOR_PAGE_CONFIRM_BOOKING.translated}
            visible={this.props.paymentModelVisible}
            style={{ fontWeight: 'bold', padding: 20 }}
            destroyOnClose={true}
            onCancel={this.onClosePaymentModal}
            footer={null}
            maskClosable={false}
            width={1200}
          >
            <Spin spinning={this.props.isBusy} tip='Processing ...'>
              <GroupBilling
                promoCode={this.props.promoCode}
                promoCodeInput={this.props.promoCodeInput}
                changePromoCodeInput={this.props.changePromoCodeInput}
                changePromoCode={this.props.changePromoCode}
                clearPromoCode={this.props.clearPromoCode}
                tutorInfo={this.props.tutorInfo}
                groupInfo={this.props.groupInfo}
                profileState={this.props.profileState}
                paymentOption={this.props.paymentOption}
                onClosePaymentModal={this.onClosePaymentModal}
                paymentOptionChange={this.props.paymentOptionChange}
                clearState={this.props.clearState}
                languageState={this.props.languageState}
              />
              <Row type='flex' gutter={24}>
                <Col span={24} style={{ textAlign: 'right', marginTop: '24px' }}>
                  <PaypalButton
                    {...this.props.paypalState}
                    {...this.props.paypalReducers}
                    tutorId={this.props.tutorInfo._id}
                    studentId={this.props.profileState._id}
                    tuitionId={this.props.newTuition._id}
                    currency={this.props.profileState ? this.props.profileState.currency && this.props.profileState.currency.code ? PaypalCurrencies.indexOf(this.props.profileState.currency.code) > -1 ? this.props.profileState.currency.code : 'SGD' : 'SGD' : 'SGD'}
                    exchangeRate={this.props.profileState ? this.props.profileState.currency && this.props.profileState.currency.exchangeRate ? PaypalCurrencies.indexOf(this.props.profileState.currency.code) > -1 ? this.props.profileState.currency.exchangeRate : 1 : 1 : 1}
                    informationTutorPageState={_.omit(this.props, ['profileState', 'dataLookupState', 'paypalState', 'loginPageState', 'signUpPageState'])}
                    informationTutorPageReducers={_.omit(this.props, ['profileReducers', 'dataLookupReducers', 'paypalReducers', 'loginPageReducers', 'signUpPageReducers'])}
                    isGroup={true}
                    onPaymentGroupSuccess={this.bookGroupTuition}
                    profileState={this.props.profileState}
                    clearPromoCode={this.props.clearPromoCode}
                    promoCode={this.props.promoCode}
                    width={this.props.paymentOption ? 'auto' : '0px'}
                    languageState={this.props.languageState}
                  />
                </Col>
              </Row>
            </Spin>
          </Modal>

          <Layout style={{ padding: '20px 50px 20px 50px', background: 'white' }}>
            <Content style={{ background: 'white' }}>
              <h1 style={{ fontWeight: 'bold' }}>{this.props.languageState.INFORMATION_TUTOR_PAGE_TUTOR_PROFILE.translated}</h1>
              <Row gutter={6} align='middle' style={{ fontWeight: 'bold', marginBottom: 20 }}>
                <ScrollLink activeClass="active" style={{ marginRight: '15px' }} to="about" spy={true} smooth={true} duration={500}>
                  {this.props.languageState.INFORMATION_TUTOR_PAGE_ABOUT.translated}
                </ScrollLink>
                <ScrollLink activeClass="active" style={{ marginRight: '15px' }} to="schedule" spy={true} smooth={true} duration={500}>
                  {this.props.languageState.INFORMATION_TUTOR_PAGE_SCHEDULE.translated}
                </ScrollLink>
                <ScrollLink activeClass="active" className="" to="rating" spy={true} smooth={true} duration={500}>
                  {this.props.languageState.INFORMATION_TUTOR_PAGE_RATINGS.translated}
                </ScrollLink>
                <hr />
              </Row>
              <Layout id="about" style={{ borderRadius: 5, background: '#f4f5f5', marginBottom: 40 }}>
                <Content className="responsive-content-container">
                  <GroupTuitionOverview
                    tutorInfo={this.props.tutorInfo}
                    dataLookupState={this.props.dataLookupState}
                    groupInfo={this.props.groupInfo}
                    profileState={this.props.profileState}
                    languageState={this.props.languageState}
                  />
                </Content>
              </Layout>

              <Content>
                <h3>{this.props.languageState.INFORMATION_TUTOR_PAGE_ABOUT_ME.translated}</h3>
                <Row >
                  <p><b>{this.props.languageState.INFORMATION_TUTOR_PAGE_SPEAK.translated}: </b> {this.props.tutorInfo.biography ? this.props.tutorInfo.biography.language : ''}</p>
                  <ShowMore lines={2} more='Show more' less='Show less' anchorClass=''>
                    {this.props.tutorInfo.biography ? <p style={{ marginBottom: '0px' }}>{this.props.tutorInfo.biography.aboutMe}</p> : <p style={{ marginBottom: '0px' }}>About Me</p>}
                  </ShowMore>
                </Row>
                <hr style={{ marginBottom: 20 }} />

                <h3>{this.props.languageState.INFORMATION_TUTOR_PAGE_EDUCATION.translated}</h3>
                <Row align='bottom' style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Col style={{ display: 'flex', flex: 1 }}>
                    <p>{this.props.tutorInfo.education ? this.props.tutorInfo.education.highestEducation : ''}</p>
                  </Col>
                  <Col style={{ display: 'flex', flex: 1 }}>
                    <p>{this.props.tutorInfo.education ? this.props.tutorInfo.education.major : ''}</p>
                  </Col>
                  <Col style={{ display: 'flex', flex: 1 }}>
                    <p>{this.props.tutorInfo.education ? this.props.tutorInfo.education.university : ''}</p>
                  </Col>
                </Row>
                <hr style={{ marginBottom: 20 }} />

                <h3>{this.props.languageState.INFORMATION_TUTOR_PAGE_TEACHING_EXP.translated}</h3>
                <Row align='bottom'>
                  {this.props.tutorInfo.teacherExperience ? this.props.tutorInfo.teacherExperience.map((data) =>
                    <Row key={data.index}>
                      <Col span={8}>
                        {moment(data.start).format('MMM YYYY')} - {moment(data.end).format('MMM YYYY')}
                      </Col>
                      <Col span={16}>
                        {data.experience}
                      </Col>
                    </Row>) : null}
                </Row>
                <hr style={{ marginBottom: 20 }} />
              </Content>
              <Content id="schedule">
                <Row type='flex' gutter={24}>
                  <Col xs={24} sm={24} md={24} lg={15}>
                    <div style={{ background: '#ffffff' }}>
                      <Row style={{ padding: '0px 20px 0px 20px' }}>
                        <Row style={{ marginBottom: 16 }}>
                          <Content>1) {this.props.languageState.INFORMATION_TUTOR_PAGE_AVL_TIME_NOTE_1.translated}</Content>
                          <Content>2) {this.props.languageState.INFORMATION_TUTOR_PAGE_AVL_TIME_NOTE_2.translated}</Content>
                          <Content>3) {this.props.languageState.INFORMATION_TUTOR_PAGE_AVL_TIME_NOTE_3.translated}</Content>
                          <Content>4) {this.props.languageState.INFORMATION_TUTOR_PAGE_AVL_TIME_NOTE_4.translated}</Content>
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
                      <Spin spinning={this.props.isBusy}>
                        <DragAndDropCalendar
                          views={['month', 'week']}
                          selectable={false}
                          defaultDate={this.inputDateInUserTimezone()}
                          defaultView={Calendar.Views.WEEK}
                          events={[...this.props.groupInfo.period, ...studentEvents].map((item) => ({ ...item, start: this.inputDateInUserTimezone(item.start), end: this.inputDateInUserTimezone(item.end) }))}
                          style={{ minHeight: '60vh', padding: '20px 0px 20px 20px', marginRight: '24px' }}
                          scrollToTime={new Date(1970, 1, 1, 6)}
                          popup={true}
                          onNavigate={this.navigate}
                          onView={this.handleViewChange}
                          eventPropGetter={this.eventStyleGetter}
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
                      </Spin>
                    </div>
                  </Col>
                  <Col xs={24} sm={24} md={24} lg={9}>
                    {Object.keys(this.props.profileState).length && this.props.profileState.isLoggedIn ?
                      <div>
                        <Row type='flex' gutter={12}>
                          <Col span={24} style={{ padding: '20px 20px 0 20px' }}>
                            <h2>{this.props.languageState.INFORMATION_GROUP_TUITION_PAGE_GROUP_TUITION.translated}</h2>
                            <div>
                              <p>{this.props.groupInfo.course.country} - {this.props.groupInfo.course.grade} - {this.props.groupInfo.course.subject}</p>
                              <p>{this.props.languageState.INFORMATION_TUTOR_PAGE_NO_OF_LESSONS.translated}: {this.props.groupInfo.course.session}</p>
                              <p>{this.props.languageState.INFORMATION_TUTOR_PAGE_HOUR_PER_LESSON.translated}: {this.props.groupInfo.course.hourPerSession} {this.props.groupInfo.course.hourPerSession > 1 ? 'hours' : 'hour'}</p>
                              <p>{this.props.languageState.INFORMATION_TUTOR_PAGE_HOURLY_RATE.translated}: {this.calculateLocaleHourlyRate(this.props.groupInfo.course.hourlyRate)}/hour</p>
                              {
                                <div>
                                  {Array.apply(null, { length: this.props.groupInfo.course.maxClassSize } as any).map((_val, index) => index < (this.props.groupInfo.students.length + this.props.groupInfo.slotsHolded.length) ? 1 : 0).map((val) => {
                                    return <img src={val ? '/static/user-black.png' : '/static/user-gray.png'} style={{ width: '16px', height: '16px', marginRight: '5px' }} />
                                  })}
                                  <span>{`(${this.props.groupInfo.students.length + this.props.groupInfo.slotsHolded.length} of ${this.props.groupInfo.course.maxClassSize} slots taken)`}</span>
                                </div>
                              }
                            </div>
                          </Col>

                          <Col span={24} style={{ padding: '20px 20px 0 20px' }}>
                            <Table
                              size='small'
                              pagination={false}
                              columns={columns}
                              rowKey={(record) => record.index}
                              dataSource={this.props.groupInfo.period.sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime()).map((item) => ({
                                ...item,
                                start: this.inputDateInUserTimezone(item.start),
                                end: this.inputDateInUserTimezone(item.end)
                              }))}
                            />
                          </Col>

                          <Col span={24} style={{ textAlign: 'right', marginTop: '24px' }}>
                            {Object.keys(this.props.profileState).length && this.props.profileState.isLoggedIn && (
                              <Button
                                icon='wallet'
                                type='primary'
                                onClick={this.checkBooking}
                              >
                                {this.props.buttonSave}
                              </Button>
                            )}
                          </Col>
                        </Row>
                      </div> :
                      <div style={{ paddingBottom: '10px' }}>
                        <h3 style={{ textAlign: 'center' }}>{this.props.languageState.INFORMATION_TUTOR_PAGE_LOGIN_WARNING.translated}</h3>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-around' }}>
                          <Button
                            type="primary"
                            style={{
                              width: '100px',
                              height: '35px',
                              backgroundColor: '#34dd48',
                              borderColor: '#34dd48',
                              color: 'white'
                            }}
                            onClick={this.props.openLoginModal}
                          >
                            {this.props.languageState.INFORMATION_TUTOR_PAGE_LOGIN.translated}
                          </Button>
                          <Button
                            type="primary"
                            style={{
                              width: '100px',
                              height: '35px'
                            }}
                            onClick={this.props.openRegisterModal}
                          >
                            {this.props.languageState.INFORMATION_TUTOR_PAGE_SIGNUP.translated}
                          </Button>
                        </div>
                      </div>
                    }
                  </Col>
                </Row>
                <hr />
              </Content>
              <Content id="rating">
                {this.props.ratings && this.props.ratings.data && this.props.ratings.data.length ?
                  (<Row>
                    <Col span={15}>
                      <Col xs={24}>
                        <h2 style={{ display: 'inline-block' }}>
                          <b>{this.props.tutorInfo.rating} <Icon type="star" theme="filled" /></b>
                          <span style={{ marginLeft: '5px', marginRight: '3px' }}>|</span>
                          <span>{this.props.ratings.total} {this.props.languageState.INFORMATION_TUTOR_PAGE_REVIEW.translated}</span>
                        </h2>
                        <h3 style={{ display: 'inline-block', marginLeft: '30px' }}>
                          <span style={{ marginRight: '15px' }}>5 {this.props.languageState.INFORMATION_TUTOR_PAGE_STARS.translated} ({this.props.ratings.stars ? this.props.ratings.stars.five : 0})</span>
                          <span style={{ margin: '0px 15px' }}>4 {this.props.languageState.INFORMATION_TUTOR_PAGE_STARS.translated} ({this.props.ratings.stars ? this.props.ratings.stars.four : 0})</span>
                          <span style={{ margin: '0px 15px' }}>3 {this.props.languageState.INFORMATION_TUTOR_PAGE_STARS.translated} ({this.props.ratings.stars ? this.props.ratings.stars.three : 0})</span>
                          <span style={{ margin: '0px 15px' }}>2 {this.props.languageState.INFORMATION_TUTOR_PAGE_STARS.translated} ({this.props.ratings.stars ? this.props.ratings.stars.two : 0})</span>
                          <span style={{ marginLeft: '15px' }}>1 {this.props.languageState.INFORMATION_TUTOR_PAGE_STAR.translated} ({this.props.ratings.stars ? this.props.ratings.stars.one : 0})</span>
                        </h3>
                        <hr></hr>
                      </Col>
                      {this.props.ratings.data.map(val => {
                        return (
                          <Col xs={12} style={{ margin: '12px 0px' }}>
                            <Col xs={8} style={{ padding: '0px 10px' }}>
                              <img className="rating-user-avatar" src={val.uploadBy && val.uploadBy.imageUrl ? val.uploadBy.imageUrl : '/static/default.png'}></img>
                              <h4 style={{ textAlign: 'center', marginTop: '5px' }}>{val.uploadBy.fullName}</h4>
                            </Col>
                            <Col xs={16} style={{ paddingLeft: '10px' }}>
                              <Rate allowHalf={true} value={val.rateSession} disabled />
                              {val.commentSession ? (<h4><i>"{val.commentSession}"</i></h4>) : <div></div>}
                              <h4>{this.props.languageState.INFORMATION_TUTOR_PAGE_SUBMITTED_ON.translated} {new Date(val.uploadDate).toLocaleDateString()}</h4>
                            </Col>
                          </Col>
                        )
                      })}
                      {this.props.ratings.data.length < this.props.ratings.total ?
                        <Col xs={24}>
                          <Button type="primary" onClick={this.loadMoreRatings}>See more</Button>
                        </Col>
                        : <div></div>
                      }
                    </Col>
                  </Row>) :
                  <div>
                    <h3>{this.props.languageState.INFORMATION_TUTOR_PAGE_RATINGS.translated}</h3>
                    <p>{this.props.languageState.INFORMATION_TUTOR_PAGE_NO_RATING.translated}</p>
                  </div>
                }
              </Content>

              <Modal
                title={this.props.languageState.INFORMATION_TUTOR_PAGE_LOGIN.translated}
                visible={this.props.loginModalVisible}
                onOk={this.props.closeLoginModal}
                onCancel={() => {
                  this.props.closeLoginModal();
                  this.props.loginPageReducers.clearState();
                }}
                width={450}
                footer={null}
                destroyOnClose={true}
              >
                <LoginForm
                  loginPageState={this.props.loginPageState}
                  loginPageReducers={this.props.loginPageReducers}
                  openRegisterModal={this.props.openRegisterModal}
                  openResetPasswordModal={this.props.openResetPasswordModal}
                  languageState={this.props.languageState}
                />
              </Modal>

              <Modal
                title={this.props.languageState.INFORMATION_TUTOR_PAGE_SIGNUP.translated}
                visible={this.props.registerModalVisible}
                onOk={this.props.closeRegisterModal}
                onCancel={() => {
                  this.props.closeRegisterModal();
                  this.props.signUpPageReducers.clearState();
                }}
                width={450}
                footer={null}
                destroyOnClose={true}
              >
                <RegisterForm
                  signUpPageReducers={this.props.signUpPageReducers}
                  signUpPageState={this.props.signUpPageState}
                  openLoginSuccessModal={this.props.openLoginSuccessModal}
                  closeRegisterModal={this.props.closeRegisterModal}
                  openLoginModal={this.props.openLoginModal}
                  loginPageReducers={this.props.loginPageReducers}
                  languageState={this.props.languageState}
                />
              </Modal>

              <Modal
                title={this.props.languageState.INFORMATION_TUTOR_PAGE_RESET_PASSWORD.translated}
                visible={this.props.resetPasswordModalVisible}
                onCancel={() => {
                  this.props.closeResetPasswordModal();
                  this.props.resetPasswordPageReducers.clearState();
                }}
                width={450}
                footer={null}
                destroyOnClose={true}
              >
                <ResetPasswordForm resetPasswordPageReducers={this.props.resetPasswordPageReducers} resetPasswordPageState={this.props.resetPasswordPageState} languageState={this.props.languageState}/>
              </Modal>

              <Modal
                style={{ textAlign: "center", marginTop: "150px" }}
                bodyStyle={{ fontSize: "18px" }}
                closable={false}
                title={this.props.languageState.INFORMATION_TUTOR_PAGE_REGISTRATION_SUCCESS.translated}
                visible={this.props.loginSuccessModalVisible}
                footer={null}
                onCancel={this.props.closeLoginSuccessModal}
              >
                <p>
                  {this.props.languageState.INFORMATION_TUTOR_PAGE_REGISTRATION_SUCCESS_TEXT.translated}
                </p>
              </Modal>
            </Content>
          </Layout>
        </div>
      </UserLayout>
    )
  }
}

const mapState = (rootState: any) => {
  return {
    ...rootState.informationTutorPageModel,
    profileState: rootState.profileModel,
    dataLookupState: rootState.dataLookupModel,
    paypalState: rootState.paypalPageModel,
    loginPageState: rootState.loginPageModel,
    signUpPageState: rootState.signUpPageModel,
    editProfilePageState: rootState.editProfilePageModel,
    resetPasswordPageState: rootState.resetPasswordPageModel,
    languageState: rootState.languageModel,
  };
};

const mapDispatch = (rootReducer: any) => {
  return {
    ...rootReducer.informationTutorPageModel,
    profileReducers: rootReducer.profileModel,
    dataLookup: rootReducer.dataLookupModel,
    paypalReducers: rootReducer.paypalPageModel,
    loginPageReducers: rootReducer.loginPageModel,
    signUpPageReducers: rootReducer.signUpPageModel,
    editProfilePageReducers: rootReducer.editProfilePageModel,
    resetPasswordPageReducers: rootReducer.resetPasswordPageModel,
  };
};

export default withRematch(initStore, mapState, mapDispatch)(InformationGroupTutor);