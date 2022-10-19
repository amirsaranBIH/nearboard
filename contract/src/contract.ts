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
  startDate: number;
  eventType: EventType;
  projectId: number;
  questions: { [id: number]: Question };
};

type Question = {
  id: number;
  question: string;
  asker: AccountId;
  eventId: number;
  votes: { [voter: AccountId]: Vote };
};

type Vote = {
  nearRepresented: string;
};

@NearBindgen({})
class Nearboard {
  projectId = 0;
  eventId = 0;
  questionId = 0;
  projects: { [id: number]: Project } = {};

  @view({})
  getProject({ projectId }): Project {
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
  getUserProjects({ accountId }): Project[] {
    const projects: Project[] = [];

    for (const id in this.projects) {
      if (this.projects[id].owner === accountId) {
        projects.push(this.projects[id]);
      }
    }

    return projects;
  }
  
  @view({})
  getEvent({ projectId, eventId }): Event {
    return this.projects[projectId].events[eventId];
  }

  @view({})
  getProjectEvents({ projectId }): Event[] {
    const events: Event[] = [];

    for (const id in this.projects[projectId].events) {
      events.push(this.projects[projectId].events[id]);
    }

    return events;
  }

  @view({})
  getAllEvents(): Event[] {
    const events: Event[] = [];

    for (const projectId in this.projects) {
      for (const eventId in this.projects[projectId].events) {
        events.push(this.projects[projectId].events[eventId]);
      }
    }

    return events;
  }
  
  @view({})
  getQuestion({ projectId, eventId, questionId }): Question {
    return this.projects[projectId].events[eventId].questions[questionId];
  }

  @view({})
  getQuestions({ projectId, eventId }): Question[] {
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
        if (this.projects[projectId].events[eventId].startDate < near.blockTimestamp()) {
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
        if (this.projects[projectId].events[eventId].startDate >= near.blockTimestamp()) {
          events.push(this.projects[projectId].events[eventId]);
        }
      }
    }

    return events;
  }

  @view({})
  getUpcomingEvents({ projectId }): Event[] {
    const events: Event[] = [];

    for (const eventId in this.projects[projectId].events) {
      if (this.projects[projectId].events[eventId].startDate < near.blockTimestamp()) {
        events.push(this.projects[projectId].events[eventId]);
      }
    }

    return events;
  }

  @view({})
  getPreviousEvents({ projectId }): Event[] {
    const events: Event[] = [];

    for (const eventId in this.projects[projectId].events) {
      if (this.projects[projectId].events[eventId].startDate >= near.blockTimestamp()) {
        events.push(this.projects[projectId].events[eventId]);
      }
    }

    return events;
  }
  
  @view({})
  getPopularQuestions() {
    const questions = [];
    
    for (const projectId in this.projects) {
      for (const eventId in this.projects[projectId].events) {
        for (const questionId in this.projects[projectId].events[eventId].questions) {
          questions.push({
            ...this.projects[projectId].events[eventId].questions[questionId],
            event: this.projects[projectId].events[eventId],
          });
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
      logoUrl: logoUrl,
      events: {},
    };

    this.validateProject(project);

    this.projects[this.projectId] = project;

    return this.projectId;
  }

  @call({})
  updateProject({ projectId, name, description, websiteUrl, logoUrl }) {
    let project = this.getProject({ projectId });
    
    const newProject: Project = {
      id: project.id,
      owner: project.owner,
      name: name,
      description: description,
      websiteUrl: websiteUrl,
      logoUrl: logoUrl,
      events: project.events,
    };

    this.validateProject(newProject);

    this.projects[projectId] = newProject;
  }

  @call({})
  createEvent({ projectId, name, eventUrl, startDate, eventType }): number {
    if (near.accountBalance() < CREATE_EVENT_MINIMUM_NEAR) {
      throw Error(`Your account balance needs to be minimum ${CREATE_EVENT_MINIMUM_NEAR} NEAR to create an event`);
    }

    this.eventId++;

    const project = this.getProject({ projectId });
    
    const event: Event = {
      id: this.eventId,
      name: name,
      eventUrl: eventUrl,
      startDate: startDate,
      eventType: eventType,
      projectId,
      questions: {},
    };

    project.events[this.eventId] = event;

    return this.eventId;
  }

  @call({})
  updateEvent({ projectId, eventId, name, eventUrl, startDate, eventType }) {
    let event = this.getEvent({ projectId, eventId });

    const newEvent: Event = {
      id: event.id,
      name: name,
      eventUrl: eventUrl,
      startDate: startDate,
      eventType: eventType,
      projectId,
      questions: event.questions,
    };

    this.projects[projectId].events[eventId] = newEvent;
  }

  @call({})
  createQuestion({ projectId, eventId, question }): number {
    if (near.accountBalance() < CREATE_QUESTION_MINIMUM_NEAR) {
      throw Error(`Your account balance needs to be minimum ${CREATE_QUESTION_MINIMUM_NEAR} NEAR to create a question`);
    }

    this.questionId++;
    const asker = near.signerAccountId();

    const event = this.getEvent({ projectId, eventId });
    
    const newQuestion: Question = {
      id: this.questionId,
      asker,
      question: question,
      eventId,
      votes: {
        [asker]: {
          nearRepresented: near.accountBalance().toString(),
        }
      },
    };

    event.questions[this.questionId] = newQuestion;

    return this.questionId;
  }

  @call({})
  updateQuestion({ projectId, eventId, questionId, question }) {
    let currentQuestion = this.getQuestion({ projectId, eventId, questionId });

    const newQuestion: Question = {
      id: currentQuestion.id,
      asker: currentQuestion.asker,
      question: question,
      eventId,
      votes: currentQuestion.votes,
    };

    this.projects[projectId].events[eventId].questions[questionId] = newQuestion;
  }

  @call({})
  vote({ projectId, eventId, questionId }) {
    if (near.accountBalance() < VOTE_MINIMUM_NEAR) {
      throw Error(`Your account balance needs to be minimum ${VOTE_MINIMUM_NEAR} NEAR to vote`);
    }
    
    const vote: Vote = {
      nearRepresented: near.accountBalance().toString(),
    };

    this.projects[projectId].events[eventId].questions[questionId].votes[near.signerAccountId()] = vote;
  }

  @call({})
  unvote({ projectId, eventId, questionId }) {
    delete this.projects[projectId].events[eventId].questions[questionId].votes[near.signerAccountId()];
  }
}