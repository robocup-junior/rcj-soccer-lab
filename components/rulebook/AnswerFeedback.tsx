import type { ComponentProps, ReactNode } from 'react';
import { CheckCircle2, CircleHelp, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export type AnswerResult = 'correct' | 'acceptable' | 'partial' | 'incorrect';

const titles: Record<AnswerResult, string> = {
  correct: 'Correct answer',
  acceptable: 'Acceptable referee decision',
  partial: 'Partly correct',
  incorrect: 'Incorrect answer',
};
function ResultIcon({ result }: { result: AnswerResult }) {
  const Icon =
    result === 'incorrect'
      ? XCircle
      : result === 'partial'
        ? CircleHelp
        : CheckCircle2;
  return <Icon aria-hidden="true" className="answer-result-icon" />;
}

/** One result vocabulary and visual treatment for every rule-learning surface. */
export function AnswerFeedback({
  result,
  children,
}: {
  result: AnswerResult;
  children: ReactNode;
}) {
  return (
    <div
      className={`answer-feedback answer-result-${result}`}
      // Multi-paragraph feedback is flow content, not valid inside an output.
      // oxlint-disable-next-line jsx-a11y/prefer-tag-over-role
      role="status"
      aria-live="polite"
    >
      <strong className="answer-feedback-title">
        <ResultIcon result={result} />
        {titles[result]}
      </strong>
      <div className="answer-feedback-detail">{children}</div>
    </div>
  );
}

export function AnswerChoice({
  selected = false,
  result,
  children,
  className,
  ...props
}: Omit<ComponentProps<typeof Button>, 'aria-pressed'> & {
  selected?: boolean;
  result?: AnswerResult;
}) {
  return (
    <Button
      {...props}
      variant="outline"
      aria-pressed={selected}
      className={cn(
        'answer-choice',
        selected && result && `answer-result-${result}`,
        className,
      )}
    >
      {selected && result && <ResultIcon result={result} />}
      <span>{children}</span>
    </Button>
  );
}
