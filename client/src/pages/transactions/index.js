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

  operationType = operation => {
    let className = null;

    switch(operation){
      case "user deposit":
        className = style.plus;
        break;
      case "user withdraw":
        className = style.minus;
        break;
      case "tournament deposit":
        className = style.minus;
        break;
      default:
        className = style.plus;
        break;
    }

    return className;
  }

  renderRow = ({ className, itemClass, textClass, item }) => {
    const formattedDate = moment(item.date).format('MMM DD');
    
    const Wrapper = ({children, ...props }) => {
      if (item.tournamentId) {
        return <Link to={`/tournaments/${item.tournamentId}`} {...props}>{children}</Link>
      }
      return <div {...props}>{children}</div>
    }

    return <Wrapper className={className}>
      <div className={itemClass} style={{'--width': transactionsTableCaptions.amount.width}}>
        <span className={textClass}>${item.amount}</span>
      </div>

      <div className={itemClass} style={{'--width': transactionsTableCaptions.date.width}}>
        <span className={textClass}>{formattedDate}</span>
      </div>

      <div className={itemClass} style={{'--width': transactionsTableCaptions.origin.width}}>
        <span className={cx(textClass, style.operation, this.operationType(item.origin))}>{item.origin}</span>
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