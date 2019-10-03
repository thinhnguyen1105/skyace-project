import * as React from "react";
import { Row, Col, Input, Button, Popconfirm, Modal, Icon, AutoComplete, message, Layout, Upload } from "antd";
import AppLayout from "../../layout/AdminLayout";
import initStore from "../../rematch/store";
import withRematch from "../../rematch/withRematch";
import axios, { AxiosResponse } from 'axios';
import "./language.css";
import config from '../../api/config';
import { getLanguageService } from '../../service-proxies';

const Content = Layout.Content;
class LanguagePage extends React.Component<any, any> {
  static async getInitialProps(_props: any) {
    //
  }

  state = {
    data: [],
    fileList: [],
    isUploading: false,
    createModalVisible: false,
    url: undefined,
    uid: undefined,
    name: undefined,
    shortName: undefined,
  }

  async componentDidMount(){
    const data = await getLanguageService().find();
    console.log('data', data);
    this.setState({
      data,
    })
  }

  handleOk = async () => {
    try {
      if (!this.state.name) {
        message.error(this.props.languageState.LANGUAGE_PAGE_EXCEL_VALIDATE_1.translated)
      } else if (!this.state.shortName) {
        message.error(this.props.languageState.LANGUAGE_PAGE_EXCEL_VALIDATE_2.translated)
      } else if (!this.state.url) {
        message.error(this.props.languageState.LANGUAGE_PAGE_EXCEL_VALIDATE_3.translated)
      } else {
        const languageService = getLanguageService();
        const result = await languageService.create({
          url: this.state.url,
          name: this.state.name,
          shortName: this.state.shortName,
        })
        message.success('Created successfully!');
        this.setState({
          data: [result, ...this.state.data],
          createModalVisible: false,
          fileList: [],
          url: undefined,
          uid: undefined,
          name: undefined,
          shortName: undefined,
          isUploading: false
        })
      }
    } catch (err) {
      message.error(err.message || 'Internal server error', 4);
    }
  }

  changeInput = (obj: any) => {
    this.setState(obj);
  }
  
  handleChange = (obj: any) => {
    const fileExtensionRegex = /\.(xlsx)$/;
    const filterFileList = obj.fileList.filter((val: any) => {
      return !fileExtensionRegex.test(val.name);
    });
    this.setState({
      fileList: obj.fileList
    })
    if (filterFileList.length) {
      message.error('Only xlsx is available', 5);
    }
  }

  beforeUpload = (file: any) => {
    const fileExtensionRegex = /\.(xlsx)$/;
    let allowedUpload = true;
    if (!fileExtensionRegex.test(file.name)) {
      allowedUpload = false;
    }
    if (!allowedUpload) {
      // message.error('Ảnh không quá 2MB và chỉ nhận các định dạng PNG, JPG, JPEG.', 5);
    } else {
      this.uploadFile(file);
    }
    return false;
  }

  uploadFile = async (file: any) => {
    const formData = new FormData();
    formData.append('lang', file.originFileObj ? file.originFileObj : file);

    try {
      await this.setState({
        isUploading: true,
      });
      const result: AxiosResponse = await axios({
        method: 'post',
        url: `${config.nextjs.apiUrl}/language/upload-file`,
        data: formData,
        headers: {'Content-Type': 'multipart/form-data' },
      });
      // this.props.changeInput({
      //   avatar: {
      //     uid: file.uid,
      //     url: result.data,
      //   },
      // });
      this.setState({
        url: result.data,
        uid: file.uid,
      })
      this.setState({
        isUploading: false,
      });
    } catch (error) {
      message.error(error.message || 'Error happened, please try again later.', 4);
      this.setState({
        isUploading: false,
      });
      // tslint:disable-next-line
      console.log(error);
    }
  }

  toggleCreateModal = (visible: boolean) => {
    this.setState({
      createModalVisible: visible,
    })
  }

  cancelCreate = () => {
    this.setState({
      createModalVisible: false,
      fileList: [],
      url: undefined,
      uid: undefined,
      name: undefined,
      shortName: undefined,
      isUploading: false
    })    
  }

