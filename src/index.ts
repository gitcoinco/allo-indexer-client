type RouteParamValue = string | number;

type Project = {
  id: string;
  projectNumber: number;
};

type Round = {
  id: string;
  votesCount: number;
  applicationsStartTime: Date;
};

type Vote = {
  id: string;
  token: string;
  amount: string;
};

type ResourceBuilder<T> = (obj: any) => T;

const projectBuilder = (obj: any): Project => ({
  id: obj.id,
  projectNumber: obj.projectNumber,
});

const roundBuilder = (obj: any): Round => ({
  id: obj.id,
  votesCount: obj.votes,
  applicationsStartTime: new Date(obj.applicationsStartTime * 1000),
});

const voteBuilder = (obj: any): Vote => ({
  id: obj.id,
  token: obj.token,
  amount: obj.amount,
});


class AlloIndexerClient {
  public fetch: typeof fetch;
  public baseURI: string;
  public chainId: number;

  public readonly routes: { [name: string]: string } = {
    projects: "/data/:chainId/projects.json",
    rounds: "/data/:chainId/rounds.json",
    roundVotes: "/data/:chainId/rounds/:roundId/votes.json",
  };

  constructor(fetchImpl: typeof fetch, baseURI: string, chainId: number) {
    this.fetch = fetchImpl;
    this.baseURI = baseURI;
    this.chainId = chainId;
  }

  getProjects(): Promise<Project[]> {
    const url = this.buildURL("projects", {});
    return this.fetchResources(projectBuilder, url);
  }

  getProject(key: keyof Project, value: any): Promise<Project | undefined> {
    const url = this.buildURL("projects", {});
    return this.fetchResourceFromList(projectBuilder, url, key, value);
  }

  getRounds(): Promise<Round[]> {
    const url = this.buildURL("rounds", {});
    return this.fetchResources(roundBuilder, url);
  }

  getRoundVotes(roundId: string): Promise<Vote[]> {
    const url = this.buildURL("roundVotes", {
      roundId,
    });

    return this.fetchResources(voteBuilder, url);
  }

  private fetchResources<T>(builder: ResourceBuilder<T>, url: string): Promise<T[]> {
    return fetch(url)
      .then(resp => resp.json())
      .then(list => list.map((obj: Array<any>) => builder(obj)));
  }

  private fetchResourceFromList<T>(builder: ResourceBuilder<T>, url: string, key: keyof T, value: any): Promise<T | undefined> {
    return this.fetchResources(builder, url)
      .then((list: T[]) => list.find((r: T) => r[key] === value));
  }

  private buildURL(routeName: string, params: { [key: string]: RouteParamValue }): string {
    const path = this.compileRoute(this.routes[routeName], {
      ...params,
      chainId: this.chainId,
    });

    return new URL(path, this.baseURI).toString();
  }

  private compileRoute(route: string, params: { [key: string]: RouteParamValue }): string {
    let slug = route;
    for (const key in params) {
      slug = slug.replace(`:${key}`, params[key].toString());
    }

    return slug;
  }
}

(async () => {
  const c = new AlloIndexerClient(fetch, "http://localhost:4000", 1);
  // const res = await c.getProjects();
  const res = await c.getProject("projectNumber", 1);
  // const res = await c.getRounds();
  // const res = await c.getRoundVotes("0xD95A1969c41112cEE9A2c931E849bCef36a16F4C");
  console.log(res);
})()
