export const ORGANIZATION_REPOSITORY = 'robocup-junior/rcj-soccer-lab';

/** Operator scripts must never infer a remote or mutate the personal issuer. */
export function requireOrganizationRepository(args) {
  const flags = args.filter((arg) => arg === '--repo');
  const repository = args[args.indexOf('--repo') + 1];
  if (flags.length !== 1 || repository !== ORGANIZATION_REPOSITORY)
    throw new Error(
      `Pass --repo ${ORGANIZATION_REPOSITORY} explicitly. Other repositories are not permitted.`,
    );
  return ORGANIZATION_REPOSITORY;
}
