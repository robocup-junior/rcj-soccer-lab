// Reviewed translations for everything that depends on the rules version:
// the version selector, the Version comparison tab, each season's change list
// and each season's learning situations.
//
// One file per concern lives in ./ruleset-translations/. A new season adds its
// own changes-<season>.mjs and learning-<season>.mjs and lists them here; see
// docs/adding-a-rules-version.md.
import interfaceRows from './ruleset-translations/interface.mjs';
import changes2027 from './ruleset-translations/changes-2027.mjs';
import learning2027 from './ruleset-translations/learning-2027.mjs';

const LOCALES = ['sk', 'de', 'ja'];
const ROW_FILES = {
  'interface.mjs': interfaceRows,
  'changes-2027.mjs': changes2027,
  'learning-2027.mjs': learning2027,
};

/**
 * The catalog generator adds a Blue <-> Yellow mirror of every phrase, because
 * drills are replayed with swapped teams. Reviewed rows are written once and
 * mirrored here with the same rule, so both variants read alike.
 */
const TEAM_WORDS = {
  en: [['Blue', 'Yellow']],
  // Robot names stay English; team adjectives share their endings.
  sk: [
    ['Blue', 'Yellow'],
    ['Modr', 'Žlt'],
    ['modr', 'žlt'],
  ],
  de: [
    ['Blue', 'Yellow'],
    ['Blau', 'Gelb'],
    ['blau', 'gelb'],
  ],
  ja: [
    ['Blue', 'Yellow'],
    ['青', '黄'],
  ],
};

function mirror(text, language) {
  let output = text;
  TEAM_WORDS[language].forEach(([first, second], index) => {
    const hold = `\u0000${index}\u0000`;
    output = output
      .replaceAll(first, hold)
      .replaceAll(second, first)
      .replaceAll(hold, second);
  });
  return output;
}

const placeholders = (text) =>
  [...text.matchAll(/\{(\d+)\}/g)]
    .map((match) => Number(match[1]))
    .sort((a, b) => a - b)
    .join(',');

const rulesetTranslations = { sk: {}, de: {}, ja: {} };

function add(file, source, translations) {
  LOCALES.forEach((locale, index) => {
    const translated = translations[index];
    const known = rulesetTranslations[locale][source];
    if (known !== undefined && known !== translated)
      throw new Error(
        `${file}: "${source}" has two different ${locale} translations.`,
      );
    if (placeholders(source) !== placeholders(translated))
      throw new Error(`${file}: placeholders differ in ${locale}: "${source}"`);
    rulesetTranslations[locale][source] = translated;
  });
}

for (const [file, rows] of Object.entries(ROW_FILES)) {
  for (const row of rows) {
    if (
      !Array.isArray(row) ||
      row.length !== 4 ||
      row.some((cell) => typeof cell !== 'string' || !cell.trim())
    )
      throw new Error(
        `${file}: every row needs English, Slovak, German and Japanese text: ${JSON.stringify(row)}`,
      );
    const [source, ...translations] = row;
    add(file, source, translations);
    const mirroredSource = mirror(source, 'en');
    if (mirroredSource !== source)
      add(
        file,
        mirroredSource,
        translations.map((text, index) => mirror(text, LOCALES[index])),
      );
  }
}

export default rulesetTranslations;
