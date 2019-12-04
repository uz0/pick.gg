import React, { useState } from 'react';
import { connect } from 'react-redux';
import { compose, withProps } from 'recompose';
import { actions as tournamentsActions } from 'pages/tournaments';
import classnames from 'classnames/bind';

import Modal from 'components/modal';
import TextArea from 'components/form/text-area';
import Table from 'components/table';

import { http } from 'helpers';

import i18n from 'i18n';

import style from './style.module.css';
import { RULES } from '../../../constants';

const cx = classnames.bind(style);

const tableCaptions = {
  rule: {
    text: i18n.t('rule_name'),
    width: window.innerWidth < 480 ? 120 : 150,
  },

  description: {
    text: i18n.t('description'),
    width: window.innerWidth < 480 ? 75 : 100,
  },
};

const renderRow = ({ className, itemClass, textClass, item, captions }) => {
  const ruleStyle = { '--width': captions.rule.width };
  const descriptionStyle = { '--width': captions.description.width };

  return (

    <div key={item.rule} className={cx(className, style.row)}>
      <div className={cx(itemClass, style.number)} style={ruleStyle}>
        <span className={textClass}>{item.rule}</span>
      </div>

      <div className={itemClass} style={descriptionStyle}>
        <span className={textClass}>{item.description}</span>
      </div>
    </div>
  );
};

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
      actions={[{
        text: props.options.isEditing ? i18n.t('edit') : i18n.t('add'),
        type: 'button',
        appearance: '_basic-accent',
        onClick: handleSubmit,
        disabled: props.isSubmitting,
      }]}
    >
      <Table
        captions={tableCaptions}
        items={props.ruleNames}
        renderRow={renderRow}
        isLoading={false}
        className={style.table}
        emptyMessage={i18n.t('no_game_rules_help')}
      />
      <TextArea
        name="rules"
        label="Write your rules below"
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
  ),
  withProps(props => {
    const normalizedRules = Object.entries(RULES[props.tournament.game])
      .reduce((acc, [key, rules]) => ([
        ...acc,
        ...rules.map(item => ({
          rule: `${key}.${item.ruleName}`,
          description: item.description,
        })),
      ]), []);

    return {
      ruleNames: normalizedRules,
    };
  })
);

export default enhance(AddRules);
