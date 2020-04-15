import Transaction from '../models/Transaction';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

interface CreateTransactionDTO {
  title: string;
  value: number;
  type: 'income' | 'outcome';
}

class TransactionsRepository {
  private transactions: Transaction[];

  private balance: Balance;

  constructor() {
    this.transactions = [];
    this.balance = {
      income: 0,
      outcome: 0,
      total: 0,
    };
  }

  public all(): Transaction[] {
    return this.transactions;
  }

  public getBalance(): Balance {
    return this.balance;
  }

  public create({ title, value, type }: CreateTransactionDTO): Transaction {
    const transaction = new Transaction({ title, value, type });

    this.setBalance({ value, type });
    this.transactions.push(transaction);

    return transaction;
  }

  private setBalance({
    value,
    type,
  }: Omit<CreateTransactionDTO, 'title'>): Balance {
    if (type === 'income') {
      this.balance.income += value;
    } else {
      if (this.balance.total - value < 0) {
        throw Error('Insufficient balance for this transaction');
      }

      this.balance.outcome += value;
    }

    this.balance.total = this.balance.income - this.balance.outcome;

    return this.balance;
  }
}

export default TransactionsRepository;
