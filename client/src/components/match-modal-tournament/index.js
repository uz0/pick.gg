import React, { Component } from 'react';

import Modal from 'components/dashboard-modal';
import ResultModal from './result-modal';
import Input from 'components/input';
import Preloader from 'components/preloader';
import Button from 'components/button';

import NotificationService from 'services/notificationService';
import StreamerService from 'services/streamerService';
import UserService from 'services/userService';

import moment from 'moment';
import find from 'lodash/find';

import style from './style.module.css';

import i18n from 'i18n';

class MatchModal extends Component {
  constructor() {
    super();
    this.notificationService = new NotificationService();
    this.streamerService = new StreamerService();
    this.userService = new UserService();
  }

  state = {
    match: {
      _id: '',
      name: '',
      startDate: '',
      startTime: '',
      completed: false,
    },
    matches: [],
    selectMatches: [],
    selectedMatchId: '',
    results: [],
    resultsFile: {},
    editedResults: [],
    isResultsModalActive: false,
    isLoading: false,
  };

  componentDidMount = async () => {
    this.setState({ isLoading: true });

    const { matchId, matchChampions } = this.props;
    let { match } = await this.streamerService.getMatchInfo(matchId);

    match.startTime = moment(match.startDate).format('HH:mm');

    const result = match.results && match.results.playersResults;
    let resultsWithChampions = null;

    if (result) {
      resultsWithChampions = this.mapResultsToChampions(result, matchChampions);
    }

    this.setState({
      match,
      matches: [],
      results: resultsWithChampions,
      isLoading: false,
    });
  }

  mapResultsToChampions = (results, champions) => {
    results.forEach(result => {
      result.playerName = find(champions, { _id: result.playerId }).name;
    });

    return results;
  }

  handleMatchSelectChange = (event) => this.setState({ selectedMatchId: event.target.value });

  handleInputChange = (event) => {
    let inputValue = event.target.value;

    if (event.target.name === 'date') {
      inputValue = moment(event.target.value).format();
    }

    if (event.target.type === 'checkbox') {
      inputValue = event.target.checked;
    }

    this.setState({
      match: {
        ...this.state.match,
        [event.target.name]: inputValue,
      },
    });
  };

  onRulesInputChange = (event, resultIndex, ruleIndex) => {
    let { results, editedResults } = this.state;
    const result = results[resultIndex].results[ruleIndex];

    results.forEach(item => {
      item.results.forEach(element => {
        if (element._id === result._id) {
          element.score = parseInt(event.target.value, 10);

          if (editedResults.length > 0 && !editedResults.find(result => result._id === item._id)) {
            editedResults.push(item);
          }

          if (editedResults.length === 0) {
            editedResults.push(item);
          }
        }
      });
    });

    this.setState({
      results,
      editedResults,
    });
  }

  toggleResultsModal = () => this.setState({ isResultsModalActive: !this.state.isResultsModalActive });

  addResultFile = (resultsFile) => {
    this.setState({
      resultsFile,
      isResultsModalActive: false,
    });
  }

  editMatchSubmit = async () => {
    this.setState({ isLoading: true });

    const { match, results } = this.state;
    const [hours, minutes] = match.startTime.split(':');
    const matchDate = moment(match.startDate).hours(hours).minutes(minutes);

    const formData = new FormData();

    formData.append('resultFile', this.state.resultsFile);
    formData.append('results', JSON.stringify(results));
    formData.append('name', match.name);
    formData.append('matchId', match._id);
    formData.append('startDate', matchDate);
    formData.append('completed', match.completed);

    let request = await this.streamerService.updateMatch({
      matchId: match._id,
      formData,
    });

    if (request.error) {
      this.notificationService.showSingleNotification({
        type: 'error',
        shouldBeAddedToSidebar: false,
        message: i18n.t(request.error),
      });

      this.setState({
        isLoading: false,
        resultsFile: {},
      });

      return;
    }

    request.updatedMatch.startTime = moment(request.updatedMatch.startDate).format('HH:mm');

    const result = request.updatedMatch.results && request.updatedMatch.results.playersResults;
    let resultsWithChampions = null;

    if (result) {
      resultsWithChampions = this.mapResultsToChampions(result, this.props.matchChampions);
    }

    this.notificationService.showSingleNotification({
      type: 'success',
      shouldBeAddedToSidebar: false,
      message: i18n.t('match_modal.notification.match_updated', { name: request.name }),
    });

    this.props.onMatchUpdated();

    this.setState({
      match: request.updatedMatch,
      results: resultsWithChampions,
    });
  }

  render() {
    const {
      match,
      results,
      isLoading,
    } = this.state;

    const modalTitle = i18n.t('match_modal.modal_title', { name: match.name });
    const modalResultTitle = i18n.t('result_modal.title', { name: match.name });
    const modalActions = [{
      text: i18n.t('match_modal.action_button_text'),
      onClick: this.editMatchSubmit,
      isDanger: false,
    }];

    return <Modal
      title={modalTitle}
      wrapClassName={style.modal_match}
      close={this.props.closeMatchEditing}
      actions={modalActions}
    >

      {isLoading && <Preloader
        isFullScreen={false}
      />}

      <Input
        label={i18n.t('match_modal.match_name')}
        name='name'
        value={match.name}
        onChange={this.handleInputChange}
      />

      <Input
        label={i18n.t('match_modal.start_time')}
        type='time'
        name='startTime'
        value={match.startTime}
        onChange={this.handleInputChange}
      />

      <label className={style.chebox}>
        <p>{i18n.t('match_modal.completed')}</p>
        <input
          type='checkbox'
          name='completed'
          className={style.css_checkbox}
          value={match.completed}
          checked={match.completed}
          onChange={this.handleInputChange}
        />
      </label>

      <label className={style.chebox}>
        <p>{i18n.t('match_modal.results')}</p>
      </label>

      {this.state.resultsFile.name &&
        <p className={style.file_upload_success}><i className='material-icons'>done</i>{i18n.t('match_modal.results_choosed')}</p>
      }

      <div className={style.results_controls}>
        <Button
          text={i18n.t('match_modal.upload_file')}
          icon={<i className='material-icons'>attach_file</i>}
          onClick={this.toggleResultsModal}
          appearance={'_basic-accent'}
        />
      </div>

      {this.state.isResultsModalActive &&
        <ResultModal
          title={modalResultTitle}
          onFileUploaded={this.addResultFile}
          onClose={this.toggleResultsModal}
        />
      }

      {results && results.map((result, resultIndex) => <div key={`id${resultIndex}`} className={style.match_results}>
        <div className={style.player}>{result.playerName}</div>

        <div className={style.rules_inputs}>
          {result.results.map((item, ruleIndex) =>
            <Input
              type='number'
              max='10'
              key={item._id}
              label={item.rule.name}
              placeholder={item.rule.name}
              className={style.rule_input}
              name={item._id}
              onChange={(event) => this.onRulesInputChange(event, resultIndex, ruleIndex)}
              value={results[resultIndex].results[ruleIndex].score}
            />)}
        </div>
      </div>)}
    </Modal>;
  }
}

export default MatchModal;