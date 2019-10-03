import React from 'react';
import firebase from 'firebase';
import initFirebaseApp from '../../nextjs/helpers/init-firebase';
import MaximizedChat from './MaximizedChat';
import MinimizedChat from './MinimizedChat';

interface IChatBoxProps {
  number: number;
  userId: string;
  closeChat: (conversationId: string) => void;
  conversation: any;
  unreadConversations: string[];
  profileState: any;
}

let ChatUIKit: any;
class ChatBox extends React.Component<IChatBoxProps, any> {
  state = {
    isImported: false,
    hasMoreItem: true,
    messageList: [] as any,
    isLoadingMessage: false,
    isChildAddedFirst: true,
  };

  async componentDidMount() {
    if (!firebase.apps.length) {
      initFirebaseApp();
    }
    ChatUIKit = await import('@livechat/ui-kit');
    this.setState({
      isImported: true,
    });

    firebase.database().ref(`skyace-message/${this.props.conversation._id}/messages`).orderByKey().limitToLast(10).once('value', (_dataSnapshot) => {
      setTimeout(() => {
        const chatInputElement: any = document.getElementsByClassName('e1m92qam0');
        Array.from(chatInputElement).forEach((item: any) => item.addEventListener('click', async () => {
          try {
            await firebase.database().ref(`skyace-notification/${this.props.userId}/${this.props.conversation._id}`).update({
              seen: true,
            });
          } catch (error) {
            console.log(error);
          }
        }));

        const chatViewElement: any = (document.getElementById(this.props.conversation._id) as any).firstChild;
        chatViewElement.addEventListener('scroll', () => {
          if (this.state.hasMoreItem && chatViewElement.scrollTop === 0) {
            firebase.database().ref(`skyace-message/${this.props.conversation._id}/messages`).orderByKey().limitToLast(10).endAt((this.state.messageList[0] as any).id).on('value', (dataSnapshot) => {
              const messageList: any[] = [];
              (dataSnapshot as any).forEach((item) => {
                const message = item.val();
                if (this.state.messageList.map((ite => ite.id)).indexOf(item.key) === -1) {
                  messageList.push({
                    id: item.key,
                    ...message,
                  });
                }
              });

              this.setState({
                messageList: [...messageList, ...this.state.messageList],
                hasMoreItem: messageList.length < 9 ? false : true,
              });

              chatViewElement.scrollTop = 300;
            });
          }
        });
      }, 0);
    });

    firebase.database().ref(`skyace-message/${this.props.conversation._id}/messages`).orderByKey().limitToLast(10).on('child_added', (dataSnapshot) => {
      const messageContent = (dataSnapshot as any).val();
      
      this.setState({
        messageList: [...this.state.messageList, {id: (dataSnapshot as any).key, ...messageContent}],
      });
    });
  }

  handleNewUserMessage = async (newMessageContent: any) => {
    if (!firebase.apps.length) {
      initFirebaseApp();
    }

    const newMessage = {
      sender: {
        id: this.props.userId,
        fullName: this.props.profileState.fullName ? this.props.profileState.fullName : [this.props.profileState.firstName, this.props.profileState.lastName].join(' '),
      },
      ...newMessageContent,
    };
    
    await firebase.database().ref(`skyace-message/${this.props.conversation._id}/messages`).push(newMessage);
    const promises = this.props.conversation.participants.map(val => {
      return firebase.database().ref(`skyace-notification/${val._id}/${this.props.conversation._id}`).update({
        seen: val._id === newMessage.sender.id ? true : false,
        lastMessage: newMessageContent.type === 'text' ? newMessageContent.content : newMessageContent.type === 'media' ? 'New image' : 'System Notification',
        time: Date.now()
      });
    })
    await Promise.all(promises);
  }

  render() {
    const isGroup = this.props.conversation.groupTuition && Object.keys(this.props.conversation.groupTuition).length > 0 ? true : false;
    const participants = this.props.conversation.participants ? this.props.conversation.participants.filter((item) => item._id !== this.props.userId) : [];
    let chatTitle;
    if (isGroup) {
      switch(participants.length) {
        case 0 : 
          chatTitle = "";
          break;
        case 1 :
          chatTitle = participants[0].fullName;
          break;
        case 2 :
          chatTitle = `${participants[0].fullName} and ${participants[1].fullName}`;
          break;
        case 3 :
          chatTitle = `${participants[0].fullName}, ${participants[1].fullName} and 1 other}`;
          break;
        default :
          chatTitle = `${participants[0].fullName}, ${participants[1].fullName} and ${participants.length - 2} others`
      }
    } else {
      chatTitle = participants[0].fullName
    }

    return(
      <div className='maximized-chat'>
        {this.state.isImported ? (
          <ChatUIKit.ThemeProvider>
            <ChatUIKit.FixedWrapper.Root maximizedOnInit={true} style={{right: `${this.props.number * 412}px`}}>
              <ChatUIKit.FixedWrapper.Maximized>
                <MaximizedChat
                  {...this.props}
                  chatTitle={chatTitle}
                  messageList={this.state.messageList}
                  handleNewUserMessage={this.handleNewUserMessage}
                />
              </ChatUIKit.FixedWrapper.Maximized>

              <ChatUIKit.FixedWrapper.Minimized style={{ width: '400px', height: '48px', bottom: '0px', lineHeight: 'normal'}}>
                <MinimizedChat
                  {...this.props}
                  chatTitle={chatTitle}
                />
              </ChatUIKit.FixedWrapper.Minimized>
            </ChatUIKit.FixedWrapper.Root>
          </ChatUIKit.ThemeProvider>
        ) : null}
      </div>
    );
  }
}

export default ChatBox;