import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import io from "socket.io-client";
import moment from 'moment';

import TransactionsService from 'services/transactionService';

import Table from 'components/table';
import Preloader from 'components/preloader';

import classnames from 'classnames/bind';
import style from './style.module.css';
import i18n from 'i18n';

const cx = classnames.bind(style);

const transactionsTableCaptions = {
  amount: {
    text: i18n.t('amount'),
    width: window.innerWidth < 480 ? 75 : 100,
  },

  date: {
    text: i18n.t('date'),
    width: window.innerWidth < 480 ? 75 : 100,
  },

  origin: {
    text: i18n.t('operation'),
    width: window.innerWidth < 480 ? 150 : 200,
  },
};

class Transactions extends Component {

  constructor() {
    super();
    this.transactionsService = new TransactionsService({
      onUpdate: () => this.updateData(),
    });

    this.state = {
      transactions: [],
      isLoading: false,
    };
  }

  updateData = async () => {
    this.setState({ isLoading: true });
    const historyData = await this.transactionsService.getTransactionsHistory();

    this.setState({
      transactions: historyData.history,
      isLoading: false,
    });
  }

  componentDidMount() {
    this.updateData();

    this.socket = io();
    this.socket.on('fantasyTournamentFinalized', () => this.updateData());
  }

  renderRow = ({ className, itemClass, textClass, item }) => {
    const formattedDate = moment(item.date).format('MMM DD');

    const isOriginUserDeposit = item.origin === 'user deposit';
    const isOriginUserWithdraw = item.origin === 'user withdraw';
    const isOriginTournamentDeposit = item.origin === 'tournament deposit';
    const isOriginTournamentWinning = item.origin === 'tournament winning';

    const amountWidth = transactionsTableCaptions.amount.width;
    const dateWidth = transactionsTableCaptions.date.width;
    const originWidth = transactionsTableCaptions.origin.width;

    const Wrapper = ({ children, ...props }) => {
      if (item.tournamentId) {
        return <Link to={`/tournaments/${item.tournamentId}`} {...props}>
          {children}
        </Link>;
      }
      return <div {...props}>{children}</div>;
    };

    return <Wrapper key={item._id} className={className}>
      <div className={itemClass} style={{ '--width': amountWidth }}>
        <span className={textClass}>${item.amount}</span>
      </div>

      <div className={itemClass} style={{ '--width': dateWidth }}>
        <span className={textClass}>{formattedDate}</span>
      </div>

      <div className={itemClass} style={{ '--width': originWidth }}>
        <span className={cx(textClass, style.operation, {
          'plus': isOriginUserDeposit || isOriginTournamentWinning,
          'minus': isOriginUserWithdraw || isOriginTournamentDeposit,
        })}>{i18n.t(`${item.origin}`)}</span>
      </div>
    </Wrapper>;
  }

  render() {
    return (
      <div className={style.transactions}>
        <h1 className={style.title}>{i18n.t('transactions_history')}</h1>

        <Table
          captions={transactionsTableCaptions}
          items={this.state.transactions}
          className={style.transactions_table}
          renderRow={this.renderRow}
          isLoading={this.state.isLoading}
          emptyMessage="You haven't had any transactions yet"
        />

        {this.state.isLoading &&
          <Preloader />
        }

      </div>
    );
  }
}
export default Transactions;