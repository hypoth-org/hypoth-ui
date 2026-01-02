#!/bin/bash
# CI Validation Script for Design Tokens
# Validates token compilation and checks for changes

set -e

echo "🎨 Validating design tokens..."

# Run token build
echo "📦 Building tokens..."
pnpm --filter @ds/tokens build

# Check if dist files changed
echo "🔍 Checking for uncommitted changes..."
if git diff --exit-code dist/ > /dev/null 2>&1; then
  echo "✅ Token outputs are up to date"
else
  echo "❌ Token outputs have changed. Please run 'pnpm --filter @ds/tokens build' and commit the changes."
  echo ""
  echo "Changed files:"
  git diff --name-only dist/
  exit 1
fi

# Validate tokensUsed references
echo "🔗 Validating tokensUsed references..."
pnpm --filter @ds/docs-core validate:tokens || {
  echo "❌ Token validation failed"
  exit 1
}

echo "✅ All token validations passed!"
