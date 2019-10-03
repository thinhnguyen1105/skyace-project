import * as React from 'react';
import { Form, Modal, Input, Row, Col, Select, Checkbox } from 'antd';
import 'react-big-calendar/lib/addons/dragAndDrop/styles.css';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { getPromoCodeService } from '../../service-proxies';
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

  submitCreateForm = async () => {
    await this.props.form.validateFields(async (err, _values) => {
      if(!err) {
        await this.props.createNewCode({
          ...this.props.createData,
          isActive: true
        });
        this.resetForm();
        this.props.toggleCreateCodeModal(false);
      }
    });
  }

  checkCodeExist = async (_rule, value, callback) => {
    const promoService = getPromoCodeService();
    const codeExisted = await promoService.findByName(value);
    if (codeExisted) {
      callback("Code has been used.");
    }
    callback();
  }

  render() {
    const { getFieldDecorator } = this.props.form;

    return (
      <Modal
        title='New Promo Code'
        okText='Save'
        style={{marginTop: '-40px'}}
        cancelText='Cancel'
        onOk={this.submitCreateForm}
        onCancel={() => {
          this.resetForm();
          this.props.toggleCreateCodeModal(false);
        }}
        visible={this.props.createModal}
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
                validateFirst: true
              })(
                <Input
                  onChange={event =>
                    this.props.changeCreateInput({
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
                      if (this.props.createData.type === '%') {
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
                validateFirst: true
              })(
                <Input
                  onChange={event =>
                    this.props.changeCreateInput({
                      value: (event.target as any).value
                    })
                  }
                  type="number"
                  placeholder="E.g 10"
                  min={0}
                />
              )}
            </FormItem>
          </Col>

          <Col span={4} style={{display: 'flex', alignItems: 'flex-start', paddingTop: '43px'}}>
            <Select style={{width: '100%'}} value={this.props.createData ? this.props.createData.type : '%'} onChange={(value) => this.props.changeCreateInput({
              type: value
            })}>
              <Select.Option key="1" value="%">%</Select.Option>
              <Select.Option key="2" value="$">$</Select.Option>
            </Select>
          </Col>

          <Col span={24}>
            <div style={{position: 'absolute', top: '10px', right: '10px'}}>
              <Checkbox checked={this.props.createData.isInfinite} onChange={(e) => this.props.changeCreateInput({
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
              })(
                <Input
                  disabled={this.props.createData.isInfinite}
                  onChange={event =>
                    this.props.changeCreateInput({
                      quantity: (event.target as any).value
                    })
                  }
                  type="number"
                  placeholder="E.g 100"
                  min={0}
                />
              )}
            </FormItem>
          </Col>

          <Col span={24}>
            <h4>{this.props.languageState.PROMO_CODE_VALIDITY_DATE.translated}</h4>
            <Col span={12} style={{paddingLeft: '0px'}}>
              <FormItem label={this.props.languageState.PROMO_CODE_FROM_LABEL.translated} style={{marginBottom: '14px'}}>
                {getFieldDecorator("startDate", {
                  rules: [
                    {required: true, message: this.props.languageState.PROMO_CODE_FROM_VALIDATE_1.translated},
                    {validator: (_rule, value, callback) => {
                      if(value) {
                        if (this.props.createData.endDate) {
                          if (new Date(value).getTime() > new Date(this.props.createData.endDate).getTime()) {
                            callback(this.props.languageState.PROMO_CODE_FROM_VALIDATE_2.translated)
                          }
                        }
                      }
                      callback();
                    }}
                  ],
                  validateTrigger: "onBlur",
                  validateFirst: true
                })(
                  <Input
                    onChange={event =>
                      this.props.changeCreateInput({
                        startDate: (event.target as any).value
                      })
                    }
                    type="date"
                  />
                )}
              </FormItem>
            </Col>
            <Col span={12} style={{paddingRight: '0px'}}>
              <FormItem label={this.props.languageState.PROMO_CODE_TO_LABEL.translated} style={{marginBottom: '14px'}}>
                {getFieldDecorator("endDate", {
                  rules: [
                    {required: true, message: this.props.languageState.PROMO_CODE_TO_VALIDATE_1.translated},
                    {validator: (_rule, value, callback) => {
                      if(value) {
                        if (this.props.createData.startDate) {
                          if (new Date(value).getTime() < new Date(this.props.createData.startDate).getTime()) {
                            callback(this.props.languageState.PROMO_CODE_TO_VALIDATE_2.translated)
                          }
                        }
                      }
                      callback();
                    }}
                  ],
                  validateTrigger: "onBlur",
                  validateFirst: true
                })(
                  <Input
                    onChange={event =>
                      this.props.changeCreateInput({
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
                validateFirst: true
              })(
                <Input.TextArea
                  onChange={event =>
                    this.props.changeCreateInput({
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
