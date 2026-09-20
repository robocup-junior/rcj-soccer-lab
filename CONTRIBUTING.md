# Contributing to RCJ Soccer Lab

Use issues for reproducible bugs and focused pull requests for changes. Include
the app mode, language, browser/version, reproduction steps and expected result.
For rule interpretation, cite the exact official section and explain any
discretion or committee-specific training policy. Do not submit private personal
information, signing keys, participants' progress backups or video recordings
without permission; issues and pull requests are public.

## Development and checks

Use Node.js 22.15+ and pnpm 11.19.0. Install with
`pnpm install --frozen-lockfile`, then run `pnpm dev`.

Before requesting review:

```sh
pnpm typecheck
pnpm test:match
pnpm test:referee
pnpm test:rules
pnpm test:rulesets
pnpm test:learning
pnpm test:certification
pnpm test:github
pnpm test:i18n
pnpm test:committee
pnpm test:reconstruction
pnpm build
```

Use `pnpm exec oxlint <changed-files>` and `pnpm exec oxfmt <changed-files>`.
Keep unrelated formatting or existing shared-component lint repairs separate.
For UI changes, also test the relevant workflow in a browser; a successful
build or an advancing timer is not proof that a video actually presents frames.

## Preserve training integrity

- Keep observable facts, published rules and committee training choices distinct.
- Add a regression test for a corrected rule or simulation behavior.
- Do not silently regrade stored certification evidence after engine changes.
- A new season of the rules is a new rule set, never an edit of an existing
  one. Follow [adding a rules version](docs/adding-a-rules-version.md); the
  certification rule set and its 111 situations stay exactly as they are.
- Continuous mode must accept mistaken calls and explain them afterward, not
  reveal the correct decision during a certification attempt.
- Update English, Slovak, German and Japanese authored copy together while
  preserving official calls and robot identifiers.
- Keep guest modes usable and footage local. Do not introduce a backend or
  runtime service dependency without an explicit maintainer decision.
- Use temporary signing keys and synthetic data for tests. Never publish a
  fabricated passing exam or a test certificate to the live registry.

See [academy operations](docs/github-academy.md),
[video validation](docs/reconstruction-validation.md),
[adding a rules version](docs/adding-a-rules-version.md), and the
[application guide](docs/application-guide.md) for detailed boundaries.
