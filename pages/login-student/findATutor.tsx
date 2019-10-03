import React from "react";
import { Layout, Row, Select, Col, Slider, Pagination, Spin, Input, Button, Modal, AutoComplete } from "antd";
import TeacherInformation from "../../components/TeacherInformation";
import "./informationTutor.css";
import initStore from "../../rematch/store";
import withRematch from "../../rematch/withRematch";
import { getUsersService, getMetadataService } from "../../service-proxies";
import UserLayout from "../../layout/UserLayout";
import LoginForm from "../../components/landing-page/LoginForm";
import RegisterForm from "../../components/landing-page/RegisterForm";
import HeaderLoginStudent from "../../components/HeaderLoginStudent";
import ResetPasswordForm from "../../components/landing-page/ResetPasswordForm";
import Router from 'next/router';

const { Content } = Layout;
const Option = Select.Option;
const InputGroup = Input.Group;

class FindATutor extends React.Component<any, any> {
  static async getInitialProps(props: any) {
    if (!props.req) {
      const findATutorPageState = props.store.getState().findATutorPageModel;
      const usersService = getUsersService();
      const result = await usersService.findTutors(
        findATutorPageState.search,
        findATutorPageState.language,
        findATutorPageState.gender,
        findATutorPageState.nationality,
        findATutorPageState.education,
        findATutorPageState.race,
        findATutorPageState.courseInput,
        findATutorPageState.minAge,
        findATutorPageState.maxAge,
        0,
        0,
        findATutorPageState.minYearsOfExp,
        findATutorPageState.maxYearsOfExp,
        findATutorPageState.minRating,
        findATutorPageState.maxRating,
        findATutorPageState.pageNumber,
        findATutorPageState.pageSize,
        findATutorPageState.sortBy,
        findATutorPageState.asc
      );
      props.store.dispatch.findATutorPageModel.fetchDataSuccess({ result });
    } else {
      props.store.dispatch.findATutorPageModel.fetchDataSuccess({ result: props.query.tutors });
    }

    const subjects = await getMetadataService().getAllSubjects();
    const levels = await getMetadataService().getAllLevels();
    const grades = await getMetadataService().getAllGrades();
    props.store.dispatch.findATutorPageModel.fetchMetadataSuccess({
      subjects: subjects.data,
      levels: levels.data,
      grades: grades.data
    })
  }

  componentDidMount() {
    Router.onRouteChangeStart = (_url) => {
      this.props.resetState();
    }
  }

  state = {
    optionsCollapsed: true
  };

  paginationChange = (pageNumber, pageSize) => {
    const exchangeRate = this.props.profileState ? this.props.profileState.currency && this.props.profileState.currency.exchangeRate ? this.props.profileState.currency.exchangeRate : 1 : 1;
    this.props.handleFilterChange({
      pageNumber,
      pageSize,
    });
    this.props.fetchDataEffect({
      search: this.props.search,
      language: this.props.language,
      gender: this.props.gender,
      nationality: this.props.nationality,
      education: this.props.education,
      race: this.props.race,
      courseInput: this.props.courseInput,
      minAge: this.props.minAge,
      maxAge: this.props.maxAge,
      minPrice: this.props.minPrice * exchangeRate,
      maxPrice: this.props.maxPrice * exchangeRate,
      minYearsOfExp: this.props.minYearsOfExp,
      maxYearsOfExp: this.props.maxYearsOfExp,
      minRating: this.props.minRating,
      maxRating: this.props.maxRating,
      pageNumber,
      pageSize,
      sortBy: this.props.sortBy,
      asc: this.props.asc
    });
  }

