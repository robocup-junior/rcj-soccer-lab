'use client';

import { useMemo, useState } from 'react';
import {
  ArrowLeftRight,
  ArrowRight,
  BookOpen,
  ExternalLink,
  FlaskConical,
  GitCompareArrows,
  GraduationCap,
  Search,
  TriangleAlert,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  NativeSelect,
  NativeSelectOption,
} from '@/components/ui/native-select';
import { useRuleset } from '@/components/rulesets/RulesetProvider';
import { useLocalization } from '@/components/i18n/LocalizationProvider';
import { translateText } from '@/lib/i18n';
import { rulebookCatalog, sectionReference } from '@/lib/rulebook/catalog';
import { learningBank } from '@/lib/rulebook/learning-bank';
import {
  RULE_CHANGE_AREAS,
  RULE_CHANGE_IMPACTS,
  compareRulesets,
  type ComparedChange,
  type SectionDifference,
} from '@/lib/rulesets/compare';
import { RULESETS, rulesetOptionLabel } from '@/lib/rulesets/registry';
import type {
  OfficialSection,
  RuleChangeImpact,
  RulesetDefinition,
  TrainingAssumption,
} from '@/lib/rulesets/types';
import { cn } from '@/lib/utils';
import './compare.css';

const KIND_LABEL = { added: 'New', changed: 'Changed', removed: 'Removed' };
const STRUCTURE_LABEL: Record<SectionDifference['kind'], string> = {
  added: 'New section',
  removed: 'Section removed',
  renumbered: 'Renumbered',
  retitled: 'Retitled',
};
const areaLabel = (id: string) =>
  RULE_CHANGE_AREAS.find((area) => area.id === id)?.label ?? id;
const impactLabel = (id: string) =>
  RULE_CHANGE_IMPACTS.find((impact) => impact.id === id)?.label ?? id;
/** Unnumbered sections are referred to by their title alone. */
const sectionLabel = (section: OfficialSection) => {
  const reference = sectionReference(section);
  return reference === section.title
    ? section.title
    : `${reference} ${section.title}`;
};

