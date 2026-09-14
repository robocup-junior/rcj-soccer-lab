import { TRAINING_TOPICS } from '@/lib/simulator/referee-training';
import { CERTIFICATION_ENGINE_VERSION } from './versions';
import {
  CERTIFICATION_V3_QUESTION_IDS,
  CERTIFICATION_V4_QUESTION_IDS,
} from './question-manifest';

const sharedPolicy = {
  rulesetVersion: 'rcj-soccer-rules-2026',
  engineVersion: CERTIFICATION_ENGINE_VERSION,
  ruleFirstTryPercent: 95,
  topics: TRAINING_TOPICS.map((topic) => topic.id),
  games: {
    step: {
      durationSeconds: 600,
      requiredQualifying: 5,
      maxAttempts: 8,
      minimumAccuracy: 90,
    },
    continuous: {
      durationSeconds: 600,
      requiredQualifying: 2,
      maxAttempts: 5,
      minimumAccuracy: 80,
    },
  },
} as const;

function examination(policyVersion: string, questionIds: readonly string[]) {
  return {
    ...sharedPolicy,
    policyVersion,
    questionIds,
    ruleQuestionCount: questionIds.length,
    ruleFirstTryRequired: Math.ceil(questionIds.length * 0.95),
  } as const;
}

/** Wording-only revisions keep v3 grading and its original 105 assignments. */
const legacyPolicy = examination(
  'rcj-soccer-2026-v3',
  CERTIFICATION_V3_QUESTION_IDS,
);
export const CERTIFICATION_POLICY = examination(
  'rcj-soccer-2026-v4',
  CERTIFICATION_V4_QUESTION_IDS,
);

export function certificationPolicyFor(version: unknown) {
  if (version === CERTIFICATION_POLICY.policyVersion)
    return CERTIFICATION_POLICY;
  if (version === legacyPolicy.policyVersion) return legacyPolicy;
  return null;
}

export function isSupportedCertificationPolicy(version: unknown): boolean {
  return certificationPolicyFor(version) !== null;
}

export type CertificationMode = keyof typeof CERTIFICATION_POLICY.games;
export type GamePurpose = 'practice' | 'certification';

export function isCertificationMode(
  value: unknown,
): value is CertificationMode {
  return value === 'step' || value === 'continuous';
}
