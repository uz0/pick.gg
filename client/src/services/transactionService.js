import BasicService from './basicService';

export default class TransactionService extends BasicService {
  deposit = async() => {
    return this.request('POST', '/api/transactions/deposit', {
      'amount': 10,
      'origin': 'user deposit',
    });
  }

  withdraw = async() => {
    return this.request('POST', '/api/transactions/withdraw', {
      'amount': 10,
      'origin': 'user withdraw',
    });
  }

  getUserBalance = () => this.request('GET', '/api/transactions/balance');

  getTotalWinnings = id => this.request('GET', `/public/transactions/winnings/${id}`);

  getTransactionsHistory = () => this.request('GET', '/api/transactions/history');
}
