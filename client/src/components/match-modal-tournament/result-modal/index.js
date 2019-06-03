import React, { Component } from 'react';

import Modal from 'components/dashboard-modal';
import NotificationService from 'services/notificationService';

import i18n from 'i18n';

import style from './style.module.css';

class ResultModal extends Component {
  constructor() {
    super();
    this.notificationService = new NotificationService();
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
        message: i18n.t('result_modal.error.multiple_files_upload'),
      });

      return;
    }

    if (file.type !== 'text/html') {
      this.notificationService.showSingleNotification({
        type: 'error',
        message: i18n.t('result_modal.error.format_error'),
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
        message: i18n.t('result_modal.error.multiple_files_upload'),
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
        message: i18n.t('result_modal.error.choose_file_first'),
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
      text: i18n.t('result_modal.action_button_text'),
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
            <p>{i18n.t('result_modal.drag_and_drop_file')}</p>
          }

          {this.state.fileName &&
            <p>{this.state.fileName}</p>
          }

          <div className={style.clickZone}>
            {i18n.t('result_modal.upload_file_button_text')}
          </div>

          <input
            type='file'
            className={style.fileInput}
            ref={results => this.results = results}
            onChange={this.handleOnFileChoosed}
          />
        </div>
      </Modal>
    );
  }
}

export default ResultModal;