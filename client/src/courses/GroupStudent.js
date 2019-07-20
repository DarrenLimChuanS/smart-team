import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import { Button, Row, Col, Table, Typography } from "antd";

const { Title } = Typography;

const data = [
  {
    key: "123ss",
    group_number: "13",
    name: "Jason Kam"
  },
  {
    key: "133ss",
    group_number: "13",
    name: "Darren Lim"
  },
  {
    key: "167ss",
    group_number: "13",
    name: "Darren Low"
  },
  {
    key: "166ss",
    group_number: "13",
    name: "Zack Lim"
  },
  {
    key: "168ss",
    group_number: "13",
    name: "Tan Qin Xiang"
  }
];

class GroupStudent extends Component {
  state = {
    filteredInfo: null,
    sortedInfo: null
  };

  handleChange = (pagination, filters, sorter) => {
    this.setState({
      filteredInfo: filters,
      sortedInfo: sorter
    });
  };

  render() {
    let { sortedInfo, filteredInfo } = this.state;
    sortedInfo = sortedInfo || {};
    filteredInfo = filteredInfo || {};

    const columns = [
      {
        title: "Admin number",
        dataIndex: "key",
        key: "key",
        filteredValue: filteredInfo.key || null,
        onFilter: (value, record) => record.key.includes(value),
        sorter: (a, b) => a.key - b.key,
        sortOrder: sortedInfo.columnKey === "key" && sortedInfo.order
      },
      {
        title: "Group Number",
        dataIndex: "group_number",
        key: "group_number",
        sorter: (a, b) => a.group_number.length - b.group_number.length,
        sortOrder: sortedInfo.columnKey === "group_number" && sortedInfo.order
      },
      {
        title: "Name",
        dataIndex: "name",
        key: "name",
        sorter: (a, b) => a.name.length - b.name.length,
        sortOrder: sortedInfo.columnKey === "name" && sortedInfo.order
      }
    ];

    return (
      <React.Fragment>
        <Row>
          <Col span={22}>
            <Title level={2}>My group</Title>
          </Col>
          <Col span={2}>
            <Link to="/course/new">
              <Button type="primary" size="large">
                Create
              </Button>
            </Link>
          </Col>
        </Row>
        <Row>
          <Table
            columns={columns}
            dataSource={data}
            onChange={this.handleChange}
          />
        </Row>
      </React.Fragment>
    );
  }
}

export default withRouter(GroupStudent);
