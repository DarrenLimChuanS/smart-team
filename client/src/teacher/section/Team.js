import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import { Row, Col, Typography, Divider, Button } from "antd";
import { Card } from "antd";
const { Title } = Typography;

class Team extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Typography>
        <Title>
          ICT1002 - T2 <small>Teams</small>
        </Title>
        <Divider />
        <Row>
          <Col span={8} style={{ padding: "8px" }}>
            <Card title="Team 1 (6)">
              <p>Stats</p>
              <div>
                <span>David Woo</span>
                <div style={{ float: "right" }}>
                  <a href="/">Change Team</a>
                </div>
              </div>
              <div>
                <span>David Woo</span>
                <div style={{ float: "right" }}>
                  <a href="/">Change Team</a>
                </div>
              </div>
              <div>
                <span>David Woo</span>
                <div style={{ float: "right" }}>
                  <a href="/">Change Team</a>
                </div>
              </div>
            </Card>
          </Col>
        </Row>
      </Typography>
    );
  }
}

export default withRouter(Team);
