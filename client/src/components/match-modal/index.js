import React, { Component } from 'react';

import Modal from 'components/dashboard-modal';
import Input from 'components/input';

import http from 'services/httpService'; 

import classnames from 'classnames/bind';
import style from './style.module.css';
import find from 'lodash/find';

const cx = classnames.bind(style);

class MatchModal extends Component {

  state = {
    match: {},
    results: [],
    editedResults: [],
  };

  componentDidMount = async() => {
    const { match } = await http(`/api/admin/matches/${this.props.matchId}`).then(res => res.json());
    const { result } = await http(`/api/admin/results/${match[0].results}`).then(res => res.json());

    const resultsWithChampions = this.mapResultsToChampions(result.playersResults, this.props.matchChampions);

    this.setState({
      match,
      results: resultsWithChampions,
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
  }

  render() {
    const { results } = this.state;

    console.log(style);

    return <Modal
      title='Match Edit'
      wrapClassName={style.modal_match}
      close={this.editMatchReset}
      actions={[{
        text: 'Update match',
        onClick: this.editMatchSubmit,
        isDanger: false,
      }]}
    >

      {results.map((result, resultIndex) => <div key={result._id}>
        {result.playerName}

        <div className={style.rules_inputs}>
          {result.results.map((item, ruleIndex) =>
            <Input
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