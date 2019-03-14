import React, { Component, Fragment } from 'react';
import TransactionsService from '../../services/transactionService';
import moment from 'moment';
import style from './style.module.css';


class Transactions extends Component {

  constructor() {
    super();
    this.TransactionsService = new TransactionsService({
      onUpdate: () => this.updateData(),
    });

    this.state = {
      transactionData: [],
    };
  }

  updateData = async () => {
    const historyData = await this.TransactionsService.getTransactionsHistory();

    this.setState({
      transactionData: historyData.history,
    });
  }

  async componentDidMount() {
    this.updateData();
  }

  render() {

    const { transactionData } = this.state;

    const operationType = operation => {
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

      return <div className={className}>{operation}</div>
    }

    return (
      <div className={style.home_page}>
        <main className={style.main_block}>
          <h1>Transactions History</h1>

          {transactionData.length === 0 && <div className={style.notification}>You haven't had any transactions yet</div>}

          {transactionData.length > 0 && <Fragment>
            <div className={style.block_header}>
              <div className={style.amount}>Amount</div>
              <div className={style.date}>Date</div>
              <div className={style.operation}>Operation</div>
            </div>

            <div className={style.block_history}>
              {transactionData.map(item => (
                <div className={style.item_history} key={item._id}>
                  <div>{item.amount}$</div>
                  <div>{moment(item.date).format('MMM DD')}</div>
                  {operationType(item.origin)}
                </div>
              ))}
            </div>
          </Fragment>}

        </main>
      </div>
    );

  }

}

export default Transactions;