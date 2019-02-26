import React, { Component } from 'react'
import TransactionsService from '../../services/transactionService'
// import http from '../../services/httpService'
import moment from 'moment'
import style from './style.module.css'


class Transactions extends Component {

  constructor() {
    super()
    this.TransactionsService = new TransactionsService({
      onUpdate: () => this.updateData()
    });

    this.state = {
      transitionData: []
    }
  }

  OperationData = (item) => {
    if (item === "user deposit") {
      return <div className={style.plus}>{item}</div>
    }

    if (item === "user withdraw") {
      return <div className={style.minus}>{item}</div>
    }

    if (item === "tournament deposit") {
      return <div className={style.minus}>{item}</div>
    } else {
      return <div className={style.plus}>{item}</div>
    }
  }

  updateData = async () => {
    let historyData = await this.TransactionsService.getTransactionsHistory();

    this.setState({
      transitionData: historyData.history
    });
  }

  async componentDidMount() {
    this.updateData()
  }

  render() {

    return (
      <div className={style.home_page}>
        <div className={style.bg_wrap} />
        <main className={style.main_block}>
          <h1>Transactions History</h1>
          <div className={style.block_header}>
            <div className={style.amount}>Amount</div>
            <div className={style.date}>Date</div>
            <div className={style.operation}>Operation</div>
          </div>
          <div className={style.block_history}>
            {this.state.transitionData.map(item => (
              <div className={style.item_history} key={item._id}>
                <div>{item.amount}$</div>
                <div>{moment(item.date).format('MMM DD')}</div>
                {this.OperationData(item.origin)}
              </div>
          ))}
          </div>
        </main>
      </div>
    )

  }

}

export default Transactions