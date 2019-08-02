import React, { Component } from 'react';
import compose from 'recompose/compose';
import i18n from 'i18n';
import Modal from 'components/modal';
import Table from 'components/table';
import classnames from 'classnames/bind';
import style from './style.module.css';

const tableCaptions = {
  player: {
    text: i18n.t('player'),
    width: window.innerWidth < 480 ? 120 : 150,
  },

  kills: {
    text: i18n.t('kills'),
    width: window.innerWidth < 480 ? 75 : 100,
  },

  deaths: {
    text: i18n.t('deaths'),
    width: window.innerWidth < 480 ? 75 : 100,
  },

  assists: {
    text: i18n.t('assists'),
    width: window.innerWidth < 480 ? 75 : 100,
  },
};

const cx = classnames.bind(style);

class MatchResults extends Component {
  renderRow = ({ className, itemClass, textClass, index, item }) => {
    const playerStyle = { '--width': tableCaptions.player.width };
    const killsStyle = { '--width': tableCaptions.kills.width };
    const deathsStyle = { '--width': tableCaptions.deaths.width };
    const assistsStyle = { '--width': tableCaptions.assists.width };

    return <div className={cx(className, 'row')} key={item}>
      <div className={itemClass} style={playerStyle}>
        <span className={textClass}>TADOFFICAL</span>
      </div>

      <div className={itemClass} style={killsStyle}>
        <span className={textClass}>2x4</span>
      </div>

      <div className={itemClass} style={deathsStyle}>
        <span className={textClass}>2x4</span>
      </div>

      <div className={itemClass} style={assistsStyle}>
        <span className={textClass}>2x4</span>
      </div>
    </div>;
  };

  componentWillMount() {
  }

  render() {
    return <Modal
      title="Match results"
      close={this.props.close}
      wrapClassName={style.modal}
      className={style.modal_content}
    >
      <Table
        captions={tableCaptions}
        items={[1, 2, 3, 4, 5, 6, 7, 8, 9, 10]}
        renderRow={this.renderRow}
        isLoading={false}
        className={style.table}
        emptyMessage="There is no results yet"
      />
    </Modal>;
  }
}

export default compose()(MatchResults);
