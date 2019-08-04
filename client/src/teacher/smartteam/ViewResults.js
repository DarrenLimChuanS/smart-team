import { Row, Col, Typography, Divider, Slider, Icon, Button } from "antd";
import { Card, Tag } from "antd";
import DocumentTitle from "react-document-title";
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
import LoadingIndicator from "../../common/LoadingIndicator";
import {
  getSectionById,
  getSmartteamById,
  getSmartteamOutcomeById
} from "../../util/APIUtils";
import NewAutoTeam from "../section/NewAutoTeam";
const { Title } = Typography;

class ViewResults extends Component {
  constructor(props) {
    super(props);
    this.state = {
      slider_value: 0,
      smartteam: [],
      outcome: [],
      section: [],
      isLoading: false,
      showResult: true
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
      isLoading: true
    });

    promise
      .then(response => {
        this.setState({
          smartteam: response,
          isLoading: false
        });
        this.loadSection();
      })
      .catch(error => {
        this.setState({
          isLoading: false
        });
      });
  }

  loadSection() {
    let promise;

    promise = getSectionById(this.props.match.params.sectionId);

    if (!promise) {
      return;
    }

    this.setState({
      isLoading: true
    });

    promise
      .then(response => {
        this.setState({
          section: response,
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

    promise = getSmartteamOutcomeById(this.props.match.params.smartteamId);

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
    var criteriaResponseCount = [];
    var minResponseCount = 0;

    // Foreach criteria in questionnaire
    smartteam.questionnaire.criteria.forEach(criteria => {
      var responseCount = 0;
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
      outcome.forEach(entry => {
        if (entry.criteriaId === criteria.id && entry.outcome !== null) {
          responseCount += entry.outcomeCount;
          const index = entry.outcome.slice(1, 2);
          votes[parseInt(index, 10) - 1] = entry;
        }
      });
      const criteriaInfo = {
        criteriaId: criteria.id,
        criteriaName: criteria.name,
        graded: criteria.graded,
        diversityScale: 0,
        votes: votes
      };
      criteriaList.push(criteriaInfo);
      criteriaResponseCount.push(responseCount);
    });
    criteriaResponseCount.forEach(responseCount => {
      if (responseCount === 0) {
        this.setState({
          formIsInvalid: true
        });
      }
    });
    minResponseCount = Math.min(...criteriaResponseCount);
    this.setState({
      criteria: criteriaList,
      minResponseCount: minResponseCount,
      isLoading: false
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
      diversityScale: this.getDiversity(value)
    };
    this.setState({
      criteria
    });
  };

  handleNext() {
    this.setState({
      showResult: false
    });
  }

  render() {
    const gridStyle = {
      width: "25%",
      textAlign: "center"
    };
    const resultGridStyle = {
      width: "33.3%",
      textAlign: "center"
    };
    const {
      smartteam,
      criteria,
      isLoading,
      showResult,
      formIsInvalid,
      section,
      minResponseCount
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
        )
      },
      25: "-1",
      50: {
        label: (
          <span>
            0 <br />
            (Exclude)
          </span>
        )
      },
      75: "1",
      100: {
        label: (
          <span>
            2 <br />
            (Diverse)
          </span>
        )
      }
    };

    return (
      <React.Fragment>
        <DocumentTitle title={`Smart Team - ${smartteam.name} | Results`} />
        {isLoading ? (
          <LoadingIndicator />
        ) : showResult ? (
          <React.Fragment>
            <Title>{smartteam.name}</Title>
            <Divider />
            <Row>
              <Card title="SmartTeam Information">
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
              <Card>
                <Card.Grid style={resultGridStyle}>
                  <b>SmartTeam Session End Date</b>
                  <br />
                  {smartteam.smartteamStartdate}
                </Card.Grid>
                <Card.Grid style={resultGridStyle}>
                  <b>Formed SmartTeam End Date</b>
                  <br />
                  {smartteam.smartteamEnddate}
                </Card.Grid>
                <Card.Grid style={resultGridStyle}>
                  <b>Responses</b>
                  <br />
                  {minResponseCount}/{section.noOfStudents}
                </Card.Grid>
              </Card>
            </Row>
            <Row type="flex">
              {criteria &&
                criteria.map((criterion, index) => (
                  <Col key={index} span={8} style={{ padding: "8px" }}>
                    <Card
                      title={criterion.criteriaName}
                      style={{ padding: "16px" }}
                      extra={
                        criterion.graded ? (
                          <Tag color="green">Graded</Tag>
                        ) : (
                          <Tag color="blue">Non-Graded</Tag>
                        )
                      }
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
        )}
      </React.Fragment>
    );
  }
}

export default ViewResults;
