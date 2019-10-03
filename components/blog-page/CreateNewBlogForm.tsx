import React from 'react';
import { Button, message, Card } from 'antd';
import { Input, Form } from 'antd';
import dynamic from 'next/dynamic';
const BraftEditor = dynamic(import('braft-editor'));
import ImageUploader from '../../components/ImageUploader';
import 'braft-editor/dist/braft.css';
import './CreateNewBlogForm.css';
import config from '../../api/config/default.config';

class CreateNewBlogForm extends React.Component<any> {
  handleEditorChange = (content: any) => {
    return content;
  }

  saveAsDraftClick = (e: any) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        if (!values['new-content'] || values['new-content'].length < 30) {
          message.error('Please fill the editor (>= 27 words)', 4);
          return;
        } else if (this.props.form.getFieldValue('new-subtitle').length > 300 || this.props.form.getFieldValue('new-subtitle').length < 6) {
          message.error('Please fill subtitle (6 < words < 150)', 4);
          return;
        }

        const newPost = {
          title: this.props.form.getFieldValue('new-title'),
          subtitle: this.props.form.getFieldValue('new-subtitle'),
          content: this.props.form.getFieldValue('new-content'),
          author: this.props.profileState.email,
          imageSrc: '',
          viewCount: 1,
          postRating: 1,
          isActive: true,
          isDraft: true,
        };
        this.props.handleFormSubmit(newPost);
      }
    });
  }

  handleFormSubmit = (e: any) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        if (!values['new-content'] || values['new-content'].length < 30) {
          message.error(this.props.languageState.CREATE_NEW_BLOG_FORM_VALIDATE_1.translated, 4);
          return;
        } else if (this.props.form.getFieldValue('new-subtitle').length > 300 || this.props.form.getFieldValue('new-subtitle').length < 6) {
          message.error(this.props.languageState.CREATE_NEW_BLOG_FORM_VALIDATE_2.translated, 4);
          return;
        }

        const newPost = {
          title: this.props.form.getFieldValue('new-title'),
          subtitle: this.props.form.getFieldValue('new-subtitle'),
          content: this.props.form.getFieldValue('new-content'),
          author: this.props.profileState.email,
          imageSrc: '',
          viewCount: 1,
          postRating: 1,
          isActive: true,
          isDraft: false,
        };
        this.props.handleFormSubmit(newPost);
      }
    });
  }

  render(): JSX.Element {
    const { getFieldDecorator } = this.props.form;
    const editorProps: any = {
      height: 500,
      contentFormat: 'html' as any,
      onChange: this.handleEditorChange,
      language: 'en',
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
      placeholder: 'Subtitle',
      autosize: {
        minRows: 3,
        maxRows: 7,
      },
    };
    const renderImage = (
      !this.props.imageTemporary ? <div></div> :
        <Card
          style={{ width: 500 }}
          cover={<img alt="title" src={this.props.imageTemporary} />}
        />
    );
    return (
      <div className="editorWrapper">
        <h1>
          <b>{this.props.languageState.CREATE_NEW_BLOG_FORM_ADD_NEW.translated}</b>
        </h1>
        <br />
        <Form onSubmit={this.handleFormSubmit}>
          <Form.Item>
            {renderImage}
            <span style={{ fontWeight: 'bold' }}>{this.props.languageState.CREATE_NEW_BLOG_FORM_TITLE_IMAGE.translated}</span>
            <br />
            <span>{this.props.languageState.CREATE_NEW_BLOG_FORM_NOTE_IMAGE.translated}</span>
            <ImageUploader {...this.props} />
          </Form.Item>
          <Form.Item>
            {getFieldDecorator('new-title', {
              rules: [
                { required: true, message: this.props.languageState.CREATE_NEW_BLOG_FORM_TITLE_VALIDATE.translated },
              ],
              validateTrigger: 'onBlur',
              validateFirst: true,
            })(<Input size="large" placeholder="Title" />)}
          </Form.Item>

          <Form.Item>
            {getFieldDecorator('new-subtitle', {
              rules: [
                { required: true, message: this.props.languageState.CREATE_NEW_BLOG_FORM_SUBTITLE_VALIDATE.translated },
              ],
              validateTrigger: 'onBlur',
              validateFirst: true,
            })(<Input.TextArea {...subTitleProps} />)}
          </Form.Item>

          <Form.Item className="editor">
            {getFieldDecorator('new-content', {
              getValueFromEvent: this.handleEditorChange,
            })(<BraftEditor {...editorProps} />)}
          </Form.Item>
          <Button
            className="submitButton"
            type="default"
            loading={this.props.isBusy}
            onClick={(e) => this.saveAsDraftClick(e)}
            style={{ marginBottom: '20px' }}
          >
            Save as draft
          </Button>

          <Button
            className="submitButton"
            type="primary"
            htmlType="submit"
            loading={this.props.isBusy}
          >
            {this.props.languageState.CREATE_NEW_BLOG_FORM_PUBLISH.translated}
          </Button>
        </Form>
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
      message.success(this.props.languageState.CREATE_NEW_BLOG_FORM_UPLOAD_SUCCESS.translated);
    }
    const progressFn = (event) => {
      param.progress(event.loaded / event.total * 100)
    }
    const errorFn = (_response) => {
      param.error({
        msg: 'unable to upload.'
      })
      message.success(this.props.languageState.CREATE_NEW_BLOG_FORM_UPLOAD_FAILED.translated);
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
export default Form.create()(CreateNewBlogForm);
