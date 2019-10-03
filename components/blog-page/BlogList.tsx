import {
  List,
  Avatar,
  Button,
  Input,
  Row,
  Col,
  Tooltip,
  Tag,
  Checkbox,
} from 'antd';
import React from 'react';
import './BlogList.css';
import EditBlogForm from './EditBlogForm';

const postInputAutoCompleteData: string[] = [];
let flag: boolean = true;
const pushPropsToDataSource = propsData => {
  if (flag && Object.keys(propsData).length > 0) {
    propsData
      .filter(item => item.title)
      .map(item => postInputAutoCompleteData.push(item));
    flag = false;
    return postInputAutoCompleteData;
  }
  return pushPropsToDataSource(propsData);
};

class BlogList extends React.Component<any, any> {
  listtitle: any;

  constructor(props: any) {
    super(props);
    this.state = {
      activationStatus: '',
      dataPerPost: {
        title: '',
        subtitle: '',
        author: '',
        tags: '',
        content: '',
        imageSrc: '',
        viewCount: 0,
        postRating: 0,
        _id: '',
      } as any,
      titleDataSource: ['Input Title'],
    };
  }

  onDeactivateButtonClick = (deactivateStatus: boolean, blogId: string, _e: any) => {
    if (!deactivateStatus) {
      this.props.deactivateBlog(blogId);
    } else {
      this.props.activateBlog(blogId);
    }
  }

  onEditItemClick = (item, _e: any) => {
    this.setState({
      dataPerPost: item,
    });

    this.props.onShowEditModal();
  }

  hideEditModal = () => {
    this.props.onHideEditModal();
  }

  filterOption = (inputValue: any, option: any) => {
    return option.props.children.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1;
  }

  render(): JSX.Element {
    return (
      <div>
        {!this.props.showEditModal ? (
          <div className="list-post-wrapper">
            <Row>
              <Col span={12}>
                <Input.Search
                  placeholder={this.props.languageState.BLOG_PAGE_INPUT_PLACEHOLDER.translated}
                  style={{ width: 500 }}
                  onChange={(e: React.FormEvent<HTMLInputElement>) =>
                    this.props.handleSearchChange((e.target as any).value.toLowerCase())
                  }
                />
              </Col>
              <Col span={12}>
                <Checkbox
                  onChange={(e) => this.props.includeOrExcludeInactivePost(this.props.search, e.target.checked)}
                  className="btn-filter-deactivated-post"
                  defaultChecked={true}
                >
                  {this.props.languageState.BLOG_PAGE_INCLUDE_INACTIVE_POST.translated}
                </Checkbox>
              </Col>
            </Row>

            <List
              itemLayout="horizontal"
              loading={this.props.isBusy}
              dataSource={this.props.data}
              pagination={{
                total: this.props.total,
                current: this.props.pageNumber,
                showSizeChanger: true,
                pageSize: this.props.pageSize,
                pageSizeOptions: [10, 20, 50].map(item =>
                  String(item),
                ),
                onChange: (page, pageSize) => {
                  this.props.fetchDataEffect({
                    search: this.props.search,
                    pageNumber: page,
                    pageSize: pageSize,
                    sortBy: this.props.sortBy,
                    asc: this.props.asc
                  });
                  this.props.handlePaginationChange({current: page, pageSize: pageSize});
                },
                onShowSizeChange: (current, size) => {
                  this.props.fetchDataEffect({
                    search: this.props.search,
                    pageNumber: current,
                    pageSize: size,
                    sortBy: this.props.sortBy,
                    asc: this.props.asc
                  });
                  this.props.handlePaginationChange({current: current, pageSize: size});
                }
              }}
              renderItem={item => (
                <List.Item
                  key={item.title}
                  actions={[
                    <Tooltip
                      key={`${item.title}_edit`}
                      title={this.props.languageState.BLOG_PAGE_EDIT.translated}
                    >
                      <Button
                        key={`${item.title}_edit`}
                        onClick={e => this.onEditItemClick(item, e)}
                        icon="edit"
                        type="primary"
                      />
                    </Tooltip>
                    ,
                    <Tooltip
                      key={`${item.title}_hide`}
                      title={item.isActive ? this.props.languageState.BLOG_PAGE_DEACTIVATE.translated : this.props.languageState.BLOG_PAGE_ACTIVATE.translated}
                    >
                      <Button
                        key={`${item.title}_edit`}
                        onClick={() => this.props.deactivateOrActivatePost(item.isActive, item._id)}
                        icon={item.isActive ? 'lock' : 'unlock'}
                        type="primary"
                      />
                    </Tooltip>
                    ,
                  ]}
                >
                  <List.Item.Meta
                    title={item.title.length > 50 ? `${item.title.slice(0, 50)} ...` : item.title}
                    description={item.subtitle.length > 50 ? `${item.subtitle.slice(0, 50)} ...` : item.subtitle}
                    avatar={<Avatar src={item.imageSrc}/>}
                    className="list-item-meta"
                  />
                  <Tag
                    color={item.isActive ? item.isDraft ? 'orange' : 'green' : 'red'}
                    className="activation-status-tag"
                  >
                    {item.isActive ? item.isDraft ? 'Draft' : 'Active' : 'Deactive'}
                  </Tag>
                </List.Item>
              )}
            />
          </div>
        ) : (
            <EditBlogForm
              hideEditModal={this.hideEditModal}
              dataPerPost={(this.state as any).dataPerPost}
              {...this.props}
            />
          )}
      </div>
    );
  }
}

export default BlogList;
