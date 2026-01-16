#!/bin/bash
# sync-templates.sh - Sync React adapters to CLI templates
#
# This script copies React adapter components to CLI templates directory.
# Templates are used by `hypoth-ui add [component] --style copy` command.
#
# Import transformations:
#   - No transformation needed for most files (they use ds-* web components)
#   - Files with @ds/primitives-dom imports are transformed to @hypoth-ui/primitives-dom
#   - Internal ../primitives/* imports are transformed to @/lib/primitives/*

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
CLI_ROOT="$(dirname "$SCRIPT_DIR")"
REACT_DIR="$CLI_ROOT/../react/src/components"
TEMPLATES_DIR="$CLI_ROOT/templates"

echo "Syncing React adapters to CLI templates..."
echo "Source: $REACT_DIR"
echo "Target: $TEMPLATES_DIR"
echo ""

# Function to transform imports in a file
transform_imports() {
  local file="$1"
  # Transform @ds/primitives-dom to @hypoth-ui/primitives-dom
  sed -i '' 's|"@ds/primitives-dom"|"@hypoth-ui/primitives-dom"|g' "$file" 2>/dev/null || \
  sed -i 's|"@ds/primitives-dom"|"@hypoth-ui/primitives-dom"|g' "$file"
  # Transform ../primitives/ to @/lib/primitives/
  sed -i '' 's|"\.\./primitives/|"@/lib/primitives/|g' "$file" 2>/dev/null || \
  sed -i 's|"\.\./primitives/|"@/lib/primitives/|g' "$file"
  # Transform ../../primitives/ to @/lib/primitives/
  sed -i '' 's|"\.\./\.\./primitives/|"@/lib/primitives/|g' "$file" 2>/dev/null || \
  sed -i 's|"\.\./\.\./primitives/|"@/lib/primitives/|g' "$file"
}

# Function to process a single component
sync_component() {
  local component="$1"
  local src_path="$REACT_DIR/$component"
  local dest_path="$TEMPLATES_DIR/$component"

  # Skip if source doesn't exist
  if [ ! -e "$src_path" ]; then
    echo "  SKIP: $component (source not found)"
    return
  fi

  # Skip if already exists (preserve manual customizations)
  if [ -d "$dest_path" ]; then
    echo "  EXISTS: $component"
    return
  fi

  mkdir -p "$dest_path"

  # Check if source is a directory or a single file
  if [ -d "$src_path" ]; then
    # Copy all .tsx files from directory
    for file in "$src_path"/*.tsx; do
      if [ -f "$file" ]; then
        local filename=$(basename "$file")
        cp "$file" "$dest_path/$filename"
        transform_imports "$dest_path/$filename"
      fi
    done
    echo "  CREATED: $component (directory)"
  else
    # Single file - look for .tsx extension
    local src_file="${src_path}.tsx"
    if [ -f "$src_file" ]; then
      local filename=$(basename "$src_file")
      cp "$src_file" "$dest_path/$filename"
      transform_imports "$dest_path/$filename"
      echo "  CREATED: $component (single file)"
    else
      echo "  SKIP: $component (no .tsx file found)"
      rmdir "$dest_path" 2>/dev/null || true
    fi
  fi
}

# List of components to sync
# Components with existing templates are skipped automatically
COMPONENTS=(
  accordion
  alert
  alert-dialog
  aspect-ratio
  avatar
  badge
  breadcrumb
  calendar
  card
  checkbox
  collapsible
  combobox
  command
  context-menu
  data-table
  date-picker
  dialog
  drawer
  dropdown-menu
  field
  file-upload
  hover-card
  icon
  input
  layout
  link
  list
  menu
  navigation-menu
  number-input
  pagination
  pin-input
  popover
  progress
  radio
  scroll-area
  select
  separator
  sheet
  skeleton
  slider
  spinner
  stepper
  switch
  table
  tabs
  tag
  text
  textarea
  time-picker
  toast
  tooltip
  tree
  visually-hidden
)

echo "Processing ${#COMPONENTS[@]} components..."
echo ""

for component in "${COMPONENTS[@]}"; do
  sync_component "$component"
done

echo ""
echo "Template sync complete!"
echo "Total templates: $(ls -d "$TEMPLATES_DIR"/*/ 2>/dev/null | wc -l | tr -d ' ')"
