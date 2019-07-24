import React, { Component } from "react";
import DocumentTitle from "react-document-title";
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
        this.setState({
          courses: courses.concat(response),
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
      <React.Fragment>
        <DocumentTitle title="Smart Team - Courses" />
        <Title>Courses</Title>
        <Divider />
        <Row type="flex">
          {this.state &&
            courses &&
            courses.map(course => (
              <Col span={8} style={{ padding: "8px" }}>
                <Card title={course.courseName}>
                  <p>{course.courseDescription}</p>
                  <div style={{ textAlign: "center" }}>
                    {course.section &&
                      course.section.smartteams &&
                      course.section.status === "Teaming" && (
                        <Link
                          to={
                            "/allocation/" +
                            course.section.smartteams[0].smartteamId +
                            "/questionnaire/" +
                            course.section.smartteams[0].questionnaire
                              .questionnaireId
                          }
                        >
                          <Button type="primary" size="large">
                            Attempt Questionnaire
                          </Button>
                        </Link>
                      )}

                    {course.section &&
                      course.section.smartteams &&
                      course.section.status === "Teamed" && (
                        <div style={{ marginTop: "8px" }}>
                          <Link
                            to={
                              "/smartteam/" +
                              course.section.smartteams[0].smartteamId +
                              "/team"
                            }
                          >
                            <Button type="primary" size="large">
                              View Team
                            </Button>
                          </Link>
                        </div>
                      )}
                  </div>
                </Card>
              </Col>
            ))}
        </Row>
      </React.Fragment>
    );
  }
}

export default withRouter(Courses);
