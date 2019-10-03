import * as React from "react";
import { Layout, Button, Table, Upload, Row, Col, Modal, Icon, message, Spin, Checkbox, Input, Rate, Popconfirm } from "antd";
import moment from 'moment';
import withRematch from "../../rematch/withRematch";
import initStore from "../../rematch/store";
import { getSessionsService } from "../../service-proxies";
import config from "../../api/config";
import * as convertXML from "xml-js";
import Calendar from 'react-big-calendar';
import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop';
import { extendMoment } from 'moment-range';
import UserLayout from "../../layout/UserLayout";
import axios, { AxiosResponse } from 'axios';
import './calendar.css';
import './session-detail.css';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import 'react-big-calendar/lib/addons/dragAndDrop/styles.css';

Calendar.setLocalizer(Calendar.momentLocalizer(moment));
const DragAndDropCalendar = withDragAndDrop(Calendar);
const extendedMoment = extendMoment(moment);
const { TextArea } = Input;

class SessionDetail extends React.Component<any, any> {
  state = {
    fileList: [],
    isLoading: false,
    uploadPercent: 0,
    startDayInCalendar: new Date()
  };

  static async getInitialProps(props: any) {
    return {
      sessionId: props.query.sessionId,
    };
  }

  componentDidMount() {
    this.props.fetchSessionInfo({ sessionId: this.props.sessionId });
    this.props.fetchRecordings(this.props.sessionId);
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

    const thisSession = {
      backgroundColor: '#f9ca24',
      borderRadius: '5px',
      opacity: 1,
      zIndex: 2,
      color: '#ffffff',
      border: '1px solid #f9ca24',
      display: 'block',
    };

    if (new Date(event.end).getTime() < new Date().getTime()) {
      return {
        style: completedSchedule,
      };
    } else {
      if (event.type === 'tutor') {
        return {
          style: tutorAvailbleSchedule,
        };
      } else if (event.type === 'student' && event._id && new Date(event.start).getTime() === new Date(this.props.sessionInfo.start).getTime()) {
        return {
          style: thisSession,
        };
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

  checkOverlaps = (event) => {
    let isOverlapsed = true;

    // check within tutor schedule
    for (let item of this.props.tutorSchedules.filter((item) => item.type === 'tutor')) {
      const itemRange = extendedMoment.range(item.start, item.end);
      if (itemRange.contains(event.start) && itemRange.contains(event.end)) {
        isOverlapsed = false;
        break;
      }
    }

    // check overlaps with other booked
    if (!isOverlapsed) {
      const eventRange = extendedMoment.range(event.start, event.end);
      for (let item of [...this.props.tutorSchedules.filter((item) => item.type === 'student' && this.inputDateInUserTimezone(item.start).getTime() !== this.inputDateInUserTimezone(this.props.sessionInfo.start).getTime())]) {
        const itemRange = extendedMoment.range(item.start, item.end);
        if (itemRange.overlaps(eventRange)) {
          isOverlapsed = true;
          break;
        }
      }
    }

    return isOverlapsed;
  }

  checkScheduleInThePast = (eventInfo) => {
    let isInThePast = false;

    if (this.outputDateInUserTimezone().getTime() > this.outputDateInUserTimezone(eventInfo.start).getTime()) {
      isInThePast = true;
    }

    return isInThePast;
  }

  checkScheduleWithin2Weeks = (event) => {
    let isWithin2Weeks = true;

    if (this.outputDateInUserTimezone(event.end).getTime() < this.outputDateInUserTimezone(this.props.sessionInfo.start).getTime() - 2 * 604800000 || this.outputDateInUserTimezone(event.start).getTime() > this.outputDateInUserTimezone(this.props.sessionInfo.end).getTime() + 2 * 604800000) {
      isWithin2Weeks = false;
    }

    return isWithin2Weeks;
  }

  closeUploadMaterialModal = () => {
    this.setState({
      fileList: [],
    });
    this.props.closeUploadMaterialModal();
  }

  onChangeCheckBox = (checked) => {
    if (this.props.profileState.roles[0] === 'tutor') {
      this.props.reportInfoChange({ reportStudent: checked })
    } else {
      this.props.reportInfoChange({ reportTutor: checked })
    }
  }

  beforeUpload = (file) => {
    this.setState(({ fileList }) => ({
      fileList: [...fileList, file],
    }));
    return false;
  }

  onRemove = (file) => {
    this.setState(({ fileList }) => {
      const index = fileList.indexOf(file);
      const newFileList = fileList.slice();
      newFileList.splice(index, 1);
      return {
        fileList: newFileList,
      };
    });
  }

  handleUpload = async () => {
    const { fileList } = this.state as any;
    const fileExtensionRegex = /(\.xlsx|\.pdf|\.doc|\.docx|\.png|\.jpg|\.jpeg|\.ppt|\.pptx)$/;
    let allowedUpload = true;
    for (let item of fileList) {
      if (!fileExtensionRegex.test(item.name)) {
        allowedUpload = false;
        break;
      }
      else if (item.size > 10 * 1024 * 1024) {
        allowedUpload = false;
        break;
      }
    }

    if (fileList.length === 0) {
      this.props.errorHappen({ errorMessage: this.props.languageState.SESSION_DETAIL_PAGE_UPLOAD_VALIDATE.translated });
    } else if (!allowedUpload) {
      this.props.errorHappen({ errorMessage: this.props.languageState.SESSION_DETAIL_PAGE_UPLOAD_VALIDATE_TYPE.translated });
    } else {
      this.props.startUploading();

      const formData = new FormData();
      formData.append('sessionId', this.props.sessionInfo._id);
      formData.append('uploadBy', this.props.profileState.roles[0]);
      fileList.forEach((file) => {
        formData.append('materials', file);
      });

      try {
        const result: AxiosResponse = await axios({
          method: 'post',
          url: `${config.nextjs.apiUrl}/sessions/uploadMaterials`,
          data: formData,
          onUploadProgress: (progressEvent) => {
            this.setState({
              uploadPercent: Math.floor(progressEvent.loaded / progressEvent.total * 100)
            });
          }
        });

        this.props.uploadMaterialsSuccess(result.data);
        await this.setState({
          fileList: [],
          uploadPercent: 0,
        });
      } catch (error) {
        console.log(error);
      }
    }
  }

  startClass = async () => {
    if (this.props.sessionInfo.isPaid) {
      this.setState({ isLoading: true });

      await this.props.generateUrl({
        _id: this.props.sessionInfo._id,
        name: (this.props.profileState.fullName ? this.props.profileState.fullName : (this.props.profileState.firstName + " " + this.props.profileState.lastName)),
        role: this.props.profileState.roles.length ? this.props.profileState.roles[0] : 'student'
      });

      if (this.props.sessionUrls) {
        var checkResult = await getSessionsService().checkRoom(this.props.sessionUrls.check);
        checkResult = JSON.parse(convertXML.xml2json(checkResult as any, {
          compact: true,
          spaces: 2
        }
        ));
        if (checkResult.response.returncode._text === "SUCCESS" && checkResult.response.running._text === "true") {
          window.location.href = this.props.sessionUrls.join;
        } else {
          var createResult = await getSessionsService().createRoom(this.props.sessionUrls.create);
          createResult = JSON.parse(convertXML.xml2json(createResult as any, {
            compact: true,
            spaces: 2
          }
          ));
          this.setState({ isLoading: false });
          if (createResult.response.returncode._text === "SUCCESS") {
            window.location.href = this.props.sessionUrls.join;
          }
        }
      } else {
        this.setState({ isLoading: false });
        message.error(this.props.languageState.SESSION_DETAIL_PAGE_START_CLASS_ERROR.translated, 4);
        return false;
      }
    } else {
      message.error(this.props.languageState.SESSION_DETAIL_PAGE_PAID_ERROR.translated, 4);
    } 
  }

  loadSchedules = (_e) => {
    this.props.loadSchedules({
      start: this.convertLocalToUTC(new Date(extendedMoment(this.props.sessionInfo.start).startOf('week').toString())),
      end: this.convertLocalToUTC(new Date(extendedMoment(this.props.sessionInfo.start).endOf('week').toString())),
      studentId: this.props.sessionInfo.student._id,
      tutorId: this.props.sessionInfo.tutor._id,
    });
  }

  navigate = (thisDay: any, viewType: string, _navigateType: string) => {
    this.setState({
      startDayInCalendar: thisDay
    })
    this.props.loadSchedules({
      start: this.convertLocalToUTC(new Date(extendedMoment(thisDay).startOf(viewType as any).toString())),
      end: this.convertLocalToUTC(new Date(extendedMoment(thisDay).endOf(viewType as any).toString())),
      studentId: this.props.sessionInfo.student._id,
      tutorId: this.props.sessionInfo.tutor._id,
    });
  }

  handleViewChange = (viewType: string) => {
    this.props.loadSchedules({
      start: this.convertLocalToUTC(new Date(extendedMoment(this.state.startDayInCalendar).startOf(viewType as any).toString())),
      end: this.convertLocalToUTC(new Date(extendedMoment(this.state.startDayInCalendar).endOf(viewType as any).toString())),
      studentId: this.props.sessionInfo.student._id,
      tutorId: this.props.sessionInfo.tutor._id,
    });
  }

  createReschedule = (eventInfo: any) => {
    const newEventInfo = {
      ...eventInfo,
      start: this.outputDateInUserTimezone(eventInfo.start),
      end: this.outputDateInUserTimezone(new Date(eventInfo.start).getTime() + this.props.sessionInfo.course.hourPerSession * 60 * 60 * 1000),
    };

    if (this.checkOverlaps(newEventInfo)) {
      message.error(this.props.languageState.SESSION_DETAIL_PAGE_RESCHEDULE_VALIDATE_1.translated, 4);
    } else if (this.checkScheduleInThePast(newEventInfo)) {
      message.error(this.props.languageState.SESSION_DETAIL_PAGE_RESCHEDULE_VALIDATE_2.translated, 4);
    } else if (!this.checkScheduleWithin2Weeks(newEventInfo)) {
      message.error(this.props.languageState.SESSION_DETAIL_PAGE_RESCHEDULE_VALIDATE_3.translated, 4);
    } else {
      this.props.createReschedule({
        reschedule: {
          start: newEventInfo.start,
          end: newEventInfo.end,
          type: 'student',
          owner: this.props.sessionInfo.student._id,
          parent: this.props.sessionInfo.tutor._id,
        }
      });
    }
  }

  moveEvent = (moveInfo: any) => {
    const newEventInfo = {
      ...moveInfo,
      start: this.outputDateInUserTimezone(moveInfo.start),
      end: this.outputDateInUserTimezone(new Date(moveInfo.start).getTime() + this.props.sessionInfo.course.hourPerSession * 60 * 60 * 1000),
    };

    if (this.checkScheduleInThePast(newEventInfo)) {
      message.error(this.props.languageState.SESSION_DETAIL_PAGE_RESCHEDULE_VALIDATE_2.translated, 4);
    } else if (this.checkOverlaps(newEventInfo)) {
      message.error(this.props.languageState.SESSION_DETAIL_PAGE_RESCHEDULE_VALIDATE_4.translated, 4);
    } else if (!this.checkScheduleWithin2Weeks(newEventInfo)) {
      message.error(this.props.languageState.SESSION_DETAIL_PAGE_RESCHEDULE_VALIDATE_3.translated, 4);
    } else {
      this.props.createReschedule({
        reschedule: {
          start: newEventInfo.start,
          end: newEventInfo.end,
          type: 'student',
          owner: this.props.sessionInfo.student._id,
          parent: this.props.sessionInfo.tutor._id,
        }
      });
    }
  }

  saveReschedule = () => {
    try {
      const browserTimezone = - new Date().getTimezoneOffset() / 60;
      this.props.saveReschedule({
        newScheduleInfo: {
          start: this.convertLocalToUTC(new Date(this.props.reschedule.start)),
          end: this.convertLocalToUTC(new Date(this.props.reschedule.end)),
          oldStart: this.convertLocalToUTC(new Date(this.props.sessionInfo.start)),
          oldEnd: this.convertLocalToUTC(new Date(this.props.sessionInfo.end)),
          tutorId: this.props.sessionInfo.tutor._id,
          studentId: this.props.sessionInfo.student._id
        },
        newSessionInfo: {
          _id: this.props.sessionInfo._id,
          start: this.convertLocalToUTC(new Date(this.props.reschedule.start)),
          end: this.convertLocalToUTC(new Date(this.props.reschedule.end)),
        },
        tutor: this.props.sessionInfo.tutor.fullName,
        student: this.props.sessionInfo.student.fullName,
        timeZone: this.props.profileState.timeZone && this.props.profileState.timeZone.offset ? this.props.profileState.timeZone.offset : browserTimezone,
        role: this.props.profileState.roles[0],
      });

      // Send Email and SMS
      this.props.sendConfirmEmail({
        studentId: this.props.sessionInfo.student._id,
        tutorId: this.props.sessionInfo.tutor._id,
        tuitionId: this.props.sessionInfo.tuition._id,
        rescheduleInfo: {
          rescheduleBy: this.props.profileState.roles[0],
          oldStart: this.convertLocalToUTC(new Date(this.props.sessionInfo.start)),
          oldEnd: this.convertLocalToUTC(new Date(this.props.sessionInfo.end)),
          newStart: this.convertLocalToUTC(new Date(this.props.reschedule.start)),
          newEnd: this.convertLocalToUTC(new Date(this.props.reschedule.end)),
        },
      });
    } catch (error) {
      message.error(error.message);
    }
  }

  saveReportIssue = async () => {
    const reportInfo = {
      sessionId: this.props.sessionInfo._id,
      uploadBy: this.props.profileState._id,
      reportTutor: this.props.reportTutor,
      reportStudent: this.props.reportStudent,
      reasonReport: this.props.reasonReport,
      commentReport: this.props.commentReport
    }
    await fetch(`${config.nextjs.apiUrl}/sessions/updateReportIssues`, {
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'POST',
      credentials: 'include',
      body: JSON.stringify(reportInfo)
    });

    await this.props.closeModalRepportIssue();
  }
  saveRateSession = async () => {
    const rateSessionInfo = {
      sessionId: this.props.sessionInfo._id,
      uploadBy: this.props.profileState._id,
      rateSession: this.props.rateSession,
      commentSession: this.props.commentWithRate

    }
    await fetch(`${config.nextjs.apiUrl}/sessions/updateRateSession`, {
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'POST',
      credentials: 'include',
      body: JSON.stringify(rateSessionInfo)
    });


    await this.props.closeModalRateSession();
  }

  deleteUploadMaterial = async (material) => {
    this.props.deleteMaterial({
      sessionId: this.props.sessionId,
      materialId: material._id,
      fileName: material.fileName,
    });
  }

  render() {
    const columns = [
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
            <a href={`${config.nextjs.apiUrl}/sessions/downloadMaterials/${this.props.sessionInfo._id}/${record._id}`} style={{ display: 'inline-block', marginRight: '12px' }}>
              <Button type="primary" icon='download'>
                {this.props.languageState.SESSION_DETAIL_PAGE_DOWNLOAD.translated}
              </Button>
            </a>

            <Popconfirm title={this.props.languageState.SESSION_DETAIL_PAGE_DELETE_CONFIRM.translated} okText='Yes' cancelText='No' onConfirm={() => this.deleteUploadMaterial(record)}>
              <Button type="primary" icon='delete'>
                {this.props.languageState.SESSION_DETAIL_PAGE_DELETE.translated}
              </Button>
            </Popconfirm>
          </div>
        )
      }
    ];

    return (
      <UserLayout profileState={this.props.profileState} profileReducers={this.props.profileReducers} editProfilePageState={this.props.editProfilePageState} languageState={this.props.languageState}>
        {Object.keys(this.props.sessionInfo).length ?
          <Layout style={{ background: "white", padding: 40 }}>
            <div className="session-info">
              {this.props.sessionInfo.course.country === 'trial'
                ? <h1>{this.props.languageState.SESSION_DETAIL_PAGE_FREE_TRIAL_SESSION.translated} {this.props.sessionInfo.tutor.fullName}</h1>
                : <h1>{this.props.sessionInfo.course.country} - {this.props.sessionInfo.course.subject} - {this.props.sessionInfo.course.grade}{this.props.languageState.SESSION_DETAIL_PAGE_BY_TUTOR.translated} {this.props.sessionInfo.tutor.fullName}</h1>}
              {!this.props.sessionInfo.isCompleted
                ? <p>
                  {this.props.languageState.SESSION_DETAIL_PAGE_LESSON_START_AT.translated} <b>{extendedMoment(this.inputDateInUserTimezone(this.props.sessionInfo.start)).format('HH:mm')}</b><b>, </b><b>{extendedMoment(this.inputDateInUserTimezone(this.props.sessionInfo.end)).format(' DD MMM YYYY')}</b>
                  {this.props.languageState.SESSION_DETAIL_PAGE_LESSON_CLASS_APROXX.translated}
                </p>
                : <p>{this.props.languageState.SESSION_DETAIL_PAGE_LESSON_END_AT.translated} <b>{extendedMoment(this.inputDateInUserTimezone(this.props.sessionInfo.end)).format('HH:mm')}</b><b>, </b><b>{extendedMoment(this.inputDateInUserTimezone(this.props.sessionInfo.end)).format(' DD MMM YYYY')}</b></p>}
              <div className="buttons">
                {!this.props.sessionInfo.isCompleted
                  ? <Button
                    type="primary"
                    disabled={(this.inputDateInUserTimezone().getTime() >= this.inputDateInUserTimezone(this.props.sessionInfo.start).getTime() - 30 * 60 * 1000 && this.inputDateInUserTimezone().getTime() <= this.inputDateInUserTimezone(this.props.sessionInfo.end).getTime() + 30 * 60 * 1000) ? false : true}
                    style={(this.inputDateInUserTimezone().getTime() >= this.inputDateInUserTimezone(this.props.sessionInfo.start).getTime() - 30 * 60 * 1000 && this.inputDateInUserTimezone().getTime() <= this.inputDateInUserTimezone(this.props.sessionInfo.end).getTime() + 30 * 60 * 1000) ? { marginRight: '12px' } : {
                      marginRight: "12px",
                      background: "gray",
                      border: "#1a1a1a",
                      color: 'white'
                    }}
                    loading={this.state.isLoading}
                    onClick={this.startClass}
                  >
                    <span>{this.props.languageState.SESSION_DETAIL_PAGE_JOIN_CLASS.translated}</span>
                  </Button>
                  : <Button
                    style={{
                      color: 'white',
                      marginRight: "12px",
                      background: "#f4424e",
                      border: "1px solid #f4424e"
                    }}
                    onClick={this.props.openModalRepportIssue}
                  >{this.props.languageState.SESSION_DETAIL_PAGE_REPORT_ISSUES.translated}
                  </Button>}
                {!this.props.sessionInfo.isCompleted
                  ? <Button type="primary" onClick={this.loadSchedules} disabled={this.inputDateInUserTimezone(this.props.sessionInfo.start).getTime() < this.inputDateInUserTimezone().getTime()}>
                    {this.props.languageState.SESSION_DETAIL_PAGE_RESCHEDULE.translated}
                  </Button>
                  : <Button type="primary" onClick={this.props.openModalRateSession} >
                    {this.props.languageState.SESSION_DETAIL_PAGE_RATE_LESSON.translated}
                  </Button>}

              </div>
              <Modal
                title={this.props.languageState.SESSION_DETAIL_PAGE_REPORT_ISSUES.translated}
                visible={this.props.isOpenModalRepportIssue}
                onOk={this.saveReportIssue}
                onCancel={this.props.closeModalRepportIssue}
                okText={this.props.languageState.SESSION_DETAIL_PAGE_MODAL_REPORT_ISSUE_OK_TEXT.translated}
              >
                <p style={{ fontWeight: 'bold' }}>{this.props.languageState.SESSION_DETAIL_PAGE_ISSUE_RELATED.translated}:</p>
                <Checkbox
                  checked={this.props.profileState.roles[0] === 'tutor' ? this.props.reportStudent : this.props.reportTutor}
                  onChange={(e) => this.onChangeCheckBox(e.target.checked)}
                  style={{ marginBottom: 10 }}>{this.props.profileState.roles[0] === 'tutor' ? this.props.languageState.SESSION_DETAIL_PAGE_STUDENT.translated : this.props.languageState.SESSION_DETAIL_PAGE_TUTOR.translated}</Checkbox>
                <p style={{ fontWeight: 'bold' }}>{this.props.languageState.SESSION_DETAIL_PAGE_REASON.translated}:</p>
                <Checkbox.Group
                  value={this.props.reasonReport}
                  style={{ width: '100%', marginBottom: 10 }}
                  onChange={(checkedValue) => this.props.reportInfoChange({ reasonReport: checkedValue })}
                >
                  <Row><Checkbox value="late">{this.props.languageState.SESSION_DETAIL_PAGE_REASON_LATE.translated}</Checkbox></Row>
                  <Row><Checkbox value="absent">{this.props.languageState.SESSION_DETAIL_PAGE_REASON_ABSENT.translated}</Checkbox></Row>
                  <Row><Checkbox value="leftEarly">{this.props.languageState.SESSION_DETAIL_PAGE_REASON_LEFT_EARLY.translated}</Checkbox></Row>
                  <Row><Checkbox value="technicalDifficulty">{this.props.languageState.SESSION_DETAIL_PAGE_REASON_TECHNICAL_DIFFICULTY.translated}</Checkbox></Row>
                  <Row><Checkbox value="others">{this.props.languageState.SESSION_DETAIL_PAGE_REASON_OTHERS.translated}</Checkbox></Row>
                </Checkbox.Group>
                <p style={{ fontWeight: 'bold' }}>{this.props.languageState.SESSION_DETAIL_PAGE_REASON_COMMENT.translated}:</p>
                <TextArea
                  value={this.props.commentReport}
                  onChange={(e) => this.props.reportInfoChange({ commentReport: e.target.value })}
                  rows={6} />
              </Modal>
              <Modal
                title={this.props.languageState.SESSION_DETAIL_PAGE_RATE_LESSON.translated}
                visible={this.props.isOpenModalRateSession}
                onOk={this.saveRateSession}
                onCancel={this.props.closeModalRateSession}
                okText={this.props.languageState.SESSION_DETAIL_PAGE_RATING_MODAL_OK_TEXT.translated}
              >
                <p style={{ fontWeight: 'bold' }}>{this.props.languageState.SESSION_DETAIL_PAGE_RATING}:</p>
                <Rate
                  style={{ marginBottom: 20 }}
                  allowHalf={true}
                  onChange={(value) => this.props.updataRateSession(value)}
                />
                <p style={{ fontWeight: 'bold' }}>{this.props.languageState.SESSION_DETAIL_PAGE_RATING_COMMENT.translated}:</p>
                <TextArea
                  value={this.props.commentWithRate}
                  onChange={(e) => this.props.reportInfoChange({ commentWithRate: e.target.value })}
                  rows={6} />
              </Modal>
            </div>

            <div className="session-material" style={{ marginTop: "64px" }}>
              <Row gutter={24}>
                <Col span={12}>
                  <h1>{this.props.languageState.SESSION_DETAIL_PAGE_LESSON_MATERIALS.translated}</h1>
                </Col>
                <Col span={12} style={{ height: '56px', lineHeight: '56px', textAlign: 'right' }}>
                  <Button type="primary" icon='upload' onClick={this.props.openUploadMaterialModal}>
                    {this.props.languageState.SESSION_DETAIL_PAGE_UPLOAD_MATERIAL.translated}
                  </Button>
                </Col>
              </Row>
              <Table
                dataSource={this.props.materialsInfo}
                columns={columns}
                rowKey={(record) => record._id}
              />
            </div>

            <div className="session-material" style={{ marginTop: "64px" }}>
              <Row gutter={24}>
                <Col span={24}>
                  <h1>Recordings</h1>
                </Col>
              </Row>
              <div>
                {
                  this.props.recordings && this.props.recordings.length ? 
                  this.props.recordings.map((val: any, index: number) => {
                    return <p><a style={{fontSize: '18px'}} href={val}>Recording #{index + 1}</a></p>
                  }) : <p>This session has no recording or recordings are being processed.</p>
                }
                <p>Note: Link will be expired in 7 days from end time.</p>
              </div>
            </div>

            <Modal
              title={this.props.languageState.SESSION_DETAIL_PAGE_UPLOAD_MATERIAL.translated}
              visible={this.props.uploadMaterialModalVisible}
              onOk={this.handleUpload}
              onCancel={this.closeUploadMaterialModal}
              okText='Save'
            >
              <Spin spinning={this.props.isUploading} tip={`Uploading ${this.state.uploadPercent}% ...`}>
                <div className="uploadMaterrial">
                  <Upload.Dragger
                    beforeUpload={this.beforeUpload}
                    onRemove={this.onRemove}
                    fileList={this.state.fileList}
                  >
                    <p className="ant-upload-drag-icon">
                      <Icon type="inbox" />
                    </p>
                    <p className="ant-upload-text">{this.props.languageState.SESSION_DETAIL_PAGE_UPLOAD_TEXT.translated}</p>
                  </Upload.Dragger>
                </div>
                {this.props.errorMessage && (
                  <div style={{ color: '#f5222d', textAlign: 'center', marginTop: '24px' }}>
                    {this.props.errorMessage}
                  </div>
                )}
              </Spin>
            </Modal>

            <Modal
              title={this.props.languageState.SESSION_DETAIL_PAGE_RESCHEDULE_MODAL_TITLE.translated}
              visible={this.props.rescheduleModalVisible}
              onOk={this.saveReschedule}
              onCancel={this.props.closeRescheduleModal}
              okText='Save'
              width={920}
              destroyOnClose={true}
            >
              <Spin spinning={this.props.isBusy} tip={this.props.languageState.SESSION_DETAIL_PAGE_RESCHEDULE_MODAL_LOADING.translated}>
                <DragAndDropCalendar
                  views={['month', 'week']}
                  selectable={true}
                  defaultDate={this.inputDateInUserTimezone(this.props.sessionInfo.start ? this.props.sessionInfo.start : new Date())}
                  defaultView={Calendar.Views.WEEK}
                  events={[...this.props.tutorSchedules, this.props.reschedule].map((item) => ({ ...item, start: this.inputDateInUserTimezone(item.start), end: this.inputDateInUserTimezone(item.end) }))}
                  style={{ height: '65vh', padding: '20px 0px 20px 20px' }}
                  scrollToTime={new Date(1970, 1, 1, 6)}
                  onEventDrop={this.moveEvent}
                  popup={true}
                  onSelectSlot={this.createReschedule}
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
            </Modal>
          </Layout>
          : <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '600px', width: '100%' }}>
            <Spin size="large"></Spin>
          </div>}
      </UserLayout>
    );
  }
}

const mapState = (rootState: any) => {
  return {
    ...rootState.sessionDetailPageModel,
    profileState: rootState.profileModel,
    editProfilePageState: rootState.editProfilePageModel,
    languageState: rootState.languageModel,
  };
};

const mapDispatch = (rootReducer: any) => {
  return {
    ...rootReducer.sessionDetailPageModel,
    profileReducers: rootReducer.profileModel,
    editProfilePageReducers: rootReducer.editProfilePageModel,
  };
};

export default withRematch(initStore, mapState, mapDispatch)(SessionDetail);
