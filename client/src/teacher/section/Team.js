import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { Row, Col, Typography, Divider } from "antd";
import { Card } from "antd";
const { Title } = Typography;

class Team extends Component {
  render() {
    const { teams, smartteam } = this.props;

    return (
      <React.Fragment>
        <Title>
          {smartteam.name} <small>Teams</small>
        </Title>
        <Divider />
        <Row>
          {teams.map((team, index) => (
            <Col span={8} style={{ padding: "8px" }}>
              <Card title={`Team ${index + 1} (${team.users.length})`}>
                <p>
                  <b>Compliance Score: </b>
                  {team.complianceScore}%
                </p>
                {team.users.map(user => (
                  <div>
                    <span>{user.name}</span>
                    <div style={{ float: "right" }}>
                      <a href="/">Change Team</a>
                    </div>
                  </div>
                ))}
              </Card>
            </Col>
          ))}
        </Row>
      </React.Fragment>
    );
  }
}

export default withRouter(Team);
