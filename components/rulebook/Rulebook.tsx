'use client';

import {
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Check,
  ExternalLink,
  Film,
  GitCompareArrows,
  Search,
  TriangleAlert,
  Wrench,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import {
  NativeSelect,
  NativeSelectOption,
} from '@/components/ui/native-select';
import { Progress } from '@/components/ui/progress';
import {
  guideFor,
  rulebookCatalog,
  sectionReference,
  type RuleSection,
} from '@/lib/rulebook/catalog';
import {
  allLearningSituationIds,
  bankClipsFor,
  learningBank,
} from '@/lib/rulebook/learning-bank';
import { useRuleset } from '@/components/rulesets/RulesetProvider';
import { rulesetOptionLabel } from '@/lib/rulesets/registry';
import type { RobotVisualId } from '@/lib/simulator/robot-models';
import { InspectionWorkbench } from './InspectionWorkbench';
import { RuleAnimationPlayer } from './RuleAnimationPlayer';
import {
  BallWorkbench,
  CompanionWorkbench,
  DecisionWorkbench,
  FieldWorkbench,
  KickerWorkbench,
  ReadinessWorkbench,
  ScoringWorkbench,
} from './RuleLabs';
import { cn } from '@/lib/utils';
import {
  LEARNING_PROGRESS_KEY,
  situationCoversSection,
} from '@/lib/rulebook/learning';
import { CaseLesson } from './CaseLesson';
import { ScenarioLesson } from './ScenarioLesson';
import { QuestionLesson } from './QuestionLesson';
import { COMMITTEE_TRAINING_POLICY } from '@/lib/simulator/training-policy';
import { useLocalization } from '@/components/i18n/LocalizationProvider';
import { translateText } from '@/lib/i18n';
import type {
  RuleLearningBridge,
  RuleLearningEvent,
} from '@/lib/certification/client-types';
import { committeeTopic, emitCommitteeEvent } from '@/lib/committee/events';

const DEFAULT_SECTION = 'soccer:inside-penalty-area';
const KNOWN_SITUATION_IDS = allLearningSituationIds();
/** Checks passed under any rule set stay recorded; ids never mean two answers. */
function storedLearningProgress(value: unknown): string[] {
  return Array.isArray(value)
    ? [
        ...new Set(
          value.filter(
            (id): id is string =>
              typeof id === 'string' && KNOWN_SITUATION_IDS.has(id),
          ),
        ),
      ]
    : [];
}

export function Rulebook({
  robotVisual,
  active = true,
  sectionId = DEFAULT_SECTION,
  situationId = null,
  onSelect,
  onCompare,
  learning,
}: {
  robotVisual: RobotVisualId;
  active?: boolean;
  sectionId?: string;
  situationId?: string | null;
  onSelect: (sectionId: string, situationId: string | null) => void;
  /** Opens the Version comparison tab. */
  onCompare?: () => void;
  learning?: RuleLearningBridge;
}) {
  const { locale } = useLocalization();
  const { ruleset } = useRuleset();
  const catalog = useMemo(() => rulebookCatalog(ruleset.id), [ruleset.id]);
  const bank = useMemo(() => learningBank(ruleset.id), [ruleset.id]);
  const RULE_SECTIONS = catalog.sections;
  const RULE_DOCUMENTS = catalog.documents;
  const PROGRESS_KEY = ruleset.readingProgressKey;
  const learningMode = learning?.mode ?? 'practice';
  const certificationRunId = learning?.certificationRunId ?? null;
  const assignedQuestionIds = learning?.questionIds;
  const assignedSituations = useMemo(
    () =>
      learningMode === 'certification' && assignedQuestionIds
        ? bank.situations.filter((item) =>
            assignedQuestionIds.includes(item.id),
          )
        : bank.situations,
    [bank, learningMode, assignedQuestionIds],
  );
  const learningContextKey =
    learningMode === 'certification'
      ? `certification:${certificationRunId ?? 'unassigned'}`
      : 'practice';
  const requestedSituation = assignedSituations.find(
    (item) => item.id === situationId,
  );
  const selectedId =
    requestedSituation && !situationCoversSection(requestedSituation, sectionId)
      ? requestedSituation.sectionId
      : sectionId;
  const [selectedLibrary, setLibrary] = useState<'situations' | 'sections'>(
    'situations',
  );
  const library =
    learningMode === 'certification' ? 'situations' : selectedLibrary;
  const [passed, setPassed] = useState<string[]>([]);
  const [contextCompleted, setContextCompleted] = useState<
    Record<string, string[]>
  >({});
  const [studyAnswers, setStudyAnswers] = useState<Record<string, string>>({});
  const [query, setQuery] = useState('');
  const [layout, setLayout] = useState<'split' | 'text' | 'visual'>('split');
  // Certification presents decisions, not the reference paragraph alongside
  // its answer. The full reading workspace remains available in practice.
  const readingLayout = learningMode === 'certification' ? 'visual' : layout;
  const [reviewed, setReviewed] = useState<string[]>([]);
  const [restored, setRestored] = useState(false);
  const remoteCompleted = useMemo(
    () =>
      storedLearningProgress(learning?.completedSituationIds).filter((id) =>
        assignedSituations.some((item) => item.id === id),
      ),
    [learning?.completedSituationIds, assignedSituations],
  );
  const completedSituationIds = useMemo(
    () =>
      [
        ...new Set([
          ...(learningMode === 'certification'
            ? (contextCompleted[learningContextKey] ?? [])
            : passed),
          ...remoteCompleted,
        ]),
        // Progress is stored across rule sets; count what this one offers.
      ].filter((id) => assignedSituations.some((item) => item.id === id)),
    [
      assignedSituations,
      contextCompleted,
      learningContextKey,
      learningMode,
      passed,
      remoteCompleted,
    ],
  );
  const selected =
    RULE_SECTIONS.find((section) => section.id === selectedId) ??
    RULE_SECTIONS[0];
  const document = RULE_DOCUMENTS.find(
    (item) => item.id === selected.document,
  )!;
  const guide = guideFor(selected);
  const matches = useMemo(
    () =>
      catalog.findSections(query, document.id, (value) =>
        translateText(value, locale),
      ),
    [catalog, document.id, locale, query],
  );
  const documentSections = RULE_SECTIONS.filter(
    (section) => section.document === document.id,
  );
  const documentIndex = documentSections.findIndex(
    (section) => section.id === selected.id,
  );
  const readCount = documentSections.filter((section) =>
    reviewed.includes(section.id),
  ).length;
  const clips = useMemo(
    () => bankClipsFor(bank, selected.anchor),
    [bank, selected.anchor],
  );
  const sourceUrl = catalog.sectionUrl(selected);
  const sourceNotices = catalog.noticesFor(selected);
  // What this rule set changed, relative to the one it is based on.
  const changedAnchors = useMemo(
    () =>
      new Set(
        ruleset.changes.map((change) => `${change.document}:${change.anchor}`),
      ),
    [ruleset],
  );
  const sectionChanges = ruleset.changes.filter(
    (change) =>
      change.document === selected.document &&
      change.anchor === selected.anchor,
  );

  useEffect(() => {
    const raf = requestAnimationFrame(() => {
      try {
        setPassed(
          storedLearningProgress(
            JSON.parse(localStorage.getItem(LEARNING_PROGRESS_KEY) ?? '[]'),
          ),
        );
      } catch {
        /* Invalid quiz progress must not prevent restoring reading progress. */
      }
      setRestored(true);
    });
    return () => cancelAnimationFrame(raf);
  }, []);
  // "Reviewed" marks belong to one rule set: reading section 2.8 of 2026 says
  // nothing about the rewritten section 2.8 of a later year.
  const [reviewedKey, setReviewedKey] = useState<string | null>(null);
  useEffect(() => {
    const raf = requestAnimationFrame(() => {
      let next: string[] = [];
      try {
        const saved: unknown = JSON.parse(
          localStorage.getItem(PROGRESS_KEY) ?? '[]',
        );
        if (Array.isArray(saved))
          next = saved.filter(
            (id): id is string =>
              typeof id === 'string' &&
              RULE_SECTIONS.some((section) => section.id === id),
          );
      } catch {
        /* Reading remains available when local storage is disabled. */
      }
      setReviewed(next);
      setReviewedKey(PROGRESS_KEY);
    });
    return () => cancelAnimationFrame(raf);
  }, [PROGRESS_KEY, RULE_SECTIONS]);

  useEffect(() => {
    if (!restored) return;
    try {
      localStorage.setItem(LEARNING_PROGRESS_KEY, JSON.stringify(passed));
    } catch {
      /* Session-only progress is still usable. */
    }
  }, [restored, passed]);
  useEffect(() => {
    // Never write one rule set's marks under another rule set's key.
    if (reviewedKey !== PROGRESS_KEY) return;
    try {
      localStorage.setItem(PROGRESS_KEY, JSON.stringify(reviewed));
    } catch {
      /* Session-only progress is still usable. */
    }
  }, [PROGRESS_KEY, reviewed, reviewedKey]);

  const select = useCallback(
    (section: RuleSection) => {
      onSelect(section.id, null);
    },
    [onSelect],
  );
  const selectDocument = useCallback(
    (id: string) => {
      const first = RULE_SECTIONS.find((section) => section.document === id);
      if (first) {
        select(first);
        setQuery('');
      }
    },
    [RULE_SECTIONS, select],
  );
  const onRule = useCallback(
    (documentId: string, anchor: string) => {
      const section = RULE_SECTIONS.find(
        (item) => item.document === documentId && item.anchor === anchor,
      );
      if (section) {
        select(section);
        setQuery('');
      }
    },
    [RULE_SECTIONS, select],
  );
  const sectionSituations = assignedSituations.filter((item) =>
    situationCoversSection(item, selected.id),
  );
  const situation =
    requestedSituation ??
    sectionSituations.find((item) => item.kind === 'case') ??
    sectionSituations[0];
  const committeeId = useId();
  const committeeSequence = useRef(0);
  const committeeScope = useRef({
    active,
    context: learningContextKey,
    situationId: situation?.id,
  });
  useEffect(() => {
    committeeScope.current = {
      active,
      context: learningContextKey,
      situationId: situation?.id,
    };
    return () => {
      committeeScope.current.active = false;
    };
  }, [active, learningContextKey, situation?.id]);
  const committeeReading = useRef({
    active,
    mode: learningMode,
    sectionId: selected.id,
  });
  useEffect(() => {
    const previous = committeeReading.current;
    committeeReading.current = {
      active,
      mode: learningMode,
      sectionId: selected.id,
    };
    // Reading companionship starts on a new section, never on initial mount,
    // returning to a cached tab, an exam, or selecting an unanswered question.
    if (
      !active ||
      !previous.active ||
      learningMode !== 'practice' ||
      previous.mode !== 'practice' ||
      situationId !== null ||
      previous.sectionId === selected.id
    )
      return;
    try {
      emitCommitteeEvent({
        id: `${committeeId}:study:${++committeeSequence.current}`,
        surface: 'rules',
        context: 'practice',
        outcome: 'study',
        topic: committeeTopic(selected.id),
      });
    } catch {
      /* Reading remains available without the optional character commentary. */
    }
  }, [active, committeeId, learningMode, selected.id, situationId]);
  const onLearningEvent = (event: RuleLearningEvent) => {
    // Preserve the existing persistence contract and errors. Cosmetic events
    // are independent and are never dispatched before an answer is saved.
    const saved = learning?.onEvent?.(event);
    if (
      active &&
      event.type === 'answer' &&
      !completedSituationIds.includes(event.questionId)
    ) {
      const id = `${committeeId}:rules:${++committeeSequence.current}`;
      void Promise.resolve(saved)
        .then(() => {
          const scope = committeeScope.current;
          if (
            !scope.active ||
            scope.context !== learningContextKey ||
            scope.situationId !== event.questionId
          )
            return;
          try {
            emitCommitteeEvent({
              id,
              surface: 'rules',
              context: event.mode,
              outcome:
                event.mode === 'certification'
                  ? 'recorded'
                  : event.accepted
                    ? 'correct'
                    : 'retry',
              topic: committeeTopic(event.sourceId),
            });
          } catch {
            /* Optional encouragement must never affect answer persistence. */
          }
        })
        .catch(() => undefined);
    }
    return saved;
  };
  const chooseSituation = (id: string) => {
    const item = assignedSituations.find((item) => item.id === id)!;
    onSelect(
      situationCoversSection(item, selected.id) ? selected.id : item.sectionId,
      item.id,
    );
  };
  const passSituation = () => {
    if (!situation) return;
    if (learningMode === 'certification')
      setContextCompleted((current) => ({
        ...current,
        [learningContextKey]: [
          ...new Set([...(current[learningContextKey] ?? []), situation.id]),
        ],
      }));
    else setPassed((current) => [...new Set([...current, situation.id])]);
  };
  const filteredSituations = assignedSituations.filter((item) => {
    const section = RULE_SECTIONS.find(
      (section) => section.id === item.sectionId,
    )!;
    return (
      !query ||
      (
        item.title +
        ' ' +
        translateText(item.title, locale) +
        ' ' +
        section.title +
        ' ' +
        translateText(section.title, locale) +
        ' ' +
        section.number
      )
        .toLowerCase()
        .includes(query.toLowerCase())
    );
  });
  const situationIndex = filteredSituations.findIndex(
    (item) => item.id === situation?.id,
  );
  const navigatingSituations = library === 'situations' && situationIndex >= 0;
  const SCENARIOS = bank.scenarios;
  const studyResults = SCENARIOS.flatMap((item) => {
    const answer = item.choices.find(
      (choice) =>
        choice.id === studyAnswers[`${learningContextKey}:${item.id}`],
    );
    return answer ? [answer.score] : [];
  });
  const studyScore = studyResults.length
    ? `Detailed study score: ${Math.round((studyResults.reduce((sum, score) => sum + score, 0) / studyResults.length) * 100)}% · ${studyResults.length} / ${SCENARIOS.length} studies answered this session`
    : undefined;
  const onSoccerRule = useCallback(
    (anchor: string) => onRule('soccer', anchor),
    [onRule],
  );

  const overview = (
    <section className="rule-lab">
      <h2>Choose something to explore</h2>
      <div className="rule-starting-points">
        <Button
          variant="outline"
          onClick={() => onSoccerRule('inside-penalty-area')}
        >
          <Film />
          <span>
            Pushing & multiple defense
            <small>Five contrasting animated examples</small>
          </span>
          <ArrowRight />
        </Button>
        <Button
          variant="outline"
          onClick={() => onSoccerRule('regulations-inspections')}
        >
          <Wrench />
          <span>
            Technical inspection<small>Measurements and practical checks</small>
          </span>
          <ArrowRight />
        </Button>
        <Button
          variant="outline"
          onClick={() => onSoccerRule('kicker-power-measuring')}
        >
          <Film />
          <span>
            Kicker test<small>Change the rebound and replay</small>
          </span>
          <ArrowRight />
        </Button>
        <Button variant="outline" onClick={() => selectDocument('field')}>
          <BookOpen />
          <span>
            Field specification<small>Dimensions and placement geometry</small>
          </span>
          <ArrowRight />
        </Button>
      </div>
      <p className="rule-small">
        The complete documents remain available in the official-text pane. The
        animations and workbenches are companion learning aids.
      </p>
    </section>
  );

  if (!active) return null;
  return (
    <div className="rulebook-shell">
      <aside className="rulebook-nav" aria-label="Complete rulebook contents">
        <div className="rulebook-nav-top">
          <p className="rule-kicker">
            {learningMode === 'certification'
              ? 'CERTIFICATION RULES / FIRST ANSWER COUNTS'
              : `RULES & SITUATIONS / ${ruleset.shortLabel}`}
            {ruleset.status === 'draft' && (
              <span className="ruleset-draft-badge">Draft</span>
            )}
          </p>
          {learningMode !== 'certification' && (
            <div className="learning-library-switch">
              <Button
                size="sm"
                variant={library === 'situations' ? 'secondary' : 'ghost'}
                onClick={() => setLibrary('situations')}
              >
                Situations
              </Button>
              <Button
                size="sm"
                variant={library === 'sections' ? 'secondary' : 'ghost'}
                onClick={() => setLibrary('sections')}
              >
                All rules
              </Button>
            </div>
          )}
          {learningMode !== 'certification' && (
            <NativeSelect
              aria-label="Official rule document"
              value={document.id}
              onChange={(event) => {
                setLibrary('sections');
                selectDocument(event.target.value);
              }}
            >
              {RULE_DOCUMENTS.map((item) => (
                <NativeSelectOption key={item.id} value={item.id}>
                  {item.title}
                </NativeSelectOption>
              ))}
            </NativeSelect>
          )}
          <div className="rule-search">
            <Search aria-hidden="true" />
            <Input
              aria-label="Search rule sections and numbers"
              placeholder="Find a situation or rule number"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
          </div>
          <div className="rule-reading-progress">
            <span>
              {library === 'situations'
                ? learningMode === 'certification'
                  ? `${completedSituationIds.length} / ${assignedSituations.length} questions completed`
                  : `${completedSituationIds.length} / ${assignedSituations.length} checks passed`
                : `${readCount} / ${documentSections.length} reviewed`}
            </span>
            <Progress
              value={
                library === 'situations'
                  ? (completedSituationIds.length /
                      Math.max(1, assignedSituations.length)) *
                    100
                  : (readCount / documentSections.length) * 100
              }
              aria-label={
                library === 'situations'
                  ? learningMode === 'certification'
                    ? 'Questions answered'
                    : 'Situation checks passed'
                  : 'Reading progress in this document'
              }
            />
          </div>
          {learningMode === 'certification' && (
            <p className="rounded-md border border-amber-300/25 bg-amber-300/10 px-2.5 py-2 text-xs leading-5 text-amber-100">
              Your first answer is final for this certification round. Hints and
              answer-reveal tools are disabled.
            </p>
          )}
        </div>
        <nav
          className="rulebook-toc"
          aria-label={
            query
              ? 'Rule search results across all documents'
              : `${document.title} sections`
          }
        >
          {library === 'situations' && (
            <>
              {filteredSituations.map((item) => {
                const section = RULE_SECTIONS.find(
                  (section) => section.id === item.sectionId,
                )!;
                return (
                  <button
                    key={item.id}
                    className={cn(
                      'rule-toc-item',
                      situation?.id === item.id && 'rule-toc-active',
                    )}
                    aria-current={
                      situation?.id === item.id ? 'page' : undefined
                    }
                    onClick={() => chooseSituation(item.id)}
                  >
                    <span className="rule-toc-number">
                      {completedSituationIds.includes(item.id) ? (
                        <Check
                          aria-label={
                            learningMode === 'certification'
                              ? 'Answer recorded'
                              : 'Check passed'
                          }
                        />
                      ) : (
                        section.number || 'A'
                      )}
                    </span>
                    <span>
                      {learningMode === 'certification'
                        ? `Question ${assignedSituations.indexOf(item) + 1}`
                        : item.title}
                      <small>
                        {item.kind === 'case'
                          ? 'Referee decisions'
                          : item.kind === 'scenario'
                            ? 'Explore & judge'
                            : item.kind === 'question'
                              ? 'Knowledge check'
                              : 'Replay & question'}{' '}
                        · {sectionReference(section)}
                      </small>
                    </span>
                  </button>
                );
              })}
              {!filteredSituations.length && (
                <p className="rule-small">
                  No matching situation. Use All rules to search every
                  paragraph.
                </p>
              )}
            </>
          )}
          {library === 'sections' && (
            <>
              {query && (
                <p className="rule-small">
                  {matches.length} matches across all documents
                </p>
              )}
              {matches.map((section) => (
                <button
                  key={section.id}
                  className={cn(
                    'rule-toc-item',
                    selected.id === section.id && 'rule-toc-active',
                    section.depth === 0 && 'rule-toc-chapter',
                  )}
                  onClick={() => select(section)}
                  aria-current={selected.id === section.id ? 'page' : undefined}
                  style={{
                    paddingLeft: `${12 + Math.min(2, section.depth) * 9}px`,
                  }}
                >
                  <span className="rule-toc-number">
                    {reviewed.includes(section.id) ? (
                      <Check aria-label="Reviewed" />
                    ) : (
                      section.number || '•'
                    )}
                  </span>
                  <span>
                    {section.title}
                    {changedAnchors.has(
                      `${section.document}:${section.anchor}`,
                    ) && (
                      <em className="rule-toc-changed">
                        {`Changed from ${ruleset.basedOn}`}
                      </em>
                    )}
                    {query && (
                      <small>
                        {
                          RULE_DOCUMENTS.find(
                            (item) => item.id === section.document,
                          )?.title
                        }
                      </small>
                    )}
                  </span>
                </button>
              ))}
              {!matches.length && (
                <div className="rule-no-results">
                  <p>No matching section.</p>
                  <Button variant="ghost" onClick={() => setQuery('')}>
                    Clear search
                  </Button>
                </div>
              )}
            </>
          )}
        </nav>
        <div className="rulebook-nav-footer">
          <span>{RULE_DOCUMENTS.length} full official documents</span>
          <small>
            <span>{rulesetOptionLabel(ruleset)}</span>
            {' · '}
            <span>Index checked {catalog.checkedOn}</span>
          </small>
          {learningMode !== 'certification' && onCompare && (
            <Button size="sm" variant="ghost" onClick={onCompare}>
              <GitCompareArrows />
              Compare rule versions
            </Button>
          )}
          <a
            href="https://robocup.org/conduct"
            target="_blank"
            rel="noreferrer"
          >
            Federation conduct policy <ExternalLink />
          </a>
        </div>
      </aside>

      <section
        className="rulebook-main"
        aria-label="Interactive rulebook section"
      >
        <header className="rule-section-heading">
          <div>
            <p className="rule-kicker">
              {document.title} / Indexed revision {document.revision}
            </p>
            <h1>
              {learningMode === 'certification' ? (
                situation ? (
                  `Question ${assignedSituations.indexOf(situation) + 1}`
                ) : (
                  'Certification'
                )
              ) : (
                <>
                  {selected.number && <span>{selected.number}</span>}
                  {selected.title}
                </>
              )}
            </h1>
          </div>
          {learningMode !== 'certification' && (
            <label htmlFor="rule-reviewed" className="rule-reviewed">
              <Checkbox
                id="rule-reviewed"
                checked={reviewed.includes(selected.id)}
                onCheckedChange={(checked) =>
                  setReviewed((current) =>
                    checked
                      ? [...new Set([...current, selected.id])]
                      : current.filter((id) => id !== selected.id),
                  )
                }
              />
              Reviewed
            </label>
          )}
        </header>
        <div className="rule-section-toolbar">
          <div>
            <Button
              size="sm"
              variant="ghost"
              disabled={
                navigatingSituations ? situationIndex <= 0 : documentIndex <= 0
              }
              onClick={() =>
                navigatingSituations
                  ? chooseSituation(filteredSituations[situationIndex - 1].id)
                  : select(documentSections[documentIndex - 1])
              }
            >
              <ArrowLeft />
              {navigatingSituations ? 'Previous situation' : 'Previous rule'}
            </Button>
            <Button
              size="sm"
              variant="ghost"
              disabled={
                navigatingSituations
                  ? situationIndex >= filteredSituations.length - 1
                  : documentIndex >= documentSections.length - 1
              }
              onClick={() =>
                navigatingSituations
                  ? chooseSituation(filteredSituations[situationIndex + 1].id)
                  : select(documentSections[documentIndex + 1])
              }
            >
              {navigatingSituations ? 'Next situation' : 'Next rule'}
              <ArrowRight />
            </Button>
          </div>
          {learningMode !== 'certification' && (
            <NativeSelect
              size="sm"
              value={layout}
              onChange={(event) =>
                setLayout(event.target.value as typeof layout)
              }
              aria-label="Rulebook reading layout"
            >
              <NativeSelectOption value="split">
                Text + interactive guide
              </NativeSelectOption>
              <NativeSelectOption value="text">
                Full-width official text
              </NativeSelectOption>
              <NativeSelectOption value="visual">
                Interactive guide
              </NativeSelectOption>
            </NativeSelect>
          )}
        </div>
        <div
          className={cn('rule-reading-layout', `rule-layout-${readingLayout}`)}
        >
          {readingLayout !== 'visual' && (
            <section
              className="rule-source-pane"
              aria-label="Complete official rule text"
            >
              <div className="rule-pane-label">
                <span>
                  <BookOpen />
                  Official text · live source
                </span>
                <small>Official English source</small>
                <a href={sourceUrl} target="_blank" rel="noreferrer">
                  Open original <ExternalLink />
                </a>
              </div>
              {(ruleset.status === 'draft' || sourceNotices.length > 0) && (
                <div className="rule-source-notice" role="note">
                  <TriangleAlert aria-hidden="true" />
                  <div>
                    {ruleset.status === 'draft' && (
                      <p>
                        This is a draft published for comment. It can still
                        change before the season.
                      </p>
                    )}
                    {sourceNotices.map((notice) => (
                      <p key={notice.id}>{notice.text}</p>
                    ))}
                  </div>
                </div>
              )}
              <iframe
                key={document.id}
                src={sourceUrl}
                title={`Complete official ${document.title}: ${selected.title}`}
                referrerPolicy="no-referrer"
                sandbox="allow-popups allow-popups-to-escape-sandbox"
              />
              <p className="rule-source-footer">
                All paragraphs, tables, notes and appendices are in this
                original document. Internet access is needed for the official
                text. Translations in this app are learning aids; the official
                English source controls.
              </p>
            </section>
          )}
          {readingLayout !== 'text' && (
            <section
              className="rule-guide-pane"
              aria-label="Interactive companion guide"
            >
              <div className="rule-pane-label">
                <span>
                  {guide === 'animation' || guide === 'kicker' ? (
                    <Film />
                  ) : (
                    <Wrench />
                  )}
                  Situation & checking questions
                </span>
                {guide === 'animation' && (
                  <small>{clips.length} examples</small>
                )}
              </div>
              <div className="rule-guide-scroll">
                {learningMode !== 'certification' &&
                  sectionChanges.length > 0 && (
                    <section className="rule-section-changes">
                      <h2>
                        <GitCompareArrows aria-hidden="true" />
                        {`Changed from the ${ruleset.basedOn} rules`}
                      </h2>
                      <ul>
                        {sectionChanges.map((change) => (
                          <li key={change.id}>
                            <strong>{change.title}</strong>
                            <span>{change.after}</span>
                          </li>
                        ))}
                      </ul>
                      {onCompare && (
                        <Button size="sm" variant="outline" onClick={onCompare}>
                          Open the version comparison
                          <ArrowRight />
                        </Button>
                      )}
                    </section>
                  )}
                {sectionSituations.length > 0 && (
                  <section className="learning-situation-picker">
                    <label htmlFor="learning-situation">
                      Situations for this rule
                    </label>
                    <NativeSelect
                      id="learning-situation"
                      value={situation?.id ?? ''}
                      onChange={(event) => chooseSituation(event.target.value)}
                    >
                      {sectionSituations.map((item) => (
                        <NativeSelectOption key={item.id} value={item.id}>
                          {completedSituationIds.includes(item.id) ? '✓ ' : ''}
                          {learningMode === 'certification'
                            ? `Question ${assignedSituations.indexOf(item) + 1}`
                            : item.title}{' '}
                          ·{' '}
                          {item.kind === 'case'
                            ? 'decision practice'
                            : item.kind === 'scenario'
                              ? 'detailed study'
                              : item.kind === 'question'
                                ? 'knowledge check'
                                : 'guided replay'}
                        </NativeSelectOption>
                      ))}
                    </NativeSelect>
                    <p>
                      {
                        sectionSituations.filter((item) =>
                          completedSituationIds.includes(item.id),
                        ).length
                      }{' '}
                      / {sectionSituations.length}{' '}
                      {learningMode === 'certification'
                        ? 'questions answered'
                        : 'situation checks passed'}{' '}
                      ·{' '}
                      {sectionSituations.every((item) =>
                        completedSituationIds.includes(item.id),
                      )
                        ? learningMode === 'certification'
                          ? 'All questions answered'
                          : 'All checks complete'
                        : 'Answer each situation to check your understanding'}
                    </p>
                  </section>
                )}
                {situation?.kind === 'case' && (
                  <CaseLesson
                    key={`${learningContextKey}:${situation.id}`}
                    item={bank.cases.find(
                      (item) => item.id === situation.sourceId,
                    )!}
                    robotVisual={robotVisual}
                    onPassed={passSituation}
                    learningMode={learningMode}
                    certificationRunId={certificationRunId}
                    onLearningEvent={onLearningEvent}
                  />
                )}
                {situation?.kind === 'scenario' && (
                  <ScenarioLesson
                    key={`${learningContextKey}:${situation.id}`}
                    scenario={bank.scenarios.find(
                      (item) => item.id === situation.sourceId,
                    )!}
                    initialAnswer={
                      studyAnswers[
                        `${learningContextKey}:${situation.sourceId}`
                      ]
                    }
                    onAnswer={(id) =>
                      setStudyAnswers((current) => ({
                        ...current,
                        [`${learningContextKey}:${situation.sourceId}`]: id,
                      }))
                    }
                    studyScore={studyScore}
                    robotVisual={robotVisual}
                    onPassed={passSituation}
                    learningMode={learningMode}
                    certificationRunId={certificationRunId}
                    onLearningEvent={onLearningEvent}
                    alreadyAnswered={
                      learningMode === 'certification' &&
                      completedSituationIds.includes(situation.id)
                    }
                  />
                )}
                {situation?.kind === 'clip' && (
                  <RuleAnimationPlayer
                    key={`${learningContextKey}:${situation.id}`}
                    clips={[
                      bank.clips.find(
                        (item) => item.id === situation.sourceId,
                      )!,
                    ]}
                    robotVisual={robotVisual}
                    onPassed={passSituation}
                    learningMode={learningMode}
                    certificationRunId={certificationRunId}
                    onLearningEvent={onLearningEvent}
                    alreadyAnswered={
                      learningMode === 'certification' &&
                      completedSituationIds.includes(situation.id)
                    }
                  />
                )}
                {situation?.kind === 'question' && (
                  <QuestionLesson
                    key={`${learningContextKey}:${situation.id}`}
                    item={bank.questions.find(
                      (item) => item.id === situation.sourceId,
                    )!}
                    onPassed={passSituation}
                    learningMode={learningMode}
                    certificationRunId={certificationRunId}
                    onLearningEvent={onLearningEvent}
                    alreadyAnswered={
                      learningMode === 'certification' &&
                      completedSituationIds.includes(situation.id)
                    }
                  />
                )}
                {learningMode !== 'certification' && (
                  <>
                    {guide === 'animation' &&
                      !situation &&
                      clips.length > 0 && (
                        <div className="rule-example-list">
                          {clips.map((clip) => (
                            <Button
                              key={clip.id}
                              variant="outline"
                              onClick={() => chooseSituation(`clip:${clip.id}`)}
                            >
                              {clip.title}
                            </Button>
                          ))}
                        </div>
                      )}
                    {guide === 'inspection' && (
                      <InspectionWorkbench onRule={onSoccerRule} />
                    )}
                    {guide === 'kicker' && (
                      <KickerWorkbench robotVisual={robotVisual} />
                    )}
                    {guide === 'field' && <FieldWorkbench onRule={onRule} />}
                    {guide === 'ball' && <BallWorkbench />}
                    {guide === 'scoring' && <ScoringWorkbench />}
                    {(
                      [
                        'team',
                        'documentation',
                        'competition',
                        'conduct',
                      ] as string[]
                    ).includes(guide) && (
                      <ReadinessWorkbench
                        key={guide}
                        category={
                          guide as
                            | 'team'
                            | 'documentation'
                            | 'competition'
                            | 'conduct'
                        }
                      />
                    )}
                    {guide === 'decision' && <DecisionWorkbench />}
                    {guide === 'companion' && (
                      <CompanionWorkbench
                        key={document.id}
                        document={document.id as 'entry' | 'superteam'}
                        onDocument={selectDocument}
                      />
                    )}
                    {guide === 'overview' && overview}
                    {selected.anchor === 'robots-control' && (
                      <p className="rule-source-note">
                        Manual Play mode is a practice tool. Competition robots
                        operate autonomously.
                      </p>
                    )}
                  </>
                )}
                {learningMode === 'certification' && !situation && (
                  <p>Select a certification question from the list.</p>
                )}
                <div className="rule-guide-footnote">
                  <BookOpen />
                  <span>
                    {COMMITTEE_TRAINING_POLICY.scope} {bank.clips.length}{' '}
                    authored gameplay examples · {bank.questions.length}{' '}
                    technical, safety and administration checks.
                  </span>
                </div>
              </div>
            </section>
          )}
        </div>
      </section>
    </div>
  );
}
