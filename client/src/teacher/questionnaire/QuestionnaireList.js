import React, { Component } from "react";
import { withRouter } from "react-router-dom";
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
  notification
} from "antd";
import "./QuestionnaireList.css";
import PopUpModal from "../../common/PopUpModal";
import { compareByAlph } from "../../util/Sorters";
import {
  createQuestionnaire,
  getCriteriaById,
  getAllQuestionnaires,
  getUserCreatedQuestionnaires
} from "../../util/APIUtils";
import { validateNotRequired, validateNotEmpty } from "../../util/Validators";

import { QUESTIONNAIRE_LIST_SIZE } from "../../constants";

const FormItem = Form.Item;
const { Option } = Select;
const { Title } = Typography;

const data = [
  {
    key: "1",
    question:
      "Employees need to be supervised closely, or they are not likely to do their work.",
    type: "Likert Scale"
  },
  {
    key: "2",
    question: "Employees want to be a part of the decision-making process.",
    type: "Likert Scale"
  },
  {
    key: "3",
    question:
      "In complex situations, leaders should let subordinates work problems out on their own.",
    type: "Likert Scale"
  },
  {
    key: "4",
    question:
      "It is fair to say that most employees in the general population are lazy.",
    type: "Likert Scale"
  },
  {
    key: "5",
    question:
      "Providing guidance without pressure is the key to being a good leader.",
    type: "Likert Scale"
  }
];

class Questionnaire extends Component {
  constructor(props) {
    super(props);
    this.state = {
      questionnaireList: [],
      selectedQuestionnaireId: 0,
      selectedCriteriaList: [],
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
    this.handleLoadMore = this.handleLoadMore.bind(this);
    // this.deleteCourseWithId = this.deleteCourseWithId.bind(this);

    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.isFormInvalid = this.isFormInvalid.bind(this);
  }

  loadCriteriaList(criteriaId, page = 0, size = QUESTIONNAIRE_LIST_SIZE) {
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
        console.log(response);
        const criteria = this.state.selectedCriteriaList.slice();
        this.setState({
          selectedCriteriaList: criteria.concat(response.polls),
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
    } else {
      promise = getAllQuestionnaires(page, size);
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
        console.log(questionnaires.concat(response.content));
      })
      .catch(error => {
        this.setState({
          isLoading: false
        });
      });
  }

  componentDidMount() {
    this.loadQuestionnaireList();
  }

  componentDidUpdate(nextProps) {
    if (this.props.isAuthenticated !== nextProps.isAuthenticated) {
      // Reset State
      this.setState({
        questionnaires: [],
        page: 0,
        size: 10,
        totalElements: 0,
        totalPages: 0,
        last: true,
        isLoading: false
      });
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
      selectedQuestionnaireId: value
    });
    this.state.questionnaireList[value].criteria.map(criteria => {
      console.log(criteria.id);
      this.loadCriteriaList(criteria.id);
    });
  }

