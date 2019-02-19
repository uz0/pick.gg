import http from './httpService';

export default class TransactionService {

  deposit = async() => {
    let depositQuery = await http('api/transactions/deposit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        "amount": 10,
        "origin": "user withdraw",
      })
    })
    let deposit = await depositQuery.json();
    return deposit;
  }

  withdraw = async() => {
    let withdrawQuery = await http('api/transactions/withdraw', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        "amount": 10,
        "origin": "user deposit",
      })
    })
    let withdraw = await withdrawQuery.json();
    return withdraw;
  }

  getTransactionsHistory = async() => {
    let transactions = await http('api/transactions/history');
    let history = await transactions.json();
    return history;
  }

}
