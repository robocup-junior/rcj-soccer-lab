'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { Pause, Play, RotateCcw } from 'lucide-react';
import { AnswerChoice, AnswerFeedback } from './AnswerFeedback';
import { LearningSaveStatus, useLearningSave } from './useLearningSave';
import { CLIP_ASSESSMENTS } from '@/lib/rulebook/clip-assessments';
import { orderedAnswers } from '@/lib/rulebook/answer-order';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import {
  NativeSelect,
  NativeSelectOption,
} from '@/components/ui/native-select';
import {
  PlayCanvasViewport,
  type CameraPreset,
} from '@/components/simulator/PlayCanvasViewport';
import {
  RULE_ACTORS,
  sampleClip,
  type RuleClip,
} from '@/lib/rulebook/animations';
import type { RobotVisualId } from '@/lib/simulator/robot-models';
import { cn } from '@/lib/utils';
import type {
  RuleLearningEvent,
  RuleLearningMode,
} from '@/lib/certification/client-types';

export function RuleAnimationPlayer({
  clips,
  robotVisual,
  onPassed,
  learningMode = 'practice',
  certificationRunId = null,
  onLearningEvent,
  alreadyAnswered = false,
}: {
  clips: RuleClip[];
  robotVisual: RobotVisualId;
  onPassed?: () => void;
  learningMode?: RuleLearningMode;
  certificationRunId?: string | null;
  onLearningEvent?: (event: RuleLearningEvent) => void | Promise<void>;
  alreadyAnswered?: boolean;
}) {
  const save = useLearningSave(onLearningEvent);
  const [clipId, setClipId] = useState(clips[0].id);
  const clip = clips.find((item) => item.id === clipId) ?? clips[0];
  const [time, setTime] = useState(0);
  const timeRef = useRef(0);
  const [playing, setPlaying] = useState(false);
  const [camera, setCamera] = useState<CameraPreset>('overhead');
  const [speed, setSpeed] = useState(1);
  const [answer, setAnswer] = useState<number | null>(null);
  const [guided, setGuided] = useState(false);
  const assisted = useRef(false);
  const answerAttempts = useRef(new Map<string, number>());
  const firstAnswers = useRef(new Map<string, number>());
  const completedQuestions = useRef(new Set<string>());
  const assessment = CLIP_ASSESSMENTS[clip.id];
  const locked =
    learningMode === 'certification' && (alreadyAnswered || answer !== null);
  const explained =
    (learningMode === 'practice' && guided) ||
    answer !== null ||
    alreadyAnswered;
  const duration = explained
    ? clip.frames[clip.frames.length - 1].at
    : assessment.decisionAt;
  const scene = useMemo(
    () => sampleClip(clip, Math.min(time, duration)),
    [clip, time, duration],
  );
  const trail = useMemo(
    () =>
      Array.from(
        { length: 30 },
        (_, index) =>
          sampleClip(
            clip,
            Math.max(0, Math.min(time, duration) - 1.5 + (index / 29) * 1.5),
          ).poses.ball,
      ).filter(Boolean),
    [clip, time, duration],
  );

  useEffect(() => {
    if (!playing) return;
    let raf = 0;
    let previous = 0;
    const animate = (now: number) => {
      const delta = previous
        ? Math.min((now - previous) / 1000, 0.08) * speed
        : 0;
      previous = now;
      timeRef.current = Math.min(duration, timeRef.current + delta);
      setTime(timeRef.current);
      if (timeRef.current >= duration) {
        setPlaying(false);
        return;
      }
      raf = requestAnimationFrame(animate);
    };
    raf = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(raf);
  }, [duration, playing, speed]);

  const ended = time >= duration;
  const seek = (at: number) => {
    setPlaying(false);
    timeRef.current = Math.max(0, Math.min(duration, at));
    setTime(timeRef.current);
  };
  const choose = (id: string) => {
    if (save.isBlocked()) return;
    setClipId(id);
    timeRef.current = 0;
    setTime(0);
    setPlaying(false);
    setAnswer(null);
    setGuided(false);
    assisted.current = false;
  };

  return (
    <div className="rule-animation">
      {clips.length > 1 && (
        <div className="rule-example-list" aria-label="Animated examples">
          {clips.map((item, index) => (
            <Button
              key={item.id}
              variant={item.id === clip.id ? 'secondary' : 'outline'}
              aria-pressed={item.id === clip.id}
              disabled={save.pending || Boolean(save.error)}
              onClick={() => choose(item.id)}
            >
              <span>{String(index + 1).padStart(2, '0')}</span>
              {learningMode === 'certification'
                ? `Question ${index + 1}`
                : item.title}
            </Button>
          ))}
        </div>
      )}
      <p className="lesson-observation">{assessment.context}</p>
      {learningMode === 'practice' && answer === null && !guided && (
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
                questionId: `clip:${clip.id}`,
                sourceId: clip.id,
                kind: 'clip',
                decisionId: `clip:${clip.id}`,
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
          actors={RULE_ACTORS}
          poses={scene.poses}
          actorHeights={scene.heights}
          cameraPreset={camera}
          showRuleGeometry={false}
          showBallTrail
          showContactEvidence={false}
          ballTrail={trail}
          phaseLabel={explained ? scene.label : 'Observe the robots and ball.'}
          robotVisual={robotVisual}
          selectedActorId={explained ? scene.focus : null}
        />
        <output className="rule-scene-caption">
          <strong>
            {explained
              ? scene.label
              : ended
                ? 'Make your decision'
                : 'Watch the situation'}
          </strong>
          {explained && scene.readout && <span>{scene.readout}</span>}
        </output>
        <div className="rule-scene-camera">
          <NativeSelect
            size="sm"
            aria-label="Example camera"
            value={camera}
            onChange={(event) => setCamera(event.target.value as CameraPreset)}
          >
            <NativeSelectOption value="overhead">Overhead</NativeSelectOption>
            <NativeSelectOption value="broadcast">3D view</NativeSelectOption>
            <NativeSelectOption value="referee">
              Referee view
            </NativeSelectOption>
            <NativeSelectOption value="ball">Follow ball</NativeSelectOption>
          </NativeSelect>
        </div>
      </div>
      {duration > 0 ? (
        <div className="rule-player-controls">
          <Button
            aria-label={playing && !ended ? 'Pause example' : 'Play example'}
            onClick={() => {
              if (ended) {
                timeRef.current = 0;
                setTime(0);
                setPlaying(true);
              } else setPlaying((current) => !current);
            }}
          >
            {playing && !ended ? <Pause /> : <Play />}
          </Button>
          <Button
            variant="ghost"
            aria-label="Restart example"
            onClick={() => seek(0)}
          >
            <RotateCcw />
          </Button>
          <Slider
            aria-label="Example timeline"
            min={0}
            max={duration}
            step={0.02}
            value={[time]}
            onValueChange={(value) =>
              seek(Array.isArray(value) ? value[0] : value)
            }
          />
          <span>
            {time.toFixed(1)} / {duration.toFixed(0)} s
          </span>
          <NativeSelect
            size="sm"
            value={speed}
            onChange={(event) => setSpeed(Number(event.target.value))}
            aria-label="Example playback speed"
          >
            <NativeSelectOption value={0.5}>0.5×</NativeSelectOption>
            <NativeSelectOption value={1}>1×</NativeSelectOption>
            <NativeSelectOption value={2}>2×</NativeSelectOption>
          </NativeSelect>
        </div>
      ) : (
        <p className="rule-small">
          Use the setup described above to make your decision.
        </p>
      )}
      {explained && (
        <div className="rule-story-steps" aria-label="Animation key moments">
          {clip.frames.map((frame, index) => (
            <Button
              key={index}
              variant="ghost"
              className={cn(
                time >= frame.at &&
                  (index === clip.frames.length - 1 ||
                    time < clip.frames[index + 1].at) &&
                  'rule-step-active',
              )}
              onClick={() => seek(frame.at)}
            >
              <span>{index + 1}</span>
              {frame.label}
            </Button>
          ))}
        </div>
      )}
      <div className="rule-question">
        <LearningSaveStatus save={save} />
        <h3>{clip.question}</h3>
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
            clip.options,
            `${certificationRunId ?? 'practice'}:${clip.id}`,
          ).map(({ answer: option, index }) => (
            <AnswerChoice
              key={option}
              selected={answer === index}
              result={index === clip.answer ? 'correct' : 'incorrect'}
              disabled={
                locked ||
                save.pending ||
                Boolean(save.error) ||
                answer === clip.answer ||
                (!explained && !ended)
              }
              onClick={() => {
                if (
                  locked ||
                  save.isBlocked() ||
                  answer === clip.answer ||
                  (!explained && !ended)
                )
                  return;
                const questionId = `clip:${clip.id}`;
                const attemptNumber =
                  (answerAttempts.current.get(questionId) ?? 0) + 1;
                answerAttempts.current.set(questionId, attemptNumber);
                if (!firstAnswers.current.has(questionId))
                  firstAnswers.current.set(questionId, index);
                const accepted = index === clip.answer;
                setAnswer(index);
                setPlaying(false);
                const events: RuleLearningEvent[] = [
                  {
                    type: 'answer',
                    mode: learningMode,
                    certificationRunId,
                    questionId,
                    sourceId: clip.id,
                    kind: 'clip',
                    decisionId: questionId,
                    answer: { kind: 'clip', selectedIndex: index },
                    attemptNumber,
                    firstAnswer: attemptNumber === 1,
                    accepted,
                    score: accepted ? 1 : 0,
                    completed: accepted,
                    assisted: assisted.current,
                  },
                ];
                let reportPassed = false;
                if (accepted) {
                  if (!completedQuestions.current.has(questionId)) {
                    completedQuestions.current.add(questionId);
                    reportPassed = true;
                    events.push({
                      type: 'complete',
                      mode: learningMode,
                      certificationRunId,
                      questionId,
                      sourceId: clip.id,
                      kind: 'clip',
                      answer: {
                        kind: 'clip',
                        selectedIndex: firstAnswers.current.get(questionId)!,
                      },
                      firstTryCorrect: attemptNumber === 1 && !assisted.current,
                      assisted: assisted.current,
                    });
                  }
                }
                save.submit(events, reportPassed ? onPassed : undefined);
              }}
            >
              {option}
            </AnswerChoice>
          ))}
        </div>
        {answer !== null && (
          <AnswerFeedback
            result={answer === clip.answer ? 'correct' : 'incorrect'}
          >
            <p>{clip.feedback}</p>
            {learningMode === 'certification' &&
              save.recordedQuestionIds.includes(`clip:${clip.id}`) && (
                <p>
                  Your first answer is recorded. Reviewing the explanation will
                  not change your score.
                </p>
              )}
          </AnswerFeedback>
        )}
        {alreadyAnswered && answer === null && (
          <p className="rule-small">{clip.feedback}</p>
        )}
      </div>
      <p className="rule-small">
        Authored teaching examples. Movement and waiting periods may be
        compressed. Use the complete official paragraph for conditions and
        exceptions.
      </p>
    </div>
  );
}
