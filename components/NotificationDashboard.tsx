import React from 'react';
import { getConversationService } from '../service-proxies';
import UnseenConversationList from '../layout/UnseenConversationList';
import ChatBox from '../components/private-message/ChatBox';
import firebase from 'firebase';
import initFirebaseApp from '../nextjs/helpers/init-firebase';

class NotificationDashboard extends React.Component<any, any> {
  constructor(props) {
    super(props);
    this.state = { 
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
  }

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
        let unreadConversations: any[] = [];
        for (let item of Object.keys(userNotifications)) {
          if (!userNotifications[item].seen) {
            unreadMessageCount += 1;
            unreadConversations.push({
              _id : item,
              time : userNotifications[item].time
            })
          }
        }

        this.setState({
          unreadMessageCount: unreadMessageCount,
          unreadConversations: unreadConversations,
          userNotifications
        });

        this.openConversationList(true);
      }
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
          this.state.unreadConversations.map(val => val._id),
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
        this.state.unreadConversations.map(val => val._id),
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
    // (document.getElementsByClassName('ant-popover').item(0) as any).classList.add('ant-popover-hidden');
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
    return (
      <div className="unseen-noti">
        <UnseenConversationList
          openChatBox={this.openChatBox}
          conversationsList={this.state.conversationsList.filter(val => this.state.unreadConversations.map(val => val._id).indexOf(val._id) >= 0)}
          userNotifications={this.state.userNotifications}
          isLoadingConversation={this.state.isLoadingConversation}
          userId={this.props.profileState._id}
          unreadConversations={this.state.unreadConversations}
          loadmoreConversation={this.loadmoreConversation}
          languageState={this.props.languageState}
        />
        
        {this.state.openConversations.map((item: any, index) => (
          <ChatBox
            key={item._id}
            userId={this.props.profileState._id}
            closeChat={this.closeChat}
            conversation={item}
            number={index}
            unreadConversations={this.state.unreadConversations.map(val => val._id)}
            profileState={this.props.profileState}
          />
        ))}
      </div>
    );
  }
}

export default NotificationDashboard;