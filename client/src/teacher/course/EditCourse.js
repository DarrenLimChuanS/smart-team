import React, { Component } from "react";
import { createCourse, updateCourse, getCourseById } from "../../util/APIUtils";

import { Form, Input, Button, notification, Typography } from "antd";
const { Title } = Typography;
const FormItem = Form.Item;

class EditCourse extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: {
        value: 0
      },
      courseCode: {
        value: ""
      },
      name: {
        value: ""
      },
      description: {
        value: ""
      },
      createdBy: {},
      createdAt: ""
    };
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.isFormInvalid = this.isFormInvalid.bind(this);
  }

  async componentDidMount() {
    if (this.props.match.params.id !== "new") {
      getCourseById(this.props.match.params.id).then(response => {
        this.setState({
          id: {
            value: response.id
          },
          courseCode: {
            value: response.courseCode
          },
          name: {
            value: response.name
          },
          description: {
            value: response.description
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

  handleSubmit(event) {
    event.preventDefault();

    const createCourseRequest = {
      courseCode: this.state.courseCode.value,
      name: this.state.name.value,
      description: this.state.description.value
    };

    const updateCourseRequest = {
      courseCode: this.state.courseCode.value,
      name: this.state.name.value,
      description: this.state.description.value
    };
    (this.state.id.value
      ? updateCourse(this.state.id.value, updateCourseRequest)
      : createCourse(createCourseRequest)
    )
      .then(response => {
        notification.success({
          message: "Smart Team",
          description:
            "Success! You have successfully " +
            (this.state.id.value ? "updated" : "created") +
            " a course."
        });
        this.props.history.push("/course");
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
      this.state.courseCode.validateStatus === "success" &&
      this.state.name.validateStatus === "success"
    );
  }

  render() {
    const { id, courseCode, name, description } = this.state;
    return (
      <div className="signup-container">
        <Title level={2}>{id.value ? "Edit Course" : "Create Course"}</Title>
        <div className="signup-content">
          <Form onSubmit={this.handleSubmit} className="signup-form">
            <FormItem
              label="Course Code"
              hasFeedback
              validateStatus={courseCode.validateStatus}
              help={courseCode.errorMsg}
            >
              <Input
                size="large"
                name="courseCode"
                autoComplete="off"
                placeholder="Course Code"
                value={courseCode.value}
                onChange={event =>
                  this.handleInputChange(event, this.validateCourseCode)
                }
              />
            </FormItem>
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
                onChange={event =>
                  this.handleInputChange(event, this.validateName)
                }
              />
            </FormItem>
            <FormItem
              label="Description"
              hasFeedback
              validateStatus={description.validateStatus}
              help={description.errorMsg}
            >
              <Input
                type="textarea"
                size="large"
                name="description"
                autoComplete="off"
                placeholder="Description"
                value={description.value}
                onChange={event =>
                  this.handleInputChange(event, this.validateDescription)
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
                {id.value ? "Update" : "Create"}
              </Button>
            </FormItem>
          </Form>
        </div>
      </div>
    );
  }

  // Validation Functions
  validateCourseCode = courseCode => {
    if (courseCode === "") {
      return {
        validateStatus: "error",
        errorMsg: `Course Code cannot be empty.`
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

  validateDescription = () => {
    return {
      validateStatus: "success",
      errorMsg: null
    };
  };
}

export default EditCourse;
