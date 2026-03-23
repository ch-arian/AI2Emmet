# Proxy / Network Troubleshooting for `npm ci`

If `npm ci` hangs or fails with errors like:

- `CONNECT tunnel failed, response 403`
- `ENETUNREACH`

this is typically an environment egress/proxy issue, not a dependency graph issue.

## Quick diagnostics

```bash
env | grep -Ei 'proxy|npm_config'
curl -vI https://registry.npmjs.org/
env -u HTTP_PROXY -u HTTPS_PROXY -u http_proxy -u https_proxy \
  -u npm_config_http_proxy -u npm_config_https_proxy \
  curl -I https://registry.npmjs.org/
```

Interpretation:

- `403 Forbidden` from proxy (often Envoy): proxy policy is denying outbound CONNECT.
- Direct request fails without proxy: direct egress is blocked.

## Why lockfile installs still fail

`package-lock.json` references tarballs at `https://registry.npmjs.org/...`.
If neither proxy nor direct internet egress can reach registry.npmjs.org,
`npm ci` cannot complete.

## What to ask platform/network admins

1. Allowlist `registry.npmjs.org` (and any required npm CDN endpoints) for outbound HTTPS.
2. Confirm whether authenticated proxy access is required for this runner.
3. Provide the correct proxy env var format and required CA settings.

## Notes for this repo

- `npm ci --dry-run` may still succeed because it verifies dependency resolution without downloading all tarballs.
- `.npmrc` currently sets `omit=optional` to keep installs slimmer in constrained environments.
