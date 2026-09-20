import type { RefereeCase } from '../simulator/referee-cases';
import type { RefereeChoice, RuleReference } from '../simulator/types';
import type { RuleClip } from './animations';
import type { RuleQuestion } from './questions';

/** Where a new situation appears in the list of its rule set. */
export type OverlayPlacement = {
  /** Takes the list position of this retired situation, e.g. 'case:pushing'. */
  replaces?: string;
  /** Follows this situation (of the base bank or of this overlay). */
  after?: string;
};

/**
 * A detailed study that reuses the animation of an original scenario with
 * choices and wording for a later rule set.
 */
export type ScenarioVariant = {
  id: string;
  basedOn: string;
  title?: string;
  shortTitle?: string;
  publicSummary?: string;
  refereeCue?: string;
  ruleRef?: Partial<RuleReference>;
  choices: RefereeChoice[];
};

/**
 * What a rule set changes in the learning bank of the rule set it is based on.
 *
 * - `retire` removes situations whose expected answer no longer applies.
 * - `*Text` rewords a situation whose answer is unchanged; it keeps its id, so
 *   progress carries over between rule sets.
 * - `questions`, `clips`, `cases` and `scenarios` add situations. Give them ids
 *   that are unique across ALL rule sets (suffix the season), because progress
 *   and links are stored by id.
 */
export type LearningOverlay = {
  rulesetId: string;
  retire: readonly string[];
  questionText?: Readonly<
    Record<
      string,
      Partial<Pick<RuleQuestion, 'title' | 'question' | 'options' | 'feedback'>>
    >
  >;
  clipText?: Readonly<
    Record<
      string,
      Partial<Pick<RuleClip, 'title' | 'question' | 'options' | 'feedback'>> & {
        /** Replacement frame labels/readouts by frame index. */
        frames?: Record<number, { label?: string; readout?: string }>;
      }
    >
  >;
  caseText?: Readonly<
    Record<
      string,
      Partial<Pick<RefereeCase, 'title' | 'facts' | 'before' | 'explanation'>>
    >
  >;
  /** Title and explanation of live incidents built from an original case. */
  liveText?: Readonly<
    Record<string, Partial<Pick<RefereeCase, 'title' | 'explanation'>>>
  >;
  questions: readonly RuleQuestion[];
  clips: readonly RuleClip[];
  /** Scenes that only drills replay; they are not listed as clip lessons. */
  sceneClips?: readonly RuleClip[];
  cases: readonly RefereeCase[];
  scenarios: readonly ScenarioVariant[];
  placement?: Readonly<Record<string, OverlayPlacement>>;
  /** Decision times of added clips (see clip-assessments.ts). */
  clipAssessments?: Readonly<
    Record<string, { decisionAt: number; context: string }>
  >;
};
