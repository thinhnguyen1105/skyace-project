import * as React from 'react';
import { Form, Modal, Layout, Select, Row, Col, Input, Button, Upload, Icon, Menu, Table, message, AutoComplete, DatePicker } from 'antd';
import './tutor-preference.css';
import initStore from '../rematch/store';
import withRematch from '../rematch/withRematch';
import { dataPhone } from '../data_common/CountryCodes';
import { getUsersService, getCourseService, getCurrencyService, getMetadataService, getCourseForTutorService } from '../service-proxies';
import dynamic from "next/dynamic";
import { timeZone } from '../data_common/timezone';
import { dataCountry } from '../data_common/country';
const AvatarEditor: any = dynamic(import("react-avatar-editor"));
import config from '../api/config';
import moment from 'moment';
import UserLayout from '../layout/UserLayout';
import * as Scroll from 'react-scroll'
import { Element, scroller } from 'react-scroll';
const { RangePicker } = DatePicker;
const FormItem = Form.Item;
const Option = Select.Option;

class EditProfilePage extends React.Component<any, any> {
  static async getInitialProps(props: any) {
    const profilePageState = props.store.getState().profileModel;
    const usersService = getUsersService();
    const coursesService = getCourseService();
    const currencyService = getCurrencyService();
    var result: any = await usersService.findTutorById(
      profilePageState._id
    );
    const courses = await usersService.findTutorCoursesById(
      profilePageState._id
    );
    props.store.dispatch.editProfilePageModel.fetchCoursesSuccess({ result: courses });

    const coursesAvailableLookup = await coursesService.getAllCourses();
    props.store.dispatch.editProfilePageModel.fetchCoursesLookupSuccess({ result: coursesAvailableLookup });

    const currencies = await currencyService.getAllCurrencies();
    props.store.dispatch.editProfilePageModel.fetchCurrenciesSuccess(currencies);

    if (!result.currency || !result.currentlyBasedIn || !result.timeZone) {
      const ip: any = await usersService.getIP();
      const geolocation: any = await usersService.getUserGeolocation(ip.ip);
      var filterCurrency = currencies.results.filter((val) => val.code.toUpperCase() === geolocation.currency.code.toUpperCase());
      var updatedData = {
        _id: result._id,
      } as any;

      var updateCurrency = result.currency ? result.currency._id : (filterCurrency.length ? filterCurrency[0]._id : "");
      if (updateCurrency) {
        updatedData.currency = updateCurrency;
      }
      var currentlyBasedIn = result.currentlyBasedIn || geolocation.country_name;
      if (currentlyBasedIn) {
        updatedData.currentlyBasedIn = currentlyBasedIn;
      }

      var toGMTString = (d: number) => {
        d = Number(d);
        if (d === 0) return '';
        var h = d > 0 ? Math.floor(d) : Math.floor(d) + 1;
        var m = d - Math.floor(d);

        var hDisplay = (h >= 10 || h <= -10) ? h.toString() : ('0' + h);
        var mDisplay = m > 10 ? m.toString() : ('0' + m);
        return (d > 0 ? "+" : "-") + hDisplay + ':' + mDisplay;
      }

      var timeZone = result.timeZone || (geolocation.time_zone ? {
        name: geolocation.time_zone.name,
        offset: geolocation.time_zone.offset,
        gmt: `(GMT${toGMTString(geolocation.time_zone.offset)})`
      } : null);
      if (timeZone) {
        updatedData.timeZone = timeZone;
      }
      await usersService.update(updatedData as any);
      result = { ...result, ...updatedData, currency: filterCurrency.length ? filterCurrency[0] : {} };
    }
    //change phoneID 
    var findDataPhone = [] as any;
    if (result.phone) {
      findDataPhone = dataPhone.filter((item) => {
        if (item.dial_code === result.phone.phoneID) {
          return item;
        }
      })
      if (findDataPhone.length) {
        // result.phone.phoneID = findDataPhone[0].name + ' ' + '(' + findDataPhone[0].dial_code + ')';
        result.phone.phoneID = findDataPhone[0].dial_code;
      } else {
        // result.phone.phoneID = 'Afghanistan' + ' ' + '(' + '+93' + ')';
        result.phone.phoneID = '+93';
      }
    } else {
      result.phone = {
        // phoneID: 'Afghanistan' + ' ' + '(' + '+93' + ')',
        phoneID: '+93',
      }
    }
    props.store.dispatch.editProfilePageModel.fetchDataSuccess({ result });
  }
  checkPhoneID = () => {
    const result = dataPhone.filter((country) => {
      if (country.dial_code === this.props.phoneID) {
        return country.dial_code
      }
    });
    if (result.length !== 0) {

    } else {
      message.error(this.props.languageState.EDIT_PROFILE_STUDENT_PAGE_ERROR_PHONE_ID.translated, 4);
    }
    this.props.userInfoChange({ phoneIDSave: result[0].dial_code });
  }


