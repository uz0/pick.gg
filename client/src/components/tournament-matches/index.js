import React, { Component } from 'react';
import compose from 'recompose/compose';
import { connect } from 'react-redux';
import i18n from 'i18n';
import Table from 'components/table';
import Icon from 'components/icon';
import classnames from 'classnames/bind';
import { actions as modalActions } from 'components/modal-container';
import style from './style.module.css';

const tableCaptions = {
  name: {
    text: i18n.t('name'),
    width: window.innerWidth < 480 ? 100 : 150,
  },

  points: {
    text: i18n.t('points'),
    width: window.innerWidth < 480 ? 75 : 120,
  },
};

const cx = classnames.bind(style);

class Matches extends Component {
  openMatchDetails = () => {
    this.props.toggleModal({ id: 'match-results-modal' });
  };

  renderRow = ({ className, itemClass, textClass, item }) => {
    const nameStyle = { '--width': tableCaptions.name.width };
    const pointsStyle = { '--width': tableCaptions.points.width };

    return (
      <div key={item} className={className}>
        <div className={itemClass} style={nameStyle}>
          <span className={textClass}>ФИНАЛ</span>
        </div>

        <div className={itemClass} style={pointsStyle}>
          <span className={style.points}>+123</span>
        </div>

        <div className={cx(itemClass, 'date')}>
          <span className={textClass}>07:22</span>
        </div>

        <button className={style.button} type="button" onClick={this.openMatchDetails}>
          <Icon name="list"/>
        </button>

        <button className={style.button} type="button">
          <Icon name="info"/>
        </button>
      </div>
    );
  };

  componentWillMount() {
  }

  render() {
    return (
      <div className={style.matches}>
        <h3 className={style.subtitle}>Matches</h3>

        <Table
          noCaptions
          captions={tableCaptions}
          items={this.props.tournament.matches_ids}
          renderRow={this.renderRow}
          isLoading={false}
          className={style.table}
          emptyMessage="There is no matches yet"
        />
      </div>
    );
  }
}

export default compose(
  connect(
    (state, props) => ({
      tournament: state.tournaments.list[props.id],
    }),

    {
      toggleModal: modalActions.toggleModal,
    },
  ),
)(Matches);
