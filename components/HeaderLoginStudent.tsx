import { Row, Col, Button, Input, Icon, Select } from "antd";
import React from "react";
import "./Header.css";
import Link from 'next/link';
const Option = Select.Option;

class HeaderLoginStudent extends React.Component<any, any> {
  render() {
    return (
      <header>
        <Row style={{ background: "#bbe3f7", padding: "20px 30px 20px 30px" }}>
          {(!Object.keys(this.props.profileState).length || !this.props.profileState.isLoggedIn) ?
            <Col xs={12} lg={4} xl={5}>
              <Link href="/">
                <div>
                  <img
                    src='/static/images/skyace-no-cloud.png'
                    style={{
                      cursor: 'pointer',
                      width: 'auto',
                      height: '42px',
                      display: 'block',
                      marginLeft: '15px',
                    }}
                  />
                </div>
              </Link>
            </Col> : <div></div>
          }
          <Col
            xs={(!Object.keys(this.props.profileState).length || !this.props.profileState.isLoggedIn) ? 12 : 24}
            lg={(!Object.keys(this.props.profileState).length || !this.props.profileState.isLoggedIn) ? 8 : 12}
            xl={(!Object.keys(this.props.profileState).length || !this.props.profileState.isLoggedIn) ? 7 : 12}
          >
            <Input.Search
              style={{ paddingRight: "10px" }}
              placeholder={this.props.languageState.HEADER_LOGIN_STUDENT_SEARCH_INPUT_PLACEHOLDER.translated}
              onChange={e => this.props.handleFilterChange({ search: e.target.value })}
              onSearch={this.props.handleSearch}
              onPressEnter={this.props.handleSearch}
              enterButton={true}
            />
          </Col>
          <Col xs={24} lg={12} xl={12} className="responsive-toggle-option" style={{ display: 'flex', justifyContent: 'flex-end', flexWrap: 'wrap' }}>
            <div className="responsive-toggle-container" style={{ marginRight: Object.keys(this.props.profileState).length && this.props.profileState.isLoggedIn ? '0px' : '30px' }}>
              <div style={{ display: 'inline-block' }}>
                <Button onClick={this.props.toggleOptions}>
                  <Icon type="bar-chart" /> {this.props.languageState.HEADER_LOGIN_STUDENT_BUTTON_FILTER_TEXT.translated}
              </Button>
              </div>

              <div style={{ display: 'inline-block', marginLeft: '24px' }}>
                <Select
                  value={`${this.props.sortBy}-${this.props.asc ? 'asc' : 'desc'}`}
                  style={{ width: '100%' }}
                  onChange={this.props.handleSortChange as any}
                >
                  {this.props.dataLookup.findaTutor.selectList && this.props.dataLookup.findaTutor.selectList.map(
                    item => (
                      <Option value={item.value} key={item._id}>
                        {this.props.languageState.HEADER_LOGIN_STUDENT_SORT_BY.translated}: {item.label}
                      </Option>
                    )
                  )}
                </Select>
              </div>
            </div>
            {(!Object.keys(this.props.profileState).length || !this.props.profileState.isLoggedIn) && (
              <div
                className="responsive-login-option"
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "flex-end",
                  marginLeft: '10px',
                  marginRight: '10px'
                }}
              >
                <Button
                  style={{
                    width: "80px",
                    height: "35px",
                    marginRight: "10px"
                  }}
                  onClick={this.props.openLoginModal}
                >
                  {this.props.languageState.HEADER_LOGIN_STUDENT_BUTTON_LOGIN_TEXT.translated}
                </Button>
                <Button
                  style={{
                    width: "80px",
                    height: "35px",
                    marginLeft: "10px"
                  }}
                  onClick={this.props.openRegisterModal}
                >
                  {this.props.languageState.HEADER_LOGIN_STUDENT_BUTTON_SIGN_UP_TEXT.translated}
                </Button>
              </div>
            )}
          </Col>
        </Row>
      </header>
    );
  }
}

export default HeaderLoginStudent;
