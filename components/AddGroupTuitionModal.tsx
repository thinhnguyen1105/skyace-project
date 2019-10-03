import * as React from 'react';
import moment from 'moment';
import { Form, Modal, Input, Row, Col, message, Table, Button, DatePicker, AutoComplete, Select, Tooltip } from 'antd';
import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop';
import Calendar from 'react-big-calendar';
import { extendMoment } from 'moment-range';
import 'react-big-calendar/lib/addons/dragAndDrop/styles.css';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import './custom-calendar.css';
import * as uuid from 'uuid';

Calendar.setLocalizer(Calendar.momentLocalizer(moment));
const DragAndDropCalendar = withDragAndDrop(Calendar);
const extendedMoment = extendMoment(moment);
const Option = Select.Option;

class AddGroupTuitionModal extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      startDayInCalendar: new Date(),
      // mounted: false
    };
  }

  componentDidMount() {
    // this.setState({mounted: true})
    this.props.loadTutorSchedules({
      start: new Date(extendedMoment().startOf('week').toString()).toUTCString(),
      end: new Date(extendedMoment().endOf('week').toString()).toUTCString(),
      tutorId: this.props.profileState._id,
    });
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

  checkTutorAvail = (event) => {
    let isOverlapsed = true;

    // check within tutor schedule
    if (this.props.schedulesData.length) {
      for (let item of this.props.schedulesData.filter((item) => item.type === 'tutor')) {
        const itemRange = extendedMoment.range(item.start, item.end);
        if (itemRange.contains(event.start) && itemRange.contains(event.end)) {
          isOverlapsed = false;
          break;
        }
      }
    }
    return isOverlapsed;
  }

  checkOverlaps = (event) => {
    let isOverlapsed = true;

    // check within tutor schedule
    if (this.props.schedulesData.length) {
      for (let item of this.props.schedulesData.filter((item) => item.type === 'tutor')) {
        const itemRange = extendedMoment.range(item.start, item.end);
        if (itemRange.contains(event.start) && itemRange.contains(event.end)) {
          isOverlapsed = false;
          break;
        }
      }
    }

    // check overlaps with other booked
    if (!isOverlapsed) {
      const eventRange = extendedMoment.range(event.start, event.end);
      for (let item of [...this.props.schedulesData.filter((item) => item.type === 'student'), ...this.props.createGroupTuitionInput.period]) {
        const itemRange = extendedMoment.range(item.start, item.end);
        if (itemRange.overlaps(eventRange)) {
          isOverlapsed = true;
          break;
        }
      }
    }

    // check overlaps with other group tuitions
    if (!isOverlapsed) {
      const eventRange = extendedMoment.range(event.start, event.end);
      for (let item of [...this.props.schedulesData.filter((item) => item.type === 'tutor' && item.isGroup || item.type === 'trial'), ...this.props.createGroupTuitionInput.period]) {
        const itemRange = extendedMoment.range(item.start, item.end);
        if (itemRange.overlaps(eventRange)) {
          isOverlapsed = true;
          break;
        }
      }
    }

    return isOverlapsed;
  }

  checkBookingInThePast = (eventInfo) => {
    let isInThePast = false;

    if (this.outputDateInUserTimezone().getTime() > this.outputDateInUserTimezone(eventInfo.start).getTime()) {
      isInThePast = true;
    }

    return isInThePast;
  }

  createNewPeriod = (eventInfo: any) => {
    if (this.props.createGroupTuitionInput.hourPerSession > 0 && this.props.createGroupTuitionInput.session > 0) {
      if (this.props.createGroupTuitionInput.session <= this.props.createGroupTuitionInput.period.length) {
        message.error('You cannot select more than ' + this.props.createGroupTuitionInput.session + ' lessons.', 4);
      }
      else {
        if (this.checkBookingInThePast(eventInfo)) {
          message.error("Can't create booking in the past !", 4);
        } else if (this.props.schedulesData.length && this.checkTutorAvail({
          ...eventInfo,
          start: this.outputDateInUserTimezone(eventInfo.start),
          end: this.outputDateInUserTimezone(new Date(eventInfo.start).getTime() + this.props.createGroupTuitionInput.hourPerSession * 60 * 60 * 1000),
        })) {
          message.error('Check your availability again. You may have chosen a period where you are not fully available.', 4);
        } else if (this.props.schedulesData.length && this.checkOverlaps({
          ...eventInfo,
          start: this.outputDateInUserTimezone(eventInfo.start),
          end: this.outputDateInUserTimezone(new Date(eventInfo.start).getTime() + this.props.createGroupTuitionInput.hourPerSession * 60 * 60 * 1000),
        })) {
          message.error('Unsuitable time slot!', 4);
        } else {
          if (!this.props.schedulesData.length) {
            message.error('Not available at this time!', 4);
          } else {
            this.props.changeCreateGroupTuitionInput({
              data: {
                period: {
                  _id: uuid.v4(),
                  start: this.outputDateInUserTimezone(eventInfo.start),
                  end: this.outputDateInUserTimezone(new Date(eventInfo.start).getTime() + this.props.createGroupTuitionInput.hourPerSession * 60 * 60 * 1000),
                }
              }
            });
          }
        }
      }
    } else {
      message.error("You have to select number of lessons and lesson's duration first!", 4);
    }
  }

  convertLocalToUTC = (date) => {
    return date.toUTCString();
  }

  navigate = (thisDay: any, viewType: string, _navigateType: string) => {
    this.setState({
      startDayInCalendar: thisDay
    });
    this.props.loadTutorSchedules({
      start: this.convertLocalToUTC(new Date(extendedMoment(thisDay).startOf(viewType as any).toString())),
      end: this.convertLocalToUTC(new Date(extendedMoment(thisDay).endOf(viewType as any).toString())),
      tutorId: this.props.profileState._id
    });
  }

  handleViewChange = (viewType: string) => {
    this.props.loadTutorSchedules({
      start: this.convertLocalToUTC(new Date(extendedMoment(this.state.startDayInCalendar).startOf(viewType as any).toString())),
      end: this.convertLocalToUTC(new Date(extendedMoment(this.state.startDayInCalendar).endOf(viewType as any).toString())),
      tutorId: this.props.profileState._id
    });
  }

  onClosePaymentModal = async () => {
    if (this.props.currentBookings.data === undefined) {
      this.props.closePaymentModal();
    } else {
      const idCurrentBookings = this.props.currentBookings.data.map((item) => {
        return item._id;
      });
      const idCurrentTuition = this.props.newTuition._id;
      const idCurrentSessionsResult = this.props.sessionsResult.data.map((item) => {
        return item._id;
      });
      await this.props.deleteTuitionInfo({ idCurrentBookings: idCurrentBookings, idCurrentTuition: idCurrentTuition, idCurrentSessionsResult: idCurrentSessionsResult });
      this.props.closePaymentModal();
    }
  }

  selectEvent = (event) => {
    this.props.selectEvent({
      selectedEvent: {
        ...event,
        start: this.outputDateInUserTimezone(event.start),
        end: this.outputDateInUserTimezone(event.end),
      }
    });
  }

  moveEvent = (moveInfo: any) => {
    if (this.checkBookingInThePast(moveInfo)) {
      message.error("Can't create booking in the past !", 4);
    }
    else if (this.checkOverlaps({
      ...moveInfo.event,
      start: this.outputDateInUserTimezone(moveInfo.start),
      end: this.outputDateInUserTimezone(moveInfo.end)
    })) {
      message.error('Unsuitable time slot !', 4);
    } else {
      this.deletePeriod(moveInfo.event);
      this.props.changeCreateGroupTuitionInput({
        data: {
          period: {
            _id: uuid.v4(),
            start: this.outputDateInUserTimezone(moveInfo.start),
            end: this.outputDateInUserTimezone(new Date(moveInfo.start).getTime() + this.props.createGroupTuitionInput.hourPerSession * 60 * 60 * 1000),
          }
        }
      });
    }
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
      display: 'block'
    };

    const groupTuitionBooked = {
      backgroundColor: '#FF6666',
      borderRadius: '5px',
      zIndex: 2,
      opacity: 1,
      color: '#ffffff',
      display: 'block',
      border: '1px solid #FF6666',
    }

    if (new Date(event.end).getTime() < new Date().getTime()) {
      return {
        style: completedSchedule,
      };
    } else {
      if (event.type === 'tutor') {
        if (event.isGroup) {
          return {
            style: groupTuitionBooked
          }
        } else {
          return {
            style: tutorAvailbleSchedule
          }
        }
      } else if (event.type === 'student' && event.owner === this.props.profileState._id && event._id) {
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

  timeChange = (time) => {
    this.props.eventInfoChange({
      newEventInfo: {
        start: moment(this.props.selectedEvent.start).hour(time.hour()).minutes(time.minutes()),
        end: moment(new Date(extendedMoment(this.props.selectedEvent.start).hour(time.hour()).minutes(time.minutes()).toString()).getTime() + this.props.createGroupTuitionInput.hourPerSession * 60 * 60 * 1000)
      },
    });
  }

  saveEventChanges = (_e) => {
    if (new Date(this.props.selectedEvent.start).getTime() >= new Date(this.props.selectedEvent.end).getTime()) {
      this.props.errorHappen({ errorMessage: `"Start time" can't come after "end time"` });
    } else {
      this.props.updateNewBooking();
    }
  }

  deletePeriod = (event) => {
    this.props.deletePeriod(event._id);
  }

  changeEndReg = (data) => {
    this.props.form.setFieldsValue({ 'endReg': data })
    this.props.form.validateFields(['endReg'], (err, _val) => {
      if (err) {
        console.log(err);
      }
    });
    this.props.changeCreateGroupTuitionInput({ data: { endReg: data } });
  }

  changeLevel = (value) => {
    this.props.form.setFieldsValue({
      'grade': ''
    });
    this.props.changeCreateGroupTuitionInput({
      data: {
        level: value,
        grade: ''
      }
    });
  }

  createGroupTuition = async () => {
    this.props.form.validateFields(async (err, _val) => {
      if (err) {
        console.log(err);
      } else {
        if (this.props.createGroupTuitionInput.period.length === Number(this.props.createGroupTuitionInput.session)) {
          await this.props.createGroupTuition({
            tutor: this.props.profileState._id,
            course: {
              country: this.props.createGroupTuitionInput.country,
              subject: this.props.createGroupTuitionInput.subject,
              level: this.props.createGroupTuitionInput.level,
              grade: this.props.createGroupTuitionInput.grade,
              hourlyRate: this.props.createGroupTuitionInput.hourlyRate,
              session: this.props.createGroupTuitionInput.session,
              hourPerSession: this.props.createGroupTuitionInput.hourPerSession,
              minClassSize: this.props.createGroupTuitionInput.minClassSize,
              maxClassSize: this.props.createGroupTuitionInput.maxClassSize,
              startReg: this.props.createGroupTuitionInput.startReg,
              endReg: this.props.createGroupTuitionInput.endReg
            },
            period: this.props.createGroupTuitionInput.period
          });
          this.props.loadTutorSchedules({
            start: new Date(extendedMoment().startOf('week').toString()).toUTCString(),
            end: new Date(extendedMoment().endOf('week').toString()).toUTCString(),
            tutorId: this.props.profileState._id,
          });
          message.success('New group tuition created successfully!');
          this.hideModal();
        } else {
          message.error('You have to select exact ' + this.props.createGroupTuitionInput.session + ' lessons for your group tuition.', 4);
        }
      }
    });
  }

  hideModal = () => {
    this.props.form.resetFields();
    this.props.hideModal();
  }

  render() {
    const actionButtons = (record: any) => {
      return (
        <div className="action-buttons">
          <Button
            type="primary"
            icon='delete'
            className="button"
            onClick={(_e) => this.deletePeriod(record)}
            style={{ marginRight: '12px' }}
          />
        </div>
      );
    };

    const columns = [
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
        render: (_text, record, _index) => actionButtons(record)
      }
    ];

    const { getFieldDecorator } = this.props.form;

    const exchangeRate = this.props.profileState ? this.props.profileState.currency ? this.props.profileState.currency.exchangeRate : 1 : 1;
    const currency = this.props.profileState ? this.props.profileState.currency ? this.props.profileState.currency.code : 'SGD' : 'SGD';


    const customMonthEvent = ({ event }) => {
      return (
        <Tooltip
          placement="rightTop"
          title={<Button icon='delete' onClick={(_e) => this.props.openDeleteModal(event)} />}
        >
          <div style={{ fontSize: '12px' }}>
            {`${extendedMoment(this.inputDateInUserTimezone(event.start)).format('HH:mm')} - ${extendedMoment(this.inputDateInUserTimezone(event.end)).format('HH:mm')}`}
          </div>
        </Tooltip>
      );
    }

    return (
      <Modal
        width={1200}
        title={this.props.languageState.ADD_GROUP_TUITION_MODAL_PAGE_MODAL_TITLE.translated}
        visible={this.props.visible}
        onOk={this.createGroupTuition}
        onCancel={this.hideModal}
        okText={this.props.languageState.ADD_GROUP_TUITION_MODAL_PAGE_OK_TEXT.translated}
        cancelButtonProps={{ style: { display: 'none' } }}
      >
        <div>
          <Form>
            <Row>
              <Col xs={24} sm={12} md={8} lg={5}>
                <h4 style={{ textAlign: 'left', padding: '0px 10px' }}>Country</h4>
                <Form.Item style={{ width: '100%', display: 'block', padding: '0px 10px' }}>
                  {getFieldDecorator('country', {
                    initialValue: this.props.createGroupTuitionInput.country,
                    rules: [
                      { required: true, message: this.props.languageState.ADD_GROUP_TUITION_MODAL_PAGE_COUNTRY_FIELD_MESSAGE.translated, whitespace: true }
                    ],
                    validateTrigger: 'onBlur',
                  })(
                    <AutoComplete
                      placeholder="Country"
                      dataSource={this.props.dataLookupState.course.country ? this.props.dataLookupState.course.country.map((item) => item.name) : []}
                      onChange={(value) => this.props.changeCreateGroupTuitionInput({ data: { country: value } })}
                      filterOption={(inputValue, option) => (option.props.children as any).toString().toUpperCase().indexOf(inputValue.toUpperCase()) !== -1}
                    />
                  )}
                </Form.Item>
              </Col>
              <Col xs={24} sm={12} md={8} lg={5}>
                <h4 style={{ textAlign: 'left', padding: '0px 10px' }}>Subject</h4>
                <Form.Item style={{ width: '100%', display: 'block', padding: '0px 10px' }}>
                  {getFieldDecorator('subject', {
                    initialValue: this.props.createGroupTuitionInput.subject,
                    rules: [
                      { required: true, message: this.props.languageState.ADD_GROUP_TUITION_MODAL_PAGE_SUBJECT_FIELD_MESSAGE.translated, whitespace: true }
                    ],
                    validateTrigger: 'onBlur',
                  })(
                    <Select
                      placeholder="Subject"
                      onChange={(val) => this.props.changeCreateGroupTuitionInput({ data: { subject: val } })}
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
                  {getFieldDecorator('level', {
                    initialValue: this.props.createGroupTuitionInput.level,
                    rules: [
                      { required: true, message: this.props.languageState.ADD_GROUP_TUITION_MODAL_PAGE_LEVEL_FIELD_MESSAGE.translated, whitespace: true }
                    ],
                    validateTrigger: 'onBlur',
                  })(
                    <Select
                      placeholder="Level"
                      onChange={(value) => this.changeLevel(value)}
                    >
                      {
                        this.props.levels ? this.props.levels.filter(val => val.name !== 'trial').map((item) => item._id ? (<Option value={item.name} key={item._id}>{item.name}</Option>) : "") : ''
                      }
                    </Select>
                  )}
                </Form.Item>
              </Col>
              <Col xs={24} sm={12} md={8} lg={5}>
                <h4 style={{ textAlign: 'left', padding: '0px 10px' }}>Grade</h4>
                <Form.Item style={{ width: '100%', display: 'block', padding: '0px 10px' }}>
                  {getFieldDecorator('grade', {
                    initialValue: this.props.createGroupTuitionInput.grade || null,
                    rules: [
                      { required: true, message: this.props.languageState.ADD_GROUP_TUITION_MODAL_PAGE_GRADE_FIELD_MESSAGE.translated, whitespace: true }
                    ],
                    validateTrigger: 'onBlur',
                  })(
                    <Select
                      placeholder="Grade"
                      onChange={(value) => this.props.changeCreateGroupTuitionInput({ data: { grade: value } })}
                    >
                      {
                        this.props.createGroupTuitionInput.level ?
                        this.props.grades.filter((item) => item.level.name === this.props.createGroupTuitionInput.level).map((item) => item._id ?
                        (<Option value={item.name} key={item._id}>{item.name}</Option>) : "") : <Option value="" key="0" disabled={true}>{this.props.languageState.ADD_GROUP_TUITION_MODAL_PAGE_LEVEL_LABEL.translated}</Option>
                      }
                    </Select>
                  )}
                </Form.Item>
              </Col>
              <Col xs={24} sm={12} md={8} lg={4}>
                <h4 style={{ textAlign: 'left', padding: '0px 10px' }}>Hourly rate</h4>
                <div style={{ display: 'flex' }}>
                  <Form.Item style={{ width: 'auto', display: 'block', padding: '0px 10px', marginBottom: '0px' }}>
                    {getFieldDecorator('hourlyRate', {
                      initialValue: Number(this.props.createGroupTuitionInput.hourlyRate / exchangeRate).toFixed(2) || 0,
                      rules: [
                        {
                          validator: (_rule, value, callback) => {
                            if (value && value > 0) {
                              if (value <= 200 / exchangeRate) {
                                callback();
                              } else {
                                callback(this.props.languageState.ADD_GROUP_TUITION_MODAL_PAGE_HOURLY_RATE_MAX_MESSAGE.translated + ' ' + (200 / exchangeRate).toFixed(2) + ' ' + currency)
                              }
                            } else {
                              callback(this.props.languageState.ADD_GROUP_TUITION_MODAL_PAGE_HOURLY_RATE_MIN_MESSAGE.translated);
                            }
                          }
                        }
                      ],
                      validateTrigger: 'onBlur',
                    })(
                      <Input
                        style={{ display: 'inline-block' }}
                        type="number"
                        placeholder={this.props.languageState.ADD_GROUP_TUITION_MODAL_PAGE_HOURLY_RATE_PLACEHOLDER.translated}
                        onChange={(e) => this.props.changeCreateGroupTuitionInput({ data: { hourlyRate: Number(e.target.value) * exchangeRate } })}
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
                    initialValue: this.props.createGroupTuitionInput.session,
                    rules: [
                      {
                        validator: (_rule, value, callback) => {
                          if (value && value > 0) {
                            callback();
                          } else {
                            callback(this.props.languageState.ADD_GROUP_TUITION_MODAL_PAGE_LESSON_REQUIRE_MESSAGE.translated);
                          }
                        }
                      }
                    ],
                    validateTrigger: 'onBlur',
                  })(
                    <Input
                      type="number"
                      placeholder={this.props.languageState.ADD_GROUP_TUITION_MODAL_PAGE_LESSON_PLACEHOLDER.translated}
                      onChange={(e) => this.props.changeCreateGroupTuitionInput({ data: { session: e.target.value } })}
                    />
                  )}
                </Form.Item>
              </Col>
              <Col xs={24} sm={12} md={8} lg={5}>
                <h4 style={{ textAlign: 'left', padding: '0px 10px' }}>Duration</h4>
                <Form.Item style={{ width: '100%', display: 'block', padding: '0px 10px' }}>
                  {getFieldDecorator('hourPerSession', {
                    initialValue: this.props.createGroupTuitionInput.hourPerSession,
                    rules: [
                      {
                        validator: (_rule, value, callback) => {
                          if (value && value > 0) {
                            callback();
                          } else {
                            callback(this.props.languageState.ADD_GROUP_TUITION_MODAL_PAGE_LESSON_DURATION_REQUIRE_MESSAGE.translated);
                          }
                        }
                      }
                    ],
                    validateTrigger: 'onBlur',
                  })(
                    <Select
                      style={{ width: '100%' }}
                      placeholder={this.props.languageState.ADD_GROUP_TUITION_MODAL_PAGE_LESSON_DURATION_PLACEHOLDER.translated}
                      onChange={(value) => this.props.changeCreateGroupTuitionInput({ data: { hourPerSession: value } })}
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
                    {getFieldDecorator('minClassSize', {
                      initialValue: this.props.createGroupTuitionInput.minClassSize,
                      rules: [
                        {
                          validator: (_rule, value, callback) => {
                            if (value && value >= 2) {
                              callback();
                            } else {
                              callback(this.props.languageState.ADD_GROUP_TUITION_MODAL_PAGE_CLASS_SIZE__MIN_MESSAGE.translated);
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
                          defaultValue={this.props.createGroupTuitionInput.minClassSize}
                          onChange={(e) => this.props.changeCreateGroupTuitionInput({ data: { minClassSize: e.target.value } })}
                        />
                      </div>
                    )}
                  </Form.Item>
                </Col>
                <Col xs={12}>
                  <Form.Item style={{ display: 'inline-block', padding: '0px 10px', width: '100%' }}>
                    {getFieldDecorator('maxClassSize', {
                      initialValue: this.props.createGroupTuitionInput.maxClassSize,
                      rules: [
                        {
                          validator: (_rule, value, callback) => {
                            if (value && value >= 2) {
                              callback();
                            } else {
                              callback(this.props.languageState.ADD_GROUP_TUITION_MODAL_PAGE_CLASS_SIZE__MIN_MESSAGE.translated);
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
                          defaultValue={this.props.createGroupTuitionInput.maxClassSize}
                          onChange={(e) => this.props.changeCreateGroupTuitionInput({ data: { maxClassSize: e.target.value } })}
                        />
                      </div>
                    )}
                  </Form.Item>
                </Col>
              </Col>
              <Col xs={24} sm={24} md={18} lg={12} style={{ marginBottom: 20 }}>
                <h4 style={{ textAlign: 'left', padding: '0px 10px', width: '100%' }}>Registration period</h4>
                <Col xs={12} >
                  <Form.Item style={{ display: 'inline-block', padding: '0px 10px', width: '100%' }}>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <span style={{ marginRight: '10px' }}>From</span>
                      <DatePicker
                        style={{ display: 'inline-block', width: '100%' }}
                        value={moment(this.props.createGroupTuitionInput.startReg)}
                        format="DD MMM YYYY"
                        allowClear={false}
                        showToday={true}
                        placeholder='From'
                        onChange={(value) => this.props.changeCreateGroupTuitionInput({ data: { startReg: value } })}
                      />
                    </div>
                  </Form.Item>
                </Col>
                <Col xs={12}>
                  <Form.Item style={{ display: 'inline-block', padding: '0px 10px', width: '100%' }}>
                    {getFieldDecorator('Reg', {
                      initialValue: moment(this.props.createGroupTuitionInput.endReg),
                    })(
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        <span style={{ marginRight: '10px' }}>To</span>
                        <DatePicker
                          style={{ display: 'inline-block', width: '100%' }}
                          defaultValue={moment(this.props.createGroupTuitionInput.endReg)}
                          format="DD MMM YYYY"
                          allowClear={false}
                          showToday={true}
                          placeholder='To'
                          onChange={(value) => this.changeEndReg(value)}
                        />
                      </div>
                    )}
                  </Form.Item>
                </Col>
              </Col>
              <Col xs={24}>
                <h4 style={{ paddingLeft: '10px', marginBottom: '0px' }}>Lesson Schedule</h4>
              </Col>
              <Col xs={24} lg={16} className="custom-calendar">
                <DragAndDropCalendar
                  key={1}
                  selectable={true}
                  defaultDate={this.inputDateInUserTimezone()}
                  defaultView={Calendar.Views.WEEK}
                  events={[...this.props.schedulesData, ...this.props.createGroupTuitionInput.period].map((item) => ({ ...item, start: this.inputDateInUserTimezone(item.start), end: this.inputDateInUserTimezone(item.end) }))}
                  style={{ minHeight: '800px', width: '734px', marginLeft: '10px', marginRight: '24px' }}
                  onSelectEvent={(event) => this.selectEvent(event)}
                  scrollToTime={new Date(1970, 1, 1, 6)}
                  onEventDrop={this.moveEvent}
                  popup={true}
                  onSelectSlot={this.createNewPeriod}
                  onNavigate={this.navigate}
                  onView={this.handleViewChange}
                  eventPropGetter={this.eventStyleGetter}
                  views={['month', 'week']}
                  components={{
                    month: { event: customMonthEvent },
                  }}
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
                  columns={columns}
                  rowKey={(_record, index) => index.toString()}
                  dataSource={this.props.createGroupTuitionInput.period.sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime()).map((item) => ({
                    ...item,
                    start: this.inputDateInUserTimezone(item.start),
                    end: this.inputDateInUserTimezone(item.end)
                  }))}
                />
              </Col>
            </Row>
          </Form>
          <div style={{ marginTop: '20px' }}>
            <h4>1. {this.props.languageState.ADD_GROUP_TUITION_MODAL_PAGE_SUM_MESSAGE.translated}</h4>
            <h4>2. {this.props.languageState.ADD_GROUP_TUITION_MODAL_PAGE_SEND_EMAIL_CTA.translated}</h4>
            <h4>3. {this.props.languageState.ADD_GROUP_TUITION_MODAL_PAGE_REGISTRATION_MESSAGE.translated}</h4>
          </div>
        </div>
      </Modal>
    );
  }
}

export default Form.create()(AddGroupTuitionModal);
