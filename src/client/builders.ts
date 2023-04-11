import {
  RawObject,
  ResourceBuilder,
  Project,
  Round,
  Application,
  Vote,
} from "./types.js";

export const projectBuilder: ResourceBuilder<Project> = (
  obj: RawObject
): Project => ({
  id: obj.id,
  projectNumber: obj.projectNumber,
  title: obj.metadata?.title ?? "",
});

export const roundBuilder: ResourceBuilder<Round> = (
  obj: RawObject
): Round => ({
  id: obj.id,
  votes: obj.votes,
  uniqueContributors: obj.uniqueContributors,
  amountUSD: obj.amountUSD,
  applicationsStartTime: new Date(obj.applicationsStartTime * 1000),
});

export const voteBuilder: ResourceBuilder<Vote> = (obj: RawObject): Vote => ({
  id: obj.id,
  token: obj.token,
  amount: obj.amount,
});

export const roundApplicationBuilder: ResourceBuilder<Application> = (
  obj: RawObject
): Application => ({
  id: obj.id,
  projectNumber: obj.projectNumber,
  roundId: obj.roundId,
  status: obj.status,
  payoutAddress: obj.payoutAddress,
  amountUSD: obj.amountUSD,
  votes: obj.votes,
  uniqueContributors: obj.uniqueContributors,
});
