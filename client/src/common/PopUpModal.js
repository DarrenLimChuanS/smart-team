import React, { Component } from "react";
import { Modal, Button } from "antd";

class PopUpModal extends Component {
  state = {
    loading: false,
    visible: false
  };

  showModal = () => {
    this.setState({
      visible: true
    });
  };

  handleOk = () => {
    this.setState({ loading: true });
    setTimeout(() => {
      this.setState({ loading: false, visible: false });
    });
    this.props.onSubmit();
  };

  handleCancel = () => {
    this.setState({ visible: false });
  };

  render() {
    const { visible, loading } = this.state;
    const {
      children,
      confirmText,
      submitButtonType,
      title,
      triggerButtonType,
      triggerButtonText,
      linkTo,
      ...rest
    } = this.props;
    return (
      <React.Fragment>
        <Button
          type={triggerButtonType || "primary"}
          onClick={this.showModal}
          {...rest}
        >
          {triggerButtonText}
        </Button>
        <Modal
          visible={visible}
          title={title}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          linkTo={linkTo}
          footer={
            confirmText && [
              <Button key="back" onClick={this.handleCancel}>
                Cancel
              </Button>,
              <Button
                key="submit"
                type={submitButtonType || "primary"}
                loading={loading}
                onClick={this.handleOk}
              >
                {confirmText}
              </Button>
            ]
          }
        >
          {children}
        </Modal>
      </React.Fragment>
    );
  }
}

export default PopUpModal;
