import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import { Layout, Menu, Breadcrumb, Icon } from "antd";
const { Sider } = Layout;

class Sidebar extends Component {
  state = {
    collapsed: false
  };

  toggle = () => {
    this.setState({
      collapsed: !this.state.collapsed
    });
  };

  render() {
    const { currentUser } = this.props;

    const isUser =
      currentUser &&
      currentUser.roles &&
      currentUser.roles[0].name === "ROLE_USER";

    const isStudent =
      currentUser &&
      currentUser.roles &&
      currentUser.roles[0].name === "ROLE_STUDENT";

    return (
      <Layout>
        {currentUser && isUser && (
          <Sider
            width={200}
            style={{
              background: "#fff",
              marginTop: "80px",
              borderRight: "solid 1px #EEf2f5"
            }}
            trigger={null}
            collapsible
            collapsed={this.state.collapsed}
          >
            <Menu
              mode="inline"
              // defaultSelectedKeys={["1"]}
              defaultOpenKeys={["submenu"]}
              style={{
                height: "100%",
                borderRight: 0
              }}
            >
              <Menu.Item key="1">
                <Link to="/">
                  <Icon type="dashboard" />
                  <span>Dashboard</span>
                </Link>
              </Menu.Item>
              <Menu.Item key="2">
                <Link to="/student">
                  <Icon type="user" />
                  <span>Students</span>
                </Link>
              </Menu.Item>
              <Menu.Item key="3">
                <Link to="/course">
                  <Icon type="profile" />
                  <span>Courses</span>
                </Link>
              </Menu.Item>
              <Menu.Item key="4">
                <Link to="/section">
                  <Icon type="profile" />
                  <span>Section</span>
                </Link>
              </Menu.Item>
              <Menu.Item key="5">
                <Link to="/criteria">
                  <Icon type="appstore" />
                  <span>Criteria</span>
                </Link>
              </Menu.Item>
              <Menu.Item key="7">
                <Link to="/questionnaire">
                  <Icon type="file-text" />
                  <span>Questionnaires</span>
                </Link>
              </Menu.Item>
            </Menu>
          </Sider>
        )}
        {currentUser && isStudent && (
          <Sider
            width={200}
            style={{
              background: "#fff",
              marginTop: "80px",
              borderRight: "solid 1px #EEf2f5"
            }}
            trigger={null}
            collapsible
            collapsed={this.state.collapsed}
          >
            <Menu
              mode="inline"
              // defaultSelectedKeys={["1"]}
              defaultOpenKeys={["submenu"]}
              style={{
                height: "100%",
                borderRight: 0
              }}
            >
              <Menu.Item key="8">
                <Link to="/courses">
                  <Icon type="home" />
                  <span>My courses</span>
                </Link>
              </Menu.Item>
            </Menu>
          </Sider>
        )}
        <Layout style={{ padding: "0 24px 24px" }}>
          <Breadcrumb style={{ margin: "16px 0" }}>
            <Breadcrumb.Item>Home</Breadcrumb.Item>
            <Breadcrumb.Item>List</Breadcrumb.Item>
            <Breadcrumb.Item>App</Breadcrumb.Item>
          </Breadcrumb>
          {this.props.children}
        </Layout>
      </Layout>
    );
  }
}

export default withRouter(Sidebar);
