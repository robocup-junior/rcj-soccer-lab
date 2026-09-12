import { generateKeyPairSync } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { requireOrganizationRepository } from './academy-repository.mjs';

// One-time owner setup. The private key exists only in memory and goes to gh's
// stdin, never a file, shell argument, frontend bundle or command output.
if (!process.argv.includes('--provision'))
  throw new Error(
    'Pass --provision to configure the GitHub Actions signing secret.',
  );
const repository = requireOrganizationRepository(process.argv.slice(2));
const names = execFileSync(
  'gh',
  ['secret', 'list', '--repo', repository, '--json', 'name'],
  { encoding: 'utf8' },
);
if (JSON.parse(names).some((entry) => entry.name === 'ACADEMY_SIGNING_KEY'))
  throw new Error(
    'Signing secret already exists. Use the documented key rotation process; do not replace it accidentally.',
  );
const { privateKey, publicKey } = generateKeyPairSync('ec', {
  namedCurve: 'prime256v1',
});
execFileSync(
  'gh',
  ['secret', 'set', 'ACADEMY_SIGNING_KEY', '--repo', repository],
  {
    input: JSON.stringify(privateKey.export({ format: 'jwk' })),
    stdio: ['pipe', 'pipe', 'pipe'],
  },
);
process.stdout.write(
  JSON.stringify(publicKey.export({ format: 'jwk' })) + '\n',
);
