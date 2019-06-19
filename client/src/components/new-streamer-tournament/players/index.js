import React, { Component } from 'react';

import groupBy from 'lodash/groupBy';
import findIndex from 'lodash/findIndex';

import Input from 'components/input';
import Button from 'components/button';
import Preloader from 'components/preloader';
import Modal from 'components/dashboard-modal';

import Avatar from 'assets/avatar-placeholder.svg';

import NotificationService from 'services/notificationService';
import StreamerService from 'services/streamerService';

import classnames from 'classnames';
import style from './style.module.css';
import i18n from 'i18n';

const cx = classnames.bind(style);

class PlayersStep extends Component {
  constructor() {
    super();

    this.notificationService = new NotificationService();
    this.streamerService = new StreamerService();

    this.rules = [];
    this.realTournaments = [];
  }

  async componentDidMount() {
    this.setState({ arePlayersLoading: true });

    const { players } = await this.streamerService.getAllChampions();
    const groupedPlayers = this._sortPlayers(players);

    this.setState({
      players: groupedPlayers,
      playersNoGroup: players,
      arePlayersLoading: false,
    });
  }

  state = {
    players: [],
    playersNoGroup: [],
    chosenPlayers: [],
    playersAddedToTournament: [],
    championData: {
      name: '',
      photo: '',
      position: '',
    },
    isPlayerChoosing: false,
    isPlayerCreating: false,
    isChampionModalLoading: false,
    arePlayersLoading: false,
    term: '',
  }

  _sortPlayers = players => {
    const playersWithNumberNick = players.filter(player => /^\d+$/.test(player.name[0]));
    const playersWithCharNick = players.filter(player => !/^\d+$/.test(player.name[0])).sort((prev, next) => prev.name.localeCompare(next.name));

    return [
      ...Object.entries(groupBy(playersWithCharNick, player => player.name[0].toUpperCase())),
      ...Object.entries(groupBy(playersWithNumberNick, player => player.name[0])),
    ];
  }

  search = event => {
    this.setState({
      term: event.target.value,
    });
  }

  searchingFor = term => x => x.name.toLowerCase().startsWith(term.toLowerCase()) || !term;

  showPlayerCreatingModal = () => this.setState({ isPlayerCreating: true });

  closePlayerCreatingModal = () => this.setState({
    championData: [],
    isPlayerCreating: false,
  });

  showPlayerChoosingModal = () => this.setState({ isPlayerChoosing: true });

  closePlayerChoosingModal = () => this.setState({
    isPlayerChoosing: false,
  });

  handleChampionInputChange = event => {
    this.setState({
      championData: {
        ...this.state.championData,
        [event.target.name]: event.target.value,
      },
    });
  };

  nextStep = () => {
    const { playersAddedToTournament } = this.state;

    if (playersAddedToTournament.length !== 10) {
      this.notificationService.showSingleNotification({
        type: 'error',
        shouldBeAddedToSidebar: false,
        message: i18n.t('tournament_must_have'),
      });

      return;
    }

    const payload = {
      players: playersAddedToTournament,
    };

    this.props.nextStep(payload);
  }

  addPlayersToTournament = () => {
    this.setState({
      playersAddedToTournament: this.state.chosenPlayers,
      isPlayerChoosing: false,
    });
  }

