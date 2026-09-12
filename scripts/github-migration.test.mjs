import assert from 'node:assert/strict';
import { generateKeyPairSync } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import { requireOrganizationRepository } from './academy-repository.mjs';
import { KEY_ID, makeSigner, registerTrustedTypes } from './github-academy.mjs';
registerTrustedTypes();
const {
  GITHUB_REPOSITORY,
  ACADEMY_DATA_URL,
  SIGNING_KEY_ID,
  prepareSubmission,
} = await import('../lib/github/protocol.ts');
const { verifyEnvelope, verifyLegacyConnectionForImport } =
  await import('../lib/github/registry.ts');
const {
  emptyProgress,
  enableProfile,
  newRound,
  startLocalGame,
  finishLocalGame,
  resumeLocalGame,
  accountSnapshot,
  trustedReceipt,
  validateBackup,
} = await import('../lib/account/local.ts');
const { makeMatchReplay, verifyMatchReplay } =
  await import('../lib/certification/replay.ts');
const { RULE_CLIPS } = await import('../lib/rulebook/animations.ts');

// This already-public, connection-only receipt pins the actual frozen legacy
// key. Source: JakubGal/rcj-soccer-lab, academy-data, requests/
// 3af70588a64a40d284bdebe2cc30c5b2.json. It contains no certificate or credential.
const legacyEnvelope = JSON.parse(
  readFileSync(
    new URL('./legacy-personal-connect.fixture.json', import.meta.url),
  ),
);
const legacyReceipt = JSON.parse(
  Buffer.from(legacyEnvelope.payload, 'base64url'),
);
const legacyKeyId = 'academy-2026-v1';
const profile = {
  displayName: 'Migration fixture',
  country: 'CZ',
  publicProfile: false,
};

test('organization URLs, signing IDs, workflows and operator guards agree', async () => {
  assert.equal(GITHUB_REPOSITORY, 'robocup-junior/rcj-soccer-lab');
  assert.equal(
    ACADEMY_DATA_URL,
    `https://raw.githubusercontent.com/${GITHUB_REPOSITORY}/academy-data/`,
  );
  assert.equal(SIGNING_KEY_ID, 'academy-robocup-junior-2026-v1');
  assert.equal(KEY_ID, SIGNING_KEY_ID);
  assert.notEqual(KEY_ID, legacyKeyId);
  assert.equal(
    requireOrganizationRepository(['--repo', GITHUB_REPOSITORY]),
    GITHUB_REPOSITORY,
  );
  for (const args of [
    [],
    ['--repo'],
    ['--repo', 'JakubGal/rcj-soccer-lab'],
    ['--repo', 'other/repo'],
    ['--repo', GITHUB_REPOSITORY, '--repo', GITHUB_REPOSITORY],
    [`--repo=${GITHUB_REPOSITORY}`],
  ])
    assert.throws(() => requireOrganizationRepository(args), /explicitly/);
  const request = await prepareSubmission({
    schema: 1,
    kind: 'connect',
    requestId: 'a'.repeat(32),
    profile,
  });
  assert.equal(
    new URL(request.issueUrl).pathname,
    `/${GITHUB_REPOSITORY}/issues/new`,
  );
  const workflow = readFileSync(
    new URL('../.github/workflows/academy.yml', import.meta.url),
    'utf8',
  );
  assert.ok(workflow.includes(`github.repository == '${GITHUB_REPOSITORY}'`));
  assert.doesNotMatch(workflow, /JakubGal/);
  for (const filename of [
    'provision-academy.mjs',
    'bootstrap-academy-branch.mjs',
    'github-live-smoke.mjs',
  ]) {
    const script = readFileSync(new URL(filename, import.meta.url), 'utf8');
    assert.match(
      script,
      /requireOrganizationRepository\(process.argv.slice\(2\)\)/,
    );
    assert.doesNotMatch(script, /JakubGal\/rcj-soccer-lab/);
  }
  const currentKey = (await import('../lib/github/public-key.json')).default;
  const legacyKey = (
    await import('../lib/github/legacy-personal-public-key.json')
  ).default;
  assert.notDeepEqual(currentKey, legacyKey);
  assert.equal('d' in currentKey, false);
  assert.equal('d' in legacyKey, false);
});

