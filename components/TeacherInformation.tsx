import { Layout, Row, Col, Rate, Tooltip, Button, Icon } from 'antd';
import ShowMore from 'react-show-more';
import '../pages/login-student/editProfileStudent.css';
import React from 'react';
import Link from 'next/link';
import Router from 'next/router';
import moment from 'moment';

const COUNTRY_FLAG_DIRECTORY = '/static/flags/';
const NUMBER_OF_TUITIONS_DISPLAYED = 2;

class TeacherInformation extends React.Component<any, any> {
  state = {
    tuitionCollapsed: true,
    seeMoreGroupDetails: false,
    showLoginModal: false
  };

  calculateMinMaxHourlyRate = (array) => {
    array = array.map(value => value ? Number(value.hourlyRate) : 0).filter(val => val !== 0);
    return array.length > 0 ?
      (array.length > 1 ?  
      `${this.calculateLocaleHourlyRate(Math.min(...array))} - ${this.calculateLocaleHourlyRate(Math.max(...array))} ${this.props.currency ? this.props.currency : 'SGD'}/hour` 
      : `${this.calculateLocaleHourlyRate(array[0])} ${this.props.currency ? this.props.currency : 'SGD'}/hour`)
      : "";
  }

  calculateLocaleHourlyRate = (input) => {
    if (this.props.exchangeRate) {
      return Math.round((input / this.props.exchangeRate)).toString();
    } else {
      return input.toString();
    }
  }

  uniqueElementArray = (array) => {
    return array.filter(function (val, index) {
      return array.indexOf(val) === index;
    }).sort();
  }

  uniqueElementSubjects = (array) => {
    const ascending = (this.props.sortBy === 'courseForTutor.course.subject') ? (this.props.asc ? true : false) : true
    return array.filter(function (val, index) {
      return array.indexOf(val) === index;
    }).sort((a, b) => {
      return ascending ? a.localeCompare(b) : b.localeCompare(a);
    });
  }

  calculateFinishedSessions = (array) => {
    let sessionsArray = array.map((courseForTutor) => {
      return courseForTutor.tuitions && courseForTutor.tuitions.length ? courseForTutor.tuitions.map((tuition) => {
        return tuition.sessions;
      }) : [];
    });

    sessionsArray = sessionsArray.reduce((sums, val) => sums.concat(val), []).reduce((sums, val) => sums.concat(val), []);

    return sessionsArray.length ? sessionsArray.filter((val) => val.isCompleted).length : 0;
  }

  onClickTrialButton = () => {
    Object.keys(this.props.profileState).length && this.props.profileState.isLoggedIn ?
      this.props._source.forGroupTuitionElastic
        ? Router.push(`/login-student/informationGroupTuition/${this.props._source.courseForTutor[0].groupTuition._id}`)
        : Router.push(`/login-student/informationTutor/${this.props._id}`)
    : this.props.openLoginModal()
  }

  countryFlagUrl = (nationality) => {
    const filterNationality = this.props.dataLookup.nationality.filter((val) => val.name === nationality);
    return filterNationality.length ?
      (
        <div>
          <Tooltip title={filterNationality[0].name}>
            <img className="responsive-flag" src={COUNTRY_FLAG_DIRECTORY + '24/' + filterNationality[0].code + '-24.png'} alt={filterNationality[0].name}></img>
            <img className="responsive-small-flag" src={COUNTRY_FLAG_DIRECTORY + '24/' + filterNationality[0].code + '-24.png'} alt={filterNationality[0].name}></img>
          </Tooltip>
        </div>
      )
      : "";
  }
  onClickButtonGroupDetails = () => {
    this.setState({
      seeMoreGroupDetails: !this.state.seeMoreGroupDetails
    })
  }

  toggleCollapse = () => {
    this.setState({
      tuitionCollapsed: !this.state.tuitionCollapsed
    });
  }

