import React from "react";
import {
  Card,
  Layout,
  Col,
  Row,
  Button,
  Upload,
  Icon,
  message,
  Input,
  Tabs,
  Form,
  Spin
} from "antd";
import dynamic from "next/dynamic";
const BraftEditor: any = dynamic(import("braft-editor"));
import { initStore } from "../../rematch/store";
import withRematch from "../../rematch/withRematch";
import AppLayout from "../../layout/AdminLayout";
import config from "../../api/config/default.config";
import LandingPagePreview from "../../components/LandingPagePreview";
import "./custom-landing-page.css";
import "braft-editor/dist/braft.css";

const FormItem = Form.Item;

class Page extends React.Component<any, any> {
  static async getInitialProps(props: any) {
    if (!props.req) {
      const blogPageState = props.store.getState().blogPageModel;
      await props.store.dispatch.blogPageModel.fetchDataEffect({
        search: blogPageState.search,
        pageNumber: blogPageState.pageNumber,
        pageSize: 3,
        sortBy: "createdAt",
        asc: false
      });

      await props.store.dispatch.tenantsPageModel.fetchDataEffect({
        search: '',
        pageNumber: 1,
        pageSize: 9999,
        sortBy: 'name',
        asc: true
      });
      const profileState = props.store.getState().profileModel;
      await props.store.dispatch.landingPageModel.getLandingPageDataEffect({
        tenantId: `${profileState.tenant._id}`
      })
      props.store.dispatch.blogPageModel.fetchDataSuccess({ result: props.query.blogs });
    } else {
      props.store.dispatch.blogPageModel.fetchDataSuccess({ result: props.query.blogs });
      props.store.dispatch.landingPageModel.getLandingPageDataSuccess({ data: props.query.landingPage });
      await props.store.dispatch.tenantsPageModel.fetchDataEffect({
        search: '',
        pageNumber: 1,
        pageSize: 999,
        sortBy: 'name',
        asc: true
      });
    }
  }

  state = {
    currentTab: "Custom",
    visible: false,
    onChangeText: "",
    onChangeImage: '<img src="static/top-banner-background.png"/>'
  };

  handleTabsChange = () => {
    this.props.form.validateFields( async (err, values) => {
      if (!err) {
        if (this.state.currentTab === "Custom") {
          await this.props.landingPageReducer.updateLandingPageState({
            mainTitle: values['main-title'],
            mainTitlePage2: values['main-title-page-2'],
            subTitlePage2:  values['subtitle-2'],
            informationCourses: values['information-courses'],
            tutorTitle: values['tutor-title'],
            studentTitle: values['student-title'],
            promoTitle1: values['promo-1'],
            promoTitle2: values['promo-2'],
            promoTitle3: values['promo-3'],
            blogTitle: values['blog-title'],
            mainTitlePage3: values['main-title-page-3'],
            mainTitlePage4: values['main-title-page-4'],
            footerContent1: values['footer-content-1'],
            footerContent2: values['footer-content-2'],
            footerContent3: values['footer-content-3'],
            footerContent4: values['footer-content-4'],
          })
          this.setState({ currentTab: "Preview" });
        } else if (this.state.currentTab === "Preview") {
          this.setState({ currentTab: "Custom" });
        }
      }
    });
  };

  handleOk = _e => {
    this.setState({
      visible: false
    });
  };

  handleCancel = _e => {
    this.setState({
      visible: false
    });
  };

  handleEditorChange = (html, keyValue) => {
    this.props.landingPageReducer.handleEditorChange({ html, keyValue });
  };

