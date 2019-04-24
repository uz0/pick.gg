import React, { Component } from 'react';
import moment from 'moment';
import { withRouter } from 'react-router';

import groupBy from 'lodash/groupBy';
import findIndex from 'lodash/findIndex';

import Input from '../input';
import Button from '../button';
import Modal from '../../components/dashboard-modal';
import { ReactComponent as CloseIcon } from '../../assets/close.svg';

import http from '../../services/httpService';
import AdminService from '../../services/adminService';
import NotificationService from '../../services/notificationService';
import TournamentService from '../../services/tournamentService';
import UserService from '../../services/userService';

import classnames from 'classnames'; 
import style from './style.module.css';
import i18n from 'i18n';

const cx = classnames.bind(style);

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
    const playersSortedByAlphabet = players.sort((prev, next) => prev.name.localeCompare(next.name));

    const groupedPlayers = groupBy(playersSortedByAlphabet, player => player.name[0].toUpperCase());

    // console.log(groupedPlayers, 'groupedPlayers');

    // groupedPlayers['1-9'] = 

    // console.log(Object.keys(groupedPlayers));
    // console.log(Object.values(groupedPlayers));

    const rulesValues = rules.reduce((obj, rule) => {
      obj[rule._id] = 0;
      return obj;
    }, {});

    this.setState({
      players: groupedPlayers,
      rules,
      user,
      rulesValues,
    });
  }

  state = {
    players: [],
    chosenPlayers: [],
    rulesValues: {},
    rules: [],
    championData: {
      name: '',
      photo: '',
      position: ''
    },
    isPlayerCreating: false,
    modalChoose: false,
  }

  showModal = () => this.setState({ modalChoose: true });

  closeModalChoose = () => this.setState({ modalChoose: false });

  showPlayerCreatingModal = () => this.setState({ isPlayerCreating: true });
  
  closePlayerCreatingModal = () => this.setState({
    championData: [],
    isPlayerCreating: false,
  });

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

  handleChange = (event, input) => this.setState({ [input]: event.target.value });

  handleChampionInputChange = (event) => {
    this.setState({
      championData: {
        ...this.state.championData,
        [event.target.name]: event.target.value,
      },
    });
  };

  playerClickHandler = (player) => {
    let { chosenPlayers } = this.state;
    const index = findIndex(chosenPlayers, { _id: player._id });

    if (index === -1 && chosenPlayers.length === 10) {
      return;
    }

    if (index === -1) {
      chosenPlayers.push(player);
    } else {
      chosenPlayers.splice(index, 1);
    }

    this.setState({ chosenPlayers });
  }

  submitPlayerCreatingForm = () => {
    const { name, photo, position } = this.state.championData;

    if(name.length === 0 || name.position === 0) {
      this.notificationService.showSingleNotification({
        type: 'warning',
        shouldBeAddedToSidebar: false,
        message: `Fields name and position are required`,
      });
    }

    if(name.length > 20) {
      this.notificationService.showSingleNotification({
        type: 'warning',
        shouldBeAddedToSidebar: false,
        message: `Name can not contain more than 20 characters`,
      });
    }

    console.log(this.state.championData);
    console.log('submitted!');
  }

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

    if (!name) {
      this.notificationService.showSingleNotification({
        type: 'error',
        shouldBeAddedToSidebar: false,
        message: "Tournament name field shouldn't be empty",
      });

      return;
    }

    if (!entry) {
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

          {/* {this.state.modalChoose && <Modal
            textModal={i18n.t('really_want_create')}
            closeModal={this.closeModalChoose}
            submitClick={this.submitForm}
          />
          } */}

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

        <Modal
          title={'Choose 10 players'}
          wrapClassName={style.players_modal}
        >

          <div className={style.players_sidebar}>
            <h3>Chosen players</h3>

            {this.state.chosenPlayers.length === 0 && 
              <p className={style.attention}>You haven't chosen any players yet</p>
            }
            
            {this.state.chosenPlayers.length > 1 && this.state.chosenPlayers.length < 10 && 
              <p className={style.attention}>Great! {10 - this.state.chosenPlayers.length} players left</p>
            }

            <div className={style.chosen_players}>
              {this.state.chosenPlayers.map((item, index) => <div>{`${index + 1}. ${item.name}`}</div>)}
            </div>

            <p>Cannot find your player?</p>

            <Button
              text='Create new player'
              appearance='_basic-accent'
              onClick={this.showPlayerCreatingModal}
            />
          </div>

          <div className={style.players_list}>
            {Object.keys(this.state.players).map((item, index) => <div key={item} className={style.group}>
              <h3>{item}</h3>
              <div className={style.group_players}>
                {Object.values(this.state.players)[index].map(element => <div
                  key={element._id}
                  onClick={() => this.playerClickHandler(element)}
                  className={cx(style.player, { [style.selected]: findIndex(this.state.chosenPlayers, { _id: element._id }) !== -1 })}
                >
                  {element.name}
                </div>)
                }
              </div>
            </div>)}
          </div>

          {this.state.isPlayerCreating && <Modal
              title={'Create new player'}
              wrapClassName={style.create_player_modal}
              close={this.closePlayerCreatingModal}
              actions={[{
                text: 'Add player',
                onClick: this.submitPlayerCreatingForm,
                isDanger: true
              }]}
            >
              <div className={style.inputs}>
                <Input
                  label={i18n.t('champion_name')}
                  name="name"
                  value={this.state.championData.name || ''}
                  onChange={this.handleChampionInputChange}
                />
                <Input
                  label={i18n.t('champion_photo')}
                  name="photo"
                  value={this.state.championData.photo || ''}
                  onChange={this.handleChampionInputChange}
                />
                <Input
                  label={i18n.t('champion_position')}
                  name="position"
                  value={this.state.championData.position || ''}
                  onChange={this.handleChampionInputChange}
                />
              </div>
            </Modal>
          }
        </Modal>
      </div>
    );
  }
}

export default withRouter(NewStreamerTournament);