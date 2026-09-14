import type { RuleLearningEvent } from './client-types';

export type LearningSaveSnapshot = {
  pending: boolean;
  error: string | null;
  recordedQuestionIds: readonly string[];
};

/**
 * A lesson-local, acknowledgement-based queue. Keep the lesson open on failure:
 * retries send the same evidence, never a replacement first answer. Successful
 * predecessors are removed before the next event is attempted.
 */
export function createLearningSaveQueue(
  save: (event: RuleLearningEvent) => void | Promise<void>,
) {
  const events: RuleLearningEvent[] = [];
  const recorded = new Set<string>();
  const listeners = new Set<() => void>();
  let pending = false;
  let error: string | null = null;
  let afterSaved: (() => void) | undefined;
  // Keep an in-flight batch tied to the callback that accepted its first event.
  let batchSave = save;
  let snapshot: LearningSaveSnapshot = {
    pending: false,
    error: null,
    recordedQuestionIds: [],
  };
  const publish = () => {
    snapshot = { pending, error, recordedQuestionIds: [...recorded] };
    for (const listener of listeners) listener();
  };
  const flush = async () => {
    if (pending || !events.length) return;
    pending = true;
    error = null;
    publish();
    try {
      while (events.length) {
        const event = events[0];
        // A consumer cannot mutate the retained copy and alter a later retry.
        await batchSave(structuredClone(event));
        events.shift();
        if (event.type === 'answer' || event.type === 'complete')
          recorded.add(event.questionId);
        publish();
      }
      const notify = afterSaved;
      afterSaved = undefined;
      // Notification errors must not turn already saved evidence into a retry.
      try {
        notify?.();
      } catch {
        /* The evidence is saved; a later account refresh restores progress. */
      }
    } catch (caught) {
      error =
        caught instanceof Error
          ? caught.message
          : 'Your first answer could not be saved.';
    } finally {
      pending = false;
      publish();
    }
  };
  return {
    setSave: (nextSave: typeof save) => {
      save = nextSave;
    },
    getSnapshot: () => snapshot,
    subscribe: (listener: () => void) => {
      listeners.add(listener);
      return () => {
        listeners.delete(listener);
      };
    },
    isBlocked: () => pending || events.length > 0,
    submit: (batch: readonly RuleLearningEvent[], completed?: () => void) => {
      if (pending || events.length || !batch.length) return false;
      events.push(...structuredClone(batch));
      batchSave = save;
      afterSaved = completed;
      void flush();
      return true;
    },
    retry: flush,
  };
}
