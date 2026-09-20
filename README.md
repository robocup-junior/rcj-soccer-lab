# RCJ Soccer Lab

Learn the rules. Play a match. Practise refereeing.

An interactive RoboCupJunior Soccer training application with a 3D field,
rule-linked exercises, referee assessments and local video reconstruction.
Designed for teams, volunteers and referees learning the rules together. It
works with the 2026 rules and the 2027 draft, side by side.

**[Open the app](https://robocup-junior.github.io/rcj-soccer-lab/)** ·
[User guide](docs/application-guide.md) ·
[Official rules](https://robocup-junior.github.io/soccer-rules/master/rules.html) ·
[Report a problem](https://github.com/robocup-junior/rcj-soccer-lab/issues)

## Explore

| Mode                   | What you can do                                                                                                                                                                      |
| ---------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Rules**              | Read official source documents alongside more than 110 decision exercises, animated situations and technical workbenches. Orbit and replay situations from different angles.         |
| **Play**               | Arrange robots and the ball, drive manually, play against AI, or play local two-player matches using WASD and arrow keys.                                                            |
| **Referee**            | Practise Step or Continuous matches using classic or RefMate-style controls. Review decisions, missed incidents and the match timeline afterward.                                    |
| **Version comparison** | Pick two versions of the rules and see what changed, what a referee does differently, and where to practise it. Open points of a draft are listed with the assumption the Lab makes. |
| **Video replay**       | Open a local recording, calibrate the field, track robots and the ball, review uncertain positions, save an editable replay or export a 3D video.                                    |
| **Academy**            | Keep device-local progress and game history, take a training-certification round, and optionally submit it for GitHub-verified publication.                                          |

The **Rules version** selector in the header switches the Rules tab, the Play
field and Referee training between the 2026 rules and the 2027 draft. Training
certification always uses the 2026 rules. Maintainers: see
[adding a rules version](docs/adding-a-rules-version.md).

English, Slovak, German and Japanese are available. Official rule calls remain
recognizable in English. Optional illustrated committee companions offer a
skippable introduction and practice feedback; they do not reveal exam answers.

**No login is required to learn or play.** Training certification is an
unproctored learning credential, not an official referee appointment. The
simulator and translations are teaching aids; the official rules and event
organizers remain authoritative. Video reconstruction is experimental and
requires human review, especially for occlusions, similar robots and camera cuts.

## Run locally

Requires Node.js **22.15 or newer** and pnpm **11.19.0**.

```sh
git clone https://github.com/robocup-junior/rcj-soccer-lab.git
cd rcj-soccer-lab
pnpm install --frozen-lockfile
pnpm dev
```

Open [localhost:3000](http://localhost:3000/). On Windows, the included
`Start-RCJ-Soccer-Lab.cmd` launcher also starts the app.

```sh
pnpm typecheck
pnpm test:reconstruction
pnpm test:referee
pnpm test:rules
pnpm test:rulesets
pnpm test:i18n
pnpm build
```

The [contribution guide](CONTRIBUTING.md) lists the full test suite and review
expectations. Broad `pnpm lint` currently includes pre-existing findings in
shared UI components; lint changed files and keep unrelated repairs separate.

## Hosting, privacy and certification

The app runs on **GitHub Pages**. Simulation, video decoding and tracking run
in the browser. No ChatGPT/Sites backend, runtime AI service, paid inference
endpoint or persistent application server is required. User recordings are
**never uploaded** by the reconstruction tool.

Practice and unfinished certification progress live in browser IndexedDB.
Export a backup before changing devices, browsers or website addresses. A local
profile is not an email/password login or automatic cloud synchronization.

Optional certification submissions are **public GitHub issues**. GitHub Actions
recomputes their results, signs accepted records, and publishes a static
directory on the separate `academy-data` branch. Editing an unsigned table or
a local score cannot create a valid published credential. This does not prove
human participation or provide strong anti-cheat protection.

Maintainers: see [organization deployment and migration](docs/organization-deployment.md)
and [academy operations](docs/github-academy.md) for Pages, signing-key setup,
privacy boundaries, recovery and limits. Standard public-repository hosting
targets no subscription cost, subject to GitHub's quotas and policies—not
unlimited capacity or zero future maintenance.

## Embed a situation in the rules

```html
<iframe
  src="https://robocup-junior.github.io/rcj-soccer-lab/?embed=legal-dribbler-backspin"
  title="RCJ Soccer Lab: legal dribbler"
  loading="lazy"
  allowfullscreen
></iframe>
```

The app's **Embed** control provides a complete link for the selected situation.

## Project map

```text
components/          Application screens, 3D viewport and controls
lib/simulator/       Field specification, match engines and referee cases
lib/rulebook/        Learning exercises, rule-linked lessons and source references
lib/rulesets/        One folder per rules version: index, engine parameters, changes
lib/reconstruction/  Local tracking, media utilities and portable replay format
lib/github/          Public submission protocol and signature verification
public/              Browser-ready robot models and committee artwork
scripts/             Tests, asset tools and maintainer operations
docs/                User guides, validation evidence and operations
.github/workflows/   Static deployment and bounded certification publication
```

## Background and reuse

Originally developed by Jakub and contributors in
[JakubGal/rcj-soccer-lab](https://github.com/JakubGal/rcj-soccer-lab).
That repository and its history remain available. This organization repository
contains the application source and its commit history; historical issue and
pull-request links continue to point to their original discussions.

Rule documents, dependencies, robot designs, branding and likeness-based artwork
retain their respective ownership and usage conditions. RefMate-inspired
controls are independently implemented; see the [user guide](docs/application-guide.md).
No new blanket license for the code or third-party assets is granted by this
repository move. Maintainers should agree a project license before inviting
reuse beyond the existing permissions.
