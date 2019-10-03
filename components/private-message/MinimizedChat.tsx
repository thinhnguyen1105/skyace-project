import React from 'react';
import { Tag } from 'antd';

interface IMinimizedChatProps {
  chatTitle: string;
  closeChat: (conversationId: string) => void;
  conversation: any;
  unreadConversations: string[];
}

let ChatUIKit: any;
class MinimizedChat extends React.Component<IMinimizedChatProps, any> {
  state = {
    isImported: false,
  }

  async componentDidMount() {
    ChatUIKit = await import('@livechat/ui-kit');
    this.setState({
      isImported: true,
    });
  }

  closeChat = (event, _id) => {
    event.stopPropagation();
    this.props.closeChat(_id);
  }

  render() {
    return (
      <div>
        {this.state.isImported ? (
          <ChatUIKit.TitleBar
            style={{cursor: 'pointer'}}
            onClick={(this.props as any).maximize}
            rightIcons={[
              <ChatUIKit.IconButton key="close" onClick={(e) => this.closeChat(e, this.props.conversation._id)}>
                <ChatUIKit.CloseIcon />
              </ChatUIKit.IconButton>,
            ]}
            leftIcons={[this.props.unreadConversations.indexOf(this.props.conversation._id) > -1 ? <Tag color="#f5222d">1</Tag> : null]}
            title={this.props.chatTitle}
          />
        ) : null}
      </div>
    );
  }
}

export default MinimizedChat;