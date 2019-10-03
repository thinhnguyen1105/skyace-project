import React from 'react';
import { Modal, Button } from 'antd';

interface IAlertLoginModalProps {
  loginAlertModalVisible: boolean;
  closeLoginAlertModal: () => void;
  openLoginModal: () => void;
  openRegisterModal: () => void;
  languageState: any;
}

const AlertLoginModal = (props: IAlertLoginModalProps) => {
  console.log('props', props.languageState.ALERT_LOGIN_MODAL_TEXT, props.languageState.ALERT_LOGIN_MODAL_LOG_IN, props.languageState.ALERT_LOGIN_MODAL_SIGN_UP);
  return (
    props.languageState ? 
      <Modal
        visible={props.loginAlertModalVisible}
        style={{ fontWeight: 'bold', padding: 20 }}
        destroyOnClose={true}
        onCancel={props.closeLoginAlertModal}
        footer={null}
        width='400px'
      >
        <div>
          <h3 style={{ textAlign: 'center' }}>{props.languageState.ALERT_LOGIN_MODAL_TEXT.translated}.</h3>
    
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-around' }}>
            <Button
              type="primary"
              style={{
                width: '100px',
                height: '35px',
                backgroundColor: '#34dd48',
                borderColor: '#34dd48',
                color: 'white'
              }}
              onClick={props.openLoginModal}
            >
              {props.languageState.ALERT_LOGIN_MODAL_LOG_IN.translated}
            </Button>
            <Button
              type="primary"
              style={{
                width: '100px',
                height: '35px'
              }}
              onClick={props.openRegisterModal}
            >
              {props.languageState.ALERT_LOGIN_MODAL_SIGN_UP.translated}
            </Button>
          </div>
        </div>
      </Modal> : <div></div>
  );
};

export default AlertLoginModal;