export default function VersionComparison({
  active,
  compareWith,
  onCompareWithChange,
  onOpenRule,
  onOpenSituation,
}: {
  active: boolean;
  /** The second rule set; the first one is the rule set selected in the header. */
  compareWith: string;
  onCompareWithChange: (rulesetId: string) => void;
  onOpenRule: (sectionId: string, rulesetId: string) => void;
  onOpenSituation: (
    situationId: string,
    sectionId: string,
    rulesetId: string,
  ) => void;
}) {
  const { locale } = useLocalization();
  const { selectedId, select } = useRuleset();
  const [impact, setImpact] = useState<RuleChangeImpact | 'all'>('all');
  const [query, setQuery] = useState('');
  const comparison = useMemo(
    () => compareRulesets(selectedId, compareWith),
    [compareWith, selectedId],
  );
  const { older, newer } = comparison;
  const same = older.id === newer.id;

  const visible = useMemo(() => {
    const terms = query.trim().toLowerCase().split(/\s+/).filter(Boolean);
    return comparison.changes.filter((change) => {
      if (impact !== 'all' && change.impact !== impact) return false;
      if (!terms.length) return true;
      const section = change.newerSection ?? change.olderSection;
      const source = [
        change.title,
        change.before,
        change.after,
        change.effect ?? '',
        areaLabel(change.area),
        section ? sectionLabel(section) : '',
      ].join(' ');
      // People search in the language they read.
      const searchable =
        `${source} ${translateText(change.title, locale)} ${translateText(change.before, locale)} ${translateText(change.after, locale)}`.toLowerCase();
      return terms.every((term) => searchable.includes(term));
    });
  }, [comparison.changes, impact, locale, query]);

  const steps = useMemo(() => {
    const groups = new Map<string, ComparedChange[]>();
    for (const change of visible) {
      const key = `${change.step.from}→${change.step.to}`;
      groups.set(key, [...(groups.get(key) ?? []), change]);
    }
    return [...groups.entries()];
  }, [visible]);

  const counts = useMemo(
    () => ({
      all: comparison.changes.length,
      ...Object.fromEntries(
        RULE_CHANGE_IMPACTS.map((item) => [
          item.id,
          comparison.changes.filter((change) => change.impact === item.id)
            .length,
        ]),
      ),
    }),
    [comparison.changes],
  ) as Record<RuleChangeImpact | 'all', number>;
  const changedDocuments = comparison.documents.filter(
    (document) => document.contentChanged !== false || document.sections.length,
  );

  if (!active) return null;
  return (
    <div className="compare-shell">
      <header className="compare-hero">
        <p className="rule-kicker">
          <GitCompareArrows aria-hidden="true" /> Version comparison
        </p>
        <h1>What changed between two versions of the rules</h1>
        <div className="compare-pickers">
          <label>
            <span>Compare</span>
            <NativeSelect
              aria-label="First rules version"
              value={selectedId}
              onChange={(event) => select(event.target.value)}
            >
              {RULESETS.map((item) => (
                <NativeSelectOption key={item.id} value={item.id}>
                  {rulesetOptionLabel(item)}
                </NativeSelectOption>
              ))}
            </NativeSelect>
          </label>
          <Button
            variant="outline"
            size="icon"
            aria-label="Swap the two versions"
            title="Swap the two versions"
            onClick={() => {
              const first = selectedId;
              select(compareWith);
              onCompareWithChange(first);
            }}
          >
            <ArrowLeftRight />
          </Button>
          <label>
            <span>with</span>
            <NativeSelect
              aria-label="Second rules version"
              value={compareWith}
              onChange={(event) => onCompareWithChange(event.target.value)}
            >
              {RULESETS.map((item) => (
                <NativeSelectOption key={item.id} value={item.id}>
                  {rulesetOptionLabel(item)}
                </NativeSelectOption>
              ))}
            </NativeSelect>
          </label>
        </div>
        {!same && (
          <>
            <p className="compare-direction">
              {`Changes are always listed from the older to the newer version: ${older.label} → ${newer.label}.`}
            </p>
            <dl className="compare-summary">
              <div>
                <dt>Rule changes</dt>
                <dd>{counts.all}</dd>
              </div>
              <div>
                <dt>Changes to referee decisions</dt>
                <dd>{counts.referee}</dd>
              </div>
              <div>
                <dt>Documents with changed text</dt>
                <dd>
                  {`${comparison.documents.filter((document) => document.contentChanged).length} / ${comparison.documents.length}`}
                </dd>
              </div>
              <div>
                <dt>Open points the Lab had to assume</dt>
                <dd>{comparison.assumptions.length}</dd>
              </div>
            </dl>
          </>
        )}
        {[older, newer]
          .filter(
            (ruleset, index, list) =>
              ruleset.status === 'draft' && list.indexOf(ruleset) === index,
          )
          .map((ruleset) => (
            <p key={ruleset.id} className="compare-draft" role="note">
              <TriangleAlert aria-hidden="true" />
              {`The ${ruleset.label} are a draft published for comment. They can still change, and this comparison will be updated with them.`}
            </p>
          ))}
      </header>

      {same ? (
        <p className="compare-empty">
          Choose two different versions to see what changed between them.
        </p>
      ) : (
        <div className="compare-body">
          <section aria-labelledby="compare-changes">
            <div className="compare-section-heading">
              <h2 id="compare-changes">Rule changes</h2>
              <div className="rule-search compare-search">
                <Search aria-hidden="true" />
                <Input
                  aria-label="Search the changes"
                  placeholder="Search the changes"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                />
              </div>
            </div>
            <fieldset
              className="compare-filter"
              aria-label="Filter changes by who they affect"
            >
              <Button
                size="sm"
                variant={impact === 'all' ? 'secondary' : 'ghost'}
                aria-pressed={impact === 'all'}
                onClick={() => setImpact('all')}
              >
                All changes <b>{counts.all}</b>
              </Button>
              {RULE_CHANGE_IMPACTS.filter((item) => counts[item.id] > 0).map(
                (item) => (
                  <Button
                    key={item.id}
                    size="sm"
                    variant={impact === item.id ? 'secondary' : 'ghost'}
                    aria-pressed={impact === item.id}
                    onClick={() => setImpact(item.id)}
                  >
                    {item.label} <b>{counts[item.id]}</b>
                  </Button>
                ),
              )}
            </fieldset>
            {!comparison.connected && (
              <p className="compare-empty">
                These two versions are not linked by a recorded revision, so
                only the differences in document structure are available.
              </p>
            )}
            {comparison.connected && !visible.length && (
              <p className="compare-empty">
                {comparison.changes.length
                  ? 'No change matches this filter.'
                  : 'No rule changes are recorded between these versions.'}
              </p>
            )}
            {steps.map(([key, changes]) => (
              <div key={key} className="compare-step">
                {steps.length > 1 && (
                  <h3>{`${changes[0].step.from} → ${changes[0].step.to}`}</h3>
                )}
                {changes.map((change) => (
                  <ChangeCard
                    key={`${key}:${change.id}`}
                    change={change}
                    older={older}
                    newer={newer}
                    assumptions={comparison.assumptions}
                    onOpenRule={onOpenRule}
                    onOpenSituation={onOpenSituation}
                  />
                ))}
              </div>
            ))}
          </section>

          {comparison.assumptions.length > 0 && (
            <section aria-labelledby="compare-assumptions">
              <div className="compare-section-heading">
                <h2 id="compare-assumptions">
                  Open points and what the Lab assumes
                </h2>
              </div>
              <p className="compare-lead">
                Where the published text leaves a point open, the simulator and
                the referee trainer need a working answer. These are training
                assumptions of this Lab, not rules. The event organizers and the
                final text decide.
              </p>
              <div className="compare-assumptions">
                {comparison.assumptions.map((assumption) => (
                  <article
                    key={assumption.id}
                    id={`assumption-${assumption.id}`}
                  >
                    <h3>{assumption.title}</h3>
                    <p>{assumption.question}</p>
                    <p>
                      <strong>In the Lab</strong>
                      <span>{assumption.choice}</span>
                    </p>
                  </article>
                ))}
              </div>
            </section>
          )}

          <section aria-labelledby="compare-documents">
            <div className="compare-section-heading">
              <h2 id="compare-documents">Official documents</h2>
            </div>
            <p className="compare-lead">
              Computed from the heading index of both versions, so it is
              complete even for changes nobody has described yet.
            </p>
            <div className="compare-documents">
              {comparison.documents.map((document) => (
                <article
                  key={document.id}
                  data-changed={
                    document.contentChanged !== false ||
                    document.sections.length > 0
                  }
                >
                  <header>
                    <h3>{document.title}</h3>
                    <span>
                      {document.contentChanged === false
                        ? 'Text unchanged'
                        : document.contentChanged
                          ? 'Text changed'
                          : 'Not compared'}
                    </span>
                  </header>
                  <p>
                    {`${older.shortLabel}: revision ${document.older?.revision ?? '—'} · ${newer.shortLabel}: revision ${document.newer?.revision ?? '—'}`}
                  </p>
                  {document.sections.length > 0 && (
                    <ul>
                      {document.sections.map((difference) => (
                        <li key={`${difference.kind}:${difference.anchor}`}>
                          <b>{STRUCTURE_LABEL[difference.kind]}</b>
                          <span>
                            {difference.older && difference.newer
                              ? `${sectionLabel(difference.older)} → ${sectionLabel(difference.newer)}`
                              : sectionLabel(
                                  (difference.newer ?? difference.older)!,
                                )}
                          </span>
                        </li>
                      ))}
                    </ul>
                  )}
                  <div className="compare-links">
                    {[older, newer].map((ruleset) => {
                      const source = (
                        ruleset === older ? document.older : document.newer
                      )?.url;
                      return source ? (
                        <a
                          key={ruleset.id}
                          href={source}
                          target="_blank"
                          rel="noreferrer"
                        >
                          {`Official ${ruleset.shortLabel} document`}
                          <ExternalLink aria-hidden="true" />
                        </a>
                      ) : null;
                    })}
                  </div>
                </article>
              ))}
            </div>
            {changedDocuments.length === 0 && (
              <p className="compare-empty">
                No document differs between these two versions.
              </p>
            )}
          </section>
        </div>
      )}
    </div>
  );
}

