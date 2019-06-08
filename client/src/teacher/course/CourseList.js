import React, { Component } from "react";
import { getAllCourses, getUserCreatedCourses } from "../../util/APIUtils";
import { Link, withRouter } from "react-router-dom";
import { Button, Divider, Row, Col, Table, Typography } from "antd";
import { compareByAlph } from "../../util/Sorters";
import { COURSE_LIST_SIZE } from "../../constants";

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

  constructor(props) {
    super(props);
    this.state = {
      courses: [],
      page: 0,
      size: 10,
      totalElements: 0,
      totalPages: 0,
      last: true,
      isLoading: false
    };
    this.loadCourseList = this.loadCourseList.bind(this);
    this.handleLoadMore = this.handleLoadMore.bind(this);
  }

  loadCourseList(page = 0, size = COURSE_LIST_SIZE) {
    let promise;
    if (this.props.username) {
      if (this.props.type === "USER_CREATED_COURSES") {
        promise = getUserCreatedCourses(this.props.username, page, size);
      }
    } else {
      promise = getAllCourses(page, size);
    }

    if (!promise) {
      return;
    }

    this.setState({
      isLoading: true
    });

    promise
      .then(response => {
        const courses = this.state.courses.slice();

        this.setState({
          courses: courses.concat(response.content),
          page: response.page,
          size: response.size,
          totalElements: response.totalElements,
          totalPages: response.totalPages,
          last: response.last,
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
    this.loadCourseList();
  }

  componentDidUpdate(nextProps) {
    if (this.props.isAuthenticated !== nextProps.isAuthenticated) {
      // Reset State
      this.setState({
        courses: [],
        page: 0,
        size: 10,
        totalElements: 0,
        totalPages: 0,
        last: true,
        isLoading: false
      });
      this.loadCourseList();
    }
  }

  handleLoadMore() {
    this.loadCourseList(this.state.page + 1);
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
        dataIndex: "id",
        key: "id",
        filteredValue: filteredInfo.key || null,
        onFilter: (value, record) => record.key.includes(value),
        sorter: (a, b) => a.key - b.key,
        sortOrder: sortedInfo.columnKey === "key" && sortedInfo.order
      },
      {
        title: "Course ID",
        dataIndex: "module",
        key: "module",
        sorter: (a, b) => compareByAlph(a.module, b.module),
        sortOrder: sortedInfo.columnKey === "module" && sortedInfo.order
      },
      {
        title: "Name",
        dataIndex: "name",
        key: "name",
        sorter: (a, b) => compareByAlph(a.name, b.name),
        sortOrder: sortedInfo.columnKey === "name" && sortedInfo.order
      },
      {
        title: "Description",
        dataIndex: "description",
        key: "description",
        sorter: (a, b) => compareByAlph(a.description, b.description),
        sortOrder: sortedInfo.columnKey === "description" && sortedInfo.order
      },
      {
        title: "Action",
        key: "action",
        render: (text, record) => (
          <span>
            <a href="javascript:;">View Sections</a>
            <Divider type="vertical" />
            <Link to="/course/edit">Edit</Link>
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
            dataSource={this.state.courses}
            onChange={this.handleChange}
          />
        </Row>
      </React.Fragment>
    );
  }
}

export default withRouter(CourseList);
