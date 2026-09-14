'use client';

import { useRef, useState } from 'react';
import { AnswerChoice, AnswerFeedback } from './AnswerFeedback';
import { LearningSaveStatus, useLearningSave } from './useLearningSave';
import { orderedAnswers } from '@/lib/rulebook/answer-order';
import { useLocalization } from '@/components/i18n/LocalizationProvider';
import type { RuleQuestion } from '@/lib/rulebook/questions';
import type {
  RuleLearningEvent,
  RuleLearningMode,
} from '@/lib/certification/client-types';

/** Text-only evidence for technical checks and match administration. */
export function QuestionLesson({
  item,
  onPassed,
  learningMode = 'practice',
  certificationRunId = null,
  onLearningEvent,
  alreadyAnswered = false,
}: {
  item: RuleQuestion;
  onPassed: () => void;
  learningMode?: RuleLearningMode;
  certificationRunId?: string | null;
  onLearningEvent?: (event: RuleLearningEvent) => void | Promise<void>;
  alreadyAnswered?: boolean;
}) {
  const { t } = useLocalization();
  const save = useLearningSave(onLearningEvent);
  const [selected, setSelected] = useState<number | null>(null);
  const attempts = useRef(0);
  const firstAnswer = useRef<number | null>(null);
  const completed = useRef(false);
  const accepted = selected === item.answer;
  const locked =
    learningMode === 'certification' && (alreadyAnswered || selected !== null);
  const choose = (selectedIndex: number) => {
    if (completed.current || locked || save.isBlocked()) return;
    const attemptNumber = ++attempts.current;
    firstAnswer.current ??= selectedIndex;
    const correct = selectedIndex === item.answer;
    const questionId = `question:${item.id}`;
    setSelected(selectedIndex);
    const events: RuleLearningEvent[] = [
      {
        type: 'answer',
        mode: learningMode,
        certificationRunId,
        questionId,
        sourceId: item.id,
        kind: 'question',
        decisionId: questionId,
        answer: { kind: 'question', selectedIndex },
        attemptNumber,
        firstAnswer: attemptNumber === 1,
        accepted: correct,
        score: correct ? 1 : 0,
        completed: correct,
        assisted: false,
      },
    ];
    if (correct) {
      completed.current = true;
      events.push({
        type: 'complete',
        mode: learningMode,
        certificationRunId,
        questionId,
        sourceId: item.id,
        kind: 'question',
        answer: { kind: 'question', selectedIndex: firstAnswer.current },
        firstTryCorrect: firstAnswer.current === item.answer,
        assisted: false,
      });
    }
    save.submit(events, correct ? onPassed : undefined);
  };
  return (
    <section className="rule-lab" aria-label={t('Rule knowledge check')}>
      <span className="rule-kicker">
        {t('Knowledge check · no simulated incident')}
      </span>
      {learningMode !== 'certification' && <h2>{t(item.title)}</h2>}
      <p>{t(item.question)}</p>
      <p className="rule-small">
        {t(
          learningMode === 'certification'
            ? 'Your first choice is recorded for certification. Read all choices before selecting one.'
            : 'Choose an answer to check your understanding. You can retry for practice.',
        )}
      </p>
      <LearningSaveStatus save={save} />
      <fieldset className="rule-example-list">
        <legend className="sr-only">{t('Answer choices')}</legend>
        {orderedAnswers(
          item.options,
          `${certificationRunId ?? 'practice'}:${item.id}`,
        ).map(({ answer: option, index }, position) => (
          <AnswerChoice
            key={option}
            disabled={accepted || locked || save.pending || Boolean(save.error)}
            selected={selected === index}
            result={accepted ? 'correct' : 'incorrect'}
            onClick={() => choose(index)}
          >
            <span>{String.fromCharCode(65 + position)}.</span> {t(option)}
          </AnswerChoice>
        ))}
      </fieldset>
      {selected !== null && (
        <AnswerFeedback result={accepted ? 'correct' : 'incorrect'}>
          <p>{t(item.feedback)}</p>
          {learningMode === 'certification' &&
          save.recordedQuestionIds.includes(`question:${item.id}`) ? (
            <p>
              {t(
                'Your first answer is recorded. Reviewing the explanation will not change your score.',
              )}
            </p>
          ) : (
            learningMode === 'practice' &&
            !accepted &&
            !save.pending &&
            !save.error && (
              <p className="rule-small">
                {t('You can try again for practice.')}
              </p>
            )
          )}
        </AnswerFeedback>
      )}
      {alreadyAnswered && selected === null && (
        <div className="rule-small">
          <p>
            {t(
              'Your answer is already recorded for this certification round. Reviewing the explanation will not change it.',
            )}
          </p>
          <p>{t(item.feedback)}</p>
        </div>
      )}
    </section>
  );
}