  render() {
    const uploadButton = (
      <div style={{cursor: 'pointer'}}>
        <Icon type="upload" /> Click to Upload
      </div>
    );

    return (
      <AppLayout
        profileState={this.props.profileState}
        profileReducers={this.props.profileReducers}
        languageState={this.props.languageState}
      >
        <div className="exchange-rate-page">
          <Row className='margin-bottom-large'>
            <Content style={{ fontWeight: "bold", fontSize: 20, marginBottom: 20 }}>
              {this.props.languageState.LANGUAGE_PAGE_HEADLINE.translated}
          </Content>
            <hr />
          </Row>
          <Row gutter={12} style={{paddingLeft: '15px'}}>
            <h3>{this.props.languageState.LANGUAGE_PAGE_SUPPORT.translated}</h3>
            {this.state.data && this.state.data.length ? this.state.data.map((val: any, index) => {
              return (<Col xs={24} lg={12} key={index}>
                <h4>- {val.name} - {val.shortName}</h4>
              </Col>);
            }) : ""}
          </Row>
          <Row>
            <Col xs={24} style={{marginTop: '20px'}}>
              <Button type="primary" onClick={() => this.toggleCreateModal(true)}><Icon type="plus"></Icon>{this.props.languageState.LANGUAGE_PAGE_CREATE.translated}</Button>
              <Modal
                title={this.props.languageState.LANGUAGE_PAGE_CREATE_MODAL.translated}
                visible={this.state.createModalVisible}
                onOk={this.handleOk}
                onCancel={() => this.cancelCreate()}
                okText="Create"
                cancelButtonProps={{ style: { background: "red", color: "white", minWidth: "55px" }, type: 'danger' }}
              >
                <Row gutter={12}>
                  <Col xs={24} lg={12} style={{marginBottom: '15px'}}>
                    <h4 style={{display: 'inline-block'}}>{this.props.languageState.LANGUAGE_PAGE_CREATE_NAME.translated}</h4>
                    {/* <Input placeholder="Enter currency's name" value={this.props.createInputName} onChange={(e) => this.props.changeCreateInputName(e.target.value)}></Input> */}
                    <AutoComplete
                      style={{ width: '100%' }}
                      placeholder={this.props.languageState.LANGUAGE_PAGE_CREATE_NAME.translated}
                      dataSource={[]}
                      value={this.state.name}
                      filterOption={(inputValue, option) => (option.props.children as any).toString().toUpperCase().indexOf(inputValue.toUpperCase()) !== -1}
                      onChange={(value) => this.changeInput({name : value})}
                    />
                  </Col>
                  <Col xs={24} lg={12} style={{marginBottom: '15px'}}>
                    <h4 style={{display: 'inline-block'}}>Short name</h4>
                    {/* <Input placeholder="Enter currency's name" value={this.props.createInputName} onChange={(e) => this.props.changeCreateInputName(e.target.value)}></Input> */}
                    <AutoComplete
                      style={{ width: '100%' }}
                      placeholder='Short name'
                      dataSource={[]}
                      value={this.state.shortName}
                      filterOption={(inputValue, option) => (option.props.children as any).toString().toUpperCase().indexOf(inputValue.toUpperCase()) !== -1}
                      onChange={(value) => this.changeInput({shortName : value})}
                    />
                  </Col>
                  <Col xs={24} style={{marginBottom: '15px'}}>
                    <h4>{this.props.languageState.LANGUAGE_PAGE_EXCEL_IMPORT.translated}</h4>
                    {/* <Input placeholder="Enter currency's code" value={this.props.createInputCode} onChange={(e) => this.props.changeCreateInputCode(e.target.value)}></Input> */}
                    <Upload
                      beforeUpload={this.beforeUpload}
                      fileList={this.state.fileList}
                      onChange={this.handleChange}
                    >
                      {this.state.fileList.length >= 1 ? null : uploadButton}
                    </Upload>
                    
                  </Col>
                  <Col xs={24}>
                    <a style={{cursor: 'pointer'}} href="/static/xlsx/default.xlsx" download>
                    <span style={{display: 'inline-block', color: '#aaa'}}>{this.props.languageState.LANGUAGE_PAGE_EXCEL_EXAMPLE.translated}</span>
                    </a>
                  </Col>
                </Row>
              </Modal>
            </Col>
          </Row>
        </div>
      </AppLayout>
    );
  }
}

const mapState = (rootState: any) => {
  return {
    languageState: rootState.languageModel,
    profileState: rootState.profileModel,
  };
};

const mapDispatch = (rootReducer: any) => {
  return {
    ...rootReducer.languageModel,
    profileReducers: rootReducer.profileModel,
  };
};

export default withRematch(initStore, mapState, mapDispatch)(LanguagePage);
