import React, { Component } from "react";
import {
  getSectionById,
  getUserCreatedQuestionnaires,
  getCurrentUser,
  createSmartTeam,
  populateSmartTeam
} from "../../util/APIUtils";
import { validateName } from "../../util/Validators";
import { SmartTeam } from "../../util/FeatureStates";
import {
  Form,
  Input,
  Button,
  Col,
  Select,
  Typography,
  notification
} from "antd";
const { Option } = Select;
const { Title } = Typography;
const FormItem = Form.Item;

class NewSmartTeam extends Component {
  constructor(props) {
    super(props);
    this.state = SmartTeam();
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleQuestionnaireChange = this.handleQuestionnaireChange.bind(this);
    this.handleQuestionnaireStartDayChange = this.handleQuestionnaireStartDayChange.bind(
      this
    );
    this.handleQuestionnaireStartHoursChange = this.handleQuestionnaireStartHoursChange.bind(
      this
    );
    this.handleQuestionnaireEndDayChange = this.handleQuestionnaireEndDayChange.bind(
      this
    );
    this.handleQuestionnaireEndHoursChange = this.handleQuestionnaireEndHoursChange.bind(
      this
    );
    this.handleSubmit = this.handleSubmit.bind(this);
    this.isFormInvalid = this.isFormInvalid.bind(this);
  }

