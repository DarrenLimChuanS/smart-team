import React, { Component } from "react";
import { createCriteria } from "../../util/APIUtils";
import {
  MAX_CHOICES,
  POLL_QUESTION_MAX_LENGTH,
  POLL_CHOICE_MAX_LENGTH
} from "../../constants";
import "./NewCriteria.css";
import { validateNotEmpty, validateNotRequired } from "../../util/Validators";
import {
  Typography,
  Form,
  Input,
  Button,
  Icon,
  Select,
  Col,
  notification
} from "antd";
const Option = Select.Option;
const FormItem = Form.Item;
const { TextArea } = Input;
const { Title } = Typography;
class NewCriteria extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: {
        text: ""
      },
      description: {
        text: ""
      },
      type: {
        text: "qwer1234"
      },
      graded: {
        value: 0
      },
      questions: [
        {
          question: {
            text: ""
          },
          choices: [
            {
              text: ""
            },
            {
              text: ""
            },
            {
              text: ""
            },
            {
              text: ""
            }
          ]
        }
      ]
    };
    this.addChoice = this.addChoice.bind(this);
    this.removeQuestion = this.removeQuestion.bind(this);
    this.addQuestion = this.addQuestion.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleQuestionChange = this.handleQuestionChange.bind(this);
    this.handleChoiceChange = this.handleChoiceChange.bind(this);
    this.isFormInvalid = this.isFormInvalid.bind(this);
  }

  addChoice = (questionIndex, event) => {
    const choices = this.state.questions[questionIndex].choices.slice();
    this.setState({
      questions: [
        {
          choices: choices.concat([
            {
              text: ""
            }
          ])
        }
      ]
    });
  };

  removeQuestion(questionIndex) {
    const questions = this.state.questions.slice();
    this.setState({
      questions: [
        ...questions.slice(0, questionIndex),
        ...questions.slice(questionIndex + 1)
      ]
    });
  }

  addQuestion(event) {
    const questions = this.state.questions.slice();
    this.setState({
      questions: questions.concat({
        question: {
          text: ""
        },
        choices: [
          {
            text: ""
          },
          {
            text: ""
          },
          {
            text: ""
          },
          {
            text: ""
          }
        ]
      })
    });
  }

  handleSubmit(event) {
    event.preventDefault();
    let structuredQtns = [];
    this.state.questions.map(question => {
      // let choices = [];
      // question.choices.map(choice => {
      //   choices = choices.concat({
      //     text:
      //   });
      // });
      question = {
        question: question.question.text,
        choices: question.choices
      };
      structuredQtns = structuredQtns.concat(question);
    });
    const criteriaData = {
      name: this.state.name.text,
      description: this.state.description.text,
      type: this.state.type.text,
      graded: this.state.graded.value == 1 ? true : false,
      polls: structuredQtns
    };
    console.log(criteriaData);

    createCriteria(criteriaData)
      .then(response => {
        notification.success({
          message: "Smart Team",
          description: "Success! You have successfully added a new criteria."
        });
        this.props.history.push("/criteria");
      })
      .catch(error => {
        notification.error({
          message: "Smart Team",
          description:
            error.message || "Sorry! Something went wrong. Please try again!"
        });
      });
  }

  validateQuestion = questionText => {
    if (questionText.length === 0) {
      return {
        validateStatus: "error",
        errorMsg: "Please enter your question!"
      };
    } else if (questionText.length > POLL_QUESTION_MAX_LENGTH) {
      return {
        validateStatus: "error",
        errorMsg: `Question is too long (Maximum ${POLL_QUESTION_MAX_LENGTH} characters allowed)`
      };
    } else {
      return {
        validateStatus: "success",
        errorMsg: null
      };
    }
  };

  handleQuestionChange(event, qtnIndex) {
    const questions = this.state.questions.slice();
    const value = event.target.value;
    // console.log(questions);
    // console.log(qtnIndex);
    questions[qtnIndex] = {
      question: {
        text: value,
        ...this.validateQuestion(value)
      },
      choices: questions[qtnIndex].choices
    };

    this.setState({
      questions: questions
    });
  }

  validateChoice = choiceText => {
    if (choiceText.length === 0) {
      return {
        validateStatus: "error",
        errorMsg: "Please enter a choice!"
      };
    } else if (choiceText.length > POLL_CHOICE_MAX_LENGTH) {
      return {
        validateStatus: "error",
        errorMsg: `Choice is too long (Maximum ${POLL_CHOICE_MAX_LENGTH} characters allowed)`
      };
    } else {
      return {
        validateStatus: "success",
        errorMsg: null
      };
    }
  };

  handleChoiceChange(event, qtnIndex, choiceIndex) {
    const questions = this.state.questions.slice();
    const value = event.target.value;
    questions[qtnIndex].choices[choiceIndex] = {
      text: value,
      ...this.validateChoice(value)
    };

    this.setState({
      questions: questions
    });

    console.log(this.state);
  }

  isFormInvalid() {
    this.state.questions.map(question => {
      if (question.question.validateStatus !== "success") {
        return true;
      }

      for (let i = 0; i < question.choices.length; i++) {
        const choice = question.choices[i];
        if (choice.validateStatus !== "success") {
          return true;
        }
      }
    });
  }

  handleInputChange(event, validationFun) {
    const target = event.target;
    const inputName = target.name;
    const inputValue = target.value;

    this.setState({
      [inputName]: {
        text: inputValue,
        ...validationFun(inputValue, target.placeholder)
      }
    });
  }

  handleGradedChange(value) {
    this.setState({
      ...this.state,
      graded: {
        value: value
      }
    });
  }

  render() {
    const { graded, name, description } = this.state;
    return (
      <div className="new-poll-container">
        <Title level={2}>Create a Criteria</Title>
        <div className="new-poll-content">
          <Form onSubmit={this.handleSubmit} className="create-poll-form">
            <FormItem
              label="Graded"
              hasFeedback
              validateStatus={graded.validateStatus}
              help={graded.errorMsg}
            >
              <Select
                size="large"
                style={{ width: "100%" }}
                placeholder="Please select"
                onChange={value => this.handleGradedChange(value)}
              >
                <Option key={0}>No</Option>
                <Option key={1}>Yes</Option>
              </Select>
            </FormItem>
            <FormItem
              hasFeedback
              validateStatus={name.validateStatus}
              help={name.errorMsg}
              className="poll-form-row"
            >
              <Input
                placeholder="Enter criteria name"
                style={{ fontSize: "16px" }}
                name="name"
                autoComplete="off"
                value={name.text}
                onChange={event =>
                  this.handleInputChange(event, validateNotEmpty)
                }
              />
            </FormItem>
            <FormItem
              hasFeedback
              validateStatus={description.validateStatus}
              help={description.errorMsg}
              className="poll-form-row"
            >
              <TextArea
                placeholder="Enter criteria description"
                style={{ fontSize: "16px" }}
                autosize={{ minRows: 3, maxRows: 6 }}
                name="description"
                value={description.text}
                onChange={event =>
                  this.handleInputChange(event, validateNotEmpty)
                }
              />
            </FormItem>
            {this.state.questions.map((question, index) => (
              <React.Fragment>
                <h1 className="page-title">
                  Question {index + 1}.{" "}
                  {index > 0 ? (
                    <Button
                      size="small"
                      type="danger"
                      onClick={() => this.removeQuestion(index)}
                    >
                      Remove
                    </Button>
                  ) : null}
                </h1>
                <FormItem
                  hasFeedback
                  validateStatus={question.validateStatus}
                  help={question.errorMsg}
                  className="poll-form-row"
                >
                  <TextArea
                    placeholder="Enter your question"
                    style={{ fontSize: "16px" }}
                    autosize={{ minRows: 3, maxRows: 6 }}
                    name="question"
                    value={question.question.text}
                    onChange={event => this.handleQuestionChange(event, index)}
                  />
                </FormItem>
                {question.choices.map((choice, choiceIndex) => (
                  <PollChoice
                    key={choiceIndex}
                    choice={choice}
                    choiceNumber={choiceIndex}
                    handleChoiceChange={event =>
                      this.handleChoiceChange(event, index, choiceIndex)
                    }
                  />
                ))}
              </React.Fragment>
            ))}
            <FormItem className="poll-form-row">
              <Button type="dashed" onClick={this.addQuestion}>
                <Icon type="plus" /> Add a question
              </Button>
            </FormItem>
            <FormItem className="poll-form-row">
              <Button
                type="primary"
                htmlType="submit"
                size="large"
                disabled={this.isFormInvalid()}
                className="create-poll-form-button"
              >
                Create Criteria
              </Button>
            </FormItem>
          </Form>
        </div>
      </div>
    );
  }
}

function PollChoice(props) {
  return (
    <FormItem
      hasFeedback
      validateStatus={props.choice.validateStatus}
      help={props.choice.errorMsg}
      className="poll-form-row"
    >
      <Input
        placeholder={"Choice " + (props.choiceNumber + 1)}
        size="large"
        value={props.choice.text}
        onChange={props.handleChoiceChange}
      />
    </FormItem>
  );
}

export default NewCriteria;
