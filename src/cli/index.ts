import { Client } from "../client";
import { parseArgs } from "util";

const baseURI = "https://grants-stack-indexer.fly.dev/";
const chainId = 1;
const client = new Client(fetch, baseURI, chainId);

const projectsCommand = async (_args: { [key: string]: string }) => {
  const projects = await client.getProjects();
  projects.forEach((p) => console.log(p));
};

const projectCommand = async (args: { [key: string]: string }) => {
  const project = await client.getProjectBy(
    "projectNumber",
    Number(args.projectNumber)
  );
  console.log(project);
};

const commands: any = {
  projects: {
    options: {},
    handler: projectsCommand,
  },

  project: {
    options: {
      projectNumber: {
        type: "string",
        short: "p",
      },
    },
    handler: projectCommand,
  },
};

const cmdName = process.argv[2];
const flags = process.argv.slice(3);

const cmd = commands[cmdName];
if (cmd === undefined) {
  console.error("command not found:", cmdName);
  process.exit(1);
}

const { values } = parseArgs({
  args: flags,
  options: cmd.options,
});

cmd.handler(values);

// (async () => {
//   // const c = new Client(fetch, "http://localhost:4000", 1);
//   const c = new Client(fetch, "https://grants-stack-indexer.fly.dev/", 1);
//   // const res = await c.getProjects();
//   // const res = await c.getProjectBy("projectNumber", 1);
//   // const res = await c.getRounds();
//   // const res = await c.getRoundBy("id", "0x8E420122dE3B3792ABcc69921433a48868bcfAc2");
//   // const res = await c.getRoundApplications("0xD95A1969c41112cEE9A2c931E849bCef36a16F4C");
//   const res = await c.getRoundApplicationBy("0xD95A1969c41112cEE9A2c931E849bCef36a16F4C", "id", "0xc290dd8e51ac35480d9872ce4484aac23bb812c47c0567bfd4beb9113726ed11");
//   // const res = await c.getRoundVotes("0xD95A1969c41112cEE9A2c931E849bCef36a16F4C");
//   console.log(res);
// })()
