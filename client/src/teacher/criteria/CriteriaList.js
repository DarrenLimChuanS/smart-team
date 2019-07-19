import React, { Component } from "react";
import {
  getAllCriteria,
  getUserCreatedCriteria,
  deleteCriteria
} from "../../util/APIUtils";
import { Link, withRouter } from "react-router-dom";
import LoadingIndicator from "../../common/LoadingIndicator";
import {
  notification,
  Button,
  Divider,
  Row,
  Col,
  Table,
  Typography,
  Popconfirm
} from "antd";
import "./CriteriaList.css";

import { compareByAlph } from "../../util/Sorters";
import { CRITERIA_LIST_SIZE } from "../../constants";

const { Title } = Typography;

class Criteria extends Component {
  state = {
    filteredInfo: null,
    sortedInfo: null
  };

  constructor(props) {
    super(props);
    this.state = {
      criteria: [],
      page: 0,
      size: 10,
      totalElements: 0,
      totalPages: 0,
      last: true,
      isLoading: false
    };
    this.loadCriteriaList = this.loadCriteriaList.bind(this);
    this.handleLoadMore = this.handleLoadMore.bind(this);
    this.deleteCriteriaWithId = this.deleteCriteriaWithId.bind(this);
  }

  loadCriteriaList(page = 0, size = CRITERIA_LIST_SIZE) {
    let promise;

    if (this.props.currentUser) {
      promise = getUserCreatedCriteria(
        this.props.currentUser.username,
        page,
        size
      );
    } else {
      promise = getAllCriteria(page, size);
    }

    if (!promise) {
      return;
    }

    this.setState({
      isLoading: true
    });

    promise
      .then(response => {
        const criteria = this.state.criteria.slice();
        this.setState({
          criteria: criteria.concat(response.content),
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
    this.loadCriteriaList();
  }

  componentDidUpdate(nextProps) {
    if (this.props.isAuthenticated !== nextProps.isAuthenticated) {
      // Reset State
      this.setState({
        criteria: [],
        page: 0,
        size: 10,
        totalElements: 0,
        totalPages: 0,
        last: true,
        isLoading: false
      });
      this.loadCriteriaList();
    }
  }

  handleLoadMore() {
    this.loadCriteriaList(this.state.page + 1);
  }

  handleChange = (pagination, filters, sorter) => {
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

  deleteCriteriaWithId(id) {
    deleteCriteria(id)
      .then(response => {
        let updatedCriteria = [...this.state.criteria].filter(i => i.id !== id);
        this.setState({ criteria: updatedCriteria });
        // this.loadCriteriaList();
        this.props.history.push("/criteria");
        notification.success({
          message: "Smart Team",
          description: "Success! You have successfully deleted a criteria."
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
    let { sortedInfo, isLoading } = this.state;
    sortedInfo = sortedInfo || {};

    const columns = [
      {
        title: "#",
        dataIndex: "id",
        key: "id",
        sorter: (a, b) => compareByAlph(a.id, b.id),
        sortOrder: sortedInfo.columnKey === "id" && sortedInfo.order
      },
      {
        title: "Name",
        dataIndex: "name",
        key: "name",
        sorter: (a, b) => a.name.length - b.name.length,
        sortOrder: sortedInfo.columnKey === "name" && sortedInfo.order
      },
      {
        title: "Graded",
        dataIndex: "graded",
        key: "graded",
        render: (text, record) => (
          <span>{record.graded ? "Graded" : "Non-Graded"}</span>
        ),
        sorter: (a, b) => a.graded - b.graded,
        sortOrder: sortedInfo.columnKey === "graded" && sortedInfo.order
      },
      {
        title: "Description",
        dataIndex: "description",
        key: "description",
        sorter: (a, b) => a.description - b.description,
        sortOrder: sortedInfo.columnKey === "description" && sortedInfo.order
      },
      {
        title: "Action",
        key: "action",
        render: (text, record) => (
          <span>
            <Popconfirm
              title="Delete?"
              onConfirm={() => this.deleteCriteriaWithId(record.id)}
            >
              <a>Delete</a>
            </Popconfirm>
          </span>
        )
      }
    ];

    return isLoading ? (
      <LoadingIndicator />
    ) : (
      <React.Fragment>
        <Row>
          <Col span={22}>
            <Title level={2}>Criteria</Title>
          </Col>
          {/* <Col span={2}>
            <Button type="primary" size="default">
              Export
            </Button>
          </Col>
          <Col span={2}>
            <Button type="primary" size="default">
              Import
            </Button>
          </Col> */}
          <Col span={2}>
            <Link to="/criteria/new">
              <Button type="primary" size="default">
                Create
              </Button>
            </Link>
          </Col>
        </Row>
        <Row>
          <Table
            rowKey="id"
            columns={columns}
            dataSource={this.state.criteria}
            onChange={this.handleChange}
          />
        </Row>
      </React.Fragment>
    );
  }
}

export default withRouter(Criteria);