  handleSearch = () => {
    const exchangeRate = this.props.profileState ? this.props.profileState.currency && this.props.profileState.currency.exchangeRate ? this.props.profileState.currency.exchangeRate : 1 : 1;
    this.props.fetchDataEffect({
      search: this.props.search,
      language: this.props.language,
      gender: this.props.gender,
      nationality: this.props.nationality,
      education: this.props.education,
      race: this.props.race,
      courseInput: this.props.courseInput,
      minAge: this.props.minAge,
      maxAge: this.props.maxAge,
      minPrice: this.props.minPrice * exchangeRate,
      maxPrice: this.props.maxPrice * exchangeRate,
      minYearsOfExp: this.props.minYearsOfExp,
      maxYearsOfExp: this.props.maxYearsOfExp,
      minRating: this.props.minRating,
      maxRating: this.props.maxRating,
      pageNumber: this.props.pageNumber,
      pageSize: this.props.pageSize,
      sortBy: this.props.sortBy,
      asc: this.props.asc
    });
  }

  handleSortChange = (value: string) => {
    const exchangeRate = this.props.profileState ? this.props.profileState.currency && this.props.profileState.currency.exchangeRate ? this.props.profileState.currency.exchangeRate : 1 : 1;
    this.props.handleFilterChange({
      sortBy: (value as any).split('-')[0],
      asc: (value as any).split('-')[1] === 'asc' ? true : false,
    });

    this.props.fetchDataEffect({
      search: this.props.search,
      language: this.props.language,
      gender: this.props.gender,
      nationality: this.props.nationality,
      education: this.props.education,
      race: this.props.race,
      courseInput: this.props.courseInput,
      minAge: this.props.minAge,
      maxAge: this.props.maxAge,
      minPrice: this.props.minPrice * exchangeRate,
      maxPrice: this.props.maxPrice * exchangeRate,
      minYearsOfExp: this.props.minYearsOfExp,
      maxYearsOfExp: this.props.maxYearsOfExp,
      minRating: this.props.minRating,
      maxRating: this.props.maxRating,
      pageNumber: this.props.pageNumber,
      pageSize: this.props.pageSize,
      sortBy: (value as any).split('-')[0],
      asc: (value as any).split('-')[1] === 'asc' ? true : false,
    });
  }

  submitFilter = () => {
    const exchangeRate = this.props.profileState ? this.props.profileState.currency && this.props.profileState.currency.exchangeRate ? this.props.profileState.currency.exchangeRate : 1 : 1;
    this.props.fetchDataEffect({
      search: this.props.search,
      language: this.props.language,
      gender: this.props.gender,
      nationality: this.props.nationality,
      education: this.props.education,
      race: this.props.race,
      courseInput: this.props.courseInput,
      minAge: this.props.minAge,
      maxAge: this.props.maxAge,
      minPrice: this.props.minPrice * exchangeRate,
      maxPrice: this.props.maxPrice * exchangeRate,
      minYearsOfExp: this.props.minYearsOfExp,
      maxYearsOfExp: this.props.maxYearsOfExp,
      minRating: this.props.minRating,
      maxRating: this.props.maxRating,
      pageNumber: this.props.pageNumber,
      pageSize: this.props.pageSize,
      sortBy: this.props.sortBy,
      asc: this.props.asc,
    });
  }

  clearFilter = () => {
    this.props.clearFilter();
    this.props.fetchDataEffect({
      search: this.props.search,
      language: '',
      gender: '',
      nationality: '',
      education: this.props.education,
      race: this.props.race,
      courseInput: {},
      minAge: 18,
      maxAge: 60,
      minPrice: 0,
      maxPrice: 0,
      minYearsOfExp: 0,
      maxYearsOfExp: 10,
      minRating: 0,
      maxRating: 5,
      pageNumber: this.props.pageNumber,
      pageSize: this.props.pageSize,
      sortBy: this.props.sortBy,
      asc: this.props.asc,
    });
  }

  toggleOptions = () => {
    this.setState({
      optionsCollapsed: !this.state.optionsCollapsed
    });
    this.props.clearFilter();
  }

  calculateLocaleHourlyRate = (input) => {
    return this.props.profileState ? this.props.profileState.currency && this.props.profileState.currency.exchangeRate ?
      Math.round((input / this.props.profileState.currency.exchangeRate)).toLocaleString() : input : input
  }