  sortCourse = (array) => {
    // Sort course by multiple fields, subject > grade > hourlyRate
    const result = array.sort(
      function (a, b) {
        if (a.course && b.course) {
          if (a.course.subject !== b.course.subject) {
            return a.course.subject.localeCompare(b.course.subject)
          } else {
            if (a.course.grade !== b.course.grade) {
              return a.course.grade.localeCompare(b.course.grade)
            } else {
              return a.hourlyRate - b.hourlyRate;
            }
          }
        } else return 1;
      });
    return result;
  }

  render() {
    const tuitionsList = this.state.tuitionCollapsed ?
      this.sortCourse(this.props._source.courseForTutor.filter(val => val.hourlyRate !== 0).filter(val => val.course)).slice(0, NUMBER_OF_TUITIONS_DISPLAYED).map((val, i) => <p key={i} style={{ marginBottom: '0px' }}>- {val.course.subject} ({val.course.grade}) @ {this.calculateLocaleHourlyRate(val.hourlyRate)} {this.props.currency}/hour</p>)
      : this.sortCourse(this.props._source.courseForTutor.filter(val => val.hourlyRate !== 0)).map((val, index) => <p key={index} style={{ marginBottom: '0px' }}>- {val.course.subject} ({val.course.grade}) @ {this.calculateLocaleHourlyRate(val.hourlyRate)} {this.props.currency}/hour</p>);
    const { Content } = Layout;
    return (
      <Layout style={{ borderRadius: 5, background: '#f4f5f5', marginBottom: 20 }} onClick={this.props.onClick}>
        <Content className="responsive-content-container">
          <Row gutter={{ lg: 10, md: 8, sm: 6, xs: 4 }}>
            <Col xs={8} sm={7} md={6} lg={5} xl={4}>
              <Link href={!this.props.onClick ? this.props._source.forGroupTuitionElastic
                  ? `/login-student/informationGroupTuition/${this.props._source.courseForTutor[0].groupTuition._id}`
                  : `/login-student/informationTutor/${this.props._id}` : undefined}>
                <a>
                  <img
                    src={this.props._source.imageUrl || '/static/default.png'}
                    style={{
                      width: '100%',
                      display: 'block',
                      marginLeft: 'auto',
                      marginRight: 'auto',
                    }}
                  />
                </a>
              </Link>
              <div className="responsive-rating">
                <Rate style={{ textAlign: 'center', marginBottom: 20 }} allowHalf={true} value={this.props._source.rating || 0} />
              </div>
              <div className="responsive-trial-mobile">
                {this.props._source.forGroupTuitionElastic || this.props._source.hourlyPerSessionTrial ?
                  <Button
                    style={{ whiteSpace: 'normal', height: 'auto', minHeight: '32px' }}
                    type='primary'
                    onClick={this.onClickTrialButton}
                  >
                    {this.props._source.forGroupTuitionElastic ? this.props.languageState.TEACHER_INFORMATION_BUTTON_GROUP_TUITION_TEXT.translated : this.props.languageState.TEACHER_INFORMATION_BUTTON_TRIAL_AVAILABLE_TEXT.translated}
                  </Button>
                  : <div></div>
                }
              </div>
            </Col>
            <Col xs={16} sm={17} md={18} lg={19} xl={20} style={{ paddingLeft: '20px' }}>
              <Row style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap' }}>

                <Col md={12} xs={24}>
                  <Row style={{ display: 'flex', alignItems: 'center' }}>
                    <Link href={!this.props.onClick ? this.props._source.forGroupTuitionElastic
                        ? `/login-student/informationGroupTuition/${this.props._source.courseForTutor[0].groupTuition._id}`
                        : `/login-student/informationTutor/${this.props._id}` : undefined}>
                      <a style={{ marginRight: 15, marginBottom: 4 }} >
                        <h2 style={{ display: 'inline-block', marginBottom: '0px', marginTop: 10 }} className="responsive-tutor-name">{this.props._source.fullName || ((this.props._source.firstName || "") + " " + (this.props._source.lastName || ""))}</h2>
                      </a>
                    </Link>
                    <Col xs={3} >
                      <div className="responsive-flag">
                        {this.props._source.biography ? this.countryFlagUrl(this.props._source.biography.nationality) : ""}
                      </div>
                    </Col>
                    <Col className='responsive-price-and-rating'>
                      <Rate style={{ float: 'right', marginRight: 20 }} allowHalf={true} value={this.props._source.rating || 0} />
                    </Col>
                  </Row>
                </Col>

                <div className="responsive-price">
                  <p style={{ marginBottom: '0px', fontWeight: 'bold' }}>{this.props._source.courseForTutor.length ? this.calculateMinMaxHourlyRate(this.props._source.courseForTutor) : ''}</p>
                </div>

              </Row>

              <Row className='custom-display-flex col-box-container responsive-row-container'>
                {
                  !this.props._source.forGroupTuitionElastic ?
                    this.props._source.courseForTutor.length && this.uniqueElementSubjects(this.props._source.courseForTutor.filter(val => val.hourlyRate).filter(val => val.course).map((val) => val.course.subject)).length > 2 ?
                      <Tooltip placement="right" title={this.props._source.courseForTutor.length > 2 ? this.uniqueElementSubjects(this.props._source.courseForTutor.filter(val => val.hourlyRate).filter(val => val.course).map((value) => value.course.subject)).map((value, index) => {
                        return (<p style={{ fontWeight: 'bold', margin: '0px' }} key={index}>{value}</p>);
                      }) : "none"} >
                        <Col className='col-box'>
                          <h3 style={{ fontWeight: 'bold', margin: '0px' }}>{this.props.languageState.TEACHER_INFORMATION_COL_SUBJECT.translated}</h3>
                          {this.props._source.courseForTutor.length ? this.uniqueElementSubjects(this.props._source.courseForTutor.filter(val => val.hourlyRate).filter(val => val.course).map((value) => value.course.subject)).slice(0, 2).map((value, index) => {
                            return (<p style={{ fontWeight: 'bold', margin: '0px' }} key={index}>{value}</p>);
                          }) : "none"}
                          <p style={{ color: '#a7a7a7', marginBottom: '0px', cursor: 'pointer' }}>{this.props.languageState.TEACHER_INFORMATION_AND_MORE_TEXT.translated}</p>
                        </Col>
                      </Tooltip> :
                      <Col className='col-box'>
                        <h3 style={{ fontWeight: 'bold', margin: '0px' }}>{this.props.languageState.TEACHER_INFORMATION_COL_SUBJECT.translated}</h3>
                        {this.props._source.courseForTutor.length ? this.uniqueElementSubjects(this.props._source.courseForTutor.filter(val => val.hourlyRate).filter(val => val.course).map((value) => value.course.subject)).map((value, index) => {
                          return (<p style={{ fontWeight: 'bold', margin: '0px' }} key={index}>{value}</p>);
                        }) : "none"}
                      </Col>
                    : <Col className='col-box'>
                      <h3 style={{ fontWeight: 'bold', margin: '0px' }}>{this.props.languageState.TEACHER_INFORMATION_COL_SUBJECT.translated}</h3>
                      <p style={{ fontWeight: 'bold', margin: '0px' }}>{this.props._source.courseForTutor.length && this.props._source.courseForTutor[0].groupTuition ? this.props._source.courseForTutor[0].groupTuition.course.subject : ""}</p>
                    </Col>
                }

                {!this.props._source.forGroupTuitionElastic ?
                  this.props._source.courseForTutor.length && this.uniqueElementArray(this.props._source.courseForTutor.filter(val => val.hourlyRate).filter(val => val.course).map((val) => val.course.grade)).length > 2 ?
                    <Tooltip placement="right" title={this.props._source.courseForTutor.length > 2 ? this.uniqueElementArray(this.props._source.courseForTutor.filter(val => val.hourlyRate).filter(val => val.course).map((value) => value.course.grade)).map((value, index) => {
                      return (<p style={{ fontWeight: 'bold', margin: '0px' }} key={index}>{value}</p>);
                    }) : "none"} >
                      <Col className='col-box'>
                        <h3 style={{ fontWeight: 'bold', margin: '0px' }}>{this.props.languageState.TEACHER_INFORMATION_COL_TEACHERS.translated}</h3>
                        {this.props._source.courseForTutor.length ? this.uniqueElementArray(this.props._source.courseForTutor.filter(val => val.hourlyRate).filter(val => val.course).map((value) => value.course.grade)).slice(0, 2).map((value, index) => {
                          return (<p style={{ fontWeight: 'bold', margin: '0px' }} key={index}>{value}</p>);
                        }) : "none"}
                        <p style={{ color: '#a7a7a7', marginBottom: '0px', cursor: 'pointer' }}>{this.props.languageState.TEACHER_INFORMATION_AND_MORE_TEXT.translated}</p>
                      </Col>
                    </Tooltip> :
                    <Col className='col-box'>
                      <h3 style={{ fontWeight: 'bold', margin: '0px' }}>{this.props.languageState.TEACHER_INFORMATION_COL_TEACHERS.translated}</h3>
                      {this.props._source.courseForTutor.length ? this.uniqueElementArray(this.props._source.courseForTutor.filter(val => val.hourlyRate).filter(val => val.course).map((value) => value.course.grade)).map((value, index) => {
                        return (<p style={{ fontWeight: 'bold', margin: '0px' }} key={index}>{value}</p>);
                      }) : "none"}
                    </Col>
                  : <Col className='col-box'>
                    <h3 style={{ fontWeight: 'bold', margin: '0px' }}>{this.props.languageState.TEACHER_INFORMATION_COL_TEACHERS.translated}</h3>
                    <p style={{ fontWeight: 'bold', margin: '0px' }}>{this.props._source.courseForTutor.length && this.props._source.courseForTutor[0].groupTuition ? this.props._source.courseForTutor[0].groupTuition.course.grade : ""}</p>
                  </Col>
                }

                <Col className='col-box'>
                  <h3 style={{ fontWeight: 'bold', margin: '0px' }}>{this.props.languageState.TEACHER_INFORMATION_COL_BASED_IN.translated}</h3>
                  <p style={{fontWeight: 'bold', margin: '0px' }}>{this.props._source.currentlyBasedIn}</p>
                </Col>
                {/* {!this.props._source.forGroupTuitionElastic ?
                  this.props._source.courseForTutor.length && this.uniqueElementArray(this.props._source.courseForTutor.filter(val => val.hourlyRate).filter(val => val.course).map((val) => val.course.country)).length > 2 ?
                    <Tooltip placement="right" arrowPointAtCenter title={this.props._source.courseForTutor.length > 2 ? this.uniqueElementArray(this.props._source.courseForTutor.filter(val => val.hourlyRate).filter(val => val.course).map((value) => value.course.country)).map((value, index) => {
                      return (<p style={{ fontWeight: 'bold', margin: '0px' }} key={index}>{value}</p>);
                    }) : "none"} >
                      <Col className='col-box'>
                        <h3 style={{ fontWeight: 'bold', margin: '0px' }}>Based in</h3>
                        {this.props._source.courseForTutor.length ? this.uniqueElementArray(this.props._source.courseForTutor.filter(val => val.hourlyRate).filter(val => val.course).map((value) => value.course.country)).slice(0, 2).map((value, index) => {
                          return (<p style={{ fontWeight: 'bold', margin: '0px' }} key={index}>{value}</p>);
                        }) : "none"}
                        <p style={{ color: '#a7a7a7', marginBottom: '0px', cursor: 'pointer' }}>and more...</p>
                      </Col>
                    </Tooltip> :
                    <Col className='col-box'>
                      <h3 style={{ fontWeight: 'bold', margin: '0px' }}>Based in</h3>
                      {this.props._source.courseForTutor.length ? this.uniqueElementArray(this.props._source.courseForTutor.filter(val => val.hourlyRate).filter(val => val.course).map((value) => value.course.country)).map((value, index) => {
                        return (<p style={{ fontWeight: 'bold', margin: '0px' }} key={index}>{value}</p>);
                      }) : "none"}
                    </Col>
                  : <Col className='col-box'>
                    <h3 style={{ fontWeight: 'bold', margin: '0px' }}>Based in</h3>
                    <p style={{ fontWeight: 'bold', margin: '0px' }}>{this.props._source.courseForTutor.length && this.props._source.courseForTutor[0].groupTuition ? this.props._source.courseForTutor[0].groupTuition.course.country : ""}</p>
                  </Col>
                } */}

                <Col className='col-box'>
                  <h3 style={{ fontWeight: 'bold', margin: '0px' }}>{this.props.languageState.TEACHER_INFORMATION_COL_LESSON.translated}</h3>
                  <p style={{ fontWeight: 'bold', margin: '0px' }}>{this.props._source.courseForTutor.length ? this.calculateFinishedSessions(this.props._source.courseForTutor) : 'none'}</p>
                </Col>

                <Col className='col-box'>
                  <h3 style={{ fontWeight: 'bold', margin: '0px' }}>{this.props.languageState.TEACHER_INFORMATION_COL_HOURLY_RATE.translated}</h3>
                  <p style={{ fontWeight: 'bold', margin: '0px' }}>{this.props._source.courseForTutor.length ? this.calculateMinMaxHourlyRate(this.props._source.courseForTutor) : 'none'}</p>
                </Col>

              </Row>

              <div className="responsive-info-container__small-screen">
                {
                  !this.props._source.forGroupTuitionElastic ?
                    this.props._source.courseForTutor.length > 2 ?
                      <Tooltip title={this.props._source.courseForTutor.length > 2 ? this.uniqueElementSubjects(this.props._source.courseForTutor.filter(val => val.course).map((value) => value.course.subject)).map((value, index) => {
                        return (<p style={{ fontWeight: 'bold', margin: '0px' }} key={index}>{value}</p>);
                      }) : "none"}>
                        <p><b>{this.props.languageState.TEACHER_INFORMATION_COURSE_FOR_TUTOR_TOOLTIP_SUBJECT.translated}</b>: {this.uniqueElementSubjects(this.props._source.courseForTutor.filter(val => val.course).map((value) => value.course.subject)).slice(0, 2).join(", ")} {this.props.languageState.TEACHER_INFORMATION_AND_MORE_TEXT.translated}</p>
                      </Tooltip> :
                      <p><b>{this.props.languageState.TEACHER_INFORMATION_COURSE_FOR_TUTOR_SUBJECT.translated}</b>: {this.uniqueElementSubjects(this.props._source.courseForTutor.filter(val => val.course).map((value) => value.course.subject)).join(", ")}.</p>
                    : this.props._source.courseForTutor.length && this.props._source.courseForTutor[0].groupTuition ? (<p><b>{this.props.languageState.TEACHER_INFORMATION_COURSE_FOR_TUTOR_SUBJECT.translated}</b>: {this.props._source.courseForTutor[0].groupTuition.course.subject}</p>) : <p></p>
                }
                {
                  !this.props._source.forGroupTuitionElastic ?
                    this.props._source.courseForTutor.length > 2 ?
                      <Tooltip title={this.props._source.courseForTutor.length > 2 ? this.uniqueElementArray(this.props._source.courseForTutor.filter(val => val.course).map((value) => value.course.grade)).map((value, index) => {
                        return (<p style={{ fontWeight: 'bold', margin: '0px' }} key={index}>{value}</p>);
                      }) : "none"} >
                        <p><b>{this.props.languageState.TEACHER_INFORMATION_COURSE_FOR_TUTOR_TOOLTIP_GRADES.translated}</b>: {this.uniqueElementArray(this.props._source.courseForTutor.filter(val => val.course).map((value) => value.course.grade)).slice(0, 2).join(", ")} {this.props.languageState.TEACHER_INFORMATION_AND_MORE_TEXT.translated}</p>
                      </Tooltip> :
                      <p><b>{this.props.languageState.TEACHER_INFORMATION_COURSE_FOR_TUTOR_GRADES.translated}</b>: {this.uniqueElementArray(this.props._source.courseForTutor.filter(val => val.course).map((value) => value.course.grade)).join(", ")}.</p>
                    : this.props._source.courseForTutor.length && this.props._source.courseForTutor[0].groupTuition ? (<p><b>{this.props.languageState.TEACHER_INFORMATION_COURSE_FOR_TUTOR_GRADES.translated}</b>: {this.props._source.courseForTutor[0].groupTuition.course.grade}</p>) : <p></p>
                }
                {
                  !this.props._source.forGroupTuitionElastic ?
                    this.props._source.courseForTutor.length > 2 ?
                      <Tooltip title={this.props._source.courseForTutor.length > 2 ? this.uniqueElementArray(this.props._source.courseForTutor.filter(val => val.course).map((value) => value.course.country)).map((value, index) => {
                        return (<p style={{ fontWeight: 'bold', margin: '0px' }} key={index}>{value}</p>);
                      }) : "none"} >
                        <p><b>{this.props.languageState.TEACHER_INFORMATION_COURSE_FOR_TUTOR_TOOLTIP_BASED_IN.translated}</b>: {this.uniqueElementArray(this.props._source.courseForTutor.filter(val => val.course).map((value) => value.course.country)).slice(0, 2).join(", ")} {this.props.languageState.TEACHER_INFORMATION_AND_MORE_TEXT.translated}</p>
                      </Tooltip> :
                      <p><b>{this.props.languageState.TEACHER_INFORMATION_COURSE_FOR_TUTOR_BASED_IN.translated}</b>: {this.uniqueElementArray(this.props._source.courseForTutor.filter(val => val.course).map((value) => value.course.country)).join(", ")}.</p>
                    : this.props._source.courseForTutor.length && this.props._source.courseForTutor[0].groupTuition ? (<p><b>{this.props.languageState.TEACHER_INFORMATION_COURSE_FOR_TUTOR_BASED_IN.translated}</b>: {this.props._source.courseForTutor[0].groupTuition.course.country}</p>) : <p></p>
                }
              </div>
              <Row className="description-container">
                <ShowMore
                  lines={1}
                  more='Show more'
                  less='Show less'
                  anchorClass=''
                  style={{ minHeight: ' 48px' }}
                >
                  {this.props._source.biography ? <p style={{ marginBottom: '0px' }}>{this.props._source.biography.aboutMe}</p> : <p style={{ marginBottom: '0px' }}>{this.props.languageState.TEACHER_INFORMATION_SHOW_ABOUT_ME_TITLE.translated}</p>}
                </ShowMore>
                {this.props._source.courseForTutor.length && (
                  <div>
                    {this.props._source.courseForTutor[0].groupTuition
                      ? <div>
                        <h3>{this.props.languageState.TEACHER_INFORMATION_GROUP_TUITION_TITLE.translated}</h3>
                        <Row>
                          <Icon type="team" theme="outlined" style={{ marginRight: 10 }} />
                          <a style={{ color: '#000000' }} >{this.props.languageState.TEACHER_INFORMATION_TUITION_GROUP_OF.translated} {this.props._source.courseForTutor[0].groupTuition.course.maxClassSize} {this.props.languageState.TEACHER_INFORMATION_STUDENT.translated} 
                            {
                              Array.apply(null, { length: this.props._source.courseForTutor[0].groupTuition.course.maxClassSize } as any).map((_val, index) => index < (this.props._source.courseForTutor[0].groupTuition.students.length + this.props._source.courseForTutor[0].groupTuition.slotsHolded.length) ? 1 : 0).map((val) => {
                                return <img src={val ? '/static/user-black.png' : '/static/user-gray.png'} style={{ width: '16px', height: '16px', margin: '0px 4px', marginBottom: '5px' }} />
                              })
                            }
                            <i>{`(${this.props._source.courseForTutor[0].groupTuition.students.length + this.props._source.courseForTutor[0].groupTuition.slotsHolded.length} of ${this.props._source.courseForTutor[0].groupTuition.course.maxClassSize} slots taken)`}</i>
                          </a>
                        </Row>
                        <Row>
                          <Icon type="calendar" theme="outlined" style={{ marginRight: 10 }} />
                          <a style={{ color: '#000000' }} >{`${moment(this.props._source.courseForTutor[0].groupTuition.period[0].start).format('DD MMM YYYY')} - ${moment(this.props._source.courseForTutor[0].groupTuition.period[this.props._source.courseForTutor[0].groupTuition.period.length - 1].end).format('DD MMM YYYY')}`}</a>
                        </Row>
                        <Row>
                          <Icon type="bell" theme="outlined" style={{ marginRight: 10 }} />
                          <a style={{ color: '#000000' }} >{this.props.languageState.TEACHER_INFORMATION_TUITION_GROUP_REGISTRATION_OPEN_DATE.translated} {moment(this.props._source.courseForTutor[0].groupTuition.course.startReg).format('DD MMM YYYY')} to {moment(this.props._source.courseForTutor[0].groupTuition.course.endReg).format('DD MMM YYYY')}</a>
                        </Row>
                        <Row>
                          {this.state.seeMoreGroupDetails
                            ? <div>
                              <hr style={{ marginTop: 20, marginBottom: 20 }} />
                              {this.props._source.courseForTutor[0].groupTuition.period.map((value, index) => {
                                return (
                                  <Col key={index} span={6} style={{ marginRight: 10 }}>
                                    <h3>{this.props.languageState.TEACHER_INFORMATION_TUITION_GROUP_LESSON.translated} {index + 1} :</h3>
                                    <p>{this.props.languageState.TEACHER_INFORMATION_TUITION_GROUP_START_TIME.translated} : {new Date(value.start).toLocaleString()}</p>
                                    <p>{this.props.languageState.TEACHER_INFORMATION_TUITION_GROUP_END_TIME.translated} : {new Date(value.end).toLocaleString()}</p>
                                  </Col>);
                              })}</div>
                            : <div></div>}
                        </Row>
                        <a
                          style={{ 
                            marginTop: 10,
                            fontSize: "16px",
                            fontWeight: "bold",
                            fontStyle: "italic",
                            paddingLeft: "10px" 
                          }}
                          onClick={this.onClickButtonGroupDetails}>{this.state.seeMoreGroupDetails ? "Show less" : "Show more"}</a>
                      </div>
                      : <div>
                        <h3>{this.props.languageState.TEACHER_INFORMATION_TUITION_OFFERED_TITLE.translated}</h3>
                        {tuitionsList}
                        {this.props._source.courseForTutor.length > NUMBER_OF_TUITIONS_DISPLAYED
                          ? <a style={{ fontSize: '16px', fontWeight: 'bold', fontStyle: 'italic', paddingLeft: '10px' }} onClick={this.toggleCollapse}>{this.state.tuitionCollapsed ? 'Show more' : 'Show less'}</a>
                          : ""}
                      </div>}
                  </div>
                )}
              </Row>
            </Col>
          </Row>
        </Content>
      </Layout>
    );
  }

}
export default TeacherInformation;