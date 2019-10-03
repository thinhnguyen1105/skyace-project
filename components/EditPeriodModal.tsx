import * as React from 'react';
import moment from 'moment';
import { Form, Modal, Row, Col, message, Table, Button, Tooltip } from 'antd';
import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop';
import Calendar from 'react-big-calendar';
import { extendMoment } from 'moment-range';
import 'react-big-calendar/lib/addons/dragAndDrop/styles.css';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import "./custom-calendar.css";
import * as uuid from 'uuid';

Calendar.setLocalizer(Calendar.momentLocalizer(moment));
const DragAndDropCalendar = withDragAndDrop(Calendar);
const extendedMoment = extendMoment(moment);

class EditPeriodModal extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      startDayInCalendar: new Date()
    };
  }

  componentDidMount() {
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

  checkOverlaps = (event) => {
    let isOverlapsed = true;

    // check within tutor schedule
    if (this.props.schedulesData.length) {
      for (let item of this.filterSchedulesData(this.props.schedulesData).filter((item) => item.type === 'tutor')) {
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
      for (let item of [...this.filterSchedulesData(this.props.schedulesData).filter((item) => item.type === 'student'), ...this.props.editPeriodData.period]) {
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
      for (let item of [...this.filterSchedulesData(this.props.schedulesData).filter((item) => item.type === 'tutor' && item.isGroup || item.type === 'trial'), ...this.props.editPeriodData.period]) {
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
    if (this.props.editPeriodData.hourPerSession > 0 && this.props.editPeriodData.session > 0) {
      if (this.props.editPeriodData.session <= this.props.editPeriodData.period.length) {
        message.error(this.props.languageState.EDIT_PERIOD_MODAL_PAGE_SELECT_MAX_ERROR.translated + ' ' + this.props.editPeriodData.session + ' ' + this.props.languageState.EDIT_PERIOD_MODAL_PAGE_LESSONS.translated + '.', 4);
      }
      else {
        if (this.checkBookingInThePast(eventInfo)) {
          message.error(this.props.languageState.EDIT_PERIOD_MODAL_PAGE_CREATE_BOOKING_IN_THE_PAST_ERROR.translated, 4);
        } else if (this.props.schedulesData.length && this.checkOverlaps({
          ...eventInfo,
          start: this.outputDateInUserTimezone(eventInfo.start),
          end: this.outputDateInUserTimezone(new Date(eventInfo.start).getTime() + this.props.editPeriodData.hourPerSession * 60 * 60 * 1000),
        })) {
          message.error(this.props.languageState.EDIT_PERIOD_MODAL_PAGE_UNSUITABLE_TIME_SLOT_ERROR.translated, 4);
        } else {
          if (!this.props.schedulesData.length) {
            message.error(this.props.languageState.EDIT_PERIOD_MODAL_PAGE_NOT_AVAILABLE_AT_THIS_TIME_ERROR.translated, 4);
          } else {
            this.props.changeEditPeriodData({
              data: {
                _id: uuid.v4(),
                start: this.outputDateInUserTimezone(eventInfo.start),
                end: this.outputDateInUserTimezone(new Date(eventInfo.start).getTime() + this.props.editPeriodData.hourPerSession * 60 * 60 * 1000),
              }
            });
          }
        }
      }
    } else {
      message.error(this.props.languageState.EDIT_PERIOD_MODAL_PAGE_SELECT_NUMBER_OF_LESSONS_REQUIRE_MESSAGE.translated, 4);
    }
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

  moveEvent = async (moveInfo: any) => {
    if (this.checkBookingInThePast(moveInfo)) {
      message.error(this.props.languageState.EDIT_PERIOD_MODAL_PAGE_CREATE_BOOKING_IN_THE_PAST_ERROR.translated, 4);
    }
    else if (this.checkOverlaps({
      ...moveInfo.event,
      start: this.outputDateInUserTimezone(moveInfo.start),
      end: this.outputDateInUserTimezone(moveInfo.end)
    })) {
      message.error(this.props.languageState.EDIT_PERIOD_MODAL_PAGE_UNSUITABLE_TIME_SLOT_ERROR.translated, 4);
    } else {
      this.props.deleteEditPeriodData(moveInfo.event._id);
      const updatedPeriod = {
        _id: uuid.v4(),
        start: this.outputDateInUserTimezone(moveInfo.start),
        end: this.outputDateInUserTimezone(new Date(moveInfo.start).getTime() + this.props.editPeriodData.hourPerSession * 60 * 60 * 1000),
      }

      await this.props.changeEditPeriodData({
        data: updatedPeriod
      })
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
      pointerEvents: 'none'
    }

    const idsArray = this.props.editPeriodData ? this.props.editPeriodData.period.map(val => val._id) : [];
    if (idsArray.indexOf(event._id) >= 0) {
      return {
        style: currentSelection
      }
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
        end: moment(new Date(extendedMoment(this.props.selectedEvent.start).hour(time.hour()).minutes(time.minutes()).toString()).getTime() + this.props.editPeriodData.hourPerSession * 60 * 60 * 1000)
      },
    });
  }

  saveEventChanges = (_e) => {
    if (new Date(this.props.selectedEvent.start).getTime() >= new Date(this.props.selectedEvent.end).getTime()) {
      this.props.errorHappen({ errorMessage: this.props.languageState.EDIT_PERIOD_MODAL_PAGE_START_TIME_VALUE_ERROR.translated });
    } else {
      this.props.updateNewBooking();
    }
  }

  filterSchedulesData = (schedulesData) => {
    const idsArray = this.props.selectedGroupPeriod ? this.props.selectedGroupPeriod.map(val => val._id) : [];
    const results = schedulesData.filter(val => idsArray.indexOf(val._id) < 0);
    return results;
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
            onClick={(_e) => this.props.deleteEditPeriodData(record._id)}
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
        title="Edit schedule"
        visible={this.props.visible}
        onOk={this.props.changePeriods}
        onCancel={this.hideModal}
        okText="Confirm"
        cancelButtonProps={{ style: { display: 'none' } }}
      >
        <div>
          <Form>
            <Row>
              <Col xs={24} lg={16} className="custom-calendar">
                <DragAndDropCalendar
                  key={2}
                  views={['month', 'week']}
                  selectable={true}
                  defaultDate={this.inputDateInUserTimezone()}
                  defaultView={Calendar.Views.WEEK}
                  events={[...this.filterSchedulesData(this.props.schedulesData), ...(this.props.editPeriodData ? this.props.editPeriodData.period : [])].map((item) => ({ ...item, start: this.inputDateInUserTimezone(item.start), end: this.inputDateInUserTimezone(item.end) }))}
                  style={{ minHeight: '800px', width: '734px', padding: '20px 0px 20px 20px', marginRight: '24px' }}
                  onSelectEvent={(event) => this.selectEvent(event)}
                  scrollToTime={new Date(1970, 1, 1, 6)}
                  onEventDrop={this.moveEvent}
                  popup={true}
                  onSelectSlot={this.createNewPeriod}
                  onNavigate={this.navigate}
                  onView={this.handleViewChange}
                  eventPropGetter={this.eventStyleGetter}
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
                  dataSource={this.props.editPeriodData ? this.props.editPeriodData.period.sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime()).map((item) => ({
                    ...item,
                    start: this.inputDateInUserTimezone(item.start),
                    end: this.inputDateInUserTimezone(item.end)
                  })) : []}
                />
              </Col>
            </Row>
          </Form>
        </div>
      </Modal >
    );
  }
}

export default Form.create()(EditPeriodModal);
