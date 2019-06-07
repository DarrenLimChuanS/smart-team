import React, { Component } from "react";
import { signup } from "../../util/APIUtils";

import { Form, Input, Button, notification, Typography } from "antd";
const { Title } = Typography;
const FormItem = Form.Item;

class EditCourse extends Component {
  constructor(props) {
    super(props);
    this.state = {
      courseId: {
        value: ""
      },
      name: {
        value: ""
      }
    };
    this.handleInputChange = this.handleInputChange.bind(this);
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
  }

  handleSubmit(event) {
    event.preventDefault();

    const signupRequest = {
      courseId: this.state.courseId.value,
      name: this.state.name.value
    };
    signup(signupRequest)
      .then(response => {
        notification.success({
          message: "Smart Team",
          description: "Success! You have successfully added a new course."
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
      this.state.courseId.validateStatus === "success" &&
      this.state.name.validateStatus === "success"
    );
  }

  render() {
    return (
      <div className="signup-container">
        <Title level={2}>Edit Course</Title>
        <div className="signup-content">
          <Form onSubmit={this.handleSubmit} className="signup-form">
            <FormItem
              label="Course ID"
              hasFeedback
              validateStatus={this.state.courseId.validateStatus}
              help={this.state.courseId.errorMsg}
            >
              <Input
                size="large"
                name="courseId"
                autoComplete="off"
                placeholder="Course ID"
                value={this.state.courseId.value}
                onChange={event =>
                  this.handleInputChange(event, this.validateCourseId)
                }
              />
            </FormItem>
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
  validateCourseId = courseId => {
    if (courseId === "") {
      return {
        validateStatus: "error",
        errorMsg: `Course ID cannot be empty.`
      };
    } else {
      return {
        validateStatus: "success",
        errorMsg: null
      };
    }
  };

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
}

export default EditCourse;
