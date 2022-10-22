import { EventType } from "./types";

export type GetProjectParams = {
    projectId: string;
};

export type GetUserProjectsParams = {
    accountId: string;
};

export type GetEventParams = {
    eventId: string;
};

export type GetProjectEventsParams = {
    projectId: string;
};

export type GetQuestionParams = {
    questionId: string;
};

export type GetEventQuestionsParams = {
    eventId: string;
};

export type GetProjectUpcomingEventsParams = {
    projectId: string;
};

export type GetProjectUpcomingEventParams = {
    projectId: string;
};

export type GetProjectUpcomingEventQuestionsParams = {
    projectId: string;
};

export type GetProjectPreviousEventsParams = {
    projectId: string;
};

export type GetUserFollowsParams = {
    accountId: string;
};

export type GetProjectFollowersParams = {
    projectId: string;
};

export type CreateProjectParams = {
    name: string;
    description: string;
    websiteUrl: string;
    logoUrl: string;
};

export type UpdateProjectParams = {
    id: string;
    name: string;
    description: string;
    websiteUrl: string;
    logoUrl: string;
};

export type DeleteProjectParams = {
    projectId: string;
};

export type CreateEventParams = {
    projectId: string;
    name: string;
    eventUrl: string;
    startDate: string;
    eventType: EventType;
};

export type UpdateEventParams = {
    id: string;
    name: string;
    eventUrl: string;
    startDate: string;
    eventType: EventType;
};

export type DeleteEventParams = {
    eventId: string;
};

export type CreateQuestionParams = {
    eventId: string;
    question: string;
};

export type UpdateQuestionParams = {
    id: string;
    question: string;
};

export type DeleteQuestionParams = {
    questionId: string;
};

export type VoteParams = {
    questionId: string;
};

export type UnvoteParams = {
    questionId: string;
};

export type FollowProjectParams = {
    projectId: string;
};

export type UnfollowProjectParams = {
    projectId: string;
};