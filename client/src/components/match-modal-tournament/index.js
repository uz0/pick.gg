import React, { Component } from 'react';

import Modal from 'components/dashboard-modal';
import Input from 'components/input';
import Preloader from 'components/preloader';

import NotificationService from 'services/notificationService';
import StreamerService from 'services/streamerService';
import UserService from 'services/userService';

import Select from '../filters/select';

import moment from 'moment';
import find from 'lodash/find';
import difference from 'lodash/difference';

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
    editedResults: [],
    isLoading: false,
  };

  componentDidMount = async () => {
    this.setState({ isLoading: true });

    const { matchId, matchChampions } = this.props;
    let { match } = await this.streamerService.getMatchInfo(matchId);

    match.startTime = moment(match.startDate).format('HH:mm');

    const result = match.results && match.results.playersResults;
    let resultsWithChampions = null;

    if (result){
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

    if (event.target.name === 'date'){
      inputValue = moment(event.target.value).format();
    }

    if (event.target.type === 'checkbox'){
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

  editMatchSubmit = async () => {
    this.setState({ isLoading: true });

    const { match, results } = this.state;
    const [ hours, minutes ] = match.startTime.split(':');
    const matchDate = moment(match.startDate).hours(hours).minutes(minutes);

    const matchResultsFile = this.results.files[0];
    const formData = new FormData();

    formData.append('resultFile', matchResultsFile);
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

      this.setState({ isLoading: false });

      return;
    }

    request.updatedMatch.startTime = moment(request.updatedMatch.startDate).format('HH:mm');

    const result = request.updatedMatch.results && request.updatedMatch.results.playersResults;
    let resultsWithChampions = null;

    if (result){
      resultsWithChampions = this.mapResultsToChampions(result, this.props.matchChampions);
    }

    this.notificationService.showSingleNotification({
      type: 'success',
      shouldBeAddedToSidebar: false,
      message: 'Match was successfully updated!',
    });
    
    this.props.onMatchUpdated();

    this.setState({
      match: request.updatedMatch,
      results: resultsWithChampions,
    });
  }

  render() {
    const { results, match, isLoading } = this.state;
    const modalTitle = `Edit match ${match.name}`;
    const modalActions = [{
      text: 'Update match',
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
        label='Match name'
        name='name'
        value={match.name}
        onChange={this.handleInputChange}
      />

      <Input
        type='time'
        label='Start time'
        name='startTime'
        value={match.startTime}
        onChange={this.handleInputChange}
      />

      <label className={style.chebox}>
        <p>Results</p>
        <input
          ref={results => this.results = results}
          type='file'
        />
      </label>

      <label className={style.chebox}>
        <p>Completed</p>
        <input
          type='checkbox'
          name='completed'
          className={style.css_checkbox}
          value={match.completed}
          checked={match.completed}
          onChange={this.handleInputChange}
        />
      </label>

      {!results && <div>There's no any results yet</div>}

      {results && results.map((result, resultIndex) => <div key={`id${resultIndex}`} className={style.match_results}>
        <div className={style.player}>{result.playerName}</div>

        <div className={style.rules_inputs}>
          {result.results.map((item, ruleIndex) =>
            <Input
              key={item._id}
              label={item.rule.name}
              placeholder={item.rule.name}
              className={style.rule_input}
              name={item._id}
              onChange={(event) => this.onRulesInputChange(event, resultIndex, ruleIndex)}
              value={results[resultIndex].results[ruleIndex].score}
              type="number"
              max="10"
            />)}
        </div>
      </div>)}
    </Modal>;
  }
}

export default MatchModal;