import { LEARNING_2027 } from '../rulesets/2027/learning';
import type { LearningOverlay } from './overlay-types';

/**
 * Lesson changes of every rule set that is based on another one. Register a
 * season here after writing lib/rulesets/<id>/learning.ts. The oldest rule set
 * has no overlay: its bank is the original catalogue.
 */
export const LEARNING_OVERLAYS: Readonly<Record<string, LearningOverlay>> = {
  '2027': LEARNING_2027,
};

const overlays = Object.values(LEARNING_OVERLAYS);

/** Scenes and drills must resolve by id whichever rule set is selected. */
export const OVERLAY_CLIPS = overlays.flatMap((overlay) => [
  ...overlay.clips,
  ...(overlay.sceneClips ?? []),
]);
export const OVERLAY_CASES = overlays.flatMap((overlay) => overlay.cases);
export const OVERLAY_QUESTIONS = overlays.flatMap(
  (overlay) => overlay.questions,
);
export const OVERLAY_CLIP_ASSESSMENTS = Object.assign(
  {},
  ...overlays.map((overlay) => overlay.clipAssessments ?? {}),
) as Readonly<Record<string, { decisionAt: number; context: string }>>;