  handleSubmit(event) {
    event.preventDefault();

    const createRequest = {
      name: this.state.name.value,
      instruction: this.state.instruction.value,
      user: this.state.currentUser
    };
    createQuestionnaire(createRequest)
      .then(response => {
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
      // {
      //   title: "Type",
      //   dataIndex: "type",
      //   key: "type",
      //   sorter: (a, b) => a.type - b.type,
      //   sortOrder: sortedInfo.columnKey === "type" && sortedInfo.order
      // },
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

    const criteriaColumns = [
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
        title: "Question",
        dataIndex: "question",
        key: "question",
        sorter: (a, b) => compareByAlph(a.question, b.question),
        sortOrder: sortedInfo.columnKey === "question" && sortedInfo.order
      },
      {
        title: "Type",
        dataIndex: "type",
        key: "type",
        sorter: (a, b) => a.type - b.type,
        sortOrder: sortedInfo.columnKey === "type" && sortedInfo.order
      }
    ];

    const criteria = [
      { id: 1, name: "Leadership", numQtns: 10 },
      { id: 2, name: "Skills", numQtns: 10 },
      { id: 3, name: "Teamwork", numQtns: 15 }
    ];

    const criteriaOptions = criteria.map((item, key) => (
      <Option key={item.id}>
        {item.name} ({item.numQtns})
      </Option>
    ));

    const {
      questionnaireList,
      selectedQuestionnaireId,
      selectedCriteriaList,
      page
    } = this.state;
    return (
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
              confirmText={false}
            >
              <Form onSubmit={this.handleSubmit} className="signup-form">
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
                <FormItem>
                  <Button
                    type="primary"
                    htmlType="submit"
                    size="large"
                    className="signup-form-button"
                    disabled={this.isFormInvalid()}
                  >
                    Create
                  </Button>
                </FormItem>
              </Form>
            </PopUpModal>
          </Col>
        </Row>
        <Row>
          <Col span={8}>
            <Form onSubmit={this.handleSubmit} className="signup-form">
              <FormItem label="Select saved questionnaire">
                <Select
                  name="selectedQuestionnaireId"
                  size="large"
                  style={{ width: "100%" }}
                  placeholder="Please select"
                  defaultValue={[]}
                  onChange={event => this.handleQuestionnaireChange(event)}
                >
                  {this.state &&
                    questionnaireList &&
                    questionnaireList.map((questionnaire, index) => (
                      <Option key={index}>
                        {questionnaire.name} ({questionnaire.criteria.length})
                      </Option>
                    ))}
                </Select>
              </FormItem>
            </Form>
          </Col>
        </Row>
        <hr />
        <Row style={{ marginTop: "2em", marginBottom: "1em" }}>
          <Col span={21}>
            <Title level={3}>
              Criteria
              {selectedQuestionnaireId !== 0 &&
                questionnaireList[this.state.selectedQuestionnaireId]
                  .criteria[0] !== undefined &&
                ` - ${
                  questionnaireList[this.state.selectedQuestionnaireId]
                    .criteria[0].name
                }`}
              <Button
                type="danger"
                size="default"
                style={{ marginLeft: "8px" }}
                ghost
              >
                Remove
              </Button>
            </Title>
          </Col>
          <Col span={3}>
            <PopUpModal
              title="Add Criteria"
              triggerButtonText="Add Criteria"
              confirmText="Add Criteria"
            >
              <Form onSubmit={this.handleSubmit} className="signup-form">
                <FormItem label="Select saved criteria">
                  <Select
                    size="large"
                    style={{ width: "100%" }}
                    placeholder="Please select"
                    defaultValue={[]}
                    onChange={event => this.handleQuestionnaireChange(event)}
                  >
                    {criteriaOptions}
                  </Select>
                </FormItem>
              </Form>
              <Table
                columns={criteriaColumns}
                dataSource={data}
                onChange={this.handleChange}
              />
            </PopUpModal>
          </Col>
        </Row>
        <Row>
          <Table
            columns={columns}
            // dataSource={
            //   selectedQuestionnaireId !== 0 &&
            //   questionnaireList[this.state.selectedQuestionnaireId]
            //     .criteria[0] !== undefined &&
            //   questionnaireList[this.state.selectedQuestionnaireId].criteria
            // }

            dataSource={
              selectedQuestionnaireId !== 0 &&
              selectedCriteriaList != undefined &&
              selectedCriteriaList
            }
            onChange={this.handleChange}
          />
        </Row>
        <Row>
          <Col span={20} />
          <Col span={2}>
            <Button type="primary" size="default" ghost>
              Export
            </Button>
          </Col>
          <Col span={2}>
            <Button type="primary" size="default">
              Save
            </Button>
          </Col>
        </Row>
      </React.Fragment>
    );
  }
}

export default withRouter(Questionnaire);
