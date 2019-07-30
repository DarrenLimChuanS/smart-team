import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import DocumentTitle from "react-document-title";
import {
  Row,
  Col,
  Typography,
  Divider,
  Button,
  Select,
  notification,
  Progress
} from "antd";
import { Card } from "antd";
import PopUpModal from "../../common/PopUpModal";
import {
  getCurrentUser,
  getComplianceScore,
  createTeamList,
  getTeamList,
  getSmartteamById
} from "../../util/APIUtils";
import LoadingIndicator from "../../common/LoadingIndicator";
const Option = Select.Option;
const { Title } = Typography;

class Team extends Component {
  constructor(props) {
    super(props);
    this.state = {
      criteria: props.criteria,
      teams: props.teams,
      smartteam: props.smartteam,
      selectedTeam: 1,
      isLoading: true
    };
    this.handleTeamChange = this.handleTeamChange.bind(this);
    this.submitTeamChange = this.submitTeamChange.bind(this);
  }

  async componentDidMount() {
    getCurrentUser().then(response => {
      this.setState({
        currentUser: response,
        ...this.state
      });
    });
    if (this.props.match.params.team === "team") {
      getTeamList(this.props.match.params.id).then(response => {
        this.setState({
          teams: response
        });

        getSmartteamById(this.props.match.params.id).then(response => {
          this.setState({
            smartteam: response,
            isLoading: false
          });
        });
      });
    } else {
      this.calcMinDiversityScore();
      this.calcMaxDiversityScore();
      this.setState({
        isLoading: false
      });
    }
  }

  calcMinDiversityScore() {
    let scores = [];
    this.state.criteria.forEach(criteria => {
      if (criteria.diversityScale < 0) {
        scores.push(criteria.diversityScale * 1);
      } else if (criteria.diversityScale > 0) {
        scores.push(
          (1 / this.state.teams[0].users.length) * criteria.diversityScale
        );
      }
    });
    const minDiversityScore = scores.reduce((a, b) => a + b, 0);
    this.setState({
      minDiversityScore
    });
  }

  calcMaxDiversityScore() {
    let scores = [];
    this.state.criteria.forEach(criteria => {
      if (criteria.diversityScale < 0) {
        scores.push(
          (1 / this.state.teams[0].users.length) * criteria.diversityScale
        );
      } else if (criteria.diversityScale > 0) {
        scores.push(criteria.diversityScale * 1);
      } else {
        return;
      }
    });
    const maxDiversityScore = scores.reduce((a, b) => a + b, 0);
    this.setState({
      maxDiversityScore
    });
  }

  handleTeamChange(value) {
    this.setState({
      selectedTeam: value
    });
  }
  submitTeamChange(teamIndex, userIndex) {
    const { teams, selectedTeam, criteria } = this.state;
    const moveUser = teams[teamIndex].users[userIndex];
    let currentTeams = teams;
    currentTeams[teamIndex].users.splice(userIndex, 1);
    currentTeams[selectedTeam - 1].users.push(moveUser);
    if (currentTeams[teamIndex].users.length <= 0) {
      currentTeams.splice(teamIndex, 1);
    }

    this.setState({
      isLoading: true
    });

    const newTeamComplianceRequest = {
      team: currentTeams[selectedTeam - 1],
      criteriaCompliances: criteria
    };

    getComplianceScore(newTeamComplianceRequest)
      .then(response => {
        currentTeams[selectedTeam - 1].complianceScore = response;
      })
      .catch(error => {
        notification.error({
          message: "Smart Team",
          description:
            error.message || "Sorry! Something went wrong. Please try again!"
        });
      });

    const currentTeamComplianceRequest = {
      team: currentTeams[teamIndex],
      criteriaCompliances: criteria
    };

    getComplianceScore(currentTeamComplianceRequest)
      .then(response => {
        currentTeams[teamIndex].complianceScore = response;
        this.setState({
          teams: currentTeams,
          isLoading: false
        });
      })
      .catch(error => {
        notification.error({
          message: "Smart Team",
          description:
            error.message || "Sorry! Something went wrong. Please try again!"
        });
        this.setState({
          teams: currentTeams,
          isLoading: false
        });
      });
  }

  handleConfirmTeam() {
    const createTeamRequest = {
      team: this.state.teams
    };
    createTeamList(createTeamRequest)
      .then(response => {
        this.setState({
          teams: response
        });

        notification.success({
          message: "Smart Team",
          description: "Success! You have successfully created the teams."
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

  render() {
    const { teams, smartteam, selectedTeam, isLoading } = this.state;

    const calcCompliancePerc = teamComplianceScore => {
      const { maxDiversityScore, minDiversityScore } = this.state;
      const calcCompliance =
        (teamComplianceScore - minDiversityScore) /
        (maxDiversityScore - minDiversityScore);
      return parseInt(calcCompliance * 100, 10);
    };

    return (
      <React.Fragment>
        <DocumentTitle
          title={`Smart Team - ${this.state &&
            smartteam &&
            smartteam.name} Teams`}
        />
        {isLoading ? (
          <LoadingIndicator />
        ) : (
          <React.Fragment>
            <Title>
              {smartteam.name} <small>Teams</small>
            </Title>
            <Divider />
            <Row type="flex">
              {teams.map((team, teamIndex) => (
                <Col span={8} key={teamIndex} style={{ padding: "8px" }}>
                  <Card title={`Team ${teamIndex + 1} (${team.users.length})`}>
                    {this.props.match.params.team !== "team" && (
                      <span>
                        <b>Compliance Score: </b>
                        <Progress
                          type="circle"
                          percent={calcCompliancePerc(team.complianceScore)}
                          width={30}
                        />
                      </span>
                    )}
                    {team.users.map((user, userIndex) => (
                      <div key={userIndex}>
                        <span>{user.name}</span>
                        {team.teamId == null && (
                          <div style={{ float: "right" }}>
                            <PopUpModal
                              link
                              triggerButtonText="Change Team"
                              triggerButtonSize="small"
                              title="Change Team"
                              onSubmit={() =>
                                this.submitTeamChange(teamIndex, userIndex)
                              }
                              confirmText="Change"
                            >
                              {"Team: "}
                              <Select
                                name="team"
                                defaultValue={teamIndex + 1}
                                onChange={this.handleTeamChange}
                                value={selectedTeam}
                                style={{ width: 60 }}
                              >
                                {teams.map((team, selectedTeamIndex) => (
                                  <Option
                                    key={selectedTeamIndex}
                                    value={selectedTeamIndex + 1}
                                  >
                                    {selectedTeamIndex + 1}
                                  </Option>
                                ))}
                              </Select>
                            </PopUpModal>
                          </div>
                        )}
                      </div>
                    ))}
                  </Card>
                </Col>
              ))}
            </Row>
            {teams[0].teamId == null && (
              <Row>
                <Button
                  type="primary"
                  size="large"
                  className="signup-form-button"
                  onClick={() => this.handleConfirmTeam()}
                >
                  Confirm Team
                </Button>
              </Row>
            )}
          </React.Fragment>
        )}
      </React.Fragment>
    );
  }
}

export default withRouter(Team);
