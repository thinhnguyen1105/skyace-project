import * as React from 'react';
import moment from 'moment';
import { Layout, Row, Button, Col, Modal, TimePicker, message, Spin, Checkbox, Tooltip, Menu, Popconfirm, Table, Radio, InputNumber, DatePicker, Icon, Rate } from 'antd';
import Calendar from 'react-big-calendar';
import withRematch from '../../rematch/withRematch';
import initStore from '../../rematch/store';
import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop';
import { extendMoment } from 'moment-range';
import { getUsersService, getTuitionsService, getTutorSchedulesService } from '../../service-proxies';
import UserLayout from '../../layout/UserLayout';
import ShowMore from 'react-show-more';
import * as Scroll from 'react-scroll';
import RegisterForm from '../../components/landing-page/RegisterForm';
import LoginForm from '../../components/landing-page/LoginForm';
import _ from 'lodash';
import PaypalButton from '../../components/paypal/PaypalButton';
import PaypalCurrencies from '../../data_common/PaypalCurrencies';
import './editProfileStudent.css';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import 'react-big-calendar/lib/addons/dragAndDrop/styles.css';
import '../../pages/styles.css';
import './informationTutor.css';
import AlertLoginModal from '../../components/information-tutor-page/AlertLoginModal';
import TutorOverview from '../../components/information-tutor-page/TutorOverview';
import BillingPreference from '../../components/information-tutor-page/BillingPreference';
import qs from 'qs';
import ResetPasswordForm from '../../components/landing-page/ResetPasswordForm';
import Router from 'next/router';
import * as uuid from 'uuid';

const MONTHS = [
  {
    id: 0,
    name: 'January'
  },
  {
    id: 1,
    name: 'February'
  },
  {
    id: 2,
    name: 'March'
  },
  {
    id: 3,
    name: 'April'
  },
  {
    id: 4,
    name: 'May'
  },
  {
    id: 5,
    name: 'June'
  },
  {
    id: 6,
    name: 'July'
  },
  {
    id: 7,
    name: 'August'
  },
  {
    id: 8,
    name: 'September'
  },
  {
    id: 9,
    name: 'October'
  },
  {
    id: 10,
    name: 'November'
  },
  {
    id: 11,
    name: 'December'
  },
]

Calendar.setLocalizer(Calendar.momentLocalizer(moment));
const ScrollLink = Scroll.Link;
const DragAndDropCalendar = withDragAndDrop(Calendar);
const extendedMoment = extendMoment(moment);

class Teacher extends React.Component<any, any> {
  state = {
    isServer: true,
    startDayInCalendar: new Date(),
    visible: false,
    nextCourse: null,
    mountCalendar: true
  }

  static async getInitialProps(props: any) {
    let tutorInfo: any = {};
    const usersService = getUsersService(props.store.getState().profileModel.token);
    if (!props.req) {
      tutorInfo = await usersService.findTutorById(props.query.tutorId);
    } else {
      tutorInfo = props.query.tutorInfo;
    }

    let tuitionInfo: any = {};
    let parseQueryResult = qs.parse(props.req ? props.req.url : "", { ignoreQueryPrefix: true });
    if (parseQueryResult.courseForTutor) {
      const selectedCourse = tutorInfo.courseForTutor.filter((item) => String(item._id) === String(parseQueryResult.courseForTutor))[0];
      props.store.dispatch.informationTutorPageModel.handleExtendTuition(selectedCourse);
      if (!props.req) {
        const tuitionService = getTuitionsService(props.store.getState().profileModel.token);
        tuitionInfo = await tuitionService.findByTuitionId(parseQueryResult.tuition);
      } else {
        tuitionInfo = props.query.tuitionInfo;
      }

      // Extend
      // find the first lesson in bookings
      const start = tuitionInfo.sessions.reduce((result, value) => {
        if (new Date(result.start).getTime() > new Date(value.start).getTime()) {
          result = value;
        }
        return result;
      });

      // find the last lesson in bookings
      const end = tuitionInfo.sessions.reduce((result, value) => {
        if (new Date(result.start).getTime() < new Date(value.start).getTime()) {
          result = value;
        }
        return result;
      });
      if (start && end) {
        const duration = new Date(end.end).getTime() - new Date(start.start).getTime();
        const numberOfWeeks = Math.floor(duration / 604800000) + 1;
        const numberOfSessions = tuitionInfo.sessions.length;
        const newBookings: any[] = [];
        for (let i = 0; i < numberOfSessions; i += 1) {
          const newBooking = {
            index: uuid.v4(),
            type: 'student',
            owner: tuitionInfo.sessions[i].student,
            parent: tuitionInfo.sessions[i].tutor,
            status: '',
            start: new Date(new Date(tuitionInfo.sessions[i].start).getTime() + numberOfWeeks * 604800000),
            end: new Date(new Date(tuitionInfo.sessions[i].end).getTime() + numberOfWeeks * 604800000)
          };
          newBookings.push(newBooking);
        }
        await props.store.dispatch.informationTutorPageModel.checkMultilpleBookings({ newBookings });
      }
    }

    let ratings = await usersService.getRatings({
      userId: tutorInfo._id,
      pageSize: 5,
      pageNumber: 1
    })
    props.store.dispatch.informationTutorPageModel.loadRatingSuccess(ratings);

    let studentTuitionList: any = {};
    if (!props.req) {
      if (props.store.getState().profileModel) {
        const tuitionService = getTuitionsService(props.store.getState().profileModel.token);
        studentTuitionList = await tuitionService.findAllTuitionsByStudentId(props.store.getState().profileModel._id, false, false)
      } else {
        studentTuitionList = null;
      }
    } else {
      studentTuitionList = props.query.studentTuitionList;
    }
    let studentSessionList: any = [];
    if (studentTuitionList) {
      studentTuitionList.data.map((item) => {
        studentSessionList = [...studentSessionList, ...item.sessions].map((val) => {
          let deepClone = JSON.parse(JSON.stringify(val));
          deepClone.ofStudent = true;
          return deepClone;
        })
      });
    }

    console.log('tuitionInfo', tuitionInfo);
    console.log('tutorInfo', tutorInfo);

    return {
      tutorInfo,
      tuitionInfo,
      studentSessionList,
    };
  }

  async componentDidMount() {
    await this.props.findSchedulesTrialOfStudent(this.props.profileState._id);

    await this.props.trialSchedulesOfStudent.map((item) => {
      if (item.parent === this.props.tutorInfo._id) {
        this.props.bookedTrialTuition();
      }
    })
    await this.props.loadTutorSchedules({
      start: new Date(extendedMoment().startOf('week').toString()).toUTCString(),
      end: new Date(extendedMoment().endOf('week').toString()).toUTCString(),
      tutorId: this.props.tutorInfo._id,
    });

    window.onbeforeunload = () => {
      const idCurrentBookings = this.props.currentBookings.data.map((item) => {
        return item._id;
      });

      if (!this.props.paypalState.isPaymentSuccess && !this.props.isBookedTrial) {
        this.props.deleteTuitionInfo({ idCurrentBookings: idCurrentBookings });
      }
    };

    Router.onRouteChangeStart = (_url) => {
      this.setState({
        mountCalendar: false
      })
    }

    this.setState({
      isServer: false,
    });
  }

