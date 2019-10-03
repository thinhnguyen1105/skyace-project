import { Layout, Row, Col, List, Icon, Avatar } from 'antd';
import React from 'react';
import moment from 'moment';
import './dashboard.css';
import AppLayout from '../../layout/AdminLayout';
import withRematch from '../../rematch/withRematch';
import initStore from '../../rematch/store';
import { getDashboardService } from '../../service-proxies';

const Content = Layout.Content;
class Dashboard extends React.Component<any, any> {
  state = {
    onHoldTuitions : [],
    reportIssuesTuitions : [1, 2],
    cancelledTuitions : [1]
  };

  static async getInitialProps(props: any) {
    const dashboardService = getDashboardService();
    try {
      const dashboardInfo = await dashboardService.getDashboardData(props.query.tenant);
      props.store.dispatch.dashboardModel.fetchDashboardDataSuccess({
        newTutor : dashboardInfo.tutor || 0,
        newStudent: dashboardInfo.student || 0,
        newTransaction : dashboardInfo.transaction || 0,
        upcomingTuitions: dashboardInfo.upcomingTuitions || [],
        canceledTuitions: dashboardInfo.canceledTuitions || [],
        reportIssuesTuitions: dashboardInfo.reportIssuesTuitions || []
      });
    } catch (err) {
      console.log(err.message || 'Error fetching data.');
    }
  }

  generateTuitionReferenceId = (tuition: any) => {
    const createdAt = moment(tuition.createdAt).format('HHmmSS');
    return tuition.courseForTutor ? tuition.courseForTutor.isGroup ?
      `${tuition.course.subject.slice(0, 2).toUpperCase()}${tuition.course.level.slice(0, 1).toUpperCase()}${String(tuition.course.grade).slice(0, 1).toUpperCase()}-${moment((tuition as any).createdAt).format('YYMMDD')}-${createdAt}-GROUP` :
      `${tuition.course.subject.slice(0, 2).toUpperCase()}${tuition.course.level.slice(0, 1).toUpperCase()}${String(tuition.course.grade).slice(0, 1).toUpperCase()}-${moment((tuition as any).createdAt).format('YYMMDD')}-${createdAt}`
      : "";
  }

