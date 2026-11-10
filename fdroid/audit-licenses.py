#!/usr/bin/env python3
"""Inventory npm lockfile license declarations, including build/optional packages.
This is evidence for review, not a substitute for reviewing bundled native code.
"""
import hashlib
import json
from pathlib import Path

root = Path(__file__).resolve().parent.parent
lock = json.loads((root / 'package-lock.json').read_text())
# Reviewed against the installed package's LICENSE, not inferred from its name.
overrides = {
    '@segment/loosely-validate-event': 'MIT',
    'qrcode-terminal': 'Apache-2.0',
    'requireg': 'MIT',
    'valid-url': 'MIT',
}
rows = []
for path, entry in sorted(lock['packages'].items()):
    if not path:
        continue
    name = path.split('node_modules/')[-1]
    declared = entry.get('license') or overrides.get(name)
    evidence = []
    directory = root / path
    if directory.is_dir():
        for file in sorted(directory.iterdir()):
            if file.is_file() and ('license' in file.name.lower() or file.name.lower().startswith('copying')):
                evidence.append({'file': str(file.relative_to(root)), 'sha256': hashlib.sha256(file.read_bytes()).hexdigest()})
    rows.append({'path': path, 'version': entry.get('version'), 'license': declared,
                 'dev': entry.get('dev', False), 'optional': entry.get('optional', False),
                 'licenseFiles': evidence})
missing = [r['path'] for r in rows if not r['license']]
report = {'scope': 'npm lockfile including tooling and platform-optional dependencies',
          'lockfileSha256': hashlib.sha256((root / 'package-lock.json').read_bytes()).hexdigest(),
          'manualLicenseFallbacks': overrides, 'missingDeclarations': missing, 'packages': rows}
(root / 'fdroid/reports/npm-licenses.json').write_text(json.dumps(report, ensure_ascii=False, indent=2)+'\n')
print(f'{len(rows)} npm packages; {len(missing)} unresolved license declarations')
if missing:
    raise SystemExit(1)
