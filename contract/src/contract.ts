import { NearBindgen, near, call, view, UnorderedMap, UnorderedSet } from 'near-sdk-js';
import { AccountId } from 'near-sdk-js/lib/types';

const CREATE_PROJECT_MINIMUM_NEAR: bigint = BigInt(100_000_000_000_000_000_000_000_000n); // 100 NEAR
const CREATE_EVENT_MINIMUM_NEAR: bigint = BigInt(100_000_000_000_000_000_000_000_000n); // 100 NEAR
const CREATE_QUESTION_MINIMUM_NEAR: bigint = BigInt(10_000_000_000_000_000_000_000_000n); // 10 NEAR
const VOTE_MINIMUM_NEAR: bigint = BigInt(1_000_000_000_000_000_000_000_000n); // 1 NEAR

enum EventType {
  LiveEvent,
  OnlineEvent,
  AMA,
  Podcast,
};

type Project = {
  id: string;
  owner: AccountId;
  name: string;
  description: string;
  websiteUrl: string;
  logoUrl: string;
};

type Event = {
  id: string;
  name: string;
  eventUrl: string;
  startDate: number;
  eventType: EventType;
  projectId: string;
};

type Question = {
  id: string;
  question: string;
  asker: AccountId;
  eventId: string;
  votes: Vote[];
};

type Vote = {
  voter: AccountId;
  nearRepresented: string;
};

@NearBindgen({})
class Nearboard {
  projectId = 0;
  eventId = 0;
  questionId = 0;

  projects = new UnorderedMap<Project>("p");
  events = new UnorderedMap<Event>("e");
  questions = new UnorderedMap<Question>("q");

  follows = new UnorderedSet<string>("f");

  @view({})
  getProject({ projectId }): Project {
    return this.projects.get(projectId);
  }

  @view({})
  getProjects(): Project[] {
    return this.projects.toArray().map(x => x[1]);
  }

  @view({})
  getUserProjects({ accountId }): Project[] {
    return this.projects.toArray().map(x => x[1]).filter(project => project.owner === accountId);
  }
  
  @view({})
  getEvent({ eventId }): Event {
    return this.events.get(eventId);
  }

  @view({})
  getProjectEvents({ projectId }): Event[] {
    return this.events.toArray().map(x => x[1]).filter(event => event.projectId === projectId);
  }

  @view({})
  getAllEvents(): Event[] {
    return this.events.toArray().map(x => x[1]);
  }
  
  @view({})
  getQuestion({ questionId }): Question {
    return this.questions.get(questionId);
  }

  @view({})
  getEventQuestions({ eventId }): Question[] {
    return this.questions.toArray().map(x => x[1]).filter(question => question.eventId === eventId);
  }
  
  @view({})
  getThreeUpcomingEvents(): Event[] {
    const timestamp = near.blockTimestamp().toString();
    return this.events.toArray().map(x => x[1]).filter(event => event.startDate.toString() >= timestamp).slice(0, 3);
  }

  @view({})
  getProjectUpcomingEvents({ projectId }): Event[] {
    const timestamp = near.blockTimestamp().toString();
    return this.events.toArray().map(x => x[1]).filter(event => event.projectId === projectId && event.startDate.toString() >= timestamp);
  }

  @view({})
  getProjectUpcomingEvent({ projectId }): Event {
    const timestamp = near.blockTimestamp().toString();
    const events = this.events.toArray().map(x => x[1]).filter(event => event.projectId === projectId && event.startDate.toString() >= timestamp);

    if (events.length < 1) {
      return null;
    }

    events.sort((a, b) => {
      return a.startDate - b.startDate;
    });

    return events[0];
  }

  @view({})
  getProjectUpcomingEventQuestions({ projectId }): Question[] {
    const timestamp = near.blockTimestamp().toString();
    const events = this.events.toArray().map(x => x[1]).filter(event => event.projectId === projectId && event.startDate.toString() >= timestamp);

    if (events.length < 1) {
      return [];
    }

    events.sort((a, b) => {
      return a.startDate - b.startDate;
    });

    return this.questions.toArray().map(x => x[1]).filter(question => question.eventId === events[0].id);
  }

