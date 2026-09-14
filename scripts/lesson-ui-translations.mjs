// Reviewed learning UI copy. Recorded/answered labels do not imply a correct
// answer, and reviewing an explanation never changes a certification result.
const rows = [
  [
    'Acceptable referee decision',
    'Prípustné rozhodnutie rozhodcu',
    'Zulässige Schiedsrichterentscheidung',
    '許容される判定',
  ],
  ['Incorrect answer', 'Nesprávna odpoveď', 'Falsche Antwort', '不正解'],
  [
    'Watch explained replay',
    'Pozrieť záznam s vysvetlením',
    'Wiederholung mit Erklärung ansehen',
    '解説付きリプレイを見る',
  ],
  [
    'Guided practice: the explanation is visible. This is not an unaided answer.',
    'Riadené precvičovanie: vysvetlenie je zobrazené. Nejde o odpoveď bez pomoci.',
    'Angeleitetes Üben: Die Erklärung ist sichtbar. Diese Antwort wird nicht ohne Hilfe gegeben.',
    '解説を見ながらの練習です。解説が表示されているため、これは助けなしで答えた回答ではありません。',
  ],
  [
    'Observe the robots and ball.',
    'Pozorujte roboty a loptičku.',
    'Beobachte die Roboter und den Ball.',
    'ロボットとボールを観察してください。',
  ],
  [
    'Use the setup described above to make your decision.',
    'Pri rozhodovaní vychádzajte zo situácie opísanej vyššie.',
    'Triff deine Entscheidung anhand der oben beschriebenen Ausgangssituation.',
    '上に説明された状況をもとに判定してください。',
  ],
  [
    'Watch up to the decision point. The explanation appears after your answer.',
    'Sledujte situáciu až po okamih rozhodnutia. Vysvetlenie sa zobrazí po vašej odpovedi.',
    'Sieh dir die Szene bis zum Entscheidungspunkt an. Die Erklärung erscheint nach deiner Antwort.',
    '判定する場面まで見てください。解説は回答後に表示されます。',
  ],
  [
    'Your answer is already recorded for this certification round. Reviewing the explanation will not change it.',
    'Vaša odpoveď je už zaznamenaná pre toto certifikačné kolo. Prezretie vysvetlenia ju nezmení.',
    'Deine Antwort für diese Zertifizierungsrunde ist bereits gespeichert. Das Ansehen der Erklärung ändert sie nicht.',
    'この認定ラウンドでの回答はすでに記録されています。解説を確認しても回答は変わりません。',
  ],
  [
    'Your first answer is recorded. Reviewing the explanation will not change your score.',
    'Vaša prvá odpoveď je zaznamenaná. Prezretie vysvetlenia nezmení vaše skóre.',
    'Deine erste Antwort ist gespeichert. Das Ansehen der Erklärung ändert deine Punktzahl nicht.',
    '最初の回答が記録されています。解説を確認しても得点は変わりません。',
  ],
  [
    'You can try again for practice.',
    'V rámci precvičovania to môžete skúsiť znova.',
    'Zum Üben kannst du es noch einmal versuchen.',
    '練習としてもう一度挑戦できます。',
  ],
  [
    'Questions answered',
    'Zodpovedané otázky',
    'Beantwortete Fragen',
    '回答済みの問題',
  ],
  [
    'Answer recorded',
    'Odpoveď zaznamenaná',
    'Antwort gespeichert',
    '回答を記録済み',
  ],
  [
    'questions answered',
    'zodpovedané otázky',
    'beantwortete Fragen',
    '回答済みの問題',
  ],
  [
    'All questions answered',
    'Všetky otázky sú zodpovedané',
    'Alle Fragen beantwortet',
    'すべての問題に回答済み',
  ],
  [
    'Select a certification question from the list.',
    'Vyberte si zo zoznamu certifikačnú otázku.',
    'Wähle eine Zertifizierungsfrage aus der Liste.',
    'リストから認定用の問題を選んでください。',
  ],
  ['Question {0}', 'Otázka {0}', 'Frage {0}', '問題{0}'],
];

const lessonUiTranslations = Object.fromEntries(
  ['sk', 'de', 'ja'].map((locale, index) => [
    locale,
    Object.fromEntries(rows.map((row) => [row[0], row[index + 1]])),
  ]),
);

export default lessonUiTranslations;