function ChangeCard({
  change,
  older,
  newer,
  assumptions,
  onOpenRule,
  onOpenSituation,
}: {
  change: ComparedChange;
  older: RulesetDefinition;
  newer: RulesetDefinition;
  /** Assumptions of every revision step shown, not only of the newest. */
  assumptions: readonly TrainingAssumption[];
  onOpenRule: (sectionId: string, rulesetId: string) => void;
  onOpenSituation: (
    situationId: string,
    sectionId: string,
    rulesetId: string,
  ) => void;
}) {
  const section = change.newerSection ?? change.olderSection;
  const practice = useMemo(() => {
    const situations = learningBank(newer.id).situations;
    return (change.practice ?? []).flatMap((id) => {
      const situation = situations.find((item) => item.id === id);
      return situation ? [situation] : [];
    });
  }, [change.practice, newer.id]);
  const linkedAssumptions = assumptions.filter((item) =>
    change.assumptions?.includes(item.id),
  );
  return (
    <article className="compare-card" data-impact={change.impact}>
      <header>
        <div className="compare-tags">
          <span data-kind={change.kind}>{KIND_LABEL[change.kind]}</span>
          <span>{areaLabel(change.area)}</span>
          <span data-impact-tag>{impactLabel(change.impact)}</span>
        </div>
        {section && <p className="compare-ref">{sectionLabel(section)}</p>}
        <h3>{change.title}</h3>
      </header>
      <div className="compare-sides">
        <div data-side="older">
          <h4>{rulesetOptionLabel(older)}</h4>
          <p>{change.before}</p>
          {change.olderSection && (
            <SourceLinks
              ruleset={older}
              section={change.olderSection}
              onOpenRule={onOpenRule}
            />
          )}
        </div>
        <ArrowRight className="compare-arrow" aria-hidden="true" />
        <div data-side="newer">
          <h4>{rulesetOptionLabel(newer)}</h4>
          <p>{change.after}</p>
          {change.newerSection && (
            <SourceLinks
              ruleset={newer}
              section={change.newerSection}
              onOpenRule={onOpenRule}
            />
          )}
        </div>
      </div>
      {(change.effect || change.simulator) && (
        <dl className="compare-notes">
          {change.effect && (
            <div>
              <dt>
                <GraduationCap aria-hidden="true" />
                What to do differently
              </dt>
              <dd>{change.effect}</dd>
            </div>
          )}
          {change.simulator && (
            <div>
              <dt>
                <FlaskConical aria-hidden="true" />
                In the Lab
              </dt>
              <dd>
                {change.simulator}
                {linkedAssumptions.map((assumption) => (
                  <a
                    key={assumption.id}
                    className="compare-assumption-link"
                    href={`#assumption-${assumption.id}`}
                  >
                    <TriangleAlert aria-hidden="true" />
                    {`Training assumption: ${assumption.title}`}
                  </a>
                ))}
              </dd>
            </div>
          )}
        </dl>
      )}
      {practice.length > 0 && (
        <div className="compare-practice">
          <span>{`Practice under the ${newer.label}`}</span>
          {practice.map((situation) => (
            <Button
              key={situation.id}
              size="sm"
              variant="outline"
              className={cn('compare-practice-button')}
              onClick={() =>
                onOpenSituation(situation.id, situation.sectionId, newer.id)
              }
            >
              {situation.title}
              <small>
                {situation.kind === 'case'
                  ? 'Referee decisions'
                  : situation.kind === 'scenario'
                    ? 'Explore & judge'
                    : situation.kind === 'question'
                      ? 'Knowledge check'
                      : 'Replay & question'}
              </small>
            </Button>
          ))}
        </div>
      )}
    </article>
  );
}

function SourceLinks({
  ruleset,
  section,
  onOpenRule,
}: {
  ruleset: RulesetDefinition;
  section: OfficialSection;
  onOpenRule: (sectionId: string, rulesetId: string) => void;
}) {
  return (
    <div className="compare-links">
      <button type="button" onClick={() => onOpenRule(section.id, ruleset.id)}>
        <BookOpen aria-hidden="true" />
        {sectionReference(section) === section.title
          ? 'Read this section in the Rules tab'
          : `Read ${sectionReference(section)} in the Rules tab`}
      </button>
      <a
        href={rulebookCatalog(ruleset.id).sectionUrl(section)}
        target="_blank"
        rel="noreferrer"
      >
        Official text
        <ExternalLink aria-hidden="true" />
      </a>
    </div>
  );
}
