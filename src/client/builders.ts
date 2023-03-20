import {
  ResourceBuilder,
  Project,
  Round,
  Application,
  Vote,
} from "./types";

export const projectBuilder: ResourceBuilder<Project> = (obj: any): Project => ({
  id: obj.id,
  projectNumber: obj.projectNumber,
});

export const roundBuilder: ResourceBuilder<Round> = (obj: any): Round => ({
  id: obj.id,
  votesCount: obj.votes,
  applicationsStartTime: new Date(obj.applicationsStartTime * 1000),
});

export const voteBuilder: ResourceBuilder<Vote> = (obj: any): Vote => ({
  id: obj.id,
  token: obj.token,
  amount: obj.amount,
});

export const roundApplicationBuilder: ResourceBuilder<Application> = (obj: any): Application => ({
  id: obj.id,
  projectNumber: obj.projectNumber,
  roundId: obj.roundId,
  status: obj.status,
  payoutAddress: obj.payoutAddress,
});
