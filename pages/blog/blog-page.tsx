import * as React from "react";
import { Form, Row, Layout } from "antd";
import AppLayout from "../../layout/AdminLayout";
import initStore from "../../rematch/store";
import withRematch from "../../rematch/withRematch";
import { Radio } from "antd";
import _ from "lodash";
import "./blog-page.css";
import { IUpdateUserProfilePayload } from "../../rematch/models/profile/interface";
import BlogList from "../../components/blog-page/BlogList";
import CreateNewBlogForm from "../../components/blog-page/CreateNewBlogForm";
const Content = Layout.Content;

class BlogPage extends React.Component<any, any> {
  static async getInitialProps(props: any) {
    if (!props.req) {
      const blogPageState = props.store.getState().blogPageModel;
      await props.store.dispatch.blogPageModel.fetchDataEffect({
        search: blogPageState.search,
        pageNumber: blogPageState.pageNumber,
        pageSize: blogPageState.pageSize,
        sortBy: blogPageState.sortBy,
        asc: false,
      });
    } else {
      props.store.dispatch.blogPageModel.fetchDataSuccess({ result: props.query.blogs });
    }
  }

  _onAddPost = async (e: any): Promise<any> => {
    this.props.changeRadioButton();
    if (e.target.value === "addpost") {
      this.props.onHideEditModal();
    }
  };

  deactivateOrActivatePost = async (
    deactivationStatus: boolean,
    blogId: string
  ) => {
    !deactivationStatus
      ? this.props.activateBlog({ blogId: blogId })
      : this.props.deactivateBlog({ blogId: blogId });
  };

  handleEditFormSubmit = async (
    editedPost: IUpdateUserProfilePayload
  ): Promise<any> => {
    this.props.updateBlog(editedPost);
  };

  handleSearchChange = async (value: string): Promise<void> => {
    const debounced = _.debounce(
      () => {
        this.props.searchChangeEffect({ searchValue: value.trim() });
        this.props.searchChangeReducer({ searchValue: value.trim() });
      },

      1000
    );
    debounced();
  };

  handleFormSubmit = async (newPost): Promise<any> => {
    this.props.createNewBlog(newPost);
  };

  includeOrExcludeInactivePost = async (
    searchValue: string,
    isInactivePostIncluded: boolean
  ) => {
    isInactivePostIncluded
      ? this.props.onIncludeDeactivePost({
        searchValue: searchValue
      })
      : this.props.onExcludeDeactivePost({
        searchValue: searchValue
      });
  };

  render() {
    const RadioButton = Radio.Button;
    const RadioGroup = Radio.Group;

    return (
      <AppLayout
        profileState={this.props.profileState}
        profileReducers={this.props.profileReducers}
        languageState={this.props.languageState}
      >
        <div className="blog-page">
          <Row className='margin-bottom-large'>
            <Content style={{ fontWeight: "bold", fontSize: 20, marginBottom: 20 }}>
              {this.props.languageState.BLOG_PAGE_BLOG.translated}
              </Content>
            <hr />
          </Row>
          <div className="radio-button">
            <RadioGroup
              size="large"
              value={this.props.showAllPosts ? "allposts" : "addpost"}
              onChange={this._onAddPost}
            >
              <RadioButton value="allposts">{this.props.languageState.BLOG_PAGE_ALL_POSTS.translated}</RadioButton>
              <RadioButton value="addpost">{this.props.languageState.BLOG_PAGE_ADD_POST.translated}</RadioButton>
            </RadioGroup>
          </div>

          <div className="view-create-blog">
            {this.props.showAllPosts ? (
              <BlogList
                includeOrExcludeInactivePost={this.includeOrExcludeInactivePost}
                deactivateOrActivatePost={this.deactivateOrActivatePost}
                handleSearchChange={this.handleSearchChange}
                handleEditFormSubmit={this.handleEditFormSubmit}
                {...this.props}
              />
            ) : (
                <CreateNewBlogForm
                  handleFormSubmit={this.handleFormSubmit}
                  {...this.props}
                />
              )}
          </div>
        </div>
      </AppLayout>
    );
  }
}

const mapState = (rootState: any) => {
  return {
    ...rootState.blogPageModel,
    profileState: rootState.profileModel,
    languageState: rootState.languageModel,
  };
};

const mapDispatch = (rootReducer: any) => {
  return {
    ...rootReducer.blogPageModel,
    profileReducers: rootReducer.profileModel
  };
};

export default withRematch(initStore, mapState, mapDispatch)(
  Form.create()(BlogPage)
);
