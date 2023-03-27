import { ResourceBuilder, Project, Round, Application, Vote } from "./types.js";

export const projectBuilder: ResourceBuilder<Project> = (
  obj: any
): Project => ({
  id: obj.id,
  projectNumber: obj.projectNumber,
  title: obj.metadata?.title ?? "",
});

export const roundBuilder: ResourceBuilder<Round> = (obj: any): Round => ({
  id: obj.id,
  votes: obj.votes,
  uniqueContributors: obj.uniqueContributors,
  amountUSD: obj.amountUSD,
  applicationsStartTime: new Date(obj.applicationsStartTime * 1000),
});

export const voteBuilder: ResourceBuilder<Vote> = (obj: any): Vote => ({
  id: obj.id,
  projectId: obj.projectId,
  roundId: obj.roundId,
  token: obj.token,
  voter: obj.voter,
  grantAddress: obj.grantAddress,
  amount: obj.amount,
  amountUSD: obj.amountUSD,
});

export const roundApplicationBuilder: ResourceBuilder<Application> = (
  obj: any
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
