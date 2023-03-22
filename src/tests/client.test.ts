import { Client } from "../client";
import fs from "fs";
import path from "path";

const baseDataURI = "https://test.dev";
const chainId = 0;

const loadFixture = (name: string) => {
  const p = path.resolve(__dirname, "fixtures", `${name}.json`);
  const data = fs.readFileSync(p, { encoding: "utf8", flag: "r" });
  return data;
};

const mockFetch = (status: number, fixture: string) => {
  const body = loadFixture(fixture);
  const responseMock = new Response(body, { status });
  return jest.fn(() => Promise.resolve(responseMock));
};

describe("Client", () => {
  describe("getProjects", () => {
    test("returns projects", async () => {
      const c = new Client(mockFetch(200, "projects"), baseDataURI, chainId);
      const projects = await c.getProjects();
      expect(projects.length).toEqual(2);

      const expectedProjects = [
        {
          id: "0x00000000000000000000000000000000000000000000000000000000000001",
          projectNumber: 1,
          title: "Project 1",
        },
        {
          id: "0x00000000000000000000000000000000000000000000000000000000000002",
          projectNumber: 2,
          title: "Project 2",
        },
      ];

      expect(projects).toEqual(expectedProjects);
    });

    test("throws error for HTTP status code outside 200..299", async () => {
      const c = new Client(mockFetch(404, "projects"), baseDataURI, chainId);
      await expect(c.getProjects()).rejects.toThrow(
        `cannot fetch resource at route "projects"`
      );
    });
  });
});
