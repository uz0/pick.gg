import React, { Component } from 'react';

import Modal from 'components/dashboard-modal';
import Input from 'components/input';
import Preloader from 'components/preloader';

import http from 'services/httpService';
import NotificationService from 'services/notificationService';

import classnames from 'classnames/bind';
import style from './style.module.css';
import find from 'lodash/find';

const cx = classnames.bind(style);

class MatchModal extends Component {

  constructor(){
    super();
    this.notificationService = new NotificationService()
  }

  state = {
    match: {},
    results: [],
    editedResults: [],
    isLoading: false,
  };

  componentDidMount = async() => {
    this.setState({ isLoading: true })

    const { match } = await http(`/api/admin/matches/${this.props.matchId}`).then(res => res.json());
    const { result } = await http(`/api/admin/results/${match[0].results}`).then(res => res.json());

    const resultsWithChampions = this.mapResultsToChampions(result.playersResults, this.props.matchChampions);

    this.setState({
      match,
      results: resultsWithChampions,
      isLoading: false,
    });
  }

  mapResultsToChampions = (results, champions) => {
    results.forEach(result => result.playerName = find(champions, { id: result.playerId }).name);

    return results;
  }

  onRulesInputChange = (event, resultIndex, ruleIndex) => {
    let { results, editedResults } = this.state;
    const result = results[resultIndex].results[ruleIndex];

    results.forEach(item => {
      item.results.forEach(element => {
        if(element._id === result._id) {
          element.score = parseInt(event.target.value, 10);

          if(editedResults.length > 0 && !editedResults.find(result => result._id === item._id)){
            editedResults.push(item);
          }
          
          if(editedResults.length === 0){
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

  editMatchSubmit = async() => {
    this.setState({ isLoading: true });

    const { match, results } = this.state;

    await http('/api/admin/results', {
      method: 'PUT',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        matchId: match[0].id,
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
    const { results, isLoading } = this.state;

    return <Modal
      title='Match Edit'
      wrapClassName={style.modal_match}
      close={this.props.matchEditingCompleted}
      actions={[{
        text: 'Update match',
        onClick: this.editMatchSubmit,
        isDanger: false,
      }]}
    >

      {isLoading && <Preloader />}

      {results.map((result, resultIndex) => <div key={result._id} className={style.match_results}>
        <div className={style.player}>{result.playerName}</div>

        <div className={style.rules_inputs}>
          {result.results.map((item, ruleIndex) =>
            <Input
              label={item.rule.name}
              placeholder={item.rule.name}
              className={style.rule_input}
              name={item._id}
              onChange={(event) => this.onRulesInputChange(event, resultIndex, ruleIndex)}
              value={results[resultIndex].results[ruleIndex].score}
              key={item._id}
              type="number"
              max="10"
            />)}
        </div>
      </div>)}
    </Modal>
  }
}

export default MatchModal;