  render() {
    return (
      <AppLayout profileState={this.props.profileState} profileReducers={this.props.profileReducers} languageState={this.props.languageState}>
        <Layout style={{margin: '30px', background: 'white'}}>
          <Row className='margin-bottom-large'>
            <Content style={{ fontWeight: "bold", fontSize: 20, marginBottom: 20 }}>
              {this.props.languageState.WHITE_LABEL_DASHBOARD_PAGE_DASHBOARD.translated}
            </Content>
            <hr />
          </Row>
          <Row className='admin-dashboard__body-container' gutter={{md : 30, xs : 10}}>
            <Col xs={12} md={6} className='admin-dashboard__body-container__col'>
              <div className='admin-dashboard__body-container__info-button' style={{backgroundColor: '#6bc78c', color: '#5FA477'}}>
                <h3>{this.props.languageState.WHITE_LABEL_DASHBOARD_PAGE_NEW_STUDENTS.translated}</h3>
                <span>{this.props.newStudent || 0}</span>
              </div>
            </Col>

            <Col xs={12} md={6} className='admin-dashboard__body-container__col'>
              <div className='admin-dashboard__body-container__info-button' style={{backgroundColor: '#4D525D', color: '#484D56'}}>
              <h3>{this.props.languageState.WHITE_LABEL_DASHBOARD_PAGE_NEW_TUTORS.translated}</h3>
                <span>{this.props.newTutor || 0}</span>
              </div>
            </Col>

            <Col xs={12} md={6} className='admin-dashboard__body-container__col'>
              <div className='admin-dashboard__body-container__info-button' style={{backgroundColor: '#D2777F', color: '#BF6B74'}}>
                <h3>{this.props.languageState.WHITE_LABEL_DASHBOARD_PAGE_TRANSACTION.translated}</h3>
                <span>{this.props.newTransaction || 0}</span>
              </div>
            </Col>

            <Col xs={12} md={6} className='admin-dashboard__body-container__col'>
              <div className='admin-dashboard__body-container__info-button' style={{backgroundColor: '#AEB6B5', color: '#9CA3A2'}}>
                <h3>{this.props.languageState.WHITE_LABEL_DASHBOARD_PAGE_PENDING_PAYMENT.translated}</h3>
                <span>N/A</span>
              </div>
            </Col>
          </Row>

          <Row className='admin-dashboard__info-container' gutter={{md : 30, xs : 10}}>
            <Col xs={24} md={12} className='custom-separated-top'>
              <List
                header={(<div className='admin-dashboard__info-container__list-header'>
                  <div className='custom-vertical-center custom-flex-1'>
                    <Icon type='clock-circle' className='admin-dashboard__info-container__list-header__icon'/>
                    <h3>{this.props.languageState.WHITE_LABEL_DASHBOARD_PAGE_ON_HOLD.translated}</h3>
                  </div>
                </div>)}
                itemLayout='horizontal'
                bordered
                locale={{emptyText: this.props.languageState.WHITE_LABEL_DASHBOARD_PAGE_ON_HOLD_EMPTY.translated}}
                dataSource={this.state.onHoldTuitions}
                renderItem={item => (
                  <List.Item>
                    <List.Item.Meta
                      avatar={<Avatar src='https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png' />}
                      title={<a href='https://ant.design'>{item.title}</a>}
                      description='Ant Design, a design language for background applications, is refined by Ant UED Team'
                    />
                  </List.Item>
                )}
              />
            </Col>

            <Col xs={24} md={12} className='custom-separated-top'>
              <List
                header={(<div className='admin-dashboard__info-container__list-header'>
                  <div className='custom-vertical-center custom-flex-1'>
                    <Icon type='clock-circle' className='admin-dashboard__info-container__list-header__icon'/>
                    <h3>{this.props.languageState.WHITE_LABEL_DASHBOARD_PAGE_REPORT_ISSUES.translated}</h3>
                  </div>
                </div>)}
                itemLayout='horizontal'
                bordered
                locale={{emptyText: this.props.languageState.WHITE_LABEL_DASHBOARD_PAGE_REPORT_ISSUES_EMPTY.translated}}
                dataSource={this.props.reportIssuesTuitions}
                pagination={{
                  showSizeChanger: false,
                  pageSize: 5,
                  onChange: (page) => {
                    console.log(page);
                  },
                }}
                renderItem={item => (
                  <Row gutter={{md : 20, xs : 10}} className='admin-dashboard__info-container__row-list'>
                    <Col xs={4} className='custom-vertical-center custom-horizontal-center'>
                    <p>{item.reportedSession && item.reportedSession.length ? item.reportedSession[0].data ? moment(item.reportedSession[0].data.uploadDate).format('DD MMM') : "" : ""}</p>
                    </Col>
                    <Col xs={16} className='custom-vertical-center'>
                      <div>
                        <p><b>{this.generateTuitionReferenceId(item)}</b></p>
                        <p>{item.reportedSession && item.reportedSession.length ? item.reportedSession[0].data ? this.props.languageState.WHITE_LABEL_DASHBOARD_PAGE_REPORT_BY.translated + " " + ( item.reportedSession[0].data.uploadBy ? item.reportedSession[0].data.uploadBy.fullName : "") : "" : ""}</p>
                        <p>{item.reportedSession && item.reportedSession.length ? item.reportedSession[0].data ? item.reportedSession[0].data.commentReport : "" : ""}</p>
                      </div>
                    </Col>
                    <Col xs={4} className='custom-vertical-center admin-dashboard__info-container__row-list__img-container'>
                      <img src={item.reportedSession && item.reportedSession.length ? item.reportedSession[0].data ? item.reportedSession[0].data.uploadBy.imageUrl || "/static/default.png" : "/static/default.png" : "/static/default.png"} alt='avatar'></img>
                    </Col>
                  </Row>
                )}
              />
            </Col>
          </Row>

          <Row className='admin-dashboard__info-container' gutter={{md : 30, xs : 10}}>
            <Col xs={24} md={12} className='custom-separated-top'>
              <List
                header={(<div className='admin-dashboard__info-container__list-header'>
                  <div className='custom-vertical-center custom-flex-1'>
                    <Icon type='clock-circle' className='admin-dashboard__info-container__list-header__icon'/>
                    <h3>{this.props.languageState.WHITE_LABEL_DASHBOARD_PAGE_UPCOMING_TUITIONS.translated}</h3>
                  </div>
                </div>)}
                itemLayout='horizontal'
                bordered
                locale={{emptyText: this.props.languageState.WHITE_LABEL_DASHBOARD_PAGE_UPCOMING_EMPTY.translated}}
                dataSource={[...this.props.upcomingTuitions, ...this.props.upcomingTuitions, ...this.props.upcomingTuitions]}
                pagination={{
                  showSizeChanger: false,
                  pageSize: 5,
                  onChange: (page) => {
                    console.log(page);
                  },
                }}
                renderItem={(item) => (
                  <Row gutter={{md : 20, xs : 10}} className='admin-dashboard__info-container__row-list'>
                    <Col xs={4} className='custom-vertical-center custom-horizontal-center'>
                      <p>{item.upcomingSessions && item.upcomingSessions.length ? moment(item.upcomingSessions[0].start).format('DD MMM') : ""}</p>
                    </Col>
                    <Col xs={12} className='custom-vertical-center'>
                      <div>
                        <p><b>{this.generateTuitionReferenceId(item)}</b></p>
                        <p>{this.props.languageState.WHITE_LABEL_DASHBOARD_PAGE_NEXT_LESSON_AT.translated} {moment(item.upcomingSessions[0].start).format('DD MMM - HH:mm')}</p>
                      </div>
                    </Col>
                    <Col xs={4} className='custom-vertical-center admin-dashboard__info-container__row-list__img-container'>
                      <img src={item.tutor.imageUrl ? item.tutor.imageUrl : '/static/default.png'} alt='avatar'></img>
                    </Col>
                    <Col xs={4} className='custom-vertical-center admin-dashboard__info-container__row-list__img-container'>
                      <img src={item.courseForTutor && item.courseForTutor.isGroup ? '/static/group-tuition.png' : item.student.imageUrl ? item.student.imageUrl : '/static/default.png'} alt='avatar'></img>
                    </Col>
                  </Row>
                )}
              />
            </Col>

            <Col xs={24} md={12} className='custom-separated-top'>
              <List
                header={(<div className='admin-dashboard__info-container__list-header'>
                  <div className='custom-vertical-center custom-flex-1'>
                    <Icon type='clock-circle' className='admin-dashboard__info-container__list-header__icon'/>
                    <h3>{this.props.languageState.WHITE_LABEL_DASHBOARD_PAGE_CANCELED.translated}</h3>
                  </div>
                </div>)}
                itemLayout='horizontal'
                bordered
                locale={{emptyText: this.props.languageState.WHITE_LABEL_DASHBOARD_PAGE_CANCELED_EMPTY.translated}}
                dataSource={this.props.canceledTuitions}
                pagination={{
                  showSizeChanger: false,
                  pageSize: 5,
                  onChange: (page) => {
                    console.log(page);
                  },
                }}
                renderItem={item => (
                  <Row gutter={{md : 20, xs : 10}} className='admin-dashboard__info-container__row-list'>
                    <Col xs={4} className='custom-vertical-center custom-horizontal-center'>
                    <p>{item.cancelAt ? moment(item.cancelAt).format('DD MMM') : ""}</p>
                    </Col>
                    <Col xs={16} className='custom-vertical-center'>
                      <div>
                      <p><b>{this.generateTuitionReferenceId(item)}</b></p>
                        <p>{this.props.languageState.WHITE_LABEL_DASHBOARD_PAGE_CANCELED_BY.translated} {item.cancelBy ? item.cancelBy.fullName : ''}</p>
                      </div>
                    </Col>
                    <Col xs={4} className='custom-vertical-center admin-dashboard__info-container__row-list__img-container'>
                      <img src={item.cancelBy && item.cancelBy.imageUrl ? item.cancelBy.imageUrl : '/static/default.png'} alt='avatar'></img>
                    </Col>
                  </Row>
                )}
              />
            </Col>
          </Row>
        </Layout>
      </AppLayout>
    );
  }
}

const mapState = (rootState: any) => {
  return {
    ...rootState.dashboardModel,
    profileState: rootState.profileModel,
    languageState: rootState.languageModel,
  };
};

const mapDispatch = (rootReducer: any) => {
  return {
    ...rootReducer.dashboardModel,
    profileReducers: rootReducer.profileModel,
  };
};

export default withRematch(initStore, mapState, mapDispatch)(Dashboard);