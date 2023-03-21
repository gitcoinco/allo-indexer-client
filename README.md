# Allo indexer client

A typescript client for the [Allo Indexer](https://github.com/gitcoinco/allo-indexer).

## Installation

```
npm install git+https://github.com/gitcoinco/allo-indexer-client.git
```

## Example

```javascript
import { Client } from "allo-indexer-client";

const baseURI = "https://grants-stack-indexer.fly.dev/";
const chainId = 1;
const fetchImplementation = fetch;
const client = new Client(fetchImplementation, baseURI, chainId);

(async () => {
  const projects = await client.getProjects();
  console.log(projects);
})();
```

### Cli

```
git clone git@github.com:gitcoinco/allo-indexer-client.git
cd allo-indexer-client

npm run cli -- projects
npm run cli -- project --projectNumber 12
```
