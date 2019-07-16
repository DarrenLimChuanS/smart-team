import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { Form, InputNumber, Row, Col, Typography, Divider, Button } from "antd";
import { Card } from "antd";
import { validateNumber, validateGroup } from "../../util/Validators";
import { getSectionById } from "../../util/APIUtils";
import LoadingIndicator from "../../common/LoadingIndicator";
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

  handleNoOfTeamsInputChange(value, validationFun) {
    const noOfStudents = Number(this.state.section.noOfStudents);
    const teamSize = Math.floor(noOfStudents / value);
    this.setState({
      teamSize: {
        value: teamSize,
        ...validationFun(teamSize)
      },
      noOfTeams: {
        value: value,
        ...validationFun(value)
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

  render() {
    const gridStyle = {
      width: "25%",
      textAlign: "center"
    };
    const { teamSize, noOfTeams, section, isLoading } = this.state;
    const { criteria, smartteam } = this.props;
    return isLoading ? (
      <LoadingIndicator />
    ) : (
      <React.Fragment>
        <Title>Smart Team Allocation</Title>
        <Divider />
        <Row />
        <Row>
          <Card title="Section Information">
            <Card.Grid style={gridStyle}>
              <b>Name</b>
              <br />
              {console.log(section)}
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
                  initialValue={2}
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

                {this.state.section.noOfStudents % this.state.teamSize.value !==
                  0 && (
                  <div>
                    Note: Teams of {this.state.teamSize.value} and{" "}
                    {this.state.teamSize.value + 1} people.
                  </div>
                )}
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
                  defaultValue="2"
                  value={noOfTeams.value}
                  onChange={event =>
                    this.handleNoOfTeamsInputChange(event, validateNumber)
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
              >
                Generate Team
              </Button>
            </FormItem>
          </Form>
        </Row>
      </React.Fragment>
    );
  }
}

export default withRouter(NewAutoTeam);
