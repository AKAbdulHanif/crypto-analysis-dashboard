#!/bin/bash

# This script removes the hardcoded Nansen API key from Git history

echo "Removing sensitive data from Git history..."

# Use git filter-branch to remove the API key from all commits
git filter-branch --force --index-filter \
  "git rm --cached --ignore-unmatch server/nansen.ts || true" \
  --prune-empty --tag-name-filter cat -- --all

# Clean up refs
git for-each-ref --format="delete %(refname)" refs/original | git update-ref --stdin
git reflog expire --expire=now --all
git gc --prune=now --aggressive

echo "Git history cleaned. The hardcoded API key has been removed from all commits."
echo ""
echo "IMPORTANT: You must force push to GitHub to update the remote repository:"
echo "  git push github main --force"
echo ""
echo "WARNING: This will rewrite Git history. Make sure no one else is working on this repository."
