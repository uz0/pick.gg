import React, { useState } from 'react';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import { actions as tournamentsActions } from 'pages/tournaments';

import Modal from 'components/modal';
import TextArea from 'components/text-area';

import { http } from 'helpers';

import i18n from 'i18n';

import style from './style.module.css';

const AddRules = props => {
  const [rules, setRules] = useState(props.tournament.rules);

  const handleInputChange = e => {
    const { value } = e.target;
    setRules(value);
  };

  const handleSubmit = async () => {
    const { tournamentId } = props.options;
    const { game } = props.tournament;

    try {
      await http(`/api/tournaments/${tournamentId}`, {
        headers: {
          'Content-Type': 'application/json',
        },
        method: 'PATCH',
        body: JSON.stringify({ rules, game }),
      });

      props.updateTournament({
        _id: props.tournament._id,
        rules,
      });

      props.close();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Modal
      title={props.options.isEditing ? i18n.t('modal.edit_rules') : i18n.t('modal.add_rules')}
      close={props.close}
      className={style.modal_content}
      wrapClassName={style.wrapper}
      actions={[
        {
          text: props.options.isEditing ? i18n.t('edit') : i18n.t('add'),
          type: 'button',
          appearance: '_basic-accent',
          onClick: handleSubmit,
          disabled: props.isSubmitting,
        },
      ]}
    >
      <TextArea
        name="rules"
        label="Rules. Learn more"
        value={rules}
        className={style.rulearea}
        onChange={handleInputChange}
      />
    </Modal>
  );
};

const enhance = compose(
  connect(
    (state, props) => ({
      tournament: state.tournaments.list[props.options.tournamentId],
    }),

    {
      updateTournament: tournamentsActions.updateTournament,
    }
  )
);

export default enhance(AddRules);
