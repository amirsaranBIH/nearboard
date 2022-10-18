/* Talking with a contract often involves transforming data, we recommend you to encapsulate that logic into a class */

export class Nearboard {
  constructor({ contractId, walletToUse }) {
    this.contractId = contractId;
    this.wallet = walletToUse;    
  }

  async getProjects() {
    return await this.wallet.viewMethod({ contractId: this.contractId, method: 'getProject' });
  }

  async getPopularQuestions() {
    return await this.wallet.viewMethod({ contractId: this.contractId, method: 'getPopularQuestions' });
  }
}