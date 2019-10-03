import * as React from 'react';
import { Layout, Row, Col, Button, Icon, Card, Tag, Modal, Input, Spin, Avatar, Popover } from 'antd';
import moment from 'moment';
import Link from 'next/link';
import initStore from '../../rematch/store';
import withRematch from '../../rematch/withRematch';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import 'react-big-calendar/lib/addons/dragAndDrop/styles.css';
import '../../pages/styles.css';
import { getTuitionsService } from '../../service-proxies';
import UserLayout from '../../layout/UserLayout';
import Billing from '../../components/Billing';
import PaypalPartial from '../../components/paypal/PaypalPartial';
import _ from 'lodash';
import PaypalCurrencies from '../../data_common/PaypalCurrencies';

class UpcomingTutionCalendar extends React.Component<any, any> {
  static async getInitialProps(props: any) {
    let tuitionInfo: any = {};
    if (!props.req) {
      const tuitionsService = getTuitionsService(props.store.getState().profileModel.token);
      tuitionInfo = await tuitionsService.findByTuitionId(props.query.tuitionId);
    } else {
      tuitionInfo = props.query.tuitionInfo;
    }

    return {
      tuitionInfo
    };
  }

  state = {
    paymentModal: false,
    promoCode: null,
    promoCodeInput: "",
    paymentOption: '',
  }

  inputDateInUserTimezone = (date: any = new Date().toString()) => {
    const browserTimezone = - new Date().getTimezoneOffset() / 60;
    const userTimezone = this.props.profileState.timeZone && this.props.profileState.timeZone.offset ? this.props.profileState.timeZone.offset : browserTimezone;
    const deltaTimezone = userTimezone - browserTimezone;

    return new Date(new Date(date).getTime() + deltaTimezone * 60 * 60 * 1000);
  }

  openPaymentModal = () => {
    this.setState({
      paymentModal: true
    })
  }

  closePaymentModal = () => {
    this.setState({
      paymentModal: false
    })
  }

  changePromoCode = (payload) => {
    this.setState({
      promoCode: payload,
    });
  }

  clearPromoCode = () => {
    this.setState({
      promoCode: null,
    })
  }

  changePromoCodeInput = (payload) => {
    this.setState({
      promoCodeInput: payload,
      promoCode: null
    })
  }

  paymentOptionChange = (payload) => {
    this.setState({
      paymentOption: payload
    })
  }

  componentDidMount() {
    this.props.fetchSessionList({ tuitionId: this.props.tuitionInfo._id });
  }

  onCancelTuition = () => {
    if (!this.props.cancelReason) {
      this.props.errorHappen({ errorMessage: this.props.languageState.TUITION_DETAIL_PAGE_CANCEL_REASON_VALIDATE.translated });
    } else {
      this.props.cancelTuition({
        tuitionId: this.props.tuitionInfo._id,
        cancelReason: this.props.cancelReason,
        cancelBy: this.props.profileState.roles[0],
        userId: this.props.profileState._id
      });
    }
  }

  generateTuitionReferenceId = (tuition: any) => {
    const createdAt = moment(tuition.createdAt).format('HHmmSS');
    return tuition.courseForTutor ? tuition.courseForTutor.isGroup ?
      `${tuition.course.subject.slice(0, 2).toUpperCase()}${tuition.course.level.slice(0, 1).toUpperCase()}${String(tuition.course.grade).slice(0, 1).toUpperCase()}-${moment((tuition as any).createdAt).format('YYMMDD')}-${createdAt}-GROUP` :
      `${tuition.course.subject.slice(0, 2).toUpperCase()}${tuition.course.level.slice(0, 1).toUpperCase()}${String(tuition.course.grade).slice(0, 1).toUpperCase()}-${moment((tuition as any).createdAt).format('YYMMDD')}-${createdAt}`
      : "";
  }

  cancelReasonChange = (e) => {
    if ((e.target.value.match(/(\s){1}/g) || []).length > 50) {
      this.props.errorHappen({ errorMessage: this.props.languageState.TUITION_DETAIL_PAGE_CANCEL_REASON_VALIDATE_2.translated });
    } else {
      this.props.cancelReasonChange({ cancelReason: e.target.value })
    }
  };

