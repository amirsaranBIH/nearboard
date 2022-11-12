import { AccountId } from "near-sdk-js/lib/types";

export enum EventType {
    LiveEvent,
    OnlineEvent,
    AMA,
    Podcast,
};
  
export type Project = {
    id: string;
    owner: AccountId;
    name: string;
    description: string;
    websiteUrl: string;
    logoUrl: string;
};
  
export type Event = {
    id: string;
    name: string;
    eventUrl: string;
    startDate: bigint;
    eventType: EventType;
    projectId: string;
};

export type Question = {
    id: string;
    question: string;
    asker: AccountId;
    eventId: string;
    votes: AccountId[];
};