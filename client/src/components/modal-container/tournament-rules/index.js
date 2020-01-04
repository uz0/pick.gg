import React, { useState } from 'react';
import { connect } from 'react-redux';
import { compose, withProps } from 'recompose';
import isEmpty from 'lodash/isEmpty';
import { actions as tournamentsActions } from 'pages/tournaments';
import classnames from 'classnames/bind';

import Modal from 'components/modal';
import Input from 'components/form/input';
import TextArea from 'components/form/text-area';
import Table from 'components/table';

import { RULES, DEFAULT_RULES } from 'constants/index';

import { http } from 'helpers';
// Import { calcRule } from 'helpers/calc-summoners-points';

import i18n from 'i18n';

import style from './style.module.css';

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
  const { isCurrentUserAdminOrCreator } = props.options;

  const [rules, setRules] = useState(props.initialRules);
  const [rulesTitle, setRulesTitle] = useState(props.tournament.rulesTitle);
  const [rulesTitleInputTouched, setRulesTitleInputTouched] = useState(false);
  const [rulesTitleError, setRulesTitleError] = useState('');
  const [rulesError, setRulesError] = useState('');

  const modalActions = [];

  const textAreaLabel = isCurrentUserAdminOrCreator ? i18n.t('modal.add_rules_label') : i18n.t('modal.rules_formula_label');
  const getModalTitle = () => {
    let title = 'Tournament rules';

    if (isCurrentUserAdminOrCreator) {
      title = props.options.isEditing ? i18n.t('modal.edit_rules') : i18n.t('modal.add_rules');
    }

    return title;
  };

  const handleRulesInputChange = e => {
    const { value } = e.target;
    setRules(value);
  };

  const handleRulesTitleInputChange = e => {
    const { value } = e.target;
    setRulesTitle(value);

    if (!rulesTitleInputTouched) {
      setRulesTitleInputTouched(true);
    }
  };

  const handleInputFocus = () => {
    setRulesError('');
    setRulesTitleError('');
  };

  const handleSubmit = async () => {
    const { tournamentId } = props.options;
    const { game } = props.tournament;

    // // Validating rules
    // const resultStub = {
    //   player: {
    //     kills: 2,
    //     deaths: 2,
    //     assists: 2,
    //     loot: 3,
    //   },
    //   match: {
    //     time: 5000,
    //   },
    // };

    // try {
    //   const result = calcRule(rules, resultStub);

    //   if (!result) {
    //     setError('Expression is not correct');
    //     return;
    //   }
    // } catch (error_) {
    //   setError('Expression is not correct');
    //   return;
    // }

    try {
      await http(`/api/tournaments/${tournamentId}`, {
        headers: {
          'Content-Type': 'application/json',
        },
        method: 'PATCH',
        body: JSON.stringify({ rules, rulesTitle, game }),
      });

      const isTournamentEmpty = isEmpty(props.tournament.rewards);

      props.updateTournament({
        _id: props.tournament._id,
        isEmpty: isTournamentEmpty,
        rules,
        rulesTitle,
      });

      props.close();
    } catch (error) {
      console.log(error);
    }
  };

  if (isCurrentUserAdminOrCreator) {
    modalActions.push({
      text: props.options.isEditing ? i18n.t('edit') : i18n.t('add'),
      type: 'button',
      appearance: '_basic-accent',
      onClick: handleSubmit,
      disabled: props.isSubmitting,
    });
  }

  return (
    <Modal
      title={getModalTitle()}
      close={props.close}
      className={cx(style.modal_content, { [style.withFooterPadding]: !isCurrentUserAdminOrCreator })}
      wrapClassName={style.wrapper}
      actions={modalActions}
    >
      <Input
        isTouched={rulesTitleInputTouched}
        disabled={!isCurrentUserAdminOrCreator}
        name="rulesTitle"
        label={i18n.t('modal.rules_type')}
        value={rulesTitle}
        error={rulesTitleError}
        className={style.rulearea}
        onChange={handleRulesTitleInputChange}
        onFocus={handleInputFocus}
      />
      <Table
        captions={tableCaptions}
        items={props.ruleNames}
        renderRow={renderRow}
        isLoading={false}
        className={style.table}
        emptyMessage={i18n.t('no_game_rules_help')}
      />
      <TextArea
        disabled={!isCurrentUserAdminOrCreator}
        name="rules"
        label={textAreaLabel}
        value={rules}
        error={rulesError}
        className={style.rulearea}
        onChange={handleRulesInputChange}
        onFocus={handleInputFocus}
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
    const { game, rules } = props.tournament;

    const initialRules = isEmpty(rules) ? DEFAULT_RULES[game] : rules;

    const normalizedRules = Object.entries(RULES[game]).reduce(
      (acc, [key, rules]) => [
        ...acc,
        ...rules.map(item => ({
          rule: `${key}.${item.ruleName}`,
          description: item.description,
        })),
      ],
      []
    );

    return {
      initialRules,
      ruleNames: normalizedRules,
    };
  })
);

export default enhance(AddRules);
