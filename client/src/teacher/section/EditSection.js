import React, { Component } from "react";
import { Link } from "react-router-dom";
import {
  createSection,
  updateSection,
  getSectionById
} from "../../util/APIUtils";

import { Form, Input, Button, notification, Select, Typography } from "antd";
const { Option } = Select;
const { Title } = Typography;
const FormItem = Form.Item;

class EditSection extends Component {
  constructor(props) {
    super(props);
    this.state = {
      sectionId: {
        value: ""
      },
      name: {
        value: ""
      },
      students: {
        value: []
      },
      course: {
        value: ""
      },
      year: {
        value: ""
      }
    };
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleStudentChange = this.handleStudentChange.bind(this);
    this.handleYearPicker = this.handleYearPicker.bind(this);
    this.handleCourseChange = this.handleCourseChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.isFormInvalid = this.isFormInvalid.bind(this);
  }

  async componentDidMount() {
    if (this.props.match.params.id !== "new") {
      getSectionById(this.props.match.params.id).then(response => {
        this.setState({
          sectionId: {
            value: response.sectionId
          },
          name: {
            value: response.name
          },
          students: {
            value: response.students
          },
          course: {
            value: response.course
          },
          year: {
            value: response.year
          },
          createdBy: response.createdBy,
          createdAt: response.createdAt
        });
      });
    }
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

    console.log(this.state);
  }

  handleStudentChange(value) {
    this.setState({
      students: {
        value: value
      }
    });
  }

  handleYearPicker(date, dateString, validationFun) {
    this.setState({
      year: {
        value: date,
        ...validationFun(date)
      }
    });
  }

  handleCourseChange(course) {
    this.setState({
      course: {
        value: course
      }
    });
  }

  handleSubmit(event) {
    event.preventDefault();

    const createSectionRequest = {
      sectionCode: this.state.sectionCode.value,
      name: this.state.name.value,
      description: this.state.description.value
    };

    const updateSectionRequest = {
      sectionCode: this.state.sectionCode.value,
      name: this.state.name.value,
      description: this.state.description.value
    };
    (this.state.id.value
      ? updateSection(this.state.id.value, updateSectionRequest)
      : createSection(createSectionRequest)
    )
      .then(response => {
        notification.success({
          message: "Smart Team",
          description:
            "Success! You have successfully " +
            (this.state.id.value ? "updated" : "created") +
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
    const students = [
      { studentId: 10023132, name: "John Smith" },
      { studentId: 10023133, name: "Daniel Lim" },
      { studentId: 10023134, name: "Mary Chiah" }
    ];

    const studentOptions = students.map((item, key) => (
      <Option key={item.studentId}>
        {item.studentId} - {item.name}
      </Option>
    ));
    return (
      <div className="signup-container">
        <Title level={2}>Edit Section</Title>
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
                placeholder="Please select"
                defaultValue={[]}
                onChange={event => this.handleStudentChange(event)}
              >
                {studentOptions}
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
                defaultValue="ict1001"
                style={{ width: "32%" }}
                onChange={value => this.handleCourseChange(value)}
              >
                <Option value="ict1001">ICT1001</Option>
                <Option value="ict1002">ICT1002</Option>
                <Option value="ict1003">ICT1003</Option>
                <Option value="ict1004">ICT1004</Option>
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
                Update
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
