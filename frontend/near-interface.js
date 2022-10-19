/* Talking with a contract often involves transforming data, we recommend you to encapsulate that logic into a class */

export class Nearboard {
  constructor({ contractId, walletToUse }) {
    this.contractId = contractId;
    this.wallet = walletToUse;    
  }

  // VIEW METHODS

  async getProject(projectId) {
    return await this.wallet.viewMethod({ contractId: this.contractId, method: 'getProject', args: { projectId } });
  }

  async getProjects() {
    return await this.wallet.viewMethod({ contractId: this.contractId, method: 'getProjects' });
  }

  async getUserProjects(accountId) {
    return await this.wallet.viewMethod({ contractId: this.contractId, method: 'getUserProjects', args: { accountId } });
  }

  async getAllEvents() {
    return await this.wallet.viewMethod({ contractId: this.contractId, method: 'getAllEvents' });
  }

  async getPopularQuestions() {
    return await this.wallet.viewMethod({ contractId: this.contractId, method: 'getPopularQuestions' });
  }

  async getAllUpcomingEvents() {
    return await this.wallet.viewMethod({ contractId: this.contractId, method: 'getAllUpcomingEvents' });
  }

  async getEvent({ projectId, eventId }) {
    return await this.wallet.viewMethod({ contractId: this.contractId, method: 'getEvent', args: { projectId, eventId } });
  }

  // CALL METHODS

  async createProject(args) {
    return await this.wallet.callMethod({ contractId: this.contractId, method: 'createProject', args });
  }

  async createEvent(args) {
    return await this.wallet.callMethod({ contractId: this.contractId, method: 'createEvent', args });
  }

  async createQuestion(args) {
    return await this.wallet.callMethod({ contractId: this.contractId, method: 'createQuestion', args });
  }
}