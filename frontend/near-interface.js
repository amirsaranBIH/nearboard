/* Talking with a contract often involves transforming data, we recommend you to encapsulate that logic into a class */

export class Nearboard {
  constructor({ contractId, walletToUse, loadingContext }) {
    this.contractId = contractId;
    this.wallet = walletToUse;
    this.loadingContext = loadingContext; 
  }

  async callMethod(options) {
    this.loadingContext.setIsLoading(true);
    const res = await this.wallet.callMethod(options);
    this.loadingContext.setIsLoading(false);
    return res;
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

  async getProjectEvents(projectId) {
    return await this.wallet.viewMethod({ contractId: this.contractId, method: 'getProjectEvents', args: { projectId } });
  }

  async getProjectUpcomingEventQuestions(projectId) {
    return await this.wallet.viewMethod({ contractId: this.contractId, method: 'getProjectUpcomingEventQuestions', args: { projectId } });
  }

  async getEventQuestions(eventId) {
    return await this.wallet.viewMethod({ contractId: this.contractId, method: 'getEventQuestions', args: { eventId } });
  }

  async getEvent(eventId) {
    return await this.wallet.viewMethod({ contractId: this.contractId, method: 'getEvent', args: { eventId } });
  }

  // CALL METHODS

  async createProject(args) {
    return await this.callMethod({ contractId: this.contractId, method: 'createProject', args });
  }

  async updateProject(args) {
    return await this.callMethod({ contractId: this.contractId, method: 'updateProject', args });
  }

  async deleteProject(projectId) {
    return await this.callMethod({ contractId: this.contractId, method: 'deleteProject', args: { projectId } });
  }

  async createEvent(args) {
    return await this.callMethod({ contractId: this.contractId, method: 'createEvent', args });
  }

  async updateEvent(args) {
    return await this.callMethod({ contractId: this.contractId, method: 'updateEvent', args });
  }

  async deleteEvent(eventId) {
    return await this.callMethod({ contractId: this.contractId, method: 'deleteEvent', args: { eventId } });
  }

  async createQuestion(args) {
    return await this.callMethod({ contractId: this.contractId, method: 'createQuestion', args });
  }

  async vote(questionId) {
    return await this.callMethod({ contractId: this.contractId, method: 'vote', args: { questionId } });
  }

  async unvote(questionId) {
    return await this.callMethod({ contractId: this.contractId, method: 'unvote', args: { questionId } });
  }
}