  handleContentChange = (html, pageValue, pageIndex) => {
    this.props.landingPageReducer.handleContentPageChange({
      pageValue,
      pageIndex,
      html
    });
  };

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields(async (err, values) => {
      if (!err) {
        await
          this.props.landingPageReducer.updateLandingPageDataEffect({
            tenantId: `${this.props.profileState.tenant._id}`,
            mainTitle: values['main-title'],
            mainTitlePage2: values['main-title-page-2'],
            subTitlePage2: values['subtitle-2'],
            informationCourses: values['information-courses'],
            tutorTitle: values['tutor-title'],
            studentTitle: values['student-title'],
            promoTitle1: values['promo-1'],
            promoTitle2: values['promo-2'],
            promoTitle3: values['promo-3'],
            blogTitle: values['blog-title'],
            footerContent1: values['footer-content-1'],
            footerContent2: values['footer-content-2'],
            footerContent3: values['footer-content-3'],
            footerContent4: values['footer-content-4'],
            tutorVideoUrl: `/static/images/landing-page/video-tutor-video-${this.props.profileState.tenant._id}.mp4`,
            tutorVideoOggUrl: `/static/images/landing-page/video-tutor-video-${this.props.profileState.tenant._id}.ogg`,
            tutorVideoWebmUrl: `/static/images/landing-page/video-tutor-video-${this.props.profileState.tenant._id}.webm`,
            studentVideoUrl: `/static/images/landing-page/video-student-video-${this.props.profileState.tenant._id}.mp4`,
            studentVideoOggUrl: `/static/images/landing-page/video-student-video-${this.props.profileState.tenant._id}.ogg`,
            studentVideoWebmUrl: `/static/images/landing-page/video-student-video-${this.props.profileState.tenant._id}.webm`
          });
      }
    });
  };

  handleUploadVideoChange = (file, videoType) => {
    if ((videoType === 'student' || videoType === 'tutor') && file.file.type.slice(6, 10) !== "mp4") {
      message.error("Only accept MP4 file", 4);
      return false;
    } else if ((videoType === 'student-ogg' || videoType === 'tutor-ogg') && file.file.type.slice(6, 10) !== "ogg") {
      message.error("Only accept OGG file", 4);
      return false;
    } else if ((videoType === 'student-webm' || videoType === 'tutor-webm') && file.file.type.slice(6, 10) !== "webm") {
      message.error("Only accept WEBM file", 4);
      return false;
    } else {
      if (videoType === 'student') {
        this.props.landingPageReducer.onChangeStudentVideoFileList(file);
      }
      if (videoType === 'student-ogg') {
        this.props.landingPageReducer.onChangeStudentVideoOggFileList(file);
      }
      if (videoType === 'student-webm') {
        this.props.landingPageReducer.onChangeStudentVideoWebmFileList(file);
      }
      if (videoType === 'tutor') {
        this.props.landingPageReducer.onChangeTutorVideoFileList(file);
      }
      if (videoType === 'tutor-ogg') {
        this.props.landingPageReducer.onChangeTutorVideoOggFileList(file);
      }
      if (videoType === 'tutor-webm') {
        this.props.landingPageReducer.onChangeTutorVideoWebmFileList(file);
      }
    }
  };

  handleUploadImageChange = async (file, pageValue, pageIndex, html) => {
    if (
      file.type.slice(6, 10) !== "png" &&
      pageIndex !== null &&
      pageValue !== null
    ) {
      message.error(this.props.languageState.WHITE_LABEL_LANDING_PAGE_UPLOAD_VALIDATE_1.translated, 4);
    } else if (
      file.type.slice(6, 10) !== "png" &&
      file.type.slice(6, 10) !== "jpeg"
    ) {
      message.error(this.props.languageState.WHITE_LABEL_LANDING_PAGE_UPLOAD_VALIDATE_2.translated, 4);
    } else {
      await this.getBase64(file, imageUrl =>
        this.props.landingPageReducer.handleBeforeUpload({
          pageValue,
          pageIndex,
          imageUrl
        })
      );
      this.props.landingPageReducer.handleImagePageChange({
        pageValue,
        pageIndex,
        html
      });
    }
  };

  getBase64 = (img, callback) => {
    const reader = new FileReader();
    reader.addEventListener("load", () => callback(reader.result));
    reader.readAsDataURL(img);
  };

  handleTenantSelectChange = (value) => {
    this.props.landingPageReducer.getLandingPageDataEffect({ tenantId: value })
    this.props.landingPageReducer.onTenantChange({ tenantId: value })
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const { Content } = Layout;
    const TabPane = Tabs.TabPane;

    const mainTitle: any = {
      height: "100%",
      contentFormat: "html",
      initialContent: `${this.props.landingPageState.data.mainTitle}`,
      language: "en",
      fontFamilies: [
        {
          name: "Araial",
          family: "Arial, Helvetica, sans-serif"
        },
        {
          name: "Open Sans",
          Family: "Open Sans, sans-serif"
        },
        {
          name: "Raleway",
          Family: "Raleway, sans-serif"
        }
      ],
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

    const mainTitlePage2: any = {
      height: "100%",
      contentFormat: "html",
      initialContent: `${this.props.landingPageState.data.mainTitlePage2}`,
      language: "en",
      fontFamilies: [
        {
          name: "Araial",
          family: "Arial, Helvetica, sans-serif"
        },
        {
          name: "Georgia",
          family: "Georgia, serif"
        },
        {
          name: "Impact",
          family: "Impact, serif"
        },
        {
          name: "Open Sans",
          Family: "Open Sans, sans-serif"
        },
        {
          name: "Raleway",
          Family: "Raleway, sans-serif"
        }
      ],
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

    const subTitlePage2: any = {
      height: "100%",
      contentFormat: "html",
      initialContent: `${this.props.landingPageState.data.subTitlePage2}`,
      language: "en",
      fontFamilies: [
        {
          name: "Araial",
          family: "Arial, Helvetica, sans-serif"
        },
        {
          name: "Georgia",
          family: "Georgia, serif"
        },
        {
          name: "Impact",
          family: "Impact, serif"
        },
        {
          name: "Open Sans",
          Family: "Open Sans, sans-serif"
        },
        {
          name: "Raleway",
          Family: "Raleway, sans-serif"
        }
      ],
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

    const informationCourses: any = {
      height: "100%",
      contentFormat: "html",
      initialContent: `${this.props.landingPageState.data.informationCourses}`,
      fontFamilies: [
        {
          name: "Araial",
          family: "Arial, Helvetica, sans-serif"
        },
        {
          name: "Open Sans",
          Family: "Open Sans, sans-serif"
        },
        {
          name: "Raleway",
          Family: "Raleway, sans-serif"
        }
      ],
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
      language: "en"
    };

    const mainTitlePage3: any = {
      height: "100%",
      contentFormat: "html",
      initialContent: `${this.props.landingPageState.data.pages[0].mainTitle}`,
      language: "en",
      fontFamilies: [
        {
          name: "Araial",
          family: "Arial, Helvetica, sans-serif"
        },
        {
          name: "Open Sans",
          Family: "Open Sans, sans-serif"
        },
        {
          name: "Raleway",
          Family: "Raleway, sans-serif"
        }
      ],
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

    const promo1: any = {
      height: "100%",
      contentFormat: "html",
      initialContent: `${this.props.landingPageState.data.promoTitle1}`,
      language: "en",
      fontFamilies: [
        {
          name: "Araial",
          family: "Arial, Helvetica, sans-serif"
        },
        {
          name: "Open Sans",
          Family: "Open Sans, sans-serif"
        },
        {
          name: "Raleway",
          Family: "Raleway, sans-serif"
        }
      ],
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

    const promo2: any = {
      height: "100%",
      contentFormat: "html",
      initialContent: `${this.props.landingPageState.data.promoTitle2}`,
      language: "en",
      fontFamilies: [
        {
          name: "Araial",
          family: "Arial, Helvetica, sans-serif"
        },
        {
          name: "Open Sans",
          Family: "Open Sans, sans-serif"
        },
        {
          name: "Raleway",
          Family: "Raleway, sans-serif"
        }
      ],
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

    const promo3: any = {
      height: "100%",
      contentFormat: "html",
      initialContent: `${this.props.landingPageState.data.promoTitle3}`,
      language: "en",
      fontFamilies: [
        {
          name: "Araial",
          family: "Arial, Helvetica, sans-serif"
        },
        {
          name: "Open Sans",
          Family: "Open Sans, sans-serif"
        },
        {
          name: "Raleway",
          Family: "Raleway, sans-serif"
        }
      ],
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

    const studentTitle: any = {
      height: "100%",
      contentFormat: "html",
      initialContent: `${this.props.landingPageState.data.studentTitle}`,
      language: "en",
      fontFamilies: [
        {
          name: "Araial",
          family: "Arial, Helvetica, sans-serif"
        },
        {
          name: "Open Sans",
          Family: "Open Sans, sans-serif"
        },
        {
          name: "Raleway",
          Family: "Raleway, sans-serif"
        }
      ],
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

    const tutorTitle: any = {
      height: "100%",
      contentFormat: "html",
      initialContent: `${this.props.landingPageState.data.tutorTitle}`,
      language: "en",
      fontFamilies: [
        {
          name: "Araial",
          family: "Arial, Helvetica, sans-serif"
        },
        {
          name: "Open Sans",
          Family: "Open Sans, sans-serif"
        },
        {
          name: "Raleway",
          Family: "Raleway, sans-serif"
        }
      ]
    };

    const blogTitle: any = {
      height: "100%",
      contentFormat: "html",
      initialContent: `${this.props.landingPageState.data.blogTitle}`,
      language: "en",
      fontFamilies: [
        {
          name: "Araial",
          family: "Arial, Helvetica, sans-serif"
        },
        {
          name: "Open Sans",
          Family: "Open Sans, sans-serif"
        },
        {
          name: "Raleway",
          Family: "Raleway, sans-serif"
        }
      ],
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

    const mainTitlePage4: any = {
      height: "100%",
      contentFormat: "html",
      initialContent: `${this.props.landingPageState.data.pages[1].mainTitle}`,
      language: "en",
      fontFamilies: [
        {
          name: "Araial",
          family: "Arial, Helvetica, sans-serif"
        },
        {
          name: "Open Sans",
          Family: "Open Sans, sans-serif"
        },
        {
          name: "Raleway",
          Family: "Raleway, sans-serif"
        }
      ],
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

    const gettingStarted: any = {
      height: "500px",
      contentFormat: "html",
      initialContent: `${this.props.landingPageState.data.footerContent1}`,
      language: "en",
      fontFamilies: [
        {
          name: "Araial",
          family: "Arial, Helvetica, sans-serif"
        },
        {
          name: "Open Sans",
          Family: "Open Sans, sans-serif"
        },
        {
          name: "Raleway",
          Family: "Raleway, sans-serif"
        }
      ],
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

    const Support: any = {
      height: "500px",
      contentFormat: "html",
      initialContent: `${this.props.landingPageState.data.footerContent2}`,
      language: "en",
      fontFamilies: [
        {
          name: "Araial",
          family: "Arial, Helvetica, sans-serif"
        },
        {
          name: "Open Sans",
          Family: "Open Sans, sans-serif"
        },
        {
          name: "Raleway",
          Family: "Raleway, sans-serif"
        }
      ],
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

    const Social: any = {
      height: "500px",
      contentFormat: "html",
      initialContent: `${this.props.landingPageState.data.footerContent3}`,
      language: "en",
      fontFamilies: [
        {
          name: "Araial",
          family: "Arial, Helvetica, sans-serif"
        },
        {
          name: "Open Sans",
          Family: "Open Sans, sans-serif"
        },
        {
          name: "Raleway",
          Family: "Raleway, sans-serif"
        }
      ],
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

    const Copyright: any = {
      height: "500px",
      contentFormat: "html",
      initialContent: `${this.props.landingPageState.data.footerContent4}`,
      language: "en",
      fontFamilies: [
        {
          name: "Araial",
          family: "Arial, Helvetica, sans-serif"
        },
        {
          name: "Open Sans",
          Family: "Open Sans, sans-serif"
        },
        {
          name: "Raleway",
          Family: "Raleway, sans-serif"
        }
      ],
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

    const renderPage3 = this.props.landingPageState.data.pages[0].icons.map(
      (value, index) => (
        <Col key={index} span={7}>
          <Layout style={{ margin: "0px 20px 20px 0px" }}>
            <Content
              style={{ fontWeight: "bold", fontSize: 14, padding: "10px" }}
            >
              {this.props.languageState.WHITE_LABEL_LANDING_PAGE_ICON_FILES.translated}
            </Content>
            {this.props.landingPageState.imageTemporary3[index] !== value &&
              this.props.landingPageState.imageTemporary3.length !== 0 ? (
                <Card
                  style={{ width: "100%" }}
                  cover={
                    <img
                      src={this.props.landingPageState.imageTemporary3[index]}
                    />
                  }
                />
              ) : (
                <Card
                  style={{ width: "100%" }}
                  cover={
                    <img
                      src={this.props.landingPageState.data.pages[0].icons[index]}
                    />
                  }
                />
              )}
            <Upload
              beforeUpload={file =>
                this.handleUploadImageChange(
                  file,
                  `3`,
                  index,
                  `/static/images/landing-page/image-page3-${index +
                  1}-${this.props.profileState.tenant._id}.${file.type.slice(6, 10)}`
                )
              }
              showUploadList={false}
              name="image"
              action={`${
                config.nextjs.apiUrl
                }/images/upload/landing-page/page3-${index + 1}-${this.props.profileState.tenant._id}`}
            >
              <Button>
                <Icon type="upload" />
                {this.props.languageState.WHITE_LABEL_LANDING_PAGE_UPLOAD.translated}
              </Button>
            </Upload>
          </Layout>
          <Layout style={{ margin: "0px 20px 20px 0px" }}>
            <Content
              style={{ fontWeight: "bold", fontSize: 14, padding: "10px" }}
            >
              {this.props.languageState.WHITE_LABEL_LANDING_PAGE_CONTENT_FILES.translated}
            </Content>
            <FormItem>
              {getFieldDecorator(`page-3-content-${index}`)(
                <BraftEditor
                  height="100%"
                  contentFormat="html"
                  initialContent={
                    this.props.landingPageState.data.pages[0].contents[index]
                  }
                  onChange={html => this.handleContentChange(html, `3`, index)}
                  contentId={`page 3 content ${index}`}
                  language="en"
                  fontFamilies={[
                    {
                      name: "Araial",
                      family: "Arial, Helvetica, sans-serif"
                    },
                    {
                      name: "Open Sans",
                      Family: "Open Sans, sans-serif"
                    },
                    {
                      name: "Raleway",
                      Family: "Raleway, sans-serif"
                    }
                  ]}
                />
              )}
            </FormItem>
          </Layout>
        </Col>
      )
    );

    const renderPage4 = this.props.landingPageState.data.pages[1].icons.map(
      (value, index) => (
        <Col key={index} span={7}>
          <Layout style={{ margin: "0px 20px 20px 0px" }}>
            <Content
              style={{ fontWeight: "bold", fontSize: 14, padding: "10px" }}
            >
              {this.props.languageState.WHITE_LABEL_LANDING_PAGE_ICON_FILES.translated}
            </Content>
            {this.props.landingPageState.imageTemporary4[index] !== value &&
              this.props.landingPageState.imageTemporary4.length !== 0 ? (
                <Card
                  style={{ width: "100%" }}
                  cover={
                    <img
                      src={this.props.landingPageState.imageTemporary4[index]}
                    />
                  }
                />
              ) : (
                <Card
                  style={{ width: "100%" }}
                  cover={
                    <img
                      src={this.props.landingPageState.data.pages[1].icons[index]}
                    />
                  }
                />
              )}
            <Upload
              beforeUpload={file =>
                this.handleUploadImageChange(
                  file,
                  `4`,
                  index,
                  `/static/images/landing-page/image-page4-${index +
                  1}-${this.props.profileState.tenant._id}.${file.type.slice(6, 10)}`
                )
              }
              showUploadList={false}
              name="image"
              action={`${
                config.nextjs.apiUrl
                }/images/upload/landing-page/page4-${index + 1}-${this.props.profileState.tenant._id}`}
            >
              <Button>
                <Icon type="upload" />
                {this.props.languageState.WHITE_LABEL_LANDING_PAGE_UPLOAD.translated}
              </Button>
            </Upload>
          </Layout>
          <Layout style={{ margin: "0px 20px 20px 0px" }}>
            <Content
              style={{ fontWeight: "bold", fontSize: 14, padding: "10px" }}
            >
              {this.props.languageState.WHITE_LABEL_LANDING_PAGE_CONTENT_FILES.translated}
            </Content>
            <FormItem>
              {getFieldDecorator(`page-4-content-${index}`)(
                <BraftEditor
                  height="100%"
                  contentFormat="html"
                  initialContent={
                    this.props.landingPageState.data.pages[1].contents[index]
                  }
                  onChange={html => this.handleContentChange(html, `4`, index)}
                  contentId={`page 4 content ${index}`}
                  language="en"
                  fontFamilies={[
                    {
                      name: "Araial",
                      family: "Arial, Helvetica, sans-serif"
                    },
                    {
                      name: "Open Sans",
                      Family: "Open Sans, sans-serif"
                    },
                    {
                      name: "Raleway",
                      Family: "Raleway, sans-serif"
                    }
                  ]}
                />
              )}
            </FormItem>
          </Layout>
        </Col>
      )
    );

    const renderMenuBar = Object.keys(
      this.props.landingPageState.data.menuBar
    ).map((data, index) => (
      <div key={index}>
        <Col span={12}>
          <div style={{ marginBottom: 16, width: "95%" }}>
            <Input
              defaultValue={this.props.landingPageState.data.menuBar[data].name}
              onChange={e =>
                this.props.landingPageReducer.handleMenuBarChange({
                  value: data,
                  name: e.target.value,
                  hyperlink: this.props.landingPageState.data.menuBar[data]
                    .hyperlink
                })
              }
            />
          </div>
        </Col>
        <Col span={12}>
          <div style={{ marginBottom: 16, width: "95%" }}>
            <Input
              addonBefore="/"
              defaultValue={
                this.props.landingPageState.data.menuBar[data].hyperlink
              }
              onChange={e =>
                this.props.landingPageReducer.handleMenuBarChange({
                  value: data,
                  name: this.props.landingPageState.data.menuBar[data].name,
                  hyperlink: e.target.value
                })
              }
            />
          </div>
        </Col>
      </div>
    ));

    // const columnsPopularTutionCourses = [
    //   {
    //     title: `Course`,
    //     dataIndex: 'course',
    //     key: 'course',
    //     width: '95%',
    //     render: (_value, record, index) => (

    //       <Input placeholder='Course' value={record.course}
    //         onChange={(event) => {
    //           this.props.landingPageReducer.handlePopularTutionCoursesChange({ value: event.target.value, index: index });
    //         }} />
    //     )
    //   },
    //   {
    //     title: ``,
    //     dataIndex: 'delete',
    //     key: 'delete',
    //     width: '5%',
    //     render: (_value, _record, index) => (
    //       <Button className='dynamic-delete-button' onClick={(_event) => this.props.landingPageReducer.handleDeletePopularTutionCourses({ index: index })}><Icon type='delete'></Icon></Button>
    //     )
    //   },
    // ];
    return (
      <Tabs defaultActiveKey="Custom" activeKey={this.state.currentTab} className='landing-page'>
        <TabPane tab="Custom" key="Custom">
          <Spin tip="Loading..." spinning={this.props.landingPageState.isBusy}>
            <AppLayout
              profileState={this.props.profileState}
              profileReducers={this.props.profileReducers}
              languageState={this.props.languageState}
            >
              <Form layout="inline" onSubmit={this.handleSubmit}>
                <Layout style={{ background: "#fff", padding: "0 30px 30px" }}>
                  <Content style={{ fontWeight: "bold", fontSize: 20, margin: '30px 0px 20px 0px' }}>
                    Landing Page Customization
                <FormItem style={{ float: "right" }}>
                      <Button htmlType="submit">
                        Save
                </Button>
                    </FormItem>
                    <Button
                      style={{ float: "right", marginTop: '4px', marginRight: '10px' }}
                      onClick={this.handleTabsChange}
                    >
                      Preview
                </Button>
                  </Content>
                  {/* ============================HEADER=========================== */}

                  {/* ================================PAGE_1=========================== */}
                  <Row>
                    <Col span={24}>
                      <Layout style={{ margin: "0px 0px 20px 0px" }}>
                        <Content
                          style={{
                            fontWeight: "bold",
                            fontSize: 14,
                            padding: "10px"
                          }}
                        >
                          MENU BAR
                    </Content>
                        {renderMenuBar}
                      </Layout>
                    </Col>
                  </Row>

                  <Row>
                    <Col span={12}>
                      <Layout style={{ margin: "0px 20px 20px 0px" }}>
                        <Content
                          style={{
                            fontWeight: "bold",
                            fontSize: 14,
                            padding: "10px"
                          }}
                        >
                          LOGO
                    </Content>
                        {this.props.landingPageState.logoTemporary ? (
                          <Card
                            style={{ width: "100%" }}
                            cover={
                              <img
                                src={this.props.landingPageState.logoTemporary}
                              />
                            }
                          />
                        ) : (
                            <Card
                              style={{ width: "100%" }}
                              cover={
                                <img src={this.props.landingPageState.data.logo} />
                              }
                            />
                          )}
                        <Upload
                          beforeUpload={file =>
                            this.handleUploadImageChange(
                              file,
                              `logo`,
                              null,
                              `/static/images/landing-page/image-logo-${this.props.profileState.tenant._id}.${file.type.slice(
                                6,
                                10
                              )}`
                            )
                          }
                          showUploadList={false}
                          name="image"
                          action={`${
                            config.nextjs.apiUrl
                            }/images/upload/landing-page/logo-${this.props.profileState.tenant._id}`}
                        >
                          <Button>
                            <Icon type="upload" />
                            Upload
                      </Button>
                        </Upload>
                      </Layout>
                      <Layout
                        style={{ margin: "0px 20px 20px 0px", padding: "14px" }}
                      >
                        <Content
                          style={{
                            fontWeight: "bold",
                            fontSize: 14,
                            padding: "10px"
                          }}
                        >
                          MAIN TITLE
                    </Content>
                        <FormItem>
                          {getFieldDecorator(`main-title`)(
                            <BraftEditor {...mainTitle} />
                          )}
                        </FormItem>
                      </Layout>
                    </Col>
                    <Col span={12}>
                      <Layout style={{ margin: "0px 0px 20px 0px" }}>
                        <Content
                          style={{
                            fontWeight: "bold",
                            fontSize: 14,
                            padding: "10px"
                          }}
                        >
                          TOP BANNER BACKGROUND
                    </Content>
                        {this.props.landingPageState
                          .topBannerBackgroundTemporary ? (
                            <Card
                              style={{ width: "100%" }}
                              cover={
                                <img
                                  src={
                                    this.props.landingPageState
                                      .topBannerBackgroundTemporary
                                  }
                                />
                              }
                            />
                          ) : (
                            <Card
                              style={{ width: "100%" }}
                              cover={
                                <img
                                  src={
                                    this.props.landingPageState.data
                                      .topBannerBackground
                                  }
                                />
                              }
                            />
                          )}
                        <Upload
                          beforeUpload={file =>
                            this.handleUploadImageChange(
                              file,
                              `top-banner-background`,
                              null,
                              `/static/images/landing-page/image-top-banner-background-${this.props.profileState.tenant._id}.${file.type.slice(
                                6,
                                10
                              )}`
                            )
                          }
                          showUploadList={false}
                          name="image"
                          action={`${
                            config.nextjs.apiUrl
                            }/images/upload/landing-page/top-banner-background-${this.props.profileState.tenant._id}`}
                        >
                          <Button>
                            <Icon type="upload" />
                            Upload
                      </Button>
                        </Upload>
                      </Layout>
                    </Col>
                  </Row>
                  {/* ================================PAGE_1=========================== */}
                  {/* ================================PAGE_2=========================== */}
                  <hr />
                  <hr />
                  <Content
                    style={{ fontWeight: "bold", fontSize: 20, padding: "10px" }}
                  >
                    PAGE 2 - Common Information
              </Content>

                  <Row>
                    <Col span={24}>
                      <Layout style={{ margin: "0px 0px 20px 0px" }}>
                        <Content
                          style={{
                            fontWeight: "bold",
                            fontSize: 14,
                            padding: "10px"
                          }}
                        >
                          MAIN TITLE PAGE 2
                    </Content>
                        <FormItem>
                          {getFieldDecorator(`main-title-page-2`)(
                            <BraftEditor {...mainTitlePage2} />
                          )}
                        </FormItem>
                      </Layout>
                    </Col>
                  </Row>
                  <Row>
                    <Col span={12}>
                      <Layout style={{ margin: "0px 0px 20px 0px" }}>
                        <Content
                          style={{
                            fontWeight: "bold",
                            fontSize: 14,
                            padding: "10px"
                          }}
                        >
                          SUB TITLE
                    </Content>
                        <FormItem>
                          {getFieldDecorator(`subtitle-2`)(
                            <BraftEditor {...subTitlePage2} />
                          )}
                        </FormItem>
                      </Layout>
                    </Col>
                    <Col span={12}>
                      <Layout style={{ margin: "0px 0px 20px 20px" }}>
                        <Content
                          style={{
                            fontWeight: "bold",
                            fontSize: 14,
                            padding: "10px"
                          }}
                        >
                          PROMOTION TITLE
                    </Content>
                        <FormItem>
                          {getFieldDecorator(`information-courses`)(
                            <BraftEditor {...informationCourses} />
                          )}
                        </FormItem>
                      </Layout>
                    </Col>
                  </Row>
                  {/* <Row style={{ marginTop: '40px', padding: 20 }}>
                  <Row>
                    <Col span={12}>
                      <h4>Promotion Items</h4>
                    </Col>
                    <Col span={10}>
                    </Col>
                  </Row>
                  <hr />
                  <Table
                    rowKey={(record) => record.index}
                    size='middle'
                    columns={columnsPopularTutionCourses}
                    dataSource={this.props.landingPageState.data.popularTutionCourses}
                    pagination={false}
                    locale={{ emptyText: 'No data' }}
                  />
                  <Button type='dashed' onClick={() => this.props.landingPageReducer.handleAddPopularTutionCourses()} style={{ width: '100%' }}>
                    <Icon type='plus' /> Add field
            </Button>
                </Row> */}
                  {/* ================================PAGE_2=========================== */}
                  <hr />
                  <hr />
                  <Content
                    style={{ fontWeight: "bold", fontSize: 20, padding: "10px" }}
                  >
                    PROMO 1
              </Content>

                  <Row>
                    <Col span={24}>
                      <Layout style={{ margin: "0px 0px 20px 0px" }}>
                        <Content
                          style={{
                            fontWeight: "bold",
                            fontSize: 14,
                            padding: "10px"
                          }}
                        >
                          TITLE
                    </Content>
                        <FormItem>
                          {getFieldDecorator(`promo-1`)(
                            <BraftEditor {...promo1} />
                          )}
                        </FormItem>
                      </Layout>
                    </Col>
                  </Row>
                  <Row
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      flexWrap: "wrap"
                    }}
                  >
                    <Col span={8}></Col>
                    <Col span={8}>
                      {this.props.landingPageState
                        .promoPhoto1Temporary ? (
                          <Card
                            style={{ width: "100%" }}
                            cover={
                              <img
                                src={
                                  this.props.landingPageState
                                    .promoPhoto1Temporary
                                }
                              />
                            }
                          />
                        ) : (
                          <Card
                            style={{ width: "100%" }}
                            cover={
                              <img
                                src={
                                  this.props.landingPageState.data
                                    .promoPhoto1
                                }
                              />
                            }
                          />
                        )}
                      <Upload
                        beforeUpload={file =>
                          this.handleUploadImageChange(
                            file,
                            `promoPhoto1`,
                            null,
                            `/static/images/landing-page/image-promo1-${this.props.profileState.tenant._id}.${file.type.slice(
                              6,
                              10
                            )}`
                          )
                        }
                        showUploadList={false}
                        name="image"
                        action={`${
                          config.nextjs.apiUrl
                          }/images/upload/landing-page/promo1-${this.props.profileState.tenant._id}`}
                      >
                        <Button>
                          <Icon type="upload" />
                          Upload
                      </Button>
                      </Upload>
                    </Col>
                    <Col span={8}></Col>
                  </Row>
                  <hr />
                  <hr />
                  <Content
                    style={{ fontWeight: "bold", fontSize: 20, padding: "10px" }}
                  >
                    PAGE 3 - For Students
              </Content>

                  <Row>
                    <Col span={24}>
                      <Layout style={{ margin: "0px 0px 20px 0px" }}>
                        <Content
                          style={{
                            fontWeight: "bold",
                            fontSize: 14,
                            padding: "10px"
                          }}
                        >
                          MAIN TITLE PAGE 3
                    </Content>
                        <FormItem>
                          {getFieldDecorator(`main-title-page-3`)(
                            <BraftEditor {...mainTitlePage3} />
                          )}
                        </FormItem>
                      </Layout>
                    </Col>
                  </Row>
                  <Row
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      flexWrap: "wrap"
                    }}
                  >
                    {renderPage3}
                  </Row>

                  <hr />
                  <hr />
                  <Content
                    style={{ fontWeight: "bold", fontSize: 20, padding: "10px" }}
                  >
                    PROMO 2
              </Content>

                  <Row>
                    <Col span={24}>
                      <Layout style={{ margin: "0px 0px 20px 0px" }}>
                        <Content
                          style={{
                            fontWeight: "bold",
                            fontSize: 14,
                            padding: "10px"
                          }}
                        >
                          TITLE
                    </Content>
                        <FormItem>
                          {getFieldDecorator(`promo-2`)(
                            <BraftEditor {...promo2} />
                          )}
                        </FormItem>
                      </Layout>
                    </Col>
                  </Row>
                  <Row
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      flexWrap: "wrap"
                    }}
                  >
                    <Col span={8}></Col>
                    <Col span={8}>
                      {this.props.landingPageState
                        .promoPhoto2Temporary ? (
                          <Card
                            style={{ width: "100%" }}
                            cover={
                              <img
                                src={
                                  this.props.landingPageState
                                    .promoPhoto2Temporary
                                }
                              />
                            }
                          />
                        ) : (
                          <Card
                            style={{ width: "100%" }}
                            cover={
                              <img
                                src={
                                  this.props.landingPageState.data
                                    .promoPhoto2
                                }
                              />
                            }
                          />
                        )}
                      <Upload
                        beforeUpload={file =>
                          this.handleUploadImageChange(
                            file,
                            `promoPhoto2`,
                            null,
                            `/static/images/landing-page/image-promo2-${this.props.profileState.tenant._id}.${file.type.slice(
                              6,
                              10
                            )}`
                          )
                        }
                        showUploadList={false}
                        name="image"
                        action={`${
                          config.nextjs.apiUrl
                          }/images/upload/landing-page/promo2-${this.props.profileState.tenant._id}`}
                      >
                        <Button>
                          <Icon type="upload" />
                          Upload
                      </Button>
                      </Upload>
                    </Col>
                    <Col span={8}></Col>
                  </Row>
                  <hr />
                  <hr />
                  <Content
                    style={{ fontWeight: "bold", fontSize: 20, padding: "10px" }}
                  >
                    STUDENT VIDEO TITLE
              </Content>

                  <Row>
                    <Col span={24}>
                      <Layout style={{ margin: "0px 0px 20px 0px" }}>
                        <Content
                          style={{
                            fontWeight: "bold",
                            fontSize: 14,
                            padding: "10px"
                          }}
                        >
                          TITLE
                    </Content>
                        <FormItem>
                          {getFieldDecorator(`student-title`)(
                            <BraftEditor {...studentTitle} />
                          )}
                        </FormItem>
                      </Layout>
                    </Col>
                  </Row>
                  <Row>
                    <Upload beforeUpload={file => {
                      this.handleUploadVideoChange({ file: file }, 'student') as any
                      return false;
                    }
                    }
                      multiple={false}
                      showUploadList={true}
                      name="video"
                      fileList={this.props.landingPageState.studentVideoFileList}>
                      <Button>
                        <Icon type="upload" />
                        {`Change Background Video (Only accept .mp4 < 7MB file)`}
                      </Button>
                    </Upload>

                    <Upload beforeUpload={file => {
                      this.handleUploadVideoChange({ file: file }, 'student-ogg') as any
                      return false;
                    }
                    }
                      multiple={false}
                      showUploadList={true}
                      name="video"
                      fileList={this.props.landingPageState.studentVideoOggFileList}>
                      <Button>
                        <Icon type="upload" />
                        {`Change Background Video (Only accept .ogg < 7MB file)`}
                      </Button>
                    </Upload>

                    <Upload beforeUpload={file => {
                      this.handleUploadVideoChange({ file: file }, 'student-webm') as any
                      return false;
                    }
                    }
                      multiple={false}
                      showUploadList={true}
                      name="video"
                      fileList={this.props.landingPageState.studentVideoWebmFileList}>
                      <Button>
                        <Icon type="upload" />
                        {`Change Background Video (Only accept .webm < 7MB file)`}
                      </Button>
                    </Upload>

                  </Row>
                  <hr />
                  <hr />
                  <Content
                    style={{ fontWeight: "bold", fontSize: 20, padding: "10px" }}
                  >
                    PAGE 4 - For Tutors
              </Content>

                  <Row>
                    <Col span={24}>
                      <Layout style={{ margin: "0px 0px 20px 0px" }}>
                        <Content
                          style={{
                            fontWeight: "bold",
                            fontSize: 14,
                            padding: "10px"
                          }}
                        >
                          MAIN TITLE PAGE 4
                    </Content>
                        <FormItem>
                          {getFieldDecorator(`main-title-page-4`)(
                            <BraftEditor {...mainTitlePage4} />
                          )}
                        </FormItem>
                      </Layout>
                    </Col>
                  </Row>
                  <Row
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      flexWrap: "wrap"
                    }}
                  >
                    {renderPage4}
                  </Row>
                  <hr />
                  <hr />
                  <Content
                    style={{ fontWeight: "bold", fontSize: 20, padding: "10px" }}
                  >
                    PROMO 3
              </Content>

                  <Row>
                    <Col span={24}>
                      <Layout style={{ margin: "0px 0px 20px 0px" }}>
                        <Content
                          style={{
                            fontWeight: "bold",
                            fontSize: 14,
                            padding: "10px"
                          }}
                        >
                          TITLE
                    </Content>
                        <FormItem>
                          {getFieldDecorator(`promo-3`)(
                            <BraftEditor {...promo3} />
                          )}
                        </FormItem>
                      </Layout>
                    </Col>
                  </Row>
                  <Row
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      flexWrap: "wrap"
                    }}
                  >
                    <Col span={8}></Col>
                    <Col span={8}>
                      {this.props.landingPageState
                        .promoPhoto3Temporary ? (
                          <Card
                            style={{ width: "100%" }}
                            cover={
                              <img
                                src={
                                  this.props.landingPageState
                                    .promoPhoto3Temporary
                                }
                              />
                            }
                          />
                        ) : (
                          <Card
                            style={{ width: "100%" }}
                            cover={
                              <img
                                src={
                                  this.props.landingPageState.data
                                    .promoPhoto3
                                }
                              />
                            }
                          />
                        )}
                      <Upload
                        beforeUpload={file =>
                          this.handleUploadImageChange(
                            file,
                            `promoPhoto3`,
                            null,
                            `/static/images/landing-page/image-promo3-${this.props.profileState.tenant._id}.${file.type.slice(
                              6,
                              10
                            )}`
                          )
                        }
                        showUploadList={false}
                        name="image"
                        action={`${
                          config.nextjs.apiUrl
                          }/images/upload/landing-page/promo3-${this.props.profileState.tenant._id}`}
                      >
                        <Button>
                          <Icon type="upload" />
                          Upload
                      </Button>
                      </Upload>
                    </Col>
                    <Col span={8}></Col>
                  </Row>
                  <hr />
                  <hr />
                  <Content
                    style={{ fontWeight: "bold", fontSize: 20, padding: "10px" }}
                  >
                    TUTOR VIDEO TITLE
              </Content>

                  <Row>
                    <Col span={24}>
                      <Layout style={{ margin: "0px 0px 20px 0px" }}>
                        <Content
                          style={{
                            fontWeight: "bold",
                            fontSize: 14,
                            padding: "10px"
                          }}
                        >
                          TITLE
                    </Content>
                        <FormItem>
                          {getFieldDecorator(`tutor-title`)(
                            <BraftEditor {...tutorTitle} />
                          )}
                        </FormItem>
                      </Layout>
                    </Col>
                  </Row>
                  <Upload beforeUpload={file => {
                    this.handleUploadVideoChange({ file: file }, 'tutor') as any
                    return false;
                  }
                  }
                    multiple={false}
                    showUploadList={true}
                    name="video"
                    fileList={this.props.landingPageState.tutorVideoFileList}>
                    <Button>
                      <Icon type="upload" />
                      {`Change Background Video (Only accept .mp4 < 7MB file)`}
                    </Button>
                  </Upload>

                  <Upload beforeUpload={file => {
                    this.handleUploadVideoChange({ file: file }, 'tutor-ogg') as any
                    return false;
                  }
                  }
                    multiple={false}
                    showUploadList={true}
                    name="video"
                    fileList={this.props.landingPageState.tutorVideoOggFileList}>
                    <Button>
                      <Icon type="upload" />
                      {`Change Background Video (Only accept .ogg < 7MB file)`}
                    </Button>
                  </Upload>

                  <Upload beforeUpload={file => {
                    this.handleUploadVideoChange({ file: file }, 'tutor-webm') as any
                    return false;
                  }
                  }
                    multiple={false}
                    showUploadList={true}
                    name="video"
                    fileList={this.props.landingPageState.tutorVideoWebmFileList}>
                    <Button>
                      <Icon type="upload" />
                      {`Change Background Video (Only accept .webm < 7MB file)`}
                    </Button>
                  </Upload>
                  <hr />
                  <hr />

                  <Content
                    style={{ fontWeight: "bold", fontSize: 20, padding: "10px" }}
                  >
                    BLOG TITLE
              </Content>

                  <Row>
                    <Col span={24}>
                      <Layout style={{ margin: "0px 0px 20px 0px" }}>
                        <Content
                          style={{
                            fontWeight: "bold",
                            fontSize: 14,
                            padding: "10px"
                          }}
                        >
                          TITLE
                    </Content>
                        <FormItem>
                          {getFieldDecorator(`blog-title`)(
                            <BraftEditor {...blogTitle} />
                          )}
                        </FormItem>
                      </Layout>
                    </Col>
                  </Row>
                  <hr />
                  <hr />
                  <Content
                    style={{ fontWeight: "bold", fontSize: 20, padding: "10px" }}
                  >
                    PAGE 5 - Footer
              </Content>

                  <Row>
                    <Col span={12}>
                      <Layout style={{ margin: "0px 20px 20px 0px" }}>
                        <Content
                          style={{
                            fontWeight: "bold",
                            fontSize: 14,
                            padding: "10px"
                          }}
                        >
                          GETTING STARTED
                    </Content>
                        <FormItem>
                          {getFieldDecorator(`footer-content-1`)(
                            <BraftEditor {...gettingStarted} />
                          )}
                        </FormItem>
                      </Layout>
                    </Col>
                    <Col span={12}>
                      <Layout style={{ margin: "0px 20px 20px 0px" }}>
                        <Content
                          style={{
                            fontWeight: "bold",
                            fontSize: 14,
                            padding: "10px"
                          }}
                        >
                          SUPPORT
                    </Content>
                        <FormItem>
                          {getFieldDecorator(`footer-content-2`)(
                            <BraftEditor {...Support} />
                          )}
                        </FormItem>
                      </Layout>
                    </Col>
                    <Col span={12}>
                      <Layout style={{ margin: "0px 20px 20px 0px" }}>
                        <Content
                          style={{
                            fontWeight: "bold",
                            fontSize: 14,
                            padding: "10px"
                          }}
                        >
                          SOCIAL
                    </Content>
                        <FormItem>
                          {getFieldDecorator(`footer-content-3`)(
                            <BraftEditor {...Social} />
                          )}
                        </FormItem>
                      </Layout>
                    </Col>
                    <Col span={12}>
                      <Layout style={{ margin: "0px 0px 20px 0px" }}>
                        <Content
                          style={{
                            fontWeight: "bold",
                            fontSize: 14,
                            padding: "10px"
                          }}
                        >
                          FOOTER
                    </Content>
                        <FormItem>
                          {getFieldDecorator(`footer-content-4`)(
                            <BraftEditor {...Copyright} />
                          )}
                        </FormItem>
                      </Layout>
                    </Col>
                  </Row>
                </Layout>
              </Form>
            </AppLayout>
          </Spin>
        </TabPane>
        <TabPane tab="Preview" key="Preview">
          <LandingPagePreview
            blogData={this.props.blogState.data}
            landingPageState={this.props.landingPageState}
            handleTabsChange={this.handleTabsChange}
          />
        </TabPane>
      </Tabs>
    );
  }

  handleChange = content => {
    this.setState({ onChangeText: content });
  };

  handleChangeImage = content => {
    this.setState({ onChangeImage: content });
  };

  uploadFn = (param) => {
    const serverURL = `${config.nextjs.apiUrl}/images/upload/default`
    const xhr = new XMLHttpRequest()
    const formData = new FormData()
    formData.set('image', param.file);
    const successFn = (_response) => {
      param.success({
        url: `/static/images/default/${param.file.name}`
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

const mapState = (rootState: any) => {
  return {
    profileState: rootState.profileModel,
    landingPageState: rootState.landingPageModel,
    blogState: rootState.blogPageModel,
    tenantState: rootState.tenantsPageModel,
    languageState: rootState.languageModel,
  };
};

const mapDispatch = (rootReducer: any) => {
  return {
    profileReducers: rootReducer.profileModel,
    landingPageReducer: rootReducer.landingPageModel,
    blogReducer: rootReducer.blogPageModel,
    tenantReducer: rootReducer.tenantsPageModel
  };
};

export default withRematch(initStore, mapState, mapDispatch)(Form.create()(Page));
