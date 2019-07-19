import React, { Component } from "react";
import { Modal, Button } from "antd";
import { Link } from "react-router-dom";

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
      triggerButtonSize,
      triggerButtonType,
      triggerButtonText,
      linkTo,
      link,
      ...rest
    } = this.props;
    return (
      <React.Fragment>
        {link ? (
          <Link onClick={this.showModal} {...rest}>
            {triggerButtonText}
          </Link>
        ) : (
          <Button
            type={triggerButtonType || "primary"}
            size={triggerButtonSize || "default"}
            onClick={this.showModal}
            {...rest}
          >
            {triggerButtonText}
          </Button>
        )}
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
