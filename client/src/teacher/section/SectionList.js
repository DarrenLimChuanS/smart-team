import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import {
  getAllSections,
  getUserCreatedSections,
  deleteCourse
} from "../../util/APIUtils";
import { Button, Divider, Row, Col, Table, Typography } from "antd";
import "./SectionList.css";
import { SECTION_LIST_SIZE } from "../../constants";

const { Title } = Typography;

class SectionList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      filteredInfo: null,
      sortedInfo: null,
      sections: [],
      page: 0,
      size: 10,
      totalElements: 0,
      totalPages: 0,
      last: true,
      isLoading: false
    };
    this.loadSectionList = this.loadSectionList.bind(this);
    this.handleLoadMore = this.handleLoadMore.bind(this);
    // this.deleteSectionWithId = this.deleteSectionWithId.bind(this);
  }

  loadSectionList(page = 0, size = SECTION_LIST_SIZE) {
    let promise;
    if (this.props.currentUser) {
      promise = getUserCreatedSections(
        this.props.currentUser.username,
        page,
        size
      );
    } else {
      promise = getAllSections(page, size);
    }

    if (!promise) {
      return;
    }

    this.setState({
      isLoading: true
    });

    promise
      .then(response => {
        const sections = this.state.sections.slice();

        this.setState({
          sections: sections.concat(response.content),
          page: response.page,
          size: response.size,
          totalElements: response.totalElements,
          totalPages: response.totalPages,
          last: response.last,
          isLoading: false
        });
        console.log(sections.concat(response.content));
      })
      .catch(error => {
        this.setState({
          isLoading: false
        });
      });
  }

  componentDidMount() {
    this.loadSectionList();
  }

  componentDidUpdate(nextProps) {
    if (this.props.isAuthenticated !== nextProps.isAuthenticated) {
      // Reset State
      this.setState({
        sections: [],
        page: 0,
        size: 10,
        totalElements: 0,
        totalPages: 0,
        last: true,
        isLoading: false
      });
      this.loadSectionList();
    }
  }

  handleLoadMore() {
    this.loadSectionList(this.state.page + 1);
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
        title: "Name",
        dataIndex: "name",
        key: "name",
        sorter: (a, b) => a.name.length - b.name.length,
        sortOrder: sortedInfo.columnKey === "name" && sortedInfo.order
      },
      {
        title: "No. of Students",
        dataIndex: "noOfStudents",
        key: "noOfStudents",
        sorter: (a, b) => a.noOfStudents - b.noOfStudents,
        sortOrder: sortedInfo.columnKey === "noOfStudents" && sortedInfo.order
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
            dataSource={this.state.sections}
            onChange={this.handleChange}
          />
        </Row>
      </React.Fragment>
    );
  }
}

export default withRouter(SectionList);
