#!/usr/bin/env python3
"""
Update imports from @/components/ui/* to @jade/ui/components (Sprint 2.3)
"""
import os
import re
from pathlib import Path

# Patterns to replace for Sprint 2.3 components
patterns = [
    # Badge
    (r"from ['\"]@/components/ui/badge['\"]", "from '@jade/ui/components'"),
    # Alert
    (r"from ['\"]@/components/ui/alert['\"]", "from '@jade/ui/components'"),
    # Label
    (r"from ['\"]@/components/ui/label['\"]", "from '@jade/ui/components'"),
    # Textarea
    (r"from ['\"]@/components/ui/textarea['\"]", "from '@jade/ui/components'"),
    # Select
    (r"from ['\"]@/components/ui/select['\"]", "from '@jade/ui/components'"),
]

def update_file(filepath):
    """Update imports in a single file"""
    try:
        with open(filepath, 'r', encoding='utf-8', errors='ignore') as f:
            content = f.read()

        original_content = content

        # Apply all replacements
        for pattern, replacement in patterns:
            content = re.sub(pattern, replacement, content)

        # Write back if changed
        if content != original_content:
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(content)
            return True
        return False
    except Exception as e:
        print(f"Error processing {filepath}: {e}")
        return False

def main():
    """Main function"""
    src_dir = Path("apps/curated/marketplace-frontend/src")

    if not src_dir.exists():
        print(f"Directory not found: {src_dir}")
        return

    updated_files = []

    # Find all TypeScript/TSX files
    for ext in ['*.ts', '*.tsx']:
        for filepath in src_dir.rglob(ext):
            if update_file(filepath):
                updated_files.append(filepath)

    print(f"Updated {len(updated_files)} files:")
    for filepath in updated_files:
        print(f"  - {filepath.relative_to(src_dir.parent.parent.parent)}")

if __name__ == "__main__":
    main()
