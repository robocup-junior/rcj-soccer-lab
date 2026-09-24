/**
 * Contracts for versioned RoboCupJunior Soccer rule sets.
 *
 * A rule set is data: where its official documents live, the heading index of
 * those documents, the gameplay parameters the simulator and referee trainer
 * read, and the curated list of changes from the rule set it is based on.
 * Adding a season means adding one folder and one registry line; see
 * docs/adding-a-rules-version.md.
 */

export type RulesetStatus = 'final' | 'draft';

/** Stable identifiers of the official documents indexed for every rule set. */
export type RuleDocumentId =
  | 'soccer'
  | 'field'
  | 'ball'
  | 'scoring'
  | 'superteam'
  | 'entry';

export type OfficialDocument = {
  id: string;
  title: string;
  url: string;
  revision: string;
  headingCount: number;
  paragraphCount: number;
  footnoteCount: number;
  /** Hash of the downloaded file; changes with every rebuild of the source. */
  sha256: string;
  /** Hash of the visible body text only; stable across date-only rebuilds. */
  contentSha256?: string;
  duplicateAnchors: string[];
};

export type OfficialSection = {
  id: string;
  document: string;
  anchor: string;
  title: string;
  number: string;
  depth: number;
  chapter: string;
};

export type OfficialIndex = {
  checkedOn: string;
  /** Present when the index was not produced from the published pages. */
  note?: string;
  documents: OfficialDocument[];
  sections: OfficialSection[];
};

/**
 * Parameters of the published rules that the match engines adjudicate.
 * A new season overrides only what changed. When a future rule needs behaviour
 * that no parameter describes yet, add a field here, give every earlier rule
 * set its previous behaviour, and read the field where the engine decides.
 */
export type GameplayRules = {
  outOfBounds: {
    /** Seconds a robot called out of bounds stays off the field. */
    penaltySeconds: number;
    /** A kick-off that becomes due before the penalty has elapsed ends it. */
    kickoffEndsPenaltyEarly: boolean;
    /**
     * After the penalty time, the robot comes back at the next game
     * interruption (kick-off, lack of progress, pushing, stoppage) rather
     * than as soon as the time has elapsed.
     */
    returnNeedsInterruption: boolean;
    /** Where the referee places a returning out-of-bounds robot. */
    returnPlacement: 'furthest-neutral-spot' | 'own-corner';
    /**
     * Whose goals are not granted while a penalized robot is still on the
     * field: any goal of its team, or only a goal that robot itself scores.
     */
    voidGoals: 'penalized-team' | 'penalized-robot';
    /** Being pushed onto the wall wedge ("ramp") may also be called pushed out. */
    pushedOntoRampWaivable: boolean;
  };
  multipleDefense: {
    /** Penalty areas in which two partly overlapping teammates infringe. */
    areas: 'any' | 'own';
  };
  pushing: {
    /** A referee judgment, or an objective line the defender reaches. */
    basis: 'discretion' | 'line';
    /**
     * Goalwards translation of the curved white penalty marking's centreline,
     * in metres. Null when the rule set has no pushing line.
     */
    lineDepth: number | null;
    /** The published documents do not state the position yet. */
    lineProvisional: boolean;
  };
  holding: {
    /** What a confirmed ball-holding call does to the robot during play. */
    consequence: 'inspect' | 'damaged';
  };
  lackOfProgress: {
    /** Time-served out-of-bounds robots come back before the ball is moved. */
    returnServedRobotsFirst: boolean;
  };
  kickoff: {
    /** A neutral kick-off takes place when no robot is left on the field. */
    neutralWhenAllRobotsOut: boolean;
  };
  lateTeam: {
    /** Goal difference at which a late team loses automatically, if any. */
    automaticLossAtGoals: number | null;
  };
  kickerTest: {
    procedure: 'goal-rebound' | 'vertical-height';
    /** Maximum ball height in metres for the vertical procedure. */
    maximumHeight: number | null;
  };
};

export type DeepPartial<T> = {
  [K in keyof T]?: T[K] extends object ? DeepPartial<T[K]> : T[K];
};

/** Explicit exercise conventions where a published text leaves a choice open. */
export type TrainingAssumption = {
  id: string;
  /** Short label for lists. */
  title: string;
  /** What the published text leaves open. */
  question: string;
  /** What this trainer does, in one or two sentences. */
  choice: string;
  /** Sections a reader should open to judge the assumption. */
  anchors: string[];
};

export type RuleChangeKind = 'added' | 'changed' | 'removed';
export type RuleChangeArea =
  | 'match'
  | 'restarts'
  | 'penalty-area'
  | 'out-of-bounds'
  | 'ball'
  | 'robots'
  | 'administration'
  | 'editorial';
/** Who has to do something differently because of the change. */
export type RuleChangeImpact = 'referee' | 'teams' | 'organizers' | 'editorial';

export type RuleChange = {
  /** Stable within its rule set; also used in links to the comparison. */
  id: string;
  document: RuleDocumentId;
  /** Section anchor in the newer rule set. */
  anchor: string;
  /** Section anchor in the older rule set, when the section moved. */
  previousAnchor?: string;
  kind: RuleChangeKind;
  area: RuleChangeArea;
  impact: RuleChangeImpact;
  title: string;
  /** The older rule, summarised in the Lab's own words. */
  before: string;
  /** The newer rule, summarised in the Lab's own words. */
  after: string;
  /** What a referee or team does differently. */
  effect?: string;
  /** How the simulator and trainer model the newer rule. */
  simulator?: string;
  /** Ids of the training assumptions that this change depends on. */
  assumptions?: readonly string[];
  /** Learning situations (in the newer rule set) that practise the change. */
  practice?: string[];
};

export type SourceNotice = {
  id: string;
  document: RuleDocumentId;
  /** Anchors whose deep links are affected. */
  anchors: string[];
  text: string;
};

export type RulesetSummary = {
  id: string;
  season: number;
  /** "RoboCupJunior Soccer Rules 2027". */
  title: string;
  /** "2027 rules". */
  label: string;
  /** "2027". */
  shortLabel: string;
  status: RulesetStatus;
  /** The rule set this one revises; null for the oldest registered one. */
  basedOn: string | null;
};

export type RulesetDefinition = RulesetSummary & {
  /** Heading inventory written by scripts/sync-rulebook.py. */
  index: OfficialIndex;
  /** Fully resolved parameters (the rule set it is based on plus overrides). */
  gameplay: GameplayRules;
  /** Curated changes relative to `basedOn`; empty for the oldest rule set. */
  changes: readonly RuleChange[];
  assumptions: readonly TrainingAssumption[];
  sourceNotices: readonly SourceNotice[];
  /** How applied-rule references name the main document. */
  soccerDocumentLabel: string;
  /** Device-local "reviewed sections" are kept per rule set. */
  readingProgressKey: string;
};
