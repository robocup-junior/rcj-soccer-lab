'use client';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Code2, Pause, Play, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import {
  PlayCanvasViewport,
  type CameraPreset,
} from '@/components/simulator/PlayCanvasViewport';
import type { RobotVisualId } from '@/lib/simulator/robot-models';
import type { ScenarioDefinition } from '@/lib/simulator/types';
import { AnswerChoice, AnswerFeedback } from './AnswerFeedback';
import { LearningSaveStatus, useLearningSave } from './useLearningSave';
import { scenarioDecisionTime } from '@/lib/rulebook/learning-bank';
import { orderedAnswers } from '@/lib/rulebook/answer-order';
import { useLocalization } from '@/components/i18n/LocalizationProvider';
import type {
  RuleLearningEvent,
  RuleLearningMode,
} from '@/lib/certification/client-types';

export function ScenarioLesson({
  scenario,
  robotVisual,
  onPassed,
  initialAnswer = null,
  onAnswer,
  studyScore,
  learningMode = 'practice',
  certificationRunId = null,
  onLearningEvent,
  alreadyAnswered = false,
}: {
  scenario: ScenarioDefinition;
  robotVisual: RobotVisualId;
  onPassed?: () => void;
  initialAnswer?: string | null;
  onAnswer?: (id: string) => void;
  studyScore?: string;
  learningMode?: RuleLearningMode;
  certificationRunId?: string | null;
  onLearningEvent?: (event: RuleLearningEvent) => void | Promise<void>;
  alreadyAnswered?: boolean;
}) {
  const { locale, t } = useLocalization();
  const save = useLearningSave(onLearningEvent);
  const [time, setTime] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [answer, setAnswer] = useState<string | null>(initialAnswer);
  const [geometry, setGeometry] = useState(true);
  const [contact, setContact] = useState(false);
  const [showTrail, setShowTrail] = useState(true);
  const [speed, setSpeed] = useState(1);
  const [camera, setCamera] = useState<CameraPreset>('overhead');
  const [copied, setCopied] = useState(false);
  const [guided, setGuided] = useState(false);
  const assisted = useRef(false);
  const explained =
    (learningMode === 'practice' && guided) ||
    answer !== null ||
    alreadyAnswered;
  const duration = explained
    ? scenario.duration
    : (scenarioDecisionTime(scenario) ?? scenario.duration);
  const locked =
    learningMode === 'certification' && (alreadyAnswered || answer !== null);
  const cursor = useRef(0);
  const initialChoice = scenario.choices.find(
    (choice) => choice.id === initialAnswer,
  );
  const answerAttempts = useRef(initialAnswer ? 1 : 0);
  const firstAnswer = useRef<string | null>(initialAnswer);
  const completionReported = useRef(
    Boolean(
      initialChoice && ['correct', 'acceptable'].includes(initialChoice.grade),
    ),
  );
  const frame = useMemo(
    () => scenario.sample(Math.min(time, duration)),
    [scenario, time, duration],
  );
  const trail = useMemo(
    () =>
      Array.from(
        { length: 30 },
        (_, i) =>
          scenario.sample(
            Math.max(0, Math.min(time, duration) - 1.5 + (i / 29) * 1.5),
          ).actors.ball,
      ),
    [scenario, time, duration],
  );
  const selected = scenario.choices.find((choice) => choice.id === answer);
  const seek = (value: number) => {
    cursor.current = Math.max(0, Math.min(value, duration));
    setTime(cursor.current);
    setPlaying(false);
  };
  useEffect(() => {
    if (!playing) return;
    let raf = 0,
      previous = 0;
    const animate = (now: number) => {
      cursor.current = Math.min(
        duration,
        cursor.current +
          (previous ? Math.min(0.1, (now - previous) / 1000) * speed : 0),
      );
      previous = now;
      setTime(cursor.current);
      if (cursor.current >= duration) {
        setPlaying(false);
        return;
      }
      raf = requestAnimationFrame(animate);
    };
    raf = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(raf);
  }, [playing, duration, speed]);
  return (
    <div className="rule-animation">
      <p className="lesson-observation">{scenario.refereeCue}</p>
      {learningMode === 'practice' && !explained && (
        <Button
          variant="ghost"
          size="sm"
          disabled={save.pending || Boolean(save.error)}
          onClick={() => {
            if (save.isBlocked()) return;
            assisted.current = true;
            setGuided(true);
            setPlaying(false);
            save.submit([
              {
                type: 'assistance',
                mode: learningMode,
                certificationRunId,
                questionId: `scenario:${scenario.id}`,
                sourceId: scenario.id,
                kind: 'scenario',
                decisionId: `scenario:${scenario.id}`,
                assistance: 'show-answer',
              },
            ]);
          }}
        >
          Watch explained replay
        </Button>
      )}
      {guided && (
        <p className="rule-small">
          Guided practice: the explanation is visible. This is not an unaided
          answer.
        </p>
      )}
      <div className="rule-animation-stage">
        <PlayCanvasViewport
          actors={scenario.actors}
          poses={frame.actors}
          robotVisual={robotVisual}
          cameraPreset={camera}
          showRuleGeometry={explained && geometry}
          showBallTrail={showTrail}
          showContactEvidence={explained && contact}
          ballTrail={trail}
          phaseLabel={
            explained ? frame.phaseLabel : 'Observe the robots and ball.'
          }
        />
        <output className="rule-scene-caption">
          <strong>
            {explained
              ? frame.phaseLabel
              : time >= duration
                ? 'Make your decision'
                : 'Watch the situation'}
          </strong>
        </output>
      </div>
      <div className="rule-player-controls">
        <Button
          aria-label={playing ? 'Pause situation' : 'Play situation'}
          onClick={() => {
            if (time >= duration) {
              cursor.current = 0;
              setTime(0);
            }
            setPlaying((value) => !value);
          }}
        >
          {playing ? <Pause /> : <Play />}
        </Button>
        <Button
          variant="outline"
          aria-label="Replay situation"
          onClick={() => {
            seek(0);
            setPlaying(true);
          }}
        >
          <RotateCcw />
        </Button>
        <Slider
          aria-label="Situation timeline"
          min={0}
          max={duration}
          step={0.02}
          value={[time]}
          onValueChange={(value) =>
            seek(Array.isArray(value) ? value[0] : value)
          }
        />
        <span>{time.toFixed(1)} s</span>
        <select
          aria-label="Situation speed"
          value={speed}
          onChange={(event) => setSpeed(Number(event.target.value))}
        >
          <option value={0.5}>0.5×</option>
          <option value={1}>1×</option>
          <option value={2}>2×</option>
        </select>
      </div>
      <div className="lesson-tools">
        <select
          aria-label="Situation camera"
          value={camera}
          onChange={(event) => setCamera(event.target.value as CameraPreset)}
        >
          {(
            [
              'overhead',
              'broadcast',
              'referee',
              'ball',
              'blue',
              'yellow',
              'free',
            ] as const
          ).map((preset) => (
            <option key={preset} value={preset}>
              {preset === 'ball' ? 'Follow ball' : preset}
            </option>
          ))}
        </select>
        {learningMode === 'practice' && (
          <Button
            variant="ghost"
            size="sm"
            onClick={async () => {
              const url = new URL(window.location.href);
              url.search = new URLSearchParams({
                embed: scenario.id,
                robot: robotVisual,
                lang: locale,
              }).toString();
              const iframe = document.createElement('iframe');
              iframe.src = url.toString();
              iframe.title = t(scenario.title);
              iframe.loading = 'lazy';
              iframe.setAttribute('allowfullscreen', '');
              await navigator.clipboard.writeText(iframe.outerHTML);
              setCopied(true);
            }}
          >
            <Code2 />
            {copied ? 'Embed copied' : 'Copy embed'}
          </Button>
        )}
        {explained && (
          <label>
            <input
              type="checkbox"
              checked={geometry}
              onChange={(event) => setGeometry(event.target.checked)}
            />{' '}
            Rule geometry
          </label>
        )}
        <label>
          <input
            type="checkbox"
            checked={showTrail}
            onChange={(event) => setShowTrail(event.target.checked)}
          />{' '}
          Ball trail
        </label>
        {explained && (
          <label>
            <input
              type="checkbox"
              checked={contact}
              onChange={(event) => setContact(event.target.checked)}
            />{' '}
            Contact evidence
          </label>
        )}
      </div>
      {explained && (
        <>
          <p className="lesson-observation">{scenario.publicSummary}</p>
          <div className="lesson-evidence">
            <dl>
              {Object.entries(frame.metrics).map(([key, metric]) => (
                <div key={key}>
                  <dt>{metric.label}</dt>
                  <dd>{metric.value}</dd>
                </div>
              ))}
            </dl>
            <ul>
              {frame.evidence.map((text) => (
                <li key={text}>{text}</li>
              ))}
            </ul>
          </div>
        </>
      )}
      <section className="rule-question">
        <LearningSaveStatus save={save} />
        <h3>{scenario.refereeCue}</h3>
        {!explained && (
          <p className="rule-small">
            Watch up to the decision point. The explanation appears after your
            answer.
          </p>
        )}
        {alreadyAnswered && answer === null && (
          <p className="rule-small">
            Your answer is already recorded for this certification round.
            Reviewing the explanation will not change it.
          </p>
        )}
        <div className="rule-answer-options">
          {orderedAnswers(
            scenario.choices,
            `${certificationRunId ?? 'practice'}:${scenario.id}`,
          ).map(({ answer: choice }) => (
            <AnswerChoice
              key={choice.id}
              selected={answer === choice.id}
              result={choice.grade}
              disabled={
                locked ||
                save.pending ||
                Boolean(save.error) ||
                Boolean(
                  selected &&
                  ['correct', 'acceptable'].includes(selected.grade),
                ) ||
                (!explained && time < duration)
              }
              onClick={() => {
                if (
                  locked ||
                  save.isBlocked() ||
                  (selected &&
                    ['correct', 'acceptable'].includes(selected.grade)) ||
                  (!explained && time < duration)
                )
                  return;
                const questionId = `scenario:${scenario.id}`;
                const attemptNumber = ++answerAttempts.current;
                const accepted = ['correct', 'acceptable'].includes(
                  choice.grade,
                );
                firstAnswer.current ??= choice.id;
                setAnswer(choice.id);
                onAnswer?.(choice.id);
                setPlaying(false);
                const events: RuleLearningEvent[] = [
                  {
                    type: 'answer',
                    mode: learningMode,
                    certificationRunId,
                    questionId,
                    sourceId: scenario.id,
                    kind: 'scenario',
                    decisionId: questionId,
                    answer: { kind: 'scenario', choiceId: choice.id },
                    attemptNumber,
                    firstAnswer: attemptNumber === 1,
                    accepted,
                    score: choice.score,
                    completed: accepted,
                    assisted: assisted.current,
                  },
                ];
                let reportPassed = false;
                if (accepted) {
                  if (!completionReported.current) {
                    completionReported.current = true;
                    reportPassed = true;
                    events.push({
                      type: 'complete',
                      mode: learningMode,
                      certificationRunId,
                      questionId,
                      sourceId: scenario.id,
                      kind: 'scenario',
                      answer: {
                        kind: 'scenario',
                        choiceId: firstAnswer.current,
                      },
                      firstTryCorrect: attemptNumber === 1 && !assisted.current,
                      assisted: assisted.current,
                    });
                  }
                }
                save.submit(events, reportPassed ? onPassed : undefined);
              }}
            >
              {choice.label}
            </AnswerChoice>
          ))}
        </div>
        {selected && (
          <AnswerFeedback result={selected.grade}>
            <p>{selected.feedback}</p>
            {learningMode === 'certification' &&
              save.recordedQuestionIds.includes(`scenario:${scenario.id}`) && (
                <p>
                  Your first answer is recorded. Reviewing the explanation will
                  not change your score.
                </p>
              )}
          </AnswerFeedback>
        )}
        {studyScore && <p className="rule-small">{studyScore}</p>}
      </section>
    </div>
  );
}
