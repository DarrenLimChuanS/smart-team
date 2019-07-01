import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import Question from "./Question";
import { castVote, updateChoices } from "../../util/APIUtils";
import LoadingIndicator from "../../common/LoadingIndicator";
import { Divider, Typography, notification, Icon, Steps, Button } from "antd";
import { withRouter } from "react-router-dom";
import "./Questionnaire.css";
import PopUpModal from "../PopUpModal";

const { Step } = Steps;
const { Title } = Typography;

class Questionnaire extends Component {
  constructor(props) {
    super(props);
    this.state = {
      questionnaire: this.props.questionnaire,
      criteriaSteps: [],
      page: this.props.questionnaire.criteria.length - 1,
      size: 10,
      totalElements: 0,
      totalPages: 0,
      last: true,
      currentPage: 0,
      currentVotes: [],
      isLoading: false,
      redirect: false
    };
    this.handleLoadMore = this.handleLoadMore.bind(this);
  }

  componentDidMount() {
    let criteriaSteps = this.state.criteriaSteps.slice();
    this.props.questionnaire.criteria.forEach(criterion => {
      const newStep = {
        title: criterion.name,
        content: criterion.name
      };
      criteriaSteps = criteriaSteps.concat(newStep);
    });

    this.setState({
      criteriaSteps: criteriaSteps
    });
  }

  handleLoadMore(noOfPages) {
    this.setState({ currentPage: this.state.currentPage + noOfPages });
  }

  handleChoiceChange(event, poll, pollIndex) {
    const currentVotes = this.state.currentVotes.slice();
    currentVotes[poll.id] = event.target.value;

    this.setState({
      currentVotes: currentVotes
    });
  }

  handleSaveSubmit(event, criteriaId, pollId) {
    event.preventDefault();
    if (!this.props.isAuthenticated) {
      this.props.history.push("/login");
      notification.info({
        message: "Smart Team",
        description: "Please login to vote."
      });
      return;
    }
    const selectedChoice = this.state.currentVotes[pollId];

    const choiceData = {
      choiceId: Number(selectedChoice),
      criteriaId: Number(criteriaId),
      userId: this.props.currentUser.id,
      smartteamId: Number(this.props.match.params.smartTeamId),
      pollId: Number(pollId)
    };

    updateChoices(choiceData)
      .then(response => {
        notification.success({
          message: "Smart Team",
          description: "Success! You have successfully submitted a question."
        });
      })
      .catch(error => {
        if (error.status === 401) {
          this.props.handleLogout(
            "/login",
            "error",
            "You have been logged out. Please login to vote"
          );
        } else {
          notification.error({
            message: "Smart Team",
            description:
              error.message || "Sorry! Something went wrong. Please try again!"
          });
        }
      });
  }

  setRedirect = () => {
    this.setState({
      redirect: true
    });
  };
  renderRedirect = () => {
    if (this.state.redirect) {
      notification.success({
        message: "Smart Team",
        description: "Success! You have successfully completed the survey."
      });
      return <Redirect to="/courses" />;
    }
  };

  render() {
    const {
      criteriaSteps,
      questionnaire,
      isLoading,
      currentVotes,
      currentPage,
      page
    } = this.state;

    let questionId = 0;

    return (
      <React.Fragment>
        {this.renderRedirect()}
        <Title level={1} style={{ textAlign: "center" }}>
          {questionnaire.name}
        </Title>
        <Divider />
        <Steps current={currentPage}>
          {criteriaSteps.map(criterion => (
            <Step key={criterion.title} title={criterion.title} />
          ))}
        </Steps>
        <Divider />
        <div className="polls-container">
          <Title level={2}>{questionnaire.criteria[currentPage].name}</Title>
          <p>{questionnaire.criteria[currentPage].description}</p>
          {questionnaire.criteria[currentPage].polls.map((poll, pollIndex) => (
            <Question
              key={poll.id}
              poll={poll}
              pollIndex={++questionId}
              currentVote={currentVotes[poll.id]}
              handleChoiceChange={event =>
                this.handleChoiceChange(event, poll, pollIndex)
              }
              handleSaveSubmit={event =>
                this.handleSaveSubmit(
                  event,
                  questionnaire.criteria[currentPage].id,
                  poll.id
                )
              }
            />
          ))}
          {!isLoading && questionnaire.criteria.length === 0 ? (
            <div className="no-polls-found">
              <span>No questions found.</span>
            </div>
          ) : null}
          {!isLoading && currentPage < page ? (
            <div className="load-more-polls">
              <Button
                type="default"
                onClick={() => this.handleLoadMore(-1)}
                disabled={isLoading || currentPage === 0}
                style={{ float: "left" }}
              >
                <Icon type="left" /> Back
              </Button>
              <Button
                type="default"
                onClick={() => this.handleLoadMore(1)}
                disabled={isLoading}
                style={{ float: "right" }}
              >
                Next <Icon type="right" />
              </Button>
            </div>
          ) : (
            <div className="load-more-polls">
              <Button
                type="default"
                onClick={() => this.handleLoadMore(-1)}
                disabled={isLoading || currentPage === 0}
                style={{ float: "left" }}
              >
                <Icon type="left" /> Back
              </Button>
              <PopUpModal
                title="Complete Confirmation"
                triggerButtonType="default"
                triggerButtonText="Finish"
                submitButtonType="primary"
                confirmText="Confirm"
                style={{ float: "right" }}
                onSubmit={this.setRedirect}
              >
                Are you sure you want to end the questionnaire? <br />
                You will not be able to amend the survey after confirming.
              </PopUpModal>
            </div>
          )}
          {isLoading ? <LoadingIndicator /> : null}
        </div>
      </React.Fragment>
    );
  }
}

export default withRouter(Questionnaire);
