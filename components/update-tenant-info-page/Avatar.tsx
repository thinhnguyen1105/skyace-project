import { Upload, Icon, Modal, message } from 'antd';
import React from 'react';
import config from '../../api/config/default.config';
class Avatar extends React.Component<any, any> {
  state = {
    previewVisible: false,
    previewImage: '',
    fileList: this.props.companyLogoSrc ? [{
      uid : -1, 
      name : 'logo.png',
      status: 'done',
      url : this.props.companyLogoSrc,
      type: 'image/png'
    }] : [],
  };

  handleCancel = () => this.setState({ previewVisible: false });

  handlePreview = (file) => {
    this.setState({
      previewImage: file.url || file.thumbUrl,
      previewVisible: true,
    });
  }

  handleChange = ({ fileList }) => {
    const file = fileList.length ? fileList[0] : null;
    if (file) {
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!(/\.(gif|jpg|jpeg|tiff|png)$/i).test(file.name)) {
        message.error(this.props.languageState.UPDATE_TENANT_AVATAR_VALIDATE_1.translated, 4);
      } else if (!isLt2M) {
        message.error(this.props.languageState.UPDATE_TENANT_AVATAR_VALIDATE_2.translated, 4);
      } else {
        this.setState({ fileList });
        this.props.changeFile(fileList);
      }
    } else return;
  }

  handleRemove = () => {
    this.setState({
      fileList: []
    });
    this.props.changeFile([]);
  }

  render() {
    const { previewVisible, previewImage, fileList } = this.state;
    const uploadButton = (
      <div>
        <Icon type="plus" />
        <div className="ant-upload-text">{this.props.languageState.UPDATE_TENANT_AVATAR_UPLOAD.translated}</div>
      </div>
    );
    return (
      <div className="clearfix">
        <Upload
          disabled={this.props.disableInput}
          action={`${config.nextjs.apiUrl}/images/upload/company-logo/${this.props._id}`}
          name="image"
          listType="picture-card"
          fileList={fileList as any}
          onPreview={this.handlePreview}
          onChange={this.handleChange}
          onRemove={this.handleRemove}
        >
          {fileList.length >= 1 ? null : uploadButton}
        </Upload>
        <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
          <img alt="example" style={{ width: '100%' }} src={previewImage} />
        </Modal>
      </div>
    );
  }
}

export default Avatar;