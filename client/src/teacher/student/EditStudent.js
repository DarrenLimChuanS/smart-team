import React, { Component } from "react";
import DocumentTitle from "react-document-title";
import {
  checkUsernameAvailability,
  checkEmailAvailability,
  getStudentById,
  updateStudent,
  getCurrentUser,
  signup
} from "../../util/APIUtils";
import { Student } from "../../util/FeatureStates";
import { Form, Input, Button, notification, Typography } from "antd";
import {
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
            response.name,
            response.username,
            response.email,
            "",
            response.createdBy,
            response.createdAt
          )
        );
        this.setState({
          oldusername: response.username,
          oldemail: response.email,
          ...this.state
        });
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
    const { id, name, username, email, password } = this.state;
    const studentRequest = {
      name: name.value,
      username: username.value,
      email: email.value,
      password: password.value
    };

    // Execute create / edit student API with studentRequest body
    (id.value
      ? updateStudent(id.value, studentRequest)
      : signup(studentRequest, "student")
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
      this.state.name.validateStatus === "success" &&
      this.state.username.validateStatus === "success" &&
      this.state.email.validateStatus === "success" &&
      this.state.password.validateStatus === "success"
    );
  }

  render() {
    const { id, name, username, email, password } = this.state;
    return (
      <div className="signup-container">
        <DocumentTitle
          title={`Smart Team - ${id.value ? "Edit" : "Create"} Student`}
        />
        <Title level={2}>{id.value ? "Edit " : "Create "} Student</Title>
        <div className="signup-content">
          {this.state.user}
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
                size="large"
                name="email"
                type="email"
                disabled={this.props.match.params.id !== "new"}
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
    // Initial username so ignore validation
    if (usernameValue === this.state.oldusername) {
      this.setState({
        username: {
          value: usernameValue,
          validateStatus: "success",
          errorMsg: null
        }
      });
    } else {
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
  }

  validateEmailAvailability() {
    // First check for client side errors in email
    const emailValue = this.state.email.value;
    // Initial email so ignore validation
    if (emailValue === this.state.oldemail) {
      this.setState({
        email: {
          value: emailValue,
          validateStatus: "success",
          errorMsg: null
        }
      });
    } else {
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
}

export default EditStudent;
