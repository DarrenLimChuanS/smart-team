import React, { Component } from "react";
import { Link } from "react-router-dom";
import {
  signup,
  getUserCreatedCourses,
  getUserCreatedStudents,
  createSection,
  getCurrentUser
} from "../../util/APIUtils";

import { Form, Input, Button, notification, Select, Typography } from "antd";
const { Option } = Select;
const { Title } = Typography;
const FormItem = Form.Item;

class NewSection extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: {
        value: ""
      },
      students: {
        value: {}
      },
      course: {
        value: {}
      },
      year: {
        value: ""
      }
    };
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleStudentChange = this.handleStudentChange.bind(this);
    this.handleCourseChange = this.handleCourseChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.isFormInvalid = this.isFormInvalid.bind(this);
  }

  async componentDidMount() {
    getCurrentUser().then(response => {
      this.setState({
        currentUser: response,
        ...this.state
      });
      getUserCreatedCourses(response.username, 0, 50).then(response => {
        this.setState({
          courseList: response.content,
          ...this.state
        });
      });
      getUserCreatedStudents(response.id).then(response => {
        this.setState({
          studentList: response,
          ...this.state
        });
      });
    });
  }

  handleInputChange(event, validationFun) {
    const target = event.target;
    const inputName = target.name;
    const inputValue = target.value;

    this.setState({
      [inputName]: {
        value: inputValue,
        ...validationFun(inputValue)
      }
    });
  }

  handleStudentChange(studentIndex) {
    const studentIds = studentIndex.map(
      studentId => this.state.studentList[studentId]
    );
    this.setState({
      students: {
        value: studentIds
      }
    });
  }

  handleCourseChange(courseId) {
    this.setState({
      course: {
        value: this.state.courseList[courseId]
      }
    });
  }

  handleSubmit(event) {
    event.preventDefault();

    const sectionRequest = {
      name: this.state.name.value,
      noOfStudents: this.state.students.value.length,
      year: this.state.year.value,
      status: "Not Grouped",
      course: this.state.course.value,
      students: this.state.students.value
    };

    createSection(sectionRequest)
      .then(response => {
        notification.success({
          message: "Smart Team",
          description: "Success! You have successfully added a new student."
        });
        this.props.history.push("/section");
      })
      .catch(error => {
        notification.error({
          message: "Smart Team",
          description:
            error.message || "Sorry! Something went wrong. Please try again!"
        });
      });
  }

  isFormInvalid() {
    return !(
      this.state.name.validateStatus === "success" &&
      this.state.year.validateStatus === "success"
    );
  }

  render() {
    const { courseList, studentList } = this.state;
    return (
      <div className="signup-container">
        <Title level={2}>Create Section</Title>
        <div className="signup-content">
          <Form onSubmit={this.handleSubmit} className="signup-form">
            <FormItem
              label="Name"
              hasFeedback
              validateStatus={this.state.name.validateStatus}
              help={this.state.name.errorMsg}
            >
              <Input
                size="large"
                name="name"
                autoComplete="off"
                placeholder="Name"
                value={this.state.name.value}
                onChange={event =>
                  this.handleInputChange(event, this.validateName)
                }
              />
            </FormItem>
            <FormItem
              label="Students"
              hasFeedback
              validateStatus={this.state.students.validateStatus}
              help={this.state.students.errorMsg}
            >
              <Select
                size="large"
                mode="multiple"
                style={{ width: "100%" }}
                placeholder="Please select a student"
                onChange={value => this.handleStudentChange(value)}
              >
                {this.state &&
                  studentList &&
                  studentList.map((student, index) => (
                    <Option key={index}>
                      {student.id} - {student.name}
                    </Option>
                  ))}
              </Select>
            </FormItem>
            <FormItem
              label="Course"
              hasFeedback
              validateStatus={this.state.course.validateStatus}
              help={this.state.course.errorMsg}
            >
              <Select
                name="course"
                size="large"
                placeHolder="Please select a course"
                style={{ width: "32%" }}
                onChange={value => this.handleCourseChange(value)}
              >
                {this.state &&
                  courseList &&
                  courseList.map((course, index) => (
                    <Option key={index}>{course.name}</Option>
                  ))}
              </Select>
            </FormItem>
            <FormItem
              label="Year"
              hasFeedback
              validateStatus={this.state.year.validateStatus}
              help={this.state.year.errorMsg}
            >
              <Input
                size="large"
                name="year"
                type="number"
                autoComplete="off"
                placeholder="Year"
                value={this.state.year.value}
                onChange={event =>
                  this.handleInputChange(event, this.validateYear)
                }
              />
            </FormItem>
            <FormItem>
              <Button
                type="primary"
                htmlType="submit"
                size="large"
                className="signup-form-button"
                disabled={this.isFormInvalid()}
              >
                Create
              </Button>
            </FormItem>
          </Form>
        </div>
      </div>
    );
  }

  // Validation Functions
  validateName = name => {
    if (name === "") {
      return {
        validateStatus: "error",
        errorMsg: `Name cannot be empty.`
      };
    } else {
      return {
        validateStatus: "success",
        errorMsg: null
      };
    }
  };

  validateYear = year => {
    if (year === "") {
      return {
        validateStatus: "error",
        errorMsg: `Year cannot be empty.`
      };
    } else if (year < 0) {
      return {
        validateStatus: "error",
        errorMsg: `Year cannot be less than 0.`
      };
    } else {
      return {
        validateStatus: "success",
        errorMsg: null
      };
    }
  };
}

export default NewSection;
