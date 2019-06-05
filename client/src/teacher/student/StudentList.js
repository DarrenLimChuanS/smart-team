import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import { Button, Divider, Row, Col, Table, Typography } from "antd";

const { Title } = Typography;

const data = [
  {
    key: "1",
    batchNumber: "49",
    name: "Joe Hamilton",
    email: "joe_hamilton@gmail.com",
    studentId: "1128290",
    birthDate: "1/1/1990",
    gender: "Male",
    address: "5133 Homestead Rd",
    gpa: "4.8"
  },
  {
    key: "2",
    batchNumber: "49",
    name: "Riley Lee",
    email: "riley_lee@gmail.com",
    studentId: "1128291",
    birthDate: "1/4/1992",
    gender: "Female",
    address: "4205 Plum St",
    gpa: "4.4"
  },
  {
    key: "3",
    batchNumber: "49",
    name: "Isaiah Watts",
    email: "isaiah_watts@gmail.com",
    studentId: "1128292",
    birthDate: "2/3/1981",
    gender: "Male",
    address: "2390 Camden Ave",
    gpa: "4.5"
  },
  {
    key: "4",
    batchNumber: "49",
    name: "Annette Daniels",
    email: "annette_daniels@gmail.com",
    studentId: "1128293",
    birthDate: "3/4/1992",
    gender: "Female",
    address: "1460 Hebron Pkwy",
    gpa: "3.2"
  },
  {
    key: "5",
    batchNumber: "49",
    name: "Jeremy Davidson",
    email: "jeremy_davidson@gmail.com",
    studentId: "1128294",
    birthDate: "4/9/1991",
    gender: "Male",
    address: "6986 Paddington Ct",
    gpa: "2.8"
  }
];

class StudentList extends Component {
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
        filteredValue: filteredInfo.name || null,
        onFilter: (value, record) => record.name.includes(value),
        sorter: (a, b) => a.name.length - b.name.length,
        sortOrder: sortedInfo.columnKey === "name" && sortedInfo.order
      },
      {
        title: "Email",
        dataIndex: "email",
        key: "email",
        filteredValue: filteredInfo.email || null,
        onFilter: (value, record) => record.email.includes(value),
        sorter: (a, b) => a.email.length - b.email.length,
        sortOrder: sortedInfo.columnKey === "email" && sortedInfo.order
      },
      {
        title: "Student ID",
        dataIndex: "studentId",
        key: "studentId",
        sorter: (a, b) => a.studentId - b.studentId,
        sortOrder: sortedInfo.columnKey === "studentId" && sortedInfo.order
      },
      {
        title: "Birthdate",
        dataIndex: "birthDate",
        key: "birthDate",
        filteredValue: filteredInfo.birthDate || null,
        onFilter: (value, record) => record.birthDate.includes(value),
        sorter: (a, b) => a.birthDate.length - b.birthDate.length,
        sortOrder: sortedInfo.columnKey === "birthDate" && sortedInfo.order
      },
      {
        title: "Gender",
        dataIndex: "gender",
        key: "gender",
        sorter: (a, b) => a.gender - b.gender,
        sortOrder: sortedInfo.columnKey === "gender" && sortedInfo.order
      },
      {
        title: "Address",
        dataIndex: "address",
        key: "address",
        filteredValue: filteredInfo.address || null,
        onFilter: (value, record) => record.address.includes(value),
        sorter: (a, b) => a.address.length - b.address.length,
        sortOrder: sortedInfo.columnKey === "address" && sortedInfo.order
      },
      {
        title: "GPA",
        dataIndex: "gpa",
        key: "gpa",
        filteredValue: filteredInfo.gpa || null,
        onFilter: (value, record) => record.gpa.includes(value),
        sorter: (a, b) => a.gpa - b.gpa,
        sortOrder: sortedInfo.columnKey === "gpa" && sortedInfo.order
      },
      {
        title: "Action",
        key: "action",
        render: (text, record) => (
          <span>
            <a href="javascript:;">Reset Password</a>
            <Divider type="vertical" />
            <Link to="/student/edit">Edit</Link>
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
            <Title level={2}>Students</Title>
          </Col>
          <Col span={2}>
            <Link to="/student/new">
              <Button type="primary" size={12}>
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

export default withRouter(StudentList);
