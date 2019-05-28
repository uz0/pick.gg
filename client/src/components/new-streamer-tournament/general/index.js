import React, { Component } from 'react';

import Input from 'components/input';
import Button from 'components/button';
import Preloader from 'components/preloader';

import http from 'services/httpService';
import NotificationService from 'services/notificationService';

import style from './style.module.css';
import i18n from 'i18n';

class GeneralStep extends Component {
  constructor() {
    super();
    this.notificationService = new NotificationService();
  }

  state = {
    name: '',
    thumbnail: '',
    rules: [],
    rulesValues: {},
    isLoading: true,
  }

  async componentDidMount() {
    this.setState({ isLoading: true });

    const { rules } = await http('/public/rules').then(res => res.json());

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
    const { name, thumbnail, rules, rulesValues } = this.state;

    if (!name){
      this.notificationService.showSingleNotification({
        type: 'error',
        shouldBeAddedToSidebar: false,
        message: i18n.t('new_tournament.empty_name'),
      });

      return;
    }

    const payload = {
      name,
      rules,
      thumbnail,
      rulesValues,
    };

    this.props.nextStep(payload);
  }

  renderRuleInput = ({ _id, name }) => {
    return <div key={_id} className={style.input}>
      <input
        max='10'
        type='number'
        name={_id}
        onChange={this.onRuleInputChange}
        value={this.state.rulesValues[_id]}
      />
      <label>
        {i18n.t(name)}
      </label>
    </div>;
  }

  render() {
    return (
      <div className={style.general}>
        {this.state.isLoading &&
          <Preloader isFullScreen={false} />
        }

        <div className={style.input_group}>
          <Input
            label={i18n.t('tournament_name')}
            value={this.state.name}
            onInput={(event) => this.handleChange(event, 'name')}
          />

          <Input
            label={i18n.t('tournament_thumb')}
            value={this.state.thumbnail}
            onInput={(event) => this.handleChange(event, 'thumbnail')}
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
            text={i18n.t('next')}
            icon={<i className='material-icons'>arrow_forward</i>}
            onClick={this.nextStep}
          />
        </div>

      </div>
    );
  }
}

export default GeneralStep;