async function populatedProgress() {
  const data = emptyProgress();
  enableProfile(data);
  await newRound(data);
  const start = () =>
    startLocalGame(data, { mode: 'step', roundId: data.round.id });
  const finish = (id) => {
    const checkpoint = resumeLocalGame(data, id).checkpoint;
    const replay = makeMatchReplay({
      ...checkpoint,
      events: [
        ...checkpoint.events,
        {
          op: 'end',
          seq: checkpoint.events.length,
          tick: checkpoint.terminal.tick,
        },
      ],
      terminal: { tick: checkpoint.terminal.tick, reason: 'ended-early' },
    });
    const verified = verifyMatchReplay(replay);
    finishLocalGame(data, id, {
      replay,
      elapsedSeconds: verified.elapsedSeconds,
      ...verified.report,
    });
  };
  finish((await start()).attemptId);
  await start();
  await newRound(data); // Both a completed replay and unfinished checkpoint are archived.
  finish((await start()).attemptId);
  await start();
  const clip = RULE_CLIPS[0];
  data.completedQuestions = [`clip:${clip.id}`];
  data.round.ruleEvents = [
    {
      type: 'complete',
      mode: 'certification',
      certificationRunId: data.round.id,
      questionId: `clip:${clip.id}`,
      sourceId: clip.id,
      kind: 'clip',
      decisionId: `clip:${clip.id}`,
      answer: { kind: 'clip', selectedIndex: clip.answer },
      firstTryCorrect: true,
      assisted: false,
    },
  ];
  return data;
}

test('real old connection backup preserves every training field and requires a new org connection', async () => {
  const data = await populatedProgress();
  const expected = await validateBackup(structuredClone(data));
  const beforeTraining = structuredClone(data);
  data.connection = legacyEnvelope;
  data.receipt = legacyEnvelope;
  data.profile.refereeNumber = legacyReceipt.refereeNumber;
  data.request = {
    kind: 'certify',
    requestId: 'b'.repeat(32),
    issueUrl: 'https://github.com/JakubGal/rcj-soccer-lab/issues/new',
    body: 'old issuer evidence',
  };
  const original = structuredClone(data);
  let notices = 0;
  const restored = await validateBackup(data, {
    onLegacyImport: () => notices++,
  });
  assert.equal(notices, 1);
  assert.deepEqual(data, original, 'validation never mutates the input backup');
  assert.deepEqual(restored, expected, 'only old-issuer state is removed');
  for (const key of [
    'completedQuestions',
    'practiceGames',
    'round',
    'attempts',
    'history',
    'checkpoints',
    'archivedReplays',
    'archivedCheckpoints',
  ]) {
    assert.deepEqual(restored[key], beforeTraining[key], key);
    assert.ok(
      Object.keys(restored[key]).length,
      `${key} fixture must be populated`,
    );
  }
  assert.equal(restored.connection, null);
  assert.equal(restored.receipt, null);
  assert.equal(restored.certificationReceipt, null);
  assert.equal(restored.request, null);
  assert.equal(restored.profile.refereeNumber, '');
  assert.notEqual(
    (await accountSnapshot(restored)).certification.status,
    'qualified',
  );
  assert.equal(await trustedReceipt(legacyEnvelope), null);
  await assert.rejects(
    () => verifyEnvelope(legacyEnvelope),
    /Invalid signed record/,
  );
  assert.deepEqual(
    await verifyLegacyConnectionForImport(legacyEnvelope),
    legacyReceipt,
  );
  await validateBackup(restored, { onLegacyImport: () => notices++ });
  assert.equal(
    notices,
    1,
    're-exported org backup is no longer a legacy connection backup',
  );
});

test('tampered and re-signed old connection backups never cross the issuer boundary', async () => {
  const attacker = makeSigner(
    generateKeyPairSync('ec', { namedCurve: 'P-256' }).privateKey.export({
      format: 'jwk',
    }),
  );
  const forged = { ...attacker.envelope(legacyReceipt), keyId: legacyKeyId };
  const tampered = {
    ...legacyEnvelope,
    payload: Buffer.from(
      JSON.stringify({
        ...legacyReceipt,
        githubId: 7,
        refereeNumber: 'RCJ-GH-7',
      }),
    ).toString('base64url'),
  };
  for (const envelope of [
    forged,
    tampered,
    { ...legacyEnvelope, keyId: SIGNING_KEY_ID },
  ]) {
    const data = emptyProgress();
    enableProfile(data);
    data.connection = envelope;
    const before = structuredClone(data);
    let notice = false;
    await assert.rejects(
      () =>
        validateBackup(data, {
          onLegacyImport: () => {
            notice = true;
          },
        }),
      /signature/,
    );
    assert.equal(notice, false);
    assert.deepEqual(data, before);
    assert.equal(await trustedReceipt(envelope), null);
  }
});

