import * as React from 'react';
import { Upload, Icon, message, Select, Row, Col, Card, Tooltip, Spin, Layout } from 'antd';
import AppLayout from '../layout/AdminLayout';
import initStore from '../rematch/store';
import withRematch from '../rematch/withRematch';
import config from '../api/config/default.config';
import { CopyToClipboard } from 'react-copy-to-clipboard';
const Content = Layout.Content;

const Dragger = Upload.Dragger;
const Option = Select.Option;
const { Meta } = Card;

class UploadImages extends React.Component<any, any> {
  static async getInitialProps(props: any) {
    if (!props.req) {
      const uploadImagesState = props.store.getState().uploadImagesModel;
      await props.store.dispatch.uploadImagesModel.getImagesEffect({
        title: uploadImagesState.currentAlbum
      });
    } else {
      props.store.dispatch.uploadImagesModel.getImageSuccess({ data: props.query.images });
    }
  }

  getBase64 = (img, callback) => {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result));
    reader.readAsDataURL(img);
  }

  hasWhiteSpace = (string) => {
    return /\s/g.test(string);
  }

  handleBeforeUpload = (file) => {
    if (file.type.slice(6, 10) !== 'png' && file.type.slice(6, 10) !== 'jpeg') {
      message.error('Only accept PNG or JPG file', 4);
    } else {
      this.getBase64(file, imageUrl =>
        this.props.uploadImagesReducers.onImageUploading({ file: file, base64Image: imageUrl }));
    }
    return true;
  }

  handleAlbumChange = async (value) => {
    await this.props.uploadImagesReducers.onChangeAlbum({ currentAlbum: value });
    this.props.uploadImagesReducers.getImagesEffect({ title: value });
  }

  handleDeleteImage = (id) => {
    this.props.uploadImagesReducers.deleteImageEffect({ title: this.props.uploadImagesState.currentAlbum, id: id });
  }

  render() {
    const renderImages = (
      this.props.uploadImagesState.data.length !== 0 ?
        this.props.uploadImagesState.dataHyperLink.map((value, index) => {
          return (
            <Col xs={24} sm={12} md={8} lg={4} key={index}>
              <Card
                bodyStyle={{ height: '150px' }}
                cover={<div style={{
                  backgroundImage: `url(${this.props.uploadImagesState.imageTemporary && index === 0
                    ? this.props.uploadImagesState.imageTemporary
                    : value})`, height: '200px', backgroundSize: 'cover'
                }}></div>}
                actions={[
                  <CopyToClipboard text={value} onCopy={() => message.success('Copied to clipboard')}>
                    <Tooltip title="Copy Hyperlink" key="copy"><Icon type="copy" /></Tooltip>
                  </CopyToClipboard>
                  ,
                  <Tooltip
                    title="Delete Image" key="delete"><Icon type="delete"
                      onClick={() => this.handleDeleteImage(this.props.uploadImagesState.data[index])} />
                  </Tooltip>]}
              > {
                  <Meta
                    title={this.props.uploadImagesState.data[index]}
                    description={value.length > 50 ? `${value.substring(0, 50)}...` : value}
                  />
                }
              </Card>
            </Col>
          );
        }) : null
    );
    return (
      <AppLayout profileState={this.props.profileState} profileReducers={this.props.profileReducers} languageState={this.props.languageState}>
        <Row className='margin-bottom-large' style={{ padding: '0px 10px 0px 10px', marginTop: '10px' }}>
          <Content style={{ fontWeight: "bold", fontSize: 20, margin: 20 }}>
            Upload Image
          </Content>
        </Row>
        <Spin spinning={this.props.uploadImagesState.isBusy}>
          <Row>
            <Col span={8} offset={8} style={{ marginTop: '40px', marginBottom: '25px' }}>
              <Dragger
                name='image'
                multiple={false}
                action={`${config.nextjs.apiUrl}/images/upload/${this.props.uploadImagesState.currentAlbum}`}
                showUploadList={false}
                beforeUpload={(file) => this.handleBeforeUpload(file)}
                onChange={({ file, fileList, event }) => console.log(file)}
              >
                <p className="ant-upload-drag-icon">
                  <Icon type="inbox" />
                </p>
                <p className="ant-upload-text">Click or drag file to this area to upload</p>
                <p className="ant-upload-hint">Support for a single or bulk upload. Strictly prohibit from uploading company data or other band files</p>
              </Dragger>
            </Col>

          </Row>
          <Row style={{ position: 'relative' }}>
            <div style={{ position: 'relative', left: '50%', transform: 'translateX(-15%)', marginBottom: '20px' }}>
              <span>Choose Folder: </span>
              <Select
                style={{ width: 240 }}
                defaultValue='default'
                onChange={(value) => this.handleAlbumChange(value)}>
                <Option value="default">Default</Option>
                <Option value="blog">Blog</Option>
              </Select>
            </div>
          </Row>
          <Row>
            {renderImages}
          </Row>
        </Spin>
      </AppLayout>
    );
  }
}

const mapState = (rootState: any) => {
  return {
    profileState: rootState.profileModel,
    uploadImagesState: rootState.uploadImagesModel,
    languageState: rootState.languageModel,
  };
};

const mapDispatch = (rootReducer: any) => {
  return {
    profileReducers: rootReducer.profileModel,
    uploadImagesReducers: rootReducer.uploadImagesModel
  };
};

export default withRematch(initStore, mapState, mapDispatch)(UploadImages);