type ParamValue = string | number;

type Project = {
  id: number;
  fullId: string;
};

type ResourceBuilder<T> = (obj: any) => T;

const projectBuilder = (obj: any) => ({
  id: obj.id,
  fullId: obj.fullId,
});

class AlloIndexerClient {
  public fetch: typeof fetch;
  public baseURI: string;

  public readonly routes: { [name: string]: string } = {
    projects: "/data/:chainId/projects.json",
  };

  constructor(fetchImpl: typeof fetch, baseURI: string) {
    this.fetch = fetchImpl;
    this.baseURI = baseURI;
  }

  projects(): Promise<Project[]> {
    const url = this.buildURL("projects", {
      chainId: "1",
    });

    return this.fetchList(projectBuilder, url);
  }

  fetchList<T>(builder: ResourceBuilder<T>, url: string): Promise<T[]> {
    return fetch(url)
      .then(resp => resp.json())
      .then(list => list.map((obj: Array<any>) => builder(obj)));
  }

  buildURL(routeName: string, params: { [key: string]: ParamValue }): string {
    const path = this.compileRoute(this.routes[routeName], params);
    return new URL(path, this.baseURI).toString();
  }

  compileRoute(route: string, params: { [key: string]: ParamValue }): string {
    let slug = route;
    for (const key in params) {
      slug = slug.replace(`:${key}`, params[key].toString());
    }

    return slug;
  }
}

(async () => {
  const c = new AlloIndexerClient(fetch, "http://localhost:4000");
  const ps = await c.projects();
  console.log(ps);
})()