async function withLegacyTestIssuer(operation) {
  // Only this isolated process's in-memory PUBLIC key is swapped. No file or
  // configured private key is read or changed; the fixture signer is disposable.
  const configured = (
    await import('../lib/github/legacy-personal-public-key.json')
  ).default;
  const original = { ...configured };
  const signer = makeSigner(
    generateKeyPairSync('ec', { namedCurve: 'P-256' }).privateKey.export({
      format: 'jwk',
    }),
  );
  Object.assign(configured, signer.publicJwk);
  try {
    await operation((payload) => ({
      ...signer.envelope(payload),
      keyId: legacyKeyId,
    }));
  } finally {
    Object.assign(configured, original);
  }
}

test('legacy certification is refused helpfully in every proof slot without modifying progress', async () => {
  await withLegacyTestIssuer(async (sign) => {
    const baseline = await populatedProgress();
    const certificate = {
      roundId: baseline.round.id,
      certifiedAt: new Date().toISOString(),
    };
    for (const key of [
      'connection',
      'certificationReceipt',
      'receipt',
      'historyReceipts',
    ]) {
      const data = structuredClone(baseline);
      const envelope = sign({ ...legacyReceipt, certificate });
      if (key === 'historyReceipts')
        data.historyReceipts[data.history[0].id] = envelope;
      else data[key] = envelope;
      const before = structuredClone(data);
      await assert.rejects(
        () => validateBackup(data),
        /personal repository cannot be imported as organization certificates/,
      );
      assert.deepEqual(data, before);
      assert.equal(await trustedReceipt(envelope), null);
    }
    for (const patch of [
      { status: 'rejected' },
      { kind: 'other' },
      { githubId: -1 },
      { refereeNumber: 'RCJ-GH-1' },
      { requestId: 'invalid' },
      { issueNumber: 0 },
    ])
      await assert.rejects(
        () =>
          verifyLegacyConnectionForImport(sign({ ...legacyReceipt, ...patch })),
        /unsupported legacy/,
      );
    for (const patch of [{ kind: 'certify' }, { certificate: null }])
      await assert.rejects(
        () =>
          verifyLegacyConnectionForImport(sign({ ...legacyReceipt, ...patch })),
        /cannot be imported/,
      );
  });
});

test('legacy notice is withheld if later training validation fails', async () => {
  const data = await populatedProgress();
  data.connection = legacyEnvelope;
  data.attempts = { invalid: {} };
  let notice = false;
  await assert.rejects(() =>
    validateBackup(data, {
      onLegacyImport: () => {
        notice = true;
      },
    }),
  );
  assert.equal(notice, false);
});

test('unsigned personal pending requests are discarded without granting trust; org requests remain recoverable', async () => {
  for (const repository of ['JakubGal/rcj-soccer-lab', GITHUB_REPOSITORY]) {
    const data = await populatedProgress();
    const expected = await validateBackup(structuredClone(data));
    data.request = {
      kind: 'connect',
      requestId: 'd'.repeat(32),
      issueUrl: `https://github.com/${repository}/issues/new?title=old`,
      body: 'untrusted',
    };
    let notice = false;
    const restored = await validateBackup(data, {
      onLegacyImport: () => {
        notice = true;
      },
    });
    assert.equal(restored.connection, null);
    assert.equal(restored.certificationReceipt, null);
    assert.equal(await trustedReceipt(restored.receipt), null);
    if (repository === GITHUB_REPOSITORY) {
      assert.equal(notice, false);
      assert.equal(restored.request.requestId, data.request.requestId);
      assert.equal(
        new URL(restored.request.issueUrl).pathname,
        `/${GITHUB_REPOSITORY}/issues/new`,
      );
      assert.doesNotMatch(restored.request.body, /untrusted/);
      restored.request = null;
    } else {
      assert.equal(notice, true);
      assert.equal(restored.request, null);
    }
    assert.deepEqual(restored, expected);
  }
});
