# Adding a rules version

RCJ Soccer Lab can work with several versions of the RoboCupJunior Soccer
rules at once. The header has a **Rules version** selector; the Rules tab, the
Play field and Referee training (Step and Continuous) follow it, and the
**Version comparison** tab shows what changed between any two versions.

Each version is a _rule set_: one folder under `lib/rulesets/<id>/`. A rule set
describes itself as a list of differences from the rule set it is based on, so
a new season is mostly data. This guide walks through adding one, using a
fictional `2028` as the example.

## What a rule set consists of

| File                                      | Purpose                                                                |
| ----------------------------------------- | ---------------------------------------------------------------------- |
| `lib/rulesets/<id>/sources.json`          | URLs of the six official documents for that version                    |
| `lib/rulesets/<id>/official-index.json`   | Generated heading index of those documents (never edited by hand)      |
| `lib/rulesets/<id>/gameplay.ts`           | Engine parameters that differ from the previous version                |
| `lib/rulesets/<id>/changes.ts`            | The curated change list, training assumptions and source notices       |
| `lib/rulesets/<id>/learning.ts`           | Learning overlay: situations to retire, reword and add                 |
| `lib/rulesets/<id>/definition.ts`         | Ties the files together: label, status (`draft` or `final`), `basedOn` |
| `scripts/ruleset-translations/*-<id>.mjs` | Reviewed Slovak, German and Japanese translations of the new sentences |

Three lists register it: `lib/rulesets/registry.ts`, `lib/rulesets/gameplay.ts`
and `lib/rulebook/overlays.ts`. The app refuses to start if the first two
disagree, and `pnpm test:rulesets` checks everything else in this guide.

## 1. Index the official documents

Create `lib/rulesets/2028/sources.json` by copying the previous season's file
and changing the `id` and the six URLs. Then build the index:

```sh
python scripts/sync-rulebook.py 2028
```

The script downloads the pages, records every heading with its number and
anchor, and stores a content hash per document. The comparison tab uses the
hashes to tell which documents changed at all, and the heading lists to find
added, removed, renumbered and retitled sections, even for changes that nobody
has described yet.

If a published page is broken, build the documents locally from the rules
repository and index those files instead. Name them after the document ids
(`soccer.html`, `field.html`, `ball.html`, `scoring.html`, `superteam.html`,
`entry.html`); documents without a local file are still downloaded. The index
then records that it came from local files:

```sh
python scripts/sync-rulebook.py 2028 --html-dir path/to/built/html
```

Describe the problem for readers in `sourceNotices` (step 3) and re-run the
plain command once the page is fixed. The 2027 draft needed this: a markup
error in its first publication hid the headings of sections 2.2 to 2.6.

**Freeze the previous version first.** The `master` URL of the rules
repository always shows the newest final rules. Before it moves on to the new
season, point the older rule set's `sources.json` at a permanent address of
that season (a tag, a branch or an archived copy) and re-run the script for it.
Otherwise the "2026 rules" reader would silently start showing 2027 text.

## 2. Describe how the game is played differently

`lib/rulesets/2028/gameplay.ts` lists only the engine parameters that change.
Everything else is inherited from the rule set it is based on:

```ts
import type { DeepPartial, GameplayRules } from '../types';

export const GAMEPLAY_2028: DeepPartial<GameplayRules> = {
  outOfBounds: { penaltySeconds: 90 },
};
```

Register it in the chain in `lib/rulesets/gameplay.ts`. The available
parameters are documented on the `GameplayRules` type in
`lib/rulesets/types.ts`.

When a rule changes in a way that no parameter expresses yet:

1. Add a parameter to `GameplayRules`, with the current behaviour as its value
   in `lib/rulesets/2026/gameplay.ts`.
2. Read it in the engine (`lib/simulator/referee-match.ts`,
   `continuous-director.ts`, `referee-rules.ts`) where the behaviour is decided.
3. Run `pnpm test:rulesets`. The golden-session tests in
   `scripts/ruleset-engine.test.mjs` replay eight recorded matches under the
   certification rules and compare a hash of every decision. They must stay
   unchanged: certification replays are verified against exactly this engine.

Field geometry is **not** versioned. `lib/simulator/field-spec.ts` describes
one field, and the certification replays depend on it. Markings that only one
version has are drawn on top of it (see the pushing line in
`PlayCanvasViewport.tsx`). A season that changes the field dimensions needs a
versioned field specification first; treat that as its own project.

## 3. Write the change list

`lib/rulesets/2028/changes.ts` feeds the Version comparison tab and the
"Changed from …" boxes in the Rules tab. One entry per change:

