import * as React from "react";
import { Avatar, Layout, Row, Col, Button, Icon, Pagination, Spin, Tooltip } from "antd";
import Link from 'next/link';
import * as _ from 'lodash';
import withRematch from "../rematch/withRematch";
import initStore from "../rematch/store";
import { getTuitionsService } from "../service-proxies";
import UserLayout from "../layout/UserLayout";
import moment from 'moment';
import './my-tuition.css';
import Router from 'next/router';
import StudentTutorial from "../components/StudentTutorial";
import { getUsersService } from '../service-proxies';

class TuitionCompletedPage extends React.Component<any, any> {
  static async getInitialProps(props: any) {
    if (!props.req) {
      const myTuitionPageState = props.store.getState().myTuitionPageModel;
      const tuitionsService = getTuitionsService(props.store.getState().profileModel.token);

      let result: any;
      if (props.store.getState().profileModel.roles.indexOf('tutor') > -1) {
        result = await tuitionsService.findByTutorId(
          props.store.getState().profileModel._id,
          false,
          myTuitionPageState.pageNumber,
          myTuitionPageState.pageSize,
          myTuitionPageState.sortBy,
          myTuitionPageState.asc,
          false
        );

        props.store.dispatch.myTuitionPageModel.fetchDataSuccess({ result });
      } else if (props.store.getState().profileModel.roles.indexOf('student') > -1) {
        result = await tuitionsService.findByStudentId(
          props.store.getState().profileModel._id,
          false,
          myTuitionPageState.pageNumber,
          myTuitionPageState.pageSize,
          myTuitionPageState.sortBy,
          myTuitionPageState.asc,
          false
        );

        // console.log('result', result);

        props.store.dispatch.myTuitionPageModel.fetchDataSuccess({ result });
      }
    } else {
      props.store.dispatch.myTuitionPageModel.fetchDataSuccess({ result: props.query.tuitions });
    }
  }

  state = {
    isFirstTimeLoggedIn: this.props.profileState.firstTimeLoggedIn || false
  }

  endTutorial = async () => {
    this.setState({
      isFirstTimeLoggedIn: false
    });
    // call request here
    const usersService = getUsersService();
    await usersService.update({
      _id: this.props.profileState._id,
      firstTimeLoggedIn: false
    } as any)
    window.location.reload();
  }

  generateTuitionReferenceId = (tuition: any) => {
    const createdAt = moment(tuition.createdAt).format('HHmmSS');
    return tuition.courseForTutor ? tuition.courseForTutor.isGroup ?
      `${tuition.course.subject.slice(0, 2).toUpperCase()}${tuition.course.level.slice(0, 1).toUpperCase()}${String(tuition.course.grade).slice(0, 1).toUpperCase()}-${moment((tuition as any).createdAt).format('YYMMDD')}-${createdAt}-GROUP` :
      `${tuition.course.subject.slice(0, 2).toUpperCase()}${tuition.course.level.slice(0, 1).toUpperCase()}${String(tuition.course.grade).slice(0, 1).toUpperCase()}-${moment((tuition as any).createdAt).format('YYMMDD')}-${createdAt}`
      : "";
  }

  viewTypeChange = (e) => {
    this.props.viewTypeChange({
      newViewType: e.target.value
    });
    try {
      if (e.target.value === 'request-canceled') {
        this.props.fetchDataRequestCancel({
          isStudent: this.props.profileState.roles.indexOf('student') > -1 ? true : false,
          userId: this.props.profileState._id,
          pageNumber: this.props.pageNumber,
          pageSize: this.props.pageSize,
          sortBy: this.props.sortBy,
          asc: this.props.asc,
        });
      } else {
        this.props.fetchData({
          isStudent: this.props.profileState.roles.indexOf('student') > -1 ? true : false,
          userId: this.props.profileState._id,
          isFinished: e.target.value === 'current' ? false : true,
          pageNumber: this.props.pageNumber,
          pageSize: this.props.pageSize,
          sortBy: this.props.sortBy,
          asc: this.props.asc,
          isCanceled: false
        });
        if (this.props.profileState.roles.indexOf('student') > -1) {
          this.props.fetchDataCancelStudent({
            isStudent: this.props.profileState.roles.indexOf('student') > -1 ? true : false,
            userId: this.props.profileState._id,
            isFinished: false,
            pageNumber: this.props.pageNumber,
            pageSize: this.props.pageSize,
            sortBy: this.props.sortBy,
            asc: this.props.asc
          })
        } else {
          this.props.fetchDataCancelTutor({
            isStudent: this.props.profileState.roles.indexOf('student') > -1 ? true : false,
            userId: this.props.profileState._id,
            isFinished: false,
            pageNumber: this.props.pageNumber,
            pageSize: this.props.pageSize,
            sortBy: this.props.sortBy,
            asc: this.props.asc,
          })
        }
      }

      this.props.completedSpin(e.target.value);
    } catch (error) {
      console.log(error);
    }
  }

