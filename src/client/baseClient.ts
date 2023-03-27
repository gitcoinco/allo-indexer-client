import { ResourceBuilder } from "./types.js";
import { ResourceFetchError } from "./errors.js";

type RouteParams = {
  [key: string]: string | number;
};

abstract class BaseClient {
  public fetch: typeof fetch;
  public baseURI: string;
  public chainId: number;

  protected abstract routes: { [name: string]: string };

  /** MAKE SURE TO DO fetch.bind(window) WHEN PASSING IN FETCH IMPLEMENTATION */
  constructor(fetchImpl: typeof fetch, baseURI: string, chainId: number) {
    this.fetch = fetchImpl;
    this.baseURI = baseURI;
    this.chainId = chainId;
  }

  protected async fetchResources<T>(
    routeName: string,
    params: RouteParams,
    builder: ResourceBuilder<T>
  ): Promise<T[]> {
    const url = this.buildURL(routeName, params);
    return this.fetch(url)
      .then((resp) => {
        if (!resp.ok) {
          throw new ResourceFetchError(
            resp.status,
            resp.statusText,
            `cannot fetch resource at route "${routeName}"`
          );
        }

        return resp.json();
      })
      .then((list) => list.map((obj: Array<any>) => builder(obj)));
  }

  protected async fetchResourceFromList<T>(
    routeName: string,
    params: RouteParams,
    builder: ResourceBuilder<T>,
    key: keyof T,
    value: any,
    caseSensitive: boolean = false
  ): Promise<T | undefined> {
    return this.fetchResources(routeName, params, builder).then((list: T[]) => {
      let f = (r: T) => {
        const actualValue = r[key];
        if (caseSensitive && typeof actualValue === "string") {
          return actualValue.toLowerCase() === value.toLowerCase();
        }

        return r[key] === value;
      };

      return list.find(f);
    });
  }

  protected buildURL(routeName: string, params: RouteParams): string {
    const path = this.compileRoute(this.routes[routeName], {
      ...params,
      chainId: this.chainId,
    });

    return new URL(path, this.baseURI).toString();
  }

  protected compileRoute(route: string, params: RouteParams): string {
    let slug = route;
    for (const key in params) {
      slug = slug.replace(`:${key}`, params[key].toString());
    }

    return slug;
  }
}

export default BaseClient;
