import React, { Component } from 'react';

import Input from 'components/input';
import Button from 'components/button';
import Modal from '../../dashboard-modal';

import NotificationService from 'services/notificationService';
import StreamerService from 'services/streamerService';

import classnames from 'classnames';
import style from './style.module.css';
import i18n from 'i18n';

const cx = classnames.bind(style);

class MatchesStep extends Component {
  constructor() {
    super();

    this.notificationService = new NotificationService();
    this.streamerService = new StreamerService();
  }

  state = {
    matches: [],
    matchData: {
      name: '',
      startTime: ''
    },
    isMatchCreating: false,
  }

  showMatchCreatingModal = () => this.setState({
    isMatchCreating: true
  });

  closeMatchCreatingModal = () => this.setState({
    isMatchCreating: false,
  });

  handleInputChange = (event) => {
    this.setState({
      matchData: {
        ...this.state.matchData,
        [event.target.name]: event.target.value,
      },
    });
  };

  addMatch = () => {
    let { matches, matchData } = this.state;

    if (matchData.name.length === 0) {
      this.notificationService.showSingleNotification({
        type: 'error',
        shouldBeAddedToSidebar: false,
        message: 'Match field can not be empty',
      });

      return;
    }

    if (matchData.startTime.length === 0) {
      this.notificationService.showSingleNotification({
        type: 'error',
        shouldBeAddedToSidebar: false,
        message: 'Date field can not be empty',
      });

      return;
    }

    matches.push(matchData);

    this.setState({
      matches,
      matchData: {
        name: '',
        startTime: ''
      },
      isMatchCreating: false,
    });
  }

  renderMatch = (match, index) => {
    return <div className={style.match}>
      <div className={style.info_item}>
        {`${index + 1}. ${match.name}`}
      </div>
      <div className={style.info_item}>
        {match.startTime}
      </div>
      <button className={style.delete}>
        <i className="material-icons">delete_forever</i>
      </button>
      <button className={style.edit}>
        <i className="material-icons">edit</i>
      </button>
    </div>
  }


  render() {
    return (
      <div>
        <p>Tournament matches</p>
        <div>
          {this.state.matches.map((item, index) => this.renderMatch(item, index))}
          <Button
            appearance={'_circle-accent'}
            icon={<i className="material-icons">add</i>}
            onClick={this.showMatchCreatingModal}
          />
        </div>

        {this.state.isMatchCreating && <Modal
          title={'Add match'}
          close={this.closeMatchCreatingModal}
          wrapClassName={style.create_player_modal}
          actions={[{
            text: 'Add match',
            onClick: this.addMatch,
            isDanger: true
          }]}
        >
          <Input
            label="Match name"
            name="name"
            value={this.state.matchData.name}
            onChange={this.handleInputChange}
          />

          <Input
            type="time"
            label="Start time"
            name="startTime"
            value={this.state.matchData.startTime}
            onChange={this.handleInputChange}
          />
        </Modal>
        }
      </div>
    );
  }
}

export default MatchesStep;