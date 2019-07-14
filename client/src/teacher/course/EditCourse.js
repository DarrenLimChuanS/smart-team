import React, { Component } from "react";
import { createCourse, updateCourse, getCourseById } from "../../util/APIUtils";
import { Form, Input, Button, notification, Typography } from "antd";
import { Course } from "../../util/FeatureStates";
import { validateNotEmpty, validateNotRequired } from "../../util/Validators";

const { Title } = Typography;
const FormItem = Form.Item;

class EditCourse extends Component {
  constructor(props) {
    super(props);
    this.state = Course();
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.isFormInvalid = this.isFormInvalid.bind(this);
  }

  async componentDidMount() {
    if (this.props.match.params.id !== "new") {
      getCourseById(this.props.match.params.id).then(response => {
        this.setState(
          Course(
            response.id,
            response.courseCode,
            response.name,
            response.description,
            response.createdBy,
            response.createdAt
          )
        );
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
        ...validationFun(inputValue, target.placeholder)
      }
    });
  }

  handleSubmit(event) {
    event.preventDefault();

    const courseRequest = {
      courseCode: this.state.courseCode.value,
      name: this.state.name.value,
      description: this.state.description.value
    };

    (this.state.id.value
      ? updateCourse(this.state.id.value, courseRequest)
      : createCourse(courseRequest)
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
                  this.handleInputChange(event, validateNotEmpty)
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
                  this.handleInputChange(event, validateNotEmpty)
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
                  this.handleInputChange(event, validateNotRequired)
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
}

export default EditCourse;
