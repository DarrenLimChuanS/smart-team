import React, { Component } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from "recharts";
import { Row, Col, Typography, Divider, Slider } from "antd";
import LoadingIndicator from "../../common/LoadingIndicator";
import { Card } from "antd";
import {
  getSectionById,
  getSmartteamById,
  getSmartteamOutcomeById
} from "../../util/APIUtils";
const { Title } = Typography;

class ViewSmartTeam extends Component {
  constructor(props) {
    super(props);
    this.state = {
      slider_value: 0,
      smartteam: [],
      outcome: [],
      isLoading: false
    };
    this.loadSmartteam = this.loadSmartteam.bind(this);
    this.loadSmartteamOutcome = this.loadSmartteamOutcome.bind(this);
    this.getCriteriaById = this.getCriteriaById.bind(this);
    this.mapResponseToCriteria = this.mapResponseToCriteria.bind(this);
  }

  loadSmartteam() {
    let promise;

    promise = getSmartteamById(this.props.match.params.id);

    if (!promise) {
      return;
    }

    this.setState({
      isLoading: true
    });

    promise
      .then(response => {
        this.setState({
          smartteam: response,
          isLoading: false
        });
        this.loadSmartteamOutcome();
      })
      .catch(error => {
        this.setState({
          isLoading: false
        });
      });
  }

  loadSmartteamOutcome() {
    let promise;

    promise = getSmartteamOutcomeById(this.props.match.params.id);

    if (!promise) {
      return;
    }

    this.setState({
      isLoading: true
    });

    promise
      .then(response => {
        this.setState({
          outcome: response,
          isLoading: false
        });
        this.mapResponseToCriteria();
      })
      .catch(error => {
        this.setState({
          isLoading: false
        });
      });
  }

  getCriteriaById(criteriaId) {
    let promise;

    promise = this.getCriteriaById(criteriaId, 1, 1);

    if (!promise) {
      return;
    }

    this.setState({
      isLoading: true
    });

    promise
      .then(response => {
        return response;
      })
      .catch(error => {
        this.setState({
          isLoading: false
        });
      });
  }

  mapResponseToCriteria() {
    this.setState({
      isLoading: true
    });
    const { outcome, smartteam } = this.state;
    var criteriaList = [];

    smartteam.questionnaire.criteria.forEach((criteria, index) => {
      outcome.forEach(entry => {
        var votes = [
          {
            outcome: "Q1",
            outcomeCount: "0"
          },
          {
            outcome: "Q2",
            outcomeCount: "0"
          },
          {
            outcome: "Q3",
            outcomeCount: "0"
          },
          {
            outcome: "Q4",
            outcomeCount: "0"
          }
        ];
        if (entry.criteriaId === criteria.id && entry.outcome !== undefined) {
          outcome.forEach(entry => {
            votes[parseInt(entry.outcome.slice(1, 2))] = entry;
          });
        }
        criteria = {
          criteriaName: criteria.name,
          votes: votes
        };
        if (criteria.criteriaName !== undefined) {
          criteriaList.push(criteria);
        }
      });
    });
    this.setState({
      criteria: criteriaList,
      isLoading: false
    });
  }

  componentDidMount() {
    this.loadSmartteam();
  }

  handleChange = slider_value => {
    this.setState({ slider_value });
  };

  render() {
    const { smartteam, outcome, criteria, isLoading } = this.state;
    console.log(outcome, smartteam, criteria);
    const { slider_value } = this.state;
    const marks = {
      0: "0",
      25: "1",
      50: "2",
      75: "3",
      100: "4"
    };
    return isLoading ? (
      <LoadingIndicator />
    ) : (
      <Typography>
        <Title>{smartteam.name}</Title>
        <Divider />
        <Row>
          <Col span={8} style={{ padding: "8px" }}>
            {criteria &&
              criteria.map(criterion => (
                <Card title={criterion.criteriaName}>
                  <ResponsiveContainer width="100%" height={200}>
                    <BarChart data={criterion.votes}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="outcome" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="outcomeCount" fill="#8884d8" />
                    </BarChart>
                  </ResponsiveContainer>
                  <Slider
                    marks={marks}
                    step={null}
                    onChange={this.handleChange}
                    slider_value={slider_value}
                  />
                </Card>
              ))}
          </Col>
        </Row>
      </Typography>
    );
  }
}

export default ViewSmartTeam;
