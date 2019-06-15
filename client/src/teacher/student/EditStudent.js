import React, { Component } from "react";
import {
  createStudent,
  checkUsernameAvailability,
  checkEmailAvailability,
  getStudentById,
  updateStudent,
  getCurrentUser
} from "../../util/APIUtils";

import { Form, Input, Button, notification, Typography } from "antd";
import {
  NAME_MIN_LENGTH,
  NAME_MAX_LENGTH,
  USERNAME_MIN_LENGTH,
  USERNAME_MAX_LENGTH,
  EMAIL_MAX_LENGTH,
  PASSWORD_MIN_LENGTH,
  PASSWORD_MAX_LENGTH
} from "../../constants";
const { Title } = Typography;
const FormItem = Form.Item;

const Student = (
  id,
  batch_no,
  name,
  username,
  email,
  password,
  createdBy,
  createdAt
) => ({
  id: {
    value: id || ""
  },
  batch_no: {
    value: batch_no || ""
  },
  name: {
    value: name || ""
  },
  username: {
    value: username || ""
  },
  email: {
    value: email || ""
  },
  password: {
    value: password || ""
  },
  createdBy: createdBy || "",
  createdAt: createdAt || ""
});

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
        ...validationFun(inputValue)
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
    console.log(currentUser);
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
                  this.handleInputChange(event, this.validateBatchNumber)
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
                  this.handleInputChange(event, this.validateUsername)
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
                autoComplete="off"
                placeholder="Your email"
                value={email.value}
                onBlur={this.validateEmailAvailability}
                onChange={event =>
                  this.handleInputChange(event, this.validateEmail)
                }
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
                  this.handleInputChange(event, this.validatePassword)
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
  validateBatchNumber = batch_no => {
    if (batch_no === "") {
      return {
        validateStatus: "error",
        errorMsg: `Batch Number cannot be empty.`
      };
    } else {
      return {
        validateStatus: "success",
        errorMsg: null
      };
    }
  };

  validateName = name => {
    if (name.length < NAME_MIN_LENGTH) {
      return {
        validateStatus: "error",
        errorMsg: `Name is too short (Minimum ${NAME_MIN_LENGTH} characters needed.)`
      };
    } else if (name.length > NAME_MAX_LENGTH) {
      return {
        validationStatus: "error",
        errorMsg: `Name is too long (Maximum ${NAME_MAX_LENGTH} characters allowed.)`
      };
    } else {
      return {
        validateStatus: "success",
        errorMsg: null
      };
    }
  };

  validateEmail = email => {
    if (!email) {
      return {
        validateStatus: "error",
        errorMsg: "Email may not be empty"
      };
    }

    const EMAIL_REGEX = RegExp("[^@ ]+@[^@ ]+\\.[^@ ]+");
    if (!EMAIL_REGEX.test(email)) {
      return {
        validateStatus: "error",
        errorMsg: "Email not valid"
      };
    }

    if (email.length > EMAIL_MAX_LENGTH) {
      return {
        validateStatus: "error",
        errorMsg: `Email is too long (Maximum ${EMAIL_MAX_LENGTH} characters allowed)`
      };
    }

    return {
      validateStatus: null,
      errorMsg: null
    };
  };

  validateUsername = username => {
    if (username.length < USERNAME_MIN_LENGTH) {
      return {
        validateStatus: "error",
        errorMsg: `Username is too short (Minimum ${USERNAME_MIN_LENGTH} characters needed.)`
      };
    } else if (username.length > USERNAME_MAX_LENGTH) {
      return {
        validationStatus: "error",
        errorMsg: `Username is too long (Maximum ${USERNAME_MAX_LENGTH} characters allowed.)`
      };
    } else {
      return {
        validateStatus: null,
        errorMsg: null
      };
    }
  };

  validateUsernameAvailability() {
    // First check for client side errors in username
    const usernameValue = this.state.username.value;
    const usernameValidation = this.validateUsername(usernameValue);

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
    const emailValidation = this.validateEmail(emailValue);

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

  validatePassword = password => {
    if (password.length < PASSWORD_MIN_LENGTH) {
      return {
        validateStatus: "error",
        errorMsg: `Password is too short (Minimum ${PASSWORD_MIN_LENGTH} characters needed.)`
      };
    } else if (password.length > PASSWORD_MAX_LENGTH) {
      return {
        validationStatus: "error",
        errorMsg: `Password is too long (Maximum ${PASSWORD_MAX_LENGTH} characters allowed.)`
      };
    } else {
      return {
        validateStatus: "success",
        errorMsg: null
      };
    }
  };
}

export default EditStudent;