  render() {
    const tutorFullName = this.props.tuitionInfo.tutor.fullName ? this.props.tuitionInfo.tutor.fullName : [this.props.tuitionInfo.tutor.firstName, this.props.tuitionInfo.tutor.lastName].join(' ');
    const studentFullName = this.props.tuitionInfo.student.fullName ? this.props.tuitionInfo.student.fullName : [this.props.tuitionInfo.student.firstName, this.props.tuitionInfo.student.lastName].join(' ');
    const informationStudent = (
      <div>
        <p><b>{this.props.languageState.TUITION_DETAIL_PAGE_STUDENT_NAME.translated}:</b> {this.props.tuitionInfo.student.fullName ? this.props.tuitionInfo.student.fullName : ''}</p>
        <p><b>{this.props.languageState.TUITION_DETAIL_PAGE_STUDENT_DOB.translated}:</b> {this.props.tuitionInfo.student.dob ? new Date(this.props.tuitionInfo.student.dob).toDateString() : ''}</p>
        <p><b>{this.props.languageState.TUITION_DETAIL_PAGE_STUDENT_CURRENTLY_BASED_IN.translated}:</b> {this.props.tuitionInfo.student.currentlyBasedIn ? this.props.tuitionInfo.student.currentlyBasedIn : ''}</p>
        <p><b>{this.props.languageState.TUITION_DETAIL_PAGE_STUDENT_TIME_ZONE.translated}:</b> {this.props.tuitionInfo.student.timeZone && this.props.tuitionInfo.student.timeZone.gmt ? this.props.tuitionInfo.student.timeZone.gmt : ''}</p>
      </div>
    );

    return (
      <UserLayout profileState={this.props.profileState} profileReducers={this.props.profileReducers} editProfilePageState={this.props.editProfilePageState} languageState={this.props.languageState}>
        <Layout style={{ background: 'white', padding: 40 }}>
          <div className="common-info">
            <Row gutter={24}>
              <Col span={12}>
                {this.props.tuitionInfo.course.country === 'trial'
                  ? <h1> {this.props.languageState.TUITION_DETAIL_PAGE_FREE_TRIAL_COURSE.translated}</h1>
                  : <h1>{this.props.tuitionInfo.course.country} - {this.props.tuitionInfo.course.subject}: {this.props.tuitionInfo.course.grade}</h1>}

              </Col>
              <Col span={12} style={{ height: '56px', lineHeight: '56px', textAlign: 'right' }}>
                { this.props.tuitionInfo.isCompleted || this.props.tuitionInfo.isCanceled || this.props.tuitionInfo.isPendingReview ? <div></div> :
                  <Button
                    onClick={this.props.openCancelTuitionModal}
                    style={{ minWidth: '242px', textAlign: 'center', background: '#f4424e', color: '#ffffff', border: '1px solid #f4424e' }}
                  >
                    {this.props.languageState.TUITION_DETAIL_PAGE_CANCEL_TUITION.translated}
                  </Button>
                }
                {
                  this.props.profileState.roles[0] === 'student' && this.props.sessionList.filter((val) => !val.isPaid && !val.isCompleted).length ?
                    <Button
                      onClick={this.openPaymentModal}
                      style={{ minWidth: '242px', textAlign: 'center', marginLeft: '10px', background: 'rgb(24, 144, 255)', color: '#ffffff', border: '1px solid rgb(24, 144, 255)' }}
                    >
                      {this.props.languageState.TUITION_DETAIL_PAGE_PAYMENT_TUITION.translated}
                    </Button> : <div></div>
                }
              </Col>
            </Row>

            <Row gutter={24}>
              <Col span={24}>
                <table style={{ border: '1px solid #e8e8e8', width: '100%' }}>
                  <tbody>
                    <tr style={{ border: '1px solid #e8e8e8', height: '36px' }}>
                      <td style={{ border: '1px solid #e8e8e8', padding: '0 16px', fontWeight: 'bold' }}><Icon type="book" /> {this.props.languageState.TUITION_DETAIL_PAGE_TUITION_SUBJECT.translated}</td>
                      {this.props.tuitionInfo.course.country === 'trial'
                        ? <td colSpan={5} style={{ border: '1px solid #e8e8e8', padding: '0 16px', fontWeight: 'bold' }}>
                          {this.props.languageState.TUITION_DETAIL_PAGE_TRIAL.translated}
                        </td>
                        : <td colSpan={5} style={{ border: '1px solid #e8e8e8', padding: '0 16px', fontWeight: 'bold' }}>
                          {this.props.tuitionInfo.course.country} - {this.props.tuitionInfo.course.subject}: {this.props.tuitionInfo.course.level}
                        </td>}
                    </tr>
                    <tr style={{ border: '1px solid #e8e8e8', height: '36px' }}>
                      <td style={{ border: '1px solid #e8e8e8', padding: '0 16px', fontWeight: 'bold' }}><Icon type="solution" theme="outlined" /> {this.props.languageState.TUITION_DETAIL_PAGE_TUITION_ID.translated}</td>
                      <td colSpan={5} style={{ border: '1px solid #e8e8e8', padding: '0 16px', fontWeight: 'bold' }}>
                        {this.generateTuitionReferenceId(this.props.tuitionInfo)}
                      </td>
                    </tr>
                    <tr style={{ border: '1px solid #e8e8e8', height: '36px' }}>
                      <td style={{ border: '1px solid #e8e8e8', padding: '0 16px', fontWeight: 'bold' }}><Icon type="bars" /> {this.props.languageState.TUITION_DETAIL_PAGE_NUMBER_OF_LESSONS.translated}</td>
                      <td style={{ border: '1px solid #e8e8e8', padding: '0 16px', fontWeight: 'bold' }}>{this.props.tuitionInfo.course.session}</td>
                      <td style={{ border: '1px solid #e8e8e8', padding: '0 16px', fontWeight: 'bold' }}><Icon type="bars" /> {this.props.languageState.TUITION_DETAIL_PAGE_HOURS_PER_LESSON.translated}</td>
                      <td style={{ border: '1px solid #e8e8e8', padding: '0 16px', fontWeight: 'bold' }}>{this.props.tuitionInfo.course.hourPerSession} {this.props.tuitionInfo.course.hourPerSession <= 1 ? "hour" : "hours"}</td>
                      <td style={{ border: '1px solid #e8e8e8', padding: '0 16px', fontWeight: 'bold' }}><Icon type="clock-circle-o" /> {this.props.languageState.TUITION_DETAIL_PAGE_HOURLY_RATE.translated}</td>
                      <td style={{ border: '1px solid #e8e8e8', padding: '0 16px', fontWeight: 'bold' }}>{this.props.profileState ? this.props.profileState.currency && this.props.profileState.currency.exchangeRate ?
                        Math.round((this.props.tuitionInfo.courseForTutor.hourlyRate / this.props.profileState.currency.exchangeRate)).toLocaleString() : (this.props.tuitionInfo.courseForTutor.hourlyRate).toLocaleString() : (this.props.tuitionInfo.courseForTutor.hourlyRate).toLocaleString()} {this.props.profileState ? this.props.profileState.currency && this.props.profileState.currency.code ? this.props.profileState.currency.code : 'SGD' : 'SGD'} per hour
                      </td>
                    </tr>
                  </tbody>
                </table>
              </Col>
            </Row>
          </div>

          <div className="detailed-info" style={{ marginTop: '30px' }}>
            <div className="detailed-info-description">
              {this.props.profileState.roles[0] === 'tutor'
                ? <Row style={{ marginBottom: 20 }}>
                  <Popover placement="right" content={informationStudent} title={this.props.languageState.TUITION_DETAIL_PAGE_INFO_STUDENT.translated}>
                    <a
                      style={{ fontWeight: 600, color: 'black', fontSize: 21, marginTop: 10, marginRight: 15 }}>{this.props.languageState.TUITION_DETAIL_PAGE_STUDENT.translated}: {this.props.tuitionInfo.student.fullName}</a>
                  </Popover>
                  <Avatar src={this.props.tuitionInfo.student.imageUrl ? this.props.tuitionInfo.student.imageUrl : '/static/default.png'}></Avatar>
                </Row>
                : <Row style={{ marginBottom: 20 }}>
                  <a
                    href={`/login-student/informationTutor/${this.props.tuitionInfo.tutor._id}`}
                    target='_blank'
                    style={{ fontWeight: 600, color: 'black', fontSize: 21, marginTop: 10, marginRight: 15 }}>{this.props.languageState.TUITION_DETAIL_PAGE_TUTOR.translated}: {this.props.tuitionInfo.tutor.fullName}</a>
                  <Avatar src={this.props.tuitionInfo.tutor.imageUrl ? this.props.tuitionInfo.tutor.imageUrl : '/static/default.png'}></Avatar>
                </Row>}
              <h2 style={{ fontWeight: 600 }}>{this.props.languageState.TUITION_DETAIL_PAGE_COURSE_DETAIL.translated}</h2>

              <p>{this.props.languageState.TUITION_DETAIL_PAGE_REFER_TO_BELOW.translated}</p>
              <p>{this.props.profileState.roles[0] === 'student' ?
                this.props.languageState.TUITION_DETAIL_PAGE_LEAVE_TUTOR.translated
                : this.props.languageState.TUITION_DETAIL_PAGE_LEAVE_STUDENT.translated
              }</p>
              <p>{this.props.profileState.roles[0] === 'student' ?
                this.props.languageState.TUITION_DETAIL_PAGE_TUTOR_LATE.translated
                : this.props.languageState.TUITION_DETAIL_PAGE_STUDENT_LATE.translated
              }</p>
            </div>
            <div className="sessions-list">
              <Card title={<div style={{ fontWeight: 'bold' }}>
                  <div>Lesson 1 - Lesson {this.props.tuitionInfo.sessions.length}</div>
                </div>}>
                <Row type="flex" gutter={24}>
                  {this.props.sessionList.map((item, index) => (
                    <Col span={6} style={{ marginBottom: '12px' }} key={index}>
                      <Link href={`/calendar/session-detail/${item._id}`}>
                        <Card.Grid
                          style={{
                            width: '100%',
                            fontWeight: 'bold',
                            cursor: 'pointer',
                            position: 'relative',
                            background: new Date(item.end).getTime() < new Date().getTime() ? '#ffffff' : '#1890ff',
                            color: new Date(item.end).getTime() < new Date().getTime() ? 'inherit' : '#ffffff'
                          }}
                        >
                          {this.props.languageState.TUITION_DETAIL_PAGE_LESSON.translated} {index + 1} {item.isRescheduled ? this.props.languageState.TUITION_DETAIL_PAGE_RESCHEDULE.translated : ''}
                          <br />
                          {item.isPaid ? <span style={{position: 'absolute', top: '10px', right: '10px'}}><Tag color="orange">Paid</Tag></span> : <div></div>}
                          <div>Start: {moment(this.inputDateInUserTimezone(item.start)).format('DD MMM YYYY - HH:mm')}</div>
                          <div>
                            {this.props.languageState.TUITION_DETAIL_PAGE_COURSE_LESSON_END.translated}: {moment(this.inputDateInUserTimezone(item.end)).format('DD MMM YYYY - HH:mm')} &nbsp;
                            {this.inputDateInUserTimezone(item.end).getTime() < this.inputDateInUserTimezone().getTime() && (
                              <span><Tag color="green">{this.props.languageState.TUITION_DETAIL_PAGE_COURSE_LESSON_FINISHED.translated}</Tag></span>
                            )}
                          </div>
                        </Card.Grid>
                      </Link>
                    </Col>
                  ))}
                </Row>
              </Card>
            </div>
          </div>

          <Modal
            title={this.props.languageState.TUITION_DETAIL_PAGE_CANCEL_TUITION_MODAL.translated}
            visible={this.props.cancelTuitionModalVisible}
            onOk={this.onCancelTuition}
            onCancel={this.props.closeCancelTuitionModal}
            okText={this.props.languageState.TUITION_DETAIL_PAGE_CANCEL_TUITION_MODAL_OK_TEXT.translated}
            cancelText={this.props.languageState.TUITION_DETAIL_PAGE_CANCEL_TUITION_MODAL_CANCEL_TEXT.translated}
            okButtonProps={{ style: { background: '#f4424e', color: '#ffffff', border: '1px solid #f4424e' } }}
          >
            <Spin spinning={this.props.isBusy}>
              {this.props.profileState.roles.indexOf('student') > -1 && (
                <p>
                  {this.props.languageState.TUITION_DETAIL_PAGE_CANCEL_TUITION_MODAL_CONTENT.translated} <b>{tutorFullName}</b>. {this.props.languageState.TUITION_DETAIL_PAGE_CANCEL_TUITION_MODAL_CONTENT_2.translated}
                  <br />
                  <br />
                  {this.props.languageState.TUITION_DETAIL_PAGE_CANCEL_TUITION_MODAL_CONTENT_3.translated}
                </p>
              )}

              {this.props.profileState.roles.indexOf('tutor') > -1 && (
                <p>
                  {this.props.languageState.TUITION_DETAIL_PAGE_CANCEL_TUITION_MODAL_CONTENT_TUTOR.translated} <b>{studentFullName}</b>. {this.props.languageState.TUITION_DETAIL_PAGE_CANCEL_TUITION_MODAL_CONTENT_TUTOR_2.translated}
                <br />
                  <br />
                  {this.props.languageState.TUITION_DETAIL_PAGE_CANCEL_TUITION_MODAL_CONTENT_TUTOR_3.translated}
                </p>
              )}

              <div className="cancel-reasons">
                <p style={{ fontWeight: 'bold' }}>{this.props.languageState.TUITION_DETAIL_PAGE_CANCEL_TUITION_MODAL_CONTENT_CANCEL_REASONS.translated}: </p>
                <Input.TextArea
                  rows={4}
                  onChange={this.cancelReasonChange}
                  value={this.props.cancelReason}
                />
                <p style={{ textAlign: 'right' }}>{(this.props.cancelReason.match(/(\s){1}/g) || []).length}/50</p>
              </div>

              {this.props.errorMessage && (
                <div style={{ color: '#f5222d', textAlign: 'center', marginTop: '24px' }}>
                  {this.props.errorMessage}
                </div>
              )}
            </Spin>
          </Modal>
          <Modal
            title='Payment'
            visible={this.state.paymentModal}
            style={{ fontWeight: 'bold', padding: 20 }}
            destroyOnClose={true}
            onCancel={this.closePaymentModal}
            footer={null}
            width={1200}
            maskClosable={false}
          >
            <div>
              <Billing
                promoCode={this.state.promoCode}
                promoCodeInput={this.state.promoCodeInput}
                changePromoCodeInput={this.changePromoCodeInput}
                changePromoCode={this.changePromoCode}
                clearPromoCode={this.clearPromoCode}
                tutorInfo={this.props.tuitionInfo.tutor}
                selectedCourse={this.props.tuitionInfo.courseForTutor}
                newBookings={this.props.sessionList.filter(val => !val.isPaid).map((item) => ({ ...item, start: this.inputDateInUserTimezone(item.start), end: this.inputDateInUserTimezone(item.end) }))}
                profileState={this.props.profileState}
                paymentOption={this.state.paymentOption}
                onClosePaymentModal={this.closePaymentModal}
                paymentOptionChange={this.paymentOptionChange}
                clearState={this.props.clearState}
                languageState={this.props.languageState}
              />
              <Row type='flex' gutter={24}>
                <Col span={24} style={{ textAlign: 'right', marginTop: '24px' }}>
                  <PaypalPartial
                    {...this.props.paypalState}
                    {...this.props.paypalReducers}
                    languageState={this.props.languageState}
                    clearPromoCode={this.clearPromoCode}
                    tutorId={this.props.tuitionInfo.tutor._id}
                    studentId={this.props.profileState._id}
                    tuitionId={this.props.tuitionInfo._id}
                    selectedCourse={this.props.tuitionInfo.courseForTutor}
                    paymentOption={this.state.paymentOption}
                    newBookings={this.props.sessionList.filter(val => !val.isPaid).map((item) => { 
                      item.start = this.inputDateInUserTimezone(item.start);
                      item.end = this.inputDateInUserTimezone(item.end);
                      return item;
                    })}
                    currency={this.props.profileState ? this.props.profileState.currency && this.props.profileState.currency.code ? PaypalCurrencies.indexOf(this.props.profileState.currency.code) > -1 ? this.props.profileState.currency.code : 'SGD' : 'SGD' : 'SGD'}
                    exchangeRate={this.props.profileState ? this.props.profileState.currency && this.props.profileState.currency.exchangeRate ? PaypalCurrencies.indexOf(this.props.profileState.currency.code) > -1 ? this.props.profileState.currency.exchangeRate : 1 : 1 : 1}
                    informationTutorPageState={_.omit(this.props, ['profileState', 'dataLookupState', 'paypalState', 'loginPageState', 'signUpPageState'])}
                    informationTutorPageReducers={_.omit(this.props, ['profileReducers', 'dataLookupReducers', 'paypalReducers', 'loginPageReducers', 'signUpPageReducers'])}
                    promoCode={this.state.promoCode}
                    width={this.state.paymentOption ? 'auto' : '0px'}
                    closePaymentModal={this.closePaymentModal}
                  />
                </Col>
              </Row>
            </div>
          </Modal>
        </Layout>
      </UserLayout>
    );
  }
}

const mapState = (rootState: any) => {
  return {
    ...rootState.tuitionDetailPageModel,
    profileState: rootState.profileModel,
    editProfilePageState: rootState.editProfilePageModel,
    dataLookupState: rootState.dataLookupModel,
    paypalState: rootState.paypalPageModel,
    languageState: rootState.languageModel,
  };
};

const mapDispatch = (rootReducer: any) => {
  return {
    ...rootReducer.tuitionDetailPageModel,
    profileReducers: rootReducer.profileModel,
    editProfilePageReducers: rootReducer.editProfilePageModel,
    dataLookup: rootReducer.dataLookupModel,
    paypalReducers: rootReducer.paypalPageModel,
  };
};

export default withRematch(initStore, mapState, mapDispatch)(
  UpcomingTutionCalendar
);
