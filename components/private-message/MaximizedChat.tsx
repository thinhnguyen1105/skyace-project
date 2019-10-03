import React from 'react';
import { Icon, Upload, Spin, Tag, message } from 'antd';
import config from '../../api/config';
import moment from 'moment';

interface IMaximizedChatProps {
  number: number;
  userId: string;
  closeChat: (conversationId: string) => void;
  conversation: any;
  unreadConversations: string[];
  profileState: any;

  chatTitle: string;
  messageList: any[];
  handleNewUserMessage: (newMessageContent: any) => void;
}

let ChatUIKit: any;
class MaximizedChat extends React.Component<IMaximizedChatProps, any> {
  state = {
    isImported: false,
  };

  async componentDidMount() {
    ChatUIKit = await import('@livechat/ui-kit');
    this.setState({
      isImported: true,
    });
  }

  inputDateInUserTimezone = (date: any = new Date().toString()) => {
    const browserTimezone = - new Date().getTimezoneOffset() / 60;
    const userTimezone = this.props.profileState.timeZone && this.props.profileState.timeZone.offset ? this.props.profileState.timeZone.offset : browserTimezone;
    const deltaTimezone = userTimezone - browserTimezone;

    return new Date(new Date(date).getTime() + deltaTimezone * 60 * 60 * 1000);
  }

  outputDateInUserTimezone = (date: any = new Date().toString()) => {
    const browserTimezone = - new Date().getTimezoneOffset() / 60;
    const userTimezone = this.props.profileState.timeZone && this.props.profileState.timeZone.offset ? this.props.profileState.timeZone.offset : browserTimezone;
    const deltaTimezone = userTimezone - browserTimezone;

    return new Date(new Date(date).getTime() - deltaTimezone * 60 * 60 * 1000);
  }

  messageListToMessageGroupList = (messageList) => {
    const messageGroupList: any[] = [];
    let group: any[] = [];
    for (let item of messageList) {
      if (group.length === 0) {
        group.push(item);
      } else if (group.length !== 0 && item.sender.id === group[group.length - 1].sender.id) {
        group.push(item);
      } else if (group.length !== 0 && item.sender.id !== group[group.length - 1].sender.id) {
        messageGroupList.push(group);
        group = [item];
      }
    }
    messageGroupList.push(group);

    return messageGroupList;
  }

  beforeUpload = (file) => {
    const imgExtensionRegex = /(\.jpg|\.jpeg|\.png|\.jfif|\.tiff|\.bmp)$/;
    if (file.size > 5 * 1024 * 1000) {
      message.error('File too large (Exceed 5MB)', 4);
      return false;
    } else if (!imgExtensionRegex.test(file.name)) {
      message.error('Only image file is accept', 4);
      return false;
    } else {
      return true;
    }
  }

  uploadFileChange = (uploadInfo) => {
    if (uploadInfo.file.status === 'done') {
      this.props.handleNewUserMessage({content: `/static/images/private-message/${uploadInfo.file.name}`, type: 'media'});
    }
  }

  closeChat = (event, _id) => {
    event.stopPropagation();
    this.props.closeChat(_id);
  }

  render() {
    if (!this.state.isImported) {
      return null;
    } else {
      return (
        <div style={{display: 'flex', flexDirection: 'column', height: '100%', lineHeight: 'normal'}}>
          <ChatUIKit.TitleBar
            style={{cursor: 'pointer'}}
            onClick={(this.props as any).minimize}
            rightIcons={[
              <ChatUIKit.IconButton key="close" onClick={(e) => this.closeChat(e, this.props.conversation._id)}>
                <ChatUIKit.CloseIcon />
              </ChatUIKit.IconButton>,
            ]}
            leftIcons={[this.props.unreadConversations.indexOf(this.props.conversation._id) > -1 ? <Tag color="#f5222d" key='#f5222d'>1</Tag> : null]}
            title={this.props.chatTitle}
          />
          <div style={{flexGrow: 1, minHeight: 0, height: '100%', background: '#ffffff'}} id={this.props.conversation._id}>
            {this.props.messageList.length > 0 ? (
              <ChatUIKit.MessageList active>
                {this.messageListToMessageGroupList(this.props.messageList).map((item, index) => (
                  <ChatUIKit.MessageGroup onlyFirstWithMeta={true} isOwn={item[0].sender.id === this.props.userId} key={index}>
                    {item.map((mess) => (
                      <ChatUIKit.Message
                        date={moment(this.inputDateInUserTimezone(mess.createdAt)).format('DD MMM YYYY HH:mm')}
                        authorName={mess.sender.id === this.props.userId ? '' : mess.sender.fullName}
                        isOwn={mess.sender.id === this.props.userId}
                        key={mess.id}
                      >
                        <ChatUIKit.Bubble isOwn={mess.sender.id === this.props.userId}>
                          {mess.type === 'text' ? (
                            <ChatUIKit.MessageText>
                              {mess.content}
                            </ChatUIKit.MessageText>
                          ) : mess.type === 'media' ? (
                            <ChatUIKit.MessageMedia>
                              <img src={mess.content} />
                            </ChatUIKit.MessageMedia>
                          ) : (
                            <ChatUIKit.QuickReplies
                              replies={[mess.content]}
                            />
                          )}
                        </ChatUIKit.Bubble>
                      </ChatUIKit.Message>
                    ))}
                  </ChatUIKit.MessageGroup>
                ))}
              </ChatUIKit.MessageList>
            ) : (<div style={{textAlign: 'center', paddingTop: '40px'}}><Spin spinning={true} /></div>)}
          </div>
          <ChatUIKit.TextComposer onSend={(newMessage) => this.props.handleNewUserMessage({content: newMessage, type: 'text', createdAt: this.outputDateInUserTimezone(new Date()).getTime()})}>
            <ChatUIKit.Row align="center">
              <ChatUIKit.Fill>
                <ChatUIKit.TextInput />
              </ChatUIKit.Fill>
              <ChatUIKit.Fit>
                <ChatUIKit.SendButton />
              </ChatUIKit.Fit>
              <ChatUIKit.Fit>
                <ChatUIKit.IconButton>
                  <Upload
                    beforeUpload={this.beforeUpload}
                    onChange={this.uploadFileChange}
                    showUploadList={false}
                    action={`${config.nextjs.apiUrl}/conversations/uploadChatImage`}
                    name='chatImage'
                  >
                    <Icon type='camera'/>
                  </Upload>
                </ChatUIKit.IconButton>
              </ChatUIKit.Fit>
            </ChatUIKit.Row>
          </ChatUIKit.TextComposer>
        </div>
      );
    }
  }
};

export default MaximizedChat
