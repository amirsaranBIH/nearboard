import { NearBindgen, near, call, view, UnorderedMap, UnorderedSet } from "near-sdk-js";
import type {
  CreateEventParams,
  CreateProjectParams,
  CreateQuestionParams,
  DeleteEventParams,
  DeleteProjectParams,
  DeleteQuestionParams,
  FollowProjectParams,
  GetEventParams,
  GetEventQuestionsParams,
  GetProjectEventsParams,
  GetProjectFollowersParams,
  GetProjectParams,
  GetProjectPreviousEventsParams,
  GetProjectUpcomingEventParams,
  GetProjectUpcomingEventQuestionsParams,
  GetProjectUpcomingEventsParams,
  GetQuestionParams,
  GetUserFollowsParams,
  GetUserProjectsParams,
  UnfollowProjectParams,
  UnvoteParams,
  UpdateEventParams,
  UpdateProjectParams,
  UpdateQuestionParams,
  VoteParams
} from "./params";
import { Project, Event, Question, Vote, EventType } from "./types";

const CREATE_PROJECT_MINIMUM_NEAR: bigint = BigInt(100_000_000_000_000_000_000_000_000n); // 100 NEAR
const CREATE_EVENT_MINIMUM_NEAR: bigint = BigInt(100_000_000_000_000_000_000_000_000n); // 100 NEAR
const CREATE_QUESTION_MINIMUM_NEAR: bigint = BigInt(10_000_000_000_000_000_000_000_000n); // 10 NEAR
const VOTE_MINIMUM_NEAR: bigint = BigInt(1_000_000_000_000_000_000_000_000n); // 1 NEAR

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
  getProject({ projectId }: GetProjectParams): Project {
    return this.projects.get(projectId);
  }

  @view({})
  getProjects(): Project[] {
    return this.projects.toArray().map(x => x[1]);
  }

  @view({})
  getUserProjects({ accountId }: GetUserProjectsParams): Project[] {
    return this.projects.toArray().map(x => x[1]).filter(project => project.owner === accountId);
  }
  
  @view({})
  getEvent({ eventId }: GetEventParams): Event {
    return this.events.get(eventId);
  }

  @view({})
  getProjectEvents({ projectId }: GetProjectEventsParams): Event[] {
    return this.events.toArray().map(x => x[1]).filter(event => event.projectId === projectId);
  }

  @view({})
  getAllEvents(): Event[] {
    return this.events.toArray().map(x => x[1]);
  }
  
  @view({})
  getQuestion({ questionId }: GetQuestionParams): Question {
    return this.questions.get(questionId);
  }

  @view({})
  getEventQuestions({ eventId }: GetEventQuestionsParams): Question[] {
    return this.questions.toArray().map(x => x[1]).filter(question => question.eventId === eventId);
  }
  
  @view({})
  getThreeUpcomingEvents(): Event[] {
    const timestamp = near.blockTimestamp().toString();
    return this.events.toArray().map(x => x[1]).filter(event => event.startDate.toString() >= timestamp).slice(0, 3);
  }

  @view({})
  getProjectUpcomingEvents({ projectId }: GetProjectUpcomingEventsParams): Event[] {
    const timestamp = near.blockTimestamp().toString();
    return this.events.toArray().map(x => x[1]).filter(event => event.projectId === projectId && event.startDate.toString() >= timestamp);
  }

  @view({})
  getProjectUpcomingEvent({ projectId }: GetProjectUpcomingEventParams): Event {
    const timestamp = near.blockTimestamp().toString();
    const events = this.events.toArray().map(x => x[1]).filter(event => event.projectId === projectId && event.startDate.toString() >= timestamp);

    if (events.length < 1) {
      return null;
    }

    events.sort((a, b) => {
      return a.startDate.toString().localeCompare(b.startDate.toString());
    });

    return events[0];
  }

  @view({})
  getProjectUpcomingEventQuestions({ projectId }: GetProjectUpcomingEventQuestionsParams): Question[] {
    const timestamp = near.blockTimestamp().toString();
    const events = this.events.toArray().map(x => x[1]).filter(event => event.projectId === projectId && event.startDate.toString() >= timestamp);

    if (events.length < 1) {
      return [];
    }

    events.sort((a, b) => {
      return a.startDate.toString().localeCompare(b.startDate.toString());
    });

    return this.questions.toArray().map(x => x[1]).filter(question => question.eventId === events[0].id);
  }

  @view({})
  getProjectPreviousEvents({ projectId }: GetProjectPreviousEventsParams): Event[] {
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
  getUserFollows({ accountId }: GetUserFollowsParams): Project[] {
    return this.follows.toArray().filter(follow => follow.split(":")[0] === accountId).map(follow => {
      return this.projects.get(follow.split(":")[1]);
    });
  }

  @view({})
  getProjectFollowers({ projectId }: GetProjectFollowersParams): string[] {
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

    if (project.description.length < 20) {
      errorMessages.push("Project description must be at lease 20 characters");
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

  validateEvent(event: Event) {
    const errorMessages = [];

    if (event.name.length < 3) {
      errorMessages.push("Event name must be at least 3 characters");
    }

    if (event.name.length > 50) {
      errorMessages.push("Event name must be 50 characters or less");
    }

    if (!this.isUrl(event.eventUrl)) {
      errorMessages.push("Invalid website url");
    }

    if (!event.startDate) {
      errorMessages.push("Event start date not set");
    }

    if (!Object.values(EventType).includes(event.eventType)) {
      errorMessages.push("Event type must be in enum EventType");
    }

    if (errorMessages.length > 0) {
        throw Error(errorMessages.join(", "));
    }
  }

  @call({})
  createProject({ name, description, websiteUrl, logoUrl }: CreateProjectParams): Project {
    if (near.accountBalance() < CREATE_PROJECT_MINIMUM_NEAR) {
      throw Error(`Your account balance needs to be minimum ${CREATE_PROJECT_MINIMUM_NEAR} yohtoNEAR to create a project`);
    }

    this.projectId++;

    const project: Project = {
      id: this.projectId.toString(),
      owner: near.predecessorAccountId(),
      name,
      description,
      websiteUrl,
      logoUrl,
    };

    this.validateProject(project);

    this.projects.set(project.id, project);

    return project;
  }

  @call({})
  updateProject({ id, name, description, websiteUrl, logoUrl }: UpdateProjectParams) {
    let project = this.projects.get(id);

    if (project.owner !== near.predecessorAccountId()) {
      throw Error("Only owner of project can update project");
    }
    
    const newProject: Project = {
      id,
      owner: project.owner,
      name,
      description,
      websiteUrl,
      logoUrl,
    };

    this.validateProject(newProject);

    this.projects.set(project.id, newProject);
  }

  @call({})
  deleteProject({ projectId }: DeleteProjectParams) {
    const project = this.projects.get(projectId);

    if (project.owner !== near.predecessorAccountId()) {
      throw Error("Only owner of project can delete project");
    }

    this.projects.remove(projectId);

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
  createEvent({ projectId, name, eventUrl, startDate, eventType }: CreateEventParams): Event {
    if (near.accountBalance() < CREATE_EVENT_MINIMUM_NEAR) {
      throw Error(`Your account balance needs to be minimum ${CREATE_EVENT_MINIMUM_NEAR} yohtoNEAR to create an event`);
    }

    this.eventId++;
    
    const event: Event = {
      id: this.eventId.toString(),
      name,
      eventUrl,
      startDate: BigInt(startDate),
      eventType,
      projectId,
    };

    this.validateEvent(event);

    this.events.set(event.id, event);

    return event;
  }

  @call({})
  updateEvent({ id, name, eventUrl, startDate, eventType }: UpdateEventParams) {
    let event = this.events.get(id);
    const project = this.projects.get(event.projectId);

    if (project.owner !== near.predecessorAccountId()) {
      throw Error("Only owner of project can update event");
    }

    const newEvent: Event = {
      id,
      name,
      eventUrl,
      startDate: BigInt(startDate),
      eventType,
      projectId: event.projectId,
    };

    this.validateEvent(newEvent);

    this.events.set(event.id, newEvent);
  }

  @call({})
  deleteEvent({ eventId }: DeleteEventParams) {
    const event = this.events.get(eventId);
    const project = this.projects.get(event.projectId);

    if (project.owner !== near.predecessorAccountId()) {
      throw Error("Only owner of project can delete event");
    }

    this.events.remove(eventId);

    const eventQuestions = this.questions.toArray().map(x => x[1]).filter(question => question.eventId === eventId);
      
    eventQuestions.forEach(question => {
      this.questions.remove(question.id);
    });
  }

  @call({})
  createQuestion({ eventId, question }: CreateQuestionParams): Question {
    if (near.accountBalance() < CREATE_QUESTION_MINIMUM_NEAR) {
      throw Error(`Your account balance needs to be minimum ${CREATE_QUESTION_MINIMUM_NEAR} yohtoNEAR to create a question`);
    }

    this.questionId++;
    const asker = near.predecessorAccountId();
    
    const newQuestion: Question = {
      id: this.questionId.toString(),
      asker,
      question,
      eventId,
      timestamp: near.blockTimestamp(),
      votes: [
        {
          voter: near.predecessorAccountId(),
          nearRepresented: near.accountBalance().toString(),
        }
      ]
    };

    this.questions.set(newQuestion.id, newQuestion);

    return newQuestion;
  }

  @call({})
  updateQuestion({ id, question }: UpdateQuestionParams) {
    let currentQuestion = this.questions.get(id);

    if (currentQuestion.asker !== near.predecessorAccountId()) {
      throw Error("Only asker can update question");
    }

    if ((currentQuestion.timestamp + BigInt(1800)) > near.blockTimestamp()) {
      throw Error("Cannot update question after 30 minutes");
    }

    const newQuestion: Question = {
      id: currentQuestion.id,
      asker: currentQuestion.asker,
      question,
      eventId: currentQuestion.eventId,
      timestamp: currentQuestion.timestamp,
      votes: currentQuestion.votes,
    };

    this.questions.set(newQuestion.id, newQuestion);
  }

  @call({})
  deleteQuestion({ questionId }: DeleteQuestionParams) {
    const question = this.questions.get(questionId);

    if (question.asker !== near.predecessorAccountId()) {
      throw Error("Only asker can delete question");
    }

    this.questions.remove(questionId);
  }

  @call({})
  vote({ questionId }: VoteParams) {
    if (near.accountBalance() < VOTE_MINIMUM_NEAR) {
      throw Error(`Your account balance needs to be minimum ${VOTE_MINIMUM_NEAR} yohtoNEAR to vote`);
    }
    
    const question = this.questions.get(questionId);

    if (question.votes.some(vote => vote.voter === near.predecessorAccountId())) {
      throw Error("Already voted for this question");
    }

    const vote: Vote = {
      voter: near.predecessorAccountId(),
      nearRepresented: near.accountBalance().toString(),
    };

    question.votes.push(vote);
    this.questions.set(question.id, question);
  }

  @call({})
  unvote({ questionId }: UnvoteParams) {
    const question = this.questions.get(questionId);
    question.votes = question.votes.filter(vote => vote.voter !== near.predecessorAccountId());
    this.questions.set(question.id, question);
  }

  @call({})
  followProject({ projectId }: FollowProjectParams) {
    const followString = near.predecessorAccountId() + ":" + projectId;
    if (!this.follows.contains(followString)) {
      this.follows.set(followString);
    }
  }

  @call({})
  unfollowProject({ projectId }: UnfollowProjectParams) {
    const followString = near.predecessorAccountId() + ":" + projectId;
    if (this.follows.contains(followString)) {
      this.follows.remove(followString);
    }
  }
}