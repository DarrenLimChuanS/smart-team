import React from "react";
import DocumentTitle from "react-document-title";
import { Row, Typography, Divider, Button } from "antd";
import { Card } from "antd";
const { Title } = Typography;

const QuestionnaireInstructions = props => (
  <Card>
    <DocumentTitle
      title={`Smart Team - Questionnaire | ${props &&
        props.questionnaire &&
        props.questionnaire.name}`}
    />
    <Title>{props && props.questionnaire && props.questionnaire.name}</Title>
    <Divider />
    <Row style={{ minHeight: "300px" }}>
      <p>
        <b>Created by: </b>
        {props && props.questionnaire && props.questionnaire.createdBy.name}
      </p>
      <p>
        <b>Ends on: </b>
        {props && props.smartteam && props.smartteam.smartteamEnddate}
      </p>
      <p>
        <b>Instructions: </b>
        {props && props.questionnaire && props.questionnaire.instruction}
      </p>
    </Row>
    <Row style={{ textAlign: "center" }}>
      <Button type="primary" size="large" onClick={props.buttonOnClick}>
        Start Questionnaire
      </Button>
    </Row>
  </Card>
);

export default QuestionnaireInstructions;
