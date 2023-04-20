import BaseClient from "./baseClient.js";
import {
  projectBuilder,
  roundBuilder,
  voteBuilder,
  roundApplicationBuilder,
} from "./builders.js";
import { Project, Round, Vote, Application } from "./types.js";

export class Client extends BaseClient {
  protected routes: { [name: string]: string } = {
    projects: "/data/:chainId/projects.json",
    projectVotes: "/data/:chainId/rounds/:roundId/projects/:projectId/votes.json",
    rounds: "/data/:chainId/rounds.json",
    roundVotes: "/data/:chainId/rounds/:roundId/votes.json",
    roundApplications: "/data/:chainId/rounds/:roundId/projects.json",
  };

  constructor(fetchImpl: typeof fetch, baseURI: string, chainId: number) {
    super(fetchImpl, baseURI, chainId);
  }

  getProjects(): Promise<Project[]> {
    return this.fetchResources("projects", {}, projectBuilder);
  }

  getProjectBy(
    key: keyof Project,
    value: string | number
  ): Promise<Project | undefined> {
    return this.fetchResourceFromList(
      "projects",
      {},
      projectBuilder,
      key,
      value
    );
  }

  getProjectsBy(
    key: keyof Project,
    value: string | number
  ): Promise<Project[]> {
    return this.fetchResourcesFromList(
      "projects",
      {},
      projectBuilder,
      key,
      value
    );
  }

  getProjectById(id: string): Promise<Project | undefined> {
    return this.fetchResourceFromList(
      "projects",
      {},
      projectBuilder,
      "id",
      id,
      true
    );
  }

  getRounds(): Promise<Round[]> {
    return this.fetchResources("rounds", {}, roundBuilder);
  }

  getRoundBy(
    key: keyof Round,
    value: string | number,
    caseSensitive = false
  ): Promise<Round | undefined> {
    return this.fetchResourceFromList(
      "rounds",
      {},
      roundBuilder,
      key,
      value,
      caseSensitive
    );
  }

  getRoundApplications(roundId: string): Promise<Application[]> {
    return this.fetchResources(
      "roundApplications",
      { roundId },
      roundApplicationBuilder
    );
  }

  getRoundApplicationBy(
    roundId: string,
    key: keyof Application,
    value: string | number
  ): Promise<Application | undefined> {
    return this.fetchResourceFromList(
      "roundApplications",
      { roundId },
      roundApplicationBuilder,
      key,
      value
    );
  }

  getVotes(roundId: string, projectId?: string): Promise<Vote[]> {
    if (projectId) {
      return this.fetchResources(
        "projectVotes",
        { roundId, projectId },
        voteBuilder
      );
    } else {
      return this.fetchResources("roundVotes", { roundId }, voteBuilder);
    }
  }
}