  playerClickHandler = player => {
    const { chosenPlayers } = this.state;
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

  clearSearch = () => this.setState({ term: '' })

  submitPlayerCreatingForm = async event => {
    event.preventDefault();

    const { name, photo, position } = this.state.championData;

    if (name.length === 0 || name.position === 0) {
      this.notificationService.showSingleNotification({
        type: 'warning',
        shouldBeAddedToSidebar: false,
        message: i18n.t('fields_required'),
      });

      return;
    }

    if (name.length > 20) {
      this.notificationService.showSingleNotification({
        type: 'warning',
        shouldBeAddedToSidebar: false,
        message: i18n.t('name_contain'),
      });

      return;
    }

    const payload = {
      name,
      photo,
      position,
    };

    try {
      this.setState({ isChampionModalLoading: true });

      const createPlayerRequest = await this.streamerService.createPlayer(payload);
      const { name, error, type } = await createPlayerRequest.json();

      if (createPlayerRequest.status === 404) {
        this.notificationService.showSingleNotification({
          type: 'error',
          shouldBeAddedToSidebar: false,
          message: i18n.t('serverErrors.champion_not_found', { name }),
        });

        this.setState({ isChampionModalLoading: false });

        return;
      }

      if (createPlayerRequest.status === 400) {
        const message = type === 'position' ? i18n.t(error) : i18n.t(error, { name });

        this.notificationService.showSingleNotification({
          type: 'error',
          shouldBeAddedToSidebar: false,
          message,
        });

        this.setState({ isChampionModalLoading: false });

        return;
      }

      this.notificationService.showSingleNotification({
        type: 'success',
        shouldBeAddedToSidebar: false,
        message: i18n.t('notifications.player.created', { name }),
      });

      const { players } = await this.streamerService.getAllChampions();
      const groupedPlayers = this._sortPlayers(players);

      this.setState({
        players: groupedPlayers,
        championData: {
          name: '',
          photo: '',
          position: '',
        },
        isChampionModalLoading: false,
      });
    } catch (error) {
      console.log(error);
    }
  }

  onError = item => {
    item.target.src = Avatar;
  };

  renderChampion = ({ _id, name, photo, position }) => (
    <div
      key={_id}
      className={style.champion}
    >
      <div className={style.image}>
        <img src={photo ? photo : Avatar} alt={i18n.t('champion_avatar')} onError={this.onError}/>
      </div>

      <p className={style.name}>{name}</p>

      {position && (
        <div className={style.position}>
          {position}
        </div>
      )}
    </div>
  )

  render() {
    const { playersAddedToTournament, term, playersNoGroup, players } = this.state;
    const buttonIcon = playersAddedToTournament.length === 0 ? 'add' : 'edit';
    const filteredPlayers = playersNoGroup.filter(this.searchingFor(term));
    const isTherePlayersWithNoGroup = playersNoGroup.length > 1;
    const isSearchHasResults = playersNoGroup.filter(this.searchingFor(term)).length > 0;

    return (
      <div className={style.players}>
        <div className={style.header_players}>
          <h3 className={style.header_step}>{i18n.t('modal.step')} 2 {i18n.t('of')} 3: {i18n.t('tournament_players')}</h3>
          <Button
            className={style.action_button}
            appearance="_circle-accent"
            icon={<i className="material-icons">{buttonIcon}</i>}
            onClick={this.showPlayerChoosingModal}
          />
        </div>

        <div className={style.chosen_champions}>
          {this.state.playersAddedToTournament.map(item => this.renderChampion(item))}
        </div>

        <div className={style.controls}>
          {this.state.stepIndex !== 1 && (
            <Button
              className={style.prev}
              appearance="_basic-accent"
              text={i18n.t('prev')}
              onClick={this.props.prevStep}
            />
          )
          }

          {this.state.stepIndex !== 3 && (
            <Button
              className={style.next}
              appearance="_basic-accent"
              text={i18n.t('next')}
              onClick={this.nextStep}
            />
          )
          }
        </div>

        {this.state.isPlayerChoosing && (
          <Modal
            title={i18n.t('choose_10')}
            close={this.closePlayerChoosingModal}
            wrapClassName={style.players_modal}
          >

            <div className={style.players_sidebar}>
              <h3>{i18n.t('chosen_players')}</h3>

              {this.state.chosenPlayers.length === 0 &&
                <p className={style.attention}>{i18n.t('you_not_chosen')}</p>
              }

              <div className={style.chosen_players}>
                {this.state.chosenPlayers.map((item, index) => <div>{`${index + 1}. ${item.name}`}</div>)}
              </div>

              {this.state.chosenPlayers.length === 10 && (
                <div className={style.add_players_to_tournament}>
                  <Button
                    text={i18n.t('add_players')}
                    appearance="_basic-accent"
                    className={style.button_add_players}
                    onClick={this.addPlayersToTournament}
                  />
                </div>
              )}

              <Button
                text={i18n.t('create_new_player')}
                appearance="_basic-default"
                onClick={this.showPlayerCreatingModal}
              />
            </div>

            <div className={style.players_list}>
              {this.state.arePlayersLoading &&
                <Preloader isFullScreen={false}/>
              }

              <div className={style.search_block}>
                <input
                  type="text"
                  placeholder={i18n.t('search')}
                  value={term}
                  className={style.search}
                  onChange={this.search}
                />

                <Button
                  text={i18n.t('clear_button')}
                  appearance="_basic-default"
                  className={style.button_search}
                  onClick={this.clearSearch}
                />
              </div>

              {term.length > 0 && (
                <div className={style.no_grouped}>
                  {filteredPlayers.map(player => (
                    <div
                      key={player._id}
                      className={cx(style.player, { [style.selected]: findIndex(this.state.chosenPlayers, { _id: player._id }) !== -1 })}
                      onClick={() => this.playerClickHandler(player)}
                    >
                      {player.name}
                    </div>
                  ))
                  }

                  {isTherePlayersWithNoGroup && !isSearchHasResults &&
                    <p className={style.attention}>Нет результатов</p>
                  }
                </div>
              )}

              {term.length < 1 && players.map(([key, players]) => (
                <div key={key} className={style.group}>
                  <h3>{key}</h3>
                  <div className={style.group_players}>
                    {players.map(player => (
                      <div
                        key={player._id}
                        className={cx(style.player, { [style.selected]: findIndex(this.state.chosenPlayers, { _id: player._id }) !== -1 })}
                        onClick={() => this.playerClickHandler(player)}
                      >
                        {player.name}
                      </div>
                    ))
                    }
                  </div>
                </div>
              ))}
            </div>

          </Modal>
        )
        }

        {this.state.isPlayerCreating && (
          <Modal
            title={i18n.t('create_new_player')}
            wrapClassName={style.create_player_modal}
            close={this.closePlayerCreatingModal}
            actions={[{
              text: i18n.t('add_player'),
              onClick: this.submitPlayerCreatingForm,
              isDanger: true,
            }]}
          >

            {this.state.isChampionModalLoading &&
              <Preloader isFullScreen={false}/>
            }

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
        )
        }
      </div>
    );
  }
}

export default PlayersStep;
