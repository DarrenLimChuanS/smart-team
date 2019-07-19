import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { Form, InputNumber, Row, Col, Typography, Divider, Button } from "antd";
import { Card, notification } from "antd";
import { validateGroup } from "../../util/Validators";
import { getSectionById, smartTeamAllocation } from "../../util/APIUtils";
import LoadingIndicator from "../../common/LoadingIndicator";
import Team from "./Team";
const { Title } = Typography;
const FormItem = Form.Item;

class NewAutoTeam extends Component {
  constructor(props) {
    super(props);
    this.state = {
      sectionData: {
        name: "Tri3-2009",
        noOfStudents: "35",
        module: "ICT1001",
        year: 2009
      },
      teamSize: {
        value: 0
      },
      noOfTeams: {
        value: 2
      },
      showTeam: false,
      isLoading: true
    };
    this.isFormInvalid = this.isFormInvalid.bind(this);
  }

  handleTeamSizeInputChange(value, noOfStudents, validationFun) {
    const noOfTeams = Math.floor(noOfStudents / value);
    this.setState({
      teamSize: {
        value: value,
        ...validationFun(value, 1, noOfStudents, noOfStudents, value, noOfTeams)
      },
      noOfTeams: {
        value: noOfTeams,
        ...validationFun(noOfTeams)
      }
    });
  }

  handleNoOfTeamsInputChange(value, noOfStudents, validationFun) {
    const teamSize = Math.floor(noOfStudents / value);
    this.setState({
      teamSize: {
        value: teamSize,
        ...validationFun(teamSize)
      },
      noOfTeams: {
        value: value,
        ...validationFun(
          teamSize,
          1,
          noOfStudents,
          noOfStudents,
          teamSize,
          value
        )
      }
    });
  }

  async componentDidMount() {
    getSectionById(this.props.match.params.sectionId).then(response => {
      this.handleTeamSizeInputChange(1, response.noOfStudents, validateGroup);
      this.setState({
        section: response,
        isLoading: false
      });
    });
  }

  isFormInvalid() {
    return !(
      this.state.teamSize.validateStatus === "success" &&
      this.state.noOfTeams.validateStatus === "success"
    );
  }

  handleGenerateTeam() {
    this.setState({
      isLoading: true
    });
    const { noOfTeams, section } = this.state;
    const { smartteam } = this.props;
    let teamList = {};
    let countTeam = 0;
    let teamData = [];
    for (let i = 0; i < noOfTeams.value; i++) {
      teamList[i] = [];
    }
    section.users.forEach((user, index) => {
      if (countTeam < parseInt(noOfTeams.value, 10)) {
        teamList[countTeam] = [...teamList[countTeam], user];
        countTeam++;
        if (countTeam === noOfTeams.value) {
          countTeam = 0;
        }
      }
    });

    Object.keys(teamList).forEach((key, index) => {
      const teamObject = {
        section: section,
        users: teamList[key],
        smartteam: smartteam
      };
      teamData[index] = teamObject;
    });
    const smartTeamRequest = {
      team: teamData,
      criteriaCompliances: this.props.criteria
    };
    smartTeamAllocation(smartTeamRequest)
      .then(response => {
        this.setState({
          teams: response,
          isLoading: false,
          showTeam: true
        });
        notification.success({
          message: "Smart Team",
          description: "Success! You have successfully generated the teams."
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
    const gridStyle = {
      width: "25%",
      textAlign: "center"
    };
    const {
      teamSize,
      noOfTeams,
      section,
      isLoading,
      teams,
      showTeam
    } = this.state;
    const { criteria, smartteam } = this.props;
    return isLoading ? (
      <LoadingIndicator />
    ) : !showTeam ? (
      <React.Fragment>
        <Title>
          {smartteam.name} <small>Smart Team Allocation</small>
        </Title>
        <Divider />
        <Row />
        <Row>
          <Card title="Section Information">
            <Card.Grid style={gridStyle}>
              <b>Name</b>
              <br />
              {section.name}
            </Card.Grid>
            <Card.Grid style={gridStyle}>
              <b>No. of Students</b>
              <br />
              {section.noOfStudents}
            </Card.Grid>
            <Card.Grid style={gridStyle}>
              <b>Module</b>
              <br />
              {section.courseName}
            </Card.Grid>
            <Card.Grid style={gridStyle}>
              <b>Year</b>
              <br />
              {section.year}
            </Card.Grid>
          </Card>
        </Row>
        <Row style={{ marginTop: "32px" }}>
          <b>Please select the team size or number of teams.</b>
        </Row>
        <Row gutter={16}>
          <Form onSubmit={this.handleSubmit} className="signup-form">
            <Col span={11}>
              <FormItem
                label="Team Size"
                validateStatus={teamSize.validateStatus}
                help={teamSize.errorMsg}
              >
                <InputNumber
                  size="large"
                  min={1}
                  max={section.noOfStudents}
                  type="number"
                  name="teamSize"
                  autoComplete="off"
                  placeholder="Team Size"
                  value={teamSize.value}
                  onChange={event =>
                    this.handleTeamSizeInputChange(
                      event,
                      this.state.section.noOfStudents,
                      validateGroup
                    )
                  }
                />
                <span className="ant-form-text">people</span>
              </FormItem>
            </Col>
            <Col span={2} style={{ verticalAlign: "middle" }}>
              OR
            </Col>
            <Col span={11}>
              <FormItem
                label="Number of Teams"
                validateStatus={noOfTeams.validateStatus}
                help={noOfTeams.errorMsg}
              >
                <InputNumber
                  size="large"
                  min={1}
                  max={section.noOfStudents}
                  type="number"
                  name="noOfTeams"
                  autoComplete="off"
                  placeholder="No. of Teams"
                  value={noOfTeams.value}
                  onChange={event =>
                    this.handleNoOfTeamsInputChange(
                      event,
                      this.state.section.noOfStudents,
                      validateGroup
                    )
                  }
                />
                <span className="ant-form-text">teams</span>
              </FormItem>
            </Col>
            <FormItem>
              <Button
                type="primary"
                htmlType="submit"
                size="large"
                className="signup-form-button"
                disabled={this.isFormInvalid()}
                onClick={() => this.handleGenerateTeam()}
              >
                Generate Team
              </Button>
            </FormItem>
          </Form>
        </Row>
      </React.Fragment>
    ) : (
      <Team teams={teams} smartteam={smartteam} criteria={criteria} />
    );
  }
}

export default withRouter(NewAutoTeam);
