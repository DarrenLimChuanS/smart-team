import React, { Component } from "react";
import { Link } from "react-router-dom";
import { signup } from "../../util/APIUtils";

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

    const signupRequest = {
      name: this.state.name.value,
      students: this.state.students.value,
      course: this.state.email.value,
      year: this.state.birthDate.value
    };
    signup(signupRequest)
      .then(response => {
        notification.success({
          message: "Smart Team",
          description: "Success! You have successfully added a new student."
        });
        this.props.history.push("/login");
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
