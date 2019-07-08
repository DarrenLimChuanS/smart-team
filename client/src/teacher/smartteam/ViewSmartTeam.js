import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import {
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts";
import { Row, Col, Typography, Divider, Slider, Icon, Button } from "antd";
import { Card } from "antd";
import { getSectionById } from "../../util/APIUtils";
const { Title } = Typography;

class ViewSmartTeam extends Component {
  constructor(props) {
    super(props);
    this.state = {
      slider_value: 0,
      sections: [],
      isLoading: false
    };
    this.loadSectionList = this.loadSectionList.bind(this);
  }

  loadSectionList() {
    let promise;

    promise = getSectionById(this.props.match.params.id);

    if (!promise) {
      return;
    }

    this.setState({
      isLoading: true
    });

    promise
      .then(response => {
        const sections = this.state.sections.slice();
        this.setState({
          sections: sections.concat(response),
          isLoading: false
        });
      })
      .catch(error => {
        this.setState({
          isLoading: false
        });
      });
  }

  componentDidMount() {
    this.loadSectionList();
  }

  handleChange = slider_value => {
    this.setState({ slider_value });
  };

  render() {
    const { sections } = this.state;
    console.log(sections);
    const { slider_value } = this.state;
    const marks = {
      0: "0",
      25: "1",
      50: "2",
      75: "3",
      100: "4"
    };
    const data = [
      {
        name: "Q1",
        uv: 400,
        pv: 240,
        amt: 240
      },
      {
        name: "Q2",
        uv: 300,
        pv: 139,
        amt: 221
      },
      {
        name: "Q3",
        uv: 200,
        pv: 980,
        amt: 220
      },
      {
        name: "Q4",
        uv: 278,
        pv: 390,
        amt: 200
      }
    ];
    return (
      <Typography>
        <Title>IRAT Team Formation for T1</Title>
        <Divider />
        <Row>
          {this.state &&
            sections &&
            sections.map(section =>
              section.smartteams.map(smartteam =>
                smartteam.questionnaire.criteria.map(criterion => (
                  <Col span={8} style={{ padding: "8px" }}>
                    <Card title={criterion.name}>
                      <ResponsiveContainer width="100%" height={200}>
                        <BarChart data={data}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis />
                          <Tooltip />
                          <Bar dataKey="pv" fill="#8884d8" />
                        </BarChart>
                      </ResponsiveContainer>
                      <Slider
                        marks={marks}
                        step={null}
                        onChange={this.handleChange}
                        slider_value={slider_value}
                      />
                    </Card>
                  </Col>
                ))
              )
            )}
        </Row>
      </Typography>
    );
  }
}

export default ViewSmartTeam;
