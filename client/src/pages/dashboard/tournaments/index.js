import React, { Component, Fragment } from 'react';
import { NavLink } from 'react-router-dom';

import http from 'services/httpService';
import TournamentService from 'services/tournamentService';

import Table from 'components/table';
import Modal from 'components/dashboard-modal';
import Input from 'components/input';
import Select from 'components/select';
import Button from 'components/button';
import { ReactComponent as CloseIcon } from 'assets/close.svg';

import moment from 'moment';
import i18n from 'i18n';

import classnames from 'classnames/bind';
import style from './style.module.css';

const cx = classnames.bind(style);

const tournamentsTableCaptions = {
  name: {
    text: i18n.t('name'),
    width: 250,
  },

  date: {
    text: i18n.t('date'),
    width: 100,
  },
};

class Tournaments extends Component {
  constructor() {
    super();
    this.tournamentService = new TournamentService();
  }

  state = {
    tournaments: [],
    tournamentEditingData: {
      name: '',
      date: '',
      rules: [],
      rulesValues: {},
    },
    isTournamentEditing: false,
    isMatchEditing: false,
    isLoading: false,
  };

  editTournamentInit = (tournamentId) => {
    const tournament = this.state.tournaments.filter(tournament => tournament._id === tournamentId)[0];
    this.setState({
      isTournamentEditing: true,
      tournamentEditingData: {
        ...this.state.tournamentEditingData,
        ...tournament,
      }
    });
  }

  editTournamentSubmit = () => console.log('submit');

  resetTournamentEditing = () => this.setState({
    isTournamentEditing: false,
    tournamentEditingData: {}
  });

  editMatchInit = () => this.setState({ isMatchEditing: true });

  editMatchReset = () => this.setState({ isMatchEditing: false });

  async componentDidMount() {
    this.setState({ isLoading: true });
    const { tournaments } = await this.tournamentService.getRealTournaments();
    const { rules } = await http('/api/rules').then(res => res.json());

    this.setState({
      tournamentEditingData: {
        rules,
        rulesValues: {},
      },
      tournaments,
      isLoading: false,
    });
  }

  renderRow = ({ className, itemClass, textClass, item }) => {
    const formattedDate = moment(item.date).format('MMM DD');
    const tournamentId = item._id;

    return <div onClick={() => this.editTournamentInit(tournamentId)} className={cx(className, style.tournament_row)} key={item._id}>
      <div className={itemClass} style={{ '--width': tournamentsTableCaptions.name.width }}>
        <span className={textClass}>{item.name}</span>
      </div>

      <div className={itemClass} style={{ '--width': tournamentsTableCaptions.date.width }}>
        <span className={textClass}>{formattedDate}</span>
      </div>
    </div>;
  }

  render() {
    const {
      tournaments,
      tournamentEditingData,
      isMatchEditing,
      isTournamentEditing,
    } = this.state;

    const modalTitle = `Editing ${tournamentEditingData.name}`;
    const editedTournamentDate = moment(tournamentEditingData.date).format('YYYY-MM-DD');

    return <div className={style.tournaments}>
      <Table
        captions={tournamentsTableCaptions}
        items={tournaments}
        className={style.table}
        renderRow={this.renderRow}
        isLoading={this.state.isLoading}
        emptyMessage={i18n.t('there_is_no_tournaments_yet')}
      />

      {isTournamentEditing &&
        <Modal
          title={modalTitle}
          close={this.resetTournamentEditing}
          actions={[{
            text: 'Update tournament',
            onClick: this.editTournamentSubmit,
            isDanger: false,
          }]}
        >
          <Input
            label="Tournament name"
            defaultValue={tournamentEditingData.name}
          />
          <Input
            label="Tournament date"
            type="date"
            defaultValue={editedTournamentDate}
          />

          <div className={cx(style.section, style.champions_section)}>
            <div className={style.title}>Tournament players</div>
            <div className={style.champions}>
              {tournamentEditingData.champions.map(champion => <div key={champion._id} className={style.champion}>
                {champion.name}
                <Button
                  icon={<CloseIcon />}
                  appearance={'_icon-transparent'}
                />
              </div>)}
              <div className={style.champion_add}>
                <Select
                  className={style.select}
                />
                <Button
                  appearance="_basic-accent"
                  text="Add"
                  className={style.button}
                />
              </div>
            </div>
          </div>

          <div className={cx(style.section, style.matches_section)}>
            <div className={style.title}>Tournament Matches</div>
            {tournamentEditingData.matches.map((champion, index) => <div key={champion._id} onClick={this.editMatchInit} className={style.match}>
              {`Match ${index}`}
            </div>)}
          </div>
          
          {/* <div className={style.rules_inputs}>
            {tournamentEditingData.rules.map(item =>
              <Input
                label={item.name}
                className={style.rule_input}
                name={item._id}
                onChange={this.onRulesInputChange}
                value={tournamentEditingData.rulesValues[item._id] || ''}
                defaultValue={tournamentEditingData.rules[item._id]}
                key={item._id}
                type="number"
                max="10"
                required
              />)}
          </div> */}

        </Modal>}

        {isMatchEditing && <Modal
          title='Match Edit'
          wrapClassName={style.modal_match}
          close={this.editMatchReset}
          actions={[{
            text: 'Update match',
            onClick: this.editTournamentSubmit,
            isDanger: false,
          }]}
          >
        </Modal>}

    </div>;
  }
}

export default Tournaments;