```ts
{
  id: 'out-of-bounds-ninety',
  document: 'soccer',
  anchor: 'out-of-bounds',          // heading anchor in the NEW version
  kind: 'changed',                  // 'added' | 'changed' | 'removed'
  area: 'out-of-bounds',
  impact: 'referee',                // who has to do something differently
  title: 'Out of bounds lasts 90 seconds',
  before: 'What the previous version said, in one or two sentences.',
  after: 'What the new version says.',
  effect: 'What a referee does differently on the field.',
  simulator: 'How the Lab models it.',
  assumptions: ['…'],               // optional, see below
  practice: ['case:out-90-2028'],   // situations that train this change
}
```

Write `before` and `after` as summaries in your own words, and link to the
official text through `anchor`; do not paste paragraphs of the rules. Use
`previousAnchor` when a heading was renamed.

Where the published text leaves something open, the simulator still has to do
_something_. Say so openly as a `TrainingAssumption` (the question, and what
the Lab does), link it from the change, and keep the choice behind a single
gameplay parameter so it can be switched when the committee decides.

`sourceNotices` are short notes shown above the official text of the listed
sections, for example while a published page has a known defect. Delete them
when they no longer apply.

## 4. Adapt the learning situations

`lib/rulesets/2028/learning.ts` exports a `LearningOverlay`
(`lib/rulebook/overlay-types.ts`) and is registered in
`lib/rulebook/overlays.ts`:

- `retire` – ids of situations whose expected answer is no longer right.
- `questionText`, `clipText`, `caseText`, `liveText` – new wording for
  situations whose answer is unchanged. They keep their id, so a learner's
  progress carries over.
- `questions`, `clips`, `cases`, `scenarios` – new situations. Suffix every new
  id with the season (`out-90-2028`): progress and shared links are stored by
  id across all versions. A new referee drill names the original drill whose
  engine behaviour it shares with `like`.
- `placement` – where a new situation appears in the list (`replaces` a
  retired one, or `after` another).

Never edit the original bank in `lib/rulebook/questions.ts`,
`lib/rulebook/animations.ts` or `lib/simulator/referee-cases.ts` for a new
season. Certification rounds are assigned from it, and its 111 situations are
frozen in the examination manifests.

## 5. Define and register the rule set

`lib/rulesets/2028/definition.ts` follows the 2027 file: `id`, `label`
(`'2028 rules'`), `shortLabel`, `status`, `basedOn: '2027'`, the index, the
gameplay rules from `gameplayRulesFor('2028')`, and the lists from step 3.
Give it a new `readingProgressKey`. Then add it to `RULESETS` in
`lib/rulesets/registry.ts`, oldest first.

## 6. Translate

Add `scripts/ruleset-translations/changes-2028.mjs` and `learning-2028.mjs`
with rows of `[English, Slovak, German, Japanese]`, list them in
`scripts/ruleset-translations.mjs`, and regenerate the catalogue:

```sh
pnpm i18n:generate
pnpm test:i18n
```

A row that names a team is written once for Blue; the mirrored Yellow variant
is derived automatically. Keep robot names such as `Blue 1` in English, as they
are labelled on the field. `pnpm test:rulesets` fails for every new sentence
without a reviewed row. To publish a draft quickly with machine translation
only, list the rule set in `MACHINE_TRANSLATED_RULESETS` in
`scripts/ruleset-translations.test.mjs` and remove it again once the rows are
written.

Build sentences that contain values as one template literal, and start them
with words rather than with the value. The runtime matches templates by their
fixed text, and a template that begins with a placeholder can also swallow the
sentence in front of it.

## 7. Test

```sh
pnpm typecheck
pnpm test:rulesets     # registry, indexes, change list, overlays, engine, translations
pnpm test:referee
pnpm test:learning
pnpm test:certification
pnpm test:i18n
pnpm build
```

Add engine tests for the new behaviour to `scripts/ruleset-engine.test.mjs`.
`runDeterministicSession({ rulesetId: '2028', … })` in
`scripts/ruleset-engine-driver.mjs` plays a whole seeded match with a perfect,
a sloppy or an idle referee. The suite already checks for every registered
rule set that each drill can be solved with every robot model.

Then look at it in the browser under both the old and the new version: the
Rules tab, a Step match, a Continuous match, the Play field and the comparison
tab, in at least one language other than English.

## When a draft becomes final

1. Re-run `sync-rulebook.py` for it against the final pages, and point
   `sources.json` at the final address.
2. Update the change list and overlay for anything that changed after the
   draft, and resolve the training assumptions that the final text settles.
3. Set `status: 'final'` in its definition.
4. Make it the default in `DEFAULT_RULESET_ID` (`lib/rulesets/registry.ts`)
   when the season starts.

## Certification

Training certification stays on one fixed rule set,
`CERTIFICATION_RULESET_ID` in `lib/rulesets/gameplay.ts`. While a
certification round, one of its games or a saved review is open, the selector
is locked to it. Moving certification to a newer season is a separate,
deliberate release: it needs a new policy and engine version, new question
manifests and an updated verifier, as described in
[academy operations](github-academy.md).