  calculateHourlyRateInput = (input) => {
    return this.props.profileState ? this.props.profileState.currency && this.props.profileState.currency.exchangeRate ?
      Math.round((input / this.props.profileState.currency.exchangeRate)) : Number(input) : Number(input)
  }

  localeCurrency = () => {
    return this.props.profileState ? this.props.profileState.currency && this.props.profileState.currency.code ?
      this.props.profileState.currency.code : 'SGD' : 'SGD'
  }

  render() {
    const modal = (
      <Modal
        title="Tell us your tuition request"
        visible={false}
        footer={null}
        style={{ textAlign: 'center', fontSize: '20px' }}
        bodyStyle={{ textAlign: 'left' }}
      >
        <InputGroup>
          <Col> Country of subject taught
            <div style={{ marginBottom: 16 }}>
              <Select
                placeholder="Select Country"
                style={{ width: '100%' }}
              >
                {this.props.dataLookupState.findaTutor.nationality
                  ? this.props.dataLookupState.findaTutor.nationality.map(
                    item => (
                      <Option value={item.name} key={item.code}>
                        {item.name}
                      </Option>
                    )
                  )
                  : null}
              </Select>
            </div>
          </Col>
        </InputGroup>
        <InputGroup>
          <Col span={12}>
            Your academic level<span style={{ color: 'red' }}>*</span>
            <div style={{ marginBottom: 16 }}>
              <Select
                placeholder="Select Level"
                style={{ width: '100%' }}
              >
              </Select>
            </div>
          </Col>
          <Col span={12}>
            Your grade<span style={{ color: 'red' }}>*</span>
            <div style={{ marginBottom: 16 }}>
              <Select
                placeholder="Select Grade"
                style={{ width: '100%' }}
              >
              </Select>
            </div>
          </Col>
        </InputGroup>
        <InputGroup>
          <Col> All Courses
            <div style={{ marginBottom: 16 }}>
              <Select
                placeholder="All Courses"
                style={{ width: '100%' }}
              >
              </Select>
            </div>
          </Col>
        </InputGroup>
        <InputGroup>
          <Button type="primary" ghost style={{ maxWidth: "100%" }}>Find a Tutor</Button>
        </InputGroup>
      </Modal>
    );

    const mainPage = (
      <div>
        <Layout style={{ background: "white" }} className="responsive-layout">
          <Content className="responsive-content">
            <Spin spinning={this.props.isBusy}>
              <div className={this.state.optionsCollapsed ? 'hide-options' : 'show-options'}>
                <Row gutter={24} type='flex'>
                  <Col xs={24}>
                    <h3>{this.props.languageState.FIND_A_TUTOR_PAGE_COURSE_FILTERS.translated}</h3>
                  </Col>

                  <Col xs={12} md={8} xl={6} xxl={5} className="responsive-course-option">
                    <AutoComplete
                      style={{ width: '100%' }}
                      dataSource={this.props.dataLookupState.course.country ? this.props.dataLookupState.course.country.map((item) => item.name) : []}
                      placeholder={this.props.languageState.FIND_A_TUTOR_PAGE_COUNTRY.translated}
                      value={this.props.courseInput['courseForTutor.course.country']}
                      filterOption={(inputValue, option) => (option.props.children as any).toString().toUpperCase().indexOf(inputValue.toUpperCase()) !== -1}
                      onChange={(value) => this.props.changeCourseInput({ 
                        'courseForTutor.course.country': value === 'All countries' ? '' : value,
                        'courseForTutor.groupTuition.course.country': value === 'All countries' ? '' : value
                      })}
                    />
                  </Col>

                  <Col xs={12} md={8} xl={6} xxl={5} className="responsive-course-option">
                    <Select
                      placeholder={this.props.languageState.FIND_A_TUTOR_PAGE_SUBJECT.translated}
                      value={this.props.courseInput['courseForTutor.course.subject']}
                      onChange={(value) => this.props.changeCourseInput({ 
                        'courseForTutor.course.subject': value ,
                        'courseForTutor.groupTuition.course.subject': value 
                      })}
                      style={{ width: '100%' }}
                    >
                      {
                        this.props.subjects.filter(val => val.name !== 'trial').map((item) => (<Option value={item.name} key={item._id}>{item.name}</Option>))
                      }
                    </Select>
                  </Col>

                  <Col xs={12} md={8} xl={6} xxl={5} className="responsive-course-option">
                    <Select
                      placeholder={this.props.languageState.FIND_A_TUTOR_PAGE_ACADEMIC_LEVEL.translated}
                      value={this.props.courseInput['courseForTutor.course.level']}
                      onChange={(value) => this.props.changeCourseInput({ 
                        'courseForTutor.course.level': value,
                        'courseForTutor.groupTuition.course.level': value,
                        'courseForTutor.course.grade': null 
                      })}
                      style={{ width: '100%' }}
                    >
                      {
                        this.props.levels.map((item) => (<Option value={item.name} key={item._id}>{item.name}</Option>))
                      }
                    </Select>
                  </Col>

                  <Col xs={12} md={8} xl={6} xxl={5} className="responsive-course-option">
                    <Select
                      placeholder={this.props.languageState.FIND_A_TUTOR_PAGE_GRADE.translated}
                      value={this.props.courseInput ? this.props.courseInput['courseForTutor.course.grade'] : null}
                      onChange={(value) => this.props.changeCourseInput({ 
                        'courseForTutor.course.grade': value,
                        'courseForTutor.groupTuition.course.grade' : value
                      })}
                      style={{ width: '100%' }}
                    >
                      {
                        this.props.courseInput && this.props.courseInput['courseForTutor.course.level'] ?
                          this.props.grades.filter((val) => val.level && val.level.name === this.props.courseInput['courseForTutor.course.level']).map((item) =>
                            (<Option value={item.name} key={item._id}>{item.name}</Option>)) : <Option value="" key="0" disabled={true}>{this.props.languageState.FIND_A_TUTOR_PAGE_GRADE_EMPTY.translated}</Option>
                      }
                    </Select>
                  </Col>

                  <Col xs={24} sm={12} className="responsive-course-option custom-slider" style={{display: 'flex'}}>
                    <div style={{display: 'flex', alignItems: 'center', width: '100%', flexWrap: 'wrap'}}>
                      <Content style={{ fontWeight: "bold", display: 'inline-block', marginRight: '20px' }}>{this.props.languageState.INFORMATION_TUTOR_PAGE_HOURLY_RATE.translated}</Content>
                      {/* <Content style={{ fontWeight: "bold", display: 'inline', color: "#f48838", float: "right" }}>
                        {`${this.calculateLocaleHourlyRate(this.props.minPrice)} - ${this.calculateLocaleHourlyRate(this.props.maxPrice)} ${this.localeCurrency()}/h`}
                      </Content>
                      <Slider
                        range={true}
                        tipFormatter={null}
                        step={10}
                        value={[this.props.minPrice, this.props.maxPrice]}
                        onChange={value => this.props.handlePriceChange({ newPrice: value })}
                      /> */}
                      <div style={{display: 'flex', flexWrap : 'wrap'}}>
                        <div style={{display: 'flex', alignItems: 'center', marginTop: '5px', marginRight: '10px'}}>
                          <h4 style={{marginBottom: '0px', marginRight: '5px'}}>Min ({this.localeCurrency()}/h)</h4>
                          <Input type="number" placeholder='Enter min price' value={Number(this.props.minPrice)} style={{width: 'auto'}} min={0} onChange={(e) => this.props.handleMinPriceChange({minPrice: Number(e.target.value)})}></Input>
                        </div>
                        <div style={{display: 'flex', alignItems: 'center', marginTop: '5px'}}>
                          <h4 style={{marginBottom: '0px', marginRight: '5px'}}>Max ({this.localeCurrency()}/h)</h4>
                          <Input type="number" placeholder='Enter max price' value={Number(this.props.maxPrice)} style={{width: 'auto'}} min={0} onChange={(e) => this.props.handleMaxPriceChange({maxPrice: Number(e.target.value)})}></Input>
                        </div>
                      </div>                      
                    </div>
                  </Col>
                </Row>

                <Row gutter={24} type='flex'>
                  <Col xs={24}>
                    <h3>{this.props.languageState.FIND_A_TUTOR_PAGE_TUTOR_FILTERS.translated}</h3>
                  </Col>

                  <Col xs={12} md={8} xl={6} xxl={5} className="responsive-course-option">
                    <div>
                      <AutoComplete
                        style={{ width: '100%' }}
                        dataSource={this.props.dataLookupState.findaTutor.nationality ? this.props.dataLookupState.findaTutor.nationality.map((item) => item.name) : []}
                        placeholder={this.props.languageState.FIND_A_TUTOR_PAGE_NATIONALITY.translated}
                        value={this.props.nationality ? this.props.nationality : undefined}
                        filterOption={(inputValue, option) => (option.props.children as any).toString().toUpperCase().indexOf(inputValue.toUpperCase()) !== -1}
                        onChange={(value) => this.props.handleFilterChange({ nationality: value })}
                      />
                    </div>
                  </Col>

                  <Col xs={12} md={8} xl={6} xxl={5} className="responsive-course-option">
                    <div>
                      <Select
                        placeholder={this.props.languageState.FIND_A_TUTOR_PAGE_GENDER.translated}
                        value={this.props.gender ? this.props.gender : undefined}
                        style={{ width: "100%" }}
                        onChange={value => this.props.handleFilterChange({ gender: value })}
                      >
                        {this.props.dataLookupState.findaTutor.gender && this.props.dataLookupState.findaTutor.gender.map(
                          item => (
                            <Option value={item.value} key={item._id}>
                              {item.label}
                            </Option>
                          )
                        )}
                      </Select>
                    </div>
                  </Col>

                  <Col xs={12} md={8} xl={6} xxl={5} className="responsive-course-option">
                    <div>
                      <AutoComplete
                        style={{ width: '100%' }}
                        dataSource={this.props.dataLookupState.findaTutor.language ? this.props.dataLookupState.findaTutor.language.map(item => item.value) : []}
                        placeholder={this.props.languageState.FIND_A_TUTOR_PAGE_LANGUAGE.translated}
                        value={this.props.language ? this.props.language : undefined}
                        filterOption={(inputValue, option) => (option.props.children as any).toString().toUpperCase().indexOf(inputValue.toUpperCase()) !== -1}
                        onChange={value => this.props.handleFilterChange({ language: value })}
                      />
                    </div>
                  </Col>

                  <Col xs={12} md={8} xl={6} xxl={5} className="responsive-course-option custom-slider">
                    <div>
                      <Content style={{ fontWeight: "bold", display: 'inline' }}>{this.props.languageState.FIND_A_TUTOR_PAGE_EXP.translated}</Content>
                      <Content style={{ fontWeight: "bold", display: 'inline', color: "#f48838", float: "right" }}>
                        {`${this.props.minYearsOfExp} - ${this.props.maxYearsOfExp} ${this.props.languageState.FIND_A_TUTOR_PAGE_YEAR.translated}`}
                      </Content>
                      <Slider
                        tipFormatter={null}
                        range={true}
                        max={10}
                        min={0}
                        step={0.5}
                        value={[this.props.minYearsOfExp, this.props.maxYearsOfExp]}
                        onChange={value => this.props.handleYearsOfExpChange({ newYearsOfExp: value })}
                      />
                    </div>
                  </Col>
                </Row>

                <Row style={{ marginBottom: '20px' }}>
                  <Col xs={24} className="responsive-course-option">
                    <div style={{ textAlign: 'right', marginRight: '10px' }}>
                      <Button icon='close' onClick={this.clearFilter}>{this.props.languageState.FIND_A_TUTOR_PAGE_CLEAR_FILTER.translated}</Button>
                      <Button icon='filter' type="primary" style={{ marginLeft: '12px' }} onClick={this.submitFilter}>{this.props.languageState.FIND_A_TUTOR_PAGE_FILTER.translated}</Button>
                    </div>
                  </Col>
                </Row>
              </div>
              <Row style={{ marginBottom: 20 }}>
                <Col xs={24}>
                  <h2 className="responsive-title">{this.props.languageState.FIND_A_TUTOR_PAGE_FIND_A_TUTOR.translated}</h2>
                </Col>
              </Row>

              {this.props.data && this.props.data.length ? 
                this.props.data.map((tutor, index) => (
                  <Row key={index}>
                    <Col span={24}>
                      <TeacherInformation
                        currency={this.props.profileState ? (this.props.profileState.currency ? this.props.profileState.currency.code : 'SGD') : 'SGD'}
                        exchangeRate={this.props.profileState ? (this.props.profileState.currency ? this.props.profileState.currency.exchangeRate : 1) : 1}
                        _source={tutor._source}
                        _id={tutor._id}
                        dataLookup={this.props.dataLookupState.findaTutor}
                        sortBy={this.props.sortBy}
                        openLoginModal={this.props.openLoginModal}
                        openRegisterModal={this.props.openRegister}
                        asc={this.props.asc}
                        profileState={this.props.profileState}
                        languageState={this.props.languageState}
                      />
                    </Col>
                  </Row>
                )) : 
                <div style={{paddingLeft: '5px'}}>
                  <h3 style={{color: 'red'}}>{this.props.languageState.FIND_A_TUTOR_PAGE_NO_RESULT_1.translated}</h3>
                  <h3 style={{color: 'red'}}>{this.props.languageState.FIND_A_TUTOR_PAGE_NO_RESULT_2.translated}</h3>
                </div>
              }

              <Row>
                <Col span={24} style={{ textAlign: 'right' }}>
                  <Pagination
                    showSizeChanger={true}
                    pageSizeOptions={['10', '20', '30']}
                    current={this.props.pageNumber}
                    pageSize={this.props.pageSize}
                    onShowSizeChange={this.paginationChange}
                    onChange={this.paginationChange}
                    total={this.props.total}
                  />
                </Col>
              </Row>
            </Spin>
          </Content>
        </Layout>
      </div>
    );

    return (
      <div className='find-a-tutor'>
        {Object.keys(this.props.profileState).length && this.props.profileState.isLoggedIn ? (
          <UserLayout
            profileState={this.props.profileState}
            profileReducers={this.props.profileReducers}
            editProfilePageState={this.props.editProfilePageState}
            languageState={this.props.languageState}
            outerHeader={
              <HeaderLoginStudent
                profileState={this.props.profileState}
                dataLookup={this.props.dataLookupState}
                handleSearch={this.handleSearch}
                handleFilterChange={this.props.handleFilterChange}
                courseInput={this.props.courseInput}
                openLoginModal={this.props.openLoginModal}
                openRegisterModal={this.props.openRegisterModal}
                toggleOptions={this.toggleOptions}
                handleSortChange={this.handleSortChange}
                sortBy={this.props.sortBy}
                asc={this.props.asc}
                languageState={this.props.languageState}
              />
            }
          >
            {modal}
            {mainPage}
          </UserLayout>
        ) : (
            <div>
              <HeaderLoginStudent
                profileState={this.props.profileState}
                dataLookup={this.props.dataLookupState}
                handleSearch={this.handleSearch}
                handleFilterChange={this.props.handleFilterChange}
                courseInput={this.props.courseInput}
                openLoginModal={this.props.openLoginModal}
                openRegisterModal={this.props.openRegisterModal}
                toggleOptions={this.toggleOptions}
                handleSortChange={this.handleSortChange}
                sortBy={this.props.sortBy}
                asc={this.props.asc}
                languageState={this.props.languageState}
              />
              {mainPage}
            </div>
          )}

        <Modal
          title={this.props.languageState.FIND_A_TUTOR_PAGE_LOG_IN.translated}
          visible={this.props.loginModalVisible}
          onOk={this.props.closeLoginModal}
          onCancel={() => {
            this.props.closeLoginModal();
            this.props.loginPageReducers.clearState();
          }}
          width={450}
          footer={null}
          destroyOnClose={true}
        >
          <LoginForm
            loginPageState={this.props.loginPageState}
            loginPageReducers={this.props.loginPageReducers}
            openRegisterModal={this.props.openRegisterModal}
            openResetPasswordModal={this.props.openResetPasswordModal}
            languageState={this.props.languageState}
          />
        </Modal>

        <Modal
          title={this.props.languageState.FIND_A_TUTOR_PAGE_SIGN_UP.translated}
          visible={this.props.registerModalVisible}
          onOk={this.props.closeRegisterModal}
          onCancel={() => {
            this.props.closeRegisterModal();
            this.props.signUpPageReducers.clearState();
          }}
          width={450}
          footer={null}
          destroyOnClose={true}
        >
          <RegisterForm
            signUpPageReducers={this.props.signUpPageReducers}
            signUpPageState={this.props.signUpPageState}
            openRegisterSuccessModal={this.props.openRegisterSuccessModal}
            closeRegisterModal={this.props.closeRegisterModal}
            openLoginModal={this.props.openLoginModal}
            loginPageReducers={this.props.loginPageReducers}
            languageState={this.props.languageState}
          />
        </Modal>

        <Modal
          title={this.props.languageState.FIND_A_TUTOR_PAGE_RESET_PASSWORD.translated}
          visible={this.props.resetPasswordModalVisible}
          onCancel={() => {
            this.props.closeResetPasswordModal();
            this.props.resetPasswordPageReducers.clearState();
          }}
          width={450}
          footer={null}
          destroyOnClose={true}
        >
          <ResetPasswordForm resetPasswordPageReducers={this.props.resetPasswordPageReducers} resetPasswordPageState={this.props.resetPasswordPageState} languageState={this.props.languageState}/>
        </Modal>

        <Modal
          style={{ textAlign: "center", marginTop: "150px" }}
          bodyStyle={{ fontSize: "18px" }}
          closable={false}
          title={this.props.languageState.FIND_A_TUTOR_PAGE_REGISTRATION_SUCCESS.translated}
          visible={this.props.registerSuccessModalVisible}
          footer={null}
          onCancel={this.props.closeLoginSuccessModal}
        >
          <p>
            {this.props.languageState.FIND_A_TUTOR_PAGE_REGISTRATION_SUCCESS_TEXT.translated}
          </p>
        </Modal>
      </div>
    );
  }
}

const mapState = (rootState: any) => {
  return {
    ...rootState.findATutorPageModel,
    dataLookupState: rootState.dataLookupModel,
    profileState: rootState.profileModel,
    loginPageState: rootState.loginPageModel,
    signUpPageState: rootState.signUpPageModel,
    editProfilePageState: rootState.editProfilePageModel,
    resetPasswordPageState: rootState.resetPasswordPageModel,
    languageState: rootState.languageModel,
  };
};

const mapDispatch = (rootReducer: any) => {
  return {
    ...rootReducer.findATutorPageModel,
    dataLookup: rootReducer.dataLookupModel,
    profileReducers: rootReducer.profileModel,
    loginPageReducers: rootReducer.loginPageModel,
    signUpPageReducers: rootReducer.signUpPageModel,
    editProfilePageReducers: rootReducer.editProfilePageModel,
    resetPasswordPageReducers: rootReducer.resetPasswordPageModel,
    languageReducers: rootReducer.languageModel,
  };
};

export default withRematch(initStore, mapState, mapDispatch)(FindATutor);