  async componentDidMount() {
    if (this.props.match.params.id !== "new") {
      getSectionById(this.props.match.params.id).then(response => {
        this.setState({
          ...this.state,
          section: response
        });
      });
      getCurrentUser().then(response => {
        this.setState({
          ...this.state,
          currentUser: response
        });
        getUserCreatedQuestionnaires(response.username, 0, 50).then(
          response => {
            this.setState({
              questionnaireList: response.content,
              ...this.state
            });
          }
        );
      });
    }
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

  // Get the selected questionnaire from the questionnaire list
  handleQuestionnaireChange(questionnaireId) {
    this.setState({
      questionnaire: {
        value: this.state.questionnaireList[questionnaireId],
        validateStatus: "success"
      }
    });
  }

  /* Start Of Poll duration input changes */
  handleQuestionnaireStartDayChange(value) {
    const questionnaireStart = Object.assign(this.state.questionnaireStart, {
      days: parseInt(value, 10)
    });
    this.setState({
      questionnaireStart: questionnaireStart
    });
  }

  handleQuestionnaireStartHoursChange(value) {
    const questionnaireStart = Object.assign(this.state.questionnaireStart, {
      hours: parseInt(value, 10)
    });
    this.setState({
      questionnaireStart: questionnaireStart
    });
  }

  handleQuestionnaireEndDayChange(value) {
    const questionnaireEnd = Object.assign(this.state.questionnaireEnd, {
      days: parseInt(value, 10)
    });
    this.setState({
      questionnaireEnd: questionnaireEnd
    });
  }

  handleQuestionnaireEndHoursChange(value) {
    const questionnaireEnd = Object.assign(this.state.questionnaireEnd, {
      hours: parseInt(value, 10)
    });
    this.setState({
      questionnaireEnd: questionnaireEnd
    });
  }
  /* End Of Poll duration input changes */

  handleSubmit(event) {
    event.preventDefault();

    var startDate = new Date();
    startDate.setDate(startDate.getDate() + this.state.questionnaireStart.days);
    startDate.setHours(
      startDate.getHours() + this.state.questionnaireStart.hours
    );
    var cStartDate =
      startDate.getFullYear() +
      "-" +
      ("00" + (startDate.getMonth() + 1)).slice(-2) +
      "-" +
      ("00" + startDate.getDate()).slice(-2) +
      " " +
      ("00" + startDate.getHours()).slice(-2) +
      ":" +
      ("00" + startDate.getMinutes()).slice(-2) +
      ":" +
      ("00" + startDate.getSeconds()).slice(-2);
    var endDate = new Date(startDate.getTime());
    endDate.setDate(endDate.getDate() + this.state.questionnaireEnd.days);
    endDate.setHours(endDate.getHours() + this.state.questionnaireEnd.hours);
    var cEndDate =
      endDate.getFullYear() +
      "-" +
      ("00" + (endDate.getMonth() + 1)).slice(-2) +
      "-" +
      ("00" + endDate.getDate()).slice(-2) +
      " " +
      ("00" + endDate.getHours()).slice(-2) +
      ":" +
      ("00" + endDate.getMinutes()).slice(-2) +
      ":" +
      ("00" + endDate.getSeconds()).slice(-2);
    const smartteamRequest = {
      name: this.state.name.value,
      noOfTeams: this.state.noOfTeams.value,
      smartteamStartdate: cStartDate,
      smartteamEnddate: cEndDate,
      questionnaire: this.state.questionnaire.value,
      user: this.state.currentUser,
      section: this.state.section
    };
    createSmartTeam(smartteamRequest)
      .then(response => {
        populateSmartTeam(response.message);
        notification.success({
          message: "Smart Team",
          description:
            "Success! You have successfully initiated a new SmartTeam."
        });
        this.props.history.push("/section");
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
    return !(
      this.state.name.validateStatus === "success" &&
      this.state.questionnaire.validateStatus === "success"
    );
  }

  render() {
    const { name, questionnaireList, questionnaire } = this.state;
    return (
      <div className="signup-container">
        <Title level={2}>Initiate SmartTeam</Title>
        <div className="signup-content">
          <Form onSubmit={this.handleSubmit} className="signup-form">
            <FormItem
              label="Name"
              hasFeedback
              validateStatus={name.validateStatus}
              help={name.errorMsg}
            >
              <Input
                size="large"
                name="name"
                autoComplete="off"
                placeholder="Name"
                value={name.value}
                onChange={event => this.handleInputChange(event, validateName)}
              />
            </FormItem>
            <FormItem
              label="Questionnaire"
              hasFeedback
              validateStatus={questionnaire.validateStatus}
              help={questionnaire.errorMsg}
            >
              <Select
                name="questionnaire"
                size="large"
                style={{ width: "100%" }}
                placeholder="Please select a Questionnaire"
                onChange={value => this.handleQuestionnaireChange(value)}
              >
                {this.state &&
                  questionnaireList &&
                  questionnaireList.map((questionnaire, index) => (
                    <Option key={index}>
                      {questionnaire.questionnaireId} - {questionnaire.name}
                    </Option>
                  ))}
              </Select>
            </FormItem>
            <FormItem className="poll-form-row">
              <Col xs={24} sm={20}>
                SmartTeam Forming Length:
              </Col>
              <Col xs={24} sm={20}>
                <span style={{ marginRight: "18px" }}>
                  <Select
                    name="days"
                    defaultValue="1"
                    onChange={this.handleQuestionnaireStartDayChange}
                    value={this.state.questionnaireStart.days}
                    style={{ width: 60 }}
                  >
                    {Array.from(Array(8).keys()).map(i => (
                      <Option key={i}>{i}</Option>
                    ))}
                  </Select>{" "}
                  &nbsp;Days
                </span>
                <span>
                  <Select
                    name="hours"
                    defaultValue="0"
                    onChange={this.handleQuestionnaireStartHoursChange}
                    value={this.state.questionnaireStart.hours}
                    style={{ width: 60 }}
                  >
                    {Array.from(Array(24).keys()).map(i => (
                      <Option key={i}>{i}</Option>
                    ))}
                  </Select>{" "}
                  &nbsp;Hours
                </span>
              </Col>
            </FormItem>
            <FormItem className="poll-form-row">
              <Col xs={24} sm={20}>
                Formed SmartTeam Length:
              </Col>
              <Col xs={24} sm={20}>
                <span style={{ marginRight: "18px" }}>
                  <Select
                    name="days"
                    defaultValue="1"
                    onChange={this.handleQuestionnaireEndDayChange}
                    value={this.state.questionnaireEnd.days}
                    style={{ width: 60 }}
                  >
                    {Array.from(Array(8).keys()).map(i => (
                      <Option key={i}>{i}</Option>
                    ))}
                  </Select>{" "}
                  &nbsp;Days
                </span>
                <span>
                  <Select
                    name="hours"
                    defaultValue="0"
                    onChange={this.handleQuestionnaireEndHoursChange}
                    value={this.state.questionnaireEnd.hours}
                    style={{ width: 60 }}
                  >
                    {Array.from(Array(24).keys()).map(i => (
                      <Option key={i}>{i}</Option>
                    ))}
                  </Select>{" "}
                  &nbsp;Hours
                </span>
              </Col>
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
        </div>
      </div>
    );
  }
}

export default NewSmartTeam;