  componentWillUnmount() {
    this.setState({
      mountCalendar: false
    })
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

  calculateLocaleHourlyRate = (input) => {
    const exchangeRate = this.props.profileState ? this.props.profileState.currency && this.props.profileState.currency.exchangeRate ? this.props.profileState.currency.exchangeRate : 1 : 1;
    const currency = this.props.profileState ? this.props.profileState.currency && this.props.profileState.currency.code ? this.props.profileState.currency.code : 'SGD' : 'SGD'
    return Math.round((input / exchangeRate)).toLocaleString() + ' ' + currency;
  }

  sortArray = (array) => {
    var returnArray = [] as any;
    var levels = ["Preschool", "Primary", "Secondary", "Post Secondary", "Bachelor", "Master", "Doctor"];
    array.sort((a, b) => {
      if (a.course.grade < b.course.grade) {
        return -1;
      }
      if (a.course.grade > b.course.grade) {
        return 1;
      }
      return 0;
    })
    levels.forEach((data) => {
      array.forEach((item) => {
        if (item.course.level === data) {
          returnArray.push(item);
        }
      })
    })

    return returnArray;
  }

  sortCourse = (array) => {
    // Sort course by multiple fields, country > grade > subject > sessions > hourlyRate
    const result = array.sort(
      function (a, b) {
        if (a.course && b.course) {
          if (a.course.country && b.course.country && a.course.country !== b.course.country) {
            return a.course.country.localeCompare(b.course.country)
          } else {
            if (a.course.grade && b.course.grade && a.course.grade !== b.course.grade) {
              // return a.course.grade.localeCompare(b.course.grade)
              return 1;
            } else {
              if (a.course.subject !== b.course.subject) {
                return a.course.subject.localeCompare(b.course.subject)
              } else {
                if (a.course.session !== b.course.session) {
                  return a.course.session - b.course.session;
                } else {
                  return a.hourlyRate - b.hourlyRate;
                }
              }
            }
          }
        } else return 1;
      });
    return result;
  }

  convertLocalToUTC = (date) => {
    return date.toUTCString();
  }

  checkOverlapsAsync = async (event) => {

    let isOverlapsed = true;

    // inside tutor schedules
    // call request here
    const isInsideSchedule = await getTutorSchedulesService().checkSessionInsideTutorSchedules({
      start: event.start,
      end: event.end,
      tutor: this.props.tutorInfo._id
    })
    if (isInsideSchedule) isOverlapsed = false;
    // for (let item of this.props.schedulesData.filter((i) => i.type === 'tutor' && !i.isGroup)) {
    //   const itemRange = extendedMoment.range(new Date(item.start), new Date(item.end));
    //   if (itemRange.contains(new Date(event.start)) && itemRange.contains(new Date(event.end))) {
    //     isOverlapsed = false;
    //     break;
    //   }
    // }

    // not overlapped with other bookings
    if (!isOverlapsed) {
      const eventRange = extendedMoment.range(event.start, event.end);
      for (let item of [...this.props.schedulesData.filter((item) => item.type === 'student'), ...this.props.newBookings.filter((item) => item.index !== event.index)]) {
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
      for (let item of [...this.props.schedulesData.filter((item) => item.type === 'tutor' && item.isGroup), ...this.props.newBookings.filter((item) => item.index !== event.index)]) {
        const itemRange = extendedMoment.range(item.start, item.end);
        if (itemRange.overlaps(eventRange)) {
          isOverlapsed = true;
          break;
        }
      }
    }

    //check overlaps with trial booking
    if (!isOverlapsed) {
      const eventRange = extendedMoment.range(event.start, event.end);
      for (let item of [...this.props.schedulesData.filter((item) => item.type === 'trial'), ...this.props.newBookings.filter((item) => item.index !== event.index)]) {
        const itemRange = extendedMoment.range(item.start, item.end);
        if (itemRange.overlaps(eventRange)) {
          isOverlapsed = true;
          break;
        }
      }
    }

    return isOverlapsed;
  }

  checkOverlaps = (event) => {

    let isOverlapsed = true;

    // inside tutor schedules
    for (let item of this.props.schedulesData.filter((i) => i.type === 'tutor' && !i.isGroup)) {
      const itemRange = extendedMoment.range(new Date(item.start), new Date(item.end));
      if (itemRange.contains(new Date(event.start)) && itemRange.contains(new Date(event.end))) {
        isOverlapsed = false;
        break;
      }
    }

    // not overlapped with other bookings
    if (!isOverlapsed) {
      const eventRange = extendedMoment.range(event.start, event.end);
      for (let item of [...this.props.schedulesData.filter((item) => item.type === 'student'), ...this.props.newBookings.filter((item) => item.index !== event.index)]) {
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
      for (let item of [...this.props.schedulesData.filter((item) => item.type === 'tutor' && item.isGroup), ...this.props.newBookings.filter((item) => item.index !== event.index)]) {
        const itemRange = extendedMoment.range(item.start, item.end);
        if (itemRange.overlaps(eventRange)) {
          isOverlapsed = true;
          break;
        }
      }
    }

    //check overlaps with trial booking
    if (!isOverlapsed) {
      const eventRange = extendedMoment.range(event.start, event.end);
      for (let item of [...this.props.schedulesData.filter((item) => item.type === 'trial'), ...this.props.newBookings.filter((item) => item.index !== event.index)]) {
        const itemRange = extendedMoment.range(item.start, item.end);
        if (itemRange.overlaps(eventRange)) {
          isOverlapsed = true;
          break;
        }
      }
    }

    return isOverlapsed;
  }

  checkOverlapsWithOwnBookings = (event) => {
    let isOverlapsed = false;

    //check overlaps with own booking
    if (!isOverlapsed) {
      const eventRange = extendedMoment.range(event.start, event.end);
      for (let item of this.props.studentSessionList) {
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

  eventStyleGetter = (event, _start, _end, _isSelected) => {
    const completedSchedule = {
      backgroundColor: '#DDFFCC',
      borderRadius: '5px',
      opacity: 1,
      zIndex: 2,
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
      zIndex: 2,
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
      zIndex: 2,
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
      zIndex: 3,
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

    const currentlyOnHold = {
      backgroundColor: '#ECECEC',
      borderRadius: '5px',
      opacity: 1,
      zIndex: 2,
      color: '#000000',
      border: '1px solid #ECECEC',
      display: 'block',
      cursor: 'not-allowed',
      pointerEvents: 'none'
    }

    if (event.type === 'tutor') {
      if (event.isGroup) {
        return {
          style: groupTuitionBooked,
        }
      } else {
        if (new Date(event.end).getTime() < new Date().getTime()) {
          return {
            style: completedSchedule,
          };
        } else {
          return {
            style: tutorAvailbleSchedule,
          }
        }
      }
    } else if (event.tuition && event.student.toString() === this.props.profileState._id || (event.groupTuition && event.ofStudent)) {
      return {
        style: currentStudentBooked
      };
    } else if (event._id && (event.type === 'student') && event.owner !== this.props.profileState._id || event.type === 'trial') {
      if (event.isPayment === true) {
        return {
          style: otherStudentBooked
        };
      } else {
        return {
          style: currentlyOnHold
        };
      }
    } else {
      console.log('event', event);
      return {
        style: currentSelection
      };
    }
  }

  createNewBooking = (eventInfo: any) => {
    if (Object.keys(this.props.selectedCourse).length === 0) {
      message.error("You must select course first", 4);
    } else {
      const eventToCheck = {
        ...eventInfo,
        end: new Date(eventInfo.start).getTime() + this.props.selectedCourse.course.hourPerSession * 60 * 60 * 1000
      };

      if (this.checkBookingInThePast(eventToCheck)) {
        message.error('Can not create booking in the past', 4);
      } else if (this.checkOverlaps(eventToCheck)) {
        message.error('Timing unsuitable', 4);
      } else if (this.checkOverlapsWithOwnBookings(eventToCheck)) {
        message.error('You already have a lesson at this time', 4);
      } else if (this.props.newBookings.length >= this.props.selectedCourse.course.session + this.props.numberOfLessonsRequiredMore) {
        message.error(`You can only select ${this.props.selectedCourse.course.session + this.props.numberOfLessonsRequiredMore} lessons for this course`, 4);
      } else if (!this.checkBookingInAcademicYear(eventToCheck.start, eventToCheck.end)) {
        message.error(`Cannot create booking outside of academic year ${this.calculateAcademicYear(this.props.selectedCourse.course.academicStart, this.props.selectedCourse.course.academicEnd)}`, 4);
      } else {
        this.props.createNewBooking({
          bookingInfo: {
            index: uuid.v4(),
            start: this.outputDateInUserTimezone(eventInfo.start),
            end: this.outputDateInUserTimezone(new Date(eventInfo.start).getTime() + this.props.selectedCourse.course.hourPerSession * 60 * 60 * 1000),
            type: 'student',
            owner: this.props.profileState._id,
            parent: this.props.tutorInfo._id,
          }
        });
      }
    }
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

  onClosePaymentModal = async () => {
    if (this.props.currentBookings.data === undefined) {
      this.props.closePaymentModal();
    } else {
      const idCurrentBookings = this.props.currentBookings.data.map((item) => {
        return item._id;
      });

      await this.props.deleteTuitionInfo({ idCurrentBookings: idCurrentBookings });
      this.props.closePaymentModal({ discardSchedules: idCurrentBookings });
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
    if (await this.checkOverlaps({
      ...moveInfo.event,
      start: moveInfo.start,
      end: moveInfo.end
    })) {
      message.error('Timing unsuitable', 4);
    } else if (this.checkBookingInThePast(moveInfo)) {
      message.error('Cant move event to the past', 4);
    } else if (!this.checkBookingInAcademicYear(moveInfo.start, moveInfo.end)) {
      message.error(`Cannot move booking outside of academic year ${this.calculateAcademicYear(this.props.selectedCourse.course.academicStart, this.props.selectedCourse.course.academicEnd)}`, 4);
    } else {
      this.props.updateStudentBookings({
        bookingInfo: {
          ...moveInfo.event,
          start: this.convertLocalToUTC(this.outputDateInUserTimezone(moveInfo.start)),
          end: this.convertLocalToUTC(this.outputDateInUserTimezone(moveInfo.end)),
        }
      });
    }
  }

  saveTrialBooking = async () => {
    if (this.props.newBookings.length < this.props.selectedCourse.course.session) {
      message.error(`Please select at least ${this.props.selectedCourse.course.session + this.props.numberOfLessonsRequiredMore} lessons`, 4);
    } else {
      const newBookings = this.props.newBookings.map((booking) => ({
        start: this.convertLocalToUTC(new Date(booking.start)),
        end: this.convertLocalToUTC(new Date(booking.end)),
        type: 'trial',
        owner: this.props.profileState._id,
        parent: this.props.tutorInfo._id,
        student: this.props.profileState._id,
        status: '',
      }));

      const newTuitionInfo = {
        courseForTutor: this.props.selectedCourse._id,
        course: this.props.selectedCourse.course._id,
        student: this.props.profileState._id,
        tutor: this.props.tutorInfo._id
      };
      await this.props.bookedTrialTuition();
      await this.props.saveTrialBookings({
        newBookings,
        newTuitionInfo,
      });
      message.success('Booking successful', 5);
      window.location.reload();
    }
  }

  saveNewBookings = () => {
    const newBookings = this.props.newBookings.sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime()).map((booking) => ({
      start: this.convertLocalToUTC(new Date(booking.start)),
      end: this.convertLocalToUTC(new Date(booking.end)),
      type: 'student',
      owner: this.props.profileState._id,
      parent: this.props.tutorInfo._id,
      status: '',
      isPayment: false,
    }));

    const newTuitionInfo = {
      courseForTutor: this.props.selectedCourse._id,
      course: this.props.selectedCourse.course._id,
      student: this.props.profileState._id,
      tutor: this.props.tutorInfo._id
    };

    this.props.saveBookings({
      newBookings,
      newTuitionInfo,
    });

    this.props.openPaymentModal();
  }

  deleteBooking = (event) => {
    this.props.deleteBooking({
      bookingInfo: event
    });
  }

  timeChange = (time) => {
    const newEventInfo = {
      start: this.outputDateInUserTimezone(extendedMoment(this.props.selectedEvent.start).month(time.month()).date(time.date()).hour(time.hour()).minutes(time.minutes()).toString()),
      end: this.outputDateInUserTimezone(extendedMoment(new Date(extendedMoment(this.props.selectedEvent.start).month(time.month()).date(time.date()).hour(time.hour()).minutes(time.minutes()).toString()).getTime() + this.props.selectedCourse.course.hourPerSession * 60 * 60 * 1000).toString())
    };

    this.props.eventInfoChange({ newEventInfo });
  }

  saveEventChanges = async (_e) => {
    if (this.checkBookingInThePast(this.props.selectedEvent)) {
      message.error('Booking cant in the past', 4);
    } else if (await this.checkOverlapsAsync(this.props.selectedEvent)) {
      message.error('Timing unsuitable', 4);
    } else if (!this.checkBookingInAcademicYear(this.props.selectedEvent.start, this.props.selectedEvent.end)) {
      message.error(`Cannot move booking outside of academic year ${this.calculateAcademicYear(this.props.selectedCourse.course.academicStart, this.props.selectedCourse.course.academicEnd)}`, 4);
    } else {
      this.props.updateNewBooking();
    }
  }

  repeatBooking = async (repeatTime: number) => {
    this.props.clearOutsideAcademicYearBookings();
    const newBookings: any[] = [];
    const baseEvent = this.props.newBookings[this.props.newBookings.length - 1];
    const repeatTimeArray = Array.apply(null, { length: repeatTime - 1 } as any).map(Number.call, Number);
    let outsideAcademicYearCount = 0;
    repeatTimeArray.forEach((_val, i) => {
      const newBooking = {
        index: uuid.v4(),
        type: 'student',
        owner: baseEvent.owner,
        parent: this.props.tutorInfo._id,
        status: '',
        start: new Date(new Date(baseEvent.start).getTime() + (i + 1) * 604800000),
        end: new Date(new Date(baseEvent.end).getTime() + (i + 1) * 604800000)
      };

      let isOverLapsed = false;
      const newBookingRange = extendedMoment.range(newBooking.start, newBooking.end);
      for (let item of this.props.newBookings) {
        const itemRange = extendedMoment.range(item.start, item.end);
        if (itemRange.overlaps(newBookingRange)) {
          isOverLapsed = true;
          break;
        }
      }

      if (!isOverLapsed) {
        if (!this.checkBookingInAcademicYear(newBooking.start, newBooking.end)) {
          outsideAcademicYearCount++;
          this.props.detectOutsideAcademicYearBookings({
            start: newBooking.start,
            end: newBooking.end
          });
        } else {
          newBookings.push(newBooking);
        }
      } else {
        message.error(`Cannot repeat ${repeatTime - 1} weeks. Time has been used`, 4);
      }
    })

    if (outsideAcademicYearCount > 0) {
      this.props.openDetectUnqualifiedModal();
    }

    else if (newBookings.length > 0) {
      this.props.checkMultipleBookingsForRepeat({ newBookings });
    }
  }

  requireMoreBooking = (repeatTime: number) => {
    // TODO : Rewrite this
    this.props.clearOutsideAcademicYearBookings();
    if (!this.props.selectedCourse || !this.props.selectedCourse.course || !this.props.selectedCourse.course.session) return;
    const allBookingsNeeded = this.props.newBookings.length <= this.props.selectedCourse.course.session ? this.props.newBookings : this.props.newBookings.slice(this.props.newBookings.length - this.props.selectedCourse.course.session, this.props.newBookings.length);
    // find the first lesson in bookings
    const start = allBookingsNeeded.reduce((result, value) => {
      if (new Date(result.start).getTime() > new Date(value.start).getTime()) {
        result = value;
      }
      return result;
    });

    // find the last lesson in bookings
    const end = allBookingsNeeded.reduce((result, value) => {
      if (new Date(result.start).getTime() < new Date(value.start).getTime()) {
        result = value;
      }
      return result;
    });
    if (!start || !end) return;

    const duration = new Date(end.end).getTime() - new Date(start.start).getTime();
    const weeks = Math.floor(duration / 604800000) + 1;
    let outsideAcademicYearCount = 0;
    const repeatTimeArray = Array.apply(null, { length: (repeatTime - 1) / this.props.selectedCourse.course.session } as any).map(Number.call, Number);

    const newBookings: any[] = [];
    repeatTimeArray.map((_val, i) => {
      allBookingsNeeded.forEach(val => {
        const newBooking = {
          index: uuid.v4(),
          type: 'student',
          owner: val.owner,
          parent: this.props.tutorInfo._id,
          status: '',
          start: new Date(new Date(val.start).getTime() + (i + 1) * weeks * 604800000),
          end: new Date(new Date(val.end).getTime() + (i + 1) * weeks * 604800000)
        };

        let isOverLapsed = false;
        const newBookingRange = extendedMoment.range(newBooking.start, newBooking.end);
        for (let item of this.props.newBookings) {
          const itemRange = extendedMoment.range(item.start, item.end);
          if (itemRange.overlaps(newBookingRange)) {
            isOverLapsed = true;
            break;
          }
        }
        if (!isOverLapsed) {
          if (!this.checkBookingInAcademicYear(newBooking.start, newBooking.end)) {
            outsideAcademicYearCount++;
            this.props.detectOutsideAcademicYearBookings({
              start: newBooking.start,
              end: newBooking.end
            });
          } else {
            newBookings.push(newBooking);
          }
        } else {
          message.error(`Cant repeat ${repeatTime} weeks. Time has been used`, 4);
        }
      })
    })

    if (outsideAcademicYearCount > 0) {
      this.props.openDetectUnqualifiedModal();
    }

    else if (newBookings.length > 0) {
      this.props.changeNumberOfLessonsRequiredMore(repeatTime - 1);
      this.props.checkMultilpleBookings({ newBookings });
    }
    // this.props.requireOptionChange({ requireOption: "" })
  }

  onSelectCourse = async (courseId: any[]) => {
    if (this.props.newBookings.length) {
      this.setState({
        visible: true,
        nextCourse: courseId
      })
    } else {
      this.selectCourse(courseId);
    }
  }

  selectCourse = async (courseId: any[]) => {
    this.setState({
      visible: false,
      nextCourse: null
    })
    if (courseId.length > 1) {
      const selectedCourse = this.props.tutorInfo.courseForTutor.filter((item) => item._id === courseId[1])[0];
      if (selectedCourse) {
        if (Object.keys(this.props.profileState).length && this.props.profileState.isLoggedIn) {
          await this.props.selectCourse({ selectedCourse });
          this.props.selectedCourse.course.subject === 'trial' ? this.props.updateNameOfButtonSave('Book') : this.props.updateNameOfButtonSave('Save & Next');
        } else {
          this.props.openLoginAlertModal();
        }
      }
    }
  }

  scheduleATrial = () => {
    const scroll = Scroll.animateScroll;

    scroll.scrollTo(500, {
      duration: 500,
      delay: 100,
      smooth: true,
      containerId: 'ContainerElementID',
      offset: 50,
    });
    const trialCourse = this.props.tutorInfo.courseForTutor.filter((item) => {
      if (item.course.subject === 'trial') {
        return item;
      }
    });
    const selectedCourseId = [undefined, trialCourse[0]._id];
    this.onSelectCourse(selectedCourseId);
  }

  onSaveBooking = () => {
    if (this.props.newBookings.length < this.props.selectedCourse.course.session + this.props.numberOfLessonsRequiredMore) {
      message.error(`Please select at least ${this.props.selectedCourse.course.session + this.props.numberOfLessonsRequiredMore} lessons`, 4);
    } else {
      this.props.openRequireModal();
    }
  }

  loadMoreRatings = () => {
    this.props.loadMoreRatings({
      userId: this.props.tutorInfo._id,
      pageSize: 5,
      pageNumber: this.props.ratings && this.props.ratings.data ? Math.floor(this.props.ratings.data.length / 5) + 1 : 1
    })
  }

  requireMoreLessons = (value) => {
    this.props.requireMoreLessonsChange({ numberOfLessons: value })
  }

  calculateAcademicYear = (start, end) => {
    if (start && end) {
      const thisYear = new Date().getFullYear();
      const startFiltered = MONTHS.filter((val) => val.name === start);
      const endFiltered = MONTHS.filter((val) => val.name === end);
      if (startFiltered && startFiltered.length && endFiltered && endFiltered.length) {
        if (startFiltered[0].id < endFiltered[0].id) {
          return `| Start: ${start} ${thisYear} - End: ${end} ${thisYear}`
        } else {
          return `| Start: ${start} ${thisYear} - End: ${end} ${thisYear + 1}`
        }
      } else {
        return "";
      }
    } else {
      return "";
    }
  }

  calculateDataSource = () => {
    const addedSlots = this.props.selectedCourse && this.props.selectedCourse.course.session ? Array.apply(null, { length: this.props.selectedCourse.course.session + this.props.numberOfLessonsRequiredMore - this.props.newBookings.length } as any).map(Number.call, Number) : [];
    return [...this.props.newBookings, ...addedSlots].map((item) => (
      item.start && item.end ? {
        ...item,
        start: this.inputDateInUserTimezone(item.start),
        end: this.inputDateInUserTimezone(item.end),
        uid: uuid.v4()
      } : {
          ...item,
          uid: uuid.v4()
        }))
  }

  checkBookingInAcademicYear = (start, end) => {
    if (this.props.selectedCourse && this.props.selectedCourse.course) {
      const startAcademicYear = this.props.selectedCourse.course.academicStart;
      const endAcademicYear = this.props.selectedCourse.course.academicEnd;
      if (startAcademicYear && endAcademicYear) {
        const startAcademicYearFiltered = MONTHS.filter((val) => val.name === startAcademicYear);
        const endAcademicYearFiltered = MONTHS.filter((val) => val.name === endAcademicYear);
        if (startAcademicYearFiltered && startAcademicYearFiltered.length && endAcademicYearFiltered && endAcademicYearFiltered.length) {
          const startMonth = new Date(start).getMonth();
          const endMonth = new Date(end).getMonth();
          if (startAcademicYearFiltered[0].id < endAcademicYearFiltered[0].id) {
            if (startMonth <= endAcademicYearFiltered[0].id && startMonth >= startAcademicYearFiltered[0].id
              && endMonth <= endAcademicYearFiltered[0].id && endMonth >= startAcademicYearFiltered[0].id) {
              return true;
            } else {
              return false;
            }
          } else {
            if (((startMonth <= endAcademicYearFiltered[0].id && startMonth >= 0)
              || (startMonth >= startAcademicYearFiltered[0].id && startMonth <= 11))
              && ((endMonth <= endAcademicYearFiltered[0].id && endMonth >= 0)
                || (endMonth >= startAcademicYearFiltered[0].id && endMonth <= 11))) {
              return true;
            } else {
              return false;
            }
          }
        } else {
          return true;
        }
      } else {
        return true;
      }
    } else {
      return true;
    }
  }

  render() {
    const { Content } = Layout;
    const editTimeSlot = (_record) => {
      return (
        <div>
          <h4>{this.props.languageState.INFORMATION_TUTOR_PAGE_EDIT_TIMESLOT.translated}</h4>
          <div style={{ marginTop: '24px', marginBottom: '12px', lineHeight: '32px' }}>
            {this.props.languageState.INFORMATION_TUTOR_PAGE_DATE.translated}: &nbsp;
            <DatePicker
              style={{ width: '85%', float: 'right' }}
              value={extendedMoment(this.inputDateInUserTimezone(this.props.selectedEvent.start))}
              onChange={this.timeChange}
            />
          </div>
          <div style={{ marginTop: '24px', marginBottom: '12px' }}>
            <span style={{ display: 'inline-block', marginRight: '12px' }}>
              {this.props.languageState.INFORMATION_TUTOR_PAGE_FROM.translated}: &nbsp;
              <TimePicker
                value={extendedMoment(this.inputDateInUserTimezone(this.props.selectedEvent.start), 'HH:mm')}
                format='HH:mm'
                minuteStep={30}
                onChange={this.timeChange}
              />
            </span>
            <span style={{ display: 'inline-block' }}>
              {this.props.languageState.INFORMATION_TUTOR_PAGE_TO.translated}: &nbsp;
              <TimePicker
                disabled={true}
                value={extendedMoment(this.inputDateInUserTimezone(this.props.selectedEvent.end), 'HH:mm')}
                format='HH:mm'
                minuteStep={30}
              />
            </span>
          </div>
        </div>
      );
    };

    const customTimeSlot = ({ event }) => {
      return (
        <Tooltip placement="rightTop" title={<Button icon='delete' onClick={(_e) => this.deleteBooking(event)} />}>
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

    const actionButtons = (record: any) => {
      return (
        <div className="action-buttons">
          <Popconfirm
            placement='bottomRight'
            okText='Save'
            cancelText='Cancel'
            title={editTimeSlot(record)}
            icon={null}
            visible={this.props.selectedEvent.index === record.index}
            onCancel={(_event) => this.selectEvent({})}
            onConfirm={this.saveEventChanges}
          >
            <Button
              type="primary"
              icon="edit"
              className="button"
              onClick={(_event) => this.selectEvent(record)}
              style={{ marginRight: '12px' }}
            />
          </Popconfirm>

          <Button
            type="primary"
            icon='delete'
            className="button"
            onClick={(_e) => this.deleteBooking(record)}
            style={{ marginRight: '12px' }}
          />
        </div>
      );
    };

    const columns = [
      {
        title: this.props.languageState.INFORMATION_TUTOR_PAGE_LESSONS.translated,
        dataIndex: 'lesson',
        key: 'lesson',
        render: (_text, _record, index) => `Lesson ${index + 1}`
      },
      {
        title: this.props.languageState.INFORMATION_TUTOR_PAGE_DATE.translated,
        dataIndex: 'date',
        key: 'date',
        render: (_text, record, _index) => {
          return record.start && record.end ? extendedMoment(record.start).format('DD MMM YYYY') : 'Not selected'
        }
      },
      {
        title: this.props.languageState.INFORMATION_TUTOR_PAGE_TIME.translated,
        dataIndex: 'time',
        key: 'time',
        render: (_text, record, _index) => record.start && record.end ? `${extendedMoment(record.start).format('HH:mm')} - ${extendedMoment(record.end).format('HH:mm')}` : "Not selected"
      },
      {
        title: this.props.languageState.INFORMATION_TUTOR_PAGE_ACTIONS.translated,
        dataIndex: 'actions',
        key: 'actions',
        render: (_text, record, _index) => record.start && record.end ? actionButtons(record) : ""
      }
    ];

    let eventList = [...this.props.schedulesData.filter((item) => {
      if (item.type === 'trial') {
        return item;
      }
      else if (item.owner !== this.props.profileState._id) {
        return item;
      }
    }), ...this.props.newBookings];

    if (!this.state.isServer) {
      eventList = [...eventList, ...this.props.studentSessionList];
    }

    return (
      <UserLayout
        profileState={this.props.profileState || null}
        profileReducers={this.props.profileReducers}
        openLoginModal={this.props.openLoginModal}
        openRegisterModal={this.props.openRegisterModal}
        editProfilePageState={this.props.editProfilePageState}
        languageState={this.props.languageState}
      >
        <Spin spinning={this.state.isServer}>
          <div>
            <AlertLoginModal
              loginAlertModalVisible={this.props.loginAlertModalVisible}
              closeLoginAlertModal={this.props.closeLoginAlertModal}
              openLoginModal={this.props.openLoginModal}
              openRegisterModal={this.props.openRegisterModal}
              languageState={this.props.languageState}
            />

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
                        tutorInfo={this.props.tutorInfo}
                        dataLookupState={this.props.dataLookupState}
                        profileState={this.props.profileState}
                        scheduleATrial={this.scheduleATrial}
                        isBookedTrial={this.props.isBookedTrial}
                        languageState={this.props.languageState}
                      />
                    </Content>
                  </Layout>

                  <Content>
                    <h3>About Me</h3>
                    <Row >
                      <p><b>Speak: </b> {this.props.tutorInfo.biography ? this.props.tutorInfo.biography.language : ''}</p>
                      <ShowMore lines={2} more='Show more' less='Show less' anchorClass=''>
                        {this.props.tutorInfo.biography ? <p style={{ marginBottom: '0px' }}>{this.props.tutorInfo.biography.aboutMe}</p> : <p style={{ marginBottom: '0px' }}>About Me</p>}
                      </ShowMore>
                    </Row>
                    <hr style={{ marginBottom: 20 }} />

                    <h3>Education</h3>
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

                    <h3>Teaching Experience</h3>
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
                </div>
                <div id="schedule">
                  <h3>Teaches</h3>
                  <Content>
                    <Row align='bottom'>
                      <div ref='checkbox-group'>
                        <Modal
                          title="Warning"
                          visible={this.state.visible}
                          onOk={() => this.selectCourse(this.state.nextCourse as any)}
                          onCancel={() => this.setState({ visible: false, nextCourse: null })}
                          okText="Okay"
                          cancelText="Cancel"
                        >
                          <div>
                            <h3>Current selections will be cleared. Please choose your lesson timings again.</h3>
                          </div>
                        </Modal>
                        <Checkbox.Group style={{ width: '100%' }} onChange={this.onSelectCourse} value={[this.props.selectedCourse._id]}>
                          <Row type='flex'>
                            {this.props.tutorInfo.courseForTutor.filter(val => val.course.country === 'trial').map((item, index) => (
                              <Col span={24} key={index} style={{ marginBottom: '8px', fontWeight: 500 }}>
                                <Checkbox disabled={this.props.isBookedTrial} value={item._id}>{`Trial | ${item.course.session} Lesson | Free`}</Checkbox>
                              </Col>
                            ))}
                            {this.props.tutorInfo.courseForTutor.filter(val => val.hourlyRate > 0).length && this.sortCourse(this.props.tutorInfo.courseForTutor.filter((course) => course.hourlyRate > 0)).map((item, index) => (
                              <Col span={24} key={index} style={{ marginBottom: '8px', fontWeight: 500 }}>
                                <Checkbox value={item._id}>{`${item.course.country} | ${item.course.grade} | ${item.course.subject} | ${item.course.session} Lessons | ${this.calculateLocaleHourlyRate(item.hourlyRate)}/hour ${this.calculateAcademicYear(item.course.academicStart, item.course.academicEnd)}`}</Checkbox>
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
                        <div style={{ background: '#ffffff' }}>
                          <Spin spinning={this.props.isBusy}>
                            <Scroll.Element name="schedules">
                              {this.state.mountCalendar ?
                                <DragAndDropCalendar
                                  views={['month', 'week']}
                                  selectable={true}
                                  defaultDate={this.inputDateInUserTimezone()}
                                  defaultView={Calendar.Views.WEEK}
                                  events={eventList.map((item) => ({ ...item, start: this.inputDateInUserTimezone(item.start), end: this.inputDateInUserTimezone(item.end) }))}
                                  style={{ minHeight: '800px', padding: '20px 0px 20px 20px', marginRight: '24px' }}
                                  scrollToTime={new Date(1970, 1, 1, 6)}
                                  onEventDrop={this.moveEvent}
                                  popup={true}
                                  onSelectSlot={this.createNewBooking}
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
                                /> : <div></div>
                              }
                            </Scroll.Element>
                          </Spin>
                        </div>
                      </Col>
                      <Col xs={24} sm={24} md={24} lg={9}>
                        {Object.keys(this.props.profileState).length && this.props.profileState.isLoggedIn ?
                          <div>
                            {Object.keys(this.props.selectedCourse).length > 0 && (
                              <Row type='flex' gutter={12}>
                                <Col span={24} style={{ padding: '20px 20px 0 20px' }}>
                                  <h2>Selected Course</h2>
                                  <div>
                                    {this.props.selectedCourse.course.country === 'trial'
                                      ? <p>Trial</p>
                                      : <p>{this.props.selectedCourse.course.country} - {this.props.selectedCourse.course.grade} - {this.props.selectedCourse.course.subject}</p>}
                                    <p>No. of Lessons: {this.props.selectedCourse.course.session}</p>
                                    <p>Hours per Lesson: {this.props.selectedCourse.course.hourPerSession} {this.props.selectedCourse.course.hourPerSession > 1 ? 'hours' : 'hour'}</p>
                                    <p>Hourly Rate: {this.calculateLocaleHourlyRate(this.props.selectedCourse.hourlyRate)}/hour</p>
                                  </div>
                                </Col>

                                <Col span={24} style={{ padding: '20px 20px 0 20px' }}>
                                  <Table
                                    size='small'
                                    pagination={false}
                                    columns={columns}
                                    rowKey={(record) => record.uuid}
                                    dataSource={this.calculateDataSource()}
                                  />
                                </Col>

                                <Col span={24} style={{ textAlign: 'right', marginTop: '24px' }}>
                                  {Object.keys(this.props.profileState).length && this.props.profileState.isLoggedIn && (
                                    <Button
                                      icon='wallet'
                                      type='primary'
                                      onClick={this.props.selectedCourse.course.subject === 'trial' ? this.saveTrialBooking : this.onSaveBooking}
                                    >
                                      {this.props.buttonSave}
                                    </Button>
                                  )}
                                </Col>

                                {this.props.outsideAcademicYearBookings.length > 0 && (
                                  <Col span={24} style={{ padding: '20px 20px 0 20px' }}>
                                    <h3>The following dates are outside of academic year {this.calculateAcademicYear(this.props.selectedCourse.course.academicStart, this.props.selectedCourse.course.academicEnd)} </h3>
                                    <div style={{ marginTop: '12px' }}>
                                      {this.props.outsideAcademicYearBookings.map((item, index) => (
                                        <p key={index}> - {extendedMoment(this.inputDateInUserTimezone(item.start)).format('DD MMM YYYY')} From {extendedMoment(this.inputDateInUserTimezone(item.start)).format('HH:mm')} to {extendedMoment(this.inputDateInUserTimezone(item.end)).format('HH:mm')}</p>
                                      ))}
                                    </div>
                                    <div style={{ marginTop: '12px' }}>
                                      Please check tutor's calendar and select other available timeslots
                                    </div>
                                  </Col>
                                )}

                                {this.props.detectUnqualifiedBooking.unqualifiedBookings.length > 0 && (
                                  <Col span={24} style={{ padding: '20px 20px 0 20px' }}>
                                    <h3>The following dates are not available: </h3>
                                    <div style={{ marginTop: '12px' }}>
                                      {this.props.detectUnqualifiedBooking.unqualifiedBookings.map((item, index) => (
                                        <p key={index}> - {extendedMoment(this.inputDateInUserTimezone(item.start)).format('DD MMM YYYY')} From {extendedMoment(this.inputDateInUserTimezone(item.start)).format('HH:mm')} to {extendedMoment(this.inputDateInUserTimezone(item.end)).format('HH:mm')}</p>
                                      ))}
                                    </div>
                                    <div style={{ marginTop: '12px' }}>
                                      Please check tutor's calendar and select other available timeslots
                                  </div>
                                  </Col>
                                )}
                              </Row>
                            )}
                          </div> :
                          <div style={{ paddingBottom: '10px' }}>
                            <h3 style={{ textAlign: 'center' }}>You have to login to add sessions.</h3>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                              <Button
                                type="primary"
                                style={{
                                  width: '100px',
                                  height: '35px',
                                  backgroundColor: '#34dd48',
                                  borderColor: '#34dd48',
                                  color: 'white',
                                  marginRight: 10,
                                }}
                                onClick={this.props.openLoginModal}
                              >
                                Log In
                          </Button>
                              <Button
                                type="primary"
                                style={{
                                  width: '100px',
                                  height: '35px',
                                  marginLeft: 10,
                                }}
                                onClick={this.props.openRegisterModal}
                              >
                                Sign Up
                          </Button>
                            </div>
                          </div>
                        }
                      </Col>
                    </Row>
                    <hr />
                  </Content>
                </div>
                <Content id="rating" style={{ minHeight: '650px', paddingTop: '80px' }}>
                  {this.props.ratings && this.props.ratings.data && this.props.ratings.data.length ?
                    (<Row style={{ marginTop: '-30px' }}>
                      <Col span={15}>
                        <Col xs={24}>
                          <h2 style={{ display: 'inline-block' }}>
                            <b>{this.props.tutorInfo.rating} <Icon type="star" theme="filled" /></b>
                            <span style={{ marginLeft: '5px', marginRight: '3px' }}>|</span>
                            <span>{this.props.ratings.total} Review(s)</span>
                          </h2>
                          <h3 style={{ display: 'inline-block', marginLeft: '30px' }}>
                            <span style={{ marginRight: '15px' }}>5 Stars ({this.props.ratings.stars ? this.props.ratings.stars.five : 0})</span>
                            <span style={{ margin: '0px 15px' }}>4 Stars ({this.props.ratings.stars ? this.props.ratings.stars.four : 0})</span>
                            <span style={{ margin: '0px 15px' }}>3 Stars ({this.props.ratings.stars ? this.props.ratings.stars.three : 0})</span>
                            <span style={{ margin: '0px 15px' }}>2 Stars ({this.props.ratings.stars ? this.props.ratings.stars.two : 0})</span>
                            <span style={{ marginLeft: '15px' }}>1 Star ({this.props.ratings.stars ? this.props.ratings.stars.one : 0})</span>
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
                                <h4>Submitted on {moment(val.uploadDate).format('DD MMM YYYY')}</h4>
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
                    <div style={{ marginTop: '-30px' }}>
                      <h3>Ratings</h3>
                      <p>There is currently no ratings.</p>
                    </div>
                  }
                </Content>
              </Content>

              <Modal
                title='Confirm Your Booking'
                visible={this.props.paymentModelVisible}
                style={{ fontWeight: 'bold', padding: 20 }}
                destroyOnClose={true}
                onCancel={this.onClosePaymentModal}
                footer={null}
                width={1200}
                maskClosable={false}
              >
                {Object.keys(this.props.selectedCourse).length > 0 && (
                  <Spin spinning={this.props.isBusy} tip='Processing ...'>
                    <BillingPreference
                      promoCode={this.props.promoCode}
                      promoCodeInput={this.props.promoCodeInput}
                      changePromoCodeInput={this.props.changePromoCodeInput}
                      changePromoCode={this.props.changePromoCode}
                      clearPromoCode={this.props.clearPromoCode}
                      tutorInfo={this.props.tutorInfo}
                      selectedCourse={this.props.selectedCourse}
                      newBookings={this.props.newBookings.map((item) => ({ ...item, start: this.inputDateInUserTimezone(item.start), end: this.inputDateInUserTimezone(item.end) }))}
                      profileState={this.props.profileState}
                      paymentOption={this.props.paymentOption}
                      onClosePaymentModal={this.onClosePaymentModal}
                      paymentOptionChange={this.props.paymentOptionChange}
                      clearState={this.props.clearState}
                      openSessionExpiredModal={this.props.openSessionExpiredModal}
                      languageState={this.props.languageState}
                    />
                    <Row type='flex' gutter={24}>
                      <Col span={24} style={{ textAlign: 'right', marginTop: '24px' }}>
                        <PaypalButton
                          {...this.props.paypalState}
                          {...this.props.paypalReducers}
                          clearPromoCode={this.props.clearPromoCode}
                          idNewSchedules={this.props.resultNewSchedule.map((item) => { return item._id; })}
                          tutorId={this.props.tutorInfo._id}
                          studentId={this.props.profileState._id}
                          selectedCourse={this.props.selectedCourse}
                          newBookings={this.props.newBookings.map((item) => ({ ...item, start: this.inputDateInUserTimezone(item.start), end: this.inputDateInUserTimezone(item.end) }))}
                          currency={this.props.profileState ? this.props.profileState.currency && this.props.profileState.currency.code ? PaypalCurrencies.indexOf(this.props.profileState.currency.code) > -1 ? this.props.profileState.currency.code : 'SGD' : 'SGD' : 'SGD'}
                          exchangeRate={this.props.profileState ? this.props.profileState.currency && this.props.profileState.currency.exchangeRate ? PaypalCurrencies.indexOf(this.props.profileState.currency.code) > -1 ? this.props.profileState.currency.exchangeRate : 1 : 1 : 1}
                          informationTutorPageState={_.omit(this.props, ['profileState', 'dataLookupState', 'paypalState', 'loginPageState', 'signUpPageState'])}
                          informationTutorPageReducers={_.omit(this.props, ['profileReducers', 'dataLookupReducers', 'paypalReducers', 'loginPageReducers', 'signUpPageReducers'])}
                          promoCode={this.props.promoCode}
                          width={this.props.paymentOption ? 'auto' : '0px'}
                          languageState={this.props.languageState}
                        />
                      </Col>
                    </Row>
                  </Spin>
                )}
              </Modal>

              <Modal
                title='Session Expired'
                visible={this.props.sessionExpiredModalVisible}
                onOk={() => {
                  this.props.closeSessionExpiredModal();
                  Router.push('/login-student/findATutor');
                }}
                onCancel={() => {
                  this.props.closeSessionExpiredModal();
                  Router.push('/login-student/findATutor');
                }}
                cancelButtonProps={{ style: { display: 'none' } }}
                width={700}
                destroyOnClose={true}
              >
                <p style={{ fontWeight: 500, textAlign: 'center' }}>Your session has expired. Please return to your home page and book your tuition again.</p>
              </Modal>

              <Modal
                title='Log In'
                visible={this.props.loginModalVisible}
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
                title='Sign Up'
                visible={this.props.registerModalVisible}
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
                  openRegisterSuccessModal={this.props.openRegisterSuccessModal}
                  closeRegisterModal={this.props.closeRegisterModal}
                  openLoginModal={this.props.openLoginModal}
                  loginPageReducers={this.props.loginPageReducers}
                  languageState={this.props.languageState}
                />
              </Modal>

              <Modal
                title='Reset Password'
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

              {this.props.selectedCourse.course && this.props.selectedCourse.course.level !== 'trial' && (
                <Modal
                  title="Repeat"
                  visible={this.props.repeatModalVisible}
                  footer={null}
                  onCancel={this.props.closeRepeatModal}
                >
                  <h3>Do you want to: </h3>

                  <Radio.Group
                    onChange={(e) => this.props.repeatOptionChange({ repeatOption: e.target.value })}
                    value={this.props.repeatOption}
                  >
                    <Radio style={{ display: 'block', height: '30px', lineHeight: '30px' }} value='repeat'>
                      Repeat this lesson every week for the next {this.props.selectedCourse.course.session + this.props.numberOfLessonsRequiredMore - this.props.newBookings.length > 3 ? '3' : String(this.props.selectedCourse.course.session + this.props.numberOfLessonsRequiredMore - this.props.newBookings.length)} weeks
                  </Radio>
                    <Radio style={{ display: 'block', height: '30px', lineHeight: '30px' }} value='noRepeat'>
                      Choose own tuition dates
                  </Radio>
                  </Radio.Group>

                  <div style={{ marginTop: '12px' }}>
                    <Button
                      type="primary"
                      style={{ minWidth: '100px', marginRight: '12px' }}
                      onClick={(_e) => {
                        if (this.props.repeatOption === 'repeat') {
                          this.props.selectedCourse.course.session + this.props.numberOfLessonsRequiredMore - this.props.newBookings.length > 3 ? this.repeatBooking(4) : this.repeatBooking(this.props.selectedCourse.course.session + this.props.numberOfLessonsRequiredMore - this.props.newBookings.length + 1);
                        } else if (this.props.repeatOption === 'noRepeat') {
                          this.props.closeRepeatModal();
                        }
                      }}
                      disabled={this.props.repeatOption ? false : true}
                    >
                      Save
                  </Button>
                    <Button
                      style={{ minWidth: '100px', marginRight: '12px' }}
                      onClick={this.props.closeRepeatModal}
                    >
                      Cancel
                  </Button>
                  </div>
                </Modal>
              )}

              {this.props.selectedCourse.course && (
                <Modal
                  title="Require More Lessons"
                  visible={this.props.requireModalVisible}
                  footer={null}
                >
                  <h3>Do you require more lessons ?</h3>

                  <Radio.Group
                    onChange={(e) => this.props.requireOptionChange({ requireOption: e.target.value })}
                    value={this.props.requireOption}
                  >
                    <Radio style={{ display: 'block', height: '30px', lineHeight: '30px' }} value='moreLessons' disabled={this.props.newBookings.length >= this.props.selectedCourse.course.session * 4}>
                      Yes, &nbsp;
                    <InputNumber
                        disabled={this.props.newBookings.length >= this.props.selectedCourse.course.session * 4}
                        min={this.props.selectedCourse.course.session}
                        max={this.props.selectedCourse.course.session * 4 - this.props.newBookings.length}
                        step={this.props.selectedCourse.course.session}
                        value={this.props.requireMoreLessons}
                        onChange={(value) => this.requireMoreLessons(value)}
                      />
                    </Radio>
                    <Radio style={{ display: 'block', height: '30px', lineHeight: '30px' }} value='noMoreLessons'>
                      No, proceed to payment
                  </Radio>
                  </Radio.Group>

                  <div style={{ color: '#f5222d', textAlign: 'center', marginTop: '24px' }}>
                    {this.props.errorMessage}
                  </div>

                  <div style={{ marginTop: '12px' }}>
                    <Button
                      type="primary"
                      style={{ minWidth: '100px', marginRight: '12px' }}
                      onClick={(_e) => {
                        if (this.props.requireOption === 'moreLessons') {
                          if (this.props.requireMoreLessons === 0) {
                            message.error('Number of lessons cant be 0', 4);
                          } else if (this.props.requireMoreLessons % this.props.selectedCourse.course.session !== 0) {
                            message.error(`Number of lessons must be multiples of ${this.props.selectedCourse.course.session}`, 4);
                          } else if (this.props.newBookings.length >= this.props.selectedCourse.course.session * 4) {
                            message.error('You have booked too much lessons. Please proceed to payment', 4);
                          } else {
                            this.requireMoreBooking(this.props.requireMoreLessons + 1)
                          }
                        } else if (this.props.requireOption === 'noMoreLessons') {
                          this.saveNewBookings();
                        }
                      }}
                      disabled={this.props.requireOption ? false : true}
                    >
                      Save
                  </Button>
                    <Button
                      style={{ minWidth: '100px', marginRight: '12px' }}
                      onClick={this.props.closeRequireModal}
                    >
                      Cancel
                  </Button>
                  </div>
                </Modal>
              )}

              {this.props.selectedCourse.course && (
                <Modal
                  title="Booking Conflict"
                  visible={this.props.detectUnqualifiedBooking.unqualifiedBookingsModalVisible}
                  cancelButtonProps={{ style: { display: 'none' } }}
                  onOk={() => {
                    this.props.closeUnqualifiedBookingsModal();
                    Scroll.scroller.scrollTo('schedules', {
                      duration: 500,
                      smooth: true,
                    });
                  }}
                  onCancel={this.props.closeUnqualifiedBookingsModal}
                >
                  {this.props.detectUnqualifiedBooking.unqualifiedBookings.length ?
                    <div>
                      <h3>The following dates are not available: </h3>
                      <div style={{ marginTop: '12px' }}>
                        {[...this.props.detectUnqualifiedBooking.unqualifiedBookings].sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime()).map((item, index) => (
                          <p key={index}> - {extendedMoment(this.inputDateInUserTimezone(item.start)).format('DD MMM YYYY')} From {extendedMoment(this.inputDateInUserTimezone(item.start)).format('HH:mm')} to {extendedMoment(this.inputDateInUserTimezone(item.end)).format('HH:mm')}</p>
                        ))}
                      </div>
                    </div> : <div></div>
                  }
                  {
                    this.props.outsideAcademicYearBookings.length ? <div>
                      <h3>The following dates are outside of academic year {this.calculateAcademicYear(this.props.selectedCourse.course.academicStart, this.props.selectedCourse.course.academicEnd)} </h3>
                      <div style={{ marginTop: '12px' }}>
                        {this.props.outsideAcademicYearBookings.sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime()).map((item, index) => (
                          <p key={index}> - {extendedMoment(this.inputDateInUserTimezone(item.start)).format('DD MMM YYYY')} From {extendedMoment(this.inputDateInUserTimezone(item.start)).format('HH:mm')} to {extendedMoment(this.inputDateInUserTimezone(item.end)).format('HH:mm')}</p>
                        ))}
                      </div>
                    </div> : <div></div>
                  }
                  <div style={{ marginTop: '12px' }}>
                    Please check tutor's calendar and select other available timeslots
                </div>
                </Modal>
              )}
            </Layout>
          </div>
        </Spin>
      </UserLayout >
    );
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

export default withRematch(initStore, mapState, mapDispatch)(Teacher);
