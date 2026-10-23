#!/usr/bin/env python3
"""Record the licenses declared by the resolved Android runtime POMs and parents."""
import argparse
import hashlib
import json
from pathlib import Path
import xml.etree.ElementTree as ET

parser = argparse.ArgumentParser()
parser.add_argument('resolved_artifacts', type=Path)
parser.add_argument('gradle_cache', type=Path)
args = parser.parse_args()
cache = args.gradle_cache / 'caches/modules-2/files-2.1'

def licenses(group, name, version, seen=None):
    seen = set() if seen is None else seen
    coordinate = f'{group}:{name}:{version}'
    if coordinate in seen:
        return [], None
    seen.add(coordinate)
    files = list((cache / group / name / version).glob('*/*.pom'))
    if not files:
        return [], None
    pom = files[0]
    tree = ET.parse(pom)
    for element in tree.iter():
        element.tag = element.tag.rsplit("}", 1)[-1]
    declared = [{'name': e.findtext('name'),
                 'url': e.findtext('url')}
                for e in tree.findall('licenses/license')]
    evidence = {'coordinate': coordinate, 'pomSha256': hashlib.sha256(pom.read_bytes()).hexdigest()}
    if declared:
        return declared, evidence
    parent = tree.find('parent')
    if parent is not None:
        values = [parent.findtext(field) for field in ['groupId','artifactId','version']]
        if all(values) and not any('${' in v for v in values):
            return licenses(*values, seen=seen)
    return [], evidence

rows = json.loads(args.resolved_artifacts.read_text())
for row in rows:
    row['licenses'], row['evidence'] = licenses(row['group'], row['name'], row['version'])
report = {'scope': 'Resolved releaseRuntimeClasspath artifact POM license declarations; inherited licenses followed through cached parents',
          'unresolvedDeclarations': [f"{r['group']}:{r['name']}:{r['version']}" for r in rows if not r['licenses']],
          'artifacts': rows}
output = Path(__file__).resolve().parent / 'reports/maven-runtime-licenses.json'
output.write_text(json.dumps(report, ensure_ascii=False, indent=2)+'\n')
print(f"{len(rows)} runtime artifacts; {len(report['unresolvedDeclarations'])} POM license declarations unresolved")
