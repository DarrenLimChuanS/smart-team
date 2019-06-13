import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import { getUserCreatedStudents, deleteStudent } from "../../util/APIUtils";
import {
  Button,
  Divider,
  Row,
  Col,
  Table,
  Typography,
  notification
} from "antd";
import Moment from "react-moment";

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
      promise = getUserCreatedStudents(currentUser.id);
    }
    // else {
    //   promise = getAllStudents(page, size);
    // }

    if (!promise) {
      return;
    }

    this.setState({
      isLoading: true
    });

    promise
      .then(response => {
        const students = this.state.students.slice();
        this.setState({
          students: students.concat(response),
          isLoading: false
        });
      })
      .catch(error => {
        this.setState({
          isLoading: false
        });
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

  deleteStudentWithId(id) {
    deleteStudent(id)
      .then(response => {
        let updatedStudents = [...this.state.students].filter(i => i.id !== id);
        this.setState({ students: updatedStudents });
        this.props.history.push("/student");
        notification.success({
          message: "Smart Team",
          description: "Success! You have successfully deleted a student."
        });
      })
      .catch(error => {
        notification.error({
          message: "Smart Team",
          description:
            error.message || "Sorry! Something went wrong. Please try again!"
        });
      });
  }

  render() {
    let { sortedInfo, filteredInfo } = this.state;
    sortedInfo = sortedInfo || {};
    filteredInfo = filteredInfo || {};

    const columns = [
      {
        title: "#",
        dataIndex: "id",
        key: "id",
        filteredValue: filteredInfo.id || null,
        onFilter: (value, record) => record.id.includes(value),
        sorter: (a, b) => a.id - b.id,
        sortOrder: sortedInfo.columnKey === "id" && sortedInfo.order
      },
      {
        title: "Batch_No",
        dataIndex: "batch_no",
        key: "batch_no",
        filteredValue: filteredInfo.batch_no || null,
        onFilter: (value, record) => record.batch_no.includes(value),
        sorter: (a, b) => a.batch_no - b.batch_no,
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
        title: "Username",
        dataIndex: "username",
        key: "username",
        filteredValue: filteredInfo.username || null,
        onFilter: (value, record) => record.username.includes(value),
        sorter: (a, b) => a.username.length - b.username.length,
        sortOrder: sortedInfo.columnKey === "username" && sortedInfo.order
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
        title: "Updated_at",
        dataIndex: "updatedAt",
        key: "updatedAt",
        filteredValue: filteredInfo.updatedAt || null,
        onFilter: (value, record) => record.updatedAt.includes(value),
        sorter: (a, b) => a.updatedAt.length - b.updatedAt.length,
        sortOrder: sortedInfo.columnKey === "updatedAt" && sortedInfo.order,
        render: updatedAt => <Moment>{updatedAt}</Moment>
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
            <a onClick={() => this.deleteStudentWithId(record.id)}>Delete</a>
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
