import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import {
  Button,
  Col,
  Divider,
  Form,
  Row,
  Select,
  Table,
  Typography
} from "antd";
import "./QuestionnaireList.css";
import { compareByAlph } from "../../util/Sorters";

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
    sortedInfo: null
  };

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

    const questionnaire = [
      { id: 1, name: "T01-2018-Q2", numQtns: 10 },
      { id: 2, name: "T02-2019-Q1", numQtns: 40 },
      { id: 3, name: "T05-2017-Q1", numQtns: 15 }
    ];

    const questionnaireOptions = questionnaire.map((item, key) => (
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
            <Button type="primary" size="default">
              Create
            </Button>
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
            <Button type="primary" size="default">
              Add Criteria
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

export default withRouter(Questionnaire);
