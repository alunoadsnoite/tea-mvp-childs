#!/usr/bin/env python3
"""Remove unused npm prebuilts before the F-Droid source scanner runs.

Run after npm ci, before expo prebuild. Hermes Linux compiler is retained under
F-Droid's explicit official-Hermes exception; its exact path is in scanignore.
"""
from pathlib import Path
import shutil

root = Path(__file__).resolve().parent.parent
modules = root / 'node_modules'
if not (modules / 'react-native/package.json').is_file():
    raise SystemExit('Run npm ci before fdroid/prepare.py')
# Hermes is selected in the generated gradle.properties. Keep the JSC package
# manifest (some autolinking scripts resolve it), but never its unused AARs.
for relative in ['jsc-android/dist', 'react-native/sdks/hermesc/osx-bin',
                 'react-native/sdks/hermesc/win64-bin']:
    path = modules / relative
    if path.exists():
        shutil.rmtree(path)
        print(f'Removed unused prebuilt: {relative}')
# Packages may ship example/test Gradle wrappers. None is the app build tool.
for path in modules.rglob('gradle-wrapper.jar'):
    path.unlink()
    print(f'Removed unused wrapper: {path.relative_to(root)}')
