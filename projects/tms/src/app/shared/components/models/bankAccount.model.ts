export class BankAccount {
  bankName: string;
  bankAdditional: string;
  sortingCode: string;
  swift: string;
  iban: string;

  constructor(bankName?: string, bankAdditional?: string, sortingCode?: string,
              swift?: string, iban?: string) {
    this.bankName = bankName || '';
    this.bankAdditional = bankAdditional || '';
    this.sortingCode = sortingCode || '';
    this.swift = swift || '';
    this.iban = iban || '';
  }
}
