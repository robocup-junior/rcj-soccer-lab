// Reviewed translations for decision-focused clip questions and neutral assessment context.
// Preserve the distinction between scoring and conceding, referee discretion,
// the opponent-violation exception, and nearest versus furthest neutral spots.
const clipQuestionTranslations = {
  sk: {
    'Blue kicked off in the first half. Which team should you give the second-half kickoff to?':
      'Modrý tím začínal prvý polčas výkopom. Ktorému tímu pridelíte výkop v druhom polčase?',
    'Yellow, after the teams switch sides': 'Žltému tímu po výmene strán',
    'Blue again, after the teams switch sides':
      'Znovu modrému tímu po výmene strán',
    'The teams switch sides at half-time. The team that did not kick off in the first half takes the second-half kickoff.':
      'Cez prestávku si tímy vymenia strany. Druhý polčas začína výkopom tím, ktorý nezačínal prvý polčas.',
    'Blue took the first-half kickoff. The first half has ended; prepare the second-half restart.':
      'Prvý polčas začínal výkopom modrý tím. Polčas sa skončil; pripravte začiatok druhého polčasu.',
    'Yellow is late for the start. How should you apply the late-arrival goal penalty?':
      'Žltý tím mešká na začiatok zápasu. Ako uplatníte gólový trest za meškanie?',
    'Award Blue a goal every 30 seconds automatically':
      'Automaticky pridám modrému tímu gól každých 30 sekúnd',
    'Decide whether to award Blue a goal for each 30 seconds of lateness':
      'Rozhodnem, či za každých 30 sekúnd meškania pridelím modrému tímu gól',
    'The referee may penalize late arrival by one goal per 30 seconds. This penalty is discretionary, not automatic.':
      'Rozhodca môže za meškanie udeliť jeden gól za každých 30 sekúnd. Tento trest závisí od jeho uváženia; nie je automatický.',
    'Blue is present. Yellow has not arrived for the scheduled start; 30 seconds of lateness have elapsed.':
      'Modrý tím je prítomný. Žltý tím neprišiel na plánovaný začiatok; mešká už 30 sekúnd.',
    'Blue wins the toss and chooses which goal to attack. What should you give Yellow?':
      'Modrý tím vyhrá hod mincou a vyberie si bránku, na ktorú bude útočiť. Čo pridelíte žltému tímu?',
    'The first kickoff': 'Prvý výkop',
    'The choice of goal, leaving the first kickoff to Blue':
      'Výber bránky; prvý výkop zostane modrému tímu',
    'The toss winner chooses either the first kickoff or which goal to attack. The other team gets the remaining choice.':
      'Víťaz hodu mincou si vyberá buď prvý výkop, alebo bránku, na ktorú bude útočiť. Druhému tímu pripadne zostávajúca možnosť.',
    'Blue wins the coin toss and chooses to attack the blue-painted goal.':
      'Modrý tím vyhrá hod mincou a vyberie si útok na modro natretú bránku.',
    'Blue wins the toss and takes the first kickoff. Who should choose which goal Yellow will attack?':
      'Modrý tím vyhrá hod mincou a vyberie si prvý výkop. Kto vyberie bránku, na ktorú bude útočiť žltý tím?',
    'Blue chooses both the kickoff and the goals':
      'Modrý tím si vyberie výkop aj bránky',
    'Yellow chooses which goal it will attack':
      'Žltý tím si vyberie bránku, na ktorú bude útočiť',
    'Choosing the first kickoff leaves the choice of goal to the other team. Goal paint identifies the field end, not its defending team.':
      'Po výbere prvého výkopu pripadne výber bránky druhému tímu. Náter bránky označuje koniec ihriska, nie tím, ktorý ju bráni.',
    'Blue wins the coin toss and chooses to kick off first. The teams have not yet chosen their goals.':
      'Modrý tím vyhrá hod mincou a vyberie si prvý výkop. Tímy si ešte nevybrali bránky.',
    'All robots are correctly placed and stopped. When should you allow them to start?':
      'Všetky roboty sú správne umiestnené a stoja. Kedy im dovolíte začať?',
    'As soon as the last robot is placed':
      'Hneď po umiestnení posledného robota',
    "Together, on the referee's start signal":
      'Spoločne na štartovací signál rozhodcu',
    'Correct placement does not start play. All robots remain stopped until the referee gives the start signal.':
      'Správnym rozostavením sa hra nezačína. Všetky roboty zostávajú stáť až do štartovacieho signálu rozhodcu.',
    'Blue will kick off. All robots are stopped on their own halves; Yellow is outside the 30 cm center circle. No start signal has been given.':
      'Výkop má modrý tím. Všetky roboty stoja na svojich poloviciach; žlté sú mimo stredového kruhu s polomerom 30 cm. Signál ešte nezaznel.',
    'Blue 1 moves before your kickoff signal. What should you do?':
      'Modrý 1 sa pohne pred vaším signálom na výkop. Čo urobíte?',
    'Remove Blue 1 and deem it damaged':
      'Odstránim Modrého 1 a označím ho za poškodeného',
    'Return Blue 1 to its starting position without removal':
      'Vrátim Modrého 1 na štartovacie miesto bez odstránenia z ihriska',
    "A robot started before the referee's command is removed and deemed damaged. This applies to the robot that started early.":
      'Robot spustený pred pokynom rozhodcu sa odstráni a považuje za poškodený. Týka sa to robota, ktorý sa spustil predčasne.',
    'The robots are waiting for kickoff. Blue 1 moves; the referee has not given the start signal.':
      'Roboty čakajú na výkop. Modrý 1 sa pohne, hoci rozhodca ešte nedal štartovací signál.',
    'You are setting up a neutral kickoff. Which robots must be at least 30 cm from the ball?':
      'Pripravujete neutrálny výkop. Ktoré roboty musia byť aspoň 30 cm od lopty?',
    'Only the team that did not take the previous kickoff':
      'Iba tím, ktorý nemal predchádzajúci výkop',
    'All four robots': 'Všetky štyri roboty',
    'At a neutral kickoff, every robot must be at least 30 cm from the ball. Neither team has the normal kickoff exception.':
      'Pri neutrálnom výkope musí byť každý robot aspoň 30 cm od lopty. Ani jeden tím nemá výnimku bežného výkopu.',
    'The ball is at the center for a neutral kickoff. Both teams are stopped on their own halves.':
      'Lopta je v strede na neutrálny výkop. Oba tímy stoja na svojich poloviciach.',
    'At this neutral kickoff, Blue 1 is inside the 30 cm exclusion circle. What should you do before starting?':
      'Pri tomto neutrálnom výkope je Modrý 1 v 30 cm ochrannom kruhu. Čo urobíte pred začiatkom?',
    'Request a position correction before the start signal':
      'Pred štartovacím signálom požiadam o opravu rozostavenia',
    'Allow the position because Blue took the previous kickoff':
      'Polohu povolím, pretože predchádzajúci výkop mal modrý tím',
    'All robots must be at least 30 cm from the ball at a neutral kickoff. The referee can require an incorrect placement to be corrected.':
      'Pri neutrálnom výkope musia byť všetky roboty aspoň 30 cm od lopty. Rozhodca môže požadovať opravu nesprávneho rozostavenia.',
    'This is a neutral kickoff. Blue 1 is inside the 30 cm circle around the centered ball; no start signal has been given.':
      'Ide o neutrálny výkop. Modrý 1 je v kruhu s polomerom 30 cm okolo lopty v strede; štartovací signál ešte nezaznel.',
    'The ball crosses the goal mouth and then touches the inside back wall. When should you count the goal?':
      'Lopta prejde ústím bránky a potom sa dotkne vnútornej zadnej steny. Kedy započítate gól?',
    'As soon as the ball crosses the goal mouth':
      'Hneď ako lopta prejde ústím bránky',
    'When the ball touches the inside back wall':
      'Keď sa lopta dotkne vnútornej zadnej steny',
    "Crossing the goal mouth alone is insufficient. Back-wall contact scores for the team attacking that goal, followed by the conceding team's kickoff.":
      'Samotný prechod ústím bránky nestačí. Dotyk zadnej steny znamená gól pre útočiaci tím; nasleduje výkop tímu, ktorý inkasoval.',
    'Blue attacks the goal defended by Yellow. Compare the ball crossing the mouth with its later contact with the inside back wall.':
      'Modrý tím útočí na bránku bránenú žltým tímom. Porovnajte prechod lopty ústím s neskorším dotykom vnútornej zadnej steny.',
    'The ball hits the front of the post and returns to the field. What should you decide?':
      'Lopta zasiahne prednú časť žrde a vráti sa na ihrisko. Ako rozhodnete?',
    'Award Blue a goal because the ball touched the goal structure':
      'Pridelím modrému tímu gól, pretože lopta zasiahla konštrukciu bránky',
    'Keep the score unchanged because there was no back-wall contact':
      'Skóre nezmením, pretože sa lopta nedotkla zadnej steny',
    "A post deflection without contact with the goal's back wall does not score. Keep the score unchanged.":
      'Odraz od žrde bez dotyku zadnej steny bránky nie je gól. Skóre zostáva nezmenené.',
    'Blue attacks the goal defended by Yellow. The ball strikes the front of the post and rebounds into the field.':
      'Modrý tím útočí na bránku bránenú žltým tímom. Lopta zasiahne prednú časť žrde a odrazí sa späť na ihrisko.',
    "Blue last touches the ball before it hits the back wall of the goal Blue defends. Which team's score should you increase by one goal?":
      'Modrý tím sa dotkne lopty ako posledný a tá zasiahne zadnú stenu bránky, ktorú modrý tím bráni. Ktorému tímu zvýšite skóre o jeden gól?',
    "Blue — add one to Blue's score": 'Modrému tímu — pridám gól modrému tímu',
    "Yellow — add one to Yellow's score":
      'Žltému tímu — pridám gól žltému tímu',
    "Award Yellow the goal and give Blue the kickoff. A defender's last touch does not change which team scores at that goal.":
      'Gól pridelíte žltému tímu a výkop modrému. Posledný dotyk obrancu nemení tím, ktorému patrí gól na tomto konci ihriska.',
    "Blue defends the blue-painted goal in this scene. Blue 1 makes the last touch, sending the ball toward that goal's inside back wall.":
      'V tejto scéne modrý tím bráni modro natretú bránku. Modrý 1 sa dotkne lopty ako posledný a pošle ju k jej vnútornej zadnej stene.',
    'Blue uses a backspin dribbler while Yellow can challenge the ball. Should you call ball holding on this evidence?':
      'Modrý tím používa driblér so spätnou rotáciou a žltý tím môže bojovať o loptu. Odpískate na základe tohto dôkazu držanie lopty?',
    'No; the rotating ball remains accessible to the opponent':
      'Nie; rotujúca lopta zostáva prístupná súperovi',
    'Yes; keeping the ball against a dribbler is always holding':
      'Áno; udržiavanie lopty pri dribléri je vždy držanie',
    'A rotating dribbler may use dynamic backspin to retain the ball, but opponents must still be able to access it. This scene shows that access.':
      'Rotujúci driblér môže udržiavať loptu dynamickou spätnou rotáciou, ale súper k nej musí mať prístup. Táto scéna tento prístup ukazuje.',
    'Blue moves with a rotating backspin dribbler. Yellow challenges from the side and the ball comes free.':
      'Modrý tím sa pohybuje s rotujúcim driblérom so spätnou rotáciou. Žltý tím napadne loptu zboku a lopta sa uvoľní.',
    'The ball stays fixed to Blue while it moves, and Yellow cannot free it. What should you investigate?':
      'Lopta zostáva pevne pri pohybujúcom sa modrom robotovi a žltý tím ju nedokáže uvoľniť. Čo preveríte?',
    'A ball-holding mechanism that prevents opponent access':
      'Mechanizmus držania lopty, ktorý bráni prístupu súpera',
    'A legal dribbler solely because the ball is in front of the robot':
      'Povolený driblér iba preto, že lopta je pred robotom',
    'A ball fixed to the moving robot and inaccessible to opponents indicates trapping, not the backspin-dribbler exception. Inspect the mechanism; the animation is illustrative.':
      'Lopta pevne spojená s pohybujúcim sa robotom a neprístupná súperom naznačuje zachytenie, nie výnimku pre driblér so spätnou rotáciou. Skontrolujte mechanizmus; animácia je ilustračná.',
    "The ball does not roll as Blue moves. Yellow's side challenge cannot free it. The mechanism itself is represented schematically.":
      'Lopta sa pri pohybe modrého robota neodvaľuje. Bočný súboj žltého robota ju neuvoľní. Samotný mechanizmus je znázornený schematicky.',
    'Blue 1 kicks the ball over the field wall. Which robot should you remove as damaged?':
      'Modrý 1 vykopne loptu ponad stenu ihriska. Ktorého robota odstránite ako poškodeného?',
    'Blue 1, which sent the ball out': 'Modrého 1, ktorý poslal loptu von',
    'Yellow 1, the opponent nearest the ball':
      'Žltého 1, súpera najbližšie k lopte',
    'The robot that sends the ball beyond the field walls or above their height is deemed damaged. Here that robot is Blue 1.':
      'Robot, ktorý pošle loptu za steny ihriska alebo nad ich výšku, sa považuje za poškodeného. Tu je to Modrý 1.',
    'Blue 1 makes the kick. The ball rises above the 22 cm wall and leaves the enclosure.':
      'Kope Modrý 1. Lopta vystúpi nad stenu vysokú 22 cm a opustí ohraničenie ihriska.',
    'You are checking an unobstructed robot in its own half. Which ball-moving ability must it demonstrate?':
      'Kontrolujete robota na jeho vlastnej polovici bez prekážania súperom. Akú schopnosť pohybu lopty musí preukázať?',
    'Moving the ball from its nearest neutral spot into the opposing half':
      'Presun lopty z najbližšieho neutrálneho bodu na súperovu polovicu',
    'Moving the ball off the spot is enough, even if it stays in its own half':
      'Stačí posunúť loptu mimo bodu, aj keď zostane na vlastnej polovici',
    'An unobstructed robot must approach and touch a ball at the nearest neutral spot and be able to move it from its own half to the opposing half.':
      'Robot bez prekážania musí pristúpiť k lopte na najbližšom neutrálnom bode, dotknúť sa jej a vedieť ju presunúť zo svojej polovice na súperovu.',
    'Blue starts in its own half beside the nearest neutral spot. No opponent blocks its view of the ball or its movement.':
      'Modrý robot začína na svojej polovici pri najbližšom neutrálnom bode. Žiadny súper mu nebráni vo výhľade na loptu ani v pohybe.',
    'You call pushing in this penalty-area incident. What should you relocate?':
      'V tomto incidente v pokutovom území odpískate tlačenie. Čo premiestnite?',
    'The ball, to the furthest unoccupied neutral spot':
      'Loptičku na najvzdialenejší neobsadený neutrálny bod',
    'The defender farther from the ball, leaving the ball in place':
      'Obrancu vzdialenejšieho od lopty; loptu nechám na mieste',
    'Resolving a pushing call moves the ball to the furthest unoccupied neutral spot. Moving the farther defender is the separate multiple-defense procedure.':
      'Pri tlačení sa lopta presunie na najvzdialenejší neobsadený neutrálny bod. Presun vzdialenejšieho obrancu je osobitný postup pri viacnásobnej obrane.',
    'The opponents touch while Blue partly overlaps the penalty area and the ball is in contact. You judge this contact to be pushing.':
      'Súperi sa dotýkajú, modrý robot čiastočne zasahuje do pokutového územia a je prítomný kontakt s loptou. Tento kontakt posúdite ako tlačenie.',
    'The opponents touch each other and the ball at midfield. Does this alone justify the penalty-area pushing call?':
      'Súperi sa navzájom dotýkajú a majú kontakt s loptou v strede ihriska. Stačí to samo osebe na odpískanie tlačenia podľa pravidla pokutového územia?',
    'Yes; opponent contact with the ball is enough anywhere':
      'Áno; kontakt súperov s loptou stačí kdekoľvek',
    'No; neither robot is even partly inside a penalty area':
      'Nie; ani jeden robot nie je ani čiastočne v pokutovom území',
    'The penalty-area pushing rule requires at least one robot to be partly inside a penalty area. Midfield contact alone does not meet that condition; assess other infringements separately.':
      'Pravidlo tlačenia v pokutovom území vyžaduje, aby aspoň jeden robot bol aspoň čiastočne v pokutovom území. Kontakt v strede ihriska sám nestačí; iné priestupky posudzujte osobitne.',
    'Both robots and the contested ball are at midfield, outside both penalty areas. No other infringement is established in this example.':
      'Oba roboty aj lopta, o ktorú bojujú, sú v strede ihriska mimo oboch pokutových území. V tomto príklade nie je preukázaný iný priestupok.',
    'Both Blue robots partly overlap the penalty area. Which one should you move to the furthest unoccupied neutral spot?':
      'Oba modré roboty čiastočne zasahujú do pokutového územia. Ktorý presuniete na najvzdialenejší neobsadený neutrálny bod?',
    'Blue 1, which is nearer the ball': 'Modrého 1, ktorý je bližšie k lopte',
    'Blue 2, which is farther from the ball':
      'Modrého 2, ktorý je ďalej od lopty',
    'For two same-team robots partly inside a penalty area, move the one farther from the ball. Here that is Blue 2.':
      'Ak sú dva roboty toho istého tímu čiastočne v pokutovom území, presunie sa ten vzdialenejší od lopty. Tu je to Modrý 2.',
    'The ball stays beside Blue 1 as Blue 2 enters the same penalty area. Neither robot is fully inside; no pushing is being called.':
      'Lopta zostáva pri Modrom 1, zatiaľ čo Modrý 2 vstupuje do rovnakého pokutového územia. Ani jeden nie je úplne vnútri; tlačenie sa nepíska.',
    'You call pushing while two Blue robots also partly overlap the penalty area. Which correction should you make first?':
      'Odpískate tlačenie a zároveň oba modré roboty čiastočne zasahujú do pokutového územia. Ktorú nápravu vykonáte ako prvú?',
    'Move the farther Blue defender, then relocate the ball':
      'Presuniem vzdialenejšieho modrého obrancu a potom loptu',
    'Resolve pushing by relocating the ball, then reassess multiple defense':
      'Vyriešim tlačenie presunom lopty a potom znovu posúdim viacnásobnú obranu',
    'Resolve pushing first. After moving the ball, reassess which defender is farther from its new position before resolving multiple defense.':
      'Najprv vyriešte tlačenie. Po presune lopty znova určite, ktorý obranca je od jej novej polohy vzdialenejší, a potom vyriešte viacnásobnú obranu.',
    'Pushing and multiple defense occur together. The ball is beside Blue 2 before either correction has been made.':
      'Tlačenie a viacnásobná obrana nastanú súčasne. Pred vykonaním nápravy je lopta pri Modrom 2.',
    'You judge that this goal resulted from pushing. Should you award it?':
      'Usúdite, že tento gól vznikol následkom tlačenia. Uznáte ho?',
    'Award the goal, then make the pushing correction':
      'Uznám gól a potom vykonám nápravu tlačenia',
    'Disallow the goal and resolve the pushing call':
      'Gól neuznám a vyriešim odpískané tlačenie',
    'A goal caused by a pushing situation is not granted. Resolve the pushing call by moving the ball to the furthest unoccupied neutral spot.':
      'Gól spôsobený tlačením sa neuzná. Tlačenie vyriešte presunom lopty na najvzdialenejší neobsadený neutrálny bod.',
    "In Blue's penalty area, you call pushing. You judge that this contact caused the ball to reach Blue's goal back wall.":
      'V pokutovom území modrého tímu odpískate tlačenie. Usúdite, že práve tento kontakt poslal loptu na zadnú stenu bránky modrého tímu.',
    'After your visible and loud count, this stationary contest is still unlikely to change. What should you do?':
      'Po vašom viditeľnom a hlasnom počítaní sa stojaci súboj stále pravdepodobne nezmení. Čo urobíte?',
    'Move the ball to the furthest unoccupied neutral spot':
      'Presuniem loptu na najvzdialenejší neobsadený neutrálny bod',
    'Call lack of progress and move the ball to the nearest unoccupied neutral spot':
      'Odpískam nedostatok pokroku a presuniem loptu na najbližší neobsadený neutrálny bod',
    "After the count, unresolved lack of progress is restarted at the nearest unoccupied neutral spot. The animation's count is illustrative, not a universal three-second deadline.":
      'Po počítaní sa nevyriešený nedostatok pokroku rieši presunom na najbližší neobsadený neutrálny bod. Počítanie v animácii je ilustračné, nie univerzálna trojsekundová lehota.',
    'The ball remains trapped between stationary opponents. The referee has counted visibly and aloud, and play has not progressed.':
      'Lopta zostáva zovretá medzi stojacimi súpermi. Rozhodca viditeľne a nahlas počítal, no hra nepokročila.',
    'The first neutral placement has not restored play. What may you do after reassessing lack of progress?':
      'Prvé premiestnenie na neutrálny bod neobnovilo hru. Čo môžete urobiť po opätovnom posúdení nedostatku pokroku?',
    'Call it again and use a different neutral spot':
      'Odpískať ho znova a použiť iný neutrálny bod',
    'Repeat the placement at the same spot until a robot responds':
      'Opakovať umiestnenie na ten istý bod, kým robot nezareaguje',
    'If the first relocation does not resolve lack of progress, the referee may call it again and move the ball to a different neutral spot.':
      'Ak prvý presun nevyrieši nedostatok pokroku, rozhodca ho môže odpískať znova a presunúť loptu na iný neutrálny bod.',
    'The ball has already been moved to one neutral spot. The robots still do not respond, and the situation is unlikely to change.':
      'Lopta už bola presunutá na jeden neutrálny bod. Roboty stále nereagujú a situácia sa pravdepodobne nezmení.',
    'Blue 1 touches the physical wall without being pushed by an opponent. What should you call?':
      'Modrý 1 sa dotkne fyzickej steny bez zatlačenia súperom. Čo odpískate?',
    'Out of bounds: remove Blue 1 for one minute':
      'Mimo ihriska: odstránim Modrého 1 na jednu minútu',
    'Play on: only leaving the enclosure counts as out of bounds':
      'Pokračovanie hry: mimo ihriska znamená až opustenie ohraničenia',
    'Wall contact is out of bounds. The one-minute penalty starts at removal; the match clock continues, and a kickoff can permit an earlier return.':
      'Dotyk steny znamená priestupok mimo ihriska. Jednominútový trest začína odstránením; čas zápasu pokračuje a výkop môže umožniť skorší návrat.',
    'Blue 1 reaches the physical wall under its own movement. No opponent is touching or pushing it.':
      'Modrý 1 vlastným pohybom dosiahne fyzickú stenu. Žiadny súper sa ho nedotýka ani ho netlačí.',
    'Blue 1 moves from partial overlap to fully inside the penalty area. Which position requires an out-of-bounds call?':
      'Modrý 1 sa presunie z čiastočného prekrytia úplne do pokutového územia. Ktorá poloha vyžaduje odpískanie priestupku mimo ihriska?',
    'The initial partial overlap by Blue 1 alone':
      'Už počiatočné čiastočné prekrytie samotným Modrým 1',
    "The later position with Blue 1's entire footprint inside":
      'Neskoršia poloha s celým pôdorysom Modrého 1 vnútri',
    'A robot fully inside a penalty area is out of bounds. Partial overlap by one robot alone is not that offense; the marked white line is part of the area.':
      'Robot úplne v pokutovom území je mimo ihriska. Čiastočné prekrytie jedným robotom samo osebe nie je týmto priestupkom; vyznačená biela čiara patrí do územia.',
    'Blue 1 is the only robot in this penalty area. Compare its whole overhead footprint with the marked area as it moves inward.':
      'Modrý 1 je jediný robot v tomto pokutovom území. Pri jeho pohybe dovnútra porovnávajte celý pôdorys zhora s vyznačeným územím.',
    'Yellow accidentally pushes Blue into the wall. If you waive the out-of-bounds penalty, what may you do?':
      'Žltý robot náhodne zatlačí modrého do steny. Ak odpustíte trest za opustenie ihriska, čo môžete urobiť?',
    'Call pushed out and slightly move Blue back into play':
      'Ohlásiť vytlačenie a mierne posunúť modrého späť do hry',
    'Relocate Blue to the furthest unoccupied neutral spot':
      'Premiestniť modrého na najvzdialenejší neobsadený neutrálny bod',
    'The referee may waive an accidental opponent-caused out-of-bounds penalty, call pushed out, and make a small correction to return the robot to the field.':
      'Rozhodca môže odpustiť náhodné vytlačenie spôsobené súperom, ohlásiť vytlačenie a malou korekciou vrátiť robota na ihrisko.',
    "Yellow's contact displaces Blue into the wall. You judge the displacement accidental and choose to waive Blue's out-of-bounds penalty.":
      'Kontakt žltého robota zatlačí modrého do steny. Posúdite to ako náhodné vytlačenie a rozhodnete sa odpustiť modrému trest.',
    'Blue has repaired its damaged robot and the one-minute wait has elapsed. What else is required before its return?':
      'Modrý tím opravil poškodeného robota a uplynula minúta čakania. Čo ešte treba pred jeho návratom?',
    'The team may place it back without further approval':
      'Tím ho môže vrátiť bez ďalšieho schválenia',
    'The referee must permit the return': 'Návrat musí povoliť rozhodca',
    'Repair and the waiting requirement do not replace referee permission. With permission, return the robot at the furthest unoccupied neutral spot, facing its own goal.':
      'Oprava a splnenie čakacej lehoty nenahrádzajú povolenie rozhodcu. S povolením sa robot vráti na najvzdialenejší neobsadený neutrálny bod čelom k vlastnej bránke.',
    'Blue 1 was removed as damaged with its motors off and has been repaired. For this decision, assume its full one-minute waiting period has now elapsed.':
      'Modrý 1 bol odstránený ako poškodený s vypnutými motormi a už je opravený. Pre toto rozhodnutie predpokladajte, že uplynula celá minúta čakania.',
    'Blue 1 is repaired after 25 seconds off the field, and a kickoff is due. May you permit its return now?':
      'Modrý 1 je opravený po 25 sekundách mimo ihriska a má nasledovať výkop. Môžete mu už povoliť návrat?',
    'Yes, if it is ready and fully functional':
      'Áno, ak je pripravený a plne funkčný',
    'No; it must always remain off for a full minute':
      'Nie; vždy musí zostať mimo celú minútu',
    "A ready, fully functional robot may return with the referee's permission before the minute expires when a kickoff is due.":
      'Keď je na rade výkop, pripravený a plne funkčný robot sa môže s povolením rozhodcu vrátiť aj pred uplynutím minúty.',
    'Blue 1 is repaired and fully functional. It has waited off the field for 25 seconds, and play is about to restart with a kickoff.':
      'Modrý 1 je opravený a plne funkčný. Čakal mimo ihriska 25 sekúnd a hra sa má obnoviť výkopom.',
    'Both Blue robots remain damaged at kickoff. Before awarding Yellow a goal for 30 elapsed seconds, what must you check?':
      'Oba modré roboty zostávajú pri výkope poškodené. Čo overíte pred udelením gólu žltému tímu za 30 uplynutých sekúnd?',
    "Whether either Blue robot was damaged by an opponent's rule violation":
      'Či niektorého modrého robota poškodilo porušenie pravidiel súperom',
    'Whether Blue has already completed a full one-minute penalty':
      'Či modrý tím už dokončil celú minútu trestu',
    'The repeated 30-second award does not apply if either robot was damaged because the opponent violated the rules. Check the cause before awarding a goal.':
      'Opakovaný gól za 30 sekúnd sa neuplatní, ak niektorého robota poškodilo porušenie pravidiel súperom. Pred udelením gólu overte príčinu.',
    'Neither Blue robot is ready at kickoff. Thirty seconds have elapsed with both still damaged; no goal has been awarded for this interval.':
      'Ani jeden modrý robot nie je pri výkope pripravený. Oba zostávajú poškodené už 30 sekúnd; za tento interval ešte nebol udelený gól.',
    "A team member wants to free Blue's stuck robot during play. Who must authorize the intervention?":
      'Člen tímu chce počas hry uvoľniť zaseknutého modrého robota. Kto musí zásah povoliť?',
    'The team captain may authorize it': 'Zásah môže povoliť kapitán tímu',
    'The referee must explicitly permit it':
      'Rozhodca ho musí výslovne povoliť',
    'Outside kickoff, teams may not touch robots during play without explicit referee permission. A stuck robot does not itself authorize team intervention.':
      'Mimo výkopu sa tímy počas hry nesmú dotýkať robotov bez výslovného povolenia rozhodcu. Samotné zaseknutie robota zásah tímu neoprávňuje.',
    'Blue 1 appears stuck while play continues. A team member wants to touch it.':
      'Modrý 1 vyzerá zaseknutý, no hra pokračuje. Člen tímu sa ho chce dotknúť.',
    'Robots became entangled through normal play away from a contested ball. What assistance may you provide?':
      'Roboty sa bežnou hrou zakliesnili ďaleko od súboja o loptu. Akú pomoc im môžete poskytnúť?',
    'Pull them apart only enough to move freely again':
      'Odtiahnuť ich len natoľko, aby sa opäť mohli voľne pohybovať',
    'Move them to neutral spots before restarting play':
      'Pred obnovením hry ich premiestniť na neutrálne body',
    'The referee may minimally separate normally entangled robots when the ball is not disputed nearby. This does not cover a robot stuck solely because of its own design or programming.':
      'Rozhodca môže minimálne oddeliť roboty zakliesnené bežnou hrou, ak sa nablízku nebojuje o loptu. Netýka sa to zaseknutia spôsobeného iba konštrukciou alebo programom robota.',
    'The robots became entangled through normal interaction, not a design or programming fault. The ball is not being contested near them.':
      'Roboty sa zakliesnili bežnou vzájomnou interakciou, nie chybou konštrukcie alebo programu. Nablízku neprebieha súboj o loptu.',
    'You have stopped the game to discuss a field issue. May the teams adjust their robots while waiting?':
      'Zastavili ste hru kvôli diskusii o situácii na ihrisku. Môžu tímy počas čakania upravovať roboty?',
    'Yes, provided the robots remain in the same half':
      'Áno, ak roboty zostanú na rovnakej polovici',
    'No; the robots remain stopped and untouched on the field':
      'Nie; roboty zostanú zastavené a nedotknuté na ihrisku',
    'During a referee stoppage, robots remain stopped and untouched on the field. The referee decides whether to resume that situation or use a neutral kickoff.':
      'Počas prerušenia rozhodcom zostávajú roboty zastavené a nedotknuté na ihrisku. Rozhodca zvolí pokračovanie z tejto situácie alebo neutrálny výkop.',
    'The referee has stopped play for a discussion. No permission to touch or reposition the robots has been given.':
      'Rozhodca zastavil hru kvôli diskusii. Nedal povolenie dotýkať sa robotov ani meniť ich polohu.',
    'After stopping the game, who decides whether to resume the same positions or use a neutral kickoff?':
      'Kto po zastavení hry rozhodne, či sa pokračuje z rovnakých polôh alebo neutrálnym výkopom?',
    'The referee chooses the restart': 'Spôsob obnovenia zvolí rozhodca',
    'The team that last touched the ball chooses the restart':
      'Spôsob obnovenia zvolí tím, ktorý sa naposledy dotkol lopty',
    "The referee chooses between resuming the stopped situation and a neutral kickoff. A team's last touch does not assign that choice.":
      'Rozhodca vyberá medzi pokračovaním zo zastavenej situácie a neutrálnym výkopom. Posledný dotyk tímu toto právo neprideľuje.',
    'Play has stopped with the robots left in their current positions. The restart method has not yet been announced.':
      'Hra je zastavená a roboty zostali na svojich miestach. Spôsob pokračovania ešte nebol oznámený.',
    'Choose which goal to attack': 'Vyberte bránku, na ktorú budete útočiť',
    'Blue chooses the blue-painted goal to attack':
      'Modrý tím si vyberá útok na modro natretú bránku',
    'Blue attacks the blue-painted goal':
      'Modrý tím útočí na modro natretú bránku',
    'Yellow takes the first kickoff': 'Prvý výkop má žltý tím',
    'Yellow chooses the blue-painted goal to attack':
      'Žltý tím si vyberá útok na modro natretú bránku',
    'Yellow attacks the blue-painted goal':
      'Žltý tím útočí na modro natretú bránku',
    'Shot toward the goal defended by Yellow':
      'Strela na bránku bránenú žltým tímom',
    'Blue defends the blue-painted goal':
      'Modrý tím bráni modro natretú bránku',
    'Ball touches the back wall of the goal Blue defends':
      'Lopta sa dotkne zadnej steny bránky bránenej modrým tímom',
    'A goal caused by pushing': 'Gól spôsobený tlačením',
    'Pushing sends the ball to the goal back wall':
      'Tlačenie pošle loptu na zadnú stenu bránky',
    '30 s · YELLOW +1 · opponent-violation exception excluded':
      '30 s · ŽLTÝ TÍM +1 · výnimka porušenia pravidiel súperom vylúčená',
    'No award if an opponent rule violation caused the damage':
      'Gól sa neudelí, ak poškodenie spôsobilo porušenie pravidiel súperom',
  },
  de: {
    'Blue kicked off in the first half. Which team should you give the second-half kickoff to?':
      'Blau hatte den Anstoß in der ersten Halbzeit. Welchem Team gibst du den Anstoß zur zweiten Halbzeit?',
    'Yellow, after the teams switch sides':
      'Gelb, nachdem die Teams die Seiten gewechselt haben',
    'Blue again, after the teams switch sides':
      'Erneut Blau, nachdem die Teams die Seiten gewechselt haben',
    'The teams switch sides at half-time. The team that did not kick off in the first half takes the second-half kickoff.':
      'Zur Halbzeit wechseln die Teams die Seiten. Das Team ohne Anstoß in der ersten Halbzeit führt den Anstoß zur zweiten Halbzeit aus.',
    'Blue took the first-half kickoff. The first half has ended; prepare the second-half restart.':
      'Blau hatte den ersten Anstoß. Die erste Halbzeit ist beendet; bereite den Beginn der zweiten Halbzeit vor.',
    'Yellow is late for the start. How should you apply the late-arrival goal penalty?':
      'Gelb kommt zu spät zum Spielbeginn. Wie wendest du die Torstrafe für Verspätung an?',
    'Award Blue a goal every 30 seconds automatically':
      'Blau automatisch alle 30 Sekunden ein Tor geben',
    'Decide whether to award Blue a goal for each 30 seconds of lateness':
      'Entscheiden, ob Blau für jeweils 30 Sekunden Verspätung ein Tor erhält',
    'The referee may penalize late arrival by one goal per 30 seconds. This penalty is discretionary, not automatic.':
      'Die Schiedsrichter können Verspätung mit einem Tor je 30 Sekunden bestrafen. Die Strafe liegt in ihrem Ermessen und ist nicht automatisch.',
    'Blue is present. Yellow has not arrived for the scheduled start; 30 seconds of lateness have elapsed.':
      'Blau ist anwesend. Gelb ist zum angesetzten Spielbeginn nicht erschienen und mittlerweile 30 Sekunden zu spät.',
    'Blue wins the toss and chooses which goal to attack. What should you give Yellow?':
      'Blau gewinnt den Münzwurf und wählt das Tor, auf das es angreift. Was erhält Gelb?',
    'The first kickoff': 'Den ersten Anstoß',
    'The choice of goal, leaving the first kickoff to Blue':
      'Die Torwahl; Blau behält den ersten Anstoß',
    'The toss winner chooses either the first kickoff or which goal to attack. The other team gets the remaining choice.':
      'Der Münzwurfsieger wählt entweder den ersten Anstoß oder das Angriffstor. Das andere Team erhält die verbleibende Möglichkeit.',
    'Blue wins the coin toss and chooses to attack the blue-painted goal.':
      'Blau gewinnt den Münzwurf und wählt das blau gestrichene Tor als Angriffsziel.',
    'Blue wins the toss and takes the first kickoff. Who should choose which goal Yellow will attack?':
      'Blau gewinnt den Münzwurf und nimmt den ersten Anstoß. Wer wählt das Tor, auf das Gelb angreift?',
    'Blue chooses both the kickoff and the goals':
      'Blau wählt sowohl den Anstoß als auch die Tore',
    'Yellow chooses which goal it will attack': 'Gelb wählt sein Angriffstor',
    'Choosing the first kickoff leaves the choice of goal to the other team. Goal paint identifies the field end, not its defending team.':
      'Wer den ersten Anstoß wählt, überlässt dem anderen Team die Torwahl. Die Torfarbe kennzeichnet das Spielfeldende, nicht das verteidigende Team.',
    'Blue wins the coin toss and chooses to kick off first. The teams have not yet chosen their goals.':
      'Blau gewinnt den Münzwurf und wählt den ersten Anstoß. Die Teams haben ihre Tore noch nicht gewählt.',
    'All robots are correctly placed and stopped. When should you allow them to start?':
      'Alle Roboter stehen korrekt und sind angehalten. Wann dürfen sie starten?',
    'As soon as the last robot is placed':
      'Sobald der letzte Roboter aufgestellt ist',
    "Together, on the referee's start signal":
      'Gemeinsam auf das Startsignal des Schiedsrichters',
    'Correct placement does not start play. All robots remain stopped until the referee gives the start signal.':
      'Die korrekte Aufstellung startet das Spiel nicht. Alle Roboter bleiben bis zum Startsignal des Schiedsrichters angehalten.',
    'Blue will kick off. All robots are stopped on their own halves; Yellow is outside the 30 cm center circle. No start signal has been given.':
      'Blau hat Anstoß. Alle Roboter stehen in ihrer eigenen Hälfte; Gelb steht außerhalb des Mittelkreises mit 30 cm Radius. Es gab noch kein Startsignal.',
    'Blue 1 moves before your kickoff signal. What should you do?':
      'Blau 1 bewegt sich vor deinem Anstoßsignal. Was tust du?',
    'Remove Blue 1 and deem it damaged':
      'Blau 1 entfernen und als beschädigt einstufen',
    'Return Blue 1 to its starting position without removal':
      'Blau 1 ohne Herausnahme auf seine Startposition zurückstellen',
    "A robot started before the referee's command is removed and deemed damaged. This applies to the robot that started early.":
      'Ein vor dem Schiedsrichtersignal gestarteter Roboter wird entfernt und als beschädigt eingestuft. Das betrifft den zu früh gestarteten Roboter.',
    'The robots are waiting for kickoff. Blue 1 moves; the referee has not given the start signal.':
      'Die Roboter warten auf den Anstoß. Blau 1 bewegt sich, obwohl der Schiedsrichter noch kein Startsignal gegeben hat.',
    'You are setting up a neutral kickoff. Which robots must be at least 30 cm from the ball?':
      'Du bereitest einen neutralen Anstoß vor. Welche Roboter müssen mindestens 30 cm Abstand zum Ball halten?',
    'Only the team that did not take the previous kickoff':
      'Nur das Team ohne den vorherigen Anstoß',
    'All four robots': 'Alle vier Roboter',
    'At a neutral kickoff, every robot must be at least 30 cm from the ball. Neither team has the normal kickoff exception.':
      'Beim neutralen Anstoß muss jeder Roboter mindestens 30 cm vom Ball entfernt sein. Für kein Team gilt die Ausnahme des normalen Anstoßes.',
    'The ball is at the center for a neutral kickoff. Both teams are stopped on their own halves.':
      'Der Ball liegt für einen neutralen Anstoß in der Mitte. Beide Teams stehen angehalten in ihrer eigenen Hälfte.',
    'At this neutral kickoff, Blue 1 is inside the 30 cm exclusion circle. What should you do before starting?':
      'Beim neutralen Anstoß steht Blau 1 innerhalb des 30-cm-Sperrkreises. Was tust du vor dem Start?',
    'Request a position correction before the start signal':
      'Vor dem Startsignal eine Korrektur der Aufstellung verlangen',
    'Allow the position because Blue took the previous kickoff':
      'Die Position zulassen, weil Blau den vorherigen Anstoß hatte',
    'All robots must be at least 30 cm from the ball at a neutral kickoff. The referee can require an incorrect placement to be corrected.':
      'Beim neutralen Anstoß müssen alle Roboter mindestens 30 cm vom Ball entfernt sein. Der Schiedsrichter darf eine Korrektur fehlerhafter Positionen verlangen.',
    'This is a neutral kickoff. Blue 1 is inside the 30 cm circle around the centered ball; no start signal has been given.':
      'Dies ist ein neutraler Anstoß. Blau 1 steht innerhalb des Kreises mit 30 cm Radius um den Ball in der Mitte; es gab noch kein Startsignal.',
    'The ball crosses the goal mouth and then touches the inside back wall. When should you count the goal?':
      'Der Ball durchquert die Toröffnung und berührt danach die innere Rückwand. Wann zählst du das Tor?',
    'As soon as the ball crosses the goal mouth':
      'Sobald der Ball die Toröffnung durchquert',
    'When the ball touches the inside back wall':
      'Wenn der Ball die innere Rückwand berührt',
    "Crossing the goal mouth alone is insufficient. Back-wall contact scores for the team attacking that goal, followed by the conceding team's kickoff.":
      'Das Durchqueren der Toröffnung allein reicht nicht. Rückwandkontakt erzielt ein Tor für das angreifende Team; danach hat das Team Anstoß, das das Tor kassiert hat.',
    'Blue attacks the goal defended by Yellow. Compare the ball crossing the mouth with its later contact with the inside back wall.':
      'Blau greift das von Gelb verteidigte Tor an. Vergleiche das Durchqueren der Toröffnung mit dem späteren Kontakt an der inneren Rückwand.',
    'The ball hits the front of the post and returns to the field. What should you decide?':
      'Der Ball trifft die Vorderseite des Pfostens und kehrt ins Feld zurück. Wie entscheidest du?',
    'Award Blue a goal because the ball touched the goal structure':
      'Blau ein Tor geben, weil der Ball die Torkonstruktion berührt hat',
    'Keep the score unchanged because there was no back-wall contact':
      'Den Spielstand unverändert lassen, weil kein Rückwandkontakt stattfand',
    "A post deflection without contact with the goal's back wall does not score. Keep the score unchanged.":
      'Ein Pfostenabpraller ohne Berührung der Torrückwand ist kein Tor. Der Spielstand bleibt unverändert.',
    'Blue attacks the goal defended by Yellow. The ball strikes the front of the post and rebounds into the field.':
      'Blau greift das von Gelb verteidigte Tor an. Der Ball trifft die Vorderseite des Pfostens und prallt ins Feld zurück.',
    "Blue last touches the ball before it hits the back wall of the goal Blue defends. Which team's score should you increase by one goal?":
      'Blau berührt den Ball zuletzt, bevor er die Rückwand des von Blau verteidigten Tores trifft. Welchem Team schreibst du ein Tor gut?',
    "Blue — add one to Blue's score":
      'Blau — Blaus Spielstand um ein Tor erhöhen',
    "Yellow — add one to Yellow's score":
      'Gelb — Gelbs Spielstand um ein Tor erhöhen',
    "Award Yellow the goal and give Blue the kickoff. A defender's last touch does not change which team scores at that goal.":
      'Gib Gelb das Tor und Blau den Anstoß. Die letzte Berührung eines Verteidigers ändert nicht, welches Team an diesem Tor punktet.',
    "Blue defends the blue-painted goal in this scene. Blue 1 makes the last touch, sending the ball toward that goal's inside back wall.":
      'Blau verteidigt hier das blau gestrichene Tor. Blau 1 berührt den Ball zuletzt und lenkt ihn zur inneren Rückwand dieses Tores.',
    'Blue uses a backspin dribbler while Yellow can challenge the ball. Should you call ball holding on this evidence?':
      'Blau nutzt einen Dribbler mit Rückwärtsdrall, während Gelb den Ball angreifen kann. Pfeifst du anhand dieser Beobachtung Ballhalten?',
    'No; the rotating ball remains accessible to the opponent':
      'Nein; der rotierende Ball bleibt für den Gegner zugänglich',
    'Yes; keeping the ball against a dribbler is always holding':
      'Ja; den Ball am Dribbler zu halten ist immer Ballhalten',
    'A rotating dribbler may use dynamic backspin to retain the ball, but opponents must still be able to access it. This scene shows that access.':
      'Ein rotierender Dribbler darf den Ball durch dynamischen Rückwärtsdrall halten, doch Gegner müssen weiter Zugang zum Ball haben. Diese Szene zeigt diesen Zugang.',
    'Blue moves with a rotating backspin dribbler. Yellow challenges from the side and the ball comes free.':
      'Blau bewegt sich mit einem rotierenden Dribbler mit Rückwärtsdrall. Gelb greift seitlich an, und der Ball kommt frei.',
    'The ball stays fixed to Blue while it moves, and Yellow cannot free it. What should you investigate?':
      'Der Ball bleibt am fahrenden blauen Roboter fixiert, und Gelb kann ihn nicht lösen. Was untersuchst du?',
    'A ball-holding mechanism that prevents opponent access':
      'Einen Ballhaltemechanismus, der den gegnerischen Zugang verhindert',
    'A legal dribbler solely because the ball is in front of the robot':
      'Einen zulässigen Dribbler allein deshalb, weil der Ball vor dem Roboter liegt',
    'A ball fixed to the moving robot and inaccessible to opponents indicates trapping, not the backspin-dribbler exception. Inspect the mechanism; the animation is illustrative.':
      'Ein am fahrenden Roboter fixierter und für Gegner unzugänglicher Ball deutet auf Einklemmen hin, nicht auf die Dribbler-Ausnahme. Prüfe den Mechanismus; die Animation ist schematisch.',
    "The ball does not roll as Blue moves. Yellow's side challenge cannot free it. The mechanism itself is represented schematically.":
      'Der Ball rollt nicht, während Blau fährt. Gelbs seitlicher Angriff löst ihn nicht. Der Mechanismus selbst ist nur schematisch dargestellt.',
    'Blue 1 kicks the ball over the field wall. Which robot should you remove as damaged?':
      'Blau 1 schießt den Ball über die Spielfeldwand. Welchen Roboter entfernst du als beschädigt?',
    'Blue 1, which sent the ball out':
      'Blau 1, der den Ball hinausgeschossen hat',
    'Yellow 1, the opponent nearest the ball':
      'Gelb 1, den Gegner mit dem geringsten Ballabstand',
    'The robot that sends the ball beyond the field walls or above their height is deemed damaged. Here that robot is Blue 1.':
      'Der Roboter, der den Ball über die Spielfeldbegrenzung oder über deren Höhe befördert, gilt als beschädigt. Hier ist das Blau 1.',
    'Blue 1 makes the kick. The ball rises above the 22 cm wall and leaves the enclosure.':
      'Blau 1 schießt. Der Ball steigt über die 22 cm hohe Wand und verlässt die Spielfeldbegrenzung.',
    'You are checking an unobstructed robot in its own half. Which ball-moving ability must it demonstrate?':
      'Du prüfst einen ungehinderten Roboter in seiner eigenen Hälfte. Welche Fähigkeit zur Ballbewegung muss er zeigen?',
    'Moving the ball from its nearest neutral spot into the opposing half':
      'Den Ball vom nächsten Neutralpunkt in die gegnerische Hälfte bewegen',
    'Moving the ball off the spot is enough, even if it stays in its own half':
      'Den Ball vom Punkt wegzubewegen genügt, auch wenn er in der eigenen Hälfte bleibt',
    'An unobstructed robot must approach and touch a ball at the nearest neutral spot and be able to move it from its own half to the opposing half.':
      'Ein ungehinderter Roboter muss den Ball am nächsten Neutralpunkt anfahren und berühren sowie aus der eigenen in die gegnerische Hälfte bewegen können.',
    'Blue starts in its own half beside the nearest neutral spot. No opponent blocks its view of the ball or its movement.':
      'Blau beginnt in der eigenen Hälfte neben dem nächsten Neutralpunkt. Kein Gegner behindert die Ballerkennung oder Bewegung.',
    'You call pushing in this penalty-area incident. What should you relocate?':
      'Du pfeifst bei diesem Vorfall im Strafraum Pushing. Was versetzt du?',
    'The ball, to the furthest unoccupied neutral spot':
      'Den Ball zum am weitesten entfernten freien Neutralpunkt',
    'The defender farther from the ball, leaving the ball in place':
      'Den weiter vom Ball entfernten Verteidiger; der Ball bleibt liegen',
    'Resolving a pushing call moves the ball to the furthest unoccupied neutral spot. Moving the farther defender is the separate multiple-defense procedure.':
      'Nach einem Pushing-Pfiff wird der Ball auf den am weitesten entfernten freien Neutralpunkt gelegt. Den weiter entfernten Verteidiger zu versetzen gehört zur separaten Mehrfachverteidigungsregel.',
    'The opponents touch while Blue partly overlaps the penalty area and the ball is in contact. You judge this contact to be pushing.':
      'Die Gegner berühren sich, während Blau teilweise im Strafraum steht und Ballkontakt vorliegt. Du bewertest diesen Kontakt als Pushing.',
    'The opponents touch each other and the ball at midfield. Does this alone justify the penalty-area pushing call?':
      'Die Gegner berühren einander und den Ball im Mittelfeld. Rechtfertigt das allein einen Pushing-Pfiff nach der Strafraumregel?',
    'Yes; opponent contact with the ball is enough anywhere':
      'Ja; Gegnerkontakt mit Ballkontakt genügt überall',
    'No; neither robot is even partly inside a penalty area':
      'Nein; kein Roboter befindet sich auch nur teilweise im Strafraum',
    'The penalty-area pushing rule requires at least one robot to be partly inside a penalty area. Midfield contact alone does not meet that condition; assess other infringements separately.':
      'Die Pushing-Regel für den Strafraum setzt voraus, dass mindestens ein Roboter teilweise im Strafraum steht. Mittelfeldkontakt allein genügt nicht; andere Regelverstöße sind getrennt zu beurteilen.',
    'Both robots and the contested ball are at midfield, outside both penalty areas. No other infringement is established in this example.':
      'Beide Roboter und der umkämpfte Ball sind im Mittelfeld außerhalb beider Strafräume. Ein anderer Regelverstoß ist hier nicht festgestellt.',
    'Both Blue robots partly overlap the penalty area. Which one should you move to the furthest unoccupied neutral spot?':
      'Beide blauen Roboter stehen teilweise im Strafraum. Welchen versetzt du auf den am weitesten entfernten freien Neutralpunkt?',
    'Blue 1, which is nearer the ball': 'Blau 1, der näher am Ball steht',
    'Blue 2, which is farther from the ball':
      'Blau 2, der weiter vom Ball entfernt ist',
    'For two same-team robots partly inside a penalty area, move the one farther from the ball. Here that is Blue 2.':
      'Stehen zwei Roboter desselben Teams teilweise im Strafraum, wird der weiter vom Ball entfernte versetzt. Hier ist das Blau 2.',
    'The ball stays beside Blue 1 as Blue 2 enters the same penalty area. Neither robot is fully inside; no pushing is being called.':
      'Der Ball bleibt neben Blau 1, während Blau 2 in denselben Strafraum fährt. Keiner ist vollständig darin; Pushing wird nicht gepfiffen.',
    'You call pushing while two Blue robots also partly overlap the penalty area. Which correction should you make first?':
      'Du pfeifst Pushing, während zugleich zwei blaue Roboter teilweise im Strafraum stehen. Welche Korrektur führst du zuerst aus?',
    'Move the farther Blue defender, then relocate the ball':
      'Den weiter entfernten blauen Verteidiger versetzen, dann den Ball',
    'Resolve pushing by relocating the ball, then reassess multiple defense':
      'Zuerst Pushing durch Ballversetzen lösen, dann Mehrfachverteidigung neu beurteilen',
    'Resolve pushing first. After moving the ball, reassess which defender is farther from its new position before resolving multiple defense.':
      'Löse zuerst Pushing. Nach dem Ballversetzen prüfst du erneut, welcher Verteidiger weiter von der neuen Ballposition entfernt ist, und löst danach die Mehrfachverteidigung.',
    'Pushing and multiple defense occur together. The ball is beside Blue 2 before either correction has been made.':
      'Pushing und Mehrfachverteidigung treten gleichzeitig auf. Vor beiden Korrekturen liegt der Ball neben Blau 2.',
    'You judge that this goal resulted from pushing. Should you award it?':
      'Du beurteilst dieses Tor als Folge von Pushing. Erkennst du es an?',
    'Award the goal, then make the pushing correction':
      'Das Tor geben und anschließend Pushing korrigieren',
    'Disallow the goal and resolve the pushing call':
      'Das Tor aberkennen und den Pushing-Vorfall auflösen',
    'A goal caused by a pushing situation is not granted. Resolve the pushing call by moving the ball to the furthest unoccupied neutral spot.':
      'Ein durch Pushing verursachtes Tor wird nicht gegeben. Löse Pushing durch Versetzen des Balls auf den am weitesten entfernten freien Neutralpunkt.',
    "In Blue's penalty area, you call pushing. You judge that this contact caused the ball to reach Blue's goal back wall.":
      'In Blaus Strafraum pfeifst du Pushing. Nach deinem Urteil hat dieser Kontakt den Ball an die Rückwand von Blaus Tor befördert.',
    'After your visible and loud count, this stationary contest is still unlikely to change. What should you do?':
      'Nach deinem sichtbaren und lauten Zählen ist weiterhin keine Änderung des Stillstands zu erwarten. Was tust du?',
    'Move the ball to the furthest unoccupied neutral spot':
      'Den Ball auf den am weitesten entfernten freien Neutralpunkt legen',
    'Call lack of progress and move the ball to the nearest unoccupied neutral spot':
      'Mangelnden Spielfortschritt pfeifen und den Ball auf den nächsten freien Neutralpunkt legen',
    "After the count, unresolved lack of progress is restarted at the nearest unoccupied neutral spot. The animation's count is illustrative, not a universal three-second deadline.":
      'Besteht nach dem Zählen weiter mangelnder Spielfortschritt, wird der Ball auf den nächsten freien Neutralpunkt gelegt. Die Animation zeigt keine allgemeine Drei-Sekunden-Frist.',
    'The ball remains trapped between stationary opponents. The referee has counted visibly and aloud, and play has not progressed.':
      'Der Ball bleibt zwischen stillstehenden Gegnern eingeklemmt. Der Schiedsrichter hat sichtbar und laut gezählt, ohne dass das Spiel vorangekommen ist.',
    'The first neutral placement has not restored play. What may you do after reassessing lack of progress?':
      'Das erste Versetzen auf einen Neutralpunkt hat das Spiel nicht wieder in Gang gebracht. Was darfst du nach erneuter Beurteilung tun?',
    'Call it again and use a different neutral spot':
      'Erneut mangelnden Spielfortschritt pfeifen und einen anderen Neutralpunkt nutzen',
    'Repeat the placement at the same spot until a robot responds':
      'Den Ball so lange auf denselben Punkt legen, bis ein Roboter reagiert',
    'If the first relocation does not resolve lack of progress, the referee may call it again and move the ball to a different neutral spot.':
      'Löst das erste Versetzen den mangelnden Spielfortschritt nicht, darf der Schiedsrichter erneut pfeifen und den Ball auf einen anderen Neutralpunkt legen.',
    'The ball has already been moved to one neutral spot. The robots still do not respond, and the situation is unlikely to change.':
      'Der Ball wurde bereits auf einen Neutralpunkt versetzt. Die Roboter reagieren weiterhin nicht; eine Änderung ist nicht zu erwarten.',
    'Blue 1 touches the physical wall without being pushed by an opponent. What should you call?':
      'Blau 1 berührt die feste Wand, ohne vom Gegner geschoben zu werden. Was pfeifst du?',
    'Out of bounds: remove Blue 1 for one minute':
      'Aus: Blau 1 für eine Minute vom Feld nehmen',
    'Play on: only leaving the enclosure counts as out of bounds':
      'Weiterspielen: Erst das Verlassen der Umrandung zählt als Aus',
    'Wall contact is out of bounds. The one-minute penalty starts at removal; the match clock continues, and a kickoff can permit an earlier return.':
      'Wandkontakt zählt als Aus. Die einminütige Strafe beginnt mit der Herausnahme; die Spieluhr läuft weiter, und ein Anstoß kann eine frühere Rückkehr erlauben.',
    'Blue 1 reaches the physical wall under its own movement. No opponent is touching or pushing it.':
      'Blau 1 erreicht die feste Wand durch eigene Bewegung. Kein Gegner berührt oder schiebt ihn.',
    'Blue 1 moves from partial overlap to fully inside the penalty area. Which position requires an out-of-bounds call?':
      'Blau 1 fährt von teilweiser Überlappung vollständig in den Strafraum. Welche Position verlangt einen Aus-Pfiff?',
    'The initial partial overlap by Blue 1 alone':
      'Bereits die anfängliche teilweise Überlappung durch Blau 1 allein',
    "The later position with Blue 1's entire footprint inside":
      'Die spätere Position mit Blaus gesamtem Grundriss im Strafraum',
    'A robot fully inside a penalty area is out of bounds. Partial overlap by one robot alone is not that offense; the marked white line is part of the area.':
      'Ein Roboter vollständig im Strafraum ist im Aus. Die teilweise Überlappung durch einen einzelnen Roboter allein ist dieser Verstoß nicht; die weiße Markierung gehört zum Strafraum.',
    'Blue 1 is the only robot in this penalty area. Compare its whole overhead footprint with the marked area as it moves inward.':
      'Blau 1 ist der einzige Roboter in diesem Strafraum. Vergleiche beim Einfahren seinen vollständigen Grundriss von oben mit der markierten Fläche.',
    'Yellow accidentally pushes Blue into the wall. If you waive the out-of-bounds penalty, what may you do?':
      'Gelb schiebt Blau versehentlich an die Wand. Wenn du auf die Aus-Strafe verzichtest, was darfst du tun?',
    'Call pushed out and slightly move Blue back into play':
      'Hinausgeschoben ansagen und Blau leicht zurück ins Spiel schieben',
    'Relocate Blue to the furthest unoccupied neutral spot':
      'Blau auf den am weitesten entfernten freien Neutralpunkt versetzen',
    'The referee may waive an accidental opponent-caused out-of-bounds penalty, call pushed out, and make a small correction to return the robot to the field.':
      'Der Schiedsrichter darf auf die Strafe bei versehentlichem Hinausschieben durch den Gegner verzichten, Hinausgeschoben ansagen und den Roboter mit einer kleinen Korrektur zurückschieben.',
    "Yellow's contact displaces Blue into the wall. You judge the displacement accidental and choose to waive Blue's out-of-bounds penalty.":
      'Gelbs Kontakt schiebt Blau an die Wand. Du beurteilst es als versehentliches Hinausschieben und verzichtest auf Blaus Aus-Strafe.',
    'Blue has repaired its damaged robot and the one-minute wait has elapsed. What else is required before its return?':
      'Blau hat den beschädigten Roboter repariert und eine Minute gewartet. Was ist vor seiner Rückkehr zusätzlich nötig?',
    'The team may place it back without further approval':
      'Das Team darf ihn ohne weitere Zustimmung zurückstellen',
    'The referee must permit the return':
      'Der Schiedsrichter muss die Rückkehr erlauben',
    'Repair and the waiting requirement do not replace referee permission. With permission, return the robot at the furthest unoccupied neutral spot, facing its own goal.':
      'Reparatur und Wartezeit ersetzen nicht die Erlaubnis des Schiedsrichters. Mit Erlaubnis kehrt der Roboter am entferntesten freien Neutralpunkt zurück, dem eigenen Tor zugewandt.',
    'Blue 1 was removed as damaged with its motors off and has been repaired. For this decision, assume its full one-minute waiting period has now elapsed.':
      'Blau 1 wurde beschädigt mit abgeschalteten Motoren herausgenommen und repariert. Nimm für diese Entscheidung an, dass die volle Minute Wartezeit inzwischen abgelaufen ist.',
    'Blue 1 is repaired after 25 seconds off the field, and a kickoff is due. May you permit its return now?':
      'Blau 1 ist nach 25 Sekunden außerhalb des Feldes repariert, und ein Anstoß steht an. Darfst du die Rückkehr jetzt erlauben?',
    'Yes, if it is ready and fully functional':
      'Ja, wenn er bereit und voll funktionsfähig ist',
    'No; it must always remain off for a full minute':
      'Nein; er muss immer eine volle Minute draußen bleiben',
    "A ready, fully functional robot may return with the referee's permission before the minute expires when a kickoff is due.":
      'Bei einem anstehenden Anstoß darf ein bereiter, voll funktionsfähiger Roboter mit Schiedsrichtererlaubnis vor Ablauf der Minute zurückkehren.',
    'Blue 1 is repaired and fully functional. It has waited off the field for 25 seconds, and play is about to restart with a kickoff.':
      'Blau 1 ist repariert und voll funktionsfähig. Er hat 25 Sekunden außerhalb des Feldes gewartet; das Spiel soll mit einem Anstoß beginnen.',
    'Both Blue robots remain damaged at kickoff. Before awarding Yellow a goal for 30 elapsed seconds, what must you check?':
      'Beide blauen Roboter bleiben beim Anstoß beschädigt. Was prüfst du, bevor du Gelb nach 30 Sekunden ein Tor gibst?',
    "Whether either Blue robot was damaged by an opponent's rule violation":
      'Ob einer der blauen Roboter durch einen gegnerischen Regelverstoß beschädigt wurde',
    'Whether Blue has already completed a full one-minute penalty':
      'Ob Blau bereits die gesamte einminütige Strafe verbüßt hat',
    'The repeated 30-second award does not apply if either robot was damaged because the opponent violated the rules. Check the cause before awarding a goal.':
      'Die wiederholte Torvergabe nach 30 Sekunden gilt nicht, wenn einer der Roboter durch einen gegnerischen Regelverstoß beschädigt wurde. Prüfe die Ursache vor der Torvergabe.',
    'Neither Blue robot is ready at kickoff. Thirty seconds have elapsed with both still damaged; no goal has been awarded for this interval.':
      'Kein blauer Roboter ist beim Anstoß bereit. Beide sind seit 30 Sekunden weiterhin beschädigt; für diesen Zeitraum wurde noch kein Tor vergeben.',
    "A team member wants to free Blue's stuck robot during play. Who must authorize the intervention?":
      'Ein Teammitglied möchte Blaus feststeckenden Roboter während des Spiels lösen. Wer muss den Eingriff erlauben?',
    'The team captain may authorize it': 'Der Teamkapitän darf ihn erlauben',
    'The referee must explicitly permit it':
      'Der Schiedsrichter muss ihn ausdrücklich erlauben',
    'Outside kickoff, teams may not touch robots during play without explicit referee permission. A stuck robot does not itself authorize team intervention.':
      'Außer beim Anstoß dürfen Teams Roboter während des Spiels nur mit ausdrücklicher Schiedsrichtererlaubnis berühren. Ein feststeckender Roboter allein erlaubt keinen Teameingriff.',
    'Blue 1 appears stuck while play continues. A team member wants to touch it.':
      'Blau 1 scheint festzustecken, während das Spiel läuft. Ein Teammitglied möchte ihn berühren.',
    'Robots became entangled through normal play away from a contested ball. What assistance may you provide?':
      'Roboter haben sich im normalen Spiel abseits eines umkämpften Balls verhakt. Welche Hilfe darfst du leisten?',
    'Pull them apart only enough to move freely again':
      'Sie nur so weit auseinanderziehen, dass sie sich wieder frei bewegen können',
    'Move them to neutral spots before restarting play':
      'Sie vor dem Neustart auf Neutralpunkte versetzen',
    'The referee may minimally separate normally entangled robots when the ball is not disputed nearby. This does not cover a robot stuck solely because of its own design or programming.':
      'Der Schiedsrichter darf normal verhakte Roboter minimal trennen, wenn der Ball nicht in der Nähe umkämpft ist. Das gilt nicht für allein konstruktions- oder programmierbedingtes Feststecken.',
    'The robots became entangled through normal interaction, not a design or programming fault. The ball is not being contested near them.':
      'Die Roboter haben sich durch normale Interaktion verhakt, nicht durch einen Konstruktions- oder Programmierfehler. Der Ball wird nicht in ihrer Nähe umkämpft.',
    'You have stopped the game to discuss a field issue. May the teams adjust their robots while waiting?':
      'Du hast das Spiel zur Besprechung eines Feldproblems unterbrochen. Dürfen Teams ihre Roboter währenddessen anpassen?',
    'Yes, provided the robots remain in the same half':
      'Ja, solange die Roboter in derselben Hälfte bleiben',
    'No; the robots remain stopped and untouched on the field':
      'Nein; die Roboter bleiben angehalten und unberührt auf dem Feld',
    'During a referee stoppage, robots remain stopped and untouched on the field. The referee decides whether to resume that situation or use a neutral kickoff.':
      'Bei einer Schiedsrichterunterbrechung bleiben die Roboter angehalten und unberührt auf dem Feld. Der Schiedsrichter entscheidet zwischen Fortsetzung dieser Situation und neutralem Anstoß.',
    'The referee has stopped play for a discussion. No permission to touch or reposition the robots has been given.':
      'Der Schiedsrichter hat das Spiel für eine Besprechung angehalten. Berühren oder Umstellen der Roboter wurde nicht erlaubt.',
    'After stopping the game, who decides whether to resume the same positions or use a neutral kickoff?':
      'Wer entscheidet nach einer Unterbrechung zwischen Fortsetzung aus denselben Positionen und neutralem Anstoß?',
    'The referee chooses the restart':
      'Der Schiedsrichter wählt die Fortsetzung',
    'The team that last touched the ball chooses the restart':
      'Das Team mit der letzten Ballberührung wählt die Fortsetzung',
    "The referee chooses between resuming the stopped situation and a neutral kickoff. A team's last touch does not assign that choice.":
      'Der Schiedsrichter entscheidet zwischen Fortsetzung der angehaltenen Situation und neutralem Anstoß. Die letzte Ballberührung gibt einem Team kein Wahlrecht.',
    'Play has stopped with the robots left in their current positions. The restart method has not yet been announced.':
      'Das Spiel ist angehalten, die Roboter stehen unverändert an ihren Positionen. Die Art der Fortsetzung wurde noch nicht angekündigt.',
    'Choose which goal to attack': 'Wähle das Tor, auf das du angreifst',
    'Blue chooses the blue-painted goal to attack':
      'Blau wählt das blau gestrichene Tor als Angriffsziel',
    'Blue attacks the blue-painted goal':
      'Blau greift das blau gestrichene Tor an',
    'Yellow takes the first kickoff': 'Gelb erhält den ersten Anstoß',
    'Yellow chooses the blue-painted goal to attack':
      'Gelb wählt das blau gestrichene Tor als Angriffsziel',
    'Yellow attacks the blue-painted goal':
      'Gelb greift das blau gestrichene Tor an',
    'Shot toward the goal defended by Yellow':
      'Schuss auf das von Gelb verteidigte Tor',
    'Blue defends the blue-painted goal':
      'Blau verteidigt das blau gestrichene Tor',
    'Ball touches the back wall of the goal Blue defends':
      'Der Ball berührt die Rückwand des von Blau verteidigten Tores',
    'A goal caused by pushing': 'Ein durch Pushing verursachtes Tor',
    'Pushing sends the ball to the goal back wall':
      'Pushing befördert den Ball an die Torrückwand',
    '30 s · YELLOW +1 · opponent-violation exception excluded':
      '30 s · GELB +1 · Ausnahme wegen gegnerischen Regelverstoßes ausgeschlossen',
    'No award if an opponent rule violation caused the damage':
      'Keine Torvergabe bei Schaden durch gegnerischen Regelverstoß',
  },
  ja: {
    'Blue kicked off in the first half. Which team should you give the second-half kickoff to?':
      '前半は青チームのキックオフで始まりました。後半のキックオフをどちらに与えますか？',
    'Yellow, after the teams switch sides':
      'エンドを交換した後、黄チームに与える',
    'Blue again, after the teams switch sides':
      'エンドを交換した後、再び青チームに与える',
    'The teams switch sides at half-time. The team that did not kick off in the first half takes the second-half kickoff.':
      'ハーフタイムに両チームはエンドを交換します。前半にキックオフをしなかったチームが後半のキックオフを行います。',
    'Blue took the first-half kickoff. The first half has ended; prepare the second-half restart.':
      '前半のキックオフは青チームでした。前半が終了したので、後半の開始を準備します。',
    'Yellow is late for the start. How should you apply the late-arrival goal penalty?':
      '黄チームが試合開始に遅れています。遅刻による得点のペナルティをどう適用しますか？',
    'Award Blue a goal every 30 seconds automatically':
      '30秒ごとに自動的に青チームへ1点を与える',
    'Decide whether to award Blue a goal for each 30 seconds of lateness':
      '遅刻30秒ごとに青チームへ1点を与えるか判断する',
    'The referee may penalize late arrival by one goal per 30 seconds. This penalty is discretionary, not automatic.':
      '審判は遅刻30秒ごとに1点のペナルティを科すことができます。これは審判の裁量であり、自動適用ではありません。',
    'Blue is present. Yellow has not arrived for the scheduled start; 30 seconds of lateness have elapsed.':
      '青チームは到着しています。黄チームは予定の開始時刻に来ておらず、30秒が経過しました。',
    'Blue wins the toss and chooses which goal to attack. What should you give Yellow?':
      '青チームはコイントスに勝ち、攻めるゴールを選びました。黄チームには何を与えますか？',
    'The first kickoff': '最初のキックオフ',
    'The choice of goal, leaving the first kickoff to Blue':
      'ゴールの選択権を与え、最初のキックオフは青チームにする',
    'The toss winner chooses either the first kickoff or which goal to attack. The other team gets the remaining choice.':
      'コイントスの勝者は、最初のキックオフか攻めるゴールのどちらかを選びます。相手チームには残りの選択肢が与えられます。',
    'Blue wins the coin toss and chooses to attack the blue-painted goal.':
      '青チームはコイントスに勝ち、青く塗られたゴールを攻めることにしました。',
    'Blue wins the toss and takes the first kickoff. Who should choose which goal Yellow will attack?':
      '青チームはコイントスに勝ち、最初のキックオフを選びました。黄チームが攻めるゴールは誰が選びますか？',
    'Blue chooses both the kickoff and the goals':
      '青チームがキックオフもゴールも選ぶ',
    'Yellow chooses which goal it will attack':
      '黄チームが自分たちの攻めるゴールを選ぶ',
    'Choosing the first kickoff leaves the choice of goal to the other team. Goal paint identifies the field end, not its defending team.':
      '最初のキックオフを選ぶと、ゴールの選択権は相手チームに渡ります。ゴールの塗装色はフィールドの端を示すもので、守備側のチームを示すものではありません。',
    'Blue wins the coin toss and chooses to kick off first. The teams have not yet chosen their goals.':
      '青チームはコイントスに勝ち、最初のキックオフを選びました。両チームのゴールはまだ決まっていません。',
    'All robots are correctly placed and stopped. When should you allow them to start?':
      'すべてのロボットが正しく配置され、停止しています。いつ動き始めることを認めますか？',
    'As soon as the last robot is placed': '最後のロボットの配置が終わった直後',
    "Together, on the referee's start signal":
      '審判の開始合図で一斉に動き始める',
    'Correct placement does not start play. All robots remain stopped until the referee gives the start signal.':
      '配置が正しくても試合は始まりません。審判が開始の合図を出すまで、すべてのロボットは停止したままです。',
    'Blue will kick off. All robots are stopped on their own halves; Yellow is outside the 30 cm center circle. No start signal has been given.':
      '青チームのキックオフです。全ロボットは自陣で停止し、黄チームは半径30 cmのセンターサークルの外にいます。開始合図はまだありません。',
    'Blue 1 moves before your kickoff signal. What should you do?':
      'キックオフの合図より先に青1が動きました。どうしますか？',
    'Remove Blue 1 and deem it damaged':
      '青1を退場させ、故障ロボットとして扱う',
    'Return Blue 1 to its starting position without removal':
      '青1を退場させず、開始位置に戻す',
    "A robot started before the referee's command is removed and deemed damaged. This applies to the robot that started early.":
      '審判の指示より早く起動したロボットはフィールドから除去され、故障ロボットとして扱われます。対象は早く起動したロボットです。',
    'The robots are waiting for kickoff. Blue 1 moves; the referee has not given the start signal.':
      'ロボットはキックオフを待っています。審判がまだ開始合図を出していないのに、青1が動きます。',
    'You are setting up a neutral kickoff. Which robots must be at least 30 cm from the ball?':
      'ニュートラルキックオフを準備しています。ボールから30 cm以上離す必要があるのはどのロボットですか？',
    'Only the team that did not take the previous kickoff':
      '直前のキックオフをしなかったチームだけ',
    'All four robots': '4台すべて',
    'At a neutral kickoff, every robot must be at least 30 cm from the ball. Neither team has the normal kickoff exception.':
      'ニュートラルキックオフでは、すべてのロボットをボールから30 cm以上離します。通常のキックオフ側に認められる例外は、どちらにもありません。',
    'The ball is at the center for a neutral kickoff. Both teams are stopped on their own halves.':
      'ニュートラルキックオフのため、ボールが中央にあります。両チームは自陣で停止しています。',
    'At this neutral kickoff, Blue 1 is inside the 30 cm exclusion circle. What should you do before starting?':
      'このニュートラルキックオフで、青1は半径30 cmの進入禁止サークル内にいます。開始前にどうしますか？',
    'Request a position correction before the start signal':
      '開始合図の前に配置の修正を求める',
    'Allow the position because Blue took the previous kickoff':
      '青チームが直前のキックオフ側だったので許可する',
    'All robots must be at least 30 cm from the ball at a neutral kickoff. The referee can require an incorrect placement to be corrected.':
      'ニュートラルキックオフでは、全ロボットをボールから30 cm以上離します。審判は誤った配置の修正を求めることができます。',
    'This is a neutral kickoff. Blue 1 is inside the 30 cm circle around the centered ball; no start signal has been given.':
      'ニュートラルキックオフです。青1は中央のボールの周囲の半径30 cmのサークル内にいます。開始合図はまだありません。',
    'The ball crosses the goal mouth and then touches the inside back wall. When should you count the goal?':
      'ボールはゴールの入口を通過し、その後内側の奥壁に触れました。どの時点で得点としますか？',
    'As soon as the ball crosses the goal mouth':
      'ボールがゴールの入口を通過した時点',
    'When the ball touches the inside back wall':
      'ボールが内側の奥壁に触れた時点',
    "Crossing the goal mouth alone is insufficient. Back-wall contact scores for the team attacking that goal, followed by the conceding team's kickoff.":
      '入口を通過するだけでは得点になりません。奥壁への接触で、そのゴールを攻めるチームの得点となり、失点側のキックオフで再開します。',
    'Blue attacks the goal defended by Yellow. Compare the ball crossing the mouth with its later contact with the inside back wall.':
      '青チームは黄チームが守るゴールを攻めています。入口の通過と、その後の内側の奥壁への接触を比較してください。',
    'The ball hits the front of the post and returns to the field. What should you decide?':
      'ボールがポストの前面に当たり、フィールドへ戻りました。どう判定しますか？',
    'Award Blue a goal because the ball touched the goal structure':
      'ゴールの構造物に触れたので青チームの得点を認める',
    'Keep the score unchanged because there was no back-wall contact':
      '奥壁への接触がないので得点を変更しない',
    "A post deflection without contact with the goal's back wall does not score. Keep the score unchanged.":
      'ポストで跳ね返り、ゴールの奥壁に触れていなければ得点ではありません。スコアは変わりません。',
    'Blue attacks the goal defended by Yellow. The ball strikes the front of the post and rebounds into the field.':
      '青チームは黄チームが守るゴールを攻めています。ボールはポストの前面に当たり、フィールドへ跳ね返ります。',
    "Blue last touches the ball before it hits the back wall of the goal Blue defends. Which team's score should you increase by one goal?":
      '青チームが最後に触れたボールが、青チームの守るゴールの奥壁に当たりました。どちらの得点を1点増やしますか？',
    "Blue — add one to Blue's score": '青チーム — 青のスコアに1点加える',
    "Yellow — add one to Yellow's score": '黄チーム — 黄のスコアに1点加える',
    "Award Yellow the goal and give Blue the kickoff. A defender's last touch does not change which team scores at that goal.":
      '黄チームの得点とし、青チームにキックオフを与えます。守備側の最後の接触によって、そのゴールで得点するチームは変わりません。',
    "Blue defends the blue-painted goal in this scene. Blue 1 makes the last touch, sending the ball toward that goal's inside back wall.":
      'この場面では青チームが青く塗られたゴールを守っています。青1が最後にボールに触れ、そのゴールの内側の奥壁へ送ります。',
    'Blue uses a backspin dribbler while Yellow can challenge the ball. Should you call ball holding on this evidence?':
      '青はバックスピン式ドリブラーを使い、黄はボールを奪いに行けます。この証拠だけでボール保持を反則としますか？',
    'No; the rotating ball remains accessible to the opponent':
      'いいえ。回転するボールには相手もアクセスできる',
    'Yes; keeping the ball against a dribbler is always holding':
      'はい。ドリブラーにボールを留めることは常に反則である',
    'A rotating dribbler may use dynamic backspin to retain the ball, but opponents must still be able to access it. This scene shows that access.':
      '回転ドリブラーは動的なバックスピンでボールを保てますが、相手もボールにアクセスできなければなりません。この場面ではそのアクセスが示されています。',
    'Blue moves with a rotating backspin dribbler. Yellow challenges from the side and the ball comes free.':
      '青は回転するバックスピン式ドリブラーで移動します。黄が横から挑み、ボールが離れます。',
    'The ball stays fixed to Blue while it moves, and Yellow cannot free it. What should you investigate?':
      '青が移動してもボールは固定されたままで、黄も外せません。何を調べますか？',
    'A ball-holding mechanism that prevents opponent access':
      '相手のアクセスを妨げるボール保持機構',
    'A legal dribbler solely because the ball is in front of the robot':
      'ボールがロボットの前にあるという理由だけで適法なドリブラーとみなす',
    'A ball fixed to the moving robot and inaccessible to opponents indicates trapping, not the backspin-dribbler exception. Inspect the mechanism; the animation is illustrative.':
      '移動するロボットに固定され、相手がアクセスできないボールは、ドリブラーの例外ではなく捕捉を示唆します。機構を検査してください。アニメーションは模式図です。',
    "The ball does not roll as Blue moves. Yellow's side challenge cannot free it. The mechanism itself is represented schematically.":
      '青が移動してもボールは転がりません。黄が横から挑んでも外れません。機構自体は模式的に表現されています。',
    'Blue 1 kicks the ball over the field wall. Which robot should you remove as damaged?':
      '青1がフィールドの壁を越えてボールを蹴り出しました。どのロボットを故障扱いで退場させますか？',
    'Blue 1, which sent the ball out': 'ボールを外へ出した青1',
    'Yellow 1, the opponent nearest the ball': 'ボールに最も近い相手の黄1',
    'The robot that sends the ball beyond the field walls or above their height is deemed damaged. Here that robot is Blue 1.':
      'ボールをフィールドの壁の外や壁の高さを超えて送ったロボットは故障扱いになります。ここでは青1です。',
    'Blue 1 makes the kick. The ball rises above the 22 cm wall and leaves the enclosure.':
      '青1がキックします。ボールは高さ22 cmの壁を越え、フィールドの囲いの外へ出ます。',
    'You are checking an unobstructed robot in its own half. Which ball-moving ability must it demonstrate?':
      '自陣で相手の妨害がないロボットを確認しています。どのボール移動能力を示す必要がありますか？',
    'Moving the ball from its nearest neutral spot into the opposing half':
      '最寄りのニュートラルスポットから相手陣地へボールを動かす能力',
    'Moving the ball off the spot is enough, even if it stays in its own half':
      '自陣にとどまっていても、スポットからボールを動かすだけで十分',
    'An unobstructed robot must approach and touch a ball at the nearest neutral spot and be able to move it from its own half to the opposing half.':
      '妨害されていないロボットは、最寄りのニュートラルスポットのボールへ近づいて触れ、自陣から相手陣地へ動かせなければなりません。',
    'Blue starts in its own half beside the nearest neutral spot. No opponent blocks its view of the ball or its movement.':
      '青は自陣の最寄りのニュートラルスポット付近から始めます。相手はボールの検出や移動を妨げていません。',
    'You call pushing in this penalty-area incident. What should you relocate?':
      'このペナルティエリア内の接触をプッシングと判定しました。何を移しますか？',
    'The ball, to the furthest unoccupied neutral spot':
      'ボールを最も遠い空いているニュートラルスポットへ',
    'The defender farther from the ball, leaving the ball in place':
      'ボールをそのままにして、ボールから遠い守備ロボットを移す',
    'Resolving a pushing call moves the ball to the furthest unoccupied neutral spot. Moving the farther defender is the separate multiple-defense procedure.':
      'プッシングの処置ではボールを最も遠い空きニュートラルスポットへ移します。遠い守備ロボットを移すのは、別の複数守備の処置です。',
    'The opponents touch while Blue partly overlaps the penalty area and the ball is in contact. You judge this contact to be pushing.':
      '青が一部ペナルティエリアに入り、ボールへの接触がある状態で両者が接触します。あなたはこれをプッシングと判定しました。',
    'The opponents touch each other and the ball at midfield. Does this alone justify the penalty-area pushing call?':
      '両者が中盤で互いに接触し、ボールにも触れています。これだけでペナルティエリアのプッシング規則を適用できますか？',
    'Yes; opponent contact with the ball is enough anywhere':
      'はい。相手同士の接触とボール接触があれば場所を問わない',
    'No; neither robot is even partly inside a penalty area':
      'いいえ。どちらもペナルティエリアに一部すら入っていない',
    'The penalty-area pushing rule requires at least one robot to be partly inside a penalty area. Midfield contact alone does not meet that condition; assess other infringements separately.':
      'ペナルティエリアのプッシング規則には、少なくとも1台が一部でもエリア内にいる必要があります。中盤の接触だけでは条件を満たしません。他の反則は別に判断します。',
    'Both robots and the contested ball are at midfield, outside both penalty areas. No other infringement is established in this example.':
      '2台と競り合うボールは、両ペナルティエリアの外の中盤にあります。この例で他の反則は確認されていません。',
    'Both Blue robots partly overlap the penalty area. Which one should you move to the furthest unoccupied neutral spot?':
      '青の2台が一部ずつペナルティエリアに入っています。どちらを最も遠い空きニュートラルスポットへ移しますか？',
    'Blue 1, which is nearer the ball': 'ボールに近い青1',
    'Blue 2, which is farther from the ball': 'ボールから遠い青2',
    'For two same-team robots partly inside a penalty area, move the one farther from the ball. Here that is Blue 2.':
      '同じチームの2台が一部でもペナルティエリア内にいる場合、ボールから遠い方を移します。ここでは青2です。',
    'The ball stays beside Blue 1 as Blue 2 enters the same penalty area. Neither robot is fully inside; no pushing is being called.':
      'ボールが青1のそばにあるまま、青2が同じペナルティエリアへ入ります。どちらも完全には入っておらず、プッシングは判定していません。',
    'You call pushing while two Blue robots also partly overlap the penalty area. Which correction should you make first?':
      'プッシングを判定し、同時に青の2台が一部ずつペナルティエリアに入っています。どちらを先に処置しますか？',
    'Move the farther Blue defender, then relocate the ball':
      '遠い青の守備ロボットを移してからボールを移す',
    'Resolve pushing by relocating the ball, then reassess multiple defense':
      'ボールを移してプッシングを処置し、その後複数守備を再評価する',
    'Resolve pushing first. After moving the ball, reassess which defender is farther from its new position before resolving multiple defense.':
      '先にプッシングを処置します。ボールを移した後、新しい位置からどの守備ロボットが遠いかを再確認して複数守備を処置します。',
    'Pushing and multiple defense occur together. The ball is beside Blue 2 before either correction has been made.':
      'プッシングと複数守備が同時に起きています。どちらの処置も行う前は、ボールが青2のそばにあります。',
    'You judge that this goal resulted from pushing. Should you award it?':
      'このゴールはプッシングの結果だと判断しました。得点を認めますか？',
    'Award the goal, then make the pushing correction':
      '得点を認めてからプッシングを処置する',
    'Disallow the goal and resolve the pushing call':
      '得点を認めず、プッシングを処置する',
    'A goal caused by a pushing situation is not granted. Resolve the pushing call by moving the ball to the furthest unoccupied neutral spot.':
      'プッシングによって生じた得点は認めません。ボールを最も遠い空きニュートラルスポットへ移してプッシングを処置します。',
    "In Blue's penalty area, you call pushing. You judge that this contact caused the ball to reach Blue's goal back wall.":
      '青のペナルティエリアでプッシングを判定しました。その接触が原因でボールが青のゴールの奥壁へ届いたと判断しています。',
    'After your visible and loud count, this stationary contest is still unlikely to change. What should you do?':
      '見えるように大きな声でカウントした後も、静止した競り合いが変わりそうにありません。どうしますか？',
    'Move the ball to the furthest unoccupied neutral spot':
      'ボールを最も遠い空きニュートラルスポットへ移す',
    'Call lack of progress and move the ball to the nearest unoccupied neutral spot':
      '進行の停滞を宣告し、ボールを最寄りの空きニュートラルスポットへ移す',
    "After the count, unresolved lack of progress is restarted at the nearest unoccupied neutral spot. The animation's count is illustrative, not a universal three-second deadline.":
      'カウント後も停滞が解消しなければ、最寄りの空きニュートラルスポットへボールを移します。このカウントは例示であり、一律の3秒制限ではありません。',
    'The ball remains trapped between stationary opponents. The referee has counted visibly and aloud, and play has not progressed.':
      'ボールは停止した相手同士の間に挟まれています。審判が見えるように声を出して数えても、プレーは進んでいません。',
    'The first neutral placement has not restored play. What may you do after reassessing lack of progress?':
      '最初のニュートラルスポットへの移動でプレーが回復しませんでした。停滞を再評価した後、何ができますか？',
    'Call it again and use a different neutral spot':
      '再び停滞を宣告して別のニュートラルスポットを使う',
    'Repeat the placement at the same spot until a robot responds':
      'ロボットが反応するまで同じスポットへ置き直す',
    'If the first relocation does not resolve lack of progress, the referee may call it again and move the ball to a different neutral spot.':
      '最初の移動で停滞が解消しなければ、審判は再び停滞を宣告し、別のニュートラルスポットへボールを移せます。',
    'The ball has already been moved to one neutral spot. The robots still do not respond, and the situation is unlikely to change.':
      'ボールはすでに1つのニュートラルスポットへ移されました。ロボットはまだ反応せず、状況も変わりそうにありません。',
    'Blue 1 touches the physical wall without being pushed by an opponent. What should you call?':
      '青1が相手に押されずに物理的な壁へ触れました。何を宣告しますか？',
    'Out of bounds: remove Blue 1 for one minute':
      'アウトオブバウンズとして青1を1分間退場させる',
    'Play on: only leaving the enclosure counts as out of bounds':
      '囲いの外へ出ていないのでプレーを続ける',
    'Wall contact is out of bounds. The one-minute penalty starts at removal; the match clock continues, and a kickoff can permit an earlier return.':
      '壁への接触はアウトオブバウンズです。1分のペナルティは除去時から始まり、試合時計は進み続けます。キックオフなら早期復帰できる場合があります。',
    'Blue 1 reaches the physical wall under its own movement. No opponent is touching or pushing it.':
      '青1は自分の移動によって物理的な壁へ達します。相手は触れたり押したりしていません。',
    'Blue 1 moves from partial overlap to fully inside the penalty area. Which position requires an out-of-bounds call?':
      '青1が部分的な重なりからペナルティエリアの完全な内側へ移動しました。どの位置でアウトオブバウンズを宣告しますか？',
    'The initial partial overlap by Blue 1 alone':
      '青1だけが一部重なっている最初の位置',
    "The later position with Blue 1's entire footprint inside":
      '青1の全体の占有範囲が内側に入った後の位置',
    'A robot fully inside a penalty area is out of bounds. Partial overlap by one robot alone is not that offense; the marked white line is part of the area.':
      'ロボットが完全にペナルティエリア内に入るとアウトオブバウンズです。1台の部分的な重なりだけではこの反則ではありません。白線もエリアの一部です。',
    'Blue 1 is the only robot in this penalty area. Compare its whole overhead footprint with the marked area as it moves inward.':
      'このペナルティエリアにいるのは青1だけです。内側へ動くとき、真上から見た全体の占有範囲とマークされたエリアを比べてください。',
    'Yellow accidentally pushes Blue into the wall. If you waive the out-of-bounds penalty, what may you do?':
      '黄が偶然に青を壁へ押しました。アウトオブバウンズの罰則を免除する場合、何ができますか？',
    'Call pushed out and slightly move Blue back into play':
      '押し出しを宣告し、青を少しだけ場内へ戻す',
    'Relocate Blue to the furthest unoccupied neutral spot':
      '青を最も遠い空きニュートラルスポットへ移す',
    'The referee may waive an accidental opponent-caused out-of-bounds penalty, call pushed out, and make a small correction to return the robot to the field.':
      '審判は相手による偶然の押し出しの罰則を免除し、押し出しを宣告して、小さな位置修正でロボットを場内へ戻せます。',
    "Yellow's contact displaces Blue into the wall. You judge the displacement accidental and choose to waive Blue's out-of-bounds penalty.":
      '黄との接触で青が壁へ押されます。偶然の押し出しと判断し、青のアウトオブバウンズの罰則を免除することにしました。',
    'Blue has repaired its damaged robot and the one-minute wait has elapsed. What else is required before its return?':
      '青は故障ロボットを修理し、1分の待機も終えました。復帰にはさらに何が必要ですか？',
    'The team may place it back without further approval':
      'チームは追加の承認なしで戻してよい',
    'The referee must permit the return': '審判が復帰を許可しなければならない',
    'Repair and the waiting requirement do not replace referee permission. With permission, return the robot at the furthest unoccupied neutral spot, facing its own goal.':
      '修理と待機時間の完了は、審判の許可の代わりにはなりません。許可後、最も遠い空きニュートラルスポットへ、自分のゴールを向いて戻します。',
    'Blue 1 was removed as damaged with its motors off and has been repaired. For this decision, assume its full one-minute waiting period has now elapsed.':
      '青1はモーターを停止して故障扱いで除去され、修理されました。この判断では、1分の待機時間がすでにすべて経過したものとします。',
    'Blue 1 is repaired after 25 seconds off the field, and a kickoff is due. May you permit its return now?':
      '青1は退場から25秒で修理され、キックオフを行う予定です。今、復帰を許可できますか？',
    'Yes, if it is ready and fully functional':
      'はい。準備が整い、完全に機能していれば許可できる',
    'No; it must always remain off for a full minute':
      'いいえ。必ず丸1分は退場していなければならない',
    "A ready, fully functional robot may return with the referee's permission before the minute expires when a kickoff is due.":
      'キックオフが行われる場合、準備が整い完全に機能するロボットは、審判の許可で1分経過前に復帰できます。',
    'Blue 1 is repaired and fully functional. It has waited off the field for 25 seconds, and play is about to restart with a kickoff.':
      '青1は修理され、完全に機能しています。場外で25秒待機し、試合はキックオフで再開する予定です。',
    'Both Blue robots remain damaged at kickoff. Before awarding Yellow a goal for 30 elapsed seconds, what must you check?':
      'キックオフ時に青の2台とも故障したままです。30秒経過による黄への1点を与える前に、何を確認しますか？',
    "Whether either Blue robot was damaged by an opponent's rule violation":
      '青のどちらかが相手の規則違反で故障したかどうか',
    'Whether Blue has already completed a full one-minute penalty':
      '青が1分間のペナルティをすでに終えたかどうか',
    'The repeated 30-second award does not apply if either robot was damaged because the opponent violated the rules. Check the cause before awarding a goal.':
      'どちらかのロボットが相手の規則違反により故障した場合、30秒ごとの得点付与は適用しません。得点を与える前に原因を確認してください。',
    'Neither Blue robot is ready at kickoff. Thirty seconds have elapsed with both still damaged; no goal has been awarded for this interval.':
      'キックオフ時に青のロボットはどちらも準備できていません。2台とも故障したまま30秒が経過しましたが、この時間についてはまだ得点が与えられていません。',
    "A team member wants to free Blue's stuck robot during play. Who must authorize the intervention?":
      'チームメンバーが試合中に青の動けないロボットを助けようとしています。誰が介入を許可する必要がありますか？',
    'The team captain may authorize it': 'チームキャプテンが許可できる',
    'The referee must explicitly permit it': '審判の明確な許可が必要',
    'Outside kickoff, teams may not touch robots during play without explicit referee permission. A stuck robot does not itself authorize team intervention.':
      'キックオフ以外では、審判の明確な許可なくチームが試合中のロボットに触れることは禁止です。動けないだけでは介入の許可になりません。',
    'Blue 1 appears stuck while play continues. A team member wants to touch it.':
      '試合が続く中、青1が動けないように見えます。メンバーが触れようとしています。',
    'Robots became entangled through normal play away from a contested ball. What assistance may you provide?':
      '通常のプレーでロボット同士が絡まり、近くでボールの競り合いはありません。どのように援助できますか？',
    'Pull them apart only enough to move freely again':
      '再び自由に動ける最低限の距離だけ引き離す',
    'Move them to neutral spots before restarting play':
      '再開前にニュートラルスポットへ移す',
    'The referee may minimally separate normally entangled robots when the ball is not disputed nearby. This does not cover a robot stuck solely because of its own design or programming.':
      '近くでボールが争われていなければ、審判は通常の接触で絡まったロボットを最小限引き離せます。設計やプログラムだけが原因で動けない場合は対象外です。',
    'The robots became entangled through normal interaction, not a design or programming fault. The ball is not being contested near them.':
      'ロボットは通常の相互作用で絡まりました。設計やプログラムの欠陥ではありません。近くでボールの競り合いはありません。',
    'You have stopped the game to discuss a field issue. May the teams adjust their robots while waiting?':
      'フィールドの問題を協議するため試合を止めました。待っている間、チームはロボットを調整できますか？',
    'Yes, provided the robots remain in the same half':
      'はい。同じ陣地にとどまるなら調整できる',
    'No; the robots remain stopped and untouched on the field':
      'いいえ。ロボットは停止し、触れずにフィールドへ残す',
    'During a referee stoppage, robots remain stopped and untouched on the field. The referee decides whether to resume that situation or use a neutral kickoff.':
      '審判による中断中、ロボットは停止し、触れられずにフィールドへ残ります。その状態からの再開かニュートラルキックオフかを審判が決めます。',
    'The referee has stopped play for a discussion. No permission to touch or reposition the robots has been given.':
      '審判が協議のためプレーを止めました。ロボットに触れたり位置を変えたりする許可は出ていません。',
    'After stopping the game, who decides whether to resume the same positions or use a neutral kickoff?':
      '試合を止めた後、同じ位置からの再開かニュートラルキックオフかを誰が決めますか？',
    'The referee chooses the restart': '審判が再開方法を選ぶ',
    'The team that last touched the ball chooses the restart':
      '最後にボールに触れたチームが再開方法を選ぶ',
    "The referee chooses between resuming the stopped situation and a neutral kickoff. A team's last touch does not assign that choice.":
      '停止時の状態から続けるか、ニュートラルキックオフにするかは審判が決めます。最後のボール接触によってチームに選択権が生じることはありません。',
    'Play has stopped with the robots left in their current positions. The restart method has not yet been announced.':
      'プレーが止まり、ロボットはその位置に残っています。再開方法はまだ発表されていません。',
    'Choose which goal to attack': '攻めるゴールを選ぶ',
    'Blue chooses the blue-painted goal to attack':
      '青チームが青く塗られたゴールを攻めると決める',
    'Blue attacks the blue-painted goal':
      '青チームは青く塗られたゴールを攻める',
    'Yellow takes the first kickoff': '黄チームが最初のキックオフを行う',
    'Yellow chooses the blue-painted goal to attack':
      '黄チームが青く塗られたゴールを攻めると決める',
    'Yellow attacks the blue-painted goal':
      '黄チームは青く塗られたゴールを攻める',
    'Shot toward the goal defended by Yellow':
      '黄チームが守るゴールへのシュート',
    'Blue defends the blue-painted goal': '青チームは青く塗られたゴールを守る',
    'Ball touches the back wall of the goal Blue defends':
      '青チームが守るゴールの奥壁にボールが触れる',
    'A goal caused by pushing': 'プッシングが原因のゴール',
    'Pushing sends the ball to the goal back wall':
      'プッシングでボールがゴールの奥壁へ届く',
    '30 s · YELLOW +1 · opponent-violation exception excluded':
      '30秒 · 黄に1点 · 相手の規則違反による例外なし',
    'No award if an opponent rule violation caused the damage':
      '相手の規則違反が故障原因なら得点を与えない',
  },
};

export default clipQuestionTranslations;
