import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import { Button, Divider, Row, Col, Table, Typography, Menu } from "antd";

const { Title } = Typography;

const data = [
  {
    key: "1",
    name: "Intro to ICT",
    module: "ICT1001",
    status: "Passed"
  },
  {
    key: "2",
    name: "Programming fundamentals",
    module: "ICT1002",
    status: "Ongoing"
  },
  {
    key: "4",
    name: "Embedded systems",
    module: "ICT1003",
    status: "Ongoing"
  },
  {
    key: "4",
    name: "Web programming",
    module: "ICT1004",
    status: "Ongoing"
  }
];

class Course extends Component {
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

  clearFilters = () => {
    this.setState({ filteredInfo: null });
  };

  clearAll = () => {
    this.setState({
      filteredInfo: null,
      sortedInfo: null
    });
  };

  setAgeSort = () => {
    this.setState({
      sortedInfo: {
        order: "descend",
        columnKey: "age"
      }
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
        title: "Name",
        dataIndex: "name",
        key: "name",
        filters: [{ text: "Joe", value: "Joe" }, { text: "Jim", value: "Jim" }],
        filteredValue: filteredInfo.name || null,
        onFilter: (value, record) => record.name.includes(value),
        sorter: (a, b) => a.name.length - b.name.length,
        sortOrder: sortedInfo.columnKey === "name" && sortedInfo.order
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
        title: "Status",
        dataIndex: "status",
        key: "status",
        filters: [
          { text: "Not Grouped", value: "Not Grouped" },
          {
            text: "Pending (Automated Allocation)",
            value: "Pending (Automated Allocation)"
          },
          { text: "Grouped", value: "Grouped" }
        ],
        filteredValue: filteredInfo.status || null,
        onFilter: (value, record) => record.status.includes(value),
        sorter: (a, b) => a.status.length - b.status.length,
        sortOrder: sortedInfo.columnKey === "status" && sortedInfo.order
      },
      {
        title: "Action",
        key: "action",
        render: (text, record) => (
          <span>
            <Link to="/courses/info">
              <a href="javascript:;">View more</a>
            </Link>
            <Divider type="vertical" />
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

export default withRouter(Course);
