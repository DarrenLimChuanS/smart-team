import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import { Form, InputNumber, Row, Col, Typography, Divider, Button } from "antd";
import { Card } from "antd";
import { validateNumber, validateGroup } from "../../util/Validators";
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
      }
    };
  }

  handleTeamSizeInputChange(value, validationFun) {
    const noOfStudents = Number(this.state.sectionData.noOfStudents);
    const noOfTeams = Math.floor(noOfStudents / value);
    this.setState({
      teamSize: {
        value: value,
        ...validationFun(
          value,
          2,
          Math.floor(noOfStudents / 2),
          noOfStudents,
          value,
          noOfTeams
        )
      },
      noOfTeams: {
        value: noOfTeams,
        ...validationFun(noOfTeams)
      }
    });
  }

  handleNoOfTeamsInputChange(value, validationFun) {
    const noOfStudents = Number(this.state.sectionData.noOfStudents);
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

  render() {
    const gridStyle = {
      width: "25%",
      textAlign: "center"
    };
    const { teamSize, noOfTeams, sectionData } = this.state;
    return (
      <Typography>
        <Title>Self-Grouping</Title>
        <Divider />
        <Row />
        <Row>
          <Card title="Section Information">
            <Card.Grid style={gridStyle}>
              <b>Name</b>
              <br />
              {sectionData.name}
            </Card.Grid>
            <Card.Grid style={gridStyle}>
              <b>No. of Students</b>
              <br />
              {sectionData.noOfStudents}
            </Card.Grid>
            <Card.Grid style={gridStyle}>
              <b>Module</b>
              <br />
              {sectionData.module}
            </Card.Grid>
            <Card.Grid style={gridStyle}>
              <b>Year</b>
              <br />
              {sectionData.year}
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
                  min={2}
                  max={Math.floor(sectionData.noOfStudents / 2)}
                  type="number"
                  size="large"
                  name="teamSize"
                  autoComplete="off"
                  placeholder="Team Size"
                  initialValue={2}
                  value={teamSize.value}
                  onChange={event =>
                    this.handleTeamSizeInputChange(event, validateGroup)
                  }
                />
                <span className="ant-form-text">people</span>

                {this.state.sectionData.noOfStudents %
                  this.state.teamSize.value !==
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
                  min="2"
                  max={Math.floor(sectionData.noOfStudents / 2)}
                  type="number"
                  size="large"
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
                // disabled={this.isFormInvalid()}
              >
                Generate Team
              </Button>
            </FormItem>
          </Form>
        </Row>
      </Typography>
    );
  }
}

export default withRouter(NewAutoTeam);
