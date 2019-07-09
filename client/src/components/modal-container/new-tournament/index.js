import React, { Component } from 'react';
import compose from 'recompose/compose';
import find from 'lodash/find';
import findIndex from 'lodash/findIndex';
import get from 'lodash/get';
import { connect } from 'react-redux';
import Modal from 'components/modal';
import { Formik, Form } from 'formik';
import Input from 'components/form/input';
import Button from 'components/button';
import modalActions from '../actions';
import * as Yup from 'yup';
import style from './style.module.css';

import DefaultAvatar from 'assets/avatar-placeholder.svg';

const _players = [
  { _id: '1dsfdsfffwee', name: 'ADD', position: 'Top' },
  { _id: '2dsfdsfffwee', name: 'Aiming', position: 'Top' },
  { _id: '3dsfdsfffwee', name: 'Alphari', position: 'Top' },
  { _id: '4dsfdsfffwee', name: 'AmazingJ', position: 'Top' },
  { _id: '5dsfdsfffwee', name: 'Bang', position: 'Top' },
  { _id: '6dsfdsfffwee', name: 'Biubiu', position: 'Top' },
  { _id: '7dsfdsfffwee', name: 'Bjergsen', position: 'Top' },
  { _id: '8dsfdsfffwee', name: 'Broken', position: 'Top' },
  { _id: 'd11sfdsfffwee', name: 'Sangyoon', position: 'Top' },
  { _id: '22dsfdsfffwee', name: 'Selfmade', position: 'Top' },
  { _id: 'dsfdfdsfffwee', name: 'ShowMaker', position: 'Top' },
  { _id: 'dssdfdsfffwee', name: 'Santorin', position: 'Top' },
  { _id: 'ddfdsdsfdsfffwee', name: '369', position: 'Top' },
  { _id: 'dddfdsdsfdsfffwee', name: '169', position: 'Top' },
  { _id: 'dfdfdsdsfdsfffwee', name: '669', position: 'Top' },
];

const formSchema = Yup.object().shape({
  name: Yup.string()
    .required('Required'),

  'rule-kills': Yup.number()
    .min(-10, 'Should be -10 and more')
    .max(10, 'Should be 10 and less')
    .integer('Should be integer'),

  'rule-deaths': Yup.number()
    .min(-10, 'Should be -10 and more')
    .max(10, 'Should be 10 and less')
    .integer('Should be integer'),

  'rule-assists': Yup.number()
    .min(-10, 'Should be -10 and more')
    .max(10, 'Should be 10 and less')
    .integer('Should be integer'),
});

const initialValues = {
  name: '',
  image: '',
  'rule-kills': 0,
  'rule-deaths': 0,
  'rule-assists': 0,
  players: [],
  matches: [],
};

class NewTournament extends Component {
  state = {
    slide: 1,
  };

  submit = (values, actions) => {
    console.log(values);
    console.log(actions);
  };

  onPlayersChoose = ({ ids, formProps }) => formProps.setFieldValue('players', ids);

  onMatchAdd = ({ data, formProps }) => formProps.setFieldValue('matches', data);

  prevSlide = () => this.setState(prevState => ({
    slide: prevState.slide - 1,
  }));

  nextSlide = () => this.setState(prevState => ({
    slide: prevState.slide + 1,
  }));

  deleteMatch = (uid, props) => () => {
    const matches = [...props.values.matches];
    const matchIndex = findIndex(matches, { uid });
    matches.splice(matchIndex, 1);
    props.setFieldValue('matches', matches);
  };

  openEditMatch = (uid, props) => () => this.props.toggleModal({
    id: 'add-match-modal',

    options: {
      onAdd: this.onMatchAdd,
      formProps: props,
      editUid: uid,
    },
  });

  openAddMatchModal = props => () => this.props.toggleModal({
    id: 'add-match-modal',

    options: {
      onAdd: this.onMatchAdd,
      formProps: props,
    },
  });

  openChoosePlayersModal = props => () => this.props.toggleModal({
    id: 'choose-players-modal',

    options: {
      onChoose: this.onPlayersChoose,
      formProps: props,
    },
  });

