import { ConnectionLink } from './connection-link';

export enum BankAccountType {
  CheckingAccount = 'Checking Account',
  CreditCard = 'Credit Card',
  FinancingAccount = 'Financing Account',
  InvestmentAccount = 'Investment Account',
  LoanAccount = 'Loan Account',
  SavingsAccount = 'Savings Account',
}

type IBankAccount = {
  id?: string;
  type: BankAccountType;
  accountName: string;
  number: string;
  balance: number;
  lastSyncedAt?: string;
  customerId: string;
  institution: string;
  connectionLink: ConnectionLink;
  ynabAccountId?: string;
};

export class BankAccount {
  private connectionLink: ConnectionLink;
  private ynabAccountId: string | null;
  public id?: string;
  public type: string;
  public name: string;
  public number: string;
  public balance: number;
  public lastSyncedAt: string | null;
  public customerId: string;
  public institution: string;

  constructor(account: IBankAccount) {
    this.id = account.id;
    this.connectionLink = account.connectionLink;
    this.ynabAccountId = account.ynabAccountId ?? null;
    this.type = account.type;
    this.name = account.accountName;
    this.number = account.number;
    this.balance = account.balance;
    this.lastSyncedAt = account.lastSyncedAt ?? null;
    this.customerId = account.customerId;
    this.institution = account.institution;
  }

  link(id: string) {
    this.ynabAccountId = id;
  }

  unlink() {
    this.ynabAccountId = null;
  }

  get linked() {
    return !!this.ynabAccountId;
  }

  get unlinked() {
    return !this.ynabAccountId;
  }

  get connected() {
    return this.connectionLink.connected;
  }
}

export interface IBankAccountRepository {
  createMany(accounts: BankAccount[]): Promise<BankAccount[]>;
}

export const IBankAccountRepository = Symbol('BankAccountRepository');
