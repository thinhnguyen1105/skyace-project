import React from 'react';
import { Layout, Icon, Row, Col, Menu, Dropdown, Modal, Popover, Badge } from 'antd';
import Link from 'next/link';
import Cookies from 'js-cookie';
import './Header.css';
import Router from 'next/router';
import config from '../api/config';
import { getConversationService } from '../service-proxies';
import ConversationList from './ConversationList';
import ChatBox from '../components/private-message/ChatBox';
import firebase from 'firebase';
import initFirebaseApp from '../nextjs/helpers/init-firebase';

class UserLayoutHeader extends React.Component<any, any> {
  state = {
    logOutModalVisible: false,

    conversationsList: [],
    isLoadingConversation: false,
    conversationPageNumber: 1,
    openConversations: [],
    selectedConversation: '',

    messageList: [],
    isLoadingMessage: false,
    hasMoreItem: true,

    unreadMessageCount: 0,
    unreadConversations: [],
    userNotifications: {} as any,
  };

  componentDidMount() {
    if (!firebase.apps.length) {
      initFirebaseApp();
    }

    firebase.database().ref(`skyace-notification/${this.props.profileState._id}`).on('value', (snapshot) => {
      if ((snapshot as any).val()) {
        const userNotifications = {};
        for (let item of Object.keys((snapshot as any).val())) {
          userNotifications[item] = (snapshot as any).val()[item];
        }

        let unreadMessageCount: number = 0;
        let unreadConversations: string[] = [];
        for (let item of Object.keys(userNotifications)) {
          if (!userNotifications[item].seen) {
            unreadMessageCount += 1;
            unreadConversations.push(item)
          }
        }

        this.setState({
          unreadMessageCount: unreadMessageCount,
          unreadConversations: unreadConversations,
          userNotifications
        });
      }
    });
  }

  onLogout = () => {
    const urlRegex = config.nextjs.checkUrlRegexFrontEnd;
    const matchResult = window.location.host.match(urlRegex);
    const tenantName = matchResult && matchResult[1] ? matchResult[1].replace('.', '') : 'admin';

    Cookies.remove(`token_${tenantName}`, { domain: config.nextjs.cookieDomain });

    this.props.profileReducers.logOut();
    Router.push('/');
  }

  openLogOutModal = () => {
    this.setState({
      logOutModalVisible: true
    });
  }

  closeLogOutModal = () => {
    this.setState({
      logOutModalVisible: false,
    });
  }

  openConversationList = async (visible) => {
    if (visible && this.state.conversationsList.length === 0) {
      this.setState({
        isLoadingConversation: true,
      });

      try {
        const conversationsService = getConversationService();
        const conversationsListResult = await conversationsService.findConversationByUserId(
          this.props.profileState._id,
          this.state.unreadConversations,
          this.state.conversationPageNumber,
          10,
          'createdAt',
          true,
        );

        this.setState({
          conversationsList: conversationsListResult.data,
          isLoadingConversation: false,
        });
      } catch (error) {
        console.log(error)
      }
    } else {

      const promises = this.state.conversationsList.map((val: any) => {
        firebase.database().ref(`skyace-notification/${this.props.profileState._id}/${val._id}`).update({
          seen: true,
        });
      })
      await Promise.all(promises);
    }
  }

  loadmoreConversation = async () => {
    this.setState({
      isLoadingConversation: true,
    });

    try {
      const conversationsService = getConversationService();
      const conversationsListResult = await conversationsService.findConversationByUserId(
        this.props.profileState._id,
        this.state.unreadConversations,
        this.state.conversationPageNumber + 1,
        10,
        'createdAt',
        true,
      );

      this.setState({
        conversationsList: [...this.state.conversationsList, ...conversationsListResult.data],
        isLoadingConversation: false,
        conversationPageNumber: this.state.conversationPageNumber + 1,
      });
    } catch (error) {
      console.log(error)
    }
  }

  openChatBox = (conversation) => {
    (document.getElementsByClassName('ant-popover').item(0) as any).classList.add('ant-popover-hidden');
    if (this.state.openConversations.filter(val => val === conversation).length) return;
    else {
      this.setState({
        selectedConversation: conversation._id,
        openConversations: [...this.state.openConversations, conversation]
      });
    }
  }

