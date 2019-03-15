import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Table from 'components/table';
import TransactionsService from 'services/transactionService';
import moment from 'moment';
import classnames from 'classnames/bind';
import style from './style.module.css';

const cx = classnames.bind(style);

const transactionsTableCaptions = {
  amount: {
    text: 'Amount',
    width: 110,
  },

  date: {
    text: 'Date',
    width: 110,
  },

  origin: {
    text: 'Operation',
    width: 250,
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
      isLoading: true,
    };
  }

  updateData = async () => {
    const historyData = await this.transactionsService.getTransactionsHistory();

    this.setState({
      transactions: historyData.history,
      isLoading: false,
    });
  }

  async componentDidMount() {
    this.updateData();
  }

  renderRow = ({ className, itemClass, textClass, item }) => {
    const formattedDate = moment(item.date).format('MMM DD');

    const isOriginUserDeposit = item.origin === 'user deposit';
    const isOriginUserWithdraw = item.origin === 'user withdraw';
    const isOriginTournamentDeposit = item.origin === 'tournament deposit';
    const isOriginTournamentWinning = item.origin === 'tournament winning';

    const amountWidth = {'--width': transactionsTableCaptions.amount.width};
    const dateWidth = {'--width': transactionsTableCaptions.date.width};
    const origintWidth = {'--width': transactionsTableCaptions.origin.width};

    const Wrapper = ({children, ...props }) => {
      if (item.tournamentId) {
        return <Link to={`/tournaments/${item.tournamentId}`} {...props}>
          {children}
        </Link>
      }
      return <div {...props}>{children}</div>
    }

    return <Wrapper className={className}>
      <div className={itemClass} style={amountWidth}>
        <span className={textClass}>${item.amount}</span>
      </div>

      <div className={itemClass} style={dateWidth}>
        <span className={textClass}>{formattedDate}</span>
      </div>

      <div className={itemClass} style={origintWidth}>
        <span className={cx(textClass, style.operation, {
          'plus': isOriginUserDeposit || isOriginTournamentWinning,
          'minus': isOriginUserWithdraw || isOriginTournamentDeposit,
        })}>{item.origin}</span>
      </div>
    </Wrapper>;
  }

  render() {
    return (
      <div className={style.transactions}>
        <h1 className={style.title}>Transactions History</h1>

        <Table
          captions={transactionsTableCaptions}
          items={this.state.transactions}
          className={style.transactions_table}
          renderRow={this.renderRow}
          isLoading={this.state.isLoading}
          emptyMessage="You haven't had any transactions yet"
        />

      </div>
    );
  }
}

export default Transactions;