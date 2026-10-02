# Security

## Discord webhook incident

The Discord webhook that was previously committed is compromised. Delete or rotate it in Discord before deploying a replacement. Moving the URL to an environment variable does not invalidate the old URL.

Create the replacement only in a private deployment environment:

```env
DISCORD_WEBHOOK_URL=https://discord.com/api/webhooks/...
```

For Docker, store it in `.env.discord` beside `docker-compose.yml`. This file is ignored by git and must never be committed, pasted into issues, or added to client-side code.

## Removing the old secret from git history

After rotating the webhook, rewrite the repository history to remove the old URL, then force-push the rewritten branches. Coordinate this with anyone else who has cloned the repository because existing clones still contain the old history.

Using `git-filter-repo`:

```bash
git filter-repo --sensitive-data-removal --replace-text replacements.txt
```

Put the old webhook URL followed by `==> [REDACTED]` in `replacements.txt`, delete that file afterward, then verify:

```bash
git log --all -S'discord.com/api/webhooks' --oneline
git grep -n -E 'discord(app)?\\.com/api/webhooks' $(git rev-list --all) 2>/dev/null
```

Force-push only after reviewing the rewritten history:

```bash
git push --force-with-lease --all origin
git push --force-with-lease --tags origin
```

The repository also runs Gitleaks on pushes and pull requests through `.github/workflows/secret-scan.yml`.
