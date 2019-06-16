import React, { Component } from "react";
import {
  createStudent,
  checkUsernameAvailability,
  checkEmailAvailability,
  getStudentById,
  updateStudent,
  getCurrentUser
} from "../../util/APIUtils";
import { Student } from "../../util/FeatureStates";
import { Form, Input, Button, notification, Typography } from "antd";
import {
  validateNotEmpty,
  validateName,
  validateEmail,
  validateUsername,
  validatePassword
} from "../../util/Validators";

const { Title } = Typography;
const FormItem = Form.Item;

class EditStudent extends Component {
  constructor(props) {
    super(props);
    this.state = Student();
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.validateUsernameAvailability = this.validateUsernameAvailability.bind(
      this
    );
    this.validateEmailAvailability = this.validateEmailAvailability.bind(this);
    this.isFormInvalid = this.isFormInvalid.bind(this);
  }

  async componentDidMount() {
    if (this.props.match.params.id !== "new") {
      getStudentById(this.props.match.params.id).then(response => {
        this.setState(
          Student(
            response.id,
            response.batch_no,
            response.name,
            response.username,
            response.email,
            "",
            response.createdBy,
            response.createdAt
          )
        );
        console.log(response);
      });
    } else {
      getCurrentUser().then(response => {
        this.setState({
          currentUser: response,
          ...this.state
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
        ...validationFun(inputValue, target.placeholder)
      }
    });
  }

  handleSubmit(event) {
    event.preventDefault();
    const {
      id,
      batch_no,
      name,
      username,
      email,
      password,
      currentUser
    } = this.state;
    console.log(this.state);

    const studentRequest = {
      batch_no: batch_no.value,
      name: name.value,
      username: username.value,
      email: email.value,
      password: password.value
    };
    
    // Execute create / edit student API with studentRequest body
    (id.value
      ? updateStudent(id.value, studentRequest)
      : createStudent(studentRequest, currentUser.id)
    )
      .then(response => {
        notification.success({
          message: "Smart Team",
          description:
            "Success! You have successfully " +
            (id.value ? "updated" : "created") +
            " a student."
        });
        this.props.history.push("/student");
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
      this.state.batch_no.validateStatus === "success" &&
      this.state.name.validateStatus === "success" &&
      this.state.username.validateStatus === "success" &&
      this.state.email.validateStatus === "success" &&
      this.state.password.validateStatus === "success"
    );
  }

  render() {
    const { id, batch_no, name, username, email, password } = this.state;
    return (
      <div className="signup-container">
        <Title level={2}>{id.value ? "Edit " : "Create "} Student</Title>
        <div className="signup-content">
          {this.state.user}
          <Form onSubmit={this.handleSubmit} className="signup-form">
            <FormItem
              label="Batch Number"
              hasFeedback
              validateStatus={batch_no.validateStatus}
              help={batch_no.errorMsg}
            >
              <Input
                size="large"
                name="batch_no"
                type="number"
                autoComplete="off"
                placeholder="Batch Number"
                value={batch_no.value}
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
                onChange={event => this.handleInputChange(event, validateName)}
              />
            </FormItem>
            <FormItem
              label="Username"
              hasFeedback
              validateStatus={username.validateStatus}
              help={username.errorMsg}
            >
              <Input
                size="large"
                name="username"
                autoComplete="off"
                placeholder="A unique username"
                value={username.value}
                onBlur={this.validateUsernameAvailability}
                onChange={event =>
                  this.handleInputChange(event, validateUsername)
                }
              />
            </FormItem>
            <FormItem
              label="Email"
              hasFeedback
              validateStatus={email.validateStatus}
              help={email.errorMsg}
            >
              <Input
                disabled={id.value}
                size="large"
                name="email"
                type="email"
                autoComplete="off"
                placeholder="Your email"
                value={email.value}
                onBlur={this.validateEmailAvailability}
                onChange={event => this.handleInputChange(event, validateEmail)}
              />
            </FormItem>
            <FormItem
              label="Password"
              hasFeedback
              validateStatus={password.validateStatus}
              help={password.errorMsg}
            >
              <Input
                size="large"
                name="password"
                type="password"
                autoComplete="off"
                placeholder="A password between 6 to 20 characters"
                value={password.value}
                onChange={event =>
                  this.handleInputChange(event, validatePassword)
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
  validateUsernameAvailability() {
    // First check for client side errors in username
    const usernameValue = this.state.username.value;
    const usernameValidation = validateUsername(usernameValue);

    if (usernameValidation.validateStatus === "error") {
      this.setState({
        username: {
          value: usernameValue,
          ...usernameValidation
        }
      });
      return;
    }

    this.setState({
      username: {
        value: usernameValue,
        validateStatus: "validating",
        errorMsg: null
      }
    });

    checkUsernameAvailability(usernameValue)
      .then(response => {
        if (response.available) {
          this.setState({
            username: {
              value: usernameValue,
              validateStatus: "success",
              errorMsg: null
            }
          });
        } else {
          this.setState({
            username: {
              value: usernameValue,
              validateStatus: "error",
              errorMsg: "This username is already taken"
            }
          });
        }
      })
      .catch(error => {
        // Marking validateStatus as success, Form will be recchecked at server
        this.setState({
          username: {
            value: usernameValue,
            validateStatus: "success",
            errorMsg: null
          }
        });
      });
  }

  validateEmailAvailability() {
    // First check for client side errors in email
    const emailValue = this.state.email.value;
    const emailValidation = validateEmail(emailValue);

    if (emailValidation.validateStatus === "error") {
      this.setState({
        email: {
          value: emailValue,
          ...emailValidation
        }
      });
      return;
    }

    this.setState({
      email: {
        value: emailValue,
        validateStatus: "validating",
        errorMsg: null
      }
    });

    checkEmailAvailability(emailValue)
      .then(response => {
        if (response.available) {
          this.setState({
            email: {
              value: emailValue,
              validateStatus: "success",
              errorMsg: null
            }
          });
        } else {
          this.setState({
            email: {
              value: emailValue,
              validateStatus: "error",
              errorMsg: "This Email is already registered"
            }
          });
        }
      })
      .catch(error => {
        // Marking validateStatus as success, Form will be recchecked at server
        this.setState({
          email: {
            value: emailValue,
            validateStatus: "success",
            errorMsg: null
          }
        });
      });
  }
}

export default EditStudent;
