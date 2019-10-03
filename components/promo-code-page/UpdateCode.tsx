import * as React from 'react';
import { Form, Modal, Input, Row, Col, Select, Checkbox } from 'antd';
import 'react-big-calendar/lib/addons/dragAndDrop/styles.css';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { getPromoCodeService } from '../../service-proxies';
import moment from 'moment';
const FormItem = Form.Item;


class AddCode extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      
    };
  }

  resetForm = () => {
    this.props.clearInput();
    this.props.form.resetFields();
  }

  submitUpdateForm = async () => {
    await this.props.form.validateFields(async (err, _values) => {
      if(!err) {
        await this.props.updateCode(this.props.updateData);
        this.resetForm();
        this.props.closeUpdateModal();
      }
    });
  }

  checkCodeExist = async (_rule, value, callback) => {
    const promoService = getPromoCodeService();
    const codeExisted = await (this.props.selected && this.props.selected.name ? promoService.findByNameExcept(value, this.props.selected.name) : promoService.findByName(value));
    if (codeExisted) {
      callback(this.props.languageState.PROMO_CODE_CHECK_CODE_ERROR.translated);
    }
    callback();
  }

  render() {
    const { getFieldDecorator } = this.props.form;

    return (
      <Modal
        title={this.props.languageState.PROMO_CODE_EDIT_MODAL.translated}
        okText='Save'
        style={{marginTop: '-40px'}}
        cancelText='Cancel'
        onOk={this.submitUpdateForm}
        onCancel={() => {
          this.resetForm();
          this.props.closeUpdateModal();
        }}
        visible={this.props.updateModal}
      >
        <Row gutter={24} type='flex'>
          <Col span={24}>
            <FormItem label={this.props.languageState.PROMO_CODE_NAME_LABEL.translated} style={{marginBottom: '0px'}}>
              {getFieldDecorator("name", {
                rules: [
                  { required: true, message: this.props.languageState.PROMO_CODE_NAME_VALIDATE.translated },
                  { validator: this.checkCodeExist }
                ],
                validateTrigger: "onBlur",
                validateFirst: true,
                initialValue: this.props.selected.name
              })(
                <Input
                  onChange={event =>
                    this.props.changeUpdateInput({
                      name: (event.target as any).value
                    })
                  }
                  type="text"
                  placeholder="E.g SKYACE10"
                />
              )}
            </FormItem>
          </Col>

          <Col span={20}>
            <FormItem label={this.props.languageState.PROMO_CODE_VALUE_LABEL.translated} style={{marginBottom: '0'}}>
              {getFieldDecorator("value", {
                rules: [
                  {required: true, message: this.props.languageState.PROMO_CODE_VALUE_VALIDATE_1.translated},
                  {validator: (_rule, value, callback) => {
                    if(value) {
                      if (this.props.updateData.type === '%') {
                        if (value > 100) {
                          callback(this.props.languageState.PROMO_CODE_VALUE_VALIDATE_2.translated);
                        } else if (value < 0) {
                          callback(this.props.languageState.PROMO_CODE_VALUE_VALIDATE_3.translated);
                        }
                        callback();
                      } else if (!this.props.updateData.type && this.props.selected.type === '%') {
                        if (value > 100) {
                          callback(this.props.languageState.PROMO_CODE_VALUE_VALIDATE_2.translated);
                        } else if (value < 0) {
                          callback(this.props.languageState.PROMO_CODE_VALUE_VALIDATE_3.translated);
                        }
                        callback();
                      }
                    }
                    callback();
                  }}
                ],
                validateTrigger: "onBlur",
                validateFirst: true,
                initialValue: this.props.selected.value
              })(
                <Input
                  onChange={event =>
                    this.props.changeUpdateInput({
                      value: (event.target as any).value
                    })
                  }
                  type="number"
                  placeholder="E.g 10"
                />
              )}
            </FormItem>
          </Col>

          <Col span={4} style={{display: 'flex', alignItems: 'flex-start', paddingTop: '43px'}}>
            <Select style={{width: '100%'}} value={this.props.updateData && this.props.updateData.type ? this.props.updateData.type : this.props.selected.type} onChange={(value) => this.props.changeUpdateInput({
              type: value
            })}>
              <Select.Option key="1" value="%">%</Select.Option>
              <Select.Option key="2" value="$">$</Select.Option>
            </Select>
          </Col>

          <Col span={24}>
            <div style={{position: 'absolute', top: '10px', right: '10px'}}>
              <Checkbox checked={this.props.updateData && this.props.updateData.isInfinite !== undefined ? this.props.updateData.isInfinite : this.props.selected.isInfinite} onChange={(e) => this.props.changeUpdateInput({
                isInfinite: e.target.checked
              })}>{this.props.languageState.PROMO_CODE_INFINITE_QUANTITY.translated}</Checkbox>
            </div>
            <FormItem label={this.props.languageState.PROMO_CODE_QUANTITY_LABEL.translated} style={{marginBottom: '14px'}}>
              {getFieldDecorator("quantity", {
                rules: [
                  {validator: (_rule, value, callback) => {
                    if(value) {
                      if (value < 0) {
                        callback(this.props.languageState.PROMO_CODE_QUANTITY_VALIDATE.translated);
                      }
                      callback();
                    }
                    callback();
                  }}
                ],
                initialValue: this.props.selected.quantity
              })(
                <Input
                  disabled={this.props.updateData.isInfinite}
                  onChange={event =>
                    this.props.changeUpdateInput({
                      quantity: (event.target as any).value
                    })
                  }
                  type="number"
                  placeholder="E.g 100"
                />
              )}
            </FormItem>
          </Col>

          <Col span={24}>
            <h4>{this.props.languageState.PROMO_CODE_VALIDITY_DATE.translated}</h4>
            <Col span={12}>
              <FormItem label={this.props.languageState.PROMO_CODE_FROM_LABEL.translated} style={{marginBottom: '14px'}}>
                {getFieldDecorator("startDate", {
                  rules: [
                    {required: true, message: this.props.languageState.PROMO_CODE_FROM_VALIDATE_1.translated},
                    {validator: (_rule, value, callback) => {
                      if(value) {
                        if (this.props.updateData.endDate || this.props.selected.endDate) {
                          const endDate = this.props.updateData.endDate ? this.props.updateData.endDate : this.props.selected.endDate;
                          if (new Date(value).getTime() > new Date(endDate).getTime()) {
                            callback(this.props.languageState.PROMO_CODE_FROM_VALIDATE_2.translated)
                          }
                        }
                      }
                      callback();
                    }}
                  ],
                  validateTrigger: "onBlur",
                  validateFirst: true,
                  initialValue: moment(this.props.selected.startDate).format('YYYY-MM-DD')
                })(
                  <Input
                    onChange={event =>
                      this.props.changeUpdateInput({
                        startDate: (event.target as any).value
                      })
                    }
                    type="date"
                  />
                )}
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem label={this.props.languageState.PROMO_CODE_TO_LABEL.translated} style={{marginBottom: '14px'}}>
                {getFieldDecorator("endDate", {
                  rules: [
                    {required: true, message: this.props.languageState.PROMO_CODE_TO_VALIDATE_1.translated},
                    {validator: (_rule, value, callback) => {
                      if(value) {
                        if (this.props.updateData.startDate || this.props.selected.startDate) {
                          const startDate = this.props.updateData.startDate ? this.props.updateData.startDate : this.props.selected.startDate;
                          if (new Date(value).getTime() < new Date(startDate).getTime()) {
                            callback(this.props.languageState.PROMO_CODE_TO_VALIDATE_2.translated)
                          }
                        }
                      }
                      callback();
                    }}
                  ],
                  validateTrigger: "onBlur",
                  validateFirst: true,
                  initialValue: moment(this.props.selected.endDate).format('YYYY-MM-DD')
                })(
                  <Input
                    onChange={event =>
                      this.props.changeUpdateInput({
                        endDate: (event.target as any).value
                      })
                    }
                    type="date"
                  />
                )}
              </FormItem>
            </Col>
          </Col>

          <Col span={24}>
            <FormItem label={this.props.languageState.PROMO_CODE_DESCRIPTION_LABEL.translated} style={{marginBottom: '14px'}}>
              {getFieldDecorator("description", {
                rules: [

                ],
                validateTrigger: "onBlur",
                validateFirst: true,
                initialValue: this.props.selected.description
              })(
                <Input.TextArea
                  onChange={event =>
                    this.props.changeUpdateInput({
                      description: (event.target as any).value
                    })
                  }
                />
              )}
            </FormItem>
          </Col>
        </Row>
      </Modal>
    );
  }
}

export default Form.create()(AddCode);
