import { CERTIFICATION_RULESET_ID, getRuleset } from '../rulesets/registry';
import type {
  OfficialDocument,
  OfficialSection,
  SourceNotice,
} from '../rulesets/types';

export type RuleSection = OfficialSection;
export type RuleDocument = OfficialDocument;
export type GuideKind =
  | 'animation'
  | 'inspection'
  | 'kicker'
  | 'field'
  | 'ball'
  | 'scoring'
  | 'team'
  | 'documentation'
  | 'competition'
  | 'conduct'
  | 'decision'
  | 'companion'
  | 'overview';

export function guideFor(section: RuleSection): GuideKind {
  if (section.document === 'field') return 'field';
  if (section.document === 'ball') return 'ball';
  if (section.document === 'scoring') return 'scoring';
  if (section.document === 'entry' || section.document === 'superteam')
    return 'companion';
  if (
    section.anchor === 'kicker-power-measuring' ||
    section.anchor === 'regulations-limitations'
  )
    return 'kicker';
  if (section.number === '2' || section.number.startsWith('2.'))
    return 'animation';
  if (section.number === '3.7') return 'field';
  if (section.number === '3.8' || section.number === '3.9') return 'ball';
  if (
    section.number.startsWith('3') ||
    section.number.startsWith('6') ||
    section.number.startsWith('1.3') ||
    section.number === '7.1'
  )
    return 'inspection';
  if (section.number.startsWith('1.4')) return 'documentation';
  if (section.number.startsWith('1.5') || section.number.startsWith('4'))
    return 'conduct';
  if (section.number.startsWith('1')) return 'team';
  if (section.number.startsWith('5')) return 'decision';
  if (section.number.startsWith('7')) return 'competition';
  return 'overview';
}

/** Appendices have titles but no numeric section number in the official index. */
export function sectionReference(section: RuleSection) {
  if (section.number)
    return /^\d/.test(section.number) ? `§${section.number}` : section.number;
  if (section.title.startsWith('Appendix A:')) return 'Appendix A';
  if (section.title.startsWith('Appendix B:')) return 'Appendix B';
  return section.title;
}

/** The official documents and their headings, as one rule set publishes them. */
export type RulebookCatalog = {
  rulesetId: string;
  documents: readonly RuleDocument[];
  sections: readonly RuleSection[];
  checkedOn: string;
  sectionUrl: (section: RuleSection) => string;
  section: (id: string) => RuleSection | undefined;
  sectionByAnchor: (
    document: string,
    anchor: string,
  ) => RuleSection | undefined;
  /** Base URL of a document, for references that only know an anchor. */
  documentUrl: (document: string) => string;
  findSections: (
    query: string,
    document: string,
    localize?: (value: string) => string,
  ) => RuleSection[];
  noticesFor: (section: RuleSection) => SourceNotice[];
};

const catalogs = new Map<string, RulebookCatalog>();

export function rulebookCatalog(rulesetId?: string | null): RulebookCatalog {
  const ruleset = getRuleset(rulesetId);
  const cached = catalogs.get(ruleset.id);
  if (cached) return cached;
  const { documents, sections, checkedOn } = ruleset.index;
  const documentUrl = (id: string) =>
    documents.find((item) => item.id === id)!.url;
  const catalog: RulebookCatalog = {
    rulesetId: ruleset.id,
    documents,
    sections,
    checkedOn,
    documentUrl,
    sectionUrl: (section) =>
      `${documentUrl(section.document)}#${section.anchor}`,
    section: (id) => sections.find((item) => item.id === id),
    sectionByAnchor: (document, anchor) =>
      sections.find(
        (item) => item.document === document && item.anchor === anchor,
      ),
    findSections: (query, document, localize = (value) => value) => {
      const terms = query.trim().toLowerCase().split(/\s+/).filter(Boolean);
      return sections.filter((section) => {
        if (!terms.length) return section.document === document;
        const aliases =
          guideFor(section) === 'inspection'
            ? 'technical inspection robot size weight measurements'
            : guideFor(section) === 'kicker'
              ? 'kicking power test rebound'
              : '';
        const source = `${section.number} ${section.title} ${section.chapter} ${section.document} ${aliases}`;
        const searchable =
          `${source} ${localize(section.title)} ${localize(section.chapter)} ${localize(aliases)}`.toLowerCase();
        return terms.every((term) => searchable.includes(term));
      });
    },
    noticesFor: (section) =>
      ruleset.sourceNotices.filter(
        (notice) =>
          notice.document === section.document &&
          notice.anchors.includes(section.anchor),
      ),
  };
  catalogs.set(ruleset.id, catalog);
  return catalog;
}

/**
 * The rule set that certification rounds are assigned and graded against.
 * These constants predate rule-set selection; use rulebookCatalog(id) wherever
 * the reader's selected rule set matters.
 */
const certificationCatalog = rulebookCatalog(CERTIFICATION_RULESET_ID);
export const RULE_DOCUMENTS = certificationCatalog.documents;
export const RULE_SECTIONS = certificationCatalog.sections;
export const RULEBOOK_CHECKED_ON = certificationCatalog.checkedOn;
export const sectionUrl = certificationCatalog.sectionUrl;
export const findSections = certificationCatalog.findSections;
