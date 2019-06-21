import React, { Component } from "react";
import { getAllModules, getUserCreatedModules } from "../../util/APIUtils";
import { withRouter } from "react-router-dom";
import { Button, Divider, Row, Col, Table, Typography } from "antd";
import "./ModuleList.css";
import { MODULE_LIST_SIZE } from "../../constants";

const { Title } = Typography;

const data = [
  {
    key: "1",
    name: "ICT1001",
    description:
      "This module is intended to be at an introductory level to provide an overview of the different modules taught in the ICT programme."
  },
  {
    key: "2",
    name: "ICT1002",
    description:
      "This module is intended for students with no prior computing knowledge and can be taken by any student interested in acquiring basic programming skills."
  },
  {
    key: "3",
    name: "ICT1003",
    description:
      "This is a foundation module whose main focus is on the characteristics and development of relatively high level ‘building’ blocks of a computer system."
  },
  {
    key: "4",
    name: "ICT1004",
    description:
      " This module covers the essential web technologies to equip students with the useful skills to build websites for web-based IT applications."
  },
  {
    key: "5",
    name: "ICT1005",
    description:
      "This module will equip students with the core mathematical knowledge in two broad focus areas: discrete mathematics, and probability and statistics."
  }
];

class ModuleList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modules: [],
      page: 0,
      size: 10,
      totalElements: 0,
      totalPages: 0,
      last: true,
      currentModules: [],
      isLoading: false
    };
    this.loadModuleList = this.loadModuleList.bind(this);
  }

  loadModuleList(page = 0, size = MODULE_LIST_SIZE) {
    let promise;
    promise = getAllModules();

    if (!promise) {
      return;
    }

    this.setState({
      isLoading: true
    });

    promise
      .then(response => {
        console.log(response);
        const modules = this.state.modules.slice();
        const currentVotes = this.state.currentVotes.slice();

        this.setState({
          modules: modules.concat(response.content),
          page: response.page,
          size: response.size,
          totalElements: response.totalElements,
          totalPages: response.totalPages,
          last: response.last,
          currentVotes: currentVotes.concat(
            Array(response.content.length).fill(null)
          ),
          isLoading: false
        });
      })
      .catch(error => {
        this.setState({
          isLoading: false
        });
      });
  }

  state = {
    filteredInfo: null,
    sortedInfo: null
  };

  componentDidMount() {
    this.loadModuleList();
  }

  componentDidUpdate(nextProps) {
    if (this.props.isAuthenticated !== nextProps.isAuthenticated) {
      // Reset State
      this.setState({
        modules: [],
        page: 0,
        size: 10,
        totalElements: 0,
        totalPages: 0,
        last: true,
        currentModules: [],
        isLoading: false
      });
      this.loadModuleList();
    }
  }

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
        sorter: (a, b) => a.key.length - b.key.length,
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
          <Col span={22}>
            <Title level={2}>Modules</Title>
          </Col>
          <Col span={2}>
            <Button type="primary" size="large">
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

export default withRouter(ModuleList);
