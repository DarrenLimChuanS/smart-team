import React, { Component } from "react";
import update from "immutability-helper";
import { withRouter } from "react-router-dom";
import LoadingIndicator from "../../common/LoadingIndicator";
import {
  Button,
  Col,
  Divider,
  Form,
  Input,
  Row,
  Select,
  Table,
  Typography,
  Popconfirm,
  notification
} from "antd";
import "./QuestionnaireList.css";
import PopUpModal from "../../common/PopUpModal";
import { compareByAlph } from "../../util/Sorters";
import {
  createQuestionnaire,
  getUserCreatedQuestionnaires,
  addCriteriaToQuestionnaire,
  removeCriteriaFromQuestionnaire,
  deleteQuestionnaire,
  getCriteriaById,
  getUserCreatedCriteria
} from "../../util/APIUtils";
import { validateNotRequired, validateNotEmpty } from "../../util/Validators";

import { CRITERIA_LIST_SIZE, QUESTIONNAIRE_LIST_SIZE } from "../../constants";

const FormItem = Form.Item;
const { Option } = Select;
const { Title } = Typography;

class Questionnaire extends Component {
  constructor(props) {
    super(props);
    this.state = {
      criteriaList: [],
      questionnaireList: [],
      selectedQuestionnaireIndex: null,
      selectedCriteriaList: [],
      selectedCriteriaId: null,
      filteredInfo: null,
      sortedInfo: null,
      name: {
        value: ""
      },
      instruction: {
        value: ""
      },
      page: 0,
      size: 10,
      totalElements: 0,
      totalPages: 0,
      last: true,
      isLoading: false
    };
    this.loadQuestionnaireList = this.loadQuestionnaireList.bind(this);
    this.loadCriteriaList = this.loadCriteriaList.bind(this);
    this.handleLoadMore = this.handleLoadMore.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleDeleteQuestionnaire = this.handleDeleteQuestionnaire.bind(this);
    this.handleAddCriteria = this.handleAddCriteria.bind(this);
    this.handleRemoveCriteria = this.handleRemoveCriteria.bind(this);
    this.isFormInvalid = this.isFormInvalid.bind(this);
  }

