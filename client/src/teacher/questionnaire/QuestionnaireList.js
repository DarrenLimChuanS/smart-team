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
import { signup } from "../../util/APIUtils";

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
  state = {
    filteredInfo: null,
    sortedInfo: null,
    name: {
      value: ""
    }
  };

  constructor(props) {
    super(props);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.isFormInvalid = this.isFormInvalid.bind(this);
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
    console.log("Various parameters", pagination, filters, sorter);
    this.setState({
      filteredInfo: filters,
      sortedInfo: sorter
    });
  };

  handleQuestionnaireChange(value) {
    this.setState({
      questionnaire: {
        value: value
      }
    });
  }

  handleSubmit(event) {
    event.preventDefault();

    const createRequest = {
      name: this.state.name.value
    };
    signup(createRequest)
      .then(response => {
        notification.success({
          message: "Smart Team",
          description: "Success! You have successfully added a new course."
        });
        this.props.history.push("/login");
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

    const questionnaire = [
      { id: 1, name: "T01-2018-Q2", numQtns: 10 },
      { id: 2, name: "T02-2019-Q1", numQtns: 40 },
      { id: 3, name: "T05-2017-Q1", numQtns: 15 }
    ];

    const criteria = [
      { id: 1, name: "Leadership", numQtns: 10 },
      { id: 2, name: "Skills", numQtns: 10 },
      { id: 3, name: "Teamwork", numQtns: 15 }
    ];

    const questionnaireOptions = questionnaire.map((item, key) => (
      <Option key={item.id}>
        {item.name} ({item.numQtns})
      </Option>
    ));

    const criteriaOptions = criteria.map((item, key) => (
      <Option key={item.id}>
        {item.name} ({item.numQtns})
      </Option>
    ));

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
                      this.handleInputChange(event, this.validateName)
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
                  size="large"
                  style={{ width: "100%" }}
                  placeholder="Please select"
                  defaultValue={[]}
                  onChange={event => this.handleQuestionnaireChange(event)}
                >
                  {questionnaireOptions}
                </Select>
              </FormItem>
            </Form>
          </Col>
        </Row>
        <hr />
        <Row style={{ marginTop: "2em", marginBottom: "1em" }}>
          <Col span={21}>
            <Title level={3}>
              Criteria - Leadership{" "}
              <Button type="danger" size="default" ghost>
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
            dataSource={data}
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
