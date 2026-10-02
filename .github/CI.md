# CI checks

## What runs

Parses standalone and inline JavaScript without execution, parses inline JSON, and verifies local script/stylesheet references.

The workflow runs on every pull request (including docs-only edits), on pushes to `main`, and on manual dispatch. The tiny checks are cheaper than a separate change-routing system. The single, always-present **CI** job is the stable result; any failed step fails that check without paying for a second aggregate runner. No workflow-level path filter can leave the result pending.

## Run locally

```sh
python .github/check_static.py
```

## Coverage limits

This is a syntax/resource smoke check, not a full HTML/CSS validator, accessibility audit, link checker, browser test, audio test, or deployment. Remote resources are not fetched.

No build matrix, secrets, paid service, deployment, or dependency cache is needed. CI uses an explicit Ubuntu 24.04 image, short timeouts, read-only repository access, no persisted checkout credentials, immutable action commits, and cancellation of superseded validation runs. Runtime dependencies and application behavior are unchanged.

## Learning resources

- [GitHub workflow syntax](https://docs.github.com/en/actions/reference/workflows-and-actions/workflow-syntax)
- [Secure use of GitHub Actions](https://docs.github.com/en/actions/reference/security/secure-use)
- [Python unittest](https://docs.python.org/3/library/unittest.html)

Pin updates should be reviewed like code. A green syntax check is a useful minimum, not evidence of full product correctness.
