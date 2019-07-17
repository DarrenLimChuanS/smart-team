import React, { Component } from "react";
import {
  getUserCreatedCourses,
  getUserCreatedStudents,
  createSection,
  getCurrentUser
} from "../../util/APIUtils";
import { validateName, validateYear } from "../../util/Validators";
import { Section } from "../../util/FeatureStates";
import { Form, Input, Button, notification, Select, Typography } from "antd";
const { Option } = Select;
const { Title } = Typography;
const FormItem = Form.Item;

class NewSection extends Component {
  constructor(props) {
    super(props);
    this.state = Section();
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
      getUserCreatedStudents(response.username, 0, 50).then(response => {
        this.setState({
          studentList: response.content,
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
      users: {
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

    const { name, users, year, course } = this.state;
    const sectionRequest = {
      name: name.value,
      noOfStudents: users.value === undefined ? 0 : users.value.length,
      year: year.value,
      status: "Not Teamed",
      course: course.value,
      users: users.value
    };
    console.log(sectionRequest);
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
    const { courseList, studentList, name, users, course, year } = this.state;
    return (
      <div className="signup-container">
        <Title level={2}>Create Section</Title>
        <div className="signup-content">
          <Form onSubmit={this.handleSubmit} className="signup-form">
            <FormItem
              label="Name"
              hasFeedback
              validateStatus={name.validateStatus}
              help={name.errorMsg}
            >
              <Input
                size="large"
                name="name"
                autoComplete="off"
                placeholder="Name"
                value={name.value}
                onChange={event => this.handleInputChange(event, validateName)}
              />
            </FormItem>
            <FormItem
              label="Students"
              hasFeedback
              validateStatus={users.validateStatus}
              help={users.errorMsg}
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
                  studentList.map((users, index) => (
                    <Option key={index}>
                      {users.id} - {users.name}
                    </Option>
                  ))}
              </Select>
            </FormItem>
            <FormItem
              label="Course"
              hasFeedback
              validateStatus={course.validateStatus}
              help={course.errorMsg}
            >
              <Select
                name="course"
                size="large"
                placeHolder="Please select a course"
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
              validateStatus={year.validateStatus}
              help={year.errorMsg}
            >
              <Input
                size="large"
                name="year"
                type="number"
                autoComplete="off"
                placeholder="Year"
                value={year.value}
                onChange={event => this.handleInputChange(event, validateYear)}
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
}

export default NewSection;
