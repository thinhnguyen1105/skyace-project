import React from 'react';
import { List, Avatar, Spin, Tag, Button } from 'antd';

interface IContactListProps {
  userId: string;
  openChatBox: (conversation: any) => void;
  isLoadingConversation: boolean;
  conversationsList: any[];
  userNotifications: any;
  unreadConversations: any[];
  loadmoreConversation: () => void;
  languageState: any;
}

const ConversationList = (props: IContactListProps) => {
  return (
    <Spin spinning={props.isLoadingConversation}>
      <List
        className="noti-list"
        dataSource={props.conversationsList}
        renderItem={_item => <div/>}
      >
        {props.conversationsList.map((item, index) => {
          const isGroup = item.groupTuition && Object.keys(item.groupTuition).length > 0 ? true : false;
          const participants = item.participants ? item.participants.filter((item) => item._id !== props.userId) : [];
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
          chatTitle += ` (${item.tuition && item.tuition._id ? item.tuition.referenceId : item.groupTuition && item.groupTuition._id ? item.groupTuition.referenceId : ''})`;
          
          return (
            <List.Item className="noti-list-item" key={index}>
              <a onClick={(_e) => props.openChatBox(item)}>
                <List.Item.Meta
                  className="noti-list-item-meta"
                  avatar={<Avatar className="noti-list-item-meta-avatar" src={isGroup ? '/static/group-tuition.png' : item.participants.filter((participant) => participant._id !== props.userId)[0].imageUrl ? item.participants.filter((participant) => participant._id !== props.userId)[0].imageUrl : '/static/default.png'} />}
                  title={<div className="noti-list-item-meta-title">
                    <span>
                      <span style={{fontWeight: 600, fontSize: '16px'}}>
                        {chatTitle} &nbsp; {props.unreadConversations.indexOf(item._id) > -1 && (<Tag color='green'>New</Tag>)}
                      </span>
                      <br />
                      <span style={{fontWeight: 300, fontSize: '12px'}}>
                        {props.userNotifications[item._id] ? props.userNotifications[item._id].lastMessage : ''}
                      </span>
                    </span>
                  </div>}
                />
              </a> 
            </List.Item>
          )})}
        
        {props.conversationsList.length >= 10 && (
          <List.Item>
            <Button style={{width: '90%', margin: '0 auto'}} type='primary' onClick={props.loadmoreConversation}>{props.languageState.CONVERSATION_LIST_LOAD_MORE_BUTTON.translated}</Button>
          </List.Item>
        )}

        {props.conversationsList.length === 0 && (
          <List.Item>
            <p style={{width: '90%', margin: '0 auto', color: '#f5222d', textAlign: 'center'}}>{props.languageState.CONVERSATION_LIST_NO_NEW_MESSAGES.translated}</p>
          </List.Item>
        )}
      </List>
    </Spin>
  );
};

export default ConversationList;