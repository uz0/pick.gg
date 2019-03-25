import React, { Component } from 'react';

import Modal from 'components/dashboard-modal';
import Input from 'components/input';
import Preloader from 'components/preloader';

import http from 'services/httpService';
import NotificationService from 'services/notificationService';
import AdminService from 'services/adminService';

import classnames from 'classnames/bind';
import style from './style.module.css';
import find from 'lodash/find';

const cx = classnames.bind(style);

class MatchModal extends Component {

  constructor() {
    super();
    this.notificationService = new NotificationService();
    this.adminService = new AdminService();
  }

  state = {
    match: {},
    results: [],
    editedResults: [],
    isLoading: false,
  };

  componentDidMount = async () => {
    this.setState({ isLoading: true });

    let { match } = await http(`/api/admin/matches/${this.props.matchId}`).then(res => res.json());
    let matchResult = await this.adminService.getMatchResult(this.props.matchId);

    match.results = matchResult.result[0];

    const result = match.results.playersResults;
    const resultsWithChampions = this.mapResultsToChampions(result, this.props.matchChampions);

    this.setState({
      match,
      results: resultsWithChampions,
      isLoading: false,
    });
  }

  mapResultsToChampions = (results, champions) => {
    results.forEach(result => result.playerName = find(champions, { _id: result.player_id }).name);

    return results;
  }

  onRulesInputChange = (event, resultIndex, ruleIndex) => {
    let { results, editedResults } = this.state;
    const result = results[resultIndex].results[ruleIndex];

    results.forEach(item => {
      item.results.forEach(element => {
        if (element.rule._id === result.rule._id) {
          element.score = parseInt(event.target.value, 10);

          if (editedResults.length > 0 && !editedResults.find(result => result._id === item._id)) {
            editedResults.push(item);
          }

          if (editedResults.length === 0) {
            editedResults.push(item);
          }
        }
      })
    })

    this.setState({
      results,
      editedResults,
    })
  }

  editMatchSubmit = async () => {
    this.setState({ isLoading: true });

    const { match, results } = this.state;

    await http('/api/admin/results', {
      method: 'PUT',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        matchId: match.id,
        results,
      })
    });

    this.setState({
      isLoading: false
    }, () => this.notificationService.show('Match was successfully updated!'));
  }

  editMatchReset = () => {

  }

  render() {
    const { results, match, isLoading } = this.state;

    const matchModalTitle = this.props.isMatchCreating ? 'Create match' : 'Edit match';
    const matchModalActions = this.props.isMatchCreating
      ? [{
        text: 'Create match',
        onClick: this.addRuleSubmit,
        isDanger: false,
      }]
      : [{
        text: 'Delete match',
        onClick: this.confirmRuleDeleting,
        isDanger: true,
      }, {
        text: 'Update match',
        onClick: this.editRuleSubmit,
        isDanger: false,
      }];

    return <Modal
      title={matchModalTitle}
      wrapClassName={style.modal_match}
      close={this.props.matchEditingCompleted}
      actions={matchModalActions}
    >

      {isLoading && <Preloader />}

      <Input
        label="Match ID"
        name="name"
        value={match._id}
        defaultValue={match._id}
        disabled
        onChange={this.handleInputChange}
      />

      {results.map((result, resultIndex) => <div key={`id${resultIndex}`} className={style.match_results}>
        <div className={style.player}>{result.playerName}</div>

        <div className={style.rules_inputs}>
          {result.results.map((item, ruleIndex) =>
            <Input
              key={item.rule._id}
              label={item.rule.name}
              placeholder={item.rule.name}
              className={style.rule_input}
              name={item.rule._id}
              onChange={(event) => this.onRulesInputChange(event, resultIndex, ruleIndex)}
              value={results[resultIndex].results[ruleIndex].score}
              type="number"
              max="10"
            />)}
        </div>
      </div>)}
    </Modal>
  }
}

export default MatchModal;