  @view({})
  getProjectPreviousEvents({ projectId }): Event[] {
    const timestamp = near.blockTimestamp().toString();
    return this.events.toArray().map(x => x[1]).filter(event => event.projectId === projectId && event.startDate.toString() < timestamp);
  }

  @view({})
  getThreePreviousEvents(): Event[] {
    const timestamp = near.blockTimestamp().toString();
    return this.events.toArray().map(x => x[1]).filter(event => event.startDate.toString() < timestamp).slice(0, 3);
  }
  
  @view({})
  getPopularQuestions(): Question[] {
    const questions = this.questions.toArray().map(x => x[1]);

    questions.sort((a, b) => {
      return b.votes.length - a.votes.length;
    });

    questions.slice(0, 100);

    return questions.map(question => {
      return {
        ...question,
        event: this.events.get(question.eventId),
      }
    });
  }

  @view({})
  getTopFivePopularProjects(): Project[] {
    const projectFollowerCounts = this.projects.toArray().map(([id]) => {
      return {
        id,
        followers: this.getProjectFollowers({ projectId: id }).length,
      }
    });

    projectFollowerCounts.sort((a, b) => {
      return b.followers - a.followers;
    });

    return projectFollowerCounts.splice(0, 5).map(x => this.getProject({ projectId: x.id }));
  }

  @view({})
  getUserFollows({ accountId }): Project[] {
    return this.follows.toArray().filter(follow => follow.split(":")[0] === accountId).map(follow => {
      return this.projects.get(follow.split(":")[1]);
    });
  }

  @view({})
  getProjectFollowers({ projectId }): string[] {
    return this.follows.toArray().filter(follow => follow.split(":")[1] === projectId).map(follow => follow.split(":")[0]);
  }

