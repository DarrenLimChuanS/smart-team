import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { Button, Divider, Row, Col, Table, Typography } from "antd";
import "./CriteriaList.css";

const { Title } = Typography;

const data = [
  {
    key: "1",
    name: "Name",
    type: "Single",
    noOfQuestions: 1
  },
  {
    key: "2",
    name: "Age",
    type: "Single",
    noOfQuestions: 1
  },
  {
    key: "3",
    name: "GPA",
    type: "Single",
    noOfQuestions: 1
  },
  {
    key: "4",
    name: "Leadership",
    type: "Multiple",
    noOfQuestions: 10
  },
  {
    key: "5",
    name: "Field of Interest",
    type: "Multiple",
    noOfQuestions: 3
  }
];

class Criteria extends Component {
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
        title: "Type",
        dataIndex: "type",
        key: "type",
        sorter: (a, b) => a.type - b.type,
        sortOrder: sortedInfo.columnKey === "type" && sortedInfo.order
      },
      {
        title: "No. of Questions",
        dataIndex: "noOfQuestions",
        key: "noOfQuestions",
        filteredValue: filteredInfo.noOfQuestions || null,
        onFilter: (value, record) => record.noOfQuestions.includes(value),
        sorter: (a, b) => a.noOfQuestions - b.noOfQuestions,
        sortOrder: sortedInfo.columnKey === "noOfQuestions" && sortedInfo.order
      },
      {
        title: "Action",
        key: "action",
        render: (text, record) => (
          <span>
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
          <Col span={18}>
            <Title level={2}>Criteria</Title>
          </Col>
          <Col span={2}>
            <Button type="primary" size={12}>
              Export
            </Button>
          </Col>
          <Col span={2}>
            <Button type="primary" size={12}>
              Import
            </Button>
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

export default withRouter(Criteria);
