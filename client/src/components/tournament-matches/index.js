import React, { Component } from 'react';
import compose from 'recompose/compose';
import { connect } from 'react-redux';
import Table from 'components/table';
import Icon from 'components/icon';
import classnames from 'classnames/bind';
import { withCaptions } from 'hoc';
import { actions as modalActions } from 'components/modal-container';
import style from './style.module.css';

const tableCaptions = ({ t, isMobile }) => ({
  number: {
    text: t('name'),
    width: isMobile ? 100 : 150,
  },

  name: {
    text: t('points'),
    width: isMobile ? 75 : 120,
  },
});

const cx = classnames.bind(style);

class Matches extends Component {
  openMatchDetails = () => this.props.toggleModal({ id: 'match-results-modal' });

  openEditMatch = () => this.props.toggleModal({ id: 'edit-match-modal' });

  renderRow = ({ className, itemClass, textClass, item, captions }) => {
    const nameStyle = { '--width': captions.name.width };
    const pointsStyle = { '--width': captions.points.width };

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

        <button className={style.button} type="button" onClick={this.openEditMatch}>
          <Icon name="info"/>
        </button>
      </div>
    );
  };

  render() {
    return (
      <div className={style.matches}>
        <h3 className={style.subtitle}>Matches</h3>

        <Table
          noCaptions
          captions={tableCaptions}
          items={this.props.tournament.matches}
          renderRow={this.renderRow}
          className={style.table}
          emptyMessage="There is no matches yet"
        />
      </div>
    );
  }
}

export default compose(
  withCaptions(tableCaptions),

  connect(
    (state, props) => ({
      tournament: state.tournaments.list[props.id],
    }),

    {
      toggleModal: modalActions.toggleModal,
    },
  ),
)(Matches);
