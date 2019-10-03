import * as React from 'react';
import { Button, Card, Form, Row, Col, Input, message } from 'antd';
import ImageUploader from '../ImageUploader';
import dynamic from 'next/dynamic';
const BraftEditor = dynamic(import('braft-editor'));
import 'braft-editor/dist/braft.css';
import './EditBlogForm.css';
import config from '../../api/config';

class EditBlogForm extends React.Component<any, any> {
  editorInstance: any;

  saveAsDraftClick = (e: any) => {
    e.preventDefault();
    this.props.form.validateFields(async (err, values) => {
      if (!err) {
        if (!values['edit-content']) {
          values['edit-content'] = this.editorInstance.props.value;
        } else if (values['edit-content'].length < 30) {
          message.error('Please fill the editor (>= 27 words)', 4);
          return;
        } else if (this.props.form.getFieldValue('edit-author').length > 30 || this.props.form.getFieldValue('edit-author').length < 6) {
          message.error('Please fill author (<30 & >6 words)', 4);
          return;
        }
        let formData = new FormData();
        formData.set('image', this.props.fileList[0]);
        await fetch(
          `${config.nextjs.apiUrl}/images/upload/blog/${this.props.dataPerPost._id}`, {
            method: 'POST',
            headers: {
              'authorization': this.props.profileState.token,
            },
            body: formData,
          }
        );
        const editedPost = {
          _id: this.props.dataPerPost._id,
          title: this.props.dataPerPost.title === this.props.form.getFieldValue('edit-title') ? undefined : this.props.form.getFieldValue('edit-title'),
          subtitle: this.props.dataPerPost.subtitle === this.props.form.getFieldValue('edit-subtitle') ? undefined : this.props.form.getFieldValue('edit-subtitle'),
          author: this.props.dataPerPost.author === this.props.form.getFieldValue('edit-author') ? undefined : this.props.form.getFieldValue('edit-author'),
          content: this.props.dataPerPost.content === values['edit-content'] ? undefined : values['edit-content'],
          tags: this.props.dataPerPost.tags,
          imageSrc: this.props.fileList.length === 0 ? this.props.dataPerPost.imageSrc : `/static/images/blog/image-${this.props.dataPerPost._id}.${this.props.fileList[0].type.slice(6, 10)}`,
          viewCount: this.props.dataPerPost.viewCount,
          postRating: this.props.dataPerPost.postRating,
          isActive: true,
          isDraft: true,
        };
        this.props.handleEditFormSubmit(editedPost);
      }
    });
  }

  handleEditFormSubmit = (e: any) => {
    e.preventDefault();
    this.props.form.validateFields(async (err, values) => {
      if (!err) {
        if (!values['edit-content']) {
          values['edit-content'] = this.editorInstance.props.value;
        } else if (values['edit-content'].length < 30) {
          message.error( this.props.languageState.EDIT_BLOG_FORM_VALIDATE_1.translated , 4);
          return;
        } else if (this.props.form.getFieldValue('edit-author').length > 30 || this.props.form.getFieldValue('edit-author').length < 6) {
          message.error( this.props.languageState.EDIT_BLOG_FORM_VALIDATE_2.translated, 4);
          return;
        }
        let formData = new FormData();
        formData.set('image', this.props.fileList[0]);
        await fetch(
          `${config.nextjs.apiUrl}/images/upload/blog/${this.props.dataPerPost._id}`, {
            method: 'POST',
            headers: {
              'authorization': this.props.profileState.token,
            },
            body: formData,
          }
        );
        const editedPost = {
          _id: this.props.dataPerPost._id,
          title: this.props.dataPerPost.title === this.props.form.getFieldValue('edit-title') ? undefined : this.props.form.getFieldValue('edit-title'),
          subtitle: this.props.dataPerPost.subtitle === this.props.form.getFieldValue('edit-subtitle') ? undefined : this.props.form.getFieldValue('edit-subtitle'),
          author: this.props.dataPerPost.author === this.props.form.getFieldValue('edit-author') ? undefined : this.props.form.getFieldValue('edit-author'),
          content: this.props.dataPerPost.content === values['edit-content'] ? undefined : values['edit-content'],
          tags: this.props.dataPerPost.tags,
          imageSrc: this.props.fileList.length === 0 ? this.props.dataPerPost.imageSrc : `/static/images/blog/image-${this.props.dataPerPost._id}.${this.props.fileList[0].type.slice(6, 10)}`,
          viewCount: this.props.dataPerPost.viewCount,
          postRating: this.props.dataPerPost.postRating,
          isActive: true,
          isDraft: false,
        };
        this.props.handleEditFormSubmit(editedPost);
      }
    });
  }

  handleEditorChange = (content: any) => {
    if (!content) {
      return this.editorInstance.getContent();
    }
    return content;
  }

