# Organization deployment and migration

Canonical repository: **[robocup-junior/rcj-soccer-lab](https://github.com/robocup-junior/rcj-soccer-lab)**.

Application: **[robocup-junior.github.io/rcj-soccer-lab](https://robocup-junior.github.io/rcj-soccer-lab/)**.

The organization repository contains the complete application and source commit
history. The original personal repository remains intact; this is a new
repository, not a destructive transfer. Historical pull requests and issues
are not duplicated or renumbered. Their links retain their original destination.
Local match videos, private progress backups and temporary validation outputs
are not part of the repository or Pages deployment.

## Moving your progress

The two Pages addresses have different browser origins. The organization site
cannot read the old site's IndexedDB, even on the same computer.

1. Open Academy on the old site and export your private progress backup.
2. Open Academy on the organization site and import that backup.
3. Reconnect your GitHub identity through the organization site's submission
   flow when prompted. Keep the original backup until you have checked the import.
4. Save reconstruction projects as `.rcj-replay.json` files and load them on the
   new site. Relink the same original video if you need to inspect footage.

No automatic migration, private cloud sync or email login is implied. Do not
attach progress backups or personal recordings to public GitHub issues.

The importer verifies old connection-only signatures with a frozen legacy
public key, preserves training history, and removes the old connection and
pending submission. Reconnecting issues a new organization receipt. The legacy
key is **not** trusted by the live directory or certification verifier. Backups
containing old certificates are refused with an explanation; they are never
silently promoted to organization credentials.

At setup, the old signed registry was audited: its directory was empty, its
only account had no certificate, and two accepted identity-connection receipts
were present. There were no pending public issues. The organization therefore
starts with a fresh issuer and registry; it does not mint replacement
certificates or transplant historical issue numbers. The old issuer and its
records remain available in the personal repository.

## Maintainer setup

The app needs no persistent server, ChatGPT/Sites service or runtime AI account.
The static frontend is built from `main`; signed public training records are
published separately on `academy-data`.

For a fresh deployment:

1. Enable Issues, GitHub Actions and **Pages → Build and deployment → GitHub Actions**.
   The base path remains `/rcj-soccer-lab/`.
2. Provision the organization signing secret once:

   ```sh
   node scripts/provision-academy.mjs --provision --repo robocup-junior/rcj-soccer-lab
   ```

   The private key is generated in memory and sent directly to the repository
   secret through standard input. Save only the printed **public** JWK in
   `lib/github/public-key.json`. Never commit, log or download the private key.
   If the secret already exists, the script refuses to replace it.

3. Push reviewed source and the matching public key to `main`. The
   **Deploy GitHub Pages** workflow type-checks, builds and runs the test suites.
   A completely empty repository must have its first source commit before the
   data branch can be initialized through the Git API.
4. Initialize the public data branch once:

   ```sh
   node scripts/bootstrap-academy-branch.mjs --bootstrap --repo robocup-junior/rcj-soccer-lab
   ```

5. Run **Publish mock academy requests** manually to initialize the signed
   directory. Subsequent issue events and reconciliation runs process the queue.
6. Test a real maintainer identity connection, not a fabricated passing exam.
   Verify the signed result and confirm that no certificate was issued by the test.

The organization uses its own signing-key identity. Do not replace its public
key with the personal repository's key or copy old signed rows into the new
registry without a reviewed migration. Do not rotate a key casually: existing
certificates depend on the corresponding trust anchor.

Default Actions token permissions are read-only. Deployment and publication
declare the additional permissions they require in their workflows. Standard
GitHub-hosted runners are used; no larger paid runner or hosting subscription
is configured by this setup.

## Ongoing care

- Check Pages and publisher workflow results before an event.
- Preserve public-key/secret pairing and back up private local training progress.
- Review rule changes, dependency updates, public-submission privacy and quotas.
- Review contributor permissions and consider branch protection appropriate to
  the committee's workflow; repository administrators remain trusted issuers.
- Follow [academy operations](github-academy.md) for queue recovery, capacity,
  unproctored-training limitations and GitHub permitted-use considerations.

Changing the repository address does not make the training certificate an
official appointment or remove the simulator's documented limitations.
