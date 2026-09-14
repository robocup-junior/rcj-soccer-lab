'use client';

import { useEffect, useState, useSyncExternalStore } from 'react';
import { createLearningSaveQueue } from '@/lib/certification/learning-save';
import type { RuleLearningEvent } from '@/lib/certification/client-types';
import { Button } from '@/components/ui/button';
import { useLocalization } from '@/components/i18n/LocalizationProvider';

export function useLearningSave(
  onLearningEvent?: (event: RuleLearningEvent) => void | Promise<void>,
) {
  const [queue] = useState(() =>
    createLearningSaveQueue(onLearningEvent ?? (() => undefined)),
  );
  useEffect(() => {
    queue.setSave(onLearningEvent ?? (() => undefined));
  }, [onLearningEvent, queue]);
  const state = useSyncExternalStore(
    queue.subscribe,
    queue.getSnapshot,
    queue.getSnapshot,
  );
  return {
    ...state,
    submit: queue.submit,
    retry: queue.retry,
    isBlocked: queue.isBlocked,
  };
}

/** Same save/retry vocabulary as the engine-backed CaseLesson. */
export function LearningSaveStatus({
  save,
}: {
  save: ReturnType<typeof useLearningSave>;
}) {
  const { t } = useLocalization();
  return (
    <>
      {save.error && (
        <div role="alert">
          <p>
            {t(save.error)}{' '}
            {t(
              'Keep this lesson open and retry so your first answer is not lost.',
            )}
          </p>
          <Button onClick={() => void save.retry()}>
            {t('Retry saving answer')}
          </Button>
        </div>
      )}
      {save.pending && (
        <output aria-live="polite">{t('Saving your answer…')}</output>
      )}
    </>
  );
}
