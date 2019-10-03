import React from 'react';
import { Row, Col, Icon, Tooltip, Radio, Input, Form } from 'antd';
import moment from 'moment';
import { extendMoment } from 'moment-range';
import CountDown from './CountDown';
import { getPromoCodeService } from '../../service-proxies';
const extendedMoment = extendMoment(moment);

class BillingPreference extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      //
    };
  }

  // {this.props.profileState ? this.props.profileState.currency && this.props.profileState.currency.code ? this.props.profileState.currency.code : 'SGD' : 'SGD'

  checkCodeExist = async (_rule, value, callback) => {
    if (value) {
      const promoCodeService = getPromoCodeService();
      const promoCodeExisted = await promoCodeService.findByName(value);
      if (promoCodeExisted) {
        if (!promoCodeExisted.isActive) {
          callback("Found no promo code.");
        }
        else {
          if (new Date(promoCodeExisted.endDate).getTime() >= Date.now() && new Date(promoCodeExisted.startDate).getTime() <= Date.now()){
            if (promoCodeExisted.isInfinite || promoCodeExisted.quantity > 0) {
              this.props.changePromoCode(promoCodeExisted);
              callback();
            } else {
              callback('There is no promo code left.');
            }
          } else {
            callback('This promo code is out of date.');
          }
        }
      }
      callback("Found no promo code.");
    }
    callback();
  }

  calculateTotal = (total) => {
    let result;
    if (!this.props.promoCode) {
      result = (total / (this.props.profileState.currency && this.props.profileState.currency.exchangeRate ? this.props.profileState.currency.exchangeRate : 1));
    } else {
      result = this.props.promoCode.type === '%' ?  ((total * ( 100 - this.props.promoCode.value) / 100) / (this.props.profileState.currency && this.props.profileState.currency.exchangeRate ? this.props.profileState.currency.exchangeRate : 1)) : (total - this.props.promoCode.value > 0 ? ((total - this.props.promoCode.value) / (this.props.profileState.currency && this.props.profileState.currency.exchangeRate ? this.props.profileState.currency.exchangeRate : 1)) : 0) ;
    }
    return Math.round(result).toLocaleString();
  }

  calculateDiscount = () => {
    const total = Number((this.props.selectedCourse.hourlyRate * this.props.selectedCourse.course.hourPerSession * this.props.newBookings.length));
    let result;
    if (!this.props.promoCode) {
      result = 0;
    } else {
      result = this.props.promoCode.type === '%' ?  ((total * this.props.promoCode.value / 100) / (this.props.profileState.currency && this.props.profileState.currency.exchangeRate ? this.props.profileState.currency.exchangeRate : 1)) : (this.props.promoCode.value > 0 ? ((this.props.promoCode.value) / (this.props.profileState.currency && this.props.profileState.currency.exchangeRate ? this.props.profileState.currency.exchangeRate : 1)) : 0) ;
    }
    return Math.round(result).toLocaleString();
  }

  render() {
    const props = this.props;
    const { getFieldDecorator } = this.props.form;
    return (
      <div>
        <Row>
          <Col span={24} style={{textAlign: 'right', color: '#f5222d'}}>
            <CountDown
              onClosePaymentModal={props.onClosePaymentModal}
              clearState={props.clearState}
              openSessionExpiredModal={props.openSessionExpiredModal}
            />
          </Col>
        </Row>

        <Row type='flex' gutter={12} style ={{background: '#f4f5f5', borderRadius: 5, padding: '24px', marginBottom: '24px'}}>
          <Col span={4}>
            <img
              src={props.tutorInfo.imageUrl || '/static/default.png'}
              style={{width: '80%', display: 'block'}}
            />
            <p style={{textAlign: 'center', width: '80%', marginTop: '12px'}}>{props.tutorInfo.fullName ? props.tutorInfo.fullName : [props.tutorInfo.firstName, props.tutorInfo.lastName].join(' ')}</p>
          </Col>
          <Col span={20}>
            <table style={{border: '1px solid #e8e8e8', width: '100%', height: '100%'}}>
              <tbody>
                <tr style={{border: '1px solid #e8e8e8', height: '36px'}}>
                  <td style={{border: '1px solid #e8e8e8', padding: '0 16px', fontWeight: 'bold'}}>
                    <Icon type="book" /> {props.languageState.BILLING_PREFERENCE_SUBJECT.translated}
                  </td>
                  <td colSpan={3} style={{border: '1px solid #e8e8e8', padding: '0 16px', fontWeight: 'bold'}}>
                    {props.selectedCourse.course.country} - {props.selectedCourse.course.level} - {props.selectedCourse.course.grade} - {props.selectedCourse.course.subject}
                  </td>
                </tr>
                <tr style={{border: '1px solid #e8e8e8', height: '36px'}}>
                  <td style={{border: '1px solid #e8e8e8', padding: '0 16px', fontWeight: 'bold'}}>
                    <Icon type="calendar" /> {props.languageState.BILLING_PREFERENCE_PERIOD.translated}
                  </td>
                  <td colSpan={3} style={{border: '1px solid #e8e8e8', padding: '0 16px', fontWeight: 'bold'}}>
                    {props.newBookings[0] ? `${extendedMoment(props.newBookings[0].start).format('DD MMM YYYY')} - ${extendedMoment(props.newBookings[props.newBookings.length - 1].start).format('DD MMM YYYY')}` : ''}
                    <Tooltip
                      title={<div style={{maxHeight: '300px', overflowY: 'scroll'}}>
                        {props.newBookings.map((item, i) => (
                          <div key={i}>
                            <span>Lesson {i + 1}: </span>
                            <span>{extendedMoment(item.start).format('DD MMM YYYY')} | </span>
                            <span>{extendedMoment(item.start).format('HH:mm')} - {extendedMoment(item.end).format('HH:mm')}</span>
                          </div>
                        ))}
                      </div>}
                      overlayStyle={{minWidth: '300px', textAlign: 'center'}}
                      placement='rightTop'
                    >
                      <Icon type='info-circle' style={{marginLeft: '12px', fontSize: '18px', cursor: 'pointer'}} />
                    </Tooltip>
                  </td>
                </tr>
                <tr style={{border: '1px solid #e8e8e8', height: '36px'}}>
                  <td style={{border: '1px solid #e8e8e8', padding: '0 16px', fontWeight: 'bold'}}>
                    <Icon type="bars" /> {props.languageState.BILLING_PREFERENCE_NO_OF_LESSONS.translated}
                  </td>
                  <td style={{border: '1px solid #e8e8e8', padding: '0 16px', fontWeight: 'bold'}}>
                    {props.selectedCourse.course.session}
                  </td>
                  <td style={{border: '1px solid #e8e8e8', padding: '0 16px', fontWeight: 'bold'}}>
                    <Icon type="bars" /> {props.languageState.BILLING_PREFERENCE_HOURS_PER_LESSON.translated}
                  </td>
                  <td style={{border: '1px solid #e8e8e8', padding: '0 16px', fontWeight: 'bold'}}>
                    {props.selectedCourse.course.hourPerSession} { props.selectedCourse.course.hourPerSession > 1 ? 'hours' : 'hour'}
                  </td>
                </tr>
                <tr style={{border: '1px solid #e8e8e8', height: '36px'}}>
                  <td style={{border: '1px solid #e8e8e8', padding: '0 16px', fontWeight: 'bold'}}>
                    <Icon type="clock-circle-o" /> {props.languageState.BILLING_PREFERENCE_HOURLY_RATE.translated}
                  </td>
                  <td style={{border: '1px solid #e8e8e8', padding: '0 16px', fontWeight: 'bold'}}>
                    {props.profileState ? props.profileState.currency && props.profileState.currency.exchangeRate ? Math.round((props.selectedCourse.hourlyRate / props.profileState.currency.exchangeRate)).toLocaleString() : (props.selectedCourse.hourlyRate).toLocaleString() : (props.selectedCourse.hourlyRate).toLocaleString()} {props.profileState ? props.profileState.currency && props.profileState.currency.code ? props.profileState.currency.code : 'SGD' : 'SGD'} per hour
                  </td>
                  <td style={{border: '1px solid #e8e8e8', padding: '0 16px', fontWeight: 'bold'}}>
                    <Icon type="tags" /> {props.languageState.BILLING_PREFERENCE_FEE.translated}
                  </td>
                  <td style={{border: '1px solid #e8e8e8', padding: '0 16px', fontWeight: 'bold'}}>
                    {Math.round(Number((props.selectedCourse.hourlyRate * props.selectedCourse.course.hourPerSession * props.selectedCourse.course.session / (props.profileState.currency && props.profileState.currency.exchangeRate ? props.profileState.currency.exchangeRate : 1)).toFixed(2))).toLocaleString()} {props.profileState ? props.profileState.currency && props.profileState.currency.code ? props.profileState.currency.code : 'SGD' : 'SGD'}
                  </td>
                </tr>
              </tbody>
            </table>
          </Col>
          <Col xs={24}>
            <hr></hr>
            <Col xs={12} offset={12}>
              <Row type="flex">
                <Col xs={12}>
                  <Form>
                    <Form.Item label="Promo Code">
                      {getFieldDecorator('promoCode', {
                        rules: [
                          // { required: true, message: 'Please input your first name!', whitespace: true },
                          // { pattern: /.{2,15}/, message: "Name must be between 2 and 15 characters" }
                          { validator: this.checkCodeExist }
                        ],
                        initialValue: this.props.promoCodeInput,
                        validateTrigger: 'onBlur',
                        validateFirst: true,
                      })(
                        <Input type="text" placeholder="Enter your promo code (Optional)" onChange={(e) => this.props.changePromoCodeInput(e.target.value)}></Input>
                      )}
                    </Form.Item>
                  </Form>
                </Col>
                <Col xs={12} style={{display: 'flex', alignItems: 'center', justifyContent: 'flex-end'}}>
                  <div>
                    <h4>{props.languageState.BILLING_PREFERENCE_DISCOUNT.translated}: {this.calculateDiscount()} {props.profileState ? props.profileState.currency && props.profileState.currency.code ? props.profileState.currency.code : 'SGD' : 'SGD'}</h4>
                    <h4>{props.languageState.BILLING_PREFERENCE_TOTAL.translated}: {this.calculateTotal(Number((this.props.selectedCourse.hourlyRate * this.props.selectedCourse.course.hourPerSession * this.props.newBookings.length)))} {props.profileState ? props.profileState.currency && props.profileState.currency.code ? props.profileState.currency.code : 'SGD' : 'SGD'}</h4>
                  </div>
                </Col>
              </Row>
            </Col>
          </Col>
        </Row>
  
        <Row type='flex' gutter={12}>
          <Col span={24}>
            <h2>{props.languageState.BILLING_PREFERENCE_TITLE.translated}</h2>
            <hr />
          </Col>
  
          <Col span={24} style={{marginTop: '12px'}}>
            <p>{props.languageState.BILLING_PREFERENCE_PAYMENT_METHOD.translated} </p>
            <Radio.Group
              onChange={(e) => props.paymentOptionChange({paymentOption: e.target.value})}
              value={props.paymentOption}
            >
              <Radio style={{display: 'block', height: '30px', lineHeight: '30px'}} value='fullPay'>
                {props.languageState.BILLING_PREFERENCE_PAY_FULL.translated} - {props.newBookings.length} lessons ({this.calculateTotal(Number((this.props.selectedCourse.hourlyRate * this.props.selectedCourse.course.hourPerSession * this.props.newBookings.length)))} {props.profileState ? props.profileState.currency && props.profileState.currency.code ? props.profileState.currency.code : 'SGD' : 'SGD'})
              </Radio>
              {props.newBookings.length > props.selectedCourse.course.session && (
                <Radio style={{display: 'block', height: '30px', lineHeight: '30px'}} value='partiallyPay'>
                  {props.languageState.BILLING_PREFERENCE_PAY_EVERY.translated} {props.selectedCourse.course.session} lessons ({this.calculateTotal(Number((props.selectedCourse.hourlyRate * props.selectedCourse.course.hourPerSession * props.selectedCourse.course.session)))} {props.profileState ? props.profileState.currency && props.profileState.currency.code ? props.profileState.currency.code : 'SGD' : 'SGD'})
                </Radio>
              )}
            </Radio.Group>
          </Col>
          
          {props.newBookings.length > props.selectedCourse.course.session && (
            <Col span={24} style={{marginTop: '36px'}}>
              <p>
                {props.languageState.BILLING_PREFERENCE_NOTE_1.translated}
                <br />
                {props.languageState.BILLING_PREFERENCE_NOTE_2.translated}
              </p>
            </Col>
          )}
        </Row>
      </div>
    );
  }
}
export default Form.create()(BillingPreference);