  closeChat = (conversationId) => {
    this.setState({
      openConversations: this.state.openConversations.filter((item: any) => item._id !== conversationId),
    });
  }

  render() {
    const displayName = this.props.profileState.fullName ? this.props.profileState.fullName : this.props.profileState.email ? this.props.profileState.email : this.props.languageState.USER_LAYOUT_HEADER_NO_NAME.translated;

    const dropdownMenu = (
      <Menu className='user-menu' selectedKeys={[]}>
        <Menu.Item>
          <Link href={this.props.profileState.roles.indexOf('student') > -1 || this.props.profileState.roles.indexOf('admin') > -1 ? '/login-student/editProfileStudent' : '/edit-profile-user'}>
            <a>
              <Icon type="appstore-o" />
              &nbsp; {this.props.languageState.USER_LAYOUT_HEADER_PROFILE_LINK_TITLE.translated}
            </a>
          </Link>
        </Menu.Item>
        {this.props.editProfilePageState.openChangePasswordModal !== undefined && !this.props.editProfilePageState.externalLogin
          ? <Menu.Divider />
          : null}
        {this.props.editProfilePageState.openChangePasswordModal !== undefined && !this.props.editProfilePageState.externalLogin
          ? <Menu.Item disabled={this.props.editProfilePageState.openChangePasswordModal ? false : true}>
            <a onClick={this.props.editProfilePageState.openChangePasswordModal}>
              <Icon type="key" theme="outlined" />
              &nbsp; {this.props.languageState.USER_LAYOUT_HEADER_CHANGE_PASSWORD_LINK_TITLE.translated}
              </a>
          </Menu.Item>
          : null}
        <Menu.Divider />

        <Menu.Item key='logout'>
          <a onClick={this.openLogOutModal}>
            <Icon type='logout' className='user-menu-item-icon' />
            &nbsp; {this.props.languageState.USER_LAYOUT_HEADER_LOGOUT_LINK_TITLE.translated}
          </a>
        </Menu.Item>
      </Menu>
    );

    const studentMenu = () => {
      return (
        <Menu mode="horizontal" className='student-menu' style={{
          borderBottom: 'none',
          minHeight: '64px',
          lineHeight: '60px',
          fontWeight: 500,
          zIndex: 1
        }}>
          <Menu.Item key="student-0">
            <div style={{ height: '60px', padding: '11px 0' }}>
              <img
                src='/static/images/skyace-no-cloud.png'
                style={{
                  width: 'auto',
                  height: '42px',
                  display: 'block',
                  margin: '0 auto',
                }}
              />
            </div>
          </Menu.Item>
          <Menu.Item key="student-1">
            <Link href={'/login-student/findATutor'}>
              <a><Icon type="search" /> {this.props.languageState.USER_LAYOUT_HEADER_FIND_TUTOR_LINK_TITLE.translated}</a>
            </Link>
          </Menu.Item>
          <Menu.Item key="student-2">
            <Link href={'/my-tuition'}>
              <a><Icon type="home" /> {this.props.languageState.USER_LAYOUT_HEADER_MY_TUITIONS_LINK_TITLE.translated}</a>
            </Link>
          </Menu.Item>
          <Menu.Item key="student-3">
            <Link href={'/login-student/my-calendar'}>
              <a><Icon type="table" /> {this.props.languageState.USER_LAYOUT_HEADER_MY_CALENDAR_LINK_TITLE.translated}</a>
            </Link>
          </Menu.Item>
        </Menu>
      );
    };

    const tutorMenu = () => {
      return (
        <Menu mode="horizontal" className='student-menu' style={{
          borderBottom: 'none',
          height: '64px',
          lineHeight: '60px',
          fontWeight: 500,
          zIndex: 1
        }}>
          <Menu.Item key="tutor-0">
            <div style={{ height: '60px', padding: '11px 0' }}>
              <img
                src='/static/images/skyace-no-cloud.png'
                style={{
                  width: 'auto',
                  height: '42px',
                  display: 'block',
                  margin: '0 auto',
                }}
              />
            </div>
          </Menu.Item>
          <Menu.Item key="tutor-1">
            <Link href={'/tutor-dashboard'}>
              <a><Icon type="dashboard" />{this.props.languageState.USER_LAYOUT_HEADER_MY_DASHBOARD_LINK_TITLE.translated}</a>
            </Link>
          </Menu.Item>
          <Menu.Item key="tutor-2">
            <Link href={'/my-tuition'}>
              <a><Icon type="home" /> {this.props.languageState.USER_LAYOUT_HEADER_MY_TUITIONS_LINK_TITLE.translated}</a>
            </Link>
          </Menu.Item>
          <Menu.SubMenu title={<span><Icon type="team" /><span>{this.props.languageState.USER_LAYOUT_HEADER_TUTORING_LINK_TITLE.translated}</span></span>} key="tutor-3">
            <Menu.Item key="subject">
              <Link href={'/tutoring/subjects'}>
                <a><Icon type="book" /> {this.props.languageState.USER_LAYOUT_HEADER_SUBJECTS_LINK_TITLE.translated}</a>
              </Link>
            </Menu.Item>

            <Menu.Item key="availability">
              <Link href={'/calendar/tutor'}>
                <a><Icon type="calendar" /> {this.props.languageState.USER_LAYOUT_HEADER_AVAILABILITY_LINK_TITLE.translated}</a>
              </Link>
            </Menu.Item>
          </Menu.SubMenu>
        </Menu>
      );
    };

    return (
      <Layout.Header
        className='userlayout-header'
        style={{
          background: '#ffff',
          boxShadow: '7px 0px 11px 1px rgba(0, 0, 0, 0.2)',
          zIndex: 5,
          padding: 0
        }}
      >
        <Row>
          <Col span={16} className="responsive-big-menu">
            {this.props.profileState.roles.indexOf('student') > -1 ? studentMenu() : this.props.profileState.roles.indexOf('tutor') > -1 ? tutorMenu() : null}
          </Col>

          <Col xs={8}>
            <div style={{ textAlign: 'right', paddingRight: '24px' }}>
              <Popover
                content={<ConversationList
                  openChatBox={this.openChatBox}
                  conversationsList={this.state.conversationsList.sort((a: any, b: any) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())}
                  userNotifications={this.state.userNotifications}
                  isLoadingConversation={this.state.isLoadingConversation}
                  userId={this.props.profileState._id}
                  unreadConversations={this.state.unreadConversations}
                  loadmoreConversation={this.loadmoreConversation}
                  languageState={this.props.languageState}
                />}
                placement="bottomRight"
                trigger="click"
                arrowPointAtCenter={true}
                onVisibleChange={(visible) => this.openConversationList(visible)}
              >
                <span className="notification-button" style={{ cursor: 'pointer', display: 'inline-block', marginRight: '24px' }}>
                  <Badge count={this.state.unreadMessageCount}>
                    <a>
                      <img src='/static/chat.png' style={{ width: 20 }} />
                    </a>
                  </Badge>
                </span>
              </Popover>

              <Dropdown overlay={dropdownMenu}>
                <span className="responsive-display-name" style={{ cursor: 'pointer', display: 'inline-block' }}>
                  {displayName} &nbsp; <Icon type='down' />
                </span>
              </Dropdown>
            </div>
          </Col>
        </Row>

        {this.state.openConversations.map((item: any, index) => (
          <ChatBox
            key={item._id}
            userId={this.props.profileState._id}
            closeChat={this.closeChat}
            conversation={item}
            number={index}
            unreadConversations={this.state.unreadConversations}
            profileState={this.props.profileState}
          />
        ))}

        <Modal
          title="Log Out"
          visible={this.state.logOutModalVisible}
          onOk={this.onLogout}
          onCancel={this.closeLogOutModal}
          okText='Log Out'
          cancelText='Cancel'
        >
          <p style={{ fontSize: '16px', fontWeight: 500, textAlign: 'center', color: '#f5222d' }}>
          {this.props.languageState.USER_LAYOUT_HEADER_LOGOUT_COMFIRM_MESSAGE.translated}
          </p>
        </Modal>
      </Layout.Header>
    );
  }
}

export default UserLayoutHeader;