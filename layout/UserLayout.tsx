import * as React from "react";
import { Layout, Row, Col, Select } from "antd";
import jsCookies from 'js-cookie';
import UserLayoutHeader from "./UserLayoutHeader";
import UserNotLoggedInHeader from "./UserNotLoggedInHeader";
import UpdateInforModal from "./UpdateInforModal";
import { getLanguageService, getUsersService } from '../service-proxies';
import './UserLayoutHeader.css';

class UserLayout extends React.Component<any, any> {
  state = {
    languages : [{
      shortName: 'en',
      name: 'English',
    }]
  }

  async componentDidMount() {
    if (this.props.profileState.tenant) {
      const token = jsCookies.get(`token_${this.props.profileState.tenant.name}`);
      this.props.profileReducers.loginSocialSuccess({token});
    }

    const languages = await getLanguageService().find();
    if (languages && languages.length) {
      this.setState({
        languages
      })
    }
  }

  handleChangeLanguage = async (lang) => {
    if (this.props.profileState) {
      await getUsersService().update({
        _id: this.props.profileState._id,
        lang,
      } as any)
    }
    window.location.reload();
  }

  render() {
    const { Footer } = Layout;

    return (
      <Layout style={{background: '#ffffff', display: 'flex', minHeight: '100vh', flexDirection: 'column'}}>
        {Object.keys(this.props.profileState).length && this.props.profileState.isLoggedIn ? (
          <UserLayoutHeader
            profileState={this.props.profileState}
            profileReducers={this.props.profileReducers}
            editProfilePageState={this.props.editProfilePageState}
            languageState={this.props.languageState}
          />
        ) : (
            <UserNotLoggedInHeader
              openLoginModal={this.props.openLoginModal}
              openRegisterModal={this.props.openRegisterModal}
              languageState={this.props.languageState}
            />
          )}

        {this.props.outerHeader ? this.props.outerHeader : <div></div>}

        <div style={{width: '100%', display: 'flex', justifyContent: 'center', flex: 1}}>
          <div style={{background: "#ffffff"}} className="responsiveLayout">
            {this.props.children}
          </div>
        </div>

        <Footer>
          <Row>
            <Col xs={24} lg={12}>
              Copyright © 2018 SkyAce™ Learning. All Rights Reserved
            </Col>
            {
              this.props.profileState && this.props.profileState._id ? 
              <Col xs={24} lg={12} style={{display: 'flex', justifyContent: 'flex-end'}}>
                <div>
                  Language:
                  <Select style={{minWidth: '100px'}} value={this.props.profileState && this.props.profileState.lang ? this.props.profileState.lang : 'en'}
                    onChange={this.handleChangeLanguage}
                  >
                    {this.state.languages.map((val) => {
                      return val && val.shortName ? 
                        <Select.Option value={val.shortName} key={val.shortName}>{val.name}</Select.Option> : undefined
                    })}
                  </Select>
                </div>              
              </Col> : <div></div>
            }
          </Row>
        </Footer>

        {(this.props.profileState.roles && this.props.profileState.roles.length === 0) && (
          <UpdateInforModal
            profileState={this.props.profileState}
            profileReducers={this.props.profileReducers}
            languageState={this.props.languageState}
          />
        )}
      </Layout>
    );
  }
}

export default UserLayout;