  loadCriteriaList(page = 0, size = CRITERIA_LIST_SIZE) {
    let promise;

    if (this.props.currentUser) {
      promise = getUserCreatedCriteria(
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
        const criteria = this.state.criteriaList.slice();
        this.setState({
          criteriaList: criteria.concat(response.content),
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

  loadCriteriaByID(criteriaId, page = 0, size = QUESTIONNAIRE_LIST_SIZE) {
    let promise;
    if (this.props.currentUser) {
      promise = getCriteriaById(criteriaId, page, size);
    }

    if (!promise) {
      return;
    }

    this.setState({
      isLoading: true
    });

    promise
      .then(response => {
        const criteria = this.state.selectedCriteriaList.slice();
        this.setState({
          selectedCriteriaList: criteria.concat(response),
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

  loadQuestionnaireList(page = 0, size = QUESTIONNAIRE_LIST_SIZE) {
    let promise;
    if (this.props.currentUser) {
      promise = getUserCreatedQuestionnaires(
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
        const questionnaires = this.state.questionnaireList.slice();

        this.setState({
          questionnaireList: questionnaires.concat(response.content),
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
    this.loadQuestionnaireList();
    this.loadCriteriaList();
  }

  resetState() {
    this.setState({
      questionnaires: [],
      page: 0,
      size: 10,
      totalElements: 0,
      totalPages: 0,
      last: true,
      isLoading: false
    });
  }

  componentDidUpdate(nextProps) {
    if (this.props.isAuthenticated !== nextProps.isAuthenticated) {
      // Reset State
      this.resetState();
      this.loadQuestionnaireList();
    }
  }

  handleLoadMore() {
    this.loadQuestionnaireList(this.state.page + 1);
  }

  handleInputChange(event, validationFun) {
    const target = event.target;
    const inputName = target.name;
    const inputValue = target.value;

    this.setState({
      [inputName]: {
        value: inputValue,
        ...validationFun(inputValue)
      }
    });
  }

  handleChange = (pagination, filters, sorter) => {
    this.setState({
      filteredInfo: filters,
      sortedInfo: sorter
    });
  };

  handleQuestionnaireChange(value) {
    this.setState({
      selectedCriteriaList: [],
      selectedQuestionnaireIndex: value
    });
    this.state.questionnaireList[value].criteria.forEach(criteria => {
      this.loadCriteriaByID(criteria.id);
    });
  }

  handleCriteriaChange(value) {
    this.setState({
      selectedCriteriaId: value
    });
  }

  handleDeleteQuestionnaire(index) {
    const id = this.state.questionnaireList[index].questionnaireId;
    deleteQuestionnaire(id)
      .then(response => {
        this.setState({
          selectedQuestionnaireIndex: 0,
          questionnaireList: update(this.state.questionnaireList, {
            $splice: [[index, 1]]
          })
        });
        notification.success({
          message: "Smart Team",
          description: "Success! You have successfully deleted a questionnaire."
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

  handleSubmit(event) {
    const createRequest = {
      name: this.state.name.value,
      instruction: this.state.instruction.value,
      user: this.state.currentUser
    };
    createQuestionnaire(createRequest)
      .then(response => {
        this.setState({
          questionnaireList: update(this.state.questionnaireList, {
            $push: [
              {
                questionnaireId: Number(response.message),
                name: this.state.name.value,
                instruction: this.state.instruction.value,
                criteria: []
              }
            ]
          })
        });
        notification.success({
          message: "Smart Team",
          description:
            "Success! You have successfully created a new questionnaire."
        });
        this.props.history.push("/questionnaire");
      })
      .catch(error => {
        notification.error({
          message: "Smart Team",
          description:
            error.message || "Sorry! Something went wrong. Please try again!"
        });
      });
  }

  handleAddCriteria() {
    const {
      questionnaireList,
      selectedCriteriaList,
      selectedQuestionnaireIndex,
      criteriaList,
      selectedCriteriaId
    } = this.state;
    addCriteriaToQuestionnaire(
      questionnaireList[selectedQuestionnaireIndex].questionnaireId,
      criteriaList[selectedCriteriaId].id
    )
      .then(response => {
        this.setState({
          questionnaireList: update(questionnaireList, {
            [selectedQuestionnaireIndex]: {
              criteria: { $push: [criteriaList[selectedCriteriaId]] }
            }
          }),
          selectedCriteriaList: update(selectedCriteriaList, {
            $push: [criteriaList[selectedCriteriaId]]
          })
        });
        notification.success({
          message: "Smart Team",
          description: "Success! You have successfully added a criteria."
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

  handleRemoveCriteria(criteriaId, criteriaIndex) {
    const {
      questionnaireList,
      selectedQuestionnaireIndex,
      selectedCriteriaList
    } = this.state;
    removeCriteriaFromQuestionnaire(
      questionnaireList[selectedQuestionnaireIndex].questionnaireId,
      criteriaId
    )
      .then(response => {
        this.setState({
          questionnaireList: update(questionnaireList, {
            [selectedQuestionnaireIndex]: {
              criteria: { $splice: [[criteriaIndex, 1]] }
            }
          }),
          selectedCriteriaList: update(selectedCriteriaList, {
            $splice: [[criteriaIndex, 1]]
          })
        });
        notification.success({
          message: "Smart Team",
          description: "Success! You have successfully removed a criteria."
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

  isFormInvalid() {
    return !(this.state.name.validateStatus === "success");
  }

  render() {
    let { sortedInfo, filteredInfo } = this.state;
    sortedInfo = sortedInfo || {};
    filteredInfo = filteredInfo || {};

    const columns = [
      {
        title: "#",
        dataIndex: "id",
        id: "id",
        filteredValue: filteredInfo.id || null,
        onFilter: (value, record) => record.id.includes(value),
        sorter: (a, b) => a.id - b.id,
        sortOrder: sortedInfo.columnKey === "id" && sortedInfo.order
      },
      {
        title: "Question",
        dataIndex: "question",
        key: "question",
        sorter: (a, b) => compareByAlph(a.question, b.question),
        sortOrder: sortedInfo.columnKey === "question" && sortedInfo.order
      },
      {
        title: "Action",
        key: "action",
        render: (text, record) => (
          <span>
            <a href="/">Edit</a>
            <Divider type="vertical" />
            <a href="/">Delete</a>
          </span>
        )
      }
    ];

    const criteriaColumns = [
      {
        title: "#",
        dataIndex: "id",
        id: "id",
        filteredValue: filteredInfo.id || null,
        onFilter: (value, record) => record.id.includes(value),
        sorter: (a, b) => a.id - b.id,
        sortOrder: sortedInfo.columnid === "id" && sortedInfo.order
      },
      {
        title: "Question",
        dataIndex: "question",
        key: "question",
        sorter: (a, b) => compareByAlph(a.question, b.question),
        sortOrder: sortedInfo.columnKey === "question" && sortedInfo.order
      }
    ];

    const criteriaOptions = this.state.criteriaList.map((item, index) => (
      <Option key={index}>
        {item.name} ({item.polls.length})
      </Option>
    ));

    const {
      questionnaireList,
      selectedQuestionnaireIndex,
      selectedCriteriaList,
      isLoading
    } = this.state;
    return isLoading ? (
      <LoadingIndicator />
    ) : (
      <React.Fragment>
        <Row>
          <Col span={20}>
            <Title level={2}>Questionnaires</Title>
          </Col>
          <Col span={2}>
            <Button type="primary" size="default">
              Import
            </Button>
          </Col>
          <Col span={2}>
            <PopUpModal
              title="Create Questionnaire"
              triggerButtonText="Create"
              confirmText="Create Questionnaire"
              onSubmit={this.handleSubmit}
            >
              <Form className="signup-form">
                <FormItem
                  label="Name"
                  hasFeedback
                  validateStatus={this.state.name.validateStatus}
                  help={this.state.name.errorMsg}
                >
                  <Input
                    size="large"
                    name="name"
                    autoComplete="off"
                    placeholder="Name"
                    value={this.state.name.value}
                    onChange={event =>
                      this.handleInputChange(event, validateNotEmpty)
                    }
                  />
                </FormItem>
                <FormItem label="Instruction">
                  <Input
                    size="large"
                    name="instruction"
                    autoComplete="off"
                    placeholder="Instruction"
                    value={this.state.instruction.value}
                    onChange={event =>
                      this.handleInputChange(event, validateNotRequired)
                    }
                  />
                </FormItem>
              </Form>
            </PopUpModal>
          </Col>
        </Row>
        <Row>
          <Col span={8}>
            <Form className="signup-form">
              <FormItem label="Select saved questionnaire">
                <Select
                  name="selectedQuestionnaireIndex"
                  size="large"
                  style={{ width: "100%" }}
                  value={selectedQuestionnaireIndex}
                  placeholder="Please select a questionnaire"
                  onChange={index => this.handleQuestionnaireChange(index)}
                >
                  {this.state &&
                    questionnaireList &&
                    questionnaireList.map((questionnaire, index) => (
                      <Option key={index} value={index}>
                        {questionnaire.questionnaireId} - {questionnaire.name} (
                        {questionnaire.criteria.length} criteria)
                      </Option>
                    ))}
                </Select>
              </FormItem>
            </Form>
          </Col>
          {this.state.selectedQuestionnaireIndex !== null && (
            <Col span={4}>
              <Popconfirm
                title="Delete?"
                onConfirm={() =>
                  this.handleDeleteQuestionnaire(
                    this.state.selectedQuestionnaireIndex
                  )
                }
              >
                <Button
                  type="danger"
                  size="default"
                  style={{ marginLeft: "8px", marginTop: "42px" }}
                  ghost
                >
                  Delete
                </Button>
              </Popconfirm>
            </Col>
          )}
        </Row>

        {selectedQuestionnaireIndex !== null && (
          <Row>
            <p>
              Instructions:{" "}
              {questionnaireList[selectedQuestionnaireIndex].instruction}
            </p>
          </Row>
        )}

        <hr />
        <Row style={{ marginTop: "2em", marginBottom: "1em" }}>
          <Col span={21}>
            <Title level={2}>Criteria</Title>
          </Col>
          <Col span={3}>
            {this.state.selectedQuestionnaireIndex !== null && (
              <PopUpModal
                title="Add Criteria"
                triggerButtonText="Add Criteria"
                confirmText="Add Criteria"
                onSubmit={this.handleAddCriteria}
              >
                <Form onSubmit={this.handleSubmit} className="signup-form">
                  <FormItem label="Select saved criteria">
                    <Select
                      size="large"
                      style={{ width: "100%" }}
                      placeholder="Please select a criteria"
                      defaultValue={[]}
                      onChange={value => this.handleCriteriaChange(value)}
                    >
                      {criteriaOptions}
                    </Select>
                  </FormItem>
                </Form>
                <Table
                  rowKey="id"
                  columns={criteriaColumns}
                  dataSource={
                    this.state &&
                    this.state.criteriaList[this.state.selectedCriteriaId] &&
                    this.state.criteriaList[this.state.selectedCriteriaId].polls
                  }
                  onChange={this.handleChange}
                />
              </PopUpModal>
            )}
          </Col>
        </Row>
        <Row>
          {selectedQuestionnaireIndex === null ? (
            <Table rowKey="id" columns={criteriaColumns} />
          ) : (
            selectedCriteriaList.map((criteria, index) => (
              <React.Fragment key={criteria.id}>
                <Row style={{ marginTop: "2em", marginBottom: "1em" }}>
                  <Col span={21}>
                    <Title level={3}>
                      {selectedQuestionnaireIndex !== null &&
                        questionnaireList[this.state.selectedQuestionnaireIndex]
                          .criteria !== undefined &&
                        `${criteria.name}`}

                      <Popconfirm
                        title="Remove?"
                        onConfirm={() =>
                          this.handleRemoveCriteria(criteria.id, index)
                        }
                      >
                        <Button
                          type="danger"
                          size="default"
                          style={{ marginLeft: "8px" }}
                          ghost
                        >
                          Remove
                        </Button>
                      </Popconfirm>
                    </Title>
                  </Col>
                </Row>
                <Table
                  rowKey="id"
                  columns={columns}
                  dataSource={
                    selectedQuestionnaireIndex !== null &&
                    criteria !== undefined &&
                    criteria.polls
                  }
                  onChange={this.handleChange}
                />
              </React.Fragment>
            ))
          )}
        </Row>
      </React.Fragment>
    );
  }

  // Validation Functions
  validateName = name => {
    if (name === "") {
      return {
        validateStatus: "error",
        errorMsg: `Name cannot be empty.`
      };
    } else {
      return {
        validateStatus: "success",
        errorMsg: null
      };
    }
  };
}

export default withRouter(Questionnaire);
