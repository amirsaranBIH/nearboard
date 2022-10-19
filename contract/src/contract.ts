import { NearBindgen, near, call, view } from 'near-sdk-js';
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
  events: { [id: number]: Event };
};

type Event = {
  id: number;
  name: string;
  eventUrl: string;
  startDate: Date;
  eventType: EventType;
  questions: { [id: number]: Question };
};

type Question = {
  id: number;
  question: string;
  asker: AccountId;
  votes: { [voter: AccountId]: Vote };
};

type Vote = {
  nearRepresented: bigint;
};

type CreateProjectParams = {
  name: string;
  description: string;
  websiteUrl: string;
  logoUrl: string;
}

type UpdateProjectParams = {
  projectId: number;
  name: string;
  description: string;
  websiteUrl: string;
  logoUrl: string;
}

type CreateEventParams = {
  projectId: number;
  name: string;
  eventUrl: string;
  startDate: Date;
  eventType: EventType;
}

type UpdateEventParams = {
  projectId: number;
  eventId: number;
  name: string;
  eventUrl: string;
  startDate: Date;
  eventType: EventType;
}

type CreateQuestionParams = {
  projectId: number;
  eventId: number;
  question: string;
}

type UpdateQuestionParams = {
  projectId: number;
  eventId: number;
  questionId: number;
  question: string;
}

type VoteParams = {
  projectId: number;
  eventId: number;
  questionId: number;
}

type UnvoteParams = {
  projectId: number;
  eventId: number;
  questionId: number;
}

@NearBindgen({})
class Nearboard {
  projectId = 0;
  eventId = 0;
  questionId = 0;
  projects: { [id: number]: Project };

  @view({})
  getProject(projectId: number): Project {
    return this.projects[projectId];
  }

  @view({})
  getProjects(): Project[] {
    const projects: Project[] = [];

    for (const id in this.projects) {
      projects.push(this.projects[id]);
    }

    return projects;
  }

  @view({})
  getUserProjects(): Project[] {
    const projects: Project[] = [];

    for (const id in this.projects) {
      if (this.projects[this.projectId].owner === near.signerAccountId()) {
        projects.push(this.projects[id]);
      }
    }

    return projects;
  }
  
  @view({})
  getEvent(projectId: number, eventId: number): Event {
    return this.projects[projectId].events[eventId];
  }

  @view({})
  getEvents(projectId: number): Event[] {
    const events: Event[] = [];

    for (const id in this.projects[projectId].events) {
      events.push(this.projects[projectId].events[id]);
    }

    return events;
  }
  
  @view({})
  getQuestion(projectId: number, eventId: number, questionId: number): Question {
    return this.projects[projectId].events[eventId].questions[questionId];
  }

  @view({})
  getQuestions(projectId: number, eventId: number): Question[] {
    const questions: Question[] = [];

    for (const id in this.projects[projectId].events[eventId].questions) {
      questions.push(this.projects[projectId].events[eventId].questions[id]);
    }

    return questions;
  }
  
  @view({})
  getAllUpcomingEvents(): Event[] {
    const events: Event[] = [];

    for (const projectId in this.projects) {
      for (const eventId in this.projects[projectId].events) {
        if (this.projects[projectId].events[eventId].startDate < new Date()) {
          events.push(this.projects[projectId].events[eventId]);
        }
      }
    }

    return events;
  }

  @view({})
  getAllPreviousEvents(): Event[] {
    const events: Event[] = [];

    for (const projectId in this.projects) {
      for (const eventId in this.projects[projectId].events) {
        if (this.projects[projectId].events[eventId].startDate >= new Date()) {
          events.push(this.projects[projectId].events[eventId]);
        }
      }
    }

    return events;
  }

  @view({})
  getUpcomingEvents(projectId: number): Event[] {
    const events: Event[] = [];

    for (const eventId in this.projects[projectId].events) {
      if (this.projects[projectId].events[eventId].startDate < new Date()) {
        events.push(this.projects[projectId].events[eventId]);
      }
    }

    return events;
  }

  @view({})
  getPreviousEvents(projectId: number): Event[] {
    const events: Event[] = [];

    for (const eventId in this.projects[projectId].events) {
      if (this.projects[projectId].events[eventId].startDate >= new Date()) {
        events.push(this.projects[projectId].events[eventId]);
      }
    }

    return events;
  }
  