  onSaveProfileSubmit = async (e) => {
    e.preventDefault();
    await this.checkPhoneID();
    if (this.props.fileList[0] === undefined) {
      this.props.form.validateFieldsAndScroll((err) => {
        if (!err) {
          this.props.updateUser({
            userInfo: {
              _id: this.props.profileState._id,
              firstName: this.props.firstName,
              lastName: this.props.lastName,
              phone: {
                phoneNumber: this.props.phoneNumber,
                phoneID: this.props.phoneIDSave
              },
              hourlyPerSessionTrial: this.props.hourlyPerSessionTrial,
              timeZone: this.props.timeZone,
              currency: this.props.currencyInput ? this.props.currencyInput : this.props.currency._id,
              dob: this.props.dob,
              imageUrl: this.props.imageUrl,
              gender: this.props.gender,
              "biography.nationality": this.props.biography.nationality,
              currentAcademicLevel: this.props.currentAcademicLevel,
              nationalID: this.props.nationalID,
              currentlyBasedIn: this.props.currentlyBasedIn,
              paypalEmail: this.props.paypalEmail,
              paymentMethod: this.props.paymentMethod,
              bankName: this.props.bankName,
              accountHolderName: this.props.accountHolderName,
              accountNumber: this.props.accountNumber,
            }
          });
        } else {
          message.error(this.props.languageState.EDIT_PROFILE_STUDENT_PAGE_SOMETHING_WENT_WRONG.translated, 4);
        }
      });
    } else {
      await this.props.onSaveImageUrl({
        imageUrl: `/static/images/users/image-${this.props.profileState._id}.${this.props.fileList[0].type.slice(6, 10)}`
      });
      let formData = new FormData();
      this.props.fileList.forEach((file) => {
        formData.set('image', file);
      });
      await fetch(
        `${config.nextjs.apiUrl}/images/upload/users/${this.props.profileState._id}`, {
          method: 'POST',
          headers: {
            'authorization': this.props.profileState.token,
          },
          body: formData,
        }
      );
      this.props.form.validateFieldsAndScroll((err) => {
        if (!err) {
          this.props.updateUser({
            userInfo: {
              _id: this.props.profileState._id,
              firstName: this.props.firstName,
              lastName: this.props.lastName,
              phone: {
                phoneNumber: this.props.phoneNumber,
                phoneID: this.props.phoneID
              },
              timeZone: this.props.timeZone,
              trialSession: this.props.trialSession,
              currency: this.props.currencyInput ? this.props.currencyInput : this.props.currency._id,
              dob: this.props.dob,
              imageUrl: this.props.imageUrl,
              gender: this.props.gender,
              "biography.nationality": this.props.biography.nationality,
              currentAcademicLevel: this.props.currentAcademicLevel,
              nationalID: this.props.nationalID,
              currentlyBasedIn: this.props.currentlyBasedIn,
            }
          });
        } else {
          message.error(this.props.languageState.EDIT_PROFILE_STUDENT_PAGE_SOMETHING_WENT_WRONG.translated, 4);
        }
      });
    }
  }
  onSavePasswordSubmit = async (e) => {
    e.preventDefault();

    if (this.props.password === '') {
      message.error('Please input your password! ', 4);
    } else {
      this.props.form.validateFields((err, _values) => {
        if (!err) {
          this.props.updateUser({
            userInfo: {
              _id: this.props.profileState._id,
              password: this.props.password,
            }
          });
          this.props.closeChangePasswordModal();
        } else {
          message.error(this.props.languageState.EDIT_PROFILE_STUDENT_PAGE_SOMETHING_WENT_WRONG.translated, 4);
        }
      });
    }
  }
  onSaveBiographySubmit = (e) => {
    e.preventDefault();
    this.props.updateUser({
      userInfo: {
        _id: this.props.profileState._id,
        biography: {
          language: this.props.biography.language,
          nationality: this.props.biography.nationality,
          aboutMe: this.props.biography.aboutMe,
          secondaryLanguage: this.props.biography.secondaryLanguage
        }
      }
    });
  }
  onSaveEducationSubmit = (e) => {
    e.preventDefault();
    this.props.updateUser({
      userInfo: {
        _id: this.props.profileState._id,
        education: {
          highestEducation: this.props.education.highestEducation,
          major: this.props.education.major,
          university: this.props.education.university,
          fileListDocument: this.props.education.fileListDocument
        }
      }
    });
  }
  onSaveTeacherExperienceSubmit = (e) => {
    e.preventDefault();
    this.props.updateUser({
      userInfo: {
        _id: this.props.profileState._id,
        teacherExperience: this.props.teacherExperience.map((item) => {
          return {
            start: item.year[0],
            end: item.year[1],
            experience: item.experience,
            index: item.index
          }
        })
      }
    });
  }

