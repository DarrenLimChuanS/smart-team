import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { Button, Divider, Row, Col, Table, Typography } from "antd";

const { Title } = Typography;

const data = [
  {
    key: "1",
    module: "ICT1001",
    name: "Intro to ICT"
  },
  {
    key: "2",
    module: "ICT1002",
    name: "Programming fundamentals"
  },
  {
    key: "4",
    module: "ICT1003",
    name: "Embedded systems"
  },
  {
    key: "5",
    module: "ICT1004",
    name: "Web programming"
  }
];

class CourseList extends Component {
  state = {
    filteredInfo: null,
    sortedInfo: null
  };

  handleChange = (pagination, filters, sorter) => {
    console.log("Various parameters", pagination, filters, sorter);
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
        title: "#",
        dataIndex: "key",
        key: "key",
        filteredValue: filteredInfo.key || null,
        onFilter: (value, record) => record.key.includes(value),
        sorter: (a, b) => a.key - b.key,
        sortOrder: sortedInfo.columnKey === "key" && sortedInfo.order
      },
      {
        title: "Course ID",
        dataIndex: "module",
        key: "module",
        filters: [
          { text: "ICT1001", value: "ICT1001" },
          { text: "ICT1002", value: "ICT1002" },
          { text: "ICT1003", value: "ICT1003" },
          { text: "ICT1004", value: "ICT1004" }
        ],
        filteredValue: filteredInfo.module || null,
        onFilter: (value, record) => record.module.includes(value),
        sorter: (a, b) => a.module.length - b.module.length,
        sortOrder: sortedInfo.columnKey === "module" && sortedInfo.order
      },
      {
        title: "Name",
        dataIndex: "name",
        key: "name",
        sorter: (a, b) => a.name.length - b.name.length,
        sortOrder: sortedInfo.columnKey === "name" && sortedInfo.order
      },
      {
        title: "Action",
        key: "action",
        render: (text, record) => (
          <span>
            <a href="javascript:;">View Modules</a>
            <Divider type="vertical" />
            <a href="javascript:;">Edit</a>
            <Divider type="vertical" />
            <a href="javascript:;">Delete</a>
          </span>
        )
      }
    ];

    return (
      <React.Fragment>
        <Row>
          <Col span={22}>
            <Title level={2}>Courses</Title>
          </Col>
          <Col span={2}>
            <Button type="primary" size={12}>
              Create
            </Button>
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

export default withRouter(CourseList);
