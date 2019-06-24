import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import { Row, Col, Typography, Divider, Button } from "antd";
import { Card } from "antd";
import { getStudentCourses } from "../util/APIUtils";
const { Title } = Typography;

class Courses extends Component {
  constructor(props) {
    super(props);
    this.state = {
      courses: [],
      isLoading: false
    };
    this.loadCourseList = this.loadCourseList.bind(this);
  }

  loadCourseList() {
    let promise;

    if (this.props.currentUser) {
      promise = getStudentCourses(this.props.currentUser.username);
    }

    if (!promise) {
      return;
    }

    this.setState({
      isLoading: true
    });

    promise
      .then(response => {
        const courses = this.state.courses.slice();
        console.log("Hello");
        console.log(response);
        this.setState({
          courses: courses.concat(response.courses),
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
    this.loadCourseList();
  }

  render() {
    const { courses } = this.state;
    return (
      <Typography>
        <Title>Courses</Title>
        <Divider />
        <Row>
          {this.state &&
            courses &&
            courses.map(course => (
              <Col span={8}>
                <Card
                  title={course.name}
                  extra={
                    <Link to="/courses/questionnaires_student">
                      <li>View Sections</li>
                    </Link>
                  }
                >
                  <p>{course.description}</p>
                  <div style={{ textAlign: "center" }}>
                    <Link to="/courses/questionnaires_student">
                      <Button type="primary" size="large">
                        Attempt Questionnaire
                      </Button>
                    </Link>

                    <div style={{ marginTop: "8px" }}>
                      <Link to="/courses/questionnaires_student">
                        <Button type="primary" size="large">
                          View Grouping
                        </Button>
                      </Link>
                    </div>
                  </div>
                </Card>
              </Col>
            ))}
        </Row>
      </Typography>
    );
  }
}

export default withRouter(Courses);
