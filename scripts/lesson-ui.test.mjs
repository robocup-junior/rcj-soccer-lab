import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { registerHooks } from 'node:module';
import { test } from 'node:test';
import { compileFunction } from 'node:vm';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import ts from 'typescript';

const root = new URL('../', import.meta.url);
// Real lessons, localization and native Base UI controls. Only the WebGL canvas
// is replaced; its actual safe/unsafe display props remain observable in SSR.
registerHooks({
  resolve(specifier, context, nextResolve) {
    let target;
    if (specifier.startsWith('@/')) target = new URL(specifier.slice(2), root);
    else if (
      /^\.\.?\//.test(specifier) &&
      context.parentURL?.startsWith(root.href) &&
      !context.parentURL.includes('/node_modules/')
    )
      target = new URL(specifier, context.parentURL);
    if (target)
      for (const suffix of ['.ts', '.tsx', '/index.ts', '/index.tsx', '']) {
        const candidate = new URL(`${target.href}${suffix}`);
        if (existsSync(candidate)) return nextResolve(candidate.href, context);
      }
    return nextResolve(specifier, context);
  },
  load(url, context, nextLoad) {
    if (
      url === new URL('components/simulator/PlayCanvasViewport.tsx', root).href
    )
      return {
        format: 'module',
        shortCircuit: true,
        source: `
        import { createElement } from 'react';
        export function PlayCanvasViewport(props) {
          const { phaseLabel, selectedActorId, showRuleGeometry, showContactEvidence, poses } = props;
          return createElement('div', { 'data-qa-viewport': JSON.stringify({ phaseLabel, selectedActorId, showRuleGeometry, showContactEvidence, poses }) });
        }
      `,
      };
    if (url.startsWith(root.href) && !url.includes('/node_modules/')) {
      if (url.endsWith('.json'))
        return {
          format: 'module',
          shortCircuit: true,
          source: `export default ${readFileSync(new URL(url), 'utf8')}`,
        };
      if (/\.tsx?$/.test(url))
        return {
          format: 'module',
          shortCircuit: true,
          source: ts.transpileModule(readFileSync(new URL(url), 'utf8'), {
            compilerOptions: {
              target: ts.ScriptTarget.ES2022,
              module: ts.ModuleKind.ESNext,
              jsx: ts.JsxEmit.ReactJSX,
            },
          }).outputText,
        };
    }
    return nextLoad(url, context);
  },
});

const { RuleAnimationPlayer } =
  await import('../components/rulebook/RuleAnimationPlayer.tsx');
const { ScenarioLesson } =
  await import('../components/rulebook/ScenarioLesson.tsx');
const { QuestionLesson } =
  await import('../components/rulebook/QuestionLesson.tsx');
const { AnswerFeedback, AnswerChoice } =
  await import('../components/rulebook/AnswerFeedback.tsx');
const { LearningSaveStatus } =
  await import('../components/rulebook/useLearningSave.tsx');
const { createLearningSaveQueue } =
  await import('../lib/certification/learning-save.ts');
const { Rulebook } = await import('../components/rulebook/Rulebook.tsx');
const { RULE_CLIPS, sampleClip } =
  await import('../lib/rulebook/animations.ts');
const { SCENARIOS } = await import('../lib/simulator/scenarios.ts');
const { RULE_QUESTIONS } = await import('../lib/rulebook/questions.ts');
const { CLIP_ASSESSMENTS } =
  await import('../lib/rulebook/clip-assessments.ts');
const { SCENARIO_DECISION_TIMES } =
  await import('../lib/rulebook/scenario-assessments.ts');
const { orderedAnswers } = await import('../lib/rulebook/answer-order.ts');
const { CERTIFICATION_V3_QUESTION_IDS, CERTIFICATION_V4_QUESTION_IDS } =
  await import('../lib/certification/question-manifest.ts');
const { LEARNING_SITUATIONS } = await import('../lib/rulebook/learning.ts');

