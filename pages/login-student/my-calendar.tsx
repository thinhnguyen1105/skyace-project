import React from 'react';
import UserLayout from '../../layout/UserLayout';
import initStore from '../../rematch/store';
import withRematch from '../../rematch/withRematch';
import { Row, Col, Spin, Popover, Avatar, Tabs } from 'antd';
import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop';
import Calendar from 'react-big-calendar';
import moment from 'moment';
import Link from 'next/link';
import Router from 'next/router';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import 'react-big-calendar/lib/addons/dragAndDrop/styles.css';
import './my-calendar.css';

Calendar.setLocalizer(Calendar.momentLocalizer(moment));
const DragAndDropCalendar = withDragAndDrop(Calendar);
const colors = ['#44AAFF', '#FF6666', '#FFDD88', '#f368e0', '#5f27cd', '#1dd1a1', '#ff7979', '#44FF55', '#6c5ce7', '#fab1a0', '#81ecec', '#a29bfe', '#ff9f43', '#feca57', '#ff793f'];

class MyCalendar extends React.Component<any, any> {
  state = {
    calendarDate: new Date(),
    mountCalendar: true
  };

  async componentDidMount() {
    this.props.getStudentTuitions({ studentId: this.props.profileState._id });

    Router.onRouteChangeStart = (_url) => {
      this.setState({
        mountCalendar: false
      })
    }
  }

  componentWillUnmount() {
    this.setState({
      mountCalendar: false
    })
  }

  eventStyleGetter = (event, _start, _end, _isSelected) => {
    const tuitionListId = this.props.tuitionList.map(item => item._id);
    const tuitionFiltered = this.props.tuitionList.filter((item) => event.tuition ? item._id === event.tuition : item._id === event.groupTuition);
    const tuition = tuitionFiltered.length ? tuitionFiltered[0] : null
    const index = tuitionListId.indexOf(event.tuition ? event.tuition : event.groupTuition);
    const color = tuition ? (tuition.courseForTutor ? (tuition.courseForTutor.isGroup ? 
      (tuition.isActive ? (tuition.students.length >= tuition.course.minClassSize ? colors[index] : 'rgb(72,72,72)') : (tuition.students.length >= tuition.course.minClassSize ? (tuition.isCanceled ? 'rgb(14,14,14)' : 'rgb(0,64,144)') : 'rgb(80, 0, 0)'))
      : (tuition.isCanceled ? 'rgb(14,14,14)' : (tuition.isCompleted ? 'rgb(0,64,144)' : colors[index]))) : 'white') : '#44AAFF';
      // { background: `${(item.courseForTutor.isGroup ? 
        // (item.isActive ? (item.students.length >= item.course.minClassSize ? colors[index] : 'rgb(72,72,72)') : (item.students.length >= item.course.minClassSize ? (item.isCanceled ? 'rgb(14,14,14)' : 'rgb(0,64,144)') : 'rgb(80, 0, 0)'))
        // : (item.isCanceled ? 'rgb(14,14,14)' : (item.isCompleted ? 'rgb(0,64,144)' : colors[index])))}`
    const eventStyle = {
      backgroundColor: color,
      border: `1px solid ${color}`,
      borderRadius: '5px',
      opacity: 1,
      color: '#ffffff',
      display: 'block',
    };

    return { style: eventStyle };
  }

  inputDateInUserTimezone = (date: any = new Date().toString()) => {
    const browserTimezone = - new Date().getTimezoneOffset() / 60;
    const userTimezone: any = this.props.profileState.timeZone && this.props.profileState.timeZone.offset ? this.props.profileState.timeZone.offset : browserTimezone;
    const deltaTimezone = userTimezone - browserTimezone;

    return new Date(new Date(date).getTime() + deltaTimezone * 60 * 60 * 1000);
  }

  generateTuitionReferenceId = (tuition: any) => {
    const createdAt = moment(tuition.createdAt).format('HHmmSS');
    var name = tuition.courseForTutor ? tuition.courseForTutor.isGroup ?
      `${tuition.course.subject.slice(0, 2).toUpperCase()}${tuition.course.level.slice(0, 1).toUpperCase()}${String(tuition.course.grade).slice(0, 1).toUpperCase()}-${moment((tuition as any).createdAt).format('YYMMDD')}-${createdAt}-GROUP` :
      `${tuition.course.subject.slice(0, 2).toUpperCase()}${tuition.course.level.slice(0, 1).toUpperCase()}${String(tuition.course.grade).slice(0, 1).toUpperCase()}-${moment((tuition as any).createdAt).format('YYMMDD')}-${createdAt}`
      : "";
    return name + (tuition.courseForTutor ? tuition.courseForTutor.isGroup ? 
      (tuition.isActive ? (tuition.students.length >= tuition.course.minClassSize ? '' : '-PENDING') : (tuition.students.length >= tuition.course.minClassSize ? (tuition.isCanceled ? '-CANCELED' : '-FINISHED') : '-INACTIVE'))
      : (tuition.isCanceled ? '-CANCELED' : (tuition.isCompleted ? '-FINISHED' : '')) : "");
  }

