import { Row, Col, Typography, Divider, Slider, Icon, Button } from "antd";
import { Card } from "antd";
import React, { Component } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import LoadingIndicator from "../../common/LoadingIndicator";
import { getSmartteamById, getSmartteamOutcomeById } from "../../util/APIUtils";
import NewAutoTeam from "../section/NewAutoTeam";
const { Title } = Typography;

class ViewResults extends Component {
  constructor(props) {
    super(props);
    this.state = {
      slider_value: 0,
      smartteam: [],
      outcome: [],
      isLoading: false,
      showResult: true,
    };
    this.loadSmartteam = this.loadSmartteam.bind(this);
    this.loadSmartteamOutcome = this.loadSmartteamOutcome.bind(this);
    this.getCriteriaById = this.getCriteriaById.bind(this);
    this.mapResponseToCriteria = this.mapResponseToCriteria.bind(this);
  }

  loadSmartteam() {
    let promise;

    promise = getSmartteamById(this.props.match.params.smartteamId);

    if (!promise) {
      return;
    }

    this.setState({
      isLoading: true,
    });

    promise
      .then(response => {
        this.setState({
          smartteam: response,
          isLoading: false,
        });
        this.loadSmartteamOutcome();
      })
      .catch(error => {
        this.setState({
          isLoading: false,
        });
      });
  }

  loadSmartteamOutcome() {
    let promise;

    promise = getSmartteamOutcomeById(this.props.match.params.smartteamId);

    if (!promise) {
      return;
    }

    this.setState({
      isLoading: true,
    });

    promise
      .then(response => {
        this.setState({
          outcome: response,
          isLoading: false,
        });
        this.mapResponseToCriteria();
      })
      .catch(error => {
        this.setState({
          isLoading: false,
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
      isLoading: true,
    });

    promise
      .then(response => {
        return response;
      })
      .catch(error => {
        this.setState({
          isLoading: false,
        });
      });
  }

  mapResponseToCriteria() {
    this.setState({
      isLoading: true,
    });
    const { outcome, smartteam } = this.state;
    var criteriaList = [];
    var criteriaResponseCount = [];
    // Foreach criteria in questionnaire
    smartteam.questionnaire.criteria.forEach(criteria => {
      var responseCount = 0;
      var votes = [
        {
          outcome: "Q1",
          outcomeCount: "0",
        },
        {
          outcome: "Q2",
          outcomeCount: "0",
        },
        {
          outcome: "Q3",
          outcomeCount: "0",
        },
        {
          outcome: "Q4",
          outcomeCount: "0",
        },
      ];
      outcome.forEach(entry => {
        if (entry.criteriaId === criteria.id && entry.outcome !== null) {
          responseCount++;
          const index = entry.outcome.slice(1, 2);
          votes[parseInt(index, 10) - 1] = entry;
        }
      });
      const criteriaInfo = {
        criteriaId: criteria.id,
        criteriaName: criteria.name,
        diversityScale: 0,
        votes: votes,
      };
      criteriaList.push(criteriaInfo);
      criteriaResponseCount.push(responseCount);
    });
    criteriaResponseCount.forEach(responseCount => {
      if (responseCount === 0) {
        this.setState({
          formIsInvalid: true,
        });
      }
    });
    this.setState({
      criteria: criteriaList,
      isLoading: false,
    });
  }

  componentDidMount() {
    this.loadSmartteam();
  }

  getDiversity(value) {
    switch (value) {
      case 0:
        return -2;
      case 25:
        return -1;
      case 50:
        return 0;
      case 75:
        return 1;
      case 100:
        return 2;
      default:
        return 0;
    }
  }

  handleChange = (value, index) => {
    const criteria = this.state.criteria;
    criteria[index] = {
      ...this.state.criteria[index],
      diversityScale: this.getDiversity(value),
    };
    this.setState({
      criteria,
    });
  };

  handleNext() {
    this.setState({
      showResult: false,
    });
  }

  render() {
    const {
      smartteam,
      criteria,
      isLoading,
      showResult,
      formIsInvalid,
    } = this.state;
    const { slider_value } = this.state;
    const marks = {
      0: {
        label: (
          <span>
            -2
            <br />
            (Similar)
          </span>
        ),
      },
      25: "-1",
      50: {
        label: (
          <span>
            0 <br />
            (Exclude)
          </span>
        ),
      },
      75: "1",
      100: {
        label: (
          <span>
            2 <br />
            (Diverse)
          </span>
        ),
      },
    };

    return isLoading ? (
      <LoadingIndicator />
    ) : showResult ? (
      <React.Fragment>
        <Title>{smartteam.name}</Title>
        <Divider />
        <Row type="flex">
          {criteria &&
            criteria.map((criterion, index) => (
              <Col key={index} span={8} style={{ padding: "8px" }}>
                <Card
                  title={criterion.criteriaName}
                  style={{ padding: "16px" }}
                >
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
                    defaultValue={50}
                    onChange={value => this.handleChange(value, index)}
                    slider_value={slider_value}
                  />
                </Card>
              </Col>
            ))}
        </Row>
        <Row style={{ marginTop: "16px" }}>
          <Button
            type="default"
            onClick={() => this.handleNext()}
            disabled={formIsInvalid}
            style={{ float: "right" }}
          >
            Configure Team <Icon type="right" />
          </Button>
        </Row>
      </React.Fragment>
    ) : (
      <NewAutoTeam criteria={criteria} smartteam={smartteam} />
    );
  }
}

export default ViewResults;
