import * as React from 'react';
import Calendar from 'react-big-calendar';
import moment from 'moment';
import { Row, Col, TimePicker, Button, Spin, message, Modal, Radio, Table, Popconfirm, Tooltip, Layout } from 'antd';
import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import 'react-big-calendar/lib/addons/dragAndDrop/styles.css';
import initStore from '../../rematch/store';
import withRematch from '../../rematch/withRematch';
import { extendMoment } from 'moment-range';
import './calendar.css';
import UserLayout from '../../layout/UserLayout';
const Content = Layout.Content;

Calendar.setLocalizer(Calendar.momentLocalizer(moment));
const DragAndDropCalendar = withDragAndDrop(Calendar);
const extendedMoment = extendMoment(moment);

class TutorCalendar extends React.Component<any, any> {
  componentDidMount() {
    this.props.fetchData({
      start: new Date(extendedMoment().startOf('week').toString()).toUTCString() as any,
      end: new Date(extendedMoment().endOf('week').toString()).toUTCString() as any,
      tutorId: this.props.profileState._id
    });
  }

  state = {
    startDayInCalendar: new Date()
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
      cursor: 'pointer',
      height: '100%',
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

    if (this.inputDateInUserTimezone(event.end).getTime() < this.inputDateInUserTimezone().getTime() && event.type === 'tutor' && !event.isGroup) {
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
      } else if (event.type === 'student' && event.owner === this.props.profileState._id) {
        return {
          style: currentStudentBooked,
        };
      } else {
        return {
          style: otherStudentBooked,
        };
      }
    }
  }

  checkOverLaps = (event, start, end) => {
    const newEventRange = extendedMoment.range(start, end);
    let isOverlapsed = false;
    this.props.data.filter((item) => item.type === 'tutor' && !item.isGroup).forEach((item) => {
      if (item._id !== event._id) {
        const itemRange = extendedMoment.range(item.start, item.end);
        if (newEventRange.overlaps(itemRange)) {
          isOverlapsed = true;
        }
      }
    });
    return isOverlapsed;
  }

  checkScheduleInThePast = (eventInfo) => {
    let isInThePast = false;
    if (this.outputDateInUserTimezone().getTime() > this.outputDateInUserTimezone(eventInfo.start).getTime()) {
      isInThePast = true;
    }
    return isInThePast;
  }

  checkStudentBookingsInsideTutorSchedules = (eventInfo) => {
    const scheduleBeforeUpdate = this.props.data.filter((item) => item._id === eventInfo._id)[0];

    const oldRange = extendedMoment.range(scheduleBeforeUpdate.start, scheduleBeforeUpdate.end);
    const studentBookingsInsideOldRange: any = [];

    for (let booking of this.props.data.filter((item) => item.type === 'student' || (item.type === 'tutor' && item.isGroup) || item.type === 'trial')) {
      const bookingRange = extendedMoment.range(booking.start, booking.end);
      if (oldRange.contains(bookingRange)) {
        studentBookingsInsideOldRange.push(booking);
      }
    }

    let result = true;
    const newRange = extendedMoment.range(eventInfo.start, eventInfo.end);
    for (let booking of studentBookingsInsideOldRange) {
      const bookingRange = extendedMoment.range(booking.start, booking.end);
      if (!newRange.contains(bookingRange)) {
        result = false;
        break;
      }
    }

    return result;
  }

  saveEventChanges = (_e) => {
    if (this.outputDateInUserTimezone(this.props.selectedEvent.start).getTime() >= this.outputDateInUserTimezone(this.props.selectedEvent.end).getTime()) {
      message.error(this.props.languageState.CALENDAR_TUTOR_PAGE_SAVE_EVENT_VALIDATION_1.translated, 4);
    } else if (this.checkScheduleInThePast(this.props.selectedEvent)) {
      message.error(this.props.languageState.CALENDAR_TUTOR_PAGE_SAVE_EVENT_VALIDATION_2.translated, 4);
    } else if (this.checkOverLaps(this.props.selectedEvent, this.outputDateInUserTimezone(this.props.selectedEvent.start), this.outputDateInUserTimezone(this.props.selectedEvent.end))) {
      message.error(this.props.languageState.CALENDAR_TUTOR_PAGE_SAVE_EVENT_VALIDATION_3.translated, 4);
    } else if (!this.checkStudentBookingsInsideTutorSchedules(this.props.selectedEvent)) {
      message.error(this.props.languageState.CALENDAR_TUTOR_PAGE_SAVE_EVENT_VALIDATION_4.translated, 4);
    } else {
      this.props.updateSchedule({
        ...this.props.selectedEvent,
        start: this.convertLocalToUTC(this.props.selectedEvent.start),
        end: this.convertLocalToUTC(this.props.selectedEvent.end),
      });
    }
  }

  startEditRecord = (record) => {
    // TODO : Check if record contains any other event
    const studentBookings = this.props.data.filter((item) => item.type === 'student');
    const updateEventRange = extendedMoment.range(this.props.selectedEvent.start, this.props.selectedEvent.end);
    let canUpdate = true;

    for (let item of studentBookings) {
      if (updateEventRange.contains(new Date(item.start)) && updateEventRange.contains(new Date(item.end))) {
        canUpdate = false;
        break;
      }
    }

    if (canUpdate) {
      this.onSelectEvent(record)
    } else {
      message.error(this.props.languageState.CALENDAR_TUTOR_PAGE_EDIT_EVENT_VALIDATION.translated, 4);
    }
  }

  onSelectEvent = (event) => {
    this.props.selectEvent({
      selectedEvent: {
        ...event,
        start: this.outputDateInUserTimezone(event.start),
        end: this.outputDateInUserTimezone(event.end),
      }
    });
  }

  moveEvent = (moveInfo: any) => {
    if (this.checkOverLaps(moveInfo.event, this.outputDateInUserTimezone(moveInfo.start), this.outputDateInUserTimezone(moveInfo.end))) {
      message.error(this.props.languageState.CALENDAR_TUTOR_PAGE_SAVE_EVENT_VALIDATION_5.translated, 4);
    } else if (this.checkScheduleInThePast(moveInfo)) {
      message.error(this.props.languageState.CALENDAR_TUTOR_PAGE_SAVE_EVENT_VALIDATION_2.translated, 4);
    } else {
      this.props.updateSchedule({
        ...moveInfo.event,
        start: this.convertLocalToUTC(this.outputDateInUserTimezone(moveInfo.start)),
        end: this.convertLocalToUTC(this.outputDateInUserTimezone(moveInfo.end)),
      });
    }
  }

  resizeEvent = (_resizeType: any, resizeInfo: any) => {
    if (resizeInfo.start.getDate() !== resizeInfo.end.getDate()) {
      message.error(this.props.languageState.CALENDAR_TUTOR_PAGE_RESIZE_EVENT.translated);
    }
    else if (this.checkOverLaps(resizeInfo.event, resizeInfo.start, resizeInfo.end)) {
      message.error(this.props.languageState.CALENDAR_TUTOR_PAGE_UNSUITABLE_TIME_SLOT.translated, 4);
    } else if (this.checkScheduleInThePast(resizeInfo)) {
      message.error(this.props.languageState.CALENDAR_TUTOR_PAGE_CANT_MOVE_EVENT_IN_THE_PAST.translated, 4);
    } else {
      this.props.updateSchedule({
        ...resizeInfo.event,
        start: this.convertLocalToUTC(this.outputDateInUserTimezone(resizeInfo.start)),
        end: this.convertLocalToUTC(this.outputDateInUserTimezone(resizeInfo.end)),
      });
    }
  }

  createDraftEvent = (eventInfo: any) => {
    if (this.props.statusView === 'week') {
      if (this.checkScheduleInThePast(eventInfo)) {
        message.error(this.props.languageState.CALENDAR_TUTOR_PAGE_CANT_CREATE_SCHEDULE.translated, 4);
      } else if (this.checkOverLaps(eventInfo, this.outputDateInUserTimezone(eventInfo.start), this.outputDateInUserTimezone(eventInfo.end))) {
        message.error(this.props.languageState.CALENDAR_TUTOR_PAGE_UNSUITABLE_TIME_SLOT.translated, 4);
      } else {
        if ((eventInfo.end.valueOf() - eventInfo.start.valueOf()) === 1800000) {
          message.error(this.props.languageState.CALENDAR_TUTOR_PAGE_YOU_HAVE_SELECTED.translated +
            this.props.languageState.CALENDAR_TUTOR_PAGE_PLEASE_CHECK_THAT.translated, 6);
        } else {
          this.props.openRepeatModal({
            start: this.convertLocalToUTC(this.outputDateInUserTimezone(eventInfo.start)),
            end: this.convertLocalToUTC(this.outputDateInUserTimezone(eventInfo.end)),
            owner: this.props.profileState._id,
            type: 'tutor',
          });
        }
      }
    } else {
      message.error(this.props.languageState.CALENDAR_TUTOR_PAGE_PLEASE_SELECT_IN_WEEK.translated);
    }
  }

  saveNewEvent = async () => {
    if (this.props.createScheduleOption === 'onlyThisWeek') {
      this.props.saveNewSchedule(this.props.newSchedule);
    } else if (this.props.createScheduleOption === 'everyWeek') {
      const baseSchedule = this.props.newSchedule;
      await this.props.saveNewSchedule(this.props.newSchedule);

      const scheduleList: any = [];
      const end = new Date(new Date(baseSchedule.end).setFullYear(new Date(baseSchedule.end).getFullYear() + 1)).getTime();

      let stop = false;
      let i = 1;
      while (!stop) {
        const newSchedule = {
          start: new Date(new Date(baseSchedule.start).getTime() + i * 86400 * 7 * 1000),
          end: new Date(new Date(baseSchedule.end).getTime() + i * 86400 * 7 * 1000),
          type: baseSchedule.type,
          owner: baseSchedule.owner,
          baseOn: this.props.data[this.props.data.length - 1]._id,
        };

        if (newSchedule.end.getTime() <= new Date(end).getTime()) {
          scheduleList.push(newSchedule);
          i += 1;
        } else {
          stop = true;
        }
      }

      this.props.saveMultipleSchedules({ scheduleList });
    }
  }

  saveDeleteEvent = async () => {
    if (this.props.deleteScheduleOption === 'onlyThisWeek') {
      const studentBookings = this.props.data.filter((item) => item.type === 'student' || item.type === 'tutor' && item.isGroup || item.type === 'trial');
      const deleteEventRange = extendedMoment.range(this.props.deleteSchedule.start, this.props.deleteSchedule.end);
      let canDelete = true;

      for (let item of studentBookings) {
        if (deleteEventRange.contains(new Date(item.start)) && deleteEventRange.contains(new Date(item.end))) {
          canDelete = false;
          break;
        }
      }

      if (canDelete) {
        this.props.saveDeleteSchedule({ schedule: this.props.deleteSchedule });
      } else {
        message.error(this.props.languageState.CALENDAR_TUTOR_PAGE_EDIT_EVENT_VALIDATION.translated, 5);
      }
    } else if (this.props.deleteScheduleOption === 'everyWeek') {
      const studentBookings = this.props.data.filter((item) => item.type === 'student');
      const deleteEventRange = extendedMoment.range(this.props.deleteSchedule.start, this.props.deleteSchedule.end);
      let canDelete = true;

      for (let item of studentBookings) {
        if (deleteEventRange.contains(new Date(item.start)) && deleteEventRange.contains(new Date(item.end))) {
          canDelete = false;
          break;
        }
      }

      if (canDelete) {
        this.props.saveDeleteRepeatSchedules({ baseSchedule: this.props.deleteSchedule });
      } else {
        message.error(this.props.languageState.CALENDAR_TUTOR_PAGE_EDIT_EVENT_VALIDATION.translated, 5);
      }
    }
  }

  startTimeChange = (time) => {
    this.props.eventInfoChange({
      newEventInfo: {
        start: this.outputDateInUserTimezone(moment(this.props.selectedEvent.start).hour(time.hour()).minute(time.minute())),
      },
    });
  }

  startDateChange = (date) => {
    this.props.eventInfoChange({
      newEventInfo: {
        start: new Date(extendedMoment(this.props.selectedEvent.start).date(date.date()).toString()),
        end: new Date(extendedMoment(this.props.selectedEvent.end).date(date.date()).toString()),
      },
    });
  }

  endTimeChange = (time) => {
    this.props.eventInfoChange({
      newEventInfo: {
        end: this.outputDateInUserTimezone(moment(this.props.selectedEvent.end).hour(time.hour()).minute(time.minute())),
      },
    });
  }

  handleViewChange = (viewType: string) => {
    this.props.changeViewCalendar(viewType);
    this.props.fetchData({
      start: this.convertLocalToUTC(new Date(extendedMoment(this.state.startDayInCalendar).startOf(viewType as any).toString())),
      end: this.convertLocalToUTC(new Date(extendedMoment(this.state.startDayInCalendar).endOf(viewType as any).toString())),
      tutorId: this.props.profileState._id
    });
  }

  navigate = (thisDay: any, viewType: string, _navigateType: string) => {
    this.setState({
      startDayInCalendar: thisDay
    })
    this.props.fetchData({
      start: this.convertLocalToUTC(new Date(extendedMoment(thisDay).startOf(viewType as any).toString())),
      end: this.convertLocalToUTC(new Date(extendedMoment(thisDay).endOf(viewType as any).toString())),
      tutorId: this.props.profileState._id
    });
  }

  render() {
    const editTimeSlot = (_record) => {
      return (
        <div>
          <h4>{this.props.languageState.CALENDAR_TUTOR_PAGE_EDIT_TIMESLOT.translated}</h4>
          <div style={{ marginTop: '24px', marginBottom: '12px' }}>
            <span style={{ display: 'inline-block', marginRight: '12px' }}>
              {this.props.languageState.CALENDAR_TUTOR_PAGE_FROM.translated}: &nbsp;
              <TimePicker
                value={extendedMoment(this.inputDateInUserTimezone(this.props.selectedEvent.start), 'HH:mm')}
                format='HH:mm'
                minuteStep={30}
                onChange={this.startTimeChange}
              />
            </span>
            <span style={{ display: 'inline-block' }}>
              {this.props.languageState.CALENDAR_TUTOR_PAGE_TO.translated}: &nbsp;
              <TimePicker
                value={extendedMoment(this.inputDateInUserTimezone(this.props.selectedEvent.end), 'HH:mm')}
                format='HH:mm'
                minuteStep={30}
                onChange={this.endTimeChange}
              />
            </span>
          </div>
        </div>
      );
    };

    const actionButtons = (record: any) => {
      return (
        <div className="action-buttons">
          <Popconfirm
            placement='bottomRight'
            okText='Save'
            cancelText='Cancel'
            title={editTimeSlot(record)}
            icon={null}
            visible={this.props.selectedEvent._id === record._id}
            onCancel={(_event) => this.onSelectEvent({})}
            onConfirm={this.saveEventChanges}
          >
            <Button
              type="primary"
              icon="edit"
              className="button"
              onClick={(_event) => this.onSelectEvent(record)}
              style={{ marginRight: '12px' }}
            />
          </Popconfirm>

          <Button
            type="primary"
            icon='delete'
            className="button"
            onClick={(_e) => this.props.openDeleteModal(record)}
            style={{ marginRight: '12px' }}
          />
        </div>
      );
    };

    const columns = [
      {
        title: this.props.languageState.CALENDAR_TUTOR_PAGE_DATE.translated,
        dataIndex: 'date',
        key: 'date',
        render: (_text, record, _index) => extendedMoment(record.start).format('DD MMM YYYY')
      },
      {
        title: this.props.languageState.CALENDAR_TUTOR_PAGE_TIME.translated,
        dataIndex: 'time',
        key: 'time',
        render: (_text, record, _index) => `${extendedMoment(record.start).format('HH:mm')} - ${extendedMoment(record.end).format('HH:mm')}`
      },
      {
        title: this.props.languageState.CALENDAR_TUTOR_PAGE_ACTIONS.translated,
        dataIndex: 'actions',
        key: 'actions',
        render: (_text, record, _index) => actionButtons(record)
      }
    ];

    const customTimeSlot = ({ event }) => {
      return (
        <Tooltip
          placement="rightTop"
          title={<Button icon='delete' onClick={(_e) => this.props.openDeleteModal(event)} />}
        >
          <div style={{ height: '100%' }} />
        </Tooltip>
      );
    }

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

    const timetableEvent = this.props.newSchedule && Object.keys(this.props.newSchedule).length ?
      [...this.props.data, this.props.newSchedule].filter(val => val.type === 'tutor').map((item) => ({ ...item, start: this.inputDateInUserTimezone(item.start), end: this.inputDateInUserTimezone(item.end) }))
      : this.props.data.map((item) => ({ ...item, start: this.inputDateInUserTimezone(item.start), end: this.inputDateInUserTimezone(item.end) }));

    return (
      <UserLayout profileState={this.props.profileState} profileReducers={this.props.profileReducers} editProfilePageState={this.props.editProfilePageState} languageState={this.props.languageState}>
        <div style={{ background: 'white', margin: '20px', padding: '20px' }}>
          <Spin spinning={this.props.isBusy}>
            <Row gutter={24}>
              <Col xs={24} sm={24} md={24} lg={15}>
                <Row style={{ padding: '0px 20px 0px 20px' }}>
                  <Row style={{ marginBottom: 16 }}>
                    <h1 style={{}}>{this.props.languageState.CALENDAR_TUTOR_PAGE_AVAILABILITY.translated}</h1>
                    <h2>{this.props.languageState.CALENDAR_TUTOR_PAGE_INSTRUCTION.translated}</h2>
                    <Content>1) {this.props.languageState.CALENDAR_TUTOR_PAGE_INSTRUCTION_1.translated}</Content>
                    <Content>2) {this.props.languageState.CALENDAR_TUTOR_PAGE_INSTRUCTION_2.translated}</Content>
                    <Content>3) {this.props.languageState.CALENDAR_TUTOR_PAGE_INSTRUCTION_3.translated}</Content>
                    <Content>4) {this.props.languageState.CALENDAR_TUTOR_PAGE_INSTRUCTION_4.translated}</Content>
                  </Row>
                  <Row style={{ marginBottom: 10 }}>
                    <Col className='label' xs={24} sm={24} md={12} lg={8}>
                      <Row gutter={4}>
                        <Col xs={12} sm={12} md={9} lg={7}>
                          <div className='available-label'></div>
                        </Col>
                        <Col className='nowrap' xs={12} sm={12} md={15} lg={17}>
                          <span>{this.props.languageState.CALENDAR_TUTOR_PAGE_AVAILABLE.translated}</span>
                        </Col>
                      </Row>
                    </Col>
                    <Col className='label' xs={24} sm={24} md={12} lg={8}>
                      <Row gutter={4}>
                        <Col xs={12} sm={12} md={9} lg={7}>
                          <div className='not-available-label'></div>
                        </Col>
                        <Col className='nowrap' xs={12} sm={12} md={15} lg={17}>
                          <span>{this.props.languageState.CALENDAR_TUTOR_PAGE_NOT_AVAILABLE.translated}</span>
                        </Col>
                      </Row>
                    </Col>
                    <Col className='label' xs={24} sm={24} md={12} lg={8}>
                      <Row gutter={4}>
                        <Col xs={12} sm={12} md={9} lg={7}>
                          <div className='booked-by-student-label'></div>
                        </Col>
                        <Col className='nowrap' xs={12} sm={12} md={15} lg={17}>
                          <span>{this.props.languageState.CALENDAR_TUTOR_PAGE_BOOKED_BY_STUDENT.translated}</span>
                        </Col>
                      </Row>
                    </Col>
                    <Col className='label' xs={24} sm={24} md={12} lg={8}>
                      <Row gutter={4}>
                        <Col xs={12} sm={12} md={9} lg={7}>
                          <div className='group-tuition-label'></div>
                        </Col>
                        <Col className='nowrap' xs={12} sm={12} md={15} lg={17}>
                          <span>{this.props.languageState.CALENDAR_TUTOR_PAGE_GROUP_TUITION.translated}</span>
                        </Col>
                      </Row>
                    </Col>
                    <Col className='label' xs={24} sm={24} md={12} lg={8}>
                      <Row gutter={4}>
                        <Col xs={12} sm={12} md={9} lg={7}>
                          <div className='blocked-for-group-tuition-label'></div>
                        </Col>
                        <Col className='nowrap' xs={12} sm={12} md={15} lg={17}>
                          <span>{this.props.languageState.CALENDAR_TUTOR_PAGE_BLOCKED_FOR_GROUP_TUITION.translated}</span>
                        </Col>
                      </Row>
                    </Col>
                  </Row>
                </Row>
                <DragAndDropCalendar
                  views={['month', 'week']}
                  selectable={true}
                  defaultDate={this.inputDateInUserTimezone()}
                  defaultView={Calendar.Views.WEEK}
                  events={timetableEvent}
                  style={{ height: '800px', padding: '20px 0px 20px 20px', marginRight: '24px' }}
                  scrollToTime={new Date(1970, 1, 1, 6)}
                  onEventDrop={this.moveEvent}
                  onEventResize={this.resizeEvent}
                  resizable={true}
                  popup={true}
                  // timeslots={1}
                  onSelectSlot={this.createDraftEvent}
                  onNavigate={this.navigate}
                  onView={this.handleViewChange}
                  eventPropGetter={this.eventStyleGetter}
                  components={{
                    week: { event: customTimeSlot },
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
              <Col xs={24} sm={24} md={24} lg={9} >
                <h2>{this.props.languageState.CALENDAR_TUTOR_PAGE_AVAILABILITY_SLOTS.translated}</h2>
                <Table
                  size='small'
                  pagination={false}
                  columns={columns}
                  rowKey={(record) => record._id}
                  dataSource={this.props.data.sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime()).filter((item) => item.type === 'tutor' && !item.isGroup).map((item) => ({
                    ...item,
                    start: this.inputDateInUserTimezone(item.start),
                    end: this.inputDateInUserTimezone(item.end)
                  }))}
                />
              </Col>
            </Row>
          </Spin>
        </div>

        <Modal
          title={this.props.languageState.CALENDAR_TUTOR_PAGE_ADD_SLOT.translated}
          footer={null}
          visible={this.props.repeatModalVisible}
          onCancel={this.props.closeRepeatModal}
        >
          <h3>{this.props.languageState.CALENDAR_TUTOR_PAGE_ADD_SLOT_PROMPT.translated}</h3>

          <Radio.Group
            onChange={(e) => this.props.createScheduleOptionChange({ createScheduleOption: e.target.value })}
            value={this.props.createScheduleOption}
          > {this.props.statusView === 'month'
            ? null
            : <Radio style={{ display: 'block', height: '30px', lineHeight: '30px' }} value='everyWeek'>
              {this.props.languageState.CALENDAR_TUTOR_PAGE_SET_EVERY.translated} <b>{extendedMoment(this.inputDateInUserTimezone(this.props.newSchedule.start)).format('dddd')}, {extendedMoment(this.inputDateInUserTimezone(this.props.newSchedule.start)).format('HH:mm')} - {extendedMoment(this.inputDateInUserTimezone(this.props.newSchedule.end)).format('HH:mm')}</b> {this.props.languageState.CALENDAR_TUTOR_PAGE_AS_AVAILABLE.translated}
            </Radio>}

            <Radio style={{ display: 'block', height: '30px', lineHeight: '30px' }} value='onlyThisWeek'>
              {this.props.languageState.CALENDAR_TUTOR_PAGE_SET_ONLY.translated}
            </Radio>
          </Radio.Group>

          <div style={{ marginTop: '12px' }}>
            <Button
              type="primary"
              style={{ minWidth: '100px', marginRight: '12px' }}
              onClick={this.saveNewEvent}
              disabled={this.props.createScheduleOption ? false : true}
            >
              {this.props.languageState.CALENDAR_TUTOR_PAGE_SAVE.translated}
            </Button>
            <Button
              style={{ minWidth: '100px', marginRight: '12px' }}
              onClick={this.props.closeRepeatModal}
            >
              {this.props.languageState.CALENDAR_TUTOR_PAGE_CANCEL.translated}
            </Button>
          </div>
        </Modal>

        <Modal
          title={this.props.languageState.CALENDAR_TUTOR_PAGE_DELETE_TIMESLOT.translated}
          footer={null}
          visible={this.props.deleteModalVisible}
          onCancel={this.props.closeDeleteModal}
        >
          <h3>Are you sure you want to remove the selected timeslot?</h3>

          <Radio.Group
            onChange={(e) => this.props.deleteScheduleOptionChange({ deleteScheduleOption: e.target.value })}
            value={this.props.deleteScheduleOption}
          >
            <Radio style={{ display: 'block', height: '30px', lineHeight: '30px' }} value='everyWeek'>
              {this.props.languageState.CALENDAR_TUTOR_PAGE_DELETE_OPTION_1.translated}
            </Radio>
            <Radio style={{ display: 'block', height: '30px', lineHeight: '30px' }} value='onlyThisWeek'>
              {this.props.languageState.CALENDAR_TUTOR_PAGE_DELETE_OPTION_2.translated}
            </Radio>
          </Radio.Group>

          <div style={{ marginTop: '12px' }}>
            <Button
              type="primary"
              style={{ minWidth: '100px', marginRight: '12px' }}
              onClick={this.saveDeleteEvent}
              disabled={this.props.deleteScheduleOption ? false : true}
            >
              {this.props.languageState.CALENDAR_TUTOR_PAGE_SAVE.translated}
            </Button>
            <Button
              style={{ minWidth: '100px', marginRight: '12px' }}
              onClick={this.props.closeDeleteModal}
            >
              {this.props.languageState.CALENDAR_TUTOR_PAGE_CANCEL.translated}
            </Button>
          </div>
        </Modal>

        <Modal
          title={this.props.languageState.CALENDAR_TUTOR_PAGE_DETECT_STUDENT_BOOKING_MODAL.translated}
          footer={null}
          visible={this.props.existedBookingModalVisible}
          onCancel={this.props.closeExistedBookingModal}
        >
          <h3>{this.props.languageState.CALENDAR_TUTOR_PAGE_DETECT_WARNING_1.translated} {this.props.existedBookingInfo.number}. {this.props.languageState.CALENDAR_TUTOR_PAGE_DETECT_WARNING_2.translated} ?</h3>

          <div style={{ marginTop: '12px' }}>
            <Button
              type="primary"
              style={{ minWidth: '100px', marginRight: '12px' }}
              onClick={(_e) => this.props.proceedDeleteSchedules({ scheduleId: this.props.existedBookingInfo.canDeleteSchedule })}
            >
              {this.props.languageState.CALENDAR_TUTOR_PAGE_PROCEED.translated}
            </Button>
            <Button
              style={{ minWidth: '100px', marginRight: '12px' }}
              onClick={this.props.closeExistedBookingModal}
            >
              {this.props.languageState.CALENDAR_TUTOR_PAGE_CANCEL.translated}
            </Button>
          </div>
        </Modal>
      </UserLayout>
    );
  }
}
const mapState = (rootState: any) => {
  return {
    ...rootState.tutorSchedulePageModel,
    profileState: rootState.profileModel,
    editProfilePageState: rootState.editProfilePageModel,
    languageState: rootState.languageModel,
  };
};

const mapDispatch = (rootReducer: any) => {
  return {
    ...rootReducer.tutorSchedulePageModel,
    profileReducers: rootReducer.profileModel,
    editProfilePageReducers: rootReducer.editProfilePageModel,
  };
};

export default withRematch(initStore, mapState, mapDispatch)(TutorCalendar);
