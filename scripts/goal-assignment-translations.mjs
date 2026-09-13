// Reviewed distinction: painted goal colors identify fixed field ends; team
// colors identify the recipient of a goal award, independent of the end choice.
const explanation =
  'Goal colors mark field ends, not team ownership. Follow the ends chosen at the coin toss.';

const goalAssignmentTranslations = {
  sk: {
    'Attacks blue-painted goal': 'Útočí na modro natretú bránku',
    'Attacks yellow-painted goal': 'Útočí na žlto natretú bránku',
    'Attack blue-painted goal': 'Útočiť na modro natretú bránku',
    'Attack yellow-painted goal': 'Útočiť na žlto natretú bránku',
    'Award goal to Blue': 'Uznať gól modrému tímu',
    'Award goal to Yellow': 'Uznať gól žltému tímu',
    [explanation]:
      'Farby bránok označujú konce ihriska, nie príslušnosť k tímu. Riaďte sa stranami zvolenými pri hode mincou.',
  },
  de: {
    'Attacks blue-painted goal': 'Greift das blau gestrichene Tor an',
    'Attacks yellow-painted goal': 'Greift das gelb gestrichene Tor an',
    'Attack blue-painted goal': 'Blau gestrichenes Tor angreifen',
    'Attack yellow-painted goal': 'Gelb gestrichenes Tor angreifen',
    'Award goal to Blue': 'Tor für Team Blau geben',
    'Award goal to Yellow': 'Tor für Team Gelb geben',
    [explanation]:
      'Die Torfarben kennzeichnen die Spielfeldenden, nicht die Teamzugehörigkeit. Halte dich an die beim Münzwurf gewählte Seitenverteilung.',
  },
  ja: {
    'Attacks blue-painted goal': '青く塗られたゴールを攻めます',
    'Attacks yellow-painted goal': '黄色く塗られたゴールを攻めます',
    'Attack blue-painted goal': '青く塗られたゴールを攻める',
    'Attack yellow-painted goal': '黄色く塗られたゴールを攻める',
    'Award goal to Blue': '青チームの得点を認定',
    'Award goal to Yellow': '黄チームの得点を認定',
    [explanation]:
      'ゴールの色はフィールドの両端を区別するためのもので、どちらのチームのゴールかを示すものではありません。コイントスで決めたエンドに従ってください。',
  },
};

export default goalAssignmentTranslations;