  handleTutionClick = (tuition) => {
    const selectedSession = tuition.sessions.filter((item) => item.isCompleted === false)[0];

    this.setState({
      calendarDate: selectedSession.start,
    });
  }

  handleNavigate = (thisDay: any, _viewType: string, _navigateType: string) => {
    this.setState({
      calendarDate: thisDay,
    });
  }

  render() {
    let events: any[] = [];
    [...this.props.tuitionList].filter((val) => val.courseForTutor).map((item) => {
      events = [...events, ...item.sessions]
    });

    const customeTimeSlot = ({ event }) => {
      const tuition = event.groupTuition ?
        this.props.tuitionList.filter((item) => item._id === event.groupTuition)[0] :
        this.props.tuitionList.filter((item) => item._id === event.tuition)[0];
      const tooltipContent = () => {
        const sortedSessions = tuition.sessions.sort((a, b) => {
          return new Date(a.start).getTime() - new Date(b.start).getTime();
        });
        return tuition && tuition.groupTuition ?
          (
            <div className='tooltip-content' style={{ fontWeight: 600 }}>
              <p><Link href={`/calendar/group-tuition-detail/${tuition._id}`}><a>{this.generateTuitionReferenceId(tuition)}</a></Link></p>
              <p>{`${tuition.course.country} | ${tuition.course.level} ${tuition.course.grade} | ${tuition.course.subject}`}</p>
              <p>{`${moment(sortedSessions[0].start).format('DD MMM YYYY')}  =>  ${moment(sortedSessions[sortedSessions.length - 1].start).format('DD MMM YYYY')}`}</p>
              <p>
                <Link href={`/login-student/informationTutor/${tuition.tutor._id}`}>
                  <a>
                    {`Tutor: ${tuition.tutor.fullName ? tuition.tutor.fullName : [tuition.tutor.firstName, tuition.tutor.lastName].join(' ')}`} &nbsp; <Avatar src={tuition.tutor.imageUrl ? tuition.tutor.imageUrl : '/static/default.png'} />
                  </a>
                </Link>
              </p>
            </div>
          ) :
          (
            <div className='tooltip-content' style={{ fontWeight: 600 }}>
              <p><Link href={`/calendar/tuition-detail/${tuition._id}`}><a>{this.generateTuitionReferenceId(tuition)}</a></Link></p>
              {tuition.course.country === 'trial'
                ? <p>Trial</p>
                : <p>{`${tuition.course.country} | ${tuition.course.level} ${tuition.course.grade} | ${tuition.course.subject}`}</p>}
              <p>{`${moment(sortedSessions[0].start).format('DD MMM YYYY')}  =>  ${moment(sortedSessions[sortedSessions.length - 1].start).format('DD MMM YYYY')}`}</p>
              <p>
                <Link href={`/login-student/informationTutor/${tuition.tutor._id}`}>
                  <a>
                    {`Tutor: ${tuition.tutor.fullName ? tuition.tutor.fullName : [tuition.tutor.firstName, tuition.tutor.lastName].join(' ')}`} &nbsp; <Avatar src={tuition.tutor.imageUrl ? tuition.tutor.imageUrl : '/static/default.png'} />
                  </a>
                </Link>
              </p>
            </div>
          );
      };

      return (
        <Popover placement="rightTop" content={tooltipContent()} trigger='hover'>
          <div style={{ height: '100%', fontSize: '12px' }}>
            {/* <p style={{ marginBottom: '0px' }}>{`${moment(this.inputDateInUserTimezone(event.start)).format('HH:mm')} - ${moment(this.inputDateInUserTimezone(event.end)).format('HH:mm')}`}</p> */}
            <p style={{ marginBottom: '0px' }}>{this.generateTuitionReferenceId(tuition)}</p>
          </div>
        </Popover>
      );
    }

    return (
      <UserLayout profileState={this.props.profileState} profileReducers={this.props.profileReducers} editProfilePageState={this.props.editProfilePageState} languageState={this.props.languageState}>
        <div className='student-calendar'>
          <h1 style={{ marginTop: '24px' }}>{this.props.languageState.MY_CALENDAR_PAGE_MY_CALENDAR.translated}</h1>
          <Row type='flex' gutter={24}>
            <Col span={18}>
              <div style={{ background: '#ffffff' }}>
                <Spin spinning={this.props.isBusy}>
                  {this.state.mountCalendar ? 
                    <DragAndDropCalendar
                      views={['month', 'week']}
                      selectable={true}
                      date={this.inputDateInUserTimezone(this.state.calendarDate)}
                      defaultView={Calendar.Views.MONTH}
                      events={events.map((item) => ({
                        ...item,
                        start: this.inputDateInUserTimezone(item.start),
                        end: this.inputDateInUserTimezone(item.end),
                      }))}
                      style={{ minHeight: '95vh', padding: '20px 0px 20px 20px', marginRight: '24px' }}
                      scrollToTime={new Date(1970, 1, 1, 6)}
                      popup={true}
                      onNavigate={this.handleNavigate}
                      eventPropGetter={this.eventStyleGetter}
                      components={{
                        event: customeTimeSlot
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
                </Spin>
              </div>
            </Col>

            <Col span={6}>
              <h1>{this.props.languageState.MY_CALENDAR_PAGE_TUITIONS.translated}</h1>
              <Tabs defaultActiveKey="1">
                <Tabs.TabPane tab="Current" key="1">
                  {this.props.tuitionList.filter((val: any) => val.isActive && !val.isCompleted && !val.isCanceled && val.courseForTutor).length ? this.props.tuitionList.filter((val: any) => val.isActive && !val.isCompleted && !val.isCanceled && val.courseForTutor).map((item, index) => {
                    const tuitionListId = this.props.tuitionList.map(i => i._id);
                    const colorIndex = tuitionListId.indexOf(item._id);
                    return <a
                      onClick={(_e) => this.handleTutionClick(item)}
                      key={index}
                      style={{ background: `${(item.courseForTutor.isGroup ? 
                        (item.isActive ? (item.students.length >= item.course.minClassSize ? colors[colorIndex] : 'rgb(72,72,72)') : (item.students.length >= item.course.minClassSize ? (item.isCanceled ? 'rgb(14,14,14)' : 'rgb(0,64,144)') : 'rgb(80, 0, 0)'))
                        : (item.isCanceled ? 'rgb(14,14,14)' : (item.isCompleted ? 'rgb(0,64,144)' : colors[colorIndex])))}`, color: '#ffffff', borderRadius: '5px', padding: '4px', fontWeight: 500, display: 'block', cursor: 'pointer', marginBottom: '8px', width: '80%' }}
                    >
                      {this.generateTuitionReferenceId(item)}
                    </a>
                  }) : <div>There is no current tuition.</div>}
                </Tabs.TabPane>
                <Tabs.TabPane tab="Completed" key="2">
                  {this.props.tuitionList.filter((val: any) => (!val.isActive || val.isCompleted || val.isCanceled) && val.courseForTutor).length ? this.props.tuitionList.filter((val: any) => (!val.isActive || val.isCompleted || val.isCanceled) && val.courseForTutor).map((item, index) =>  
                    <a
                      onClick={(_e) => this.handleTutionClick(item)}
                      key={index}
                      style={{ background: `${(item.courseForTutor.isGroup ? 
                        (item.isActive ? (item.students.length >= item.course.minClassSize ? colors[index] : 'rgb(72,72,72)') : (item.students.length >= item.course.minClassSize ? (item.isCanceled ? 'rgb(14,14,14)' : 'rgb(0,64,144)') : 'rgb(80, 0, 0)'))
                        : (item.isCanceled ? 'rgb(14,14,14)' : (item.isCompleted ? 'rgb(0,64,144)' : colors[index])))}`, color: '#ffffff', borderRadius: '5px', padding: '4px', fontWeight: 500, display: 'block', cursor: 'pointer', marginBottom: '8px', width: '80%' }}
                    >
                      {this.generateTuitionReferenceId(item)}
                    </a>
                  ) : <div>There is no completed or canceled tuition.</div>}
                </Tabs.TabPane>
              </Tabs>
            </Col>
          </Row>
        </div>
      </UserLayout>
    );
  }
}

const mapState = (rootState: any) => {
  return {
    ...rootState.studentCalendarPageModel,
    profileState: rootState.profileModel,
    editProfilePageState: rootState.editProfilePageModel,
    languageState: rootState.languageModel,
  };
};

const mapDispatch = (rootReducer: any) => {
  return {
    ...rootReducer.studentCalendarPageModel,
    profileReducers: rootReducer.profileModel,
  };
};

export default withRematch(initStore, mapState, mapDispatch)(MyCalendar);