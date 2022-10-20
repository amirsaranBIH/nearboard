import { NearBindgen, near, call, view, UnorderedMap } from 'near-sdk-js';
import { AccountId } from 'near-sdk-js/lib/types';

const CREATE_PROJECT_MINIMUM_NEAR = 100_000_000_000_000_000_000_000_000; // 100 NEAR
const CREATE_EVENT_MINIMUM_NEAR = 100_000_000_000_000_000_000_000_000; // 100 NEAR
const CREATE_QUESTION_MINIMUM_NEAR = 10_000_000_000_000_000_000_000_000; // 10 NEAR
const VOTE_MINIMUM_NEAR = 1_000_000_000_000_000_000_000_000; // 1 NEAR

enum EventType {
  LiveEvent,
  OnlineEvent,
  AMA,
  Podcast,
};

type Project = {
  id: number;
  owner: AccountId;
  name: string;
  description: string;
  websiteUrl: string;
  logoUrl: string;
};

type Event = {
  id: number;
  name: string;
  eventUrl: string;
  startDate: number;
  eventType: EventType;
  projectId: number;
};

type Question = {
  id: number;
  question: string;
  asker: AccountId;
  eventId: number;
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

  projects = new UnorderedMap("p");
  events = new UnorderedMap("e");
  questions = new UnorderedMap("q");

  @view({})
  getProject({ projectId }) {
    return this.projects.get(projectId);
  }

  @view({})
  getProjects() {
    return this.projects.toArray();
  }

  @view({})
  getUserProjects({ accountId }) {
    return this.projects.toArray().filter((project: any) => project.owner === accountId);
  }
  
  @view({})
  getEvent({ eventId }) {
    return this.events.get(eventId);
  }

  @view({})
  getProjectEvents({ projectId }) {
    return this.events.toArray().filter((event: any) => event.projectId === projectId);
  }

  @view({})
  getAllEvents() {
    return this.events.toArray();
  }
  
  @view({})
  getQuestion({ questionId }) {
    return this.questions.get(questionId);
  }

  @view({})
  getQuestions() {
    return this.questions.toArray();
  }
  
  @view({})
  getAllUpcomingEvents() {
    return this.events.toArray().filter((event: any) => event.startDate < near.blockTimestamp());
  }

  @view({})
  getAllPreviousEvents() {
    return this.events.toArray().filter((event: any) => event.startDate >= near.blockTimestamp());
  }

  @view({})
  getProjectUpcomingEvents({ projectId }) {
    return this.events.toArray().filter((event: any) => event.projectId === projectId && event.startDate < near.blockTimestamp());
  }

  @view({})
  getProjectPreviousEvents({ projectId }) {
    return this.events.toArray().filter((event: any) => event.projectId === projectId && event.startDate >= near.blockTimestamp());
  }
  
  @view({})
  getPopularQuestions() {
    const questions = this.questions.toArray();

    questions.sort((a: any, b: any) => {
      return Object.keys(a.votes).length - Object.keys(b.votes).length;
    });

    questions.slice(0, 100);

    return questions;
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
  createProject({ name, description, websiteUrl, logoUrl }): number {
    if (near.accountBalance() < CREATE_PROJECT_MINIMUM_NEAR) {
      throw Error(`Your account balance needs to be minimum ${CREATE_PROJECT_MINIMUM_NEAR} NEAR to create a project`);
    }

    this.projectId++;

    const project: Project = {
      id: this.projectId,
      owner: near.signerAccountId(),
      name: name,
      description: description,
      websiteUrl: websiteUrl,
      logoUrl: logoUrl
    };

    this.validateProject(project);

    this.projects.set(this.projectId.toString(), project);

    return this.projectId;
  }

  @call({})
  updateProject({ projectId, name, description, websiteUrl, logoUrl }) {
    let project = this.projects.get(projectId) as Project;
    
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
  createEvent({ projectId, name, eventUrl, startDate, eventType }): number {
    if (near.accountBalance() < CREATE_EVENT_MINIMUM_NEAR) {
      throw Error(`Your account balance needs to be minimum ${CREATE_EVENT_MINIMUM_NEAR} NEAR to create an event`);
    }

    this.eventId++;
    
    const event: Event = {
      id: this.eventId,
      name: name,
      eventUrl: eventUrl,
      startDate: startDate,
      eventType: eventType,
      projectId,
    };

    this.events.set(this.eventId.toString(), event);

    return this.eventId;
  }

  @call({})
  updateEvent({ projectId, eventId, name, eventUrl, startDate, eventType }) {
    let event = this.events.get(eventId) as Event;

    const newEvent: Event = {
      id: event.id,
      name: name,
      eventUrl: eventUrl,
      startDate: startDate,
      eventType: eventType,
      projectId,
    };

    this.events.set(event.id.toString(), event);
  }

  @call({})
  createQuestion({ eventId, question }): number {
    if (near.accountBalance() < CREATE_QUESTION_MINIMUM_NEAR) {
      throw Error(`Your account balance needs to be minimum ${CREATE_QUESTION_MINIMUM_NEAR} NEAR to create a question`);
    }

    this.questionId++;
    const asker = near.signerAccountId();

    let event = this.events.get(eventId) as Event;
    
    const newQuestion: Question = {
      id: this.questionId,
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

    return this.questionId;
  }

  @call({})
  updateQuestion({ eventId, questionId, question }) {
    let currentQuestion = this.questions.get(questionId) as Question;

    const newQuestion: Question = {
      id: currentQuestion.id,
      asker: currentQuestion.asker,
      question: question,
      eventId,
      votes: currentQuestion.votes,
    };

    this.questions.set(newQuestion.id.toString(), newQuestion);
  }

  @call({})
  vote({ questionId }) {
    if (near.accountBalance() < VOTE_MINIMUM_NEAR) {
      throw Error(`Your account balance needs to be minimum ${VOTE_MINIMUM_NEAR} NEAR to vote`);
    }
    
    const question = this.questions.get(questionId) as Question;

    const vote: Vote = {
      voter: near.signerAccountId(),
      nearRepresented: near.accountBalance().toString(),
    };

    question.votes.push(vote);
  }

  @call({})
  unvote({ questionId }) {
    const question = this.questions.get(questionId) as Question;
    question.votes = question.votes.filter((vote: Vote) => vote.voter !== near.signerAccountId());
  }
}