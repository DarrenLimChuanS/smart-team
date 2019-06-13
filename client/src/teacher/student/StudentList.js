import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import { getStudentsByTeacher } from "../../util/APIUtils";
import { Button, Divider, Row, Col, Table, Typography } from "antd";

const { Title } = Typography;

class StudentList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      filteredInfo: null,
      sortedInfo: null,
      students: [],
      page: 0,
      size: 10,
      totalElements: 0,
      totalPages: 0,
      last: true,
      isLoading: false
    };
    this.loadStudentList = this.loadStudentList.bind(this);
    this.handleLoadMore = this.handleLoadMore.bind(this);
  }

  loadStudentList() {
    const { currentUser } = this.props;
    let promise;

    if (currentUser) {
      promise = getStudentsByTeacher(currentUser.id);
    }
    // else {
    //   promise = getAllStudents(page, size);
    // }

    if (!promise) {
      return;
    }

    console.log(currentUser);

    this.setState({
      isLoading: true
    });

    promise
      .then(response => {
        const students = students.slice();

        this.setState({
          students: students.concat(response.content),
          page: response.page,
          size: response.size,
          totalElements: response.totalElements,
          totalPages: response.totalPages,
          last: response.last,
          isLoading: false
        });
        console.log(students.concat(response.content));
      })
      .catch(error => {
        this.setState({
          isLoading: false
        });
        console.log("Error la!");
      });
  }

  componentDidMount() {
    this.loadStudentList();
  }

  componentDidUpdate(nextProps) {
    if (this.props.isAuthenticated !== nextProps.isAuthenticated) {
      // Reset State
      this.setState({
        students: [],
        page: 0,
        size: 10,
        totalElements: 0,
        totalPages: 0,
        last: true,
        isLoading: false
      });
      this.loadStudentList();
    }
  }

  handleLoadMore() {
    this.loadStudentList(this.state.page + 1);
  }

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
        title: "Batch No.",
        dataIndex: "batch_no",
        key: "batch_no",
        filteredValue: filteredInfo.batch_no || null,
        onFilter: (value, record) => record.batch_no.includes(value),
        sorter: (a, b) => a.batch_no.length - b.batch_no.length,
        sortOrder: sortedInfo.columnKey === "batch_no" && sortedInfo.order
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
        title: "Birth Date",
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
              <Button type="primary" size="large">
                Create
              </Button>
            </Link>
          </Col>
        </Row>
        <Row>
          <Table
            columns={columns}
            dataSource={this.state.students}
            onChange={this.handleChange}
          />
        </Row>
      </React.Fragment>
    );
  }
}

export default withRouter(StudentList);
