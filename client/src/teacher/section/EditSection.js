import { Form, Input, Button, notification, Select, Typography } from "antd";
import React, { Component } from "react";
import LoadingIndicator from "../../common/LoadingIndicator";
import {
  getUserCreatedCourses,
  getUserCreatedStudents,
  createSection,
  getCurrentUser,
  updateSection,
  getSectionById
} from "../../util/APIUtils";
import { Section } from "../../util/FeatureStates";
import { validateName } from "../../util/Validators";
const { Option } = Select;
const { Title } = Typography;
const FormItem = Form.Item;

class EditSection extends Component {
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
    let courseList = [];
    getCurrentUser().then(response => {
      this.setState({
        currentUser: response,
        ...this.state
      });
      getUserCreatedCourses(response.username, 0, 50).then(response => {
        courseList = response.content;
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
        if (this.props.match.params.id === "new") {
          this.setState({
            isLoading: false
          });
        } else {
          getSectionById(this.props.match.params.id).then(response => {
            let students = response.users;
            let studentIds = [];
            const matchingCourseIndex = courseList.findIndex(
              obj => obj.id === response.courseId
            );
            students.forEach(student =>
              studentIds.push(parseInt(student.id, 10))
            );
            this.setState(
              Section(
                response.sectionId,
                response.name,
                response.year,
                response.noOfStudents,
                courseList[matchingCourseIndex],
                response.users,
                response.status,
                response.createdBy,
                response.createdAt
              )
            );

            this.setState({
              selectedStudents: { value: studentIds },
              selectedCourse: { value: response.courseId },
              isLoading: false
            });
          });
        }
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

  handleStudentChange(value) {
    const { studentList } = this.state;
    const students = [];
    value.forEach(studentId => {
      const studentIndex = studentList.findIndex(
        student => student.id === studentId
      );
      students.push(studentList[studentIndex]);
    });
    this.setState({
      students: {
        value: students
      },
      selectedStudents: {
        value: value
      }
    });
  }

  handleCourseChange(courseId) {
    const { courseList } = this.state;
    const courseIndex = courseList.findIndex(course => course.id === courseId);
    const course = courseList[courseIndex];
    this.setState({
      course: {
        value: course
      },
      selectedCourse: {
        value: courseId
      }
    });
  }

  handleSubmit(event) {
    event.preventDefault();

    console.log(this.state);

    const { name, students, year, course, sectionId } = this.state;
    const sectionRequest = {
      name: name.value,
      noOfStudents: students.value === undefined ? 0 : students.value.length,
      year: year.value,
      status: "Not Teamed",
      course: course.value,
      users: students.value
    };
    (sectionId.value
      ? updateSection(sectionId.value, sectionRequest)
      : createSection(sectionRequest)
    )
      .then(response => {
        notification.success({
          message: "Smart Team",
          description:
            "Success! You have successfully " +
            (sectionId.value ? "updated" : "created") +
            " a section."
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
    const {
      courseList,
      studentList,
      sectionId,
      name,
      students,
      course,
      selectedCourse,
      selectedStudents,
      isLoading
    } = this.state;
    return isLoading ? (
      <LoadingIndicator />
    ) : (
      <div className="signup-container">
        <Title level={2}>{sectionId.value ? "Edit" : "Create"} Section</Title>
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
              validateStatus={students.validateStatus}
              help={students.errorMsg}
            >
              <Select
                size="large"
                mode="multiple"
                style={{ width: "100%" }}
                placeholder={"Please select the students"}
                defaultValue={
                  this.state && selectedStudents && selectedStudents.value
                }
                onChange={value => this.handleStudentChange(value)}
              >
                {this.state &&
                  studentList &&
                  studentList.map((student, index) => (
                    <Option key={student.id} value={student.id}>
                      {`${student.id} - ${student.name}`}
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
                defaultActiveFirstOption={true}
                placeHolder="Please select a course"
                defaultValue={
                  this.state && selectedCourse && selectedCourse.value
                }
                onChange={value => this.handleCourseChange(value)}
              >
                {this.state &&
                  courseList &&
                  courseList.map((course, index) => (
                    <Option key={course.id} value={course.id}>
                      {course.id} - {course.name}
                    </Option>
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
                {sectionId.value ? "Update" : "Create"}
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

export default EditSection;
