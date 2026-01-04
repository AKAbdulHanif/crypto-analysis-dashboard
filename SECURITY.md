# Security Notice

## API Key Exposure Incident

**Date**: January 4, 2026

### What Happened

A Nansen API key was accidentally committed to the Git repository in plain text in commit `f60bb19`. This key was exposed in the public GitHub repository.

### Actions Taken

1. ✅ **Removed hardcoded API key** from the codebase (commit `13c9015`)
2. ✅ **Moved to environment variables** - API key now stored securely via Manus secrets management
3. ✅ **Updated codebase** to use `process.env.NANSEN_API_KEY` instead of hardcoded value

### Required Action

**🚨 CRITICAL: You must immediately revoke and regenerate your Nansen API key**

1. Log in to https://nansen.ai
2. Navigate to Settings → API Keys
3. **Revoke** the old API key (the one that was exposed: `i1P5zF51...`)
4. **Generate** a new API key
5. **Update** the `NANSEN_API_KEY` environment variable in Manus with the new key

### Why Key Rotation is Necessary

- The exposed key is visible in the Git history (commit `f60bb19`)
- Anyone with access to the GitHub repository can see the old key
- Rotating the key ensures the exposed one becomes useless

### Prevention

Going forward:

- ✅ All API keys are stored as environment variables
- ✅ No sensitive credentials in the codebase
- ✅ `.env` files are gitignored (if used locally)
- ✅ Manus secrets management handles production credentials

### Environment Variables

The following environment variables are required:

```bash
NANSEN_API_KEY=your_new_nansen_api_key_here
```

Set these via:
- **Manus Platform**: Settings → Secrets panel in the Management UI
- **Local Development**: Create `.env` file (never commit this file)

## Reporting Security Issues

If you discover any security vulnerabilities, please report them immediately to the project maintainer.
