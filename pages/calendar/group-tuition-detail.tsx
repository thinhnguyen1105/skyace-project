import * as React from 'react';
import { Layout, Row, Col, Button, Icon, Card, Tag, Modal, Input, message, Popover, Avatar } from 'antd';
import moment from 'moment';
import Link from 'next/link';
import initStore from '../../rematch/store';
import withRematch from '../../rematch/withRematch';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import 'react-big-calendar/lib/addons/dragAndDrop/styles.css';
import '../../pages/styles.css';
import { getTuitionsService } from '../../service-proxies';
import UserLayout from '../../layout/UserLayout';

class UpcomingTutionCalendar extends React.Component<any, any> {
  static async getInitialProps(props: any) {
    let groupTuitionInfo: any = {};
    if (!props.req) {
      const tuitionsService = getTuitionsService(props.store.getState().profileModel.token);
      groupTuitionInfo = await tuitionsService.getGroupTuitionById(props.query.tuitionId);
    } else {
      groupTuitionInfo = props.query.groupTuitionInfo;
    }

    return {
      groupTuitionInfo
    };
  }

  inputDateInUserTimezone = (date: any = new Date().toString()) => {
    const browserTimezone = - new Date().getTimezoneOffset() / 60;
    const userTimezone = this.props.profileState.timeZone && this.props.profileState.timeZone.offset ? this.props.profileState.timeZone.offset : browserTimezone;
    const deltaTimezone = userTimezone - browserTimezone;

    return new Date(new Date(date).getTime() + deltaTimezone * 60 * 60 * 1000);
  }

  componentDidMount() {
    // this.props.fetchSessionList({tuitionId: this.props.groupTuitionInfo._id});
  }

  onCancelTuition = () => {
    if (!this.props.cancelReason) {
      message.error(this.props.languageState.CALENDAR_GROUP_TUITION_DETAIL_PAGE_CANCEL_REASON_VALIDATE.translated, 4);
    } else {
      this.props.cancelTuition({
        tuitionId: this.props.groupTuitionInfo._id,
        cancelReason: this.props.cancelReason,
        cancelBy: this.props.profileState.roles[0],
        userId: this.props.profileState._id
      });
    }
  }

