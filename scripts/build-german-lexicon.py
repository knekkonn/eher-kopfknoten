"""Build the offline lexicon from exact Wikipedia interlanguage links.

Input: JSON batches containing requested titles and MediaWiki API responses.
Each response must use redirects=1, prop=langlinks|pageprops|pageterms,
ppprop=disambiguation, wbptterms=description, lllang=de, formatversion=2.
No search result, fuzzy entity match, machine translation or disambiguation
page is used. Runtime question scopes still decide whether a sense applies.
Usage: python3 scripts/build-german-lexicon.py CACHE_DIRECTORY OUTPUT_FILE
"""
import glob
import json
import pathlib
import re
import sys
import unicodedata


def key(value):
    return unicodedata.normalize('NFC', value.replace('_', ' ')).strip().casefold()


def kind(description):
    d = description.lower()
    if re.search(r'\b(disambiguation|wikimedia list|surname|given name)\b', d):
        return None
    if re.search(r'\b(film|movie)\b', d) and not re.search(r'\b(actor|actress|director|producer|company|studio|genre)\b', d):
        return 'film'
    if re.search(r'\b(television|tv|animated|anime) (series|show|program|sitcom)\b', d):
        return 'series'
    if re.search(r'\b(fictional|superhero|comic book|cartoon) character\b|\bfictional (person|villain|superhero|robot)\b', d):
        return 'character'
    if re.search(r'\b(novel|novella|book|short story|play by|tragedy by|comedy by|epic poem)\b', d):
        return 'book'
    if re.search(r'\b(video game|board game|card game|tabletop game|party game)\b', d):
        return 'game'
    if re.search(r'\b(song|single|album|band|singer|musician|songwriter|rapper|duo|trio|quartet|record label)\b', d):
        return None
    if re.search(r'\b(actor|actress|politician|footballer|basketball player|tennis player|golfer|cricketer|athlete|racing driver|boxer|wrestler|painter|composer|physicist|scientist|mathematician|philosopher|poet|novelist|writer|journalist|historian|architect|businessman|businesswoman|entrepreneur|king of|queen of|president of|emperor of|born \d)\b', d):
        return None
    if re.search(r'\b(company|brand|corporation|manufacturer|airline|restaurant chain|retail chain|newspaper|magazine|publisher|sports team|football club|basketball team|software|programming language|operating system|website|web service|application)\b', d):
        return None
    if re.search(r'\b(language|dialect|creole|pidgin)\b', d):
        return 'language'
    if re.search(r'\b(country|state in|republic in|sovereign state|territory|island|archipelago|city|town|village|capital|municipality|province|county|geographic|mountain|river|lake|sea in|sea of|ocean|national park|desert|continent|region in|region of)\b', d):
        return 'place'
    if re.search(r'\b(species|genus|family of|subfamily|taxon|taxonomic|animal|mammal|rodent|bird|reptile|amphibian|fish|insect|arthropod|mollusc|mollusk|gastropod|spider|dinosaur|shark|whale|flowering plant|plant species|tree species|breed)\b', d):
        return 'organism'
    for category, pattern in [
        ('astronomy', r'\b(astronom|astronomical|celestial|planet|moon|star|constellation|galaxy|nebula|asteroid|comet|solar system|lunar)\b'),
        ('food', r'\b(food|dish|cuisine|dessert|cake|bread|beverage|drink|wine|beer|coffee|tea|sauce|sweet|candy|chocolate|pasta|sausage|cheese|spice|herb|fruit|vegetable|edible|cooking|noodle|culinary)\b'),
        ('body', r'\b(anatomy|anatomical|bone|muscle|nerve|organ|artery|vein|tendon|ligament|tissue|gland|hormone|protein|enzyme|body|cell|human skin)\b'),
        ('color', r'\b(colou?r|pigment|shade of|hue)\b'),
        ('material', r'\b(material|chemical|element|mineral|fabric|textile|metal|polymer|compound|alloy|gas)\b'),
        ('sport', r'\b(sport|sporting|exercise|gymnastics|fitness|weightlifting|boxing|wrestling|yoga|athletic|athletics|swimming|chess)\b'),
        ('music', r'\b(musical|instrument|music genre)\b'),
        ('clothing', r'\b(clothing|garment|footwear|headwear|hat|haircut|hairstyle|hair|jewellery|jewelry)\b'),
        ('religion', r'\b(religion|religious|holiday|festival|deity|god|goddess|christian|hindu|buddhis|jewish|islamic|biblical)\b'),
        ('math', r'\b(mathematical|mathematics|geometry|geometric|statistical|measurement|unit of)\b'),
        ('object', r'\b(tool|device|equipment|machine|appliance|utensil|implement|weapon|vehicle|furniture|chair|table|bed|building|structure|container|stationery|writing|typographical|punctuation)\b'),
    ]:
        if re.search(pattern, d):
            return category
    return None


records = {}
conflicts = set()
counts = {'batches': 0, 'requested': 0, 'ambiguousOrMissing': 0}
for filename in sorted(glob.glob(str(pathlib.Path(sys.argv[1]) / '*.json'))):
    data = json.loads(pathlib.Path(filename).read_text())
    counts['batches'] += 1
    query = data['response'].get('query', {})
    redirects = {key(row['from']): row['to'] for row in query.get('normalized', []) + query.get('redirects', [])}
    pages = {key(page['title']): page for page in query.get('pages', [])}
    for requested in data['requested']:
        counts['requested'] += 1
        title = requested
        seen = set()
        while key(title) in redirects and key(title) not in seen:
            seen.add(key(title))
            title = redirects[key(title)]
        # Redirects to a broader topic (or a section) are not exact translations.
        # Common singular/plural and punctuation-only variants are harmless.
        simple = lambda value: re.sub(r'[^\w]', '', key(value)).removeprefix('the').removesuffix('s')
        if simple(title) != simple(requested):
            counts['ambiguousOrMissing'] += 1
            continue
        page = pages.get(key(title), {})
        links = page.get('langlinks', [])
        description = ' '.join(page.get('terms', {}).get('description', []))
        label = next((row['title'] for row in links if row['lang'] == 'de'), None)
        scope = kind(description)
        if not scope or not label or 'disambiguation' in page.get('pageprops', {}) or page.get('missing') or key(requested) == key(label):
            counts['ambiguousOrMissing'] += 1
            continue
        if label.startswith(('Liste ', 'Kategorie:', 'Wikipedia:', 'Begriffsklärung')):
            continue
        record = [requested, label, scope, page['title']]
        identifier = key(requested)
        if identifier in records and records[identifier][1:] != record[1:]:
            conflicts.add(identifier)
        else:
            records[identifier] = record
for identifier in conflicts:
    records.pop(identifier, None)
rows = sorted(records.values(), key=lambda row: key(row[0]))
header = ('/* Exact English Wikipedia -> German interlanguage titles, retrieved 2026-11-04.\n'
          ' * Each row: input title, German title, meaning class, resolved English title.\n'
          ' * Source: https://en.wikipedia.org/wiki/<resolved title> (langlinks to de).\n'
          ' * Ambiguous pages, people and brands excluded; runtime applies question scopes.\n'
          ' * Rebuild: scripts/build-german-lexicon.py; titles only, no article prose. */\n')
pathlib.Path(sys.argv[2]).write_text(header + 'window.ABGRUND_GERMAN_LEXICON=[\n' + ',\n'.join(json.dumps(row, ensure_ascii=False, separators=(',', ':')) for row in rows) + '\n];\n')
print(json.dumps({**counts, 'conflicts': len(conflicts), 'labels': len(rows)}))