  render(): JSX.Element {
    const editorProps: any = {
      height: 500,
      contentFormat: 'html' as any,
      onChange: this.handleEditorChange,
      language: 'en',
      initialContent: this.props.dataPerPost.content,
      media: {
        uploadFn: this.uploadFn,
        onInsert: this.onInsert,
        externalMedia: {
          image: true,
          audio: false,
          video: false,
          embed: false
        }
      },
    };

    const subTitleProps = {
      placeholder: this.props.languageState.EDIT_BLOG_FORM_SUBTITLE.translated,
      autosize: {
        minRows: 3,
        maxRows: 7,
      },
    };

    const imgRender = (
      this.props.fileList.length === 0 ? <Card style={{ width: 500 }} cover={<img src={this.props.dataPerPost.imageSrc} />} /> : <Card style={{ width: 500 }} cover={<img alt="title" src={this.props.imageTemporary} />} />
    );

    const { getFieldDecorator } = this.props.form;
    return (
      <div>
        <Button onClick={this.props.hideEditModal} type="default">
          {this.props.languageState.EDIT_BLOG_FORM_BACK.translated}
        </Button>

        <div className="editorWrapper">
          <Form onSubmit={this.handleEditFormSubmit}>
            <Row>
              <Col>
                <Row>
                  {imgRender}
                </Row>
                <Row>
                  <span style={{ fontWeight: 'bold' }}>
                    {this.props.languageState.EDIT_BLOG_FORM_TITLE_IMAGE.translated}
                  </span>
                  <br />
                  <span>{this.props.languageState.EDIT_BLOG_FORM_NOTE_IMAGE.translated}</span>
                  <ImageUploader {...this.props} />
                </Row>
                <Row gutter={16}>
                  <Col span={12}>
                    <Form.Item label={this.props.languageState.EDIT_BLOG_FORM_TITLE.translated}>
                      {getFieldDecorator('edit-title', {
                        rules: [
                          { required: true, message: this.props.languageState.EDIT_BLOG_FORM_TITLE_VALIDATE.translated },
                        ],
                        validateTrigger: 'onBlur',
                        validateFirst: true,
                        initialValue: this.props.dataPerPost.title,
                      })(
                        <Input placeholder={this.props.languageState.EDIT_BLOG_FORM_TITLE.translated} />
                      )}
                    </Form.Item>
                  </Col>

                  <Col span={12}>
                    <Form.Item label={this.props.languageState.EDIT_BLOG_FORM_AUTHOR.translated}>
                      {getFieldDecorator('edit-author', {
                        rules: [
                          { required: true, message: this.props.languageState.EDIT_BLOG_FORM_AUTHOR_VALIDATE.translated },
                        ],
                        validateTrigger: 'onBlur',
                        validateFirst: true,
                        initialValue: this.props.dataPerPost.author,
                      })(<Input placeholder="Author" />)}
                    </Form.Item>
                  </Col>
                </Row>

                <Form.Item label={this.props.languageState.EDIT_BLOG_FORM_SUBTITLE.translated}>
                  {getFieldDecorator('edit-subtitle', {
                    rules: [
                      { required: true, message: this.props.languageState.EDIT_BLOG_FORM_SUBTITLE_VALIDATE.translated },
                    ],
                    validateTrigger: 'onBlur',
                    validateFirst: true,
                    initialValue: this.props.dataPerPost.subtitle,
                  })(<Input.TextArea {...subTitleProps} />)}
                </Form.Item>
                <Form.Item className="editor">
                  {getFieldDecorator('edit-content', {
                    getValueFromEvent: this.handleEditorChange,
                  })(
                    <BraftEditor
                      ref={instance => (this.editorInstance = instance)}
                      {...editorProps}
                    />,
                  )}
                </Form.Item>

                <Button
                  loading={this.props.isBusy}
                  className="submitButton"
                  type="default"
                  onClick={(e) => this.saveAsDraftClick(e)}
                  style={{ marginBottom: '20px' }}
                >
                  Save as draft
                </Button>

                <Button
                  loading={this.props.isBusy}
                  className="submitButton"
                  htmlType="submit"
                  type="primary"
                >
                  {this.props.languageState.EDIT_BLOG_FORM_SAVE.translated}
                </Button>
              </Col>
            </Row>
          </Form>
        </div>
      </div>
    );
  }
  uploadFn = (param) => {
    const serverURL = `${config.nextjs.apiUrl}/images/upload/blog`
    const xhr = new XMLHttpRequest()
    const formData = new FormData()
    formData.set('image', param.file);
    const successFn = (_response) => {
      param.success({
        url: `/static/images/blog/${param.file.name}`
      })
      message.success('Upload Image Successful');
    }
    const progressFn = (event) => {
      param.progress(event.loaded / event.total * 100)
    }
    const errorFn = (_response) => {
      param.error({
        msg: 'unable to upload.'
      })
      message.success('Upload Image Failed');
    }
    xhr.upload.addEventListener('progress', progressFn, false)
    xhr.addEventListener('load', successFn, false)
    xhr.addEventListener('error', errorFn, false)
    xhr.addEventListener('abort', errorFn, false)
    // formData.append('upload', param.file)
    xhr.open('POST', serverURL, true)
    xhr.send(formData)
  }
  onInsert = (files) => {
    return files.slice(0, files.length);
  }
}

export default Form.create()(EditBlogForm);