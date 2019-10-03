import React from 'react';
import { Row, Col, Rate, Tooltip, Button } from 'antd';

interface ITutorOverviewProps {
  tutorInfo: {
    imageUrl: string;
    rating: number;
    fullName: string;
    firstName: string;
    lastName: string;
    biography: any;
    hourlyPerSessionTrial: number;
    courseForTutor: any[];
  };
  languageState: any;
  dataLookupState: any;
  profileState: any;
  isBookedTrial: boolean;
  scheduleATrial: () => void;
}

const TutorOverview = (props: ITutorOverviewProps) => {
  const COUNTRY_FLAG_DIRECTORY = '/static/flags/';

  const countryFlagUrl = (nationality) => {
    const filterNationality = props.dataLookupState.findaTutor.nationality.filter((val) => val.name === nationality);

    return filterNationality.length ? (
      <div>
        <Tooltip title={filterNationality[0].name}>
          <img
            className="responsive-flag"
            src={COUNTRY_FLAG_DIRECTORY + '24/' + filterNationality[0].code + '-24.png'}
            alt={filterNationality[0].name}
          />
          <img
            className="responsive-small-flag"
            src={COUNTRY_FLAG_DIRECTORY + '24/' + filterNationality[0].code + '-24.png'}
            alt={filterNationality[0].name}
          />
        </Tooltip>
      </div>
    ) : null;
  };

  const calculateLocaleHourlyRate = (input) => {
    const exchangeRate = props.profileState ? props.profileState.currency && props.profileState.currency.exchangeRate ? props.profileState.currency.exchangeRate : 1 : 1;
    const currency = props.profileState ? props.profileState.currency && props.profileState.currency.code ? props.profileState.currency.code : 'SGD' : 'SGD';
    return Math.round((input / exchangeRate)).toString() + ' ' + currency;
  };

  const calculateMinMaxHourlyRate = (array) => {
    array = array.map(value => Number(value.hourlyRate)).filter(val => val !== 0);
    return array.length > 1 ? `${calculateLocaleHourlyRate(Math.min(...array))} - ${calculateLocaleHourlyRate(Math.max(...array))}/hour` : `${calculateLocaleHourlyRate(array[0])}/hour`;
  };

  const uniqueElementArray = (array) => {
    return array.filter(function (val, index) {
      return array.indexOf(val) === index;
    }).sort((a, b) => {
      if (typeof (a) === 'string' && typeof (b) === 'string') {
        return a.localeCompare(b);
      } else {
        return a - b;
      }
    })
  };

  const calculateFinishedSessions = (array) => {
    let sessionsArray = array.map((courseForTutor) => {
      return courseForTutor.tuitions && courseForTutor.tuitions.length ? courseForTutor.tuitions.map((tuition) => {
        return tuition.sessions;
      }) : [];
    });

    sessionsArray = sessionsArray.reduce((sums, val) => sums.concat(val), []).reduce((sums, val) => sums.concat(val), []);

    return sessionsArray.length ? sessionsArray.filter((val) => val.isCompleted).length : 0;
  }

  return (
    <Row gutter={{ lg: 10, md: 8, sm: 6, xs: 4 }}>
      <Col xs={8} sm={7} md={6} lg={5} xl={4}>
        <img src={props.tutorInfo.imageUrl || '/static/default.png'}
          style={{
            width: '100%',
            display: 'block',
            marginLeft: 'auto',
            marginRight: 'auto',
          }}
        />
        <div className="responsive-rating">
          <Rate style={{ textAlign: 'center' }} allowHalf={true} value={props.tutorInfo.rating || 0} />
        </div>
        <div style={{ marginTop: '10px', display: 'flex', justifyContent: 'center' }}>
          {props.tutorInfo.hourlyPerSessionTrial
            ? <Button disabled={props.isBookedTrial} type='primary' onClick={props.scheduleATrial} style={{ height: 'auto', whiteSpace: 'normal', minHeight: '32px' }}>
              {props.languageState.TUTOR_OVERVIEW_SCHEDULE_TRIAL.translated}
            </Button>
            : null}
        </div>
      </Col>

      <Col xs={16} sm={17} md={18} lg={19} xl={20} style={{ paddingLeft: '20px' }}>
        <Row style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap' }}>
          <Col xs={24} md={12}>
            <div className="responsive-name-container">
              <div>
                <h2 style={{ display: 'inline-block', marginBottom: '0px' }} className="responsive-tutor-name">
                  {props.tutorInfo.fullName || [(props.tutorInfo.firstName || ''), (props.tutorInfo.lastName || '')].join(' ')}
                </h2>
              </div>

              <div className="responsive-flags-container">
                {props.tutorInfo.biography ? countryFlagUrl(props.tutorInfo.biography.nationality) : ''}
              </div>

              <Col xs={12} className="responsive-ratings-on-desktop">
                <div style={{ margin: '0px 20px', alignItems: 'center', marginTop: '20px' }} className="responsive-big-screen-rating">
                  <Rate style={{ float: 'right', marginBottom: 20 }} allowHalf={true} value={props.tutorInfo.rating || 0} />
                </div>
              </Col>
            </div>
          </Col>

          <Col xs={24}>
            <div className="responsive-price">
              <p style={{ marginBottom: '0px', fontWeight: 'bold' }}>
                {props.tutorInfo.courseForTutor.length ? `${calculateMinMaxHourlyRate(props.tutorInfo.courseForTutor)}` : ''}
              </p>
            </div>
          </Col>
        </Row>

        <Row className='custom-display-flex col-box-container responsive-row-container'>
          {props.tutorInfo.courseForTutor.length && uniqueElementArray(props.tutorInfo.courseForTutor.map((val) => val.course.subject)).length > 2 ? (
            <Tooltip
              title={props.tutorInfo.courseForTutor.length > 2 ? uniqueElementArray(props.tutorInfo.courseForTutor.filter(val => val.hourlyRate > 0).map((value) => value.course.subject)).map((value, index) => <p style={{ fontWeight: 'bold', margin: '0px' }} key={index}>{value}</p>) : "none"}
              placement='rightTop'
            >
              <Col className='col-box'>
                <h3 style={{ fontWeight: 'bold', margin: '0px' }}>{props.languageState.TUTOR_OVERVIEW_SUBJECT.translated}</h3>
                {props.tutorInfo.courseForTutor.length ? uniqueElementArray(props.tutorInfo.courseForTutor.filter(val => val.hourlyRate > 0).map((value) => value.course.subject)).slice(0, 2).map((value, index) => <p style={{ fontWeight: 'bold', margin: '0px' }} key={index}>{value}</p>) : "none"}
                <p style={{ color: '#a7a7a7', marginBottom: '0px' }}>{props.languageState.TUTOR_OVERVIEW_AND_MORE.translated}</p>
              </Col>
            </Tooltip>
          ) : (
              <Col className='col-box'>
                <h3 style={{ fontWeight: 'bold', margin: '0px' }}>{props.languageState.TUTOR_OVERVIEW_SUBJECT.translated}</h3>
                {props.tutorInfo.courseForTutor.length ? uniqueElementArray(props.tutorInfo.courseForTutor.filter(val => val.hourlyRate > 0).map((value) => value.course.subject)).map((value, index) => <p style={{ fontWeight: 'bold', margin: '0px' }} key={index}>{value}</p>) : "none"}
              </Col>
            )}

          {props.tutorInfo.courseForTutor.length && uniqueElementArray(props.tutorInfo.courseForTutor.filter(val => val.hourlyRate > 0).map((val) => val.course.grade)).length > 2 ? (
            <Tooltip
              title={props.tutorInfo.courseForTutor.filter(val => val.hourlyRate > 0).length > 2 ? uniqueElementArray(props.tutorInfo.courseForTutor.filter(val => val.hourlyRate > 0).map((value) => value.course.grade)).map((value, index) => <p style={{ fontWeight: 'bold', margin: '0px' }} key={index}>{value}</p>) : "none"}
              placement='rightTop'
            >
              <Col className='col-box'>
                <h3 style={{ fontWeight: 'bold', margin: '0px' }}>{props.languageState.TUTOR_OVERVIEW_TEACHES.translated}</h3>
                {props.tutorInfo.courseForTutor.filter(val => val.hourlyRate > 0).length ? uniqueElementArray(props.tutorInfo.courseForTutor.filter(val => val.hourlyRate > 0).map((value) => value.course.grade)).slice(0, 2).map((value, index) => <p style={{ fontWeight: 'bold', margin: '0px' }} key={index}>{value}</p>) : "none"}
                <p style={{ color: '#a7a7a7', marginBottom: '0px' }}>{props.languageState.TUTOR_OVERVIEW_AND_MORE.translated}</p>
              </Col>
            </Tooltip>
          ) : (
              <Col className='col-box'>
                <h3 style={{ fontWeight: 'bold', margin: '0px' }}>{props.languageState.TUTOR_OVERVIEW_TEACHES.translated}</h3>
                {props.tutorInfo.courseForTutor.filter(val => val.hourlyRate > 0).length ? uniqueElementArray(props.tutorInfo.courseForTutor.filter(val => val.hourlyRate > 0).map((value) => value.course.grade)).map((value, index) => <p style={{ fontWeight: 'bold', margin: '0px' }} key={index}>{value}</p>) : "none"}
              </Col>
            )}

          <Col className='col-box'>
            <h3 style={{ fontWeight: 'bold', margin: '0px' }}>{props.languageState.TUTOR_OVERVIEW_BASED_IN.translated}</h3>
            <p style={{ fontWeight: 'bold', margin: '0px' }}>{(props.tutorInfo as any).currentlyBasedIn}</p>
          </Col>

          <Col className='col-box'>
            <h3 style={{ fontWeight: 'bold', margin: '0px' }}>{props.languageState.TUTOR_OVERVIEW_LESSON.translated}</h3>
            <p style={{ fontWeight: 'bold', margin: '0px' }}>{props.tutorInfo.courseForTutor.filter(val => val.hourlyRate > 0).length ? calculateFinishedSessions(props.tutorInfo.courseForTutor.filter(val => val.hourlyRate > 0)) : 'none'}</p>
          </Col>

          <Col className='col-box'>
            <h3 style={{ fontWeight: 'bold', margin: '0px' }}>{props.languageState.TUTOR_OVERVIEW_HOURLY_RATE.translated}</h3>
            <p style={{ fontWeight: 'bold', margin: '0px' }}>{props.tutorInfo.courseForTutor.filter(val => val.hourlyRate > 0).length ? calculateMinMaxHourlyRate(props.tutorInfo.courseForTutor) : 'none'}</p>
          </Col>
        </Row>

        <div className="responsive-info-container__small-screen">
          {
            props.tutorInfo.courseForTutor.filter(val => val.hourlyRate > 0).length > 2 ?
              <Tooltip title={props.tutorInfo.courseForTutor.filter(val => val.hourlyRate > 0).length > 2 ? uniqueElementArray(props.tutorInfo.courseForTutor.filter(val => val.hourlyRate > 0).map((value) => value.course.subject)).map((value, index) => {
                return (<p style={{ fontWeight: 'bold', margin: '0px' }} key={index}>{value}</p>);
              }) : "none"} placement='rightTop'>
                <p><b>{props.languageState.TUTOR_OVERVIEW_SUBJECT.translated}</b>: {uniqueElementArray(props.tutorInfo.courseForTutor.filter(val => val.hourlyRate > 0).map((value) => value.course.subject)).slice(0, 2).join(", ")} {props.languageState.TUTOR_OVERVIEW_AND_MORE.translated}</p>
              </Tooltip> :
              <p><b>{props.languageState.TUTOR_OVERVIEW_SUBJECT.translated}</b>: {uniqueElementArray(props.tutorInfo.courseForTutor.filter(val => val.hourlyRate > 0).map((value) => value.course.subject)).join(", ")}.</p>
          }
          {
            props.tutorInfo.courseForTutor.filter(val => val.hourlyRate > 0).length > 2 ?
              <Tooltip title={props.tutorInfo.courseForTutor.length > 2 ? uniqueElementArray(props.tutorInfo.courseForTutor.filter(val => val.hourlyRate > 0).map((value) => value.course.grade)).map((value, index) => {
                return (<p style={{ fontWeight: 'bold', margin: '0px' }} key={index}>{value}</p>);
              }) : "none"} placement='rightTop'>
                <p><b>{props.languageState.TUTOR_OVERVIEW_GRADE.translated}</b>: {uniqueElementArray(props.tutorInfo.courseForTutor.filter(val => val.hourlyRate > 0).map((value) => value.course.grade)).slice(0, 2).join(", ")} {props.languageState.TUTOR_OVERVIEW_AND_MORE.translated}</p>
              </Tooltip> :
              <p><b>{props.languageState.TUTOR_OVERVIEW_GRADE.translated}</b>: {uniqueElementArray(props.tutorInfo.courseForTutor.filter(val => val.hourlyRate > 0).map((value) => value.course.grade)).join(", ")}.</p>
          }
          {
            props.tutorInfo.courseForTutor.filter(val => val.hourlyRate > 0).length > 2 ?
              <Tooltip title={props.tutorInfo.courseForTutor.filter(val => val.hourlyRate > 0).length > 2 ? uniqueElementArray(props.tutorInfo.courseForTutor.filter(val => val.hourlyRate > 0).map((value) => value.course.country)).map((value, index) => {
                return (<p style={{ fontWeight: 'bold', margin: '0px' }} key={index}>{value}</p>);
              }) : "none"} placement='rightTop'>
                <p><b>{props.languageState.TUTOR_OVERVIEW_BASED_IN.translated}</b>: {uniqueElementArray(props.tutorInfo.courseForTutor.filter(val => val.hourlyRate > 0).map((value) => value.course.country)).slice(0, 2).join(", ")} {props.languageState.TUTOR_OVERVIEW_AND_MORE.translated}</p>
              </Tooltip> :
              <p><b>{props.languageState.TUTOR_OVERVIEW_BASED_IN.translated}</b>: {uniqueElementArray(props.tutorInfo.courseForTutor.filter(val => val.hourlyRate > 0).map((value) => value.course.country)).join(", ")}.</p>
          }
        </div>
      </Col>
    </Row>
  );
};

export default TutorOverview;