  render() {
    const stepName = ['New tournament', 'Tournament players', 'Tournament matches'][this.state.slide - 1];

    return (
      <Formik
        initialValues={initialValues}
        validationSchema={formSchema}
        onSubmit={this.submit}
      >
        {props => {
          let isNextDisabled;

          if (this.state.slide === 1) {
            if (!props.touched.name) {
              isNextDisabled = true;
            }

            if (props.touched.name) {
              isNextDisabled = !props.isValid;
            }
          }

          if (this.state.slide === 2) {
            isNextDisabled = !props.touched.players && props.values.players.length !== 10;
          }

          const actions = [];

          if (this.state.slide > 1) {
            actions.push({
              text: 'Prev',
              appearance: '_basic-accent',
              className: style.prev_slide,
              onClick: this.prevSlide,
            });
          }

          if (this.state.slide < 3) {
            actions.push({
              text: 'Next',
              appearance: '_basic-accent',
              className: style.next_slide,
              onClick: this.nextSlide,
              disabled: isNextDisabled,
            });
          }

          if (this.state.slide === 3) {
            actions.push({
              text: 'Create',
              appearance: '_basic-accent',
              className: style.next_slide,
              onClick: props.submitForm,
              disabled: isNextDisabled,
            });
          }

          const isPlayersChoosed = this.state.slide === 2 && props.values.players.length === 10;
          const isMatches = this.state.slide === 3 && props.values.matches.length > 0;

          return (
            <Modal
              title="New Tournament"
              close={this.props.close}
              className={style.modal_content}
              actions={actions}
            >
              <div className={style.header}>
                <h3 className={style.step_title}>Step {this.state.slide} of 3: {stepName}</h3>

                {this.state.slide === 2 && (
                  <Button
                    appearance="_icon-accent"
                    icon={isPlayersChoosed ? 'edit' : 'plus'}
                    className={style.choose}
                    onClick={this.openChoosePlayersModal(props)}
                  />
                )}

                {this.state.slide === 3 && (
                  <Button
                    appearance="_icon-accent"
                    icon={isPlayersChoosed ? 'edit' : 'plus'}
                    className={style.choose}
                    onClick={this.openAddMatchModal(props)}
                  />
                )}
              </div>

              <Form className={style.form}>
                {this.state.slide === 1 && (
                  <div className={style.main_info}>
                    <Input
                      label="Tournament name"
                      name="name"
                      formProps={props}
                      className={style.field}
                    />

                    <Input
                      label="Tournament image link"
                      name="image"
                      formProps={props}
                      className={style.field}
                    />

                    <p className={style.subtitle}>Rules</p>

                    <div className={style.rules_list}>
                      <Input
                        label="Kills"
                        name="rule-kills"
                        type="number"
                        formProps={props}
                        className={style.rule}
                      />

                      <Input
                        label="Deaths"
                        name="rule-deaths"
                        type="number"
                        formProps={props}
                        className={style.rule}
                      />

                      <Input
                        label="Assists"
                        name="rule-assists"
                        type="number"
                        formProps={props}
                        className={style.rule}
                      />
                    </div>
                  </div>
                )}

                {this.state.slide === 2 && (
                  <div className={style.main_players}>
                    {isPlayersChoosed &&
                    props.values.players.map(id => {
                      const player = find(_players, { _id: id });
                      const image = get(player, 'image', DefaultAvatar);

                      return (
                        <div key={player._id} className={style.player}>
                          <div className={style.image}>
                            <img src={image} alt="Avatar"/>
                          </div>

                          <p className={style.name}>{player.name}</p>
                          <span className={style.position}>{player.position}</span>
                        </div>
                      );
                    })
                    }
                  </div>
                )}

                {this.state.slide === 3 && (
                  <div className={style.matches}>
                    {isMatches &&
                    props.values.matches.map((match, index) => (
                      <div key={match.uid} className={style.match}>
                        <p className={style.name}>{index + 1}. {match.name} {match.startTime}</p>

                        <Button
                          appearance="_icon-danger"
                          icon="close"
                          className={style.delete}
                          onClick={this.deleteMatch(match.uid, props)}
                        />

                        <Button
                          appearance="_icon-default"
                          icon="edit"
                          className={style.edit}
                          onClick={this.openEditMatch(match.uid, props)}
                        />
                      </div>
                    ))
                    }
                  </div>
                )}
              </Form>
            </Modal>
          );
        }}
      </Formik>
    );
  }
}

export default compose(
  connect(
    null,

    {
      toggleModal: modalActions.toggleModal,
    },
  ),
)(NewTournament);
