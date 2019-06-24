import React, { Component } from 'react';
import compose from 'recompose/compose';
import { connect } from 'react-redux';
import i18n from 'i18n';
import Table from 'components/table';
import style from './style.module.css';

const tableCaptions = {
  number: {
    text: i18n.t('number'),
    width: window.innerWidth < 480 ? 55 : 55,
  },

  name: {
    text: i18n.t('name'),
    width: window.innerWidth < 480 ? 150 : 200,
  },
};

class Viewers extends Component {
  renderRow = ({ className, itemClass, textClass, index, item }) => {
    const numberStyle = { '--width': tableCaptions.number.width };
    const nameStyle = { '--width': tableCaptions.name.width };

    return <div className={className} key={item}>
      <div className={itemClass} style={numberStyle}>
        <span className={textClass}>{index + 1}</span>
      </div>

      <div className={itemClass} style={nameStyle}>
        <span className={textClass}>Marquis de eLife</span>
      </div>
    </div>;
  };

  componentWillMount() {
  }

  render() {
    return <div className={style.viewers}>
      <h3 className={style.subtitle}>Viewers</h3>

      <Table
        noCaptions
        captions={tableCaptions}
        items={[1,2,3,4,5]}
        renderRow={this.renderRow}
        isLoading={false}
        className={style.table}
        emptyMessage="There is no viewers yet"
      />
    </div>;
  }
}

export default compose(
  connect(
    (state, props) => ({
      tournament: state.tournaments.list[props.id],
    }),
  ),
)(Viewers);
