import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import DocumentTitle from "react-document-title";
import { getUserCreatedSections, deleteSection } from "../../util/APIUtils";
import LoadingIndicator from "../../common/LoadingIndicator";
import {
  Button,
  Divider,
  Row,
  Col,
  Table,
  Tag,
  Typography,
  notification,
  Popconfirm
} from "antd";
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
    this.deleteSectionWithId = this.deleteSectionWithId.bind(this);
  }

  loadSectionList(page = 0, size = SECTION_LIST_SIZE) {
    let promise;
    if (this.props.currentUser) {
      promise = getUserCreatedSections(
        this.props.currentUser.username,
        page,
        size
      );
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
    this.setState({
      filteredInfo: filters,
      sortedInfo: sorter
    });
  };

  deleteSectionWithId(id) {
    deleteSection(id)
      .then(response => {
        let updatedSections = [...this.state.sections].filter(
          i => i.sectionId !== id
        );
        this.setState({ sections: updatedSections });
        this.props.history.push("/section");
        notification.success({
          message: "Smart Team",
          description: "Success! You have successfully deleted a section."
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
    let { sortedInfo, filteredInfo, isLoading } = this.state;
    sortedInfo = sortedInfo || {};
    filteredInfo = filteredInfo || {};

    const getTagColorByStatus = status => {
      switch (status) {
        case "Not Teamed":
          return "volcano";
        case "Teaming":
          return "blue";
        case "Teamed":
          return "green";
        default:
          return "foo";
      }
    };

    const columns = [
      {
        title: "#",
        dataIndex: "sectionId",
        key: "sectionId",
        sorter: (a, b) => a.sectionId - b.sectionId,
        sortOrder: sortedInfo.columnKey === "sectionId" && sortedInfo.order
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
        dataIndex: "noOfStudents",
        key: "noOfStudents",
        sorter: (a, b) => a.noOfStudents - b.noOfStudents,
        sortOrder: sortedInfo.columnKey === "noOfStudents" && sortedInfo.order
      },
      {
        title: "Course",
        dataIndex: "courseName",
        key: "courseName",
        render: (text, record) => <span>{record.courseName}</span>,
        sorter: (a, b) => a.courseName.length - b.courseName.length,
        sortOrder: sortedInfo.columnKey === "courseName" && sortedInfo.order
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
          { text: "Not Teamed", value: "Not Teamed" },
          {
            text: "Teaming",
            value: "Teaming"
          },
          { text: "Teamed", value: "Teamed" }
        ],
        filteredValue: filteredInfo.status || null,
        render: status => (
          <span>
            <Tag color={getTagColorByStatus(status)} key={status}>
              {status}
            </Tag>
          </span>
        ),
        onFilter: (value, record) => record.status.includes(value),
        sorter: (a, b) => a.status.length - b.status.length,
        sortOrder: sortedInfo.columnKey === "status" && sortedInfo.order
      },
      {
        title: "Action",
        key: "action",
        render: (text, record) => (
          <span>
            {record.status === "Not Teamed" && (
              <React.Fragment>
                <Link to={"/section/" + record.sectionId + "/newsmartteam"}>
                  Assign Team
                </Link>
                <Divider type="vertical" />

                <Link to={"/section/" + record.sectionId}>Edit</Link>
                <Divider type="vertical" />
              </React.Fragment>
            )}
            {record.status === "Teaming" && record.smartteams[0] && (
              <React.Fragment>
                <Link
                  to={
                    "/section/" +
                    record.sectionId +
                    "/smartteam/" +
                    record.smartteams[0].smartteamId +
                    "/results"
                  }
                >
                  View Results
                </Link>
                <Divider type="vertical" />
              </React.Fragment>
            )}
            {record.status === "Teamed" && (
              <React.Fragment>
                <Link
                  to={
                    "/smartteam/" + record.smartteams[0].smartteamId + "/team"
                  }
                >
                  View Team
                </Link>
                <Divider type="vertical" />
              </React.Fragment>
            )}
            <Popconfirm
              title="Delete?"
              onConfirm={() => this.deleteSectionWithId(record.sectionId)}
            >
              <a>Delete</a>
            </Popconfirm>
          </span>
        )
      }
    ];

    return (
      <React.Fragment>
        <DocumentTitle title="Smart Team - Sections" />
        {isLoading ? (
          <LoadingIndicator />
        ) : (
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
                rowKey="sectionId"
                columns={columns}
                dataSource={this.state.sections}
                onChange={this.handleChange}
              />
            </Row>
          </React.Fragment>
        )}
      </React.Fragment>
    );
  }
}

export default withRouter(SectionList);
