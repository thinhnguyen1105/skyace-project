import * as React from 'react';
import { Layout, Menu, Icon } from 'antd';
import Link from 'next/link';

class LeftSider extends React.Component<any, any> {
  render() {
    const sysAdminMenu = () => {
      return (
        <Menu
          mode='inline'
          theme='dark'
          inlineCollapsed={this.props.collapsed}
          defaultOpenKeys={this.props.collapsed ? [] : ['sysadmin', 'admin']}
        >
          <Menu.SubMenu title={<span><Icon type="hdd" /><span>{this.props.languageState.LEFT_SIDEBAR_SYS_ADMIN_TITLE.translated}</span></span>} key='sysadmin'>
            <Menu.Item key="skyace-admin-5">
              <Link href={'/distributors'}>
                <a>
                  <Icon type="smile" />
                  <span>{this.props.languageState.LEFT_SIDEBAR_LINK_TITLE_DISTRIBUTORS.translated}</span>
                </a>
              </Link>
            </Menu.Item>
            <Menu.Item key="skyace-admin-1">
              <Link href='/white-label-partners'>
                <a>
                  <Icon type="home" />
                  <span>{this.props.languageState.LEFT_SIDEBAR_LINK_TITLE_WHITE_LABEL_PARTNERS.translated}</span>
                </a>
              </Link>
            </Menu.Item>
            <Menu.Item key="white-label-admin-9">
              <Link href={'/admin/commission-fee'}>
                <a>
                  <Icon type="red-envelope" />
                  <span>{this.props.languageState.LEFT_SIDEBAR_LINK_TITLE_COMMISSION_FEES.translated}</span>
                </a>
              </Link>
            </Menu.Item>
            <Menu.Item key="skyace-admin-2">
              <Link href={'/blog/blog-page'}>
                <a>
                  <Icon type="file-text" />
                  <span>{this.props.languageState.LEFT_SIDEBAR_LINK_TITLE_BLOG.translated}</span>
                </a>
              </Link>
            </Menu.Item>
            <Menu.Item key="skyace-admin-3">
              <Link href={'/upload-images'}>
                <a>
                  <Icon type="camera" />
                  <span>{this.props.languageState.LEFT_SIDEBAR_LINK_TITLE_UPLOAD_IMAGES.translated}</span>
                </a>
              </Link>
            </Menu.Item>
            <Menu.Item key="skyace-admin-4">
              <Link href={'/exchange-rate'}>
                <a>
                  <Icon type="dollar" />
                  <span>{this.props.languageState.LEFT_SIDEBAR_LINK_TITLE_EXCHANGE_RATE.translated}</span>
                </a>
              </Link>
            </Menu.Item>
            <Menu.Item key="skyace-admin-156">
              <Link href={'/language'}>
                <a>
                  <Icon type="file-excel" />
                  <span>Languages</span>
                </a>
              </Link>
            </Menu.Item>
          </Menu.SubMenu>

          <Menu.SubMenu title={<span><Icon type="appstore" /><span>{this.props.languageState.LEFT_SIDEBAR_SKYACE_ADMIN_TITLE.translated}</span></span>} key='admin'>
            <Menu.Item key="white-label-admin-1">
              <Link href={'/admin/company-info'}>
                <a>
                  <Icon type="solution" />
                  <span>{this.props.languageState.LEFT_SIDEBAR_LINK_TITLE_PARTNER_INFO.translated}</span>
                </a>
              </Link>
            </Menu.Item>
            <Menu.Item key="white-label-admin-11">
              <Link href={`/partner-payment/${this.props.profileState.tenant._id}`}>
                <a>
                  <Icon type="dollar" />
                  <span>{this.props.languageState.LEFT_SIDEBAR_LINK_TITLE_PARTNER_PAYMENT.translated}</span>
                </a>
              </Link>
            </Menu.Item>
            <Menu.Item key="white-label-admin-2">
              <Link href='/admin/roles'>
                <a>
                  <Icon type="key" />
                  <span>{this.props.languageState.LEFT_SIDEBAR_LINK_TITLE_ROLE_MANAGEMENT.translated}</span>
                </a>
              </Link>
            </Menu.Item>
            <Menu.Item key="white-label-admin-3">
              <Link href={'/admin/dashboard'}>
                <a>
                  <Icon type="dashboard" />
                  <span>{this.props.languageState.LEFT_SIDEBAR_LINK_TITLE_DASHBOARD.translated}</span>
                </a>
              </Link>
            </Menu.Item>
            <Menu.Item key="white-label-admin-4">
              <Link href={'/admin/tuitions'}>
                <a>
                  <Icon type="contacts" />
                  <span>{this.props.languageState.LEFT_SIDEBAR_LINK_TITLE_TUITIONS.translated}</span>
                </a>
              </Link>
            </Menu.Item>
            <Menu.Item key="white-label-admin-5">
              <Link href={'/admin/student-transactions'}>
                <a>
                  <Icon type="file-protect" />
                  <span>{this.props.languageState.LEFT_SIDEBAR_LINK_TITLE_STUDENT_TRANSACTION.translated}</span>
                </a>
              </Link>
            </Menu.Item>
            <Menu.Item key="white-label-admin-65">
              <Link href={'/admin/tutor-transactions'}>
                <a>
                  <Icon type="file-protect" />
                  <span>{this.props.languageState.LEFT_SIDEBAR_LINK_TITLE_TUTOR_TRANSACTION.translated}</span>
                </a>
              </Link>
            </Menu.Item>
            <Menu.Item key="white-label-admin-15">
              <Link href={'/admin/promo-code'}>
                <a>
                  <Icon type="shopping-cart" />
                  <span>{this.props.languageState.LEFT_SIDEBAR_LINK_TITLE_PROMO_CODE.translated}</span>
                </a>
              </Link>
            </Menu.Item>
            <Menu.Item key="white-label-admin-6">
              <Link href={'/admin/landing-page'}>
                <a>
                  <Icon type="credit-card" />
                  <span>{this.props.languageState.LEFT_SIDEBAR_LINK_TITLE_LANDING_PAGE.translated}</span>
                </a>
              </Link>
            </Menu.Item>
            <Menu.Item key="white-flabel-admin-7">
              <Link href={'/admin/users'}>
                <a>
                  <Icon type="team" />
                  <span>{this.props.languageState.LEFT_SIDEBAR_LINK_TITLE_USERS.translated}</span>
                </a>
              </Link>
            </Menu.Item>
            {/* <Menu.Item key='white-flabll-admin'> */}
              <Menu.SubMenu title={<span><Icon type="schedule" /><span>{this.props.languageState.LEFT_SIDEBAR_ACADEMIC_SETUP_TITLE.translated}</span></span>} key='academic-setup'>
                <Menu.Item key="white-label-admin-academic-subject">
                  <Link href={'/admin/subject'}>
                    <a>
                      <Icon type="book" />
                      <span>{this.props.languageState.LEFT_SIDEBAR_LINK_TITLE_SUBJECTS.translated}</span>
                    </a>
                  </Link>
                </Menu.Item>
                <Menu.Item key="white-label-admin-academic-level">
                  <Link href={'/admin/level'}>
                    <a>
                      <Icon type="solution" />
                      <span>{this.props.languageState.LEFT_SIDEBAR_LINK_TITLE_LEVELS.translated}</span>
                    </a>
                  </Link>
                </Menu.Item>
                <Menu.Item key="white-label-admin-academic-grade">
                  <Link href={'/admin/grade'}>
                    <a>
                      <Icon type="calculator" />
                      <span>{this.props.languageState.LEFT_SIDEBAR_LINK_TITLE_GRADES.translated}</span>
                    </a>
                  </Link>
                </Menu.Item>
                <Menu.Item key="white-label-admin-8">
                  <Link href={'/admin/academic-setup'}>
                    <a>
                      <Icon type="schedule" />
                      <span>{this.props.languageState.LEFT_SIDEBAR_LINK_TITLE_ACADEMIC_SETUP.translated}</span>
                    </a>
                  </Link>
                </Menu.Item>
              </Menu.SubMenu>
            {/* </Menu.Item> */}
            <Menu.Item key="white-label-admin-10">
              <Link href={'/admin/notifications'}>
                <a>
                  <Icon type="setting" />
                  <span>{this.props.languageState.LEFT_SIDEBAR_LINK_TITLE_NOTIFICATIONS.translated}</span>
                </a>
              </Link>
            </Menu.Item>
          </Menu.SubMenu>
        </Menu>
      );
    };

    const franchiseMenu = () => {
      return (
        <Menu
          mode='inline'
          theme='dark'
          inlineCollapsed={this.props.collapsed}
          openKeys={this.props.collapsed ? [] : ['franchise']}
        >
          <Menu.SubMenu title={<span><Icon type="hdd" /><span>{this.props.languageState.LEFT_SIDEBAR_LINK_TITLE_DISTRIBUTORS.translated}</span></span>} key='franchise'>
            <Menu.Item key="franchise-1">
              <Link href='/white-label-partners'>
                <a>
                  <Icon type="home" />
                  <span>{this.props.languageState.LEFT_SIDEBAR_LINK_TITLE_WHITE_LABEL_PARTNERS.translated}</span>
                </a>
              </Link>
            </Menu.Item>
            <Menu.Item key="franchise-2">
              <Link href={`/distributor-detail/${this.props.profileState._id}`}>
                <a>
                  <Icon type="setting" />
                  <span>{this.props.languageState.LEFT_SIDEBAR_LINK_TITLE_DISTRIBUTOR_PROFILE.translated}</span>
                </a>
              </Link>
            </Menu.Item>
            <Menu.Item key="franchise-3">
              <Link href={`/distributor-payment/${this.props.profileState._id}`}>
                <a>
                  <Icon type="dollar" />
                  <span>{this.props.languageState.LEFT_SIDEBAR_LINK_TITLE_DISTRIBUTOR_PAYMENT.translated}</span>
                </a>
              </Link>
            </Menu.Item>
          </Menu.SubMenu>
        </Menu>
      );
    };

    const whiteLabelAdminMenu = () => {
      return (
        <Menu
          mode='inline'
          theme='dark'
          inlineCollapsed={this.props.collapsed}
        >
          <Menu.Item key="white-label-admin-1">
            <Link href={'/admin/company-info'}>
              <a>
                <Icon type="solution" />
                <span>{this.props.languageState.LEFT_SIDEBAR_LINK_TITLE_PARTNER_INFO.translated}</span>
              </a>
            </Link>
          </Menu.Item>
          <Menu.Item key="white-label-admin-11">
            <Link href={`/partner-payment/${this.props.profileState.tenant._id}`}>
              <a>
                <Icon type="dollar" />
                <span>{this.props.languageState.LEFT_SIDEBAR_LINK_TITLE_PARTNER_PAYMENT.translated}</span>
              </a>
            </Link>
          </Menu.Item>
          <Menu.Item key="white-label-admin-2">
            <Link href='/admin/roles'>
              <a>
                <Icon type="key" />
                <span>{this.props.languageState.LEFT_SIDEBAR_LINK_TITLE_ROLE_MANAGEMENT.translated}</span>
              </a>
            </Link>
          </Menu.Item>
          <Menu.Item key="white-label-admin-3">
            <Link href={'/admin/dashboard'}>
              <a>
                <Icon type="dashboard" />
                <span>{this.props.languageState.LEFT_SIDEBAR_LINK_TITLE_DASHBOARD.translated}</span>
              </a>
            </Link>
          </Menu.Item>
          <Menu.Item key="white-label-admin-4">
            <Link href={'/admin/tuitions'}>
              <a>
                <Icon type="contacts" />
                <span>{this.props.languageState.LEFT_SIDEBAR_LINK_TITLE_TUITIONS.translated}</span>
              </a>
            </Link>
          </Menu.Item>
          <Menu.Item key="white-label-admin-5">
            <Link href={'/admin/student-transactions'}>
              <a>
                <Icon type="file-protect" />
                <span>{this.props.languageState.LEFT_SIDEBAR_LINK_TITLE_STUDENT_TRANSACTION.translated}</span>
              </a>
            </Link>
          </Menu.Item>
          <Menu.Item key="white-label-admin-65">
            <Link href={'/admin/tutor-transactions'}>
              <a>
                <Icon type="file-protect" />
                <span>{this.props.languageState.LEFT_SIDEBAR_LINK_TITLE_TUTOR_TRANSACTION.translated}</span>
              </a>
            </Link>
          </Menu.Item>
          <Menu.Item key="white-label-admin-15">
            <Link href={'/admin/promo-code'}>
              <a>
                <Icon type="shopping-cart" />
                <span>{this.props.languageState.LEFT_SIDEBAR_LINK_TITLE_PROMO_CODE.translated}</span>
              </a>
            </Link>
          </Menu.Item>
          <Menu.Item key="white-label-admin-6">
            <Link href={'/admin/landing-page'}>
              <a>
                <Icon type="credit-card" />
                <span>{this.props.languageState.LEFT_SIDEBAR_LINK_TITLE_LANDING_PAGE.translated}</span>
              </a>
            </Link>
          </Menu.Item>
          <Menu.Item key="white-flabel-admin-7">
            <Link href={'/admin/users'}>
              <a>
                <Icon type="team" />
                <span>{this.props.languageState.LEFT_SIDEBAR_LINK_TITLE_USERS.translated}</span>
              </a>
            </Link>
          </Menu.Item>
          <Menu.Item key="white-label-admin-8">
            <Link href={'/admin/academic-setup'}>
              <a>
                <Icon type="schedule" />
                <span>{this.props.languageState.LEFT_SIDEBAR_LINK_TITLE_ACADEMIC_SETUP.translated}</span>
              </a>
            </Link>
          </Menu.Item>
          <Menu.Item key="white-label-admin-9">
            <Link href={'/admin/commission-fee'}>
              <a>
                <Icon type="red-envelope" />
                <span>{this.props.languageState.LEFT_SIDEBAR_LINK_TITLE_COMMISSION_FEES.translated}</span>
              </a>
            </Link>
          </Menu.Item>
          <Menu.Item key="white-label-admin-10">
            <Link href={'/admin/notifications'}>
              <a>
                <Icon type="setting" />
                <span>{this.props.languageState.LEFT_SIDEBAR_LINK_TITLE_NOTIFICATIONS.translated}</span>
              </a>
            </Link>
          </Menu.Item>
        </Menu>
      );
    };
    return (
      <Layout.Sider collapsed={this.props.collapsed} collapsedWidth={80} width={288}>
        <div style={{height: '64px', background: '#02284e'}}>
          <a href="/"
            style={{
              display: 'block',
              height: '100%',
              paddingTop: this.props.collapsed ? '18px' : '10px',
              paddingBottom: '10px',
            }}>
            <img
              src={this.props.collapsed ? '/static/images/favicon.png' : '/static/images/skyace-no-cloud.png'}
              style={{
                width: 'auto',
                height: this.props.collapsed ? '32px' : '100%',
                display: 'block',
                margin: '0 auto',
              }}
            />
          </a>
        </div>

        <div style={{width: 'auto', minHeight: '100vh', fontWeight: 600}}>
          {this.props.profileState.roles.indexOf('admin') > -1 && (
            whiteLabelAdminMenu()
          )}

          {this.props.profileState.tenant.name === 'admin' && this.props.profileState.roles.indexOf('sysadmin') > -1 && (
            sysAdminMenu()
          )}

          {this.props.profileState.tenant.name === 'admin' && this.props.profileState.roles.indexOf('franchise') > -1 && (
            franchiseMenu()
          )}
        </div>
      </Layout.Sider>
    );
  }
}

export default LeftSider;
