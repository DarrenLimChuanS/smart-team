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
    this.handlePollStartDaysChange = this.handlePollStartDaysChange.bind(this);
    this.handlePollStartHoursChange = this.handlePollStartHoursChange.bind(
      this
    );
    this.handlePollEndDaysChange = this.handlePollEndDaysChange.bind(this);
    this.handlePollEndHoursChange = this.handlePollEndHoursChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.isFormInvalid = this.isFormInvalid.bind(this);
  }

  async componentDidMount() {
    if (this.props.match.params.id !== "new") {
      getSectionById(this.props.match.params.id).then(response => {
        this.setState({
          section: response
        });
      });
    }
    getCurrentUser().then(response => {
      this.setState({
        currentUser: response,
        ...this.state
      });
      getUserCreatedQuestionnaires(response.username, 0, 50).then(response => {
        this.setState({
          questionnaireList: response.content,
          ...this.state
        });
      });
    });
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
        value: this.state.questionnaireList[questionnaireId]
      }
    });
  }

  handlePollStartDaysChange(value) {
    const pollStart = Object.assign(this.state.pollStart, {
      days: parseInt(value, 10)
    });
    this.setState({
      pollStart: pollStart
    });
  }

  handlePollStartHoursChange(value) {
    const pollStart = Object.assign(this.state.pollStart, {
      hours: parseInt(value, 10)
    });
    this.setState({
      pollStart: pollStart
    });
  }

  handlePollEndDaysChange(value) {
    const pollEnd = Object.assign(this.state.pollEnd, {
      days: parseInt(value, 10)
    });
    this.setState({
      pollEnd: pollEnd
    });
  }

  handlePollEndHoursChange(value) {
    const pollEnd = Object.assign(this.state.pollEnd, {
      hours: parseInt(value, 10)
    });
    this.setState({
      pollEnd: pollEnd
    });
  }

  handleSubmit(event) {
    event.preventDefault();

    var startDate = new Date();
    startDate.setDate(startDate.getDate() + this.state.pollStart.days);
    startDate.setHours(startDate.getHours() + this.state.pollStart.hours);
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
    endDate.setDate(endDate.getDate() + this.state.pollEnd.days);
    endDate.setHours(endDate.getHours() + this.state.pollEnd.hours);
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
      noOfTeams: "5",
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
    return !(this.state.name.validateStatus === "success");
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
                    onChange={this.handlePollStartDaysChange}
                    value={this.state.pollStart.days}
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
                    onChange={this.handlePollStartHoursChange}
                    value={this.state.pollStart.hours}
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
                    onChange={this.handlePollEndDaysChange}
                    value={this.state.pollEnd.days}
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
                    onChange={this.handlePollEndHoursChange}
                    value={this.state.pollEnd.hours}
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