  getBase64 = (img, callback) => {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result));
    reader.readAsDataURL(img);
  }

  handleUploadChange = (index, info) => {
    if (info.file.size > 10000000) {
      message.error(this.props.languageState.EDIT_PROFILE_TUTOR_PAGE_UPLOAD_VALIDATE.translated, 4);
    } else {
      let fileList = info.fileList;
      // 1. Limit the number of uploaded files
      //    Only to show two recent uploaded files, and old ones will be replaced by the new
      fileList = fileList.slice(-1);

      // 2. read from response and show file link
      fileList = fileList.map((file) => {
        if (file.response) {
          // Component will show file.url as link
          file.url = file.response.url;
        }
        return file;
      });

      // 3. filter successfully uploaded files according to response from server
      fileList = fileList.filter((file) => {
        if (file.response) {
          return file.response.status === 'success';
        }
        return true;
      });

      switch (index) {
        case 1:
          this.props.onGetFileDocument({ document1: fileList });
          break;
        case 2:
          this.props.onGetFileDocument({ document2: fileList });
          break;
        case 3:
          this.props.onGetFileDocument({ document3: fileList });
          break;
        case 4:
          this.props.onGetFileDocument({ document4: fileList });
          break;
      }
    }

  }

  searchCourse = async () => {
    const filteredCourses = await getCourseService().filterCourse(this.props.searchInput);
    this.props.fetchCoursesLookupSuccess({ result: filteredCourses });
  }

  createTeacherSubject = async (courseId) => {
    const input = {
      course: courseId,
      hourlyRate: 0,
      tutor: this.props.profileState._id
    };
    const result = await getUsersService().createCourseForTutor(input);
    this.props.createCourseForTutorSuccess(result);
    this.props.toggleCreateCourseModal(false);
  }

  validateDate = (str) => {
    if (str) {
      var date = new Date(str);
      if (date instanceof Date && !isNaN(date as any)) {
        return str;
      } else {
        return false;
      }
    } else return false;
  }

  updateTeacherSubject = async (_id, hourlyRate) => {
    const input = {
      _id,
      hourlyRate
    };
    const result = await getUsersService().updateCourseForTutor(input);
    this.props.updateCourseForTutorSuccess(result);
  }

  updateManyTeacherSubject = async () => {
    const updateArrays = this.props.hourlyRateInputs.filter((val) => val.value > 0);
    var promiseArray = updateArrays.map((val) => {
      return this.updateTeacherSubject(val._id, val.value);
    });
    Promise.all(promiseArray).then(() => {
      this.props.clearhourlyRateInputs();
    });
  }

  openCreateSubjectModal = () => {
    this.props.toggleCreateCourseModal(true);
  }

  hideCreateSubjectModal = () => {
    this.props.toggleCreateCourseModal(false);
  }

  onChangeTimeZone = (input: string) => {
    const timeZoneArray = timeZone.filter((val) => val.name === input);
    const timeZoneFiltered = timeZoneArray.length ? timeZoneArray[0] : null;
    if (timeZoneFiltered) {
      this.props.userInfoChange({
        timeZone: {
          name: timeZoneFiltered.name,
          gmt: timeZoneFiltered.gmt,
          offset: timeZoneFiltered.offset
        }
      })
    }
  }

  onChangeCurrency = (input: string) => {
    const currencyArray = this.props.currencies.filter((val) => val._id === input);
    const currencyFiltered = currencyArray.length ? currencyArray[0] : null;
    if (currencyFiltered) {
      this.props.userInfoChange({ currency: currencyFiltered });
    }
  }

  validateTutorDoB = (_rule, value, callback) => {
    if (value) {
      var dateObj = new Date(value);
      if (dateObj instanceof Date && !isNaN(dateObj as any)) {
        if (moment(dateObj).year() < 1900) {
          callback(this.props.languageState.EDIT_PROFILE_STUDENT_PAGE_VALIDATE_DOB_1.translated);
        }
        else {
          var age = this.calculateAge(new Date(value));
          if (age < 18) {
            callback(this.props.languageState.EDIT_PROFILE_TUTOR_PAGE_VALIDATE_DOB_1.translated);
          } else {
            callback();
          }
        }
      } else {
        callback(this.props.languageState.EDIT_PROFILE_TUTOR_PAGE_VALIDATE_DOB_2.translated);
      }
    } else {
      callback(this.props.languageState.EDIT_PROFILE_TUTOR_PAGE_VALIDATE_DOB_3.translated);
    }
  }

  calculateAge = (birthday) => {
    var ageDifMs = Date.now() - birthday.getTime();
    var ageDate = new Date(ageDifMs);
    return ageDate.getUTCFullYear() - 1970;
  }

  changeBirthday = (input) => {
    this.props.form.setFieldsValue({ 'dayofbirth': moment(input).format('DD MMM YYYY') })
    this.props.form.validateFields(['dayofbirth'], (err, _val) => {
      if (err) {
        console.log(err);
      }
    });
    this.props.userInfoChange({ dob: new Date(input as any) })
  }

  onClickProfile = () => {
    const scroll = Scroll.animateScroll;

    scroll.scrollTo(0, {
      duration: 500,
      delay: 100,
      smooth: true,
      containerId: 'ContainerElementID',
      offset: 50,
    });
  }

  onClickAboutMe = () => {
    scroller.scrollTo('aboutMe', {
      duration: 800,
      delay: 0,
      smooth: 'easeInOutQuart',
      offset: -50,
    });
  }

  onClickEducation = () => {
    scroller.scrollTo('education', {
      duration: 800,
      delay: 0,
      smooth: 'easeInOutQuart',
      offset: -50,
    });
  }

  onClickExperience = () => {
    scroller.scrollTo('experience', {
      duration: 800,
      delay: 0,
      smooth: 'easeInOutQuart',
      offset: -50,
    });
  }

  checkOnlyNumber = (value) => {
    if (/^[0-9]*$/.test(value)) {
      this.props.userInfoChange({ accountNumber: value })
    } else {
      return;
    }
  }

  render() {
    const props = {
      name: 'file',
      headers: {
        authorization: 'authorization-text',
      },
      beforeUpload: (_file) => {
        return false;
      }
    };
    const columnsTeacherExperience = [
      {
        title: `Period`,
        dataIndex: 'year',
        key: 'year',
        width: '30%',
        render: (_value, record, index) => {
          return (
            <RangePicker
              placeholder={['Start month', 'End month']}
              format="MMM-YYYY"
              value={record.year.map(item => { return moment(item) })}
              mode={['month', 'month']}
              onPanelChange={(value, mode) => {
                this.props.handleYearChange({ value, mode, index })
              }}
            />
          )
        }
      },
      {
        title: `Experience`,
        dataIndex: 'experience',
        key: 'experience',
        width: '65%',
        render: (_value, record, index) => (
          <Input placeholder='Experience' value={record.experience}
            onChange={(event) => {
              this.props.handleExperienceChange({ event, index });
            }}
          />
        )
      },
      {
        title: ``,
        dataIndex: 'delete',
        key: 'delete',
        width: '5%',
        render: (_value, _record, index) => (
          <Button className='dynamic-delete-button' onClick={(event) => this.props.handleDeleteTeacherExperience({ event, index })}><Icon type='delete'></Icon></Button>
        )
      },
    ];
    const { getFieldDecorator } = this.props.form;

    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 8 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
      },
    };
    const tailFormItemLayout = {
      wrapperCol: {
        xs: {
          span: 24,
          offset: 0,
        },
        sm: {
          span: 16,
          offset: 8,
        },
      },
    };
    const sortedDataPhone = dataPhone.sort((a, b) => {
      if (a.name < b.name) {
        return -1;
      }
      if (a.name > b.name) {
        return 1;
      }
      return 0;
    });
    const sortedDataCountry = dataCountry.sort((a, b) => {
      if (a.countryName < b.countryName) {
        return -1;
      }
      if (a.countryName > b.countryName) {
        return 1;
      }
      return 0;
    });
    const sortDataNationality = this.props.dataLookupState.findaTutor.nationality.sort((a, b) => {
      if (a.name < b.name) {
        return -1;
      }
      if (a.name > b.name) {
        return 1;
      }
      return 0;
    });
    const sortedDataTimeZone = timeZone.concat({
      gmt: this.props.timeZone.gmt,
      name: this.props.timeZone.name,
      offset: this.props.timeZone.offset
    } as any).sort((a, b) => {
      if (a.gmt < b.gmt) {
        return -1;
      }
      if (a.gmt > b.gmt) {
        return 1;
      }
      return 0;
    });
    const dataSourcePhoneID = sortedDataPhone.map((country) => {
      return {
        value: country.dial_code,
        text: country.name + ' ' + '(' + country.dial_code + ')'
      };
    });

    const phoneIdSelector = () => {
      return (
        <AutoComplete
          value={this.props.phoneID}
          dataSource={dataSourcePhoneID}
          placeholder="Country Code"
          filterOption={(inputValue, option) => (option as any).props.children.toString().toUpperCase().indexOf(inputValue.toUpperCase()) !== -1}
          onChange={value => this.props.userInfoChange({ phoneID: value })}
          style={{ width: 200, height: 30 }}
        />
      );
    };

    return (
      <UserLayout profileState={this.props.profileState} profileReducers={this.props.profileReducers} editProfilePageState={this.props} languageState={this.props.languageState}>
        <Layout className='edit-profile-user' style={{ background: '#fff', padding: '0px 30px 20px 30px' }}>
          <Menu mode='horizontal' style={{ marginBottom: '30px', margin: '0px -40px', position: 'sticky', top: '0px', zIndex: 1 }}>
            <Menu.Item key='profile'><a onClick={this.onClickProfile} ><b>{this.props.languageState.EDIT_PROFILE_TUTOR_PAGE_PROFILE.translated}</b></a>
            </Menu.Item>

            <Menu.Item key='biography'><a onClick={this.onClickAboutMe}><b>{this.props.languageState.EDIT_PROFILE_TUTOR_PAGE_ABOUT_ME.translated}</b></a>
            </Menu.Item>

            <Menu.Item key='my-education'><a onClick={this.onClickEducation}><b>{this.props.languageState.EDIT_PROFILE_TUTOR_PAGE_EDUCATION.translated}</b></a>
            </Menu.Item>

            <Menu.Item key='teaching-experience'><a onClick={this.onClickEducation}><b>{this.props.languageState.EDIT_PROFILE_TUTOR_PAGE_EXPERIENCE.translated}</b></a>
            </Menu.Item>
          </Menu>

          <Layout style={{ background: 'white', marginBottom: 50 }}>
            <Row className='edit-base-profile'>
              <Row>
                <Layout className='white-theme' style={{ marginTop: 0 }}>
                  <h1 id='profile' style={{ fontWeight: 'bold' }}>{this.props.languageState.EDIT_PROFILE_TUTOR_PAGE_PROFILE.translated}</h1>
                  <AvatarEditor
                    image={this.props.fileList.length === 0 ? this.props.imageUrl : this.props.imageTemporary}
                    width={200}
                    height={200}
                    border={20}
                    scale={this.props.avatarZoomValue}
                    rotate={this.props.avatarRotateValue}
                    borderRadius={100}
                  />
                  <Upload
                    className='upload-button'
                    beforeUpload={(file) => {
                      this.props.onChangeFileList({ file });
                      const isLt2M = file.size / 1024 / 1024 < 2;
                      if (!(/\.(gif|jpg|jpeg|tiff|png)$/i).test(file.name)) {
                        message.error(this.props.languageState.EDIT_PROFILE_STUDENT_PAGE_UPLOAD_VALIDATE_1.translated, 4);
                      } else if (!isLt2M) {
                        message.error(this.props.languageState.EDIT_PROFILE_STUDENT_PAGE_UPLOAD_VALIDATE_2.translated, 4);
                      } else {
                        this.getBase64(file, imageUrl =>
                          this.props.handleBeforeUpload({ imageUrlBased64: imageUrl })
                        );
                      }
                      return false;
                    }}
                    showUploadList={false}
                  >
                    <Button>
                      <Icon type='upload' /> {this.props.languageState.EDIT_PROFILE_STUDENT_PAGE_CLICK_TO_UPLOAD.translated}
                    </Button>
                  </Upload>
                </Layout>
              </Row>
              <Row>
                <Layout className='white-theme'>
                  <Form>
                    <Col span={11}>
                      <FormItem {...formItemLayout} label={this.props.languageState.EDIT_PROFILE_STUDENT_PAGE_GIVEN_NAME.translated}>
                        {getFieldDecorator('firstName', {
                          rules: [
                            { required: true, message: this.props.languageState.EDIT_PROFILE_STUDENT_PAGE_GIVEN_NAME_VALIDATE_1.translated, whitespace: true },
                            { pattern: /.{2,15}/, message: this.props.languageState.EDIT_PROFILE_STUDENT_PAGE_GIVEN_NAME_VALIDATE_2.translated }
                          ],
                          initialValue: this.props.firstName,
                          validateTrigger: 'onBlur',
                          validateFirst: true,
                        })(
                          <Input
                            name='firstName'
                            placeholder={this.props.languageState.EDIT_PROFILE_STUDENT_PAGE_GIVEN_NAME.translated}
                            onChange={(e) => this.props.userInfoChange({ firstName: e.target.value })}
                          />
                        )}
                      </FormItem>
                      <FormItem {...formItemLayout} label={this.props.languageState.EDIT_PROFILE_STUDENT_PAGE_EMAIL_ADDRESS.translated}>
                        {getFieldDecorator('emailAddress', {
                          rules: [
                            { required: true, message: this.props.languageState.EDIT_PROFILE_STUDENT_PAGE_EMAIL_ADDRESS_VALIDATE.translated, whitespace: true }
                          ],
                          initialValue: this.props.email,
                          validateTrigger: 'onBlur',
                          validateFirst: true,
                        })(
                          <Input
                            name='emailAddress'
                            placeholder={this.props.languageState.EDIT_PROFILE_STUDENT_PAGE_EMAIL_ADDRESS.translated}
                            disabled={true}
                          />
                        )}
                      </FormItem>
                      <FormItem {...formItemLayout} label={this.props.languageState.EDIT_PROFILE_STUDENT_PAGE_GENDER.translated}>
                        {getFieldDecorator('gender', {
                          initialValue: this.props.gender,
                        })(
                          <Select
                            placeholder={this.props.languageState.EDIT_PROFILE_STUDENT_PAGE_GENDER_PLACEHOLDER.translated}
                            onChange={(value) => this.props.userInfoChange({ gender: value })}
                          >
                            <Option key='male' value='male'>{this.props.languageState.EDIT_PROFILE_STUDENT_PAGE_GENDER_MALE.translated}</Option>
                            <Option key='female' value='female'>{this.props.languageState.EDIT_PROFILE_STUDENT_PAGE_GENDER_FEMALE.translated}</Option>
                          </Select>
                        )}
                      </FormItem>
                      <FormItem {...formItemLayout} label={this.props.languageState.EDIT_PROFILE_STUDENT_PAGE_NATIONALITY.translated}>
                        {getFieldDecorator('nationality', {
                          initialValue: this.props.biography.nationality,
                        })(
                          <AutoComplete
                            dataSource={sortDataNationality ? sortDataNationality.map((item) => item.name) : []}
                            placeholder={this.props.languageState.EDIT_PROFILE_STUDENT_PAGE_NATIONALITY_PLACEHOLDER.translated}
                            filterOption={(inputValue, option) => (option as any).props.children.toString().toUpperCase().indexOf(inputValue.toUpperCase()) !== -1}
                            onChange={(value) => this.props.userInfoChange({ biography: { language: this.props.biography.language, nationality: value, aboutMe: this.props.biography.aboutMe, secondaryLanguage: this.props.biography.secondaryLanguage } })}
                          />
                        )}
                      </FormItem>
                      <FormItem {...formItemLayout} label={this.props.languageState.EDIT_PROFILE_STUDENT_PAGE_PASSPORT_NO.translated}>
                        {getFieldDecorator('nationalID', {
                          initialValue: this.props.nationalID,
                        })(
                          <Input
                            placeholder={this.props.languageState.EDIT_PROFILE_STUDENT_PAGE_PASSPORT_NO_PLACEHOLDER.translated}
                            onChange={(e) => this.props.userInfoChange({ nationalID: e.target.value })}
                          />
                        )}
                      </FormItem>
                      <FormItem
                        {...formItemLayout}
                        label={this.props.languageState.EDIT_PROFILE_STUDENT_PAGE_CURRENCY.translated}
                      >
                        {getFieldDecorator('curency', {
                          rules: [
                            { required: true, message: this.props.languageState.EDIT_PROFILE_STUDENT_PAGE_CURRENCY_VALIDATE.translated, whitespace: true }
                          ],
                          initialValue: this.props.currency._id
                        })(
                          <Select
                          placeholder={this.props.languageState.EDIT_PROFILE_STUDENT_PAGE_CURRENCY_PLACEHOLDER.translated}
                            onChange={(value) => this.props.onChangeCurrency(value.toString())}
                          >
                            {
                              this.props.currencies ? this.props.currencies.map((item) => (<Option value={item._id} key={item.code}>{`${item.name} (${item.code})`}</Option>)) : ''
                            }
                          </Select>
                        )}
                      </FormItem>
                      <FormItem
                        {...formItemLayout}
                        label={this.props.languageState.EDIT_PROFILE_TUTOR_PAGE_PAYMENT.translated}
                      >
                        {getFieldDecorator('paymentMethod', {
                          initialValue: this.props.paymentMethod,
                        })(
                          <Select
                            placeholder='Select a payment'
                            onChange={(value) => this.props.userInfoChange({ paymentMethod: value })}
                          >
                            <Option key='none' value='none'>{this.props.languageState.EDIT_PROFILE_TUTOR_PAGE_PAYMENT_NONE.translated}</Option>
                            <Option key='localBank' value='localBank'>{this.props.languageState.EDIT_PROFILE_TUTOR_PAGE_PAYMENT_LOCAL_BANK.translated}</Option>
                            <Option key='paypal' value='paypal'>{this.props.languageState.EDIT_PROFILE_TUTOR_PAGE_PAYMENT_PAYPAL.translated}</Option>
                          </Select>
                        )}
                      </FormItem>
                      {this.props.paymentMethod === 'localBank' || this.props.paymentMethod === 'paypal'
                        ? <div>
                          {this.props.paymentMethod === 'localBank'
                            ? <div>
                              <FormItem
                                {...formItemLayout}
                                label={this.props.languageState.EDIT_PROFILE_TUTOR_PAGE_BANK_NAME.translated}
                              >
                                {getFieldDecorator('bankName', {
                                  initialValue: this.props.bankName,
                                })(
                                  <Input
                                    onChange={(e) => this.props.userInfoChange({ bankName: e.target.value })}
                                  />
                                )}
                              </FormItem>
                              <FormItem
                                {...formItemLayout}
                                label={this.props.languageState.EDIT_PROFILE_TUTOR_PAGE_ACCOUNT_HOLDER_NAME.translated}
                              >
                                {getFieldDecorator('accountHolderName', {
                                  initialValue: this.props.accountHolderName,
                                })(
                                  <Input
                                    onChange={(e) => this.props.userInfoChange({ accountHolderName: e.target.value })}
                                  />
                                )}
                              </FormItem>
                              <FormItem
                                {...formItemLayout}
                                label={this.props.languageState.EDIT_PROFILE_TUTOR_PAGE_ACCOUNT_NUMBER.translated}
                              >
                                {getFieldDecorator('account number', {
                                  initialValue: this.props.accountNumber,
                                  rules: [
                                    { pattern: /^(\d+-?)+\d+$/, message: this.props.languageState.EDIT_PROFILE_TUTOR_PAGE_ACCOUNT_NUMBER_VALIDATE.translated, whitespace: true },
                                  ],
                                })(
                                  <Input
                                    onChange={(e) => this.checkOnlyNumber(e.target.value)}
                                  />
                                )}
                              </FormItem>
                            </div>
                            : <FormItem
                              {...formItemLayout}
                              label={this.props.languageState.EDIT_PROFILE_TUTOR_PAGE_PAYPAL_EMAIL.translated}
                            >
                              {getFieldDecorator('paypal', {
                                initialValue: this.props.paypalEmail,
                              })(
                                <Input
                                  onChange={(e) => this.props.userInfoChange({ paypalEmail: e.target.value })}
                                />
                              )}
                            </FormItem>}
                        </div>
                        : null}
                      <FormItem {...tailFormItemLayout}>
                        <Button loading={this.props.isBusy} onClick={this.onSaveProfileSubmit} type="primary" htmlType="submit" style={{ marginRight: 10 }}>Save & Continue</Button>
                      </FormItem>

                      <Modal title={this.props.languageState.EDIT_PROFILE_TUTOR_PAGE_CHANGE_PASSWORD_MODAL.translated}
                        okText='Save'
                        cancelText='Cancel'
                        onOk={this.onSavePasswordSubmit}
                        onCancel={() => {
                          this.props.closeChangePasswordModal();
                          this.props.form.resetFields();
                        }}
                        visible={this.props.showChangePasswordModal}
                      >
                        <Form>
                          <FormItem
                            {...formItemLayout}
                            label={this.props.languageState.EDIT_PROFILE_STUDENT_PAGE_NEW_PASSWORD.translated}
                          >
                            {getFieldDecorator('password', {
                              rules: [
                                { pattern: config.usersModuleConfig.passwordRegex, message: this.props.languageState.EDIT_PROFILE_TUTOR_PAGE_PASSWORD_VALIDATE.translated }
                              ],
                              validateTrigger: "onBlur",
                              validateFirst: true
                            })(
                              <Input
                                type="password"
                                onChange={(e) => this.props.userInfoChange({ password: e.target.value })}
                              />
                            )}
                          </FormItem>
                          <FormItem
                            {...formItemLayout}
                            label={this.props.languageState.EDIT_PROFILE_STUDENT_PAGE_CONFIRM_PASSWORD.translated}
                          >
                            {getFieldDecorator('confirm', {
                              rules: [
                                {
                                  validator: (_rule, value, callback) => {
                                    if (value !== this.props.password || value === '') {
                                      callback(this.props.languageState.EDIT_PROFILE_STUDENT_PAGE_CONFIRM_PASSWORD_VALIDATE.translated);
                                    }
                                    callback();
                                  }
                                }
                              ],
                              validateTrigger: "onBlur",
                              validateFirst: true
                            })(
                              <Input type="password" />
                            )}
                          </FormItem>
                        </Form>
                      </Modal>
                    </Col>
                    <Col span={11} offset={2} className="date-input-container">
                      <FormItem {...formItemLayout} label={this.props.languageState.EDIT_PROFILE_STUDENT_PAGE_LAST_NAME.translated}>
                        {getFieldDecorator('lastname', {
                          rules: [
                            { required: true, message: this.props.languageState.EDIT_PROFILE_STUDENT_PAGE_LAST_NAME_VALIDATE_1.translated, whitespace: true },
                            { pattern: /.{2,15}/, message: this.props.languageState.EDIT_PROFILE_STUDENT_PAGE_LAST_NAME_VALIDATE_2.translated }
                          ],
                          initialValue: this.props.lastName,
                          validateTrigger: 'onBlur',
                          validateFirst: true,
                        })(
                          <Input
                            name='lastName'
                            placeholder={this.props.languageState.EDIT_PROFILE_STUDENT_PAGE_LAST_NAME.translated}
                            onChange={(e) => this.props.userInfoChange({ lastName: e.target.value })}
                          />
                        )}
                      </FormItem>
                      <FormItem {...formItemLayout} label={this.props.languageState.EDIT_PROFILE_STUDENT_PAGE_MOBILE_NUMBER.translated}>
                        {getFieldDecorator('phone', {
                          rules: [
                            { required: true, message: this.props.languageState.EDIT_PROFILE_STUDENT_PAGE_MOBILE_NUMBER_VALIDATE_1.translated },
                            { pattern: /^\d{4,15}$/, message: this.props.languageState.EDIT_PROFILE_STUDENT_PAGE_MOBILE_NUMBER_VALIDATE_2.translated },
                            {
                              validator: (_rule, _value, callback) => {
                                if (!this.props.phoneID) {
                                  callback(this.props.languageState.EDIT_PROFILE_STUDENT_PAGE_MOBILE_NUMBER_VALIDATE_3.translated);
                                }
                                callback();
                              }
                            }
                          ],
                          validateTrigger: 'onBlur',
                          validateFirst: true,
                          initialValue: this.props.phoneNumber,
                        })(
                          <Input
                            addonBefore={phoneIdSelector()}
                            style={{ width: '100%' }}
                            name='phoneNumber'
                            placeholder={this.props.languageState.EDIT_PROFILE_STUDENT_PAGE_MOBILE_NUMBER.translated}
                            onChange={(e) => this.props.userInfoChange({ phoneNumber: e.target.value })} />
                        )}
                      </FormItem>

                      <FormItem
                        {...formItemLayout}
                        label={this.props.languageState.EDIT_PROFILE_STUDENT_PAGE_DOB.translated}
                      >
                        {getFieldDecorator('dayofbirth', {
                          rules: [
                            { validator: this.validateTutorDoB }
                          ],
                          validateTrigger: ['onBlur', 'onChange'],
                          initialValue: this.props.dob ? moment(this.props.dob).format('YYYY-MM-DD') : null,
                        })(
                          <Input
                            style={{ width: '100%' }}
                            type="date"
                            min="1900-01-01"
                            max={moment().format('YYYY-MM-DD')}
                            onChange={(e) => this.props.userInfoChange({ dob: new Date(e.target.value as any) })}
                          />
                        )}
                        {/* <div className="custom-antd-date-picker">
                          <DatePicker
                            value={this.props.dob ? moment(this.validateDate(this.props.dob)) : moment()}
                            style={{ position: 'absolute', right: '0px', bottom: '14px' }}
                            format="DD MMM YYYY"
                            allowClear={false}
                            showToday={false}
                            placeholder='Date Of Birth'
                            onChange={(value) => this.changeBirthday(value)}
                          />
                        </div> */}
                      </FormItem>
                      <FormItem {...formItemLayout} label={this.props.languageState.EDIT_PROFILE_STUDENT_PAGE_BASED_IN.translated}>
                        {getFieldDecorator('basedIn', {
                          initialValue: this.props.currentlyBasedIn,
                        })(
                          <Select
                            placeholder={this.props.languageState.EDIT_PROFILE_STUDENT_PAGE_BASED_IN_PLACEHOLDER.translated}
                            onChange={(value) => this.props.userInfoChange({ currentlyBasedIn: value })}
                          >
                            {
                              sortedDataCountry ? sortedDataCountry.map((item) => (<Option value={item.countryName} key={item.countryShortCode}>{item.countryName}</Option>)) : ''
                            }
                          </Select>
                        )}
                      </FormItem>
                      <FormItem
                        {...formItemLayout}
                        label={this.props.languageState.EDIT_PROFILE_STUDENT_PAGE_TIME_ZONE.translated}
                      >
                        {getFieldDecorator('timeZone', {
                          rules: [
                            { required: true, message: 'Timezone is required!', whitespace: true },
                          ],
                          initialValue: this.props.timeZone.name,
                        })(
                          <Select
                            placeholder={this.props.languageState.EDIT_PROFILE_STUDENT_PAGE_TIME_ZONE.translated}
                            onChange={(value) => this.onChangeTimeZone(value.toString())}
                          >
                            {
                              sortedDataTimeZone ? sortedDataTimeZone.map((item) => (<Option value={item.name} key={item.name}>{item.gmt} {item.name}</Option>)) : ''
                            }
                          </Select>
                        )}
                      </FormItem>
                      <FormItem
                        {...formItemLayout}
                        label={this.props.languageState.EDIT_PROFILE_TUTOR_PAGE_TRIAL_SESSION.translated}
                      >
                        {getFieldDecorator('trialSession', {
                          initialValue: this.props.hourlyPerSessionTrial,
                        })(
                          <Select
                            placeholder={this.props.languageState.EDIT_PROFILE_TUTOR_PAGE_TRIAL_SESSION_PLACEHOLDER.translated}
                            onChange={(value) => this.props.userInfoChange({ hourlyPerSessionTrial: value })}
                          >
                            <Option key='none' value={0} >{this.props.languageState.EDIT_PROFILE_TUTOR_PAGE_TRIAL_SESSION_NONE.translated}</Option>
                            <Option key='30m' value={0.5} >{this.props.languageState.EDIT_PROFILE_TUTOR_PAGE_TRIAL_SESSION_30MINS.translated}</Option>
                            <Option key='60m' value={1} >{this.props.languageState.EDIT_PROFILE_TUTOR_PAGE_TRIAL_SESSION_60MINS.translated}</Option>
                          </Select>
                        )}
                      </FormItem>
                    </Col>
                  </Form>
                </Layout>
              </Row>
            </Row>
          </Layout>

          <Row style={{ padding: 20 }}>
            <Row>
              <Col span={12}>
                <Element name="aboutMe" >
                  <h1 id='biography'>{this.props.languageState.EDIT_PROFILE_TUTOR_PAGE_ABOUT_ME.translated}</h1>
                </Element>
              </Col>
              <Col span={10}></Col>
            </Row>

            <hr style={{ marginBottom: '40px' }} />
            <Row>
              <Col span={15}>
                <h4>{this.props.languageState.EDIT_PROFILE_TUTOR_PAGE_PRIMARY_LANGUAGE.translated} <a style={{ color: '#f5222d' }}>*</a></h4>
                <AutoComplete
                  style={{ width: '100%' }}
                  value={this.props.biography.language}
                  dataSource={this.props.dataLookupState.findaTutor.language ? this.props.dataLookupState.findaTutor.language.map((item) => item.label) : []}
                  placeholder={this.props.languageState.EDIT_PROFILE_TUTOR_PAGE_PRIMARY_LANGUAGE_PLACEHOLDER.translated}
                  filterOption={(inputValue, option) => (option as any).props.children.toString().toUpperCase().indexOf(inputValue.toUpperCase()) !== -1}
                  onChange={(value) => this.props.userInfoChange({ biography: { language: value, nationality: this.props.biography.nationality, aboutMe: this.props.biography.aboutMe, secondaryLanguage: this.props.biography.secondaryLanguage } })}
                />
              </Col>
              <Col span={1}></Col>
              <Col span={8}>
                <h4>{this.props.languageState.EDIT_PROFILE_TUTOR_PAGE_SECONDARY_LANGUAGE.translated}</h4>
                <AutoComplete
                  style={{ width: '100%' }}
                  value={this.props.biography.secondaryLanguage}
                  dataSource={this.props.dataLookupState.findaTutor.language ? this.props.dataLookupState.findaTutor.language.map((item) => item.label) : []}
                  placeholder={this.props.languageState.EDIT_PROFILE_TUTOR_PAGE_SECONDARY_LANGUAGE_PLACEHOLDER.translated}
                  filterOption={(inputValue, option) => (option as any).props.children.toString().toUpperCase().indexOf(inputValue.toUpperCase()) !== -1}
                  onChange={(value) => this.props.userInfoChange({ biography: { language: this.props.biography.language, nationality: this.props.biography.nationality, aboutMe: this.props.biography.aboutMe, secondaryLanguage: value } })}
                />
              </Col>
            </Row>
            <Row style={{ marginTop: '15px' }}>
              <Col span={15}>
                <h4>{this.props.languageState.EDIT_PROFILE_TUTOR_PAGE_DESCRIPTION.translated} <a style={{ color: '#f5222d' }}>*</a></h4>
                <Input.TextArea
                  placeholder={this.props.languageState.EDIT_PROFILE_TUTOR_PAGE_DESCRIPTION_PLACEHOLDER.translated}
                  value={this.props.biography.aboutMe}
                  onChange={(e) => this.props.userInfoChange({ biography: { language: this.props.biography.language, nationality: this.props.biography.nationality, aboutMe: e.target.value, secondaryLanguage: this.props.biography.secondaryLanguage } })}
                  style={{ width: '100%' }}
                  autosize={true}
                />
              </Col>
              <Col span={24} style={{ marginTop: '20px' }}>
                <Button
                  type='primary'
                  onClick={this.onSaveBiographySubmit}
                >{this.props.languageState.EDIT_PROFILE_TUTOR_PAGE_SAVE_AND_CONTINUE.translated}</Button>
              </Col>
            </Row>
          </Row>
          <Row style={{ marginTop: '40px', padding: 20 }} >
            <Row>
              <Col span={12} >
                <Element name="education" className='education-header'>
                  <h1 id='my-education'>{this.props.languageState.EDIT_PROFILE_TUTOR_PAGE_EDUCATION.translated}</h1>
                </Element>
              </Col>
              <Col span={10}>
              </Col>
            </Row>
            <hr style={{ marginBottom: '40px' }} />
            <div>
              <Col span={8} >
                <h4>{this.props.languageState.EDIT_PROFILE_TUTOR_PAGE_CURRENT_EDUCATION.translated} <a style={{ color: '#f5222d' }}>*</a></h4>
                <Select
                  style={{ width: '95%' }}
                  value={this.props.education.highestEducation}
                  onChange={(value) => this.props.userInfoChange({
                    education: {
                      highestEducation: value,
                      major: this.props.education ? this.props.education.major : null,
                      university: this.props.education.university,
                      fileListDocument: this.props.education.fileListDocument
                    }
                  })}
                >
                  {
                    this.props.dataLookupState.findaTutor.education ? this.props.dataLookupState.findaTutor.education.map((item) => (<Option value={item.label} key={item._id}>{item.label}</Option>)) : ''
                  }
                </Select>
              </Col>
              <Col span={8} style={{}}>
                <h4>{this.props.languageState.EDIT_PROFILE_TUTOR_PAGE_MAJOR.translated} <a style={{ color: '#f5222d' }}>*</a></h4>
                <Input
                  style={{ width: '95%' }}
                  value={this.props.education ? this.props.education.major : null}
                  onChange={(e) => this.props.userInfoChange({
                    education: {
                      major: e.target.value,
                      highestEducation: this.props.education.highestEducation,
                      university: this.props.education.university,
                      fileListDocument: this.props.education.fileListDocument
                    }
                  })}
                />
              </Col>
              <Col span={8} style={{}}>
                <h4>{this.props.languageState.EDIT_PROFILE_TUTOR_PAGE_INSTITUTION.translated} <a style={{ color: '#f5222d' }}>*</a></h4>
                <Input
                  style={{ width: '95%', marginBottom: '15px' }}
                  value={this.props.education.university}
                  onChange={(e) => this.props.userInfoChange({
                    education: {
                      university: e.target.value,
                      highestEducation: this.props.education.highestEducation,
                      major: this.props.education.major,
                      fileListDocument: this.props.education.fileListDocument
                    }
                  })}
                />
              </Col>
              <h4>{this.props.languageState.EDIT_PROFILE_TUTOR_PAGE_FILE_UPLOAD.translated}</h4>
              <div style={{ padding: '0px ' }}>
                <Col span={12} style={{ marginBottom: '12px' }}>
                  <Upload {...props}
                    fileList={this.props.education.fileListDocument.document1}
                    onChange={(info) => this.handleUploadChange(1, info)}>
                    <Button>
                      <Icon type='upload' /> {this.props.languageState.EDIT_PROFILE_TUTOR_PAGE_CLICK_TO_UPLOAD.translated}
                    </Button>
                  </Upload>
                </Col>
                <Col span={12} style={{ marginBottom: '12px' }}>
                  <Upload {...props}
                    fileList={this.props.education.fileListDocument.document2}
                    onChange={(info) => this.handleUploadChange(2, info)}>
                    <Button>
                      <Icon type='upload' /> {this.props.languageState.EDIT_PROFILE_TUTOR_PAGE_CLICK_TO_UPLOAD.translated}
                    </Button>
                  </Upload>
                </Col>
                <Col span={12} style={{ marginBottom: '12px' }}>
                  <Upload {...props}
                    fileList={this.props.education.fileListDocument.document3}
                    onChange={(info) => this.handleUploadChange(3, info)}>
                    <Button>
                      <Icon type='upload' /> {this.props.languageState.EDIT_PROFILE_TUTOR_PAGE_CLICK_TO_UPLOAD.translated}
                    </Button>
                  </Upload>
                </Col>
                <Col span={12} style={{ marginBottom: '12px' }}>
                  <Upload {...props}
                    fileList={this.props.education.fileListDocument.document4}
                    onChange={(info) => this.handleUploadChange(4, info)}>
                    <Button>
                      <Icon type='upload' /> {this.props.languageState.EDIT_PROFILE_TUTOR_PAGE_CLICK_TO_UPLOAD.translated}
                    </Button>
                  </Upload>
                </Col>
              </div>
              <Col span={24} style={{ marginTop: '20px' }}>
                <Button
                  type='primary'
                  onClick={this.onSaveEducationSubmit}
                >{this.props.languageState.EDIT_PROFILE_TUTOR_PAGE_SAVE_AND_CONTINUE.translated}</Button>
              </Col>
            </div>

          </Row>
          <Row style={{ marginTop: '40px', padding: 20 }}>
            <Row>
              <Col span={12}>
                <Element name="experience" className='education-header' id='teaching-experience'>
                  <h1 id='teaching-experience'>{this.props.languageState.EDIT_PROFILE_TUTOR_PAGE_EXPERIENCE.translated}</h1>
                </Element>
              </Col>
              <Col span={10}>
              </Col>
            </Row>
            <hr />
            <Table
              rowKey={(record) => record.index}
              size='middle'
              columns={columnsTeacherExperience}
              dataSource={this.props.teacherExperience}
              pagination={false}
              locale={{ emptyText: this.props.languageState.EDIT_PROFILE_TUTOR_PAGE_EXP_EMPTY.translated }}
            />

            <Col span={24} style={{ marginTop: '20px' }}>
              <Button type='primary' onClick={() => this.props.addFieldTeacherExperience()} style={{ marginRight: 10 }}>
              {this.props.languageState.EDIT_PROFILE_TUTOR_PAGE_ADD_FIELD.translated}
            </Button>
              <Button
                style={{ width: 85 }}
                type="primary"
                onClick={this.onSaveTeacherExperienceSubmit}
              >
                {this.props.languageState.EDIT_PROFILE_TUTOR_PAGE_SAVE.translated}
              </Button>
            </Col>
          </Row>
        </Layout>
      </UserLayout >
    );
  }
}

const mapState = (rootState: any) => {
  return {
    ...rootState.editProfilePageModel,
    profileState: rootState.profileModel,
    infoUserState: rootState.indexPageModel,
    dataLookupState: rootState.dataLookupModel,
    languageState: rootState.languageModel,
  };
};

const mapDispatch = (rootReducer: any) => {
  return {
    ...rootReducer.editProfilePageModel,
    profileReducers: rootReducer.profileModel,
    infoUserReducers: rootReducer.indexPageModel,
    dataLookup: rootReducer.dataLookupModel,
  };
};

export default withRematch(initStore, mapState, mapDispatch)(Form.create()(EditProfilePage));