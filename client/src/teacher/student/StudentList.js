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
  notification,
  Popconfirm
} from "antd";
import Moment from "react-moment";
import { STUDENT_LIST_SIZE } from "../../constants";

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
  }

  loadStudentList(page = 0, size = STUDENT_LIST_SIZE) {
    const { currentUser } = this.props;
    let promise;

    if (currentUser) {
      promise = getUserCreatedStudents(currentUser.username, page, size);
    }

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
          students: students.concat(response.content),
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
        isLoading: false
      });
      this.loadStudentList();
    }
  }

  handleChange = (pagination, filters, sorter) => {
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
            <Link to={"/student/" + record.id}>Edit</Link>
            <Divider type="vertical" />
            <Popconfirm
              title="Delete?"
              onConfirm={() => this.deleteStudentWithId(record.id)}
            >
              <a>Delete</a>
            </Popconfirm>
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
            rowKey="id"
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