  render() {
    return (
      <UserLayout profileState={this.props.profileState} profileReducers={this.props.profileReducers} editProfilePageState={this.props.editProfilePageReducers} languageState={this.props.languageState}>
        <Layout style={{ background: 'white', padding: 40 }}>
          <div className="common-info">
            <Row gutter={24}>
              <Col span={12}>
                <h1>{this.props.groupTuitionInfo.course.country} - {this.props.groupTuitionInfo.course.subject}: {this.props.groupTuitionInfo.course.grade}</h1>
              </Col>
              {this.props.groupTuitionInfo.isCanceled || this.props.groupTuitionInfo.isCompleted ? <div></div> :
              <Col span={12} style={{ height: '56px', lineHeight: '56px', textAlign: 'right' }}>
                {this.props.profileState.roles[0] === 'tutor' ? <div></div>
                : <Button
                    onClick={this.props.openCancelTuitionModal}
                    disabled={this.props.groupTuitionInfo.isCanceled}
                    style={{ minWidth: '242px', textAlign: 'center', background: '#f4424e', color: '#ffffff', border: '1px solid #f4424e' }}
                  >
                    {this.props.languageState.CALENDAR_GROUP_TUITION_DETAIL_PAGE_CANCEL_LABEL_2.translated}
                  </Button>
                }
              </Col>
              }
            </Row>

            <Row gutter={24}>
              <Col span={24}>
                <table style={{ border: '1px solid #e8e8e8', width: '100%' }}>
                  <tbody>
                    <tr style={{ border: '1px solid #e8e8e8', height: '36px' }}>
                      <td style={{ border: '1px solid #e8e8e8', padding: '0 16px', fontWeight: 'bold' }}><Icon type="book" /> {this.props.languageState.CALENDAR_GROUP_TUITION_DETAIL_PAGE_TUITION_SUBJECT.translated}</td>
                      <td colSpan={5} style={{ border: '1px solid #e8e8e8', padding: '0 16px', fontWeight: 'bold' }}>
                        {this.props.groupTuitionInfo.course.country} - {this.props.groupTuitionInfo.course.subject}: {this.props.groupTuitionInfo.course.level}
                      </td>
                    </tr>
                    <tr style={{ border: '1px solid #e8e8e8', height: '36px' }}>
                      <td style={{ border: '1px solid #e8e8e8', padding: '0 16px', fontWeight: 'bold' }}><Icon type="bars" /> {this.props.languageState.CALENDAR_GROUP_TUITION_DETAIL_PAGE_NUMBER_OF_LESSONS.translated}</td>
                      <td style={{ border: '1px solid #e8e8e8', padding: '0 16px', fontWeight: 'bold' }}>{this.props.groupTuitionInfo.course.session}</td>
                      <td style={{ border: '1px solid #e8e8e8', padding: '0 16px', fontWeight: 'bold' }}><Icon type="bars" /> {this.props.languageState.CALENDAR_GROUP_TUITION_DETAIL_PAGE_HOURS_PER_LESSONS.translated}</td>
                      <td style={{ border: '1px solid #e8e8e8', padding: '0 16px', fontWeight: 'bold' }}>{this.props.groupTuitionInfo.course.hourPerSession} {this.props.groupTuitionInfo.course.hourPerSession <= 1 ? 'hour' : 'hours'}</td>
                      <td style={{ border: '1px solid #e8e8e8', padding: '0 16px', fontWeight: 'bold' }}><Icon type="clock-circle-o" /> {this.props.languageState.CALENDAR_GROUP_TUITION_DETAIL_PAGE_HOURLY_RATE.translated}</td>
                      <td style={{ border: '1px solid #e8e8e8', padding: '0 16px', fontWeight: 'bold' }}>{this.props.profileState ? this.props.profileState.currency && this.props.profileState.currency.exchangeRate ?
                        Math.round((this.props.groupTuitionInfo.courseForTutor.hourlyRate / this.props.profileState.currency.exchangeRate)).toLocaleString() : (this.props.groupTuitionInfo.courseForTutor.hourlyRate).toLocaleString() : (this.props.groupTuitionInfo.courseForTutor.hourlyRate).toLocaleString()} {this.props.profileState ? this.props.profileState.currency && this.props.profileState.currency.code ? this.props.profileState.currency.code : 'SGD' : 'SGD'} per hour
                      </td>
                    </tr>
                  </tbody>
                </table>
              </Col>
              <Col span={24} style={{ marginTop: '30px' }}>
                <h4 style={{ display: 'inline-block', marginRight: '15px' }}>{this.props.languageState.CALENDAR_GROUP_TUITION_DETAIL_PAGE_TUITION_GROUP_OF.translated} {this.props.groupTuitionInfo.course.maxClassSize} {this.props.languageState.CALENDAR_GROUP_TUITION_DETAIL_PAGE_NUMBER_OF_STUDENTS.translated}: </h4>
                {Array.apply(null, { length: this.props.groupTuitionInfo.course.maxClassSize } as any).map((_val, index) => index < this.props.groupTuitionInfo.students.length ? 1 : 0).map((val) => {
                  // return <Icon type="bulb" theme="filled" style={{color : val ? '#e2be0b' : 'gray', marginRight: '3px'}}/>
                  return <img src={val ? '/static/user-black.png' : '/static/user-gray.png'} style={{ width: '20px', height: '20px', marginRight: '5px' }} />
                })}
                <span>{`(${this.props.groupTuitionInfo.students.length} of ${this.props.groupTuitionInfo.course.maxClassSize} slots taken)`}</span>
              </Col>
              {this.props.profileState.roles[0] === 'tutor' ?
                this.props.groupTuitionInfo.students.length ?
                  <Col span={24}>
                    <h4 style={{ color: 'black', fontWeight: 600, fontSize: '21px', marginBottom: '0px' }}>{this.props.languageState.CALENDAR_GROUP_TUITION_DETAIL_PAGE_NUMBER_OF_STUDENTS.translated} :</h4>
                    <div>
                      {this.props.groupTuitionInfo.students.map(val => {
                        return <div style={{ marginBottom: '5px' }}>
                          <Popover placement="right" content={
                            <div>
                              <p><b>{this.props.languageState.CALENDAR_GROUP_TUITION_DETAIL_PAGE_STUDENT_NAME.translated}:</b> {val.fullName ? val.fullName : ''}</p>
                              <p><b>{this.props.languageState.CALENDAR_GROUP_TUITION_DETAIL_PAGE_STUDENT_DOB.translated}:</b> {val.dob ? new Date(val.dob).toDateString() : ''}</p>
                              <p><b>{this.props.languageState.CALENDAR_GROUP_TUITION_DETAIL_PAGE_STUDENT_BASED_IN.translated}:</b> {val.currentlyBasedIn ? val.currentlyBasedIn : ''}</p>
                              <p><b>{this.props.languageState.CALENDAR_GROUP_TUITION_DETAIL_PAGE_STUDENT_TIME_ZONe.translated}:</b> {val.timeZone && val.timeZone.gmt ? val.timeZone.gmt : ''}</p>
                            </div>
                          } title="Information Student">
                            <a style={{ color: 'black', fontSize: 16, marginTop: 10, marginRight: 15 }}>+ {val.fullName}</a>
                          </Popover>
                          <Avatar src={val.imageUrl ? val.imageUrl : '/static/default.png'}></Avatar>
                        </div>
                      })}
                    </div>
                  </Col>
                  : <div></div>
                : <Row style={{ marginBottom: 20 }}>
                  <a
                    target='_blank'
                    style={{ fontWeight: 600, color: 'black', fontSize: 21, marginTop: 10, marginRight: 15, cursor: 'auto', marginLeft: '10px' }}>{this.props.languageState.CALENDAR_GROUP_TUITION_DETAIL_PAGE_TUTOR.translated}: {this.props.groupTuitionInfo.tutor.fullName}</a>
                  <Avatar src={this.props.groupTuitionInfo.tutor.imageUrl ? this.props.groupTuitionInfo.tutor.imageUrl : '/static/default.png'}></Avatar>
                </Row>
              }
            </Row>
          </div>

          <div className="detailed-info" style={{ marginTop: '30px' }}>
            <div className="detailed-info-description">
              <h2 style={{ fontWeight: 600 }}>Course Details</h2>
              <p>Refer to the below date and time for your respective lessons.</p>
              <p>{this.props.profileState.roles[0] === 'student' ?
                this.props.languageState.CALENDAR_GROUP_TUITION_PLEASE_LEAVE_TUTOR.translated
                : this.props.languageState.CALENDAR_GROUP_TUITION_PLEASE_LEAVE_STUDENT.translated
              }</p>
              <p>{this.props.profileState.roles[0] === 'student' ?
                this.props.languageState.CALENDAR_GROUP_TUITION_TUTOR_LATE.translated
                : this.props.languageState.CALENDAR_GROUP_TUITION_STUDENT_LATE.translated
              }</p>
            </div>
            <div>
              <h2>{this.props.languageState.CALENDAR_GROUP_TUITION_STATUS.translated} {this.props.groupTuitionInfo.isActive ?
                this.props.groupTuitionInfo.students.length >= this.props.groupTuitionInfo.course.minClassSize ?
                  <span style={{ color: 'green' }}>{this.props.languageState.CALENDAR_GROUP_TUITION_ACTIVE.translated}</span> : <span style={{ color: 'green' }}>{this.props.languageState.CALENDAR_GROUP_TUITION_PENDING.translated}</span>
                : this.props.groupTuitionInfo.students.length >= this.props.groupTuitionInfo.course.minClassSize ?
                  this.props.groupTuitionInfo.isCompleted || this.props.groupTuitionInfo.isCanceled ?
                    <span style={{ color: '#f08223' }}>{this.props.languageState.CALENDAR_GROUP_TUITION_COMPLETE.translated}</span> : <span style={{ color: 'red' }}>{this.props.languageState.CALENDAR_GROUP_TUITION_INACTIVE.translated}</span> :
                  <span style={{ color: 'red' }}>{this.props.languageState.CALENDAR_GROUP_TUITION_INACTIVE.translated}</span>
              }</h2>
            </div>
            <div className="sessions-list">
              <Card title={<div style={{ fontWeight: 'bold' }}>{(this.props.groupTuitionInfo.period.length > 1 ? `${this.props.languageState.CALENDAR_GROUP_TUITION_DETAIL_PAGE_LESSON.translated} 1 - ${this.props.languageState.CALENDAR_GROUP_TUITION_DETAIL_PAGE_LESSON.translated} ${this.props.groupTuitionInfo.period.length}` : `${this.props.languageState.CALENDAR_GROUP_TUITION_DETAIL_PAGE_LESSON.translated} 1`)} <Tag color="magenta">{this.props.languageState.CALENDAR_GROUP_TUITION_DETAIL_PAGE_LESSON_PAID.translated}</Tag></div>}>
                <Row type="flex" gutter={24}>
                  {this.props.groupTuitionInfo.sessions.length ?
                    this.props.groupTuitionInfo.sessions.map((item, index) => (
                      <Col span={6} style={{ marginBottom: '12px' }} key={index}>
                        <Link href={`/calendar/group-session-detail/${item._id}`}>
                          <Card.Grid
                            style={{
                              width: '100%',
                              fontWeight: 'bold',
                              cursor: 'pointer',
                              background: new Date(item.end).getTime() < new Date().getTime() ? '#ffffff' : '#1890ff',
                              color: new Date(item.end).getTime() < new Date().getTime() ? 'inherit' : '#ffffff'
                            }}
                          >
                            {this.props.languageState.CALENDAR_GROUP_TUITION_DETAIL_PAGE_LESSON.translated} {index + 1}
                            <br />
                            <div>{this.props.languageState.CALENDAR_GROUP_TUITION_DETAIL_PAGE_LESSON_START.translated}: {moment(this.inputDateInUserTimezone(item.start)).format('DD MMM YYYY - HH:mm')}</div>
                            <div>
                              {this.props.languageState.CALENDAR_GROUP_TUITION_DETAIL_END.translated} {moment(this.inputDateInUserTimezone(item.end)).format('DD MMM YYYY - HH:mm')} &nbsp;
                            {this.inputDateInUserTimezone(item.end).getTime() < this.inputDateInUserTimezone().getTime() ?
                                <span><Tag color="green">{this.props.languageState.CALENDAR_GROUP_TUITION_DETAIL_FINISHED.translated}</Tag></span>
                                : <div></div>}
                            </div>
                          </Card.Grid>
                        </Link>
                      </Col>
                    )) : this.props.groupTuitionInfo.period.map((item, index) => (
                      <Col span={6} style={{ marginBottom: '12px' }} key={index}>
                        <Card.Grid
                          style={{
                            width: '100%',
                            fontWeight: 'bold',
                            background: new Date(item.end).getTime() < new Date().getTime() ? '#ffffff' : '#1890ff',
                            color: new Date(item.end).getTime() < new Date().getTime() ? 'inherit' : '#ffffff'
                          }}
                        >
                          {this.props.languageState.CALENDAR_GROUP_TUITION_DETAIL_PAGE_LESSON.translated} {index + 1}
                          <br />
                          <div>{this.props.languageState.CALENDAR_GROUP_TUITION_DETAIL_PAGE_LESSON_START.translated}: {moment(this.inputDateInUserTimezone(item.start)).format('DD MMM YYYY - HH:mm')}</div>
                          <div>
                            {this.props.languageState.CALENDAR_GROUP_TUITION_DETAIL_PAGE_LESSON_END.translated}: {moment(this.inputDateInUserTimezone(item.end)).format('DD MMM YYYY - HH:mm')} &nbsp;
                          {this.inputDateInUserTimezone(item.end).getTime() < this.inputDateInUserTimezone().getTime() && (
                              <span><Tag color="red">{this.props.languageState.CALENDAR_GROUP_TUITION_DETAIL_PAGE_DID_NOT_START.translated}</Tag></span>
                            )}
                          </div>
                        </Card.Grid>
                      </Col>
                    ))
                  }
                </Row>
              </Card>
            </div>
          </div>

          <Modal
            title={this.props.languageState.CALENDAR_GROUP_TUITION_DETAIL_PAGE_CANCEL_TUITION.translated}
            visible={this.props.cancelTuitionModalVisible}
            onOk={this.onCancelTuition}
            onCancel={this.props.closeCancelTuitionModal}
            okText={this.props.languageState.CALENDAR_GROUP_TUITION_DETAIL_PAGE_CANCEL_MODAL_OK_TEXT.translated}
            cancelText={this.props.languageState.CALENDAR_GROUP_TUITION_DETAIL_PAGE_CANCEL_MODAL_CANCEL_TEXT.translated}
            okButtonProps={{ style: { background: '#f4424e', color: '#ffffff', border: '1px solid #f4424e' } }}
          >
            <p style={{ color: '#f5222d', fontWeight: 600 }}>
              {
                this.props.profileState.roles[0] === 'tutor' ?
                  `${this.props.languageState.CALENDAR_GROUP_TUITION_DETAIL_PAGE_CANCEL_NOTI_1.translated}${this.props.groupTuitionInfo.students && this.props.groupTuitionInfo.students.length ?
                    (', ' + this.props.groupTuitionInfo.students.map((val, index) => index === this.props.groupTuitionInfo.students.length - 1 ? this.props.languageState.CALENDAR_GROUP_TUITION_DETAIL_PAGE_CANCEL_NOTI_2.translated + ' ' + val.fullName : this.props.languageState.CALENDAR_GROUP_TUITION_DETAIL_PAGE_CANCEL_NOTI_2.translated + ' ' + val.fullName + ' ' + this.props.languageState.CALENDAR_GROUP_TUITION_DETAIL_PAGE_CANCEL_NOTI_3.translated + ' ').join("") + ' ' + this.props.languageState.CALENDAR_GROUP_TUITION_DETAIL_PAGE_CANCEL_NOTI_4.translated) : ''}. ${this.props.languageState.CALENDAR_GROUP_TUITION_DETAIL_PAGE_CANCEL_NOTI_5.translated}`
                  :
                  `${this.props.languageState.CALENDAR_GROUP_TUITION_DETAIL_PAGE_CANCEL_NOTI_6.translated}`
              }
            </p>

            <div className="cancel-reasons">
              <p style={{ fontWeight: 'bold' }}>{this.props.languageState.CALENDAR_GROUP_TUITION_DETAIL_PAGE_CANCEL_REASON.translated}: </p>
              <Input.TextArea
                rows={4}
                onChange={(e) => this.props.cancelReasonChange({ cancelReason: e.target.value })}
              />
            </div>
          </Modal>
        </Layout>
      </UserLayout>
    );
  }
}

const mapState = (rootState: any) => {
  return {
    ...rootState.groupTuitionDetailPageModel,
    profileState: rootState.profileModel,
    editProfilePageState: rootState.editProfilePageModel,
    languageState: rootState.languageModel,
  };
};

const mapDispatch = (rootReducer: any) => {
  return {
    ...rootReducer.groupTuitionDetailPageModel,
    profileReducers: rootReducer.profileModel,
    editProfilePageReducers: rootReducer.editProfilePageModel,
  };
};

export default withRematch(initStore, mapState, mapDispatch)(
  UpcomingTutionCalendar
);
