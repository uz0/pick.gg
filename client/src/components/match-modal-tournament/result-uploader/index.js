import React, { Component } from 'react';
import FileDrop from 'react-file-drop';
import Button from 'components/button';

import NotificationService from 'services/notificationService';

import i18n from 'i18n';

import style from './style.module.css';

class ResultUploader extends Component {
  constructor() {
    super();
    this.notificationService = new NotificationService();
  }

  state = {
    fileName: '',
    file: {},
  }

  handleDrop = (files, event) => {
    event.preventDefault();

    const file = files[0];

    if (files.length > 1) {
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
    const { fileName } = this.state;

    return <div className={style.container}>
      <FileDrop
        className={style.dropzone}
        onDrop={this.handleDrop}
      >
        <p>{fileName || i18n.t('result_modal.drag_and_drop_file')}</p>

        <div
          className={style.clickZone}
          onClick={() => this.results.click()}
        >
          {i18n.t('result_modal.upload_file_button_text')}
        </div>

        <input
          type="file"
          className={style.fileInput}
          ref={results => this.results = results}
          onChange={this.handleOnFileChoosed}
        />
      </FileDrop>

      <Button
        className={style.button}
        appearance="_basic-accent"
        text={i18n.t('result_modal.action_button_text')}
        onClick={this.addResultFile}
      />
    </div>
  }
}

export default ResultUploader;