import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import LoadingIndicator from "../common/LoadingIndicator";
import { Button, Icon, notification, Row, Card, Col, Typography, } from "antd";
import "./Dashboard.css";


const { Title } = Typography;
const { Meta } = Card;

class Dashboard extends Component {
  render() {
    return (
      <React.Fragment>
          <Row>
            <Col span={18}>
              <Title level={2}>Criteria Bank</Title>
            </Col>
            <Col span={2}>
              <Button color="primary">Export</Button>
            </Col>
            <Col span={2}>
              <Button color="primary">Import</Button>
            </Col>
            <Col span={2}>
              <Button color="primary">Create</Button>
            </Col>
          </Row>


          


        <Row>
          <Col span={6}>
            <Card
              hoverable
              style={{ width: 240 }}
              cover={
                <img
                  style={{ height: 120 }}
                  alt="example"
                  src="https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png"
                />
              }
            >
              <Meta title="ICT2109-Project1" />
            </Card>
          </Col>
          <Col span={6}>
            <Card
              hoverable
              style={{ width: 240 }}
              cover={
                <img
                  style={{ height: 120 }}
                  alt="example"
                  src="https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png"
                />
              }
            >
              <Meta title="ICT2109-Project1" />
            </Card>
          </Col>
          <Col span={6}>
            <Card
              hoverable
              style={{ width: 240 }}
              cover={
                <img
                  style={{ height: 120 }}
                  alt="example"
                  src="https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png"
                />
              }
            >
              <Meta title="ICT2109-Project1" />
            </Card>
          </Col>
          <Col span={6}>
            <Card
              hoverable
              style={{ width: 240 }}
              cover={
                <img
                  style={{ height: 120 }}
                  alt="example"
                  src="https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png"
                />
              }
            >
              <Meta title="ICT2109-Project1" />
            </Card>
          </Col>
        </Row>
        <Row className="view-all-button">
          <Button block>View All</Button>
        </Row>
        <Row className="section-title">
          <Title level={2}>Ongoing Questionnaire</Title>
        </Row>
        <Row>
          <Col span={6}>
            <Card
              hoverable
              style={{ width: 240 }}
              cover={
                <img
                  style={{ height: 120 }}
                  alt="example"
                  src="https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png"
                />
              }
            >
              <Meta title="ICT2109-Project1" />
            </Card>
          </Col>
          <Col span={6}>
            <Card
              hoverable
              style={{ width: 240 }}
              cover={
                <img
                  style={{ height: 120 }}
                  alt="example"
                  src="https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png"
                />
              }
            >
              <Meta title="ICT2109-Project1" />
            </Card>
          </Col>
          <Col span={6}>
            <Card
              hoverable
              style={{ width: 240 }}
              cover={
                <img
                  style={{ height: 120 }}
                  alt="example"
                  src="https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png"
                />
              }
            >
              <Meta title="ICT2109-Project1" />
            </Card>
          </Col>
          <Col span={6}>
            <Card
              hoverable
              style={{ width: 240 }}
              cover={
                <img
                  style={{ height: 120 }}
                  alt="example"
                  src="https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png"
                />
              }
            >
              <Meta title="ICT2109-Project1" />
            </Card>
          </Col>
        </Row>

        <Row className="view-all-button">
          <Button block>View All</Button>
        </Row>
        <Button block>View Some</Button>
      </React.Fragment>
    );
  }
}

export default withRouter(Dashboard);
