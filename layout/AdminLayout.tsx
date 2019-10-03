import * as React from 'react';
import { Layout } from 'antd';
import LeftSideBar from '../components/LeftSideBar';
import AdminHeader from './AdminHeader';

interface IAppLayoutState {
  collapsed: boolean;
  visible: boolean;
  modalVisible: boolean;
}

class AppLayout extends React.Component<any, IAppLayoutState> {
  constructor(props: any) {
    super(props);
    this.state = {
      collapsed: false,
      visible: false,
      modalVisible: false
    };
  }

  toggleCollapsed = () => {
    this.setState({
      collapsed: !this.state.collapsed
    });
  }

  handleMenuClick = (e) => {
    if (e.key === '4') {
      this.setState({ visible: false });
    } else if (e.key === '3') {
      this.setState({ modalVisible: true});
    }
  }

  handleOk = () => {
    this.setState({modalVisible: false});
  }

  handleCancel = () => {
    this.setState({modalVisible: false});
  }

  handleVisibleChange = (flag) => {
    this.setState({ visible: flag });
  }

  render() {
    const { Footer } = Layout;

    return (
      <Layout>
        {this.props.profileState && this.props.profileState.isLoggedIn && (
          <LeftSideBar collapsed={this.state.collapsed} profileState={this.props.profileState} languageState={this.props.languageState}/>
        )}

        <Layout style={{background: '#ffffff', display: 'flex', minHeight: '100vh', flexDirection: 'column'}}>
          {this.props.profileState && this.props.profileState.isLoggedIn && (
            <AdminHeader
              profileState={this.props.profileState}
              profileReducers={this.props.profileReducers}
              collapsed={this.state.collapsed}
              toggleCollapsed={this.toggleCollapsed}
              languageState={this.props.languageState}
            />
          )}
          
          <div style={{width: '100%', justifyContent: 'center', flex: 1}}>
            {this.props.children}
          </div>

          <Footer>
            {this.props.languageState.ADMIN_LAYOUT_PAGE_FOOTER.translated}
          </Footer>
        </Layout>
      </Layout>
    );
  }
}

export default AppLayout;