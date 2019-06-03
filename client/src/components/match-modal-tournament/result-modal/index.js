import React, { Component } from 'react';

import Modal from 'components/dashboard-modal';
import NotificationService from 'services/notificationService';

import style from './style.module.css';

class ResultModal extends Component {
  constructor() {
    super();
    this.NotificationService = new NotificationService();
  }

  state = {
    fileName: '',
    file: {},
  }

  componentDidMount() {
    const dropZone = this.dropZone;
    dropZone.addEventListener('dragover', this.handleDragOver);
    dropZone.addEventListener('drop', this.handleDrop);
  }

  handleDragOver = (event) => event.preventDefault();

  handleDropZoneClick = () => this.results.click();

  handleDrop = (event) => {
    event.preventDefault();

    const file = event.dataTransfer.files[0];

    if (event.dataTransfer.files.length > 1) {
      this.notificationService.showSingleNotification({
        type: 'error',
        message: "You can't upload multiple files",
      });

      return;
    }

    if (file.type != 'text/html') {
      this.notificationService.showSingleNotification({
        type: 'error',
        message: "You can upload only HTML files",
      });

      return;
    }

    this.setState({
      fileName: file.name,
      file,
    });
  }

  handleOnFileChoosed = (event) => {
    event.preventDefault();

    const file = this.results.files[0];

    if (this.results.files.length > 1) {
      this.notificationService.showSingleNotification({
        type: 'error',
        message: "You can't upload multiple files",
      });

      return;
    }

    this.setState({
      fileName: file.name,
      file,
    });
  }

  addResultFile = () => {
    if (!this.state.fileName) {
      this.notificationService.showSingleNotification({
        type: 'error',
        message: "You should choose file first",
      });

      return;
    }

    this.props.onFileUploaded(this.state.file);
  }

  render() {
    const {
      title,
      onClose,
    } = this.props;

    const modalResultActions = [{
      text: 'Add results',
      onClick: this.addResultFile,
      isDanger: false,
    }];

    return (
      <Modal
        title={title}
        wrapClassName={style.result_modal}
        close={onClose}
        actions={modalResultActions}
      >
        <div
          ref={dropZone => this.dropZone = dropZone}
          className={style.dropzone}
          onClick={this.handleDropZoneClick}
        >

          {!this.state.fileName &&
            <p>You can drag and drop file</p>
          }

          {this.state.fileName &&
            <p>{this.state.fileName}</p>
          }

          <div className={style.clickZone}>
            or click here
          </div>

          <input
            className={style.fileInput}
            ref={results => this.results = results}
            onChange={this.handleOnFileChoosed}
            type='file'
          />
        </div>
      </Modal>
    );
  }
}

export default ResultModal;