  paginationChange = (pageNumber, pageSize) => {
    this.props.handleFilterChange({
      pageNumber,
      pageSize,
    });
    this.props.fetchData({
      isStudent: this.props.profileState.roles.indexOf('student') > -1 ? true : false,
      userId: this.props.profileState._id,
      isFinished: this.props.viewType === 'current' ? false : true,
      pageNumber,
      pageSize,
      sortBy: this.props.sortBy,
      asc: this.props.asc,
      isCanceled: false
    });
  }

  extendTuitionClick = async (tuition) => {
    Router.push(`/login-student/informationTutor/${tuition.tutor._id}?extend=true&courseForTutor=${tuition.courseForTutor._id}&tuition=${tuition._id}`);
  }

  componentWillUnmount() {
    this.props.cleanState();
  }

  render() {
    return (
      !this.state.isFirstTimeLoggedIn && this.props.profileState.roles[0] === 'student' ?
        <UserLayout profileState={this.props.profileState} profileReducers={this.props.profileReducers} editProfilePageState={this.props.editProfilePageState} languageState={this.props.languageState}>
          <Layout style={{ background: "#fff", padding: "40px 30px 20px 30px" }}>
            <h1>{this.props.languageState.MY_TUITION_PAGE_TITLE.translated}</h1>

            <hr />

            <Row>
              <Spin spinning={this.props.isBusy}>
                <Button.Group>
                  <Button
                    value="current"
                    size='large'
                    type={this.props.viewType === 'current' ? 'primary' : 'default'}
                    style={{ minWidth: '180px', textAlign: 'center' }}
                    onClick={this.viewTypeChange}
                  >
                    {this.props.languageState.MY_TUITION_PAGE_CURRENT.translated}
                  </Button>
                  <Button
                    value="completed"
                    size='large'
                    type={this.props.viewType === 'completed' ? 'primary' : 'default'}
                    style={{ minWidth: '180px', textAlign: 'center' }}
                    onClick={this.viewTypeChange}
                  >
                    {this.props.languageState.MY_TUITION_PAGE_COMPLETED.translated}
                  </Button>
                  <Button
                    value="request-canceled"
                    size='large'
                    type={this.props.viewType === 'request-canceled' ? 'primary' : 'default'}
                    style={{ minWidth: '180px', textAlign: 'center' }}
                    onClick={this.viewTypeChange}
                  >
                    Request Cancel
                  </Button>
                </Button.Group>

                <hr />

                {this.props.data.length === 0 ? (
                  <div style={{ marginTop: '24px', textAlign: 'center', color: '#f5222d' }}>
                    {`${this.props.languageState.MY_TUITION_PAGE_NONE_TUITION.translated} ${_.startCase(this.props.viewType).toLowerCase()} ${this.props.languageState.MY_TUITION_PAGE_TUITION.translated}.`}
                  </div>
                ) : this.props.data.map((item, index) => (
                  <Row style={{ marginTop: "20px", paddingLeft: "20px" }} key={index}>
                    {item.courseForTutor && item.courseForTutor.isGroup ?
                      <Col span={4}>
                        <Avatar
                          size="large"
                          style={{ width: "100px", height: "100px" }}
                          src={'/static/group-tuition.png'}
                        />
                        <p>
                          <b>{this.props.profileState.roles.indexOf('tutor') >= 0 ? this.props.languageState.MY_TUITION_PAGE_GROUP_TUITION.translated : item.tutor.fullName}</b>
                        </p>
                      </Col> :
                      <Col span={4}>
                        <Avatar
                          size="large"
                          style={{ width: "100px", height: "100px" }}
                          src={(this.props.profileState.roles.indexOf('tutor') >= 0 ? item.student.imageUrl : item.tutor.imageUrl) || '/static/default.png'}
                          icon="user"
                        />
                        <p>
                          <b>{this.props.profileState.roles.indexOf('tutor') >= 0 ? item.student.fullName : item.tutor.fullName}</b>
                        </p>
                      </Col>
                    }
                    <Col xs={24} sm={24} md={16} lg={12} style={{ paddingTop: "10px" }}>
                      <div>
                        <b>
                          <span>
                            <Link href={item.courseForTutor && item.courseForTutor.isGroup ? `/calendar/group-tuition-detail/${item._id}` : `/calendar/tuition-detail/${item._id}`}>
                              {item.course.country === 'trial'
                                ? <a style={{ color: "#000" }}>
                                  <Icon type="book" /> {this.props.languageState.MY_TUITION_PAGE_FREE_TRIAL.translated}
                                </a>
                                : <a style={{ color: "#000" }}>
                                  <Icon type="book" /> {`${item.course.country}: ${item.course.grade} - ${item.course.subject}`}
                                </a>}
                            </Link>
                          </span>
                        </b>
                      </div>
                      {item.course.country === 'trial'
                        ? <div>
                          <div>
                            <Icon type="credit-card" /> {item.course.session} {this.props.languageState.MY_TUITION_PAGE_LESSON.translated}
                        </div>
                          <div>
                            <Icon type="solution" theme="outlined" /> {this.generateTuitionReferenceId(item)}
                          </div>
                        </div>

                        : <div>
                          <div>
                            <Icon type="credit-card" /> {`${item.course.level} - ${item.course.session} lessons`}
                          </div>
                          <div>
                            <Icon type="solution" theme="outlined" /> {this.generateTuitionReferenceId(item)}
                          </div>
                        </div>
                      }
                      <div>
                        <Icon type="clock-circle-o" /> {`${item.course.hourPerSession} ${item.course.hourPerSession <= 1 ? "hour" : "hours"} per lesson`}
                      </div>
                      {
                        item.courseForTutor && item.courseForTutor.isGroup ?
                          (
                            <div>
                              <Icon type="team" theme="outlined" style={{ marginRight: '5px' }} />
                              {Array.apply(null, { length: item.course.maxClassSize } as any).map((_val, index) => index < item.students.length ? 1 : 0).map((val) => {
                                return <img src={val ? '/static/user-black.png' : '/static/user-gray.png'} style={{ width: '16px', height: '16px', marginRight: '5px' }} />
                              })}
                              <span>{`(${item.students.length} of ${item.course.maxClassSize} slots taken)`}</span>
                            </div>
                          ) : <div></div>
                      }
                    </Col>
                    <Col xs={4} sm={4} md={4} lg={8} className='button-go-to-tuition'>
                      <div>
                        {(item.courseForTutor && item.courseForTutor.isGroup) || (item.course && item.course.subject === "trial") || (!item.isActive || item.isCompleted || item.isCanceled || item.isPendingReview) ?
                          <div /> :
                          this.props.profileState.roles.indexOf('student') > -1 && (
                            <Button onClick={(_e) => this.extendTuitionClick(item)} type="primary" className='button-extend-tuition' style={{ marginRight: '24px', backgroundColor: '#f5222d', border: '#f5222d' }}>
                              {this.props.languageState.MY_TUITION_PAGE_EXTEND.translated}
                          </Button>
                          )
                        }
                        <Link href={item.courseForTutor && item.courseForTutor.isGroup ? `/calendar/group-tuition-detail/${item._id}` : `/calendar/tuition-detail/${item._id}`}>
                          <Button className='button-go-to-tuition-detail' type="primary">
                            <a>{this.props.languageState.MY_TUITION_PAGE_GO_TO_TUITION.translated}</a>
                          </Button>
                        </Link>
                      </div>
                      {(item.courseForTutor && item.courseForTutor.isGroup) || (item.course && item.course.subject === "trial") || (!item.isActive || item.isCompleted || item.isCanceled || item.isPendingReview) ?
                        <div /> : this.props.profileState.roles.indexOf('student') > -1 && (
                          <div style={{ cursor: 'pointer', height: '48px', lineHeight: '48px' }}>
                            <Tooltip
                              placement='bottom'
                              trigger='click'
                              title={this.props.languageState.MY_TUITION_PAGE_TOOLTIP.translated}
                            >
                              <Icon type="question-circle" theme="outlined" /> {this.props.languageState.MY_TUITION_PAGE_MORE_INFO.translated}
                            </Tooltip>
                          </div>
                        )}
                    </Col>
                  </Row>
                ))}
                {this.props.isCompletedSpin === 'completed' && this.props.dataCancel[0] !== undefined
                  ? <div>
                    <hr />
                    <h2>{this.props.languageState.MY_TUITION_PAGE_CANCELED.translated}</h2>
                    {this.props.dataCancel.map((item, index) => {
                      if (item.isCanceled === true) {
                        return (
                          <Row style={{ marginTop: "20px", paddingLeft: "20px" }} key={index}>
                            {item.courseForTutor && item.courseForTutor.isGroup ?
                              <Col span={4}>
                                <Avatar
                                  size="large"
                                  style={{ width: "100px", height: "100px" }}
                                  src={'/static/group-tuition.png'}
                                />
                                <p>
                                  <b>{this.props.profileState.roles.indexOf('tutor') >= 0 ? "Group tuition" : item.tutor.fullName}</b>
                                </p>
                              </Col> :
                              <Col span={4}>
                                <Avatar
                                  size="large"
                                  style={{ width: "100px", height: "100px" }}
                                  src={(this.props.profileState.roles.indexOf('tutor') >= 0 ? item.student.imageUrl : item.tutor.imageUrl) || '/static/default.png'}
                                  icon="user"
                                />
                                <p>
                                  <b>{this.props.profileState.roles.indexOf('tutor') >= 0 ? item.student.fullName : item.tutor.fullName}</b>
                                </p>
                              </Col>
                            }
                            <Col span={12} style={{ paddingTop: "10px" }}>
                              <div>
                                <b>
                                  <span>
                                    <Link href={item.courseForTutor && item.courseForTutor.isGroup ? `/calendar/group-tuition-detail/${item._id}` : `/calendar/tuition-detail/${item._id}`}>
                                      {item.course.country === 'trial'
                                        ? <a style={{ color: "#000" }}>
                                          <Icon type="book" /> {`${item.course.country}`}
                                        </a>
                                        : <a style={{ color: "#000" }}>
                                          <Icon type="book" /> {`${item.course.country}: ${item.course.grade} - ${item.course.subject}`}
                                        </a>}
                                    </Link>
                                  </span>
                                </b>
                              </div>
                              <div>
                                <Icon type="credit-card" /> {`${item.course.level} - ${item.course.session} lessons.`}
                              </div>
                              <div>
                                <Icon type="clock-circle-o" /> {`${item.course.hourPerSession} ${item.course.hourPerSession <= 1 ? 'hour' : 'hours'} per lesson.`}
                              </div>
                              {
                                item.courseForTutor && item.courseForTutor.isGroup ?
                                  (
                                    <div>
                                      <Icon type="team" theme="outlined" style={{ marginRight: '5px' }} />
                                      {Array.apply(null, { length: item.course.maxClassSize } as any).map((_val, index) => index < item.students.length ? 1 : 0).map((val) => {
                                        // return <Icon type="bulb" theme="filled" style={{color : val ? '#e2be0b' : 'gray', marginRight: '3px'}}/>
                                        return <img src={val ? '/static/user-black.png' : '/static/user-gray.png'} style={{ width: '16px', height: '16px', marginRight: '5px' }} />
                                      })}
                                      <span>{`(${item.students.length} of ${item.course.maxClassSize} slots taken)`}</span>
                                    </div>
                                  ) : <div></div>
                              }
                            </Col>
                            <Col span={8} style={{ textAlign: 'right' }}>
                              {item.courseForTutor && item.courseForTutor.isGroup ?
                                <div></div> :
                                this.props.profileState.roles.indexOf('student') > -1 && (
                                  <Button onClick={(_e) => this.extendTuitionClick(item)} type="primary" style={{ marginRight: '24px', backgroundColor: '#f5222d', border: '#f5222d' }}>
                                    {this.props.languageState.MY_TUITION_PAGE_EXTEND.translated}
                                  </Button>
                                )
                              }
                              <Link href={item.courseForTutor && item.courseForTutor.isGroup ? `/calendar/group-tuition-detail/${item._id}` : `/calendar/tuition-detail/${item._id}`}>
                                <Button type="primary">
                                  <a>{this.props.languageState.MY_TUITION_PAGE_GO_TO_TUITION.translated}</a>
                                </Button>
                              </Link>
                            </Col>
                          </Row>
                        )
                      }
                    })}
                  </div>
                  : <div></div>
                }
              </Spin>
            </Row>

            <Row>
              <Col span={24} style={{ textAlign: 'right', marginTop: 10 }}>
                <Pagination
                  showSizeChanger={true}
                  pageSizeOptions={['5', '10', '20']}
                  current={this.props.pageNumber}
                  pageSize={this.props.pageSize}
                  onShowSizeChange={this.paginationChange}
                  onChange={this.paginationChange}
                  total={this.props.total}
                />
              </Col>
            </Row>
          </Layout>
        </UserLayout> : <StudentTutorial profileState={this.props.profileState} dataLookupState={this.props.dataLookupState} endTutorial={this.endTutorial} coursesLookup={this.props.coursesLookup} languageState={this.props.languageState}></StudentTutorial>
    );
  }
}

const mapState = (rootState: any) => {
  return {
    ...rootState.myTuitionPageModel,
    profileState: rootState.profileModel,
    dataLookupState: rootState.dataLookupModel,
    editProfilePageState: rootState.editProfilePageModel,
    languageState: rootState.languageModel,
  };
};

const mapDispatch = (rootReducer: any) => {
  return {
    ...rootReducer.myTuitionPageModel,
    profileReducers: rootReducer.profileModel,
    editProfilePageReducers: rootReducer.editProfilePageModel,
  };
};

export default withRematch(initStore, mapState, mapDispatch)(
  TuitionCompletedPage
);