  @view({})
  getPopularQuestions(): Question[] {
    const questions: Question[] = [];
    
    for (const projectId in this.projects) {
      for (const eventId in this.projects[projectId].events) {
        for (const questionId in this.projects[projectId].events[eventId].questions) {
          questions.push(this.projects[projectId].events[eventId].questions[questionId]);
        }
      }
    }

    questions.sort((a, b) => {
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

    if (this.isUrl(project.websiteUrl)) {
      errorMessages.push("Invalid website url");
    }

    if (this.isUrl(project.logoUrl)) {
      errorMessages.push("Invalid logo url");
    }

    if (errorMessages.length > 0) {
        throw Error(errorMessages.join(", "));
    }
  }

  @call({})
  createProject(params: CreateProjectParams): number {
    if (near.accountBalance() < CREATE_PROJECT_MINIMUM_NEAR) {
      throw Error(`Your account balance needs to be minimum ${CREATE_PROJECT_MINIMUM_NEAR} NEAR to create a project`);
    }

    this.projectId++;

    const project: Project = {
      id: this.projectId,
      owner: near.signerAccountId(),
      name: params.name,
      description: params.description,
      websiteUrl: params.websiteUrl,
      logoUrl: params.logoUrl,
      events: [],
    };

    this.validateProject(project);

    this.projects[this.projectId] = project;

    return this.projectId;
  }

  @call({})
  updateProject(params: UpdateProjectParams) {
    let project = this.getProject(params.projectId);
    
    const newProject: Project = {
      id: project.id,
      owner: project.owner,
      name: params.name,
      description: params.description,
      websiteUrl: params.websiteUrl,
      logoUrl: params.logoUrl,
      events: project.events,
    };

    this.validateProject(newProject);

    this.projects[params.projectId] = newProject;
  }

  @call({})
  createEvent(params: CreateEventParams): number {
    if (near.accountBalance() < CREATE_EVENT_MINIMUM_NEAR) {
      throw Error(`Your account balance needs to be minimum ${CREATE_EVENT_MINIMUM_NEAR} NEAR to create an event`);
    }

    this.eventId++;

    const project = this.getProject(params.projectId);
    
    const event: Event = {
      id: this.eventId,
      name: params.name,
      eventUrl: params.eventUrl,
      startDate: params.startDate,
      eventType: params.eventType,
      questions: [],
    };

    project.events[this.eventId] = event;

    return this.eventId;
  }

  @call({})
  updateEvent(params: UpdateEventParams) {
    let event = this.getEvent(params.projectId, params.eventId);

    const newEvent: Event = {
      id: event.id,
      name: params.name,
      eventUrl: params.eventUrl,
      startDate: params.startDate,
      eventType: params.eventType,
      questions: event.questions,
    };

    this.projects[params.projectId].events[params.eventId] = newEvent;
  }

  @call({})
  createQuestion(params: CreateQuestionParams): number {
    if (near.accountBalance() < CREATE_QUESTION_MINIMUM_NEAR) {
      throw Error(`Your account balance needs to be minimum ${CREATE_QUESTION_MINIMUM_NEAR} NEAR to create a question`);
    }

    this.questionId++;

    const event = this.getEvent(params.projectId, params.eventId);
    
    const question: Question = {
      id: this.questionId,
      asker: near.signerAccountId(),
      question: params.question,
      votes: {},
    };

    event.questions[this.questionId] = question;

    return this.questionId;
  }

  @call({})
  updateQuestion(params: UpdateQuestionParams) {
    let question = this.getQuestion(params.projectId, params.eventId, params.questionId);

    const newQuestion: Question = {
      id: question.id,
      asker: question.asker,
      question: params.question,
      votes: question.votes,
    };

    this.projects[params.projectId].events[params.eventId].questions[params.questionId] = newQuestion;
  }

  @call({})
  vote(params: VoteParams) {
    if (near.accountBalance() < VOTE_MINIMUM_NEAR) {
      throw Error(`Your account balance needs to be minimum ${VOTE_MINIMUM_NEAR} NEAR to vote`);
    }
    
    const vote: Vote = {
      nearRepresented: near.accountBalance(),
    };

    this.projects[params.projectId].events[params.eventId].questions[params.questionId].votes[near.signerAccountId()] = vote;
  }

  @call({})
  unvote(params: UnvoteParams) {
    delete this.projects[params.projectId].events[params.eventId].questions[params.questionId].votes[near.signerAccountId()];
  }
}