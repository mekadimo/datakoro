<div align="center">

<img src="./static/img/datakoro-readme-logo.png" alt="Datakoro"/>

Mekadimo's universal database. Storing all concepts made by humanity.

![state](https://img.shields.io/badge/state-work%20in%20progress-critical)
![GitHub](https://img.shields.io/github/license/mekadimo/datakoro)
![GitHub issues](https://img.shields.io/github/issues-raw/mekadimo/datakoro)
![GitHub repo size](https://img.shields.io/github/repo-size/mekadimo/datakoro)

</div>

This repository is a work in progress!

# About Datakoro

Datakoro is a universal database with one particular goal: to store all
humanity's knowledge in a
[graph](https://en.wikipedia.org/wiki/Graph_(discrete_mathematics))
of concepts and relations, so anyone can access to information and the current
state of science. Its structure reflects how we humans abstract concepts in a
sane way, mathematizing the world.

This database can be considered as an "encyclopedia of concepts". There are
more ambitious long-term goals, such as automating decision-making by analyzing
all the information to coordinate society on a large scale. However, the current
priority is for it to grow as much as possible with high-quality data.

The name 'Datakoro' was inspired by two words: 'data', from English, and
'kokoro' (heart, spirit, mind), from Japanese. The full meaning could be seen
as 'data with heart', since the orientation of this project is humanistic. The
main reasons for being open-source are transparency and continuity; that's why
the license is the GNU AGPL v3.

Datakoro is the main tool of the [Mekadimo Project](https://mekadimo.org),
alongside a mathematical
[constructed language](https://en.wikipedia.org/wiki/Constructed_language)
called 'Mekaranto'. The project's goal is to change the world by transitioning
from a fiction-based society, referred to as 'Primadimo', to a science-based
society, known as 'Mekadimo'.

## FAQ

Non-technical questions:

- **Is it like Wikipedia?** No. Wikipedia stores knowledge in the form of
  *text*, while Datakoro stores *concepts* organized in abstract graphs. For
  example, once each concept has a name in each language, the knowledge of their
  relations is available in all languages. Datakoro's knowledge is the
  *structure* of the graph, like any mathematical knowledge in science; text
  is used only so it can be readable by humans.
- **Is it an AI?** No. Datakoro is a database, not a large language model. In
  the future, Datakoro could be used to improve reasoning and accuracy of AI.
- **Is it like Google?** No. Google is a search engine to find *web pages*.
  Datakoro is used to find *concepts*, and it stores its own data.
- **Is it like WolframAlpha?** No. WolframAlpha is an answer engine that
  "computes knowledge" in different ways; it's a tool to automate access to
  factual data and calculations. Datakoro's approach is different: based on a
  single universal graph of abstractions, combined with Mekaranto since both
  have the same structure and rules, oriented to redesign human culture with
  scientific principles (instead of just being a tool to automate common tasks),
  etc. Also, WolframAlpha is closed-source for-profit software, while Datakoro
  is open-source non-profit software.

Technical questions:

- **Why SvelteKit?** Because it's one of the most pragmatic options out there.
  It's an amazing full stack TypeScript web framework designed to build robust
  and performant multi-platform web applications. In the future, once WASM
  doesn't depend on JavaScript and stable frameworks are ready, we would like
  to migrate from TypeScript to Rust; there are other well-designed
  languages like Haskell or ATS, but Rust is future-proof.
- **Why PostgreSQL?** We don't have enough resources to build an entire DBMS
  from scratch. Datakoro would be amazing with software designed to fit its
  requirements, but that task will be addressed in the distant future.
  PostgreSQL is a mature and advanced DBMS with a strong reputation and more
  than 35 years of active development. We prefer to rely on that, instead of
  recent software with few guarantees.

# Installation

## Development

*NOTE: If you want to contribute to this project, please read first the
`DEVELOPMENT.md` file.*

We use [Docker](https://www.docker.com/) containers during the development of
Datakoro, so we don't mix our local environment with Datakoro's requirements.
We assume you are using a common GNU/Linux distribution like Debian, Fedora
or Arch, a text editor like VS Code, and that your terminal is running in the
root directory of this repository. But feel free to use other tools if you
know what you're doing.

First of all, we need TLS certificates so NGINX can do its job. This is not
mandatory, since we can access Datakoro with non-encrypted HTTP requests, but
it's recommended to have a fully working environment. Create some certificates
for this case is as simple as running:

```sh
make dev-certs
```

Then, all Docker containers can be created and start running (automatic if
using VS Code Docker dev-containers).

From a shell inside the container `datakoro_server`, we run migrations with:

```sh
make migrate
```

And we run the server in development with:

```sh
make run
```

And that's it! Datakoro should be ready to use in:

- HTTP: http://localhost:5173/
- HTTPS: https://localhost:8443/

## Release

Work in progress.
