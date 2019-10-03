import * as React from "react";
import { Layout, Button, Table, Upload, Row, Col, Modal, Icon, message, Spin, Checkbox, Input, Rate } from "antd";
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
import './calendar.css';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import 'react-big-calendar/lib/addons/dragAndDrop/styles.css';

const TextArea = Input.TextArea;
Calendar.setLocalizer(Calendar.momentLocalizer(moment));
const extendedMoment = extendMoment(moment);

class GroupSessionDetail extends React.Component<any, any> {
  state = {
    fileList: [],
    isLoading: false
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

    const thisSession = {
      backgroundColor: '#f9ca24',
      borderRadius: '5px',
      opacity: 1,
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
          style: tutorAvailbleSchedule
        };
      } else if (event.type === 'student' && event.owner === this.props.profileState._id && event._id && new Date(event.start).getTime() === new Date(this.props.sessionInfo.start).getTime()) {
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
      } else if (item.size > 50 * 1024 * 1024) {
        allowedUpload = false;
        break;
      }
    }

    if (fileList.length === 0) {
      this.props.errorHappen({ errorMessage: this.props.languageState.CALENDAR_GROUP_SESSION_DETAIL_PAGE_UPLOAD_TEXT.translated });
    } else if (!allowedUpload) {
      this.props.errorHappen({ errorMessage: this.props.languageState.CALENDAR_GROUP_SESSION_DETAIL_PAGE_UPLOAD_VALIDATION.translated });
    } else {
      this.props.startUploading();

      const formData = new FormData();
      formData.append('sessionId', this.props.sessionInfo._id);
      formData.append('uploadBy', this.props.profileState.roles[0]);
      fileList.forEach((file) => {
        formData.append('materials', file);
      });

      const result = await fetch(`${config.nextjs.apiUrl}/sessions/uploadMaterials`, {
        method: 'POST',
        body: formData
      }).then((res) => res.json());

      this.props.uploadMaterialsSuccess(result);
      await this.setState({
        fileList: [],
      });
    }
  }

  startClass = async () => {
    this.setState({ isLoading: true });

    await this.props.generateUrl({
      _id: this.props.sessionInfo._id,
      name: (this.props.profileState.fullName ? this.props.profileState.fullName : (this.props.profileState.firstName || "" + " " + this.props.profileState.lastName)),
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
      message.error(this.props.languageState.CALENDAR_GROUP_SESSION_DETAIL_PAGE_MISSING_URL_VALIDATION.translated);
      return false;
    }
  }

  loadTutorSchedules = (_e) => {
    this.props.loadTutorSchedules({
      start: this.convertLocalToUTC(new Date(extendedMoment().startOf('week').toString())),
      end: this.convertLocalToUTC(new Date(extendedMoment().endOf('week').toString())),
      tutorId: this.props.sessionInfo.tutor._id
    });
  }

  navigate = (thisDay: any, viewType: string, _navigateType: string) => {
    this.props.loadTutorSchedules({
      start: this.convertLocalToUTC(new Date(extendedMoment(thisDay).startOf(viewType as any).toString())),
      end: this.convertLocalToUTC(new Date(extendedMoment(thisDay).endOf(viewType as any).toString())),
      tutorId: this.props.sessionInfo.tutor._id
    });
  }

  handleViewChange = (viewType: string) => {
    this.props.loadTutorSchedules({
      start: this.convertLocalToUTC(new Date(extendedMoment().startOf(viewType as any).toString())),
      end: this.convertLocalToUTC(new Date(extendedMoment().endOf(viewType as any).toString())),
      tutorId: this.props.sessionInfo.tutor._id
    });
  }

  createReschedule = (eventInfo: any) => {
    const newEventInfo = {
      ...eventInfo,
      start: this.outputDateInUserTimezone(eventInfo.start),
      end: this.outputDateInUserTimezone(new Date(eventInfo.start).getTime() + this.props.sessionInfo.groupTuition.course.hourPerSession * 60 * 60 * 1000),
    };

    if (this.checkOverlaps(newEventInfo)) {
      message.error(this.props.languageState.CALENDAR_GROUP_SESSION_DETAIL_PAGE_CREATE_EVENT_VALIDATION.translated, 4);
    } else if (this.checkScheduleInThePast(newEventInfo)) {
      message.error(this.props.languageState.CALENDAR_GROUP_SESSION_DETAIL_PAGE_RE_SCHEDULE_VALIDATION_1.translated, 4);
    } else if (!this.checkScheduleWithin2Weeks(newEventInfo)) {
      message.error(this.props.languageState.CALENDAR_GROUP_SESSION_DETAIL_PAGE_RE_SCHEDULE_VALIDATION_2.translated, 4);
    } else {
      this.props.createReschedule({
        reschedule: {
          start: newEventInfo.start,
          end: newEventInfo.end,
          type: 'student',
          owner: this.props.sessionInfo.student,
          parent: this.props.sessionInfo.tutor._id,
        }
      });
    }
  }

  moveEvent = (moveInfo: any) => {
    const newEventInfo = {
      ...moveInfo,
      start: this.outputDateInUserTimezone(moveInfo.start),
      end: this.outputDateInUserTimezone(new Date(moveInfo.start).getTime() + this.props.sessionInfo.groupTuition.course.hourPerSession * 60 * 60 * 1000),
    };

    if (this.checkScheduleInThePast(newEventInfo)) {
      message.error(this.props.languageState.CALENDAR_GROUP_SESSION_DETAIL_PAGE_RE_SCHEDULE_VALIDATION_1.translated, 4);
    } else if (this.checkOverlaps(newEventInfo)) {
      message.error(this.props.languageState.CALENDAR_GROUP_SESSION_DETAIL_PAGE_MOVE_EVENT_VALIDATION.translated, 4);
    } else if (!this.checkScheduleWithin2Weeks(newEventInfo)) {
      message.error(this.props.languageState.CALENDAR_GROUP_SESSION_DETAIL_PAGE_RE_SCHEDULE_VALIDATION_2.translated, 4);
    } else {
      this.props.createReschedule({
        reschedule: {
          start: newEventInfo.start,
          end: newEventInfo.end,
          type: 'student',
          owner: this.props.sessionInfo.student,
          parent: this.props.sessionInfo.tutor._id,
        }
      });
    }
  }

  saveReschedule = () => {
    this.props.saveReschedule({
      newScheduleInfo: {
        start: this.convertLocalToUTC(new Date(this.props.reschedule.start)),
        end: this.convertLocalToUTC(new Date(this.props.reschedule.end)),
        oldStart: this.convertLocalToUTC(new Date(this.props.sessionInfo.start)),
        oldEnd: this.convertLocalToUTC(new Date(this.props.sessionInfo.end)),
        tutorId: this.props.sessionInfo.tutor._id,
        studentId: this.props.sessionInfo.student
      },
      newSessionInfo: {
        _id: this.props.sessionInfo._id,
        start: this.convertLocalToUTC(new Date(this.props.reschedule.start)),
        end: this.convertLocalToUTC(new Date(this.props.reschedule.end)),
      },
    });

    // Send Email and SMS
    this.props.sendConfirmEmail({
      studentId: this.props.sessionInfo.student,
      tutorId: this.props.sessionInfo.tutor._id,
      rescheduleInfo: {
        oldStart: this.convertLocalToUTC(new Date(this.props.sessionInfo.start)),
        oldEnd: this.convertLocalToUTC(new Date(this.props.sessionInfo.end)),
        newStart: this.convertLocalToUTC(new Date(this.props.reschedule.start)),
        newEnd: this.convertLocalToUTC(new Date(this.props.reschedule.end)),
      },
    });
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

  onChangeCheckBox = (checked) => {
    if (this.props.profileState.roles[0] === 'tutor') {
      this.props.reportInfoChange({ reportStudent: checked })
    } else {
      this.props.reportInfoChange({ reportTutor: checked })
    }
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

  render() {
    const columns = [
      {
        title: this.props.languageState.CALENDAR_GROUP_SESSION_DETAIL_PAGE_UPLOAD_BY.translated,
        dataIndex: "uploadBy",
        key: "uploadBy"
      },
      {
        title: this.props.languageState.CALENDAR_GROUP_SESSION_DETAIL_PAGE_FILE_NAME.translated,
        dataIndex: "fileName",
        key: "fileName"
      },
      {
        title: this.props.languageState.CALENDAR_GROUP_SESSION_DETAIL_PAGE_UPLOAD_DATE.translated,
        dataIndex: "uploadDate",
        key: "uploadDate",
        render: (_text, record, _index) => extendedMoment(record.uploadDate).format('DD MMM YYYY'),
      },
      {
        title: this.props.languageState.CALENDAR_GROUP_SESSION_DETAIL_PAGE_ACTIONS.translated,
        dataIndex: 'actions',
        key: "actions",
        render: (_text, record, _index) => (
          <a href={`${config.nextjs.apiUrl}/sessions/downloadMaterials/${this.props.sessionInfo._id}/${record._id}`}>
            <Button type="primary" icon='download'>
              {this.props.languageState.CALENDAR_GROUP_SESSION_DETAIL_PAGE_DOWNLOAD_BUTTON.translated}
            </Button>
          </a>
        )
      }
    ];

    return (
      <UserLayout profileState={this.props.profileState} profileReducers={this.props.profileReducers} editProfilePageState={this.props.editProfilePageState} languageState={this.props.languageState}>
        {Object.keys(this.props.sessionInfo).length ?
          <Layout style={{ background: "white", padding: 40 }}>
            <div className="session-info">
              <h1>{this.props.sessionInfo.groupTuition.course.country} - {this.props.sessionInfo.groupTuition.course.subject} - {this.props.sessionInfo.groupTuition.course.grade} By Tutor: {this.props.sessionInfo.tutor.fullName}</h1>
              <p>
              {this.props.languageState.CALENDAR_GROUP_SESSION_DETAIL_PAGE_LESSON_START.translated} <b>{extendedMoment(this.inputDateInUserTimezone(this.props.sessionInfo.start)).format('DD MMM YYYY - HH:mm')}</b>. {this.props.languageState.CALENDAR_GROUP_SESSION_DETAIL_PAGE_LESSON_START_REMINDER.translated}
              </p>
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
                    <span>{this.props.languageState.CALENDAR_GROUP_SESSION_DETAIL_PAGE_JOIN_CLASS.translated}</span>
                  </Button>
                  : <Button
                    style={{
                      color: 'white',
                      marginRight: "12px",
                      background: "#f4424e",
                      border: "1px solid #f4424e"
                    }}
                    onClick={this.props.openModalRepportIssue}
                  >{this.props.languageState.CALENDAR_GROUP_SESSION_DETAIL_PAGE_REPORT_ISSUES.translated}
                  </Button>}
                {!this.props.sessionInfo.isCompleted
                  ? <div></div>
                  : <Button type="primary" onClick={this.props.openModalRateSession} >
                    {this.props.languageState.CALENDAR_GROUP_SESSION_DETAIL_PAGE_RATE_LESSON.translated}
                    </Button>}
              </div>
              <Modal
                title={this.props.languageState.CALENDAR_GROUP_SESSION_DETAIL_PAGE_REPORT_ISSUES.translated}
                visible={this.props.isOpenModalRepportIssue}
                onOk={this.saveReportIssue}
                onCancel={this.props.closeModalRepportIssue}
                okText='Report'
              >
                <p style={{ fontWeight: 'bold' }}>{this.props.languageState.CALENDAR_GROUP_SESSION_DETAIL_PAGE_ISSUE_RELATED_TO.translated}</p>
                <Checkbox
                  checked={this.props.profileState.roles[0] === 'tutor' ? this.props.reportStudent : this.props.reportTutor}
                  onChange={(e) => this.onChangeCheckBox(e.target.checked)}
                  style={{ marginBottom: 10 }}>{this.props.profileState.roles[0] === 'tutor' ? this.props.languageState.CALENDAR_GROUP_SESSION_DETAIL_PAGE_STUDENT.translated : this.props.languageState.CALENDAR_GROUP_SESSION_DETAIL_PAGE_TUTOR.translated}</Checkbox>
                <p style={{ fontWeight: 'bold' }}>{this.props.languageState.CALENDAR_GROUP_SESSION_DETAIL_PAGE_REASON.translated}:</p>
                <Checkbox.Group
                  value={this.props.reasonReport}
                  style={{ width: '100%', marginBottom: 10 }}
                  onChange={(checkedValue) => this.props.reportInfoChange({ reasonReport: checkedValue })}
                >
                  <Row><Checkbox value="late">{this.props.languageState.CALENDAR_GROUP_SESSION_DETAIL_PAGE_LATE.translated}</Checkbox></Row>
                  <Row><Checkbox value="absent">{this.props.languageState.CALENDAR_GROUP_SESSION_DETAIL_PAGE_ABSENT.translated}</Checkbox></Row>
                  <Row><Checkbox value="leftEarly">{this.props.languageState.CALENDAR_GROUP_SESSION_DETAIL_PAGE_LEFT_EARLY.translated}</Checkbox></Row>
                  <Row><Checkbox value="technicalDifficulty">{this.props.languageState.CALENDAR_GROUP_SESSION_DETAIL_PAGE_TECHNICAL_DIFFICULTY.translated}</Checkbox></Row>
                  <Row><Checkbox value="others">{this.props.languageState.CALENDAR_GROUP_SESSION_DETAIL_PAGE_OTHERS.translated}</Checkbox></Row>
                </Checkbox.Group>
                <p style={{ fontWeight: 'bold' }}>{this.props.languageState.CALENDAR_GROUP_SESSION_DETAIL_PAGE_COMMENT.translated}:</p>
                <TextArea
                  value={this.props.commentReport}
                  onChange={(e) => this.props.reportInfoChange({ commentReport: e.target.value })}
                  rows={6} />
              </Modal>
              <Modal
                title={this.props.languageState.CALENDAR_GROUP_SESSION_DETAIL_PAGE_RATE_LESSON.translated}
                visible={this.props.isOpenModalRateSession}
                onOk={this.saveRateSession}
                onCancel={this.props.closeModalRateSession}
                okText='Rate'
              >
                <p style={{ fontWeight: 'bold' }}>{this.props.languageState.CALENDAR_GROUP_SESSION_DETAIL_PAGE_RATING.translated}:</p>
                <Rate
                  style={{ marginBottom: 20 }}
                  allowHalf={true}
                  onChange={(value) => this.props.updataRateSession(value)}
                />
                <p style={{ fontWeight: 'bold' }}>{this.props.languageState.CALENDAR_GROUP_SESSION_DETAIL_PAGE_COMMENT.translated}:</p>
                <TextArea
                  value={this.props.commentWithRate}
                  onChange={(e) => this.props.reportInfoChange({ commentWithRate: e.target.value })}
                  rows={6} />
              </Modal>
            </div>

            <div className="session-material" style={{ marginTop: "64px" }}>
              <Row gutter={24}>
                <Col span={12}>
                  <h1>{this.props.languageState.CALENDAR_GROUP_SESSION_DETAIL_PAGE_LESSON_MATERIALS.translated}</h1>
                </Col>
                <Col span={12} style={{ height: '56px', lineHeight: '56px', textAlign: 'right' }}>
                  <Button type="primary" icon='upload' onClick={this.props.openUploadMaterialModal}>
                    {this.props.languageState.CALENDAR_GROUP_SESSION_DETAIL_PAGE_UPLOAD_MATERIAL.translated}
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
              title={this.props.languageState.CALENDAR_GROUP_SESSION_DETAIL_PAGE_UPLOAD_MATERIAL.translated}
              visible={this.props.uploadMaterialModalVisible}
              onOk={this.handleUpload}
              onCancel={this.closeUploadMaterialModal}
              okText='Save'
            >
              <Spin spinning={this.props.isUploading} tip='Uploading ...'>
                <div className="uploadMaterrial">
                  <Upload.Dragger
                    beforeUpload={this.beforeUpload}
                    onRemove={this.onRemove}
                    fileList={this.state.fileList}
                  >
                    <p className="ant-upload-drag-icon">
                      <Icon type="inbox" />
                    </p>
                    <p className="ant-upload-text">{this.props.languageState.CALENDAR_GROUP_SESSION_DETAIL_PAGE_UPLOAD_MATERIAL_TEXT.translated}</p>
                  </Upload.Dragger>
                </div>
                {this.props.errorMessage && (
                  <div style={{ color: '#f5222d', textAlign: 'center', marginTop: '24px' }}>
                    {this.props.errorMessage}
                  </div>
                )}
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

export default withRematch(initStore, mapState, mapDispatch)(GroupSessionDetail);