const noop = () => {};
const immediateSave = (events) => ({
  isBlocked: () => false,
  submit: (batch, completed) => {
    events.push(...batch);
    completed?.();
    return true;
  },
});
const runId = '10000000-0000-4000-8000-000000000001';
const common = {
  robotVisual: 'lab',
  learningMode: 'certification',
  certificationRunId: runId,
  onPassed: noop,
};
const render = (component, props) =>
  renderToStaticMarkup(createElement(component, props));
const decode = (text) =>
  text
    .replace(/&quot;/g, '"')
    .replace(/&#x27;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&');
const viewport = (html) =>
  JSON.parse(decode(html.match(/data-qa-viewport="([^"]+)"/)[1]));
const caption = (html) =>
  html.match(/<output class="rule-scene-caption">([\s\S]*?)<\/output>/)[1];
const choices = (html) =>
  [...html.matchAll(/<button\b([^>]*)>([\s\S]*?)<\/button>/g)].filter(
    ([, attrs]) => /\banswer-choice\b/.test(attrs),
  );
const disabled = (button) => /\sdisabled(?:=|\s|$)/.test(button[1]);
const choiceDisabled = (html, count) => {
  assert.equal(choices(html).length, count);
  assert.ok(choices(html).every(disabled));
};
const maxSlider = (html) => {
  const range = html.match(/<input\b[^>]*type="range"[^>]*>/)?.[0];
  return Number(range?.match(/\bmax="([^"]+)"/)?.[1]);
};

test('all animated questions hide teaching captions, readouts, key moments and feedback until answered', () => {
  assert.deepEqual(
    Object.keys(CLIP_ASSESSMENTS).sort(),
    RULE_CLIPS.map((clip) => clip.id).sort(),
  );
  for (const clip of RULE_CLIPS) {
    const html = render(RuleAnimationPlayer, { ...common, clips: [clip] });
    const view = viewport(html);
    assert.equal(view.phaseLabel, 'Observe the robots and ball.', clip.id);
    assert.equal(view.selectedActorId, null, clip.id);
    assert.equal(view.showRuleGeometry, false);
    assert.equal(view.showContactEvidence, false);
    assert.deepEqual(
      view.poses,
      JSON.parse(JSON.stringify(sampleClip(clip, 0).poses)),
    );
    assert.match(caption(html), /Watch the situation|Make your decision/);
    assert.doesNotMatch(
      caption(html),
      /<span>/,
      `${clip.id}: readout is absent`,
    );
    assert.doesNotMatch(
      html,
      /Animation key moments|answer-feedback|Watch explained replay/,
    );
    const stop = CLIP_ASSESSMENTS[clip.id].decisionAt;
    assert.ok(
      Number.isFinite(stop) && stop >= 0 && stop <= clip.frames.at(-1).at,
      clip.id,
    );
    if (stop > 0) {
      assert.equal(maxSlider(html), stop, clip.id);
      choiceDisabled(html, clip.options.length);
    } else {
      assert.doesNotMatch(html, /Example timeline/);
      assert.ok(choices(html).every((button) => !disabled(button)));
    }
    const answered = render(RuleAnimationPlayer, {
      ...common,
      clips: [clip],
      alreadyAnswered: true,
    });
    choiceDisabled(answered, clip.options.length);
    assert.match(answered, /Animation key moments|already recorded/);
    assert.ok(decode(answered).includes(clip.feedback), clip.id);
    assert.equal(maxSlider(answered), clip.frames.at(-1).at);
    assert.equal(viewport(answered).phaseLabel, sampleClip(clip, 0).label);
  }
});

test('all scenarios cap evidence playback and hide metrics, teaching summary and assistance in certification', () => {
  assert.deepEqual(
    Object.keys(SCENARIO_DECISION_TIMES).sort(),
    SCENARIOS.map((scenario) => scenario.id).sort(),
  );
  for (const scenario of SCENARIOS) {
    assert.ok(
      Number.isFinite(SCENARIO_DECISION_TIMES[scenario.id]) &&
        SCENARIO_DECISION_TIMES[scenario.id] >= 0 &&
        SCENARIO_DECISION_TIMES[scenario.id] <= scenario.duration,
      scenario.id,
    );
    const html = render(ScenarioLesson, { ...common, scenario });
    assert.equal(
      maxSlider(html),
      SCENARIO_DECISION_TIMES[scenario.id],
      scenario.id,
    );
    assert.equal(viewport(html).phaseLabel, 'Observe the robots and ball.');
    assert.equal(viewport(html).showRuleGeometry, false);
    assert.equal(viewport(html).showContactEvidence, false);
    assert.deepEqual(
      viewport(html).poses,
      JSON.parse(JSON.stringify(scenario.sample(0).actors)),
    );
    assert.doesNotMatch(
      html,
      /lesson-evidence|answer-feedback|Rule geometry|Contact evidence|Copy embed|Watch explained replay/,
    );
    assert.ok(!decode(html).includes(scenario.publicSummary), scenario.id);
    choiceDisabled(html, scenario.choices.length);
    const answered = render(ScenarioLesson, {
      ...common,
      scenario,
      alreadyAnswered: true,
    });
    choiceDisabled(answered, scenario.choices.length);
    assert.equal(maxSlider(answered), scenario.duration);
    assert.match(answered, /lesson-evidence/);
    assert.ok(decode(answered).includes(scenario.publicSummary));
    for (const choice of scenario.choices) {
      const result = render(ScenarioLesson, {
        ...common,
        scenario,
        initialAnswer: choice.id,
      });
      choiceDisabled(result, scenario.choices.length);
      assert.ok(
        decode(result).includes(choice.feedback),
        `${scenario.id}: ${choice.id}`,
      );
      assert.match(
        result,
        new RegExp(`answer-feedback answer-result-${choice.grade}`),
      );
    }
  }
});

test('every text check withholds its feedback and teaching title, and restored first answers are locked', () => {
  for (const item of RULE_QUESTIONS) {
    const html = render(QuestionLesson, { ...common, item });
    assert.ok(!decode(html).includes(item.feedback), item.id);
    assert.doesNotMatch(html, /<h2>|answer-feedback/);
    assert.equal(choices(html).length, item.options.length);
    assert.ok(choices(html).every((button) => !disabled(button)));
    const restored = render(QuestionLesson, {
      ...common,
      item,
      alreadyAnswered: true,
    });
    choiceDisabled(restored, item.options.length);
    assert.ok(decode(restored).includes(item.feedback));
    assert.match(restored, /already recorded/);
  }
});

test('shared feedback and selected answers expose all four result classes plus non-colour status icons', () => {
  const titles = {
    correct: 'Correct answer',
    acceptable: 'Acceptable referee decision',
    partial: 'Partly correct',
    incorrect: 'Incorrect answer',
  };
  const icons = {};
  for (const [result, title] of Object.entries(titles)) {
    const html = render(AnswerFeedback, {
      result,
      children: 'Specific explanation.',
    });
    assert.match(html, new RegExp(`answer-feedback answer-result-${result}`));
    assert.match(html, /role="status" aria-live="polite"/);
    assert.ok(html.includes(title));
    icons[result] = html.match(/<svg[\s\S]*?<\/svg>/)[0];
    assert.match(icons[result], /aria-hidden="true"/);
    const selected = render(AnswerChoice, {
      selected: true,
      result,
      disabled: true,
      children: 'Choice',
    });
    assert.match(selected, new RegExp(`answer-result-${result}`));
    assert.match(selected, /aria-pressed="true"/);
    assert.match(selected, /answer-result-icon/);
    const initial = render(AnswerChoice, { result, children: 'Choice' });
    assert.doesNotMatch(
      initial,
      /answer-result-icon|answer-result-(correct|acceptable|partial|incorrect)/,
      'unselected answer never exposes its hidden grade',
    );
  }
  assert.equal(icons.correct, icons.acceptable);
  assert.notEqual(icons.correct, icons.incorrect);
  assert.notEqual(icons.partial, icons.incorrect);
  const css = readFileSync(new URL('app/globals.css', root), 'utf8');
  assert.match(
    css,
    /\.answer-result-correct,\s*\.answer-result-acceptable\s*\{[^}]*border-color:[^}]*background:[^}]*color:/,
  );
  assert.match(
    css,
    /\.answer-result-incorrect,\s*\.answer-result-partial\s*\{[^}]*border-color:[^}]*background:[^}]*color:/,
  );
});

