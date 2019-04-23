import React, { Component } from 'react';
import moment from 'moment';
import { withRouter } from 'react-router';

import Input from '../input';
import Button from '../button';
import Modal from '../../components/modal';
import PlayersModal from '../../components/dashboard-modal';
import { ReactComponent as CloseIcon } from '../../assets/close.svg';

import http from '../../services/httpService';
import AdminService from '../../services/adminService';
import NotificationService from '../../services/notificationService';
import TournamentService from '../../services/tournamentService';
import UserService from '../../services/userService';

import style from './style.module.css';
import i18n from 'i18n';

class NewStreamerTournament extends Component {
  constructor() {
    super();
    
    this.adminService = new AdminService();
    this.notificationService = new NotificationService();
    this.tournamentService = new TournamentService();
    this.userService = new UserService();

    this.rules = [];
    this.realTournaments = [];
  }

  async componentDidMount() {
    const { rules } = await http('/api/rules').then(res => res.json());
    const { user } = await this.userService.getMyProfile();

    const { players } = await this.adminService.getAllChampions();
    const sortedPlayers = players.sort((prev, next) => prev.name.localeCompare(next.name));

    const rulesValues = rules.reduce((obj, rule) => {
      obj[rule._id] = 0;
      return obj;
    }, {});

    this.setState({
      players: sortedPlayers,
      rules,
      user,
      rulesValues,
    });
  }

  state = {
    players: [],
    rulesValues: {},
    rules: [],
    modalChoose: false,
  }

  showModal = () => this.setState({ modalChoose: true });

  closeModalChoose = () => this.setState({ modalChoose: false });

  onRuleInputChange = event => {
    const formattedInputValue = parseInt(event.target.value, 10);
    let value = 0;

    if (formattedInputValue <= 10 && formattedInputValue >= 0) {
      value = formattedInputValue;
    }
    
    if (formattedInputValue >= 10) {
      value = 10;
    }
    
    if (formattedInputValue <= 0) {
      value = 0;
    }

    this.setState({
      rulesValues: {
        ...this.state.rulesValues,
        [event.target.name]: value,
      },
    });
  }

  onChange = event => this.setState({ [event.target.name]: event.target.value });

  handleChange = (event, input) => this.setState({ [input]: event.target.value });

  submitForm = async () => {
    this.setState({ modalChoose: false });

    const {
      user,
      name,
      entry,
      thumbnail,
      rulesValues,
      tournament,
    } = this.state;

    let tournamentId = '';

    if (!name){
      this.notificationService.showSingleNotification({
        type: 'error',
        shouldBeAddedToSidebar: false,
        message: "Tournament name field shouldn't be empty",
      });

      return;
    }

    if (!entry){
      this.notificationService.showSingleNotification({
        type: 'error',
        shouldBeAddedToSidebar: false,
        message: "Entry field shouldn't be empty",
      });

      return;
    }
    
    if (user.balance < entry) {
      this.notificationService.showSingleNotification({
        type: 'error',
        shouldBeAddedToSidebar: false,
        message: `Insufficient funds ${entry - user.balance}$`,
      });

      return;
    }

    if (!tournament) {
      this.notificationService.showSingleNotification({
        type: 'error',
        shouldBeAddedToSidebar: false,
        message: 'Please, select tournament and try again',
      });

      return;
    }

    this.props.onClose();

    const normalizedRules = Object.keys(rulesValues).map(item => ({
      rule: item,
      score: rulesValues[item],
    }));

    const payload = {
      name,
      thumbnail,
      entry,
      rules: [...normalizedRules],
    };

    const { newTournament } = await this.tournamentService.createNewTournament(payload);

    this.notificationService.showSingleNotification({
      type: 'success',
      shouldBeAddedToSidebar: false,
      message: `You've created tournament ${name}`,
    })

    this.props.history.push(`/tournaments/${newTournament._id}`);
  }

  renderRuleInput = ({ _id, name }) => {
    return <div key={_id} className={style.input_rules}>
      <input
        max="10"
        type="number"
        name={_id}
        onChange={this.onRuleInputChange}
        value={this.state.rulesValues[_id]}
        defaultValue={this.state.rulesValues[_id]}
      />
      <label>
        {i18n.t(name)}
      </label>
    </div>
  }

  render() {
    const { onClose } = this.props;
    const areRulesLoading = this.state.rules.length === 0;

    return (
      <div className={style.wrapper}>
        <div className={style.tournament}>

          {this.state.modalChoose && <Modal
              textModal={i18n.t('really_want_create')}
              closeModal={this.closeModalChoose}
              submitClick={this.submitForm}
            />
          }

          <form onSubmit={(event) => { event.preventDefault(); this.showModal(); }}>

            <Button
              className={style.close}
              appearance={'_icon-transparent'}
              icon={<CloseIcon />}
              onClick={onClose}
            />

            <div>
              <div className={style.input_group}>
                <Input
                  label={i18n.t('tournaments_name')}
                  value={this.state.name}
                  onInput={(event) => this.handleChange(event, 'name')}
                />

                <Input
                  label={i18n.t('tournament_thumb')}
                  value={this.state.thumbnail}
                  onInput={(event) => this.handleChange(event, 'thumbnail')}
                />

                <Input
                  label={i18n.t('entry')}
                  value={this.state.entry}
                  onInput={(event) => this.handleChange(event, 'entry')}
                />
              </div>
              
              <p>Tournament players</p>
              <div>
                <Button
                  appearance={'_basic-accent'}
                  type={'submit'}
                  text={'Choose players'}
                />
              </div>

              <p>{i18n.t('rules')}</p>
              
              <div className={style.rules_inputs}>
                {this.state.rules.map(item => this.renderRuleInput(item))}
              </div>
              
              <div className={style.submit}>
                <Button
                  appearance={'_basic-accent'}
                  type={'submit'}
                  text={i18n.t('create')}
                />
              </div>

            </div>
          </form>
        </div>

        <PlayersModal
          title={'Choose 10 players'}
        >
          <div style={style.players}>
            {this.state.players.map(player => <p>{player.name}</p>)}
          </div>
        </PlayersModal>

      </div>
    );
  }
}

export default withRouter(NewStreamerTournament);