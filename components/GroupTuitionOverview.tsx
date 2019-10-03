import React from 'react';
import { Layout, Row, Col, Rate, Tooltip, Button, Icon } from 'antd';
const COUNTRY_FLAG_API = 'https://www.countryflags.io/';
const COUNTRY_FLAG_OPTION = '/shiny/48.png';
const COUNTRY_FLAG_SMALL_OPTION = '/shiny/24.png';
import '../pages/login-student/informationTutor.css';
class GroupTuitionOverview extends React.Component<any, any> {


  countryFlagUrl = (nationality) => {
    const filterNationality = this.props.dataLookupState.findaTutor.nationality.filter((val) => val.name === nationality);

    return filterNationality.length ? (
      <div>
        <Tooltip title={filterNationality[0].name}>
          <img
            className="responsive-flag"
            src={`${COUNTRY_FLAG_API}${filterNationality[0].code}${COUNTRY_FLAG_OPTION}`}
            alt={filterNationality[0].name}
          />
          <img
            className="responsive-small-flag"
            src={`${COUNTRY_FLAG_API}${filterNationality[0].code}${COUNTRY_FLAG_SMALL_OPTION}`}
            alt={filterNationality[0].name}
          />
        </Tooltip>
      </div>
    ) : null;
  };

  calculateLocaleHourlyRate = (input) => {
    const exchangeRate = this.props.profileState ? this.props.profileState.currency && this.props.profileState.currency.exchangeRate ? this.props.profileState.currency.exchangeRate : 1 : 1;
    const currency = this.props.profileState ? this.props.profileState.currency && this.props.profileState.currency.code ? this.props.profileState.currency.code : 'SGD' : 'SGD';
    return Math.round((input / exchangeRate)).toLocaleString() + ' ' + currency;
  };

  render() {
    return (
      <Row gutter={{ lg: 10, md: 8, sm: 6, xs: 4 }}>
        <Col xs={8} sm={7} md={6} lg={5} xl={4}>
          <img src={this.props.tutorInfo.imageUrl || '/static/default.png'}
            style={{
              width: '100%',
              display: 'block',
              marginLeft: 'auto',
              marginRight: 'auto',
            }}
          />
          <div className="responsive-rating">
            <Rate style={{ textAlign: 'center', marginBottom: 20 }} allowHalf={true} value={this.props.tutorInfo.rating || 0} />
          </div>
        </Col>

        <Col xs={16} sm={17} md={18} lg={19} xl={20} style={{ paddingLeft: '20px' }}>
          <Row style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap' }}>
            <Col xs={24} md={12}>
              <div className="responsive-name-container">
                <h2 style={{ display: 'inline-block', marginBottom: '0px' }} className="responsive-tutor-name">
                  {this.props.tutorInfo.fullName}
                </h2>

                <div className="responsive-flags-container">
                  {this.props.tutorInfo.biography ? this.countryFlagUrl(this.props.tutorInfo.biography.nationality) : ''}
                </div>

                <Col xs={12}>
                  <div style={{ margin: '0px 20px', alignItems: 'center', marginTop: '20px' }} className="responsive-big-screen-rating">
                    <Rate style={{ float: 'right', marginBottom: 20 }} allowHalf={true} value={this.props.tutorInfo.rating || 0} />
                  </div>
                </Col>
              </div>
            </Col>

            <Col xs={24}>
              <div className="responsive-price">
                <p style={{ marginBottom: '0px', fontWeight: 'bold' }}>
                  {this.calculateLocaleHourlyRate(this.props.groupInfo.course.hourlyRate)}
                </p>
              </div>
            </Col>
          </Row>

          <Row className='custom-display-flex col-box-container responsive-row-container'>
            <Col className='col-box'>
              <h3 style={{ fontWeight: 'bold', margin: '0px' }}>{this.props.languageState.GROUP_TUITION_OVERVIEW_COL_SUBJECT.translated}</h3>
              <p>{this.props.groupInfo.course.subject}</p>
            </Col>

            <Col className='col-box'>
              <h3 style={{ fontWeight: 'bold', margin: '0px' }}>{this.props.languageState.GROUP_TUITION_OVERVIEW_COL_TEACHERS.translated}</h3>
              <p>{this.props.groupInfo.course.grade}</p>
            </Col>

            <Col className='col-box'>
              <h3 style={{ fontWeight: 'bold', margin: '0px' }}>{this.props.languageState.GROUP_TUITION_OVERVIEW_COL_BASED_IN.translated}</h3>
              <p>{this.props.groupInfo.course.country}</p>
            </Col>

            <Col className='col-box'>
              <h3 style={{ fontWeight: 'bold', margin: '0px' }}>{this.props.languageState.GROUP_TUITION_OVERVIEW_COL_LESSON.translated}</h3>
              <p>{this.props.groupInfo.course.session}</p>
            </Col>

            <Col className='col-box'>
              <h3 style={{ fontWeight: 'bold', margin: '0px' }}>{this.props.languageState.GROUP_TUITION_OVERVIEW_COL_HOURLY_RATE.translated}</h3>
              <p>{this.calculateLocaleHourlyRate(this.props.groupInfo.course.hourlyRate)}</p>
            </Col>
          </Row>

          <div className="responsive-info-container__small-screen">
            <p><b>{this.props.languageState.GROUP_TUITION_OVERVIEW_SUBJECT.translated}</b>: {this.props.groupInfo.course.subject}</p>
            <p><b>{this.props.languageState.GROUP_TUITION_OVERVIEW_GRADE.translated}</b>: {this.props.groupInfo.course.grade}</p>
            <p><b>{this.props.languageState.GROUP_TUITION_OVERVIEW_BASED_IN.translated}</b>: {this.props.groupInfo.course.country}</p>
          </div>
        </Col>
      </Row>
    )
  }
}

export default GroupTuitionOverview;