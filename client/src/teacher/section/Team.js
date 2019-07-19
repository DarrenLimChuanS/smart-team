import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import {
  Row,
  Col,
  Typography,
  Divider,
  Button,
  Select,
  notification
} from "antd";
import { Card } from "antd";
import PopUpModal from "../../common/PopUpModal";
import {
  createSmartTeam,
  getComplianceScore,
  createTeamList
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
      isLoading: false
    };
    this.handleTeamChange = this.handleTeamChange.bind(this);
    this.submitTeamChange = this.submitTeamChange.bind(this);
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
    // TODO Prepare TeamListRequest to pass in function
    createTeamList(this.state.teams)
      .then(response => {
        this.setState({
          teams: response
        });

        notification.success({
          message: "Smart Team",
          description: "Success! You have successfully created the teams."
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

  render() {
    const { teams, smartteam, criteria, selectedTeam, isLoading } = this.state;

    return isLoading ? (
      <LoadingIndicator />
    ) : (
      <React.Fragment>
        <Title>
          {smartteam.name} <small>Teams</small>
        </Title>
        <Divider />
        <Row>
          {teams.map((team, teamIndex) => (
            <Col span={8} style={{ padding: "8px" }}>
              <Card title={`Team ${teamIndex + 1} (${team.users.length})`}>
                <p>
                  <b>Compliance Score: </b>
                  {team.complianceScore < 0
                    ? (-team.complianceScore / (criteria.length * 2)) * 100
                    : (team.complianceScore / criteria.length) * 100}
                  %
                </p>
                {team.users.map((user, userIndex) => (
                  <div>
                    <span>{user.name}</span>
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
                  </div>
                ))}
              </Card>
            </Col>
          ))}
        </Row>
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
      </React.Fragment>
    );
  }
}

export default withRouter(Team);
