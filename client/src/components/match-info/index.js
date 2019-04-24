import React, { Component } from 'react';
import Preloader from 'components/preloader';
import Modal from 'components/modal';
import Input from 'components/input';

import moment from 'moment';

import style from './style.module.css';

class MatchInfo extends Component {

  render() {
    const { results, match, isLoading } = this.state;

    const modalActions = [{
      text: 'Delete match',
      onClick: this.confirmRuleDeleting,
      isDanger: true,
    }, {
      text: 'Update match',
      onClick: this.editMatchSubmit,
      isDanger: false,
    }];

    const formattedMatchDate = moment(match.startDate).format('YYYY-MM-DD');

    return <Modal
      title={"Edit match"}
      wrapClassName={style.modal_match}
      close={this.props.matchEditingCompleted}
      actions={modalActions}
    >

      {isLoading && <Preloader
        isFullScreen={true}
      />}

      <Input
        label="Match ID"
        name="id"
        value={match._id}
        onChange={this.handleInputChange}
        disabled
      />

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
      />

      <Input
        type="time"
        label="Start time"
        name="startTime"
        value={match.startTime}
        onChange={this.handleInputChange}
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

export default MatchInfo;