import { Client, ResourceFetchError } from "../client";
import { parseArgs } from "util";

type CommandHandlerArgs = { [arg: string]: string | boolean | undefined };

type CommandHandlerWithArgs = (
  args: CommandHandlerArgs
  // eslint-disable-next-line
) => Promise<any>;
// eslint-disable-next-line
type CommandHandlerWithoutArgs = () => Promise<any>;
type CommandHandler = CommandHandlerWithArgs | CommandHandlerWithoutArgs;

type Command = {
  options: {
    [key: string]: {
      type: "string" | "boolean";
      short: string;
    };
  };
  handler: CommandHandler;
};

const baseURI = "https://grants-stack-indexer.fly.dev/";
const chainId = 1;
const client = new Client(fetch, baseURI, chainId);

const logError = (err: Error) => {
  switch (err.name) {
    case "ResourceFetchError": {
      const e = err as ResourceFetchError;
      console.error(
        "resource fetch error:",
        `${e.status} - ${e.statusText}.`,
        err.message
      );
      break;
    }

    default:
      console.error("unexpected error:", err.name, err.message);
  }
};

const projectsCommand = () =>
  client
    .getProjects()
    .then((projects) => projects.forEach((p) => console.log(p)))
    .catch(logError);

const roundsCommand = () =>
  client
    .getRounds()
    .then((rounds) => rounds.forEach((r) => console.log(r)))
    .catch(logError);

const projectCommand = (args: CommandHandlerArgs) =>
  client
    .getProjectBy("projectNumber", Number(args.projectNumber))
    .then((project) => console.log(project))
    .catch(logError);

const commands: { [name: string]: Command } = {
  projects: {
    options: {},
    handler: projectsCommand,
  },

  rounds: {
    options: {},
    handler: roundsCommand,
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

await cmd.handler(values);
