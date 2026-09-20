import { isRulesetId } from '../rulesets/registry';
import { RULESET_QUERY_KEY } from '../rulesets/selection';

export type AppMode =
  | 'rules'
  | 'play'
  | 'referee'
  | 'compare'
  | 'academy'
  | 'reconstruct';
export type AcademyPage = 'profile' | 'certification' | 'referees';
export type CertificationTrack = 'rules' | 'step' | 'continuous' | null;
export type AppNavigation = {
  mode: AppMode;
  sectionId: string;
  situationId: string | null;
  arrange: boolean;
  embed: string | null;
  academyPage: AcademyPage;
  certificationTrack: CertificationTrack;
  /** Second rule set of the Version comparison tab; null means its default. */
  compareWith: string | null;
};
export const INITIAL_NAVIGATION: AppNavigation = {
  mode: 'rules',
  sectionId: 'soccer:inside-penalty-area',
  situationId: null,
  arrange: false,
  embed: null,
  academyPage: 'profile',
  certificationTrack: null,
  compareWith: null,
};
export function readNavigation(search: string): AppNavigation {
  const query = new URLSearchParams(search);
  const mode = query.get('mode');
  const academy = query.get('academy');
  const certification = query.get('cert');
  const legacyStudy =
    mode === 'explore' ||
    mode === 'learn' ||
    (mode === 'referee' && query.has('scenario'));
  return {
    mode: legacyStudy
      ? 'rules'
      : mode === 'manual'
        ? 'play'
        : mode === 'referee' ||
            (mode === 'play' && query.get('referee') === '1')
          ? 'referee'
          : mode === 'play'
            ? 'play'
            : mode === 'academy'
              ? 'academy'
              : mode === 'reconstruct'
                ? 'reconstruct'
                : mode === 'compare'
                  ? 'compare'
                  : 'rules',
    sectionId: query.get('rule') ?? INITIAL_NAVIGATION.sectionId,
    situationId:
      query.get('situation') ??
      (query.get('scenario')
        ? `scenario:${query.get('scenario')}`
        : legacyStudy && !query.has('rule')
          ? 'scenario:legal-dribbler-backspin'
          : null),
    arrange: mode === 'manual' || query.get('arrange') === '1',
    embed: query.get('embed'),
    academyPage:
      academy === 'certification' || academy === 'referees'
        ? academy
        : 'profile',
    certificationTrack:
      certification === 'rules' ||
      certification === 'step' ||
      certification === 'continuous'
        ? certification
        : null,
    compareWith: isRulesetId(query.get('with')) ? query.get('with') : null,
  };
}
export function navigationSearch(
  nav: AppNavigation,
  robot: string,
  locale = 'en',
  /** Selected rule set; links always say which rules they were made under. */
  rulesetId?: string | null,
) {
  const query = new URLSearchParams({ mode: nav.mode, robot });
  query.set('lang', locale);
  if (rulesetId) query.set(RULESET_QUERY_KEY, rulesetId);
  if (nav.mode === 'compare' && nav.compareWith)
    query.set('with', nav.compareWith);
  if (nav.mode === 'rules') {
    query.set('rule', nav.sectionId);
    if (nav.situationId) query.set('situation', nav.situationId);
  }
  if (nav.mode === 'play' && nav.arrange) query.set('arrange', '1');
  if (nav.mode === 'academy') query.set('academy', nav.academyPage);
  if (nav.certificationTrack) query.set('cert', nav.certificationTrack);
  if (nav.embed) query.set('embed', nav.embed);
  return `?${query}`;
}
