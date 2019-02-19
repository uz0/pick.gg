import React, { Component } from 'react'
import TransactionsService from '../../services/transactionService'
// import http from '../../services/httpService'
import moment from 'moment'
import style from './style.module.css'

class Transactions extends Component {

  constructor() {
    super()
    this.TransactionsService = new TransactionsService()
    this.state = {
      transitionData: []
    }
  }

  async componentDidMount() {
    let historyData = await this.TransactionsService.getTransactionsHistory()

    this.setState({
      transitionData: historyData.history
    })


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
                <p>{item.amount}$</p>
                <p>{moment(item.date).format('MMM DD')}</p>
                <p>{item.operation}</p>
              </div>
            ))}
          </div>
        </main>
      </div>
    )

  }

}

export default Transactions