  isUrl(url: string) {
    const res = url.match(/(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g);
    return res !== null;
  }

  validateProject(project: Project) {
    const errorMessages = [];

    if (project.name.length < 3) {
      errorMessages.push("Project name must be at least 3 characters");
    }

    if (project.name.length > 50) {
      errorMessages.push("Project name must be 50 characters or less");
    }

    if (project.description.length > 100) {
      errorMessages.push("Project description must be 100 characters or less");
    }

    if (!this.isUrl(project.websiteUrl)) {
      errorMessages.push("Invalid website url");
    }

    if (!this.isUrl(project.logoUrl)) {
      errorMessages.push("Invalid logo url");
    }

    if (errorMessages.length > 0) {
        throw Error(errorMessages.join(", "));
    }
  }

  @call({})
  createProject({ name, description, websiteUrl, logoUrl }): string {
    if (near.accountBalance() < CREATE_PROJECT_MINIMUM_NEAR) {
      throw Error(`Your account balance needs to be minimum ${CREATE_PROJECT_MINIMUM_NEAR} yohtoNEAR to create a project`);
    }

    this.projectId++;

    const project: Project = {
      id: this.projectId.toString(),
      owner: near.signerAccountId(),
      name: name,
      description: description,
      websiteUrl: websiteUrl,
      logoUrl: logoUrl
    };

    this.validateProject(project);

    this.projects.set(this.projectId.toString(), project);

    return this.projectId.toString();
  }

  @call({})
  updateProject({ id, name, description, websiteUrl, logoUrl }) {
    let project = this.projects.get(id);
    
    const newProject: Project = {
      id: project.id,
      owner: project.owner,
      name: name,
      description: description,
      websiteUrl: websiteUrl,
      logoUrl: logoUrl,
    };

    this.validateProject(newProject);

    this.projects.set(project.id.toString(), newProject);
  }

  @call({})
  deleteProject({ projectId }) {
    this.projects.remove(projectId.toString());

    const projectEvents = this.events.toArray().map(x => x[1]).filter(event => event.projectId === projectId);

    projectEvents.forEach(event => {
      this.events.remove(event.id);
    });

    projectEvents.forEach(event => {
      const eventQuestions = this.questions.toArray().map(x => x[1]).filter(question => question.eventId === event.id);
      
      eventQuestions.forEach(question => {
        this.questions.remove(question.id);
      });
    });
  }

  @call({})
  createEvent({ projectId, name, eventUrl, startDate, eventType }): string {
    if (near.accountBalance() < CREATE_EVENT_MINIMUM_NEAR) {
      throw Error(`Your account balance needs to be minimum ${CREATE_EVENT_MINIMUM_NEAR} yohtoNEAR to create an event`);
    }

    this.eventId++;
    
    const event: Event = {
      id: this.eventId.toString(),
      name: name,
      eventUrl: eventUrl,
      startDate: startDate,
      eventType: eventType,
      projectId,
    };

    this.events.set(this.eventId.toString(), event);

    return this.eventId.toString();
  }

  @call({})
  updateEvent({ id, name, eventUrl, startDate, eventType }) {
    let event = this.events.get(id);

    const newEvent: Event = {
      id: event.id,
      name: name,
      eventUrl: eventUrl,
      startDate: startDate,
      eventType: eventType,
      projectId: event.projectId,
    };

    this.events.set(event.id.toString(), newEvent);
  }

  @call({})
  deleteEvent({ eventId }) {
    this.events.remove(eventId);

    const eventQuestions = this.questions.toArray().map(x => x[1]).filter(question => question.eventId === eventId);
      
    eventQuestions.forEach(question => {
      this.questions.remove(question.id);
    });
  }

  @call({})
  createQuestion({ eventId, question }): string {
    if (near.accountBalance() < CREATE_QUESTION_MINIMUM_NEAR) {
      throw Error(`Your account balance needs to be minimum ${CREATE_QUESTION_MINIMUM_NEAR} yohtoNEAR to create a question`);
    }

    this.questionId++;
    const asker = near.signerAccountId();
    
    const newQuestion: Question = {
      id: this.questionId.toString(),
      asker,
      question: question,
      eventId,
      votes: [
        {
          voter: near.signerAccountId(),
          nearRepresented: near.accountBalance().toString(),
        }
      ]
    };

    this.questions.set(this.questionId.toString(), newQuestion);

    return this.questionId.toString();
  }

  @call({})
  updateQuestion({ id, question }) {
    let currentQuestion = this.questions.get(id);

    const newQuestion: Question = {
      id: currentQuestion.id,
      asker: currentQuestion.asker,
      question: question,
      eventId: currentQuestion.eventId,
      votes: currentQuestion.votes,
    };

    this.questions.set(newQuestion.id.toString(), newQuestion);
  }

  @call({})
  deleteQuestion({ questionId }) {
    this.questions.remove(questionId);
  }

  @call({})
  vote({ questionId }) {
    if (near.accountBalance() < VOTE_MINIMUM_NEAR) {
      throw Error(`Your account balance needs to be minimum ${VOTE_MINIMUM_NEAR} yohtoNEAR to vote`);
    }
    
    const question = this.questions.get(questionId);

    const vote: Vote = {
      voter: near.signerAccountId(),
      nearRepresented: near.accountBalance().toString(),
    };

    question.votes.push(vote);
    this.questions.set(question.id, question);
  }

  @call({})
  unvote({ questionId }) {
    const question = this.questions.get(questionId);
    question.votes = question.votes.filter(vote => vote.voter !== near.signerAccountId());
    this.questions.set(question.id, question);
  }

  @call({})
  followProject({ projectId }) {
    this.follows.set(near.signerAccountId() + ":" + projectId);
  }

  @call({})
  unfollowProject({ projectId }) {
    this.follows.remove(near.signerAccountId() + ":" + projectId);
  }
}