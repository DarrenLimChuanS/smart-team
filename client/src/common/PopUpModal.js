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
    return (
      <div>
        <Button type="primary" onClick={this.showModal}>
          {this.props.triggerButtonText}
        </Button>
        <Modal
          visible={visible}
          title={this.props.title}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          footer={
            this.props.confirmText && [
              <Button key="back" onClick={this.handleCancel}>
                Cancel
              </Button>,
              <Button
                key="submit"
                type="primary"
                loading={loading}
                onClick={this.handleOk}
              >
                {this.props.confirmText}
              </Button>
            ]
          }
        >
          {this.props.children}
        </Modal>
      </div>
    );
  }
}

export default PopUpModal;
