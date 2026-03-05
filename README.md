# @roastery-capsules/env

Type-safe environment variable validation and injection plugin for the [Roastery CMS](https://github.com/roastery-cms) ecosystem.

[![Checked with Biome](https://img.shields.io/badge/Checked_with-Biome-60a5fa?style=flat&logo=biome)](https://biomejs.dev)

## Overview

**@roastery-capsules/env** is an [Elysia](https://elysiajs.com) plugin that validates environment variables at boot time using [TypeBox](https://github.com/sinclairzx81/typebox) schemas and exposes them as a typed `env` decorator throughout your application.

The `env()` function always includes `PORT` and `NODE_ENV` (`DEVELOPMENT` | `TESTING` | `PRODUCTION`) by default, and lets you extend the schema with any additional variables your application needs.

## Technologies

| Tool | Purpose |
|------|---------|
| [Elysia](https://elysiajs.com) | Plugin target and decorator injection |
| [@roastery/terroir](https://github.com/roastery-cms/terroir) | Runtime schema validation and exception handling |
| [tsup](https://tsup.egoist.dev) | Bundling to ESM + CJS with `.d.ts` generation |
| [Bun](https://bun.sh) | Runtime, test runner, and package manager |
| [Knip](https://knip.dev) | Unused exports and dependency detection |
| [Husky](https://typicode.github.io/husky) + [commitlint](https://commitlint.js.org) | Git hooks and conventional commit enforcement |

## Installation

```bash
bun add @roastery-capsules/env
```

**Peer dependencies** (install alongside):

```bash
bun add @roastery/barista @roastery/terroir elysia
```

---

## Usage

```typescript
import { Elysia } from 'elysia';
import { env } from '@roastery-capsules/env';
import { t } from '@roastery/terroir';

const app = new Elysia()
  .use(
    env(
      t.Object({
        DATABASE_URL: t.String(),
        JWT_SECRET: t.String(),
      })
    )
  )
  .get('/', ({ env }) => {
    // env.PORT, env.NODE_ENV, env.DATABASE_URL, env.JWT_SECRET
    // are all fully typed
    return `Running on port ${env.PORT}`;
  });
```

### Built-in variables

`env()` always validates and injects the following variables regardless of your schema:

| Variable | Type | Values |
|----------|------|--------|
| `PORT` | `string` | Any |
| `NODE_ENV` | `string` | `DEVELOPMENT` \| `TESTING` \| `PRODUCTION` |

If any variable — built-in or custom — is missing or invalid, an `InvalidEnvironmentException` is thrown at boot time before the server starts.

---

## Development

```bash
# Run tests
bun run test:unit

# Run tests with coverage
bun run test:coverage

# Build for distribution
bun run build

# Check for unused exports and dependencies
bun run knip

# Full setup (build + bun link)
bun run setup
```

## License

MIT