test('answer shuffling is deterministic per round and retains canonical indices and IDs without mutation', () => {
  const orders = new Set();
  for (const answers of [
    ...RULE_CLIPS.map((item) => item.options),
    ...RULE_QUESTIONS.map((item) => item.options),
    ...SCENARIOS.map((item) => item.choices),
  ]) {
    const original = [...answers];
    for (let round = 0; round < 8; round++) {
      const seed = `round-${round}`;
      const ordered = orderedAnswers(answers, seed);
      assert.deepEqual(orderedAnswers(answers, seed), ordered);
      assert.deepEqual(
        ordered.map(({ index }) => index).sort((a, b) => a - b),
        answers.map((_, index) => index),
      );
      for (const { answer, index } of ordered)
        assert.equal(answer, answers[index]);
      assert.deepEqual(answers, original);
      orders.add(ordered.map(({ index }) => index).join(','));
    }
  }
  assert.ok(
    orders.size > 2,
    'different rounds should not all display one fixed answer order',
  );
});

test('Rulebook renders only the assigned v3/v4 questions and hides reference/workbench answer panes in certification', () => {
  for (const questionIds of [
    CERTIFICATION_V3_QUESTION_IDS,
    CERTIFICATION_V4_QUESTION_IDS,
  ]) {
    const html = render(Rulebook, {
      robotVisual: 'lab',
      onSelect: noop,
      situationId: 'question:vision-dimensions',
      learning: {
        mode: 'certification',
        certificationRunId: runId,
        questionIds,
        completedSituationIds: ['question:vision-dimensions'],
      },
    });
    assert.match(
      html,
      new RegExp(`1 / ${questionIds.length} questions completed`),
    );
    assert.equal(
      (html.match(/class="rule-toc-item\b/g) ?? []).length,
      questionIds.length,
    );
    assert.doesNotMatch(
      html,
      /<iframe|Complete official rule text|Rulebook reading layout|Official rule document|learning-library-switch|inspection-workbench/,
    );
    assert.match(html, /rule-layout-visual/);
    const heading = decode(html.match(/<h1>([\s\S]*?)<\/h1>/)[1]).replace(
      /<[^>]+>/g,
      '',
    );
    assert.equal(
      heading,
      `Question ${questionIds.indexOf('question:vision-dimensions') + 1}`,
    );
    assert.doesNotMatch(html, /id="rule-reviewed"/);
    assert.match(html, /Answer recorded/);
    choiceDisabled(html, RULE_QUESTIONS[0].options.length);
    const nav = html.match(/<nav\b[\s\S]*?<\/nav>/)[0];
    for (const item of LEARNING_SITUATIONS)
      assert.ok(
        !decode(nav).includes(item.title),
        `certification navigation hides ${item.id} title`,
      );
  }
  const practice = render(Rulebook, {
    robotVisual: 'lab',
    onSelect: noop,
    situationId: 'question:vision-dimensions',
    learning: { mode: 'practice', questionIds: CERTIFICATION_V3_QUESTION_IDS },
  });
  assert.match(practice, /0 \/ 111 checks passed/);
  assert.match(practice, /<iframe|Complete official rule text/);
  assert.match(practice, /Rulebook reading layout|Official rule document/);
});

test('certification with no active assignment renders an empty finite-progress state rather than an unassigned exam', () => {
  const html = render(Rulebook, {
    robotVisual: 'lab',
    onSelect: noop,
    learning: {
      mode: 'certification',
      certificationRunId: null,
      questionIds: [],
      completedSituationIds: [],
    },
  });
  assert.match(html, /0 \/ 0 questions completed/);
  assert.match(html, /Select a certification question/);
  assert.equal(choices(html).length, 0);
  assert.doesNotMatch(html, /NaN|Infinity|<iframe/);
});

// Parse and execute production handlers, without duplicating their event logic
// or mocking React hooks. Bindings model the values at a particular render.
const source = (path) =>
  ts.createSourceFile(
    path,
    readFileSync(new URL(path, root), 'utf8'),
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.TSX,
  );
const find = (node, predicate) => {
  if (predicate(node)) return node;
  let result;
  ts.forEachChild(node, (child) => {
    result ??= find(child, predicate);
  });
  return result;
};
const bind = (expression, tree, bindings) => {
  assert.ok(expression, 'production handler exists');
  const code = ts.transpileModule(
    `const handler = ${expression.getText(tree)};`,
    {
      compilerOptions: {
        target: ts.ScriptTarget.ES2022,
        module: ts.ModuleKind.ESNext,
      },
    },
  ).outputText;
  return compileFunction(
    `${code}\nreturn handler;`,
    Object.keys(bindings),
  )(...Object.values(bindings));
};
const named = (path, name, bindings) => {
  const tree = source(path);
  return bind(
    find(
      tree,
      (node) =>
        ts.isVariableDeclaration(node) && node.name.getText(tree) === name,
    )?.initializer,
    tree,
    bindings,
  );
};
const click = (path, contains, bindings) => {
  const tree = source(path);
  const attribute = find(
    tree,
    (node) =>
      ts.isJsxAttribute(node) &&
      node.name.getText(tree) === 'onClick' &&
      node.initializer?.getText(tree).includes(contains),
  );
  return bind(attribute?.initializer.expression, tree, bindings);
};
const clipPath = 'components/rulebook/RuleAnimationPlayer.tsx';
const scenarioPath = 'components/rulebook/ScenarioLesson.tsx';

test('displayed shuffled buttons invoke their original numeric answer index, not their displayed position', () => {
  for (const kind of ['question', 'clip']) {
    const items = kind === 'question' ? RULE_QUESTIONS : RULE_CLIPS;
    const item = items.find((candidate) =>
      orderedAnswers(candidate.options, `${runId}:${candidate.id}`).some(
        (entry, position) => entry.index !== position,
      ),
    );
    assert.ok(item, `${kind}: fixture exercises a nonidentity permutation`);
    const order = orderedAnswers(item.options, `${runId}:${item.id}`);
    const position = order.findIndex((entry, offset) => entry.index !== offset);
    const entry = order[position],
      events = [];
    const props = kind === 'question' ? { item } : { clips: [item] };
    const html = render(
      kind === 'question' ? QuestionLesson : RuleAnimationPlayer,
      { ...common, ...props },
    );
    assert.ok(decode(choices(html)[position][2]).includes(entry.answer));
    if (kind === 'question') {
      const path = 'components/rulebook/QuestionLesson.tsx';
      const choose = named(path, 'choose', {
        item,
        completed: { current: false },
        locked: false,
        attempts: { current: 0 },
        firstAnswer: { current: null },
        setSelected: noop,
        learningMode: 'certification',
        certificationRunId: runId,
        onLearningEvent: (event) => events.push(event),
        save: immediateSave(events),
        onPassed: noop,
      });
      click(path, 'choose(', { choose, index: entry.index, position })();
    } else {
      const tree = source(clipPath);
      const map = find(
        tree,
        (node) =>
          ts.isCallExpression(node) &&
          node.expression.getText(tree).startsWith('orderedAnswers(') &&
          node.expression.getText(tree).endsWith('.map'),
      );
      assert.match(
        map.arguments[0].parameters[0].name.getText(tree),
        /\bindex\b/,
        'map must preserve the original index from orderedAnswers',
      );
      click(clipPath, 'const questionId', {
        clip: item,
        index: entry.index,
        position,
        locked: false,
        answer: null,
        explained: false,
        ended: true,
        answerAttempts: { current: new Map() },
        firstAnswers: { current: new Map() },
        completedQuestions: { current: new Set() },
        assisted: { current: false },
        setAnswer: noop,
        setPlaying: noop,
        onPassed: noop,
        learningMode: 'certification',
        certificationRunId: runId,
        onLearningEvent: (event) => events.push(event),
        save: immediateSave(events),
      })();
    }
    assert.equal(events[0].answer.selectedIndex, entry.index);
    assert.notEqual(events[0].answer.selectedIndex, position);
  }
});

test('text-check handler sends the original shuffled index and locks the first certification answer', () => {
  const item = RULE_QUESTIONS[0],
    events = [];
  const bindings = {
    item,
    completed: { current: false },
    locked: false,
    attempts: { current: 0 },
    firstAnswer: { current: null },
    setSelected: noop,
    learningMode: 'certification',
    certificationRunId: runId,
    onLearningEvent: (event) => events.push(event),
    save: immediateSave(events),
    onPassed: noop,
  };
  const path = 'components/rulebook/QuestionLesson.tsx';
  const wrong = item.answer === 0 ? 1 : 0;
  named(path, 'choose', bindings)(wrong);
  assert.equal(events.length, 1);
  assert.deepEqual(events[0].answer, {
    kind: 'question',
    selectedIndex: wrong,
  });
  assert.equal(events[0].accepted, false);
  named(path, 'choose', { ...bindings, locked: true })(item.answer);
  assert.equal(events.length, 1);
  named(path, 'choose', { ...bindings, learningMode: 'practice' })(item.answer);
  assert.equal(events[2].type, 'complete');
  assert.equal(events[2].answer.selectedIndex, wrong);
  assert.equal(events[2].firstTryCorrect, false);
});

test('clip and scenario handlers gate early clicks, keep canonical answers and mark explained practice as assisted', () => {
  for (const kind of ['clip', 'scenario']) {
    const definition = kind === 'clip' ? RULE_CLIPS[0] : SCENARIOS[0];
    const path = kind === 'clip' ? clipPath : scenarioPath;
    const events = [],
      assisted = { current: false };
    const bindings = {
      locked: false,
      answer: null,
      selected: null,
      explained: false,
      ended: false,
      time: 0,
      duration: 3,
      clip: definition,
      scenario: definition,
      index: definition.answer,
      choice: definition.choices?.find((choice) => choice.grade === 'correct'),
      answerAttempts: { current: kind === 'clip' ? new Map() : 0 },
      firstAnswers: { current: new Map() },
      firstAnswer: { current: null },
      completedQuestions: { current: new Set() },
      completionReported: { current: false },
      assisted,
      setAnswer: noop,
      setPlaying: noop,
      setGuided: noop,
      onAnswer: noop,
      onPassed: noop,
      learningMode: 'practice',
      certificationRunId: null,
      onLearningEvent: (event) => events.push(event),
      save: immediateSave(events),
    };
    click(path, 'const questionId', bindings)();
    assert.equal(events.length, 0, `${kind}: cannot answer before watching`);
    click(path, "assistance: 'show-answer'", bindings)();
    assert.equal(events[0].type, 'assistance');
    assert.equal(assisted.current, true);
    click(path, 'const questionId', { ...bindings, explained: true })();
    assert.equal(events[1].type, 'answer');
    assert.equal(events[1].assisted, true);
    assert.equal(events[2].type, 'complete');
    assert.equal(events[2].firstTryCorrect, false);
    assert.equal(events[2].assisted, true);
    if (kind === 'clip')
      assert.equal(events[1].answer.selectedIndex, definition.answer);
    else assert.equal(events[1].answer.choiceId, bindings.choice.id);
    click(path, 'const questionId', {
      ...bindings,
      learningMode: 'certification',
      locked: true,
      explained: true,
    })();
    assert.equal(
      events.length,
      3,
      `${kind}: certification first answer stays locked`,
    );
  }
});

test('actual seek handlers clamp direct and oversized scrubs to the evidence-only decision cutoff', () => {
  for (const [path, reference] of [
    [clipPath, 'timeRef'],
    [scenarioPath, 'cursor'],
  ]) {
    const times = [],
      cursor = { current: 0 };
    const seek = named(path, 'seek', {
      duration: 2.5,
      [reference]: cursor,
      setTime: (time) => times.push(time),
      setPlaying: noop,
    });
    seek(-2);
    seek(500);
    seek(1.25);
    assert.deepEqual(times, [0, 2.5, 1.25]);
  }
});

const settle = async () => {
  for (let index = 0; index < 6; index++) await Promise.resolve();
};
const answerEvent = () => ({
  type: 'answer',
  mode: 'certification',
  certificationRunId: runId,
  questionId: 'question:vision-dimensions',
  sourceId: 'vision-dimensions',
  kind: 'question',
  decisionId: 'question:vision-dimensions',
  answer: { kind: 'question', selectedIndex: 1 },
  attemptNumber: 1,
  firstAnswer: true,
  accepted: true,
  score: 1,
  completed: true,
  assisted: false,
});
const completeEvent = () => ({
  type: 'complete',
  mode: 'certification',
  certificationRunId: runId,
  questionId: 'question:vision-dimensions',
  sourceId: 'vision-dimensions',
  kind: 'question',
  answer: { kind: 'question', selectedIndex: 1 },
  firstTryCorrect: true,
  assisted: false,
});

test('save rejection retains immutable first evidence, blocks replacement, and retries without an unhandled rejection', async () => {
  const delivered = [];
  let allow = false,
    passed = 0;
  const queue = createLearningSaveQueue(async (event) => {
    delivered.push(structuredClone(event));
    event.answer.selectedIndex = 99; // Consumer mutation must not corrupt retry.
    if (!allow) throw new Error('Storage is full.');
  });
  const original = answerEvent();
  const expected = structuredClone(original);
  assert.equal(
    queue.submit([original, completeEvent()], () => passed++),
    true,
  );
  original.answer.selectedIndex = 2; // Caller mutation must not corrupt retry.
  assert.equal(queue.isBlocked(), true);
  assert.equal(queue.getSnapshot().pending, true);
  await settle();
  assert.equal(queue.getSnapshot().error, 'Storage is full.');
  assert.deepEqual(queue.getSnapshot().recordedQuestionIds, []);
  assert.equal(passed, 0);
  assert.equal(
    queue.submit([original]),
    false,
    'cannot replace a failed first answer',
  );
  allow = true;
  await Promise.all([queue.retry(), queue.retry()]);
  assert.deepEqual(delivered, [expected, expected, completeEvent()]);
  assert.deepEqual(queue.getSnapshot().recordedQuestionIds, [
    expected.questionId,
  ]);
  assert.equal(queue.getSnapshot().error, null);
  assert.equal(queue.isBlocked(), false);
  assert.equal(passed, 1);
  await queue.retry();
  assert.equal(delivered.length, 3);
  assert.equal(passed, 1);
});

test('recorded state follows answer acknowledgement and completion follows the final acknowledgement only', async () => {
  const delivered = [],
    release = [];
  let passed = 0;
  const queue = createLearningSaveQueue((event) => {
    delivered.push(event.type);
    return new Promise((resolve, reject) => release.push({ resolve, reject }));
  });
  queue.submit([answerEvent(), completeEvent()], () => passed++);
  assert.deepEqual(delivered, ['answer']);
  assert.deepEqual(queue.getSnapshot().recordedQuestionIds, []);
  assert.equal(passed, 0);
  release[0].resolve();
  await settle();
  assert.deepEqual(delivered, ['answer', 'complete']);
  assert.deepEqual(queue.getSnapshot().recordedQuestionIds, [
    'question:vision-dimensions',
  ]);
  assert.equal(passed, 0);
  release[1].reject(new Error('Completion save failed.'));
  await settle();
  assert.equal(queue.getSnapshot().error, 'Completion save failed.');
  const retry = queue.retry();
  assert.deepEqual(
    delivered,
    ['answer', 'complete', 'complete'],
    'never resend an acknowledged predecessor',
  );
  release[2].resolve();
  await retry;
  assert.equal(passed, 1);
  assert.equal(queue.getSnapshot().pending, false);
});

test('callback updates apply to later batches without redirecting a failed immutable batch', async () => {
  const delivered = [];
  let allow = false;
  const queue = createLearningSaveQueue(async (event) => {
    delivered.push(`original:${event.type}`);
    if (!allow) throw new Error('Storage unavailable.');
  });
  queue.submit([answerEvent(), completeEvent()]);
  await settle();
  queue.setSave((event) => delivered.push(`updated:${event.type}`));
  allow = true;
  await queue.retry();
  assert.deepEqual(delivered, [
    'original:answer',
    'original:answer',
    'original:complete',
  ]);
  queue.submit([answerEvent()]);
  await settle();
  assert.equal(delivered.at(-1), 'updated:answer');
});

test('all three production answer handlers wait for successful batch saving before onPassed and retain failed choices', async () => {
  for (const kind of ['question', 'clip', 'scenario']) {
    const definition =
      kind === 'question'
        ? RULE_QUESTIONS[0]
        : kind === 'clip'
          ? RULE_CLIPS[0]
          : SCENARIOS[0];
    const delivered = [];
    let allow = false,
      passed = 0;
    const save = createLearningSaveQueue(async (event) => {
      delivered.push(structuredClone(event));
      if (!allow) throw new Error('Storage unavailable.');
    });
    const bindings = {
      item: definition,
      clip: definition,
      scenario: definition,
      save,
      index: definition.answer,
      choice: definition.choices?.find((choice) => choice.grade === 'correct'),
      completed: { current: false },
      locked: false,
      answer: null,
      selected: null,
      explained: false,
      ended: true,
      time: 3,
      duration: 3,
      attempts: { current: 0 },
      firstAnswer: { current: null },
      firstAnswers: { current: new Map() },
      answerAttempts: { current: kind === 'clip' ? new Map() : 0 },
      completedQuestions: { current: new Set() },
      completionReported: { current: false },
      assisted: { current: false },
      setSelected: noop,
      setAnswer: noop,
      setPlaying: noop,
      onAnswer: noop,
      learningMode: 'certification',
      certificationRunId: runId,
      onPassed: () => passed++,
    };
    const invoke =
      kind === 'question'
        ? () =>
            named(
              'components/rulebook/QuestionLesson.tsx',
              'choose',
              bindings,
            )(definition.answer)
        : () =>
            click(
              kind === 'clip' ? clipPath : scenarioPath,
              'const questionId',
              bindings,
            )();
    invoke();
    assert.equal(passed, 0, kind);
    await settle();
    assert.equal(passed, 0, kind);
    assert.equal(delivered.length, 1, kind);
    assert.equal(save.isBlocked(), true);
    invoke(); // Even stale-render handlers cannot replace pending first evidence.
    assert.equal(delivered.length, 1, kind);
    allow = true;
    await save.retry();
    assert.equal(passed, 1, kind);
    assert.deepEqual(delivered[0], delivered[1], `${kind}: retry is identical`);
    assert.equal(delivered[2].type, 'complete');
  }
});

test('save status reuses pending/error/retry wording and clip selection cannot discard a pending answer', () => {
  const pending = render(LearningSaveStatus, {
    save: { pending: true, error: null, retry: noop },
  });
  assert.match(decode(pending), /Saving your answer…/);
  assert.doesNotMatch(pending, /already recorded|first answer is recorded/);
  const failed = render(LearningSaveStatus, {
    save: {
      pending: false,
      error: 'Your first answer could not be saved.',
      retry: noop,
    },
  });
  assert.match(failed, /role="alert"/);
  assert.match(
    failed,
    /Keep this lesson open and retry so your first answer is not lost\./,
  );
  assert.match(failed, /Retry saving answer/);
  let switched = false;
  named(clipPath, 'choose', {
    save: { isBlocked: () => true },
    setClipId: () => {
      switched = true;
    },
  })('another-clip');
  assert.equal(switched, false);
});
