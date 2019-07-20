import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { getQuestionnaireById, getSmartteamById } from "../util/APIUtils";
import QuestionnaireInstructions from "../common/questionnaire/QuestionnaireInstructions";
import Questionnaire from "../common/questionnaire/Questionnaire";

class StudentQuestionnaire extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showInstructions: true,
      isLoading: false
    };
    this.loadQuestionnaire = this.loadQuestionnaire.bind(this);
    this.toggleShowInstructions = this.toggleShowInstructions.bind(this);
  }

  componentDidMount() {
    this.loadQuestionnaire();
    this.loadSmartTeam();
  }

  toggleShowInstructions() {
    this.setState({
      showInstructions: !this.state.showInstructions
    });
  }

  loadQuestionnaire() {
    const { currentUser, match } = this.props;
    let promise;

    if (currentUser) {
      promise = getQuestionnaireById(match.params.id);
    }

    if (!promise) {
      return;
    }

    this.setState({
      isLoading: true
    });

    promise
      .then(response => {
        this.setState({
          questionnaire: response,
          isLoading: false
        });
      })
      .catch(error => {
        this.setState({
          isLoading: false
        });
      });
  }

  loadSmartTeam() {
    const { currentUser, match } = this.props;
    let promise;

    if (currentUser) {
      promise = getSmartteamById(match.params.smartTeamId);
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
        this.setState({
          smartteam: response,
          isLoading: false
        });
      })
      .catch(error => {
        this.setState({
          isLoading: false
        });
      });
  }

  render() {
    const { questionnaire, smartteam, showInstructions } = this.state;
    return (
      <React.Fragment>
        {showInstructions ? (
          <QuestionnaireInstructions
            questionnaire={questionnaire}
            smartteam={smartteam}
            buttonOnClick={this.toggleShowInstructions}
          />
        ) : (
          <Questionnaire
            questionnaire={questionnaire}
            isAuthenticated={this.props.isAuthenticated}
            currentUser={this.props.currentUser}
          />
        )}
      </React.Fragment>
    );
  }
}

export default withRouter(StudentQuestionnaire);
