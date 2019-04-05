import React, { Component } from 'react';

import http from 'services/httpService';
import TournamentService from 'services/tournamentService';
import NotificationService from 'services/notificationService';
import AdminService from 'services/adminService';

import Table from 'components/table';
import Modal from 'components/dashboard-modal';
import ModalAsk from 'components/modal';
import Input from 'components/input';
import Button from 'components/button';
import Preloader from 'components/preloader';

import moment from 'moment';
import i18n from 'i18n';

import classnames from 'classnames/bind';
import style from './style.module.css';

const cx = classnames.bind(style);

const tournamentsTableCaptions = {
  name: {
    text: i18n.t('name'),
    width: window.innerWidth < 480 ? 100 : 350,
  },

  date: {
    text: i18n.t('date'),
    width: 60,
  },
};

class FantasyTournaments extends Component {
  constructor(props) {
    super(props);
    this.tournamentService = new TournamentService();
    this.notificationService = new NotificationService();
    this.adminService = new AdminService();
  }

  state = {
    tournaments: [],
    tournamentEditingData: {
      name: '',
      date: '',
      champions: [],
      rules: [],
    },
    players: [],
    isTournamentEditing: false,
    isTournamentDeleting: false,
    isLoading: false,
  };

  editTournamentInit = (tournamentId) => {
    const tournament = this.state.tournaments.filter(tournament => tournament._id === tournamentId)[0];
    this.setState({
      isTournamentEditing: true,
      tournamentEditingData: {
        ...this.state.tournamentEditingData,
        ...tournament,
      },
    });
  }

  editTournamentSubmit = async () => {
    this.setState({ isLoading: true });

    const tournamentId = this.state.tournamentEditingData._id;

    await http(`/api/admin/tournaments/fantasy/${tournamentId}`, {
      method: 'PUT',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        tournamentId,
        tournament: this.state.tournamentEditingData,
      }),
    });

    const { tournaments } = await this.adminService.getFantasyTournaments();

    this.setState({
      isLoading: false,
      tournaments,
    }, () => this.notificationService.show(i18n.t('tournament_updated')));
  }

  deleteTournamentConfirmInit = () => {
    this.setState({
      isTournamentDeleting: true,
    });
  }

  deleteTournamentAccept = () => {
    this.setState({
      isTournamentDeleting: false,
    });

    this.deleteTournament();
  }

  deleteTournamentDecline = () => {
    this.setState({
      isTournamentDeleting: false,
    });
  }

  deleteTournament = async () => {
    const { name, _id } = this.state.tournamentEditingData;

    await this.adminService.deleteFantasyTournament(_id);

    const { tournaments } = await this.adminService.getFantasyTournaments();

    this.setState({
      isTournamentEditing: false,
      isTournamentDeleting: false,
      tournaments,
    }, () => this.notificationService.show(`${i18n.t('tournament')} ${name} ${i18n.t('was_deleted')}`));
  }

  finalizeTournament = async () => {
    const tournamentId = this.state.tournamentEditingData._id;
    const finalizeQuery = await this.adminService.finalizeFantasyTournament(tournamentId);

    this.notificationService.show(finalizeQuery.message);
  }

  finalizeTournaments = async () => {
    const finalizeQuery = await this.adminService.finalizeAllFantasyTournaments();

    this.notificationService.show(finalizeQuery.message);
  }

  resetTournamentEditing = () => this.setState({
    isTournamentEditing: false,
    tournamentEditingData: {},
  });

  handleInputChange = (event) => {
    const inputValue = event.target.name === 'date' ? moment(event.target.value).format() : event.target.value;
    this.setState({
      tournamentEditingData: {
        ...this.state.tournamentEditingData,
        [event.target.name]: inputValue,
      },
    });
  };

  onRulesInputChange = (event, ruleId) => {
    let { rules } = this.state.tournamentEditingData;

    rules.forEach(item => {
      if (item.rule._id === ruleId) {
        item.score = parseInt(event.target.value, 10);
      }
    });

    this.setState({
      tournamentEditingData: {
        ...this.state.tournamentEditingData,
        rules,
      },
    });
  }

  async componentDidMount() {
    this.setState({ isLoading: true });
    const { tournaments } = await this.adminService.getFantasyTournaments();
    const { players } = await this.adminService.getAllChampions();

    this.setState({
      tournaments,
      players,
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
      isTournamentDeleting,
      isTournamentEditing,
      isLoading,
    } = this.state;

    const modalTitle = `${i18n.t('editing')} ${tournamentEditingData.name}`;
    const tournamentWinner = tournamentEditingData.winner ? tournamentEditingData.winner.username : i18n.t('tournament_not_finalized');

    let modalActions = [];

    if (!isTournamentEditing) {
      modalActions.push(
        { text: i18n.t('create_tournament'), onClick: this.addChampionSubmit, isDanger: false },
      );
    }

    if (isTournamentEditing) {
      modalActions.push(
        { text: i18n.t('delete_tournament'), onClick: this.deleteTournamentConfirmInit, isDanger: true },
        { text: i18n.t('finalize_tournament'), onClick: this.finalizeTournament, isDanger: true },
        { text: i18n.t('update_tournament'), onClick: this.editTournamentSubmit, isDanger: false},
      );
    }

    return <div className={style.tournaments}>
      <div className={style.controls}>
        <Button
          appearance="_basic-accent"
          text={i18n.t('finalize_all')}
          onClick={this.finalizeTournaments}
          className={style.button}
        />
      </div>

      <Table
        captions={tournamentsTableCaptions}
        items={tournaments}
        className={style.table}
        renderRow={this.renderRow}
        isLoading={isLoading}
        emptyMessage={i18n.t('there_is_no_tournaments_yet')}
      />

      {isTournamentEditing &&
        <Modal
          title={modalTitle}
          close={this.resetTournamentEditing}
          actions={modalActions}
        >

          {isLoading && <Preloader />}

          {isTournamentDeleting &&
            <ModalAsk
              textModal={i18n.t('want_delete_tournament')}
              submitClick={this.deleteTournamentAccept}
              closeModal={this.deleteTournamentDecline}
            />
          }

          <Input
            label={i18n.t('tournament_name')}
            name="name"
            value={tournamentEditingData.name}
            onChange={this.handleInputChange}
            className={style.tournament_input}
          />
          <Input
            label={i18n.t('entry_sum')}
            name="entry"
            value={tournamentEditingData.entry}
            onChange={this.handleInputChange}
            className={style.tournament_input}
          />
          <Input
            label={i18n.t('winner')}
            name="winner"
            value={tournamentWinner}
            onChange={this.handleInputChange}
            className={style.tournament_input}
            disabled
          />

          <div className={style.rules_inputs}>
            {tournamentEditingData.rules.map(item => {
              return <Input
                key={item.rule._id}
                label={item.rule.name}
                placeholder={item.rule.name}
                className={style.rule_input}
                name={item.rule._id}
                onChange={(event) => this.onRulesInputChange(event, item.rule._id)}
                value={item.score}
                type="number"
                min="-10"
              />;
            })}
          </div>

        </Modal>
      }
    </div>;
  }
}

export default FantasyTournaments;