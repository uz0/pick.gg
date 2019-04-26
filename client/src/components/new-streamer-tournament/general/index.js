import React, { Component } from 'react';
import moment from 'moment';
import { withRouter } from 'react-router';

import groupBy from 'lodash/groupBy';
import findIndex from 'lodash/findIndex';

import Input from 'components/input';
import Button from 'components/button';
import Preloader from 'components/preloader';
import Modal from 'components/dashboard-modal';

import http from 'services/httpService';
import AdminService from 'services/adminService';
import NotificationService from 'services/notificationService';
import StreamerService from 'services/streamerService';
import TournamentService from 'services/tournamentService';
import UserService from 'services/userService';

import classnames from 'classnames';
import style from './style.module.css';
import i18n from 'i18n';

const cx = classnames.bind(style);

class GeneralStep extends Component {
  constructor() {
    super();
    this.notificationService = new NotificationService();
  }

  state = {
    name: '',
    thumbnail: '',
    entry: '',
    rules: [],
    rulesValues: {},
    isLoading: true,
  }

  async componentDidMount() {
    this.setState({ isLoading: true });

    const { rules } = await http('/api/rules').then(res => res.json());

    const rulesValues = rules.reduce((obj, rule) => {
      obj[rule._id] = 0;
      return obj;
    }, {});

    this.setState({
      rules,
      rulesValues,
      isLoading: false,
    });
  }

  handleChange = (event, input) => this.setState({ [input]: event.target.value });

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

  nextStep = () => {
    const { name, entry, thumbnail, rules, rulesValues } = this.state;

    if(name === '' || entry === ''){
      this.notificationService.showSingleNotification({
        type: 'error',
        shouldBeAddedToSidebar: false,
        message: 'Name and entry fields can not be empty',
      });

      return;
    }

    const payload = {
      name,
      entry,
      rules,
      thumbnail,
      rulesValues,
    }

    this.props.nextStep(payload);
  }

  renderRuleInput = ({ _id, name }) => {
    return <div key={_id} className={style.input}>
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
    return (
      <div className={style.general}>
        {this.state.isLoading &&
          <Preloader isFullScreen={false} />
        }

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

        <div className={style.input_group}>
          <p>{i18n.t('rules')}</p>
          <div className={style.rules_inputs}>
            {this.state.rules.map(item => this.renderRuleInput(item))}
          </div>
        </div>

        <div className={style.controls}>
          <Button
            className={style.next}
            appearance={'_basic-accent'}
            text='next'
            icon={<i className='material-icons'>arrow_forward</i>}
            onClick={this.nextStep}
          />
        </div>

      </div>
    );
  }
}

export default GeneralStep;