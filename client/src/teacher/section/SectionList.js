import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import { Button, Divider, Row, Col, Table, Typography } from "antd";
import "./SectionList.css";

const { Title } = Typography;

const data = [
  {
    key: "1",
    name: "Tri3-2009",
    noOfStudent: 35,
    course: "ICT1001",
    year: "2009",
    status: "Not Grouped"
  },
  {
    key: "2",
    name: "Tri2-2012",
    noOfStudent: 36,
    course: "ICT1002",
    year: "2012",
    status: "Pending (Automated Allocation)"
  },
  {
    key: "3",
    name: "Tri2-2010",
    noOfStudent: 38,
    course: "ICT1003",
    year: "2010",
    status: "Grouped"
  },
  {
    key: "4",
    name: "Tri2-2009",
    noOfStudent: 34,
    course: "ICT1004",
    year: "2009",
    status: "Not Grouped"
  },
  {
    key: "5",
    name: "Tri1-2012",
    noOfStudent: 40,
    course: "ICT1003",
    year: "2012",
    status: "Grouped"
  }
];

class SectionList extends Component {
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
        title: "Name",
        dataIndex: "name",
        key: "name",
        sorter: (a, b) => a.name.length - b.name.length,
        sortOrder: sortedInfo.columnKey === "name" && sortedInfo.order
      },
      {
        title: "No. of Students",
        dataIndex: "noOfStudent",
        key: "noOfStudent",
        sorter: (a, b) => a.noOfStudent - b.noOfStudent,
        sortOrder: sortedInfo.columnKey === "noOfStudent" && sortedInfo.order
      },
      {
        title: "Course",
        dataIndex: "course",
        key: "course",
        filters: [
          { text: "ICT1001", value: "ICT1001" },
          { text: "ICT1002", value: "ICT1002" },
          { text: "ICT1003", value: "ICT1003" },
          { text: "ICT1004", value: "ICT1004" }
        ],
        filteredValue: filteredInfo.course || null,
        onFilter: (value, record) => record.course.includes(value),
        sorter: (a, b) => a.course.length - b.course.length,
        sortOrder: sortedInfo.columnKey === "course" && sortedInfo.order
      },
      {
        title: "Year",
        dataIndex: "year",
        key: "year",
        sorter: (a, b) => a.year - b.year,
        sortOrder: sortedInfo.columnKey === "year" && sortedInfo.order
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
            <a href="javascript:;">Assign Group</a>
            <Divider type="vertical" />
            <Link to="/section/edit">Edit</Link>
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
            <Title level={2}>Sections</Title>
          </Col>
          <Col span={2}>
            <Link to="/section/new">
              <Button type="primary" size="default">
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

export default withRouter(SectionList);
