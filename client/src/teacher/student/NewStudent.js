import React, { Component } from "react";
import { Link } from "react-router-dom";
import { signup } from "../../util/APIUtils";

import {
  DatePicker,
  Form,
  Input,
  Button,
  notification,
  Select,
  Typography
} from "antd";
import { GPA_MIN, GPA_MAX } from "../../constants";
const { Option } = Select;
const { Title } = Typography;
const FormItem = Form.Item;

class NewStudent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      batchNumber: {
        value: ""
      },
      name: {
        value: ""
      },
      studentId: {
        value: ""
      },
      birthDate: {
        value: ""
      },
      gender: {
        value: "male"
      },
      address: {
        value: ""
      },
      gpa: {
        value: 0
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
      batchNumber: this.state.batchNumber.value,
      name: this.state.name.value,
      studentId: this.state.studentId.value,
      email: this.state.email.value,
      birthDate: this.state.birthDate.value,
      gender: this.state.gender.value,
      gpa: this.state.gpa.value
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
      this.state.batchNumber.validateStatus === "success" &&
      this.state.name.validateStatus === "success" &&
      this.state.studentId.validateStatus === "success" &&
      this.state.birthDate.validateStatus === "success" &&
      this.state.gender.validateStatus === "success" &&
      this.state.address.validateStatus === "success" &&
      this.state.gpa.validateStatus === "success"
    );
  }

  render() {
    return (
      <div className="signup-container">
        <Title level={2}>Create Student</Title>
        <div className="signup-content">
          <Form onSubmit={this.handleSubmit} className="signup-form">
            <FormItem
              label="Batch Number"
              validateStatus={this.state.batchNumber.validateStatus}
              help={this.state.batchNumber.errorMsg}
            >
              <Input
                size="large"
                name="batchNumber"
                autoComplete="off"
                placeholder="Batch Number"
                value={this.state.batchNumber.value}
                onChange={event =>
                  this.handleInputChange(event, this.validateBatchNumber)
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
            <FormItem
              label="Gender"
              hasFeedback
              validateStatus={this.state.gender.validateStatus}
              help={this.state.gender.errorMsg}
            >
              <Select
                name="gender"
                size="large"
                value={this.state.gender.value}
                onBlur={this.validateGenderAvailability}
                style={{ width: "32%" }}
                onChange={event =>
                  this.handleInputChange(event, this.validateGender)
                }
              >
                <Option value="male">Male</Option>
                <Option value="female">Female</Option>
              </Select>
            </FormItem>
            <FormItem
              label="Birthdate"
              hasFeedback
              validateStatus={this.state.birthDate.validateStatus}
              help={this.state.birthDate.errorMsg}
            >
              <DatePicker
                name="birthDate"
                placeholder="Date of Birth"
                value={this.state.birthDate.value}
                onChange={event =>
                  this.handleInputChange(event, this.validateBirthDate)
                }
              />
            </FormItem>
            <FormItem
              label="Address"
              hasFeedback
              validateStatus={this.state.address.validateStatus}
              help={this.state.address.errorMsg}
            >
              <Input
                size="large"
                name="address"
                autoComplete="off"
                placeholder="Address"
                value={this.state.address.value}
                onBlur={this.validateAddressAvailability}
                onChange={event =>
                  this.handleInputChange(event, this.validateAddress)
                }
              />
            </FormItem>
            <FormItem
              label="GPA"
              validateStatus={this.state.gpa.validateStatus}
              help={this.state.gpa.errorMsg}
            >
              <Input
                size="large"
                type="number"
                name="gpa"
                autoComplete="off"
                placeholder="GPA (Maximum of 5)"
                value={this.state.gpa.value}
                onChange={event =>
                  this.handleInputChange(event, this.validateGpa)
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
  validateBatchNumber = batchNumber => {
    if (batchNumber == "") {
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
    if (name == "") {
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

  validateBirthdate = birthDate => {
    if (birthDate == "") {
      return {
        validateStatus: "error",
        errorMsg: `Birth Date cannot be empty.`
      };
    } else {
      return {
        validateStatus: "success",
        errorMsg: null
      };
    }
  };

  validateAddress = address => {
    if (address == "") {
      return {
        validateStatus: "error",
        errorMsg: `Address cannot be empty.`
      };
    } else {
      return {
        validateStatus: "success",
        errorMsg: null
      };
    }
  };

  validateGpa = gpa => {
    if (gpa < GPA_MIN) {
      return {
        validateStatus: "error",
        errorMsg: `GPA is too low (Minimum ${GPA_MIN}.)`
      };
    } else if (gpa > GPA_MAX) {
      return {
        validationStatus: "error",
        errorMsg: `GPA is too high (Maximum of ${GPA_MAX} allowed.)`
      };
    } else {
      return {
        validateStatus: "success",
        errorMsg: null
      };
    }
  };
}

export default NewStudent;
