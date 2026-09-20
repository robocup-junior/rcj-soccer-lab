"""Index official document headings, never mirror the copyrighted rule text.

The reader embeds each full original document. The checked-in manifest of a
rule set is its navigation/coverage inventory; rerun deliberately when
reviewing a new revision.

    python scripts/sync-rulebook.py 2027
    python scripts/sync-rulebook.py 2027 --html-dir path/to/local/build

Sources are read from lib/rulesets/<id>/sources.json and the index is written
next to it. --html-dir indexes `<document id>.html` files from a directory
instead of downloading them, for example a local build of a draft branch;
documents missing from the directory are still downloaded.
"""
from argparse import ArgumentParser
from datetime import datetime, timezone
from hashlib import sha256
from html.parser import HTMLParser
from pathlib import Path
import json
import re
from urllib.request import urlopen

ROOT = Path(__file__).resolve().parents[1]


class Indexer(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.headings = []
        self.heading = None
        self.revision = ''
        self.paragraphs = 0
        self.footnotes = 0
        self.in_content = False
        self.ids = set()
        self.duplicates = set()
        self.text = []
        self.skipped = 0

    def handle_starttag(self, tag, attributes):
        attrs = dict(attributes)
        anchor = attrs.get('id', '')
        if anchor in self.ids:
            self.duplicates.add(anchor)
        if anchor:
            self.ids.add(anchor)
        if tag == 'meta' and attrs.get('name') == 'author':
            self.revision = attrs.get('content', '')
        if anchor == 'content':
            self.in_content = True
        if anchor == 'footer':
            self.in_content = False
        if anchor.startswith('_footnotedef_'):
            self.footnotes += 1
        if tag in ('script', 'style'):
            self.skipped += 1
        if self.in_content and tag == 'p':
            self.paragraphs += 1
        if self.in_content and re.fullmatch(r'h[2-6]', tag) and anchor:
            self.heading = {'anchor': anchor, 'depth': int(tag[1]) - 2, 'title': ''}

    def handle_data(self, text):
        if self.heading is not None:
            self.heading['title'] += text
        if self.in_content and not self.skipped:
            self.text.append(text)

    def handle_endtag(self, tag):
        if tag in ('script', 'style') and self.skipped:
            self.skipped -= 1
        if self.heading is not None and re.fullmatch(r'h[2-6]', tag):
            self.heading['title'] = re.sub(r'\s+', ' ', self.heading['title']).strip()
            self.headings.append(self.heading)
            self.heading = None

    def content_hash(self):
        """Body text only: the build date lives in the header and footer."""
        normalized = re.sub(r'\s+', ' ', ''.join(self.text)).strip()
        return sha256(normalized.encode('utf-8')).hexdigest()


def main():
    parser = ArgumentParser(description=__doc__.split('\n\n')[0])
    parser.add_argument('ruleset', help='rule set id, e.g. 2026')
    parser.add_argument('--html-dir', type=Path, help='index local <document id>.html files')
    parser.add_argument('--note', help='recorded in the index when it was not built from the published pages')
    arguments = parser.parse_args()

    folder = ROOT / 'lib' / 'rulesets' / arguments.ruleset
    sources = json.loads((folder / 'sources.json').read_text(encoding='utf-8'))
    if sources.get('id') != arguments.ruleset:
        raise RuntimeError(f'{folder / "sources.json"} does not describe rule set {arguments.ruleset}')

    documents = []
    sections = []
    local_documents = []
    for source in sources['documents']:
        document_id, label, url = source['id'], source['title'], source['url']
        local = arguments.html_dir / f'{document_id}.html' if arguments.html_dir else None
        if local and local.exists():
            raw = local.read_bytes()
            local_documents.append(document_id)
        else:
            raw = urlopen(url, timeout=30).read()
        html = raw.decode('utf-8')
        parser = Indexer()
        parser.feed(html)
        if not parser.headings:
            raise RuntimeError(f'No official headings found in {url}')
        document_sections = []
        chapter = 'Introduction'
        seen = {}
        for heading in parser.headings:
            original_anchor = heading['anchor']
            seen[original_anchor] = seen.get(original_anchor, 0) + 1
            anchor = original_anchor
            # Duplicate IDs in the committee scoring document resolve to the first
            # occurrence. Link later rubric entries to their verified parent.
            if document_id == 'scoring' and seen[anchor] > 1:
                anchor = 'score-criteria-and-rubrics'
            if heading['depth'] == 0:
                chapter = heading['title']
            number = re.match(r'^(\d+(?:\.\d+)*\.)\s', heading['title'])
            number = number.group(1).rstrip('.') if number else ''
            title = re.sub(r'^\d+(?:\.\d+)*\.\s+', '', heading['title'])
            item = {
                'id': f'{document_id}:{original_anchor}' + (f'-{seen[original_anchor]}' if seen[original_anchor] > 1 else ''),
                'document': document_id, 'anchor': anchor, 'title': title,
                'number': number, 'depth': heading['depth'], 'chapter': chapter,
            }
            sections.append(item)
            document_sections.append(item)
        if parser.footnotes:
            sections.append({'id': f'{document_id}:footnotes', 'document': document_id, 'anchor': 'footnotes', 'title': 'Footnotes & references', 'number': '', 'depth': 0, 'chapter': 'Footnotes & references'})
        documents.append({
            'id': document_id, 'title': label, 'url': url, 'revision': parser.revision,
            'headingCount': len(document_sections), 'paragraphCount': parser.paragraphs,
            'footnoteCount': parser.footnotes, 'sha256': sha256(raw).hexdigest(),
            'contentSha256': parser.content_hash(),
            'duplicateAnchors': sorted(parser.duplicates),
        })
        print(f'{label}: {len(document_sections)} sections, {parser.paragraphs} paragraphs, {parser.footnotes} footnotes' + (' (local file)' if document_id in local_documents else ''))

    index = {'checkedOn': datetime.now(timezone.utc).date().isoformat()}
    if arguments.note:
        index['note'] = arguments.note
    elif local_documents:
        index['note'] = 'Indexed from local files, not the published pages: ' + ', '.join(local_documents) + '.'
    index['documents'] = documents
    index['sections'] = sections
    output = folder / 'official-index.json'
    output.write_text(json.dumps(index, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
    print(f'Wrote {output.relative_to(ROOT)}')


if __name__ == '__main__':
    main()
