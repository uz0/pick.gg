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
    const { user } = await this.userService.getMyProfile();
    const { matches } = await this.streamerService.getLastMatches(user.streamerAccountId);
    const currentMatchPlayers = matchChampions.map(item => item.name);

    let selectMatches = [];

    matches.forEach((item, index) => {
      const matchPlayers = item.participantIdentities.map(participant => participant.player.summonerName);
      const playersDifference = difference(currentMatchPlayers, matchPlayers).length === 0 ? '✔' : '';

      selectMatches.push({
        name: `Match #${index + 1} started ${moment(item.gameCreation).format('YYYY-MM-DD')} ${matchPlayers.join(', ')} ${playersDifference}`,
        id: item.gameId,
      });
    });

    match.startTime = moment(match.startDate).format('HH:mm');

    const result = match.results && match.results.playersResults;
    let resultsWithChampions = null;

    if (result){
      resultsWithChampions = this.mapResultsToChampions(result, matchChampions);
    }

    this.setState({
      match,
      matches,
      selectMatches,
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

    const { match, results, selectedMatchId } = this.state;

    const [ hours, minutes ] = match.startTime.split(':');
    const matchDate = moment(match.startDate).hours(hours).minutes(minutes);

    let request = await this.streamerService.updateMatch({
      name: match.name,
      matchId: match._id,
      startDate: matchDate,
      completed: match.completed,
      lolMatchId: selectedMatchId,
      results,
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

    await this.props.onMatchUpdated();

    this.setState({
      isLoading: false,
      match: request.updatedMatch,
      results: resultsWithChampions,
    }, () => this.notificationService.showSingleNotification({
      type: 'success',
      shouldBeAddedToSidebar: false,
      message: 'Match was successfully updated!',
    }));
  }

  render() {
    const { results, match, isLoading } = this.state;
    const modalTitle = `Edit match ${match.name}`;
    const modalActions = [{
      text: 'Update match',
      onClick: this.editMatchSubmit,
      isDanger: false,
    }];

    const formattedMatchDate = moment(match.startDate).format('YYYY-MM-DD');

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
        label="Match name"
        name="name"
        value={match.name}
        onChange={this.handleInputChange}
      />

      <Input
        type="date"
        label="Start date"
        name="startDate"
        value={formattedMatchDate}
        onChange={this.handleInputChange}
        disabled
      />

      <Input
        type="time"
        label="Start time"
        name="startTime"
        value={match.startTime}
        onChange={this.handleInputChange}
      />

      <Select
        className={style.select}
        label='Select match results from LoL match'
        options={this.state.selectMatches}
        defaultOption="Choose match"
        onChange={this.handleMatchSelectChange}
      />

      <label className={style.chebox}>
        <p>Completed</p>
        <input
          type="checkbox"
          name="completed"
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