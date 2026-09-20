// Reviewed translations for lib/rulesets/2027/changes.ts: the change list of
// the Version comparison tab, the training assumptions and the source notice.
// Rows are [English, Slovak, German, Japanese]; see interface.mjs for the terms.
const rows = [
  // Headings of the official 2027 soccer rules that differ from 2026
  [
    'Changes from the 2026 RoboCupJunior Soccer Rules',
    'Zmeny oproti pravidlám RoboCupJunior Soccer 2026',
    'Änderungen gegenüber den RoboCupJunior Soccer Regeln 2026',
    '2026年 RoboCupJunior Soccer ルールからの変更点',
  ],
  [
    'Soccer Infrared League Ball change 2026 and beyond',
    'Zmena lopty v lige Soccer Infrared od roku 2026',
    'Ballwechsel in der Soccer Infrared Liga ab 2026',
    'Soccer Infrared リーグのボール変更（2026年以降）',
  ],

  // Training assumptions
  [
    'Position of the pushing line',
    'Poloha čiary tlačenia',
    'Position der Pushing-Linie',
    'プッシングラインの位置',
  ],
  [
    'The draft announces the pushing line for an updated field specification but does not give its position yet.',
    'Návrh avizuje čiaru tlačenia v aktualizovanej špecifikácii ihriska, no jej polohu zatiaľ neuvádza.',
    'Der Entwurf kündigt die Pushing-Linie für eine aktualisierte Spielfeldspezifikation an, nennt ihre Position aber noch nicht.',
    'ドラフトは、プッシングラインを改訂版のフィールド仕様書で示すとしていますが、その位置はまだ示していません。',
  ],
  [
    'The Lab draws a provisional line at mid-depth of the penalty area, 12.5 cm behind its front edge, and labels it provisional. One value in the 2027 rule set moves it.',
    'Lab kreslí predbežnú čiaru v polovici hĺbky pokutového územia, 12,5 cm za jeho prednou hranou, a označuje ju ako predbežnú. Posunúť ju možno jedinou hodnotou v sade pravidiel 2027.',
    'Das Lab zeichnet eine vorläufige Linie auf halber Tiefe des Strafraums, 12,5 cm hinter dessen Vorderkante, und kennzeichnet sie als vorläufig. Ein einziger Wert im Regelsatz 2027 verschiebt sie.',
    'Labはペナルティエリアの奥行きの中間、前端から12.5 cm奥に暫定的なラインを描き、暫定であることを表示します。2027年ルールセットの値を1つ変えるだけで移動できます。',
  ],
  [
    'Out-of-bounds robots at a kick-off',
    'Roboty mimo ihriska pri výkope',
    'Roboter im Aus bei einem Anstoß',
    'キックオフ時のアウトオブバウンズのロボット',
  ],
  [
    'Section 2.8 now makes the minute a minimum, while section 2.3 still lets out-of-bounds robots return before a kick-off as soon as they are ready.',
    'Časť 2.8 teraz určuje minútu ako minimum, kým časť 2.3 stále dovoľuje robotom mimo ihriska vrátiť sa pred výkopom, len čo sú pripravené.',
    'Abschnitt 2.8 macht die Minute jetzt zur Mindestdauer, während Abschnitt 2.3 Roboter im Aus weiterhin vor einem Anstoß zurückkehren lässt, sobald sie bereit sind.',
    '2.8節は1分を最低時間としましたが、2.3節には、アウトオブバウンズのロボットは準備ができ次第キックオフ前に復帰できるという記述が残っています。',
  ],
  [
    'The trainer follows the changed section 2.8: an out-of-bounds robot serves its full minute, and a kick-off after that minute brings it back. Damaged robots keep their kick-off exception from section 2.9.',
    'Trenažér sa riadi zmenenou časťou 2.8: robot mimo ihriska si odpyká celú minútu a vráti ho až výkop po jej uplynutí. Poškodeným robotom zostáva výnimka pri výkope podľa časti 2.9.',
    'Das Training folgt dem geänderten Abschnitt 2.8: Ein Roboter im Aus verbüßt seine volle Minute, und ein Anstoß nach dieser Minute bringt ihn zurück. Beschädigte Roboter behalten ihre Anstoß-Ausnahme aus Abschnitt 2.9.',
    'このトレーニングは変更後の2.8節に従います。アウトオブバウンズのロボットは1分を完全に終え、その後のキックオフで復帰します。故障ロボットには、2.9節のキックオフ時の例外が引き続き適用されます。',
  ],
  [
    'What counts as a game interruption',
    'Čo sa počíta ako prerušenie hry',
    'Was als Spielunterbrechung zählt',
    '試合の中断に当たるもの',
  ],
  [
    'For the return of out-of-bounds robots the draft lists kick-off, lack of progress and pushing, followed by “etc.”.',
    'Pri návrate robotov mimo ihriska návrh vymenúva výkop, nedostatok pokroku a tlačenie a dodáva „atď.“.',
    'Für die Rückkehr von Robotern im Aus nennt der Entwurf Anstoß, mangelnden Spielfortschritt und Pushing, gefolgt von „usw.“.',
    'アウトオブバウンズのロボットの復帰について、ドラフトはキックオフ、進行の停滞、プッシングを挙げ、「など」と続けています。',
  ],
  [
    'The trainer also counts referee stoppages and retrieving a ball that left the field. Removing or relocating a robot alone does not count.',
    'Trenažér počíta aj prerušenia rozhodcom a vrátenie lopty, ktorá opustila ihrisko. Samotné odstránenie alebo premiestnenie robota sa nepočíta.',
    'Das Training zählt auch Schiedsrichterunterbrechungen und das Zurückholen eines Balls, der das Feld verlassen hat. Das bloße Entfernen oder Versetzen eines Roboters zählt nicht.',
    'このトレーニングでは、審判による中断と、フィールド外に出たボールを戻す場合も中断として数えます。ロボットの退場や移動だけでは中断に数えません。',
  ],
  [
    'Which corner, facing where',
    'Ktorý roh a aké natočenie',
    'Welche Ecke, welche Ausrichtung',
    'どのコーナーに、どの向きで',
  ],
  [
    'The draft places a returning out-of-bounds robot in “the general area of its own corner” without naming one of the two own-half corners or an orientation.',
    'Návrh umiestňuje vracajúceho sa robota do „priestoru jeho vlastného rohu“, no neurčuje, ktorý z dvoch rohov vlastnej polovice to je, ani natočenie robota.',
    'Der Entwurf setzt einen zurückkehrenden Roboter in „den allgemeinen Bereich seiner eigenen Ecke“, ohne eine der beiden Ecken der eigenen Hälfte oder eine Ausrichtung zu nennen.',
    'ドラフトは、復帰するロボットを「自陣コーナーのおおよその位置」に置くとしていますが、自陣に2つあるコーナーのどちらか、またロボットの向きは示していません。',
  ],
  [
    'The simulator uses the free own-half corner farther from the ball and turns the robot toward the center of the field.',
    'Simulátor použije voľný roh vlastnej polovice, ktorý je ďalej od lopty, a otočí robota k stredu ihriska.',
    'Der Simulator nutzt die freie Ecke der eigenen Hälfte, die weiter vom Ball entfernt ist, und dreht den Roboter zur Feldmitte.',
    'シミュレーターは、自陣の空いているコーナーのうちボールから遠いほうを使い、ロボットをフィールド中央に向けます。',
  ],
  [
    'Counting again after robots return',
    'Nové odpočítavanie po návrate robotov',
    'Erneutes Zählen nach der Rückkehr von Robotern',
    'ロボット復帰後の再カウント',
  ],
  [
    'The draft does not say whether a new count is needed when returning the waiting robots does not resolve the lack of progress.',
    'Návrh neuvádza, či je potrebné nové odpočítavanie, keď návrat čakajúcich robotov nedostatok pokroku nevyrieši.',
    'Der Entwurf sagt nicht, ob neu gezählt werden muss, wenn die Rückkehr der wartenden Roboter den mangelnden Spielfortschritt nicht auflöst.',
    'ドラフトは、待機中のロボットを復帰させても進行の停滞が解消しない場合に、改めてカウントが必要かどうかを示していません。',
  ],
  [
    'The trainer asks for a new visible count before the ball is moved.',
    'Trenažér vyžaduje nové viditeľné odpočítavanie pred presunom lopty.',
    'Das Training verlangt ein neues sichtbares Zählen, bevor der Ball versetzt wird.',
    'このトレーニングでは、ボールを移す前に、見える形でのカウントをもう一度求めます。',
  ],

  // Late teams
  [
    'Late teams: a definition, and an automatic loss at 10–0',
    'Meškajúce tímy: definícia a automatická prehra pri stave 10–0',
    'Verspätete Teams: eine Definition und eine automatische Niederlage bei 10–0',
    '遅刻チーム：定義と、10–0での自動的な敗戦',
  ],
  [
    'A team that is late for the start may be penalized one goal per 30 seconds at the referee’s discretion. The rules do not say when a team counts as late or when the penalty ends.',
    'Tím, ktorý mešká na začiatok zápasu, môže byť podľa uváženia rozhodcu potrestaný jedným gólom za každých 30 sekúnd. Pravidlá neuvádzajú, kedy sa tím považuje za meškajúci, ani kedy sa trest končí.',
    'Ein Team, das zu spät zum Start kommt, kann nach Ermessen des Schiedsrichters mit einem Tor je 30 Sekunden bestraft werden. Die Regeln sagen nicht, wann ein Team als verspätet gilt oder wann die Strafe endet.',
    '試合開始に遅れたチームには、審判の裁量で30秒ごとに1点のペナルティを科すことができます。いつ遅刻とみなされるのか、ペナルティがいつ終わるのかは、ルールに示されていません。',
  ],
  [
    'A team is late when it does not show up with at least one working robot. The discretionary penalty of one goal per 30 seconds stays, and once it reaches 10–0 the late team automatically loses the game.',
    'Tím mešká, ak sa nedostaví aspoň s jedným funkčným robotom. Trest jedného gólu za každých 30 sekúnd podľa uváženia rozhodcu zostáva a po dosiahnutí stavu 10–0 meškajúci tím zápas automaticky prehráva.',
    'Ein Team ist verspätet, wenn es nicht mit mindestens einem funktionierenden Roboter erscheint. Die Ermessensstrafe von einem Tor je 30 Sekunden bleibt, und sobald sie 10–0 erreicht, verliert das verspätete Team das Spiel automatisch.',
    '動作するロボットを少なくとも1台用意して現れないチームは遅刻とみなされます。審判の裁量による30秒ごとに1点のペナルティは変わらず、10–0に達した時点で遅刻チームは自動的に敗戦となります。',
  ],
  [
    'One working robot is enough to start. Stop adding goals at 10–0 and record the loss.',
    'Na začatie stačí jeden funkčný robot. Pri stave 10–0 prestaňte pridávať góly a zapíšte prehru.',
    'Ein funktionierender Roboter genügt für den Start. Höre bei 10–0 auf, Tore zu geben, und trage die Niederlage ein.',
    '動作するロボットが1台あれば試合を始められます。10–0に達したら得点の加算をやめ、敗戦を記録します。',
  ],
  [
    'The time before a match is not simulated. The Rules tab has a 2027 question on the new limit.',
    'Čas pred zápasom sa nesimuluje. Na karte Pravidlá je k novému limitu otázka pre rok 2027.',
    'Die Zeit vor einem Spiel wird nicht simuliert. Im Tab „Regeln“ gibt es eine 2027er Frage zum neuen Limit.',
    '試合前の時間はシミュレーションしません。ルールタブに、この新しい上限についての2027年版の問題があります。',
  ],

  // Neutral kick-off with an empty field
  [
    'Neutral kick-off when every robot is off the field',
    'Neutrálny výkop, keď sú všetky roboty mimo ihriska',
    'Neutraler Anstoß, wenn alle Roboter vom Feld sind',
    'すべてのロボットが場外にいるときのニュートラルキックオフ',
  ],
  [
    'A neutral kick-off is only named as a possible restart after the referee has stopped the game.',
    'Neutrálny výkop sa uvádza len ako možné pokračovanie hry po tom, čo rozhodca hru prerušil.',
    'Ein neutraler Anstoß wird nur als mögliche Spielfortsetzung genannt, nachdem der Schiedsrichter das Spiel unterbrochen hat.',
    'ニュートラルキックオフは、審判が試合を止めた後の再開方法の一つとしてのみ挙げられています。',
  ],
  [
    'A neutral kick-off also takes place when all robots of both teams are out of the field.',
    'Neutrálny výkop nasleduje aj vtedy, keď sú všetky roboty oboch tímov mimo ihriska.',
    'Ein neutraler Anstoß findet auch statt, wenn alle Roboter beider Teams außerhalb des Feldes sind.',
    '両チームのロボットがすべてフィールド外にいる場合にも、ニュートラルキックオフを行います。',
  ],
  [
    'With no robot left on the field, do not wait for a lack-of-progress count. Prepare a neutral kick-off and bring back the robots that may return.',
    'Keď na ihrisku nezostal žiadny robot, nečakajte na odpočítavanie nedostatku pokroku. Pripravte neutrálny výkop a vráťte roboty, ktoré sa smú vrátiť.',
    'Ist kein Roboter mehr auf dem Feld, warte nicht auf das Zählen wegen mangelnden Spielfortschritts. Bereite einen neutralen Anstoß vor und hole die Roboter zurück, die zurückkehren dürfen.',
    'フィールドにロボットが残っていなければ、進行の停滞のカウントを待ちません。ニュートラルキックオフを準備し、復帰可能なロボットを戻します。',
  ],
  [
    'Referee mode raises the situation when the last robot leaves and expects the Neutral kickoff call. The kick-off then waits until each team has a robot that may return.',
    'Režim Rozhodca túto situáciu vyvolá, keď ihrisko opustí posledný robot, a očakáva rozhodnutie Neutral kickoff. Výkop potom počká, kým bude mať každý tím robota, ktorý sa smie vrátiť.',
    'Der Schiedsrichtermodus löst die Situation aus, wenn der letzte Roboter das Feld verlässt, und erwartet die Entscheidung Neutral kickoff. Der Anstoß wartet dann, bis jedes Team einen Roboter hat, der zurückkehren darf.',
    '審判モードでは、最後のロボットが場外に出た時点でこの状況が発生し、Neutral kickoff の判定が求められます。キックオフは、各チームに復帰可能なロボットがそろうまで待ちます。',
  ],

  // Holding
  [
    'Ball holding during play makes the robot damaged',
    'Držanie lopty počas hry znamená, že robot je poškodený',
    'Ballhalten im laufenden Spiel macht den Roboter zu einem beschädigten Roboter',
    '試合中のボール保持でロボットは故障扱いに',
  ],
  [
    'Holding the ball is forbidden, but the rules prescribe no consequence during a game. The referee has the mechanism inspected.',
    'Držanie lopty je zakázané, no pravidlá neurčujú následok počas zápasu. Rozhodca dá mechanizmus skontrolovať.',
    'Ballhalten ist verboten, aber die Regeln legen keine Folge während eines Spiels fest. Der Schiedsrichter lässt den Mechanismus überprüfen.',
    'ボール保持は禁止されていますが、試合中の処置はルールに定められていません。審判は機構を検査させます。',
  ],
  [
    'A robot that holds the ball during gameplay is deemed damaged and loses its inspection sticker until it complies with the rule again.',
    'Robot, ktorý počas hry drží loptu, sa považuje za poškodeného a stráca nálepku z technickej kontroly, kým znova nevyhovie pravidlu.',
    'Ein Roboter, der im laufenden Spiel den Ball hält, gilt als beschädigt und verliert seinen Inspektionsaufkleber, bis er die Regel wieder erfüllt.',
    '試合中にボールを保持したロボットは故障扱いとなり、再びルールに適合するまで検査ステッカーを失います。',
  ],
  [
    'Remove the robot as damaged. Before it returns it needs a new inspection, not only the waiting time.',
    'Odstráňte robota ako poškodeného. Pred návratom potrebuje novú technickú kontrolu, nielen čakaciu dobu.',
    'Entferne den Roboter als beschädigt. Vor der Rückkehr braucht er eine neue Inspektion, nicht nur die Wartezeit.',
    'ロボットを故障扱いで退場させます。復帰には待機時間だけでなく、再検査が必要です。',
  ],
  [
    'The Holding call removes the robot as damaged. It may return after the waiting time and a simulated re-inspection.',
    'Rozhodnutie Holding odstráni robota ako poškodeného. Vrátiť sa môže po čakacej dobe a simulovanej opätovnej kontrole.',
    'Die Entscheidung Holding entfernt den Roboter als beschädigt. Er darf nach der Wartezeit und einer simulierten Nachinspektion zurückkehren.',
    'Holding の判定で、ロボットは故障扱いで退場します。待機時間とシミュレーション上の再検査の後に復帰できます。',
  ],

  // Multiple defense
  [
    'Multiple defense only in a team’s own penalty area',
    'Viacnásobná obrana len vo vlastnom pokutovom území tímu',
    'Mehrfachverteidigung nur im eigenen Strafraum eines Teams',
    '複数守備は自陣のペナルティエリアのみ',
  ],
  [
    'Two robots of one team partly inside a penalty area are multiple defense, whichever penalty area it is.',
    'Dva roboty jedného tímu čiastočne v pokutovom území znamenajú viacnásobnú obranu bez ohľadu na to, o ktoré pokutové územie ide.',
    'Zwei Roboter eines Teams, die teilweise in einem Strafraum stehen, sind Mehrfachverteidigung, egal in welchem Strafraum.',
    '同じチームの2台が一部でもペナルティエリアに入っていれば、どちらのペナルティエリアであっても複数守備です。',
  ],
  [
    'Only two robots partly inside their own penalty area are multiple defense.',
    'Viacnásobnou obranou sú len dva roboty čiastočne vo vlastnom pokutovom území.',
    'Nur zwei Roboter, die teilweise im eigenen Strafraum stehen, sind Mehrfachverteidigung.',
    '複数守備になるのは、2台が一部でも自陣のペナルティエリアに入っている場合だけです。',
  ],
  [
    'Two attackers partly inside the opponent’s penalty area are no longer relocated. A robot fully inside any penalty area is still out of bounds.',
    'Dvaja útočníci čiastočne v súperovom pokutovom území sa už nepremiestňujú. Robot, ktorý je celý v ktoromkoľvek pokutovom území, je naďalej mimo ihriska.',
    'Zwei Angreifer, die teilweise im gegnerischen Strafraum stehen, werden nicht mehr versetzt. Ein Roboter, der vollständig in einem Strafraum steht, ist weiterhin im Aus.',
    '相手のペナルティエリアに一部入っている攻撃側の2台は、もう移動させません。どちらのペナルティエリアでも、完全に入ったロボットは引き続きアウトオブバウンズです。',
  ],
  [
    'The trainer checks each team only at the goal it defends, whichever end that is after the coin toss.',
    'Trenažér kontroluje každý tím len pri bránke, ktorú bráni, nech je to po hode mincou ktorákoľvek strana.',
    'Das Training prüft jedes Team nur an dem Tor, das es verteidigt – egal, welche Seite das nach dem Münzwurf ist.',
    'このトレーニングでは、コイントス後にどちらのエンドになっても、各チームを自分が守るゴールでのみ確認します。',
  ],

  // Pushing line
  [
    'Pushing is decided by a pushing line, not by discretion',
    'O tlačení rozhoduje čiara tlačenia, nie uváženie rozhodcu',
    'Über Pushing entscheidet eine Pushing-Linie, nicht das Ermessen',
    'プッシングは裁量ではなくプッシングラインで決まる',
  ],
  [
    'Contact between an attacker and a defender, with one of them partly inside the penalty area and one of them touching the ball, may be called pushing at the referee’s discretion.',
    'Kontakt medzi útočníkom a obrancom, pri ktorom je jeden z nich čiastočne v pokutovom území a jeden z nich sa dotýka lopty, môže rozhodca podľa svojho uváženia odpískať ako tlačenie.',
    'Kontakt zwischen einem Angreifer und einem Verteidiger, bei dem einer teilweise im Strafraum steht und einer den Ball berührt, kann nach Ermessen des Schiedsrichters als Pushing gepfiffen werden.',
    '攻撃側と守備側のロボットが接触し、一方が一部でもペナルティエリアに入り、一方がボールに触れている場合、審判の裁量でプッシングと判定できます。',
  ],
  [
    'Robot-to-robot or robot-ball-robot contact in which the defender reaches the pushing line is pushing. The line is an extra black line inside the penalty area; its position is announced for an updated field specification.',
    'Kontakt robot–robot alebo robot–lopta–robot, pri ktorom obranca dosiahne čiaru tlačenia, je tlačenie. Ide o ďalšiu čiernu čiaru vnútri pokutového územia; jej poloha je avizovaná v aktualizovanej špecifikácii ihriska.',
    'Kontakt Roboter–Roboter oder Roboter–Ball–Roboter, bei dem der Verteidiger die Pushing-Linie erreicht, ist Pushing. Die Linie ist eine zusätzliche schwarze Linie im Strafraum; ihre Position ist für eine aktualisierte Spielfeldspezifikation angekündigt.',
    'ロボット同士、またはロボット・ボール・ロボットの接触で、守備ロボットがプッシングラインに達した場合はプッシングです。このラインはペナルティエリア内に追加される黒い線で、位置は改訂版のフィールド仕様書で示される予定です。',
  ],
  [
    'Watch the defender rather than the force of the contact. Once it reaches the line during contact, move the ball to the furthest unoccupied neutral spot. Contact short of the line is not pushing.',
    'Sledujte obrancu, nie silu kontaktu. Keď počas kontaktu dosiahne čiaru, presuňte loptu na najvzdialenejší neobsadený neutrálny bod. Kontakt pred čiarou nie je tlačenie.',
    'Achte auf den Verteidiger, nicht auf die Stärke des Kontakts. Sobald er im Kontakt die Linie erreicht, lege den Ball auf den am weitesten entfernten freien Neutralpunkt. Kontakt vor der Linie ist kein Pushing.',
    '接触の強さではなく守備ロボットを見ます。接触中にラインに達したら、ボールを最も遠い空きニュートラルスポットへ移します。ラインの手前での接触はプッシングではありません。',
  ],
  [
    'The field shows a provisional pushing line, and the trainer requires the call when the defender’s body reaches it during contact.',
    'Na ihrisku je zobrazená predbežná čiara tlačenia a trenažér vyžaduje rozhodnutie, keď ju telo obrancu počas kontaktu dosiahne.',
    'Das Spielfeld zeigt eine vorläufige Pushing-Linie, und das Training verlangt die Entscheidung, sobald der Körper des Verteidigers sie im Kontakt erreicht.',
    'フィールドには暫定的なプッシングラインを表示し、接触中に守備ロボットの機体がラインに達した時点で判定を求めます。',
  ],

  // Lack of progress
  [
    'Lack of progress: return waiting robots before moving the ball',
    'Nedostatok pokroku: pred presunom lopty vráťte čakajúce roboty',
    'Mangelnder Spielfortschritt: wartende Roboter zurückbringen, bevor der Ball versetzt wird',
    '進行の停滞：ボールを移す前に待機中のロボットを復帰させる',
  ],
  [
    'After the count, the referee moves the ball to the nearest unoccupied neutral spot.',
    'Po odpočítaní rozhodca presunie loptu na najbližší neobsadený neutrálny bod.',
    'Nach dem Zählen legt der Schiedsrichter den Ball auf den nächsten freien Neutralpunkt.',
    'カウントの後、審判はボールを最寄りの空きニュートラルスポットへ移します。',
  ],
  [
    'If robots are out of bounds and their penalty time has passed, the referee returns them first and leaves the ball. Only if that does not resolve the lack of progress is the ball moved as before.',
    'Ak sú roboty mimo ihriska a ich trest už uplynul, rozhodca ich najprv vráti a loptu nechá na mieste. Až keď to nedostatok pokroku nevyrieši, presunie loptu ako doteraz.',
    'Sind Roboter im Aus und ihre Strafzeit ist abgelaufen, bringt der Schiedsrichter zuerst sie zurück und lässt den Ball liegen. Nur wenn das den mangelnden Spielfortschritt nicht auflöst, wird der Ball wie bisher versetzt.',
    'アウトオブバウンズのロボットのペナルティ時間が経過していれば、審判はまずそのロボットを復帰させ、ボールは動かしません。それでも進行の停滞が解消しない場合にのみ、従来どおりボールを移します。',
  ],
  [
    'Check the bench before touching the ball.',
    'Skôr než sa dotknete lopty, skontrolujte roboty mimo ihriska.',
    'Prüfe die Roboter außerhalb des Feldes, bevor du den Ball berührst.',
    'ボールに触れる前に、場外のロボットを確認します。',
  ],
  [
    'With a time-served robot waiting, the trainer expects Permit return first and then a new count before the ball is moved.',
    'Ak čaká robot s odpykaným trestom, trenažér očakáva najprv povolenie návratu a potom nové odpočítavanie pred presunom lopty.',
    'Wartet ein Roboter mit verbüßter Strafe, erwartet das Training zuerst „Rückkehr erlauben“ und dann ein neues Zählen, bevor der Ball versetzt wird.',
    'ペナルティ時間を終えたロボットが待機している場合、このトレーニングではまず復帰の許可を、その後ボールを移す前に新たなカウントを求めます。',
  ],

  // Out of bounds: minimum and interruption
  [
    'Out of bounds: at least one minute, then back at an interruption',
    'Mimo ihriska: najmenej jedna minúta, potom návrat pri prerušení hry',
    'Aus: mindestens eine Minute, dann Rückkehr bei einer Unterbrechung',
    'アウトオブバウンズ：最低1分、その後は中断時に復帰',
  ],
  [
    'The robot is removed for one minute and may return earlier if a kick-off occurs before the minute has elapsed.',
    'Robot je odstránený na jednu minútu a môže sa vrátiť skôr, ak pred jej uplynutím nastane výkop.',
    'Der Roboter wird für eine Minute entfernt und darf früher zurückkehren, wenn vor Ablauf der Minute ein Anstoß stattfindet.',
    'ロボットは1分間退場し、1分が経過する前にキックオフがあれば、それより早く復帰できます。',
  ],
  [
    'The robot is removed for a minimum of one minute. After that minute it returns at the next game interruption, for example a kick-off, a lack-of-progress call or a pushing call.',
    'Robot je odstránený najmenej na jednu minútu. Po jej uplynutí sa vráti pri najbližšom prerušení hry, napríklad pri výkope, nedostatku pokroku alebo tlačení.',
    'Der Roboter wird für mindestens eine Minute entfernt. Danach kehrt er bei der nächsten Spielunterbrechung zurück, zum Beispiel bei einem Anstoß, bei mangelndem Spielfortschritt oder bei Pushing.',
    'ロボットは最低1分間退場します。1分が経過した後、キックオフ、進行の停滞、プッシングの判定など、次の試合の中断時に復帰します。',
  ],
  [
    'A kick-off no longer shortens the penalty, and an elapsed minute alone no longer brings the robot back while play is running.',
    'Výkop už trest neskracuje a samotné uplynutie minúty už robota počas bežiacej hry nevráti.',
    'Ein Anstoß verkürzt die Strafe nicht mehr, und eine abgelaufene Minute allein bringt den Roboter im laufenden Spiel nicht mehr zurück.',
    'キックオフでペナルティが短縮されることはなくなり、1分が経過しただけでは、プレーが続いている間にロボットが復帰することもなくなりました。',
  ],
  [
    'The bench shows the minute and then waits for an interruption. Kick-offs, lack-of-progress and pushing calls, retrieving a ball that left the field and referee stoppages count.',
    'Zoznam robotov mimo ihriska zobrazuje minútu a potom čaká na prerušenie hry. Počítajú sa výkopy, rozhodnutia o nedostatku pokroku a tlačení, vrátenie lopty, ktorá opustila ihrisko, a prerušenia rozhodcom.',
    'Die Liste der Roboter außerhalb des Feldes zeigt die Minute und wartet dann auf eine Unterbrechung. Es zählen Anstöße, Entscheidungen auf mangelnden Spielfortschritt und Pushing, das Zurückholen eines Balls, der das Feld verlassen hat, und Schiedsrichterunterbrechungen.',
    '場外ロボットの一覧は1分を表示し、その後は中断を待ちます。キックオフ、進行の停滞とプッシングの判定、フィールド外に出たボールを戻す場合、審判による中断が対象です。',
  ],

  // Out of bounds: goals
  [
    'Only the penalized robot’s own goals are void',
    'Neplatné sú len góly samotného potrestaného robota',
    'Nur die Tore des bestraften Roboters selbst sind ungültig',
    '無効になるのはペナルティを受けたロボット自身のゴールだけ',
  ],
  [
    'No goal of the penalized team is granted while its penalized robot is still on the field.',
    'Kým je potrestaný robot ešte na ihrisku, neuzná sa žiadny gól jeho tímu.',
    'Solange der bestrafte Roboter noch auf dem Feld ist, wird kein Tor seines Teams gegeben.',
    'ペナルティを受けたロボットがまだフィールド上にいる間は、そのチームのゴールは一切認められません。',
  ],
  [
    'A goal scored by the penalized robot is not granted. A goal by its teammate counts, and an own goal by the penalized robot counts for the opponent.',
    'Gól, ktorý strelí potrestaný robot, sa neuzná. Gól jeho spoluhráča platí a vlastný gól potrestaného robota sa počíta súperovi.',
    'Ein Tor des bestraften Roboters wird nicht gegeben. Ein Tor seines Teamkollegen zählt, und ein Eigentor des bestraften Roboters zählt für den Gegner.',
    'ペナルティを受けたロボットによるゴールは認められません。チームメイトのゴールは有効で、ペナルティを受けたロボットのオウンゴールは相手の得点になります。',
  ],
  [
    'Identify which robot scored before you disallow a goal.',
    'Skôr než gól neuznáte, zistite, ktorý robot skóroval.',
    'Stelle fest, welcher Roboter getroffen hat, bevor du ein Tor aberkennst.',
    'ゴールを取り消す前に、どのロボットが得点したかを確認します。',
  ],
  [
    'The trainer treats the last robot that touched the ball as the scorer.',
    'Trenažér považuje za strelca robota, ktorý sa lopty dotkol ako posledný.',
    'Das Training betrachtet den Roboter, der den Ball zuletzt berührt hat, als Torschützen.',
    'このトレーニングでは、最後にボールに触れたロボットを得点者として扱います。',
  ],

  // Out of bounds: return position
  [
    'Out-of-bounds robots return in their own corner',
    'Roboty mimo ihriska sa vracajú do vlastného rohu',
    'Roboter im Aus kehren in ihrer eigenen Ecke zurück',
    'アウトオブバウンズのロボットは自陣コーナーへ復帰',
  ],
  [
    'After the penalty the robot is placed on the unoccupied neutral spot furthest from the ball, facing its own goal.',
    'Po treste sa robot umiestni na neobsadený neutrálny bod najvzdialenejší od lopty, otočený k vlastnej bránke.',
    'Nach der Strafe wird der Roboter auf den freien Neutralpunkt gesetzt, der am weitesten vom Ball entfernt ist, mit Blick zum eigenen Tor.',
    'ペナルティの後、ロボットはボールから最も遠い空きニュートラルスポットに、自陣ゴールを向けて置かれます。',
  ],
  [
    'After the penalty the robot is placed in the general area of its own corner. Repaired damaged robots still return on the furthest unoccupied neutral spot, facing their own goal.',
    'Po treste sa robot umiestni do priestoru svojho vlastného rohu. Opravené poškodené roboty sa naďalej vracajú na najvzdialenejší neobsadený neutrálny bod, otočené k vlastnej bránke.',
    'Nach der Strafe wird der Roboter in den allgemeinen Bereich seiner eigenen Ecke gesetzt. Reparierte beschädigte Roboter kehren weiterhin auf dem am weitesten entfernten freien Neutralpunkt zurück, mit Blick zum eigenen Tor.',
    'ペナルティの後、ロボットは自陣コーナーのおおよその位置に置かれます。修理を終えた故障ロボットは、引き続き最も遠い空きニュートラルスポットに、自陣ゴールを向けて復帰します。',
  ],
  [
    'No neutral-spot search for an out-of-bounds return. Keep it for damaged robots.',
    'Pri návrate po opustení ihriska sa už nehľadá neutrálny bod. Ponechajte si to pre poškodené roboty.',
    'Bei der Rückkehr aus dem Aus wird kein Neutralpunkt mehr gesucht. Das gilt weiter für beschädigte Roboter.',
    'アウトオブバウンズからの復帰では、ニュートラルスポットを探しません。それは故障ロボットの復帰にのみ使います。',
  ],
  [
    'The robot is placed in the free own-half corner farther from the ball.',
    'Robot sa umiestni do voľného rohu vlastnej polovice, ktorý je ďalej od lopty.',
    'Der Roboter wird in die freie Ecke der eigenen Hälfte gesetzt, die weiter vom Ball entfernt ist.',
    'ロボットは、自陣の空いているコーナーのうちボールから遠いほうに置かれます。',
  ],

  // Pushed onto the ramp
  [
    'Pushed out also covers being pushed onto the ramp',
    'Vytlačenie zahŕňa aj zatlačenie na rampu',
    'Hinausgeschoben gilt auch für das Schieben auf die Rampe',
    '押し出しにはスロープへ押し上げられた場合も含まれる',
  ],
  [
    'When an opponent accidentally pushes a robot out of bounds, the referee may waive the penalty, call pushed out and move the robot slightly back onto the field.',
    'Keď súper náhodne vytlačí robota mimo ihriska, rozhodca môže trest odpustiť, ohlásiť vytlačenie a robota mierne posunúť späť na ihrisko.',
    'Schiebt ein Gegner einen Roboter versehentlich ins Aus, darf der Schiedsrichter auf die Strafe verzichten, Hinausgeschoben ansagen und den Roboter leicht zurück aufs Feld schieben.',
    '相手が偶然ロボットを場外へ押し出した場合、審判はペナルティを免除し、押し出しを宣告して、ロボットを少しだけフィールド内へ戻すことができます。',
  ],
  [
    'The same applies when an opponent pushes a robot onto the ramp, the wedge along the walls.',
    'To isté platí, keď súper zatlačí robota na rampu, teda na klin pozdĺž stien.',
    'Dasselbe gilt, wenn ein Gegner einen Roboter auf die Rampe schiebt, den Keil entlang der Wände.',
    '相手がロボットをスロープ（壁沿いの傾斜部）へ押し上げた場合も同様です。',
  ],
  [
    'You may call pushed out and move the robot back before it reaches the wall.',
    'Môžete ohlásiť vytlačenie a vrátiť robota späť skôr, než dosiahne stenu.',
    'Du darfst Hinausgeschoben ansagen und den Roboter zurückschieben, bevor er die Wand erreicht.',
    'ロボットが壁に達する前に、押し出しを宣告してロボットを戻すことができます。',
  ],
  [
    'In a running match, a robot driven onto the wedge by an opponent raises an optional Pushed out decision. Leaving it is not scored as a missed call.',
    'V bežiacom zápase vyvolá robot zatlačený súperom na klin voliteľné rozhodnutie Pushed out. Ak ho necháte tak, nehodnotí sa to ako zmeškané rozhodnutie.',
    'Im laufenden Spiel löst ein vom Gegner auf den Keil geschobener Roboter eine optionale Entscheidung Pushed out aus. Sie auszulassen wird nicht als verpasste Entscheidung gewertet.',
    '進行中の試合では、相手にスロープへ押し上げられたロボットについて、任意の Pushed out 判定が発生します。何もしなくても、見逃しとしては採点されません。',
  ],

  // Kicker test
  [
    'Kicker power: a vertical test is piloted',
    'Sila kopacieho mechanizmu: pilotne sa skúša vertikálny test',
    'Kickerstärke: ein vertikaler Test wird erprobt',
    'キッカーの威力：垂直テストを試行',
  ],
  [
    'On-field test: the robot kicks from inside one goal at the opposite goal. It passes if the rebound does not reach the back wall of the goal it kicked from.',
    'Test na ihrisku: robot kope z vnútra jednej bránky na protiľahlú bránku. Vyhovie, ak odrazená lopta nedosiahne zadnú stenu bránky, z ktorej kopal.',
    'Test auf dem Feld: Der Roboter schießt aus einem Tor heraus auf das gegenüberliegende Tor. Er besteht, wenn der Abpraller die Rückwand des Tors, aus dem er geschossen hat, nicht erreicht.',
    'フィールド上でのテスト：ロボットは一方のゴールの中から反対側のゴールへ蹴ります。跳ね返ったボールが、蹴った側のゴールの奥壁に届かなければ合格です。',
  ],
  [
    'Pilot for the 2027 season: the robot lies on its back, the ball is placed in the ball-capturing zone and kicked straight up. It passes if the ball does not rise above 100 cm.',
    'Pilotne pre sezónu 2027: robot leží na chrbte, lopta sa vloží do zóny zachytenia lopty a vykopne sa kolmo nahor. Vyhovie, ak lopta nevystúpi nad 100 cm.',
    'Pilot für die Saison 2027: Der Roboter liegt auf dem Rücken, der Ball wird in die Ballfangzone gelegt und senkrecht nach oben geschossen. Er besteht, wenn der Ball nicht über 100 cm steigt.',
    '2027年シーズンの試行：ロボットを仰向けに置き、ボールをボール捕捉ゾーンに入れて真上に蹴ります。ボールが100 cmを超えなければ合格です。',
  ],
  [
    'The result no longer depends on how the goals of a particular field rebound. Teams can check it beside a wall with a measuring tape.',
    'Výsledok už nezávisí od toho, ako sa lopta odráža od bránok konkrétneho ihriska. Tímy si ho môžu overiť pri stene pomocou zvinovacieho metra.',
    'Das Ergebnis hängt nicht mehr davon ab, wie die Tore eines bestimmten Feldes den Ball zurückprallen lassen. Teams können es neben einer Wand mit einem Maßband prüfen.',
    '結果は、フィールドごとのゴールの跳ね返り方に左右されなくなります。チームは壁際でメジャーを使って確認できます。',
  ],
  [
    'The kicker test bench in the Rules tab shows the vertical test.',
    'Stanovisko pre test kopacieho mechanizmu na karte Pravidlá zobrazuje vertikálny test.',
    'Der Kickertest-Prüfstand im Tab „Regeln“ zeigt den vertikalen Test.',
    'ルールタブのキッカーテスト検証台は、垂直テストを表示します。',
  ],

  // Team size and editorial changes
  [
    'Team size note reworded',
    'Preformulovaná poznámka o veľkosti tímu',
    'Hinweis zur Teamgröße umformuliert',
    'チーム人数に関する注記の書き換え',
  ],
  [
    'A maximum of four team members was confirmed for the 2026 international competition, with five recommended wherever organizers can accommodate it.',
    'Pre medzinárodnú súťaž 2026 bol potvrdený maximálny počet štyroch členov tímu, pričom sa odporúča päť všade tam, kde to organizátori dokážu zabezpečiť.',
    'Für den internationalen Wettbewerb 2026 wurden maximal vier Teammitglieder bestätigt; fünf werden empfohlen, wo immer die Veranstalter das ermöglichen können.',
    '2026年の国際大会ではチームメンバーは最大4人と確認されており、主催者が対応できる場合は5人が推奨されています。',
  ],
  [
    'International competitions can guarantee a team size of four; a team size of five cannot be guaranteed. Five remains the recommendation for events that can accommodate it.',
    'Medzinárodné súťaže dokážu zaručiť veľkosť tímu štyri; veľkosť tímu päť zaručiť nemožno. Päť zostáva odporúčaním pre podujatia, ktoré to dokážu zabezpečiť.',
    'Internationale Wettbewerbe können eine Teamgröße von vier garantieren; eine Teamgröße von fünf kann nicht garantiert werden. Fünf bleibt die Empfehlung für Veranstaltungen, die das ermöglichen können.',
    '国際大会で保証できるチーム人数は4人で、5人は保証できません。対応できる大会では、引き続き5人が推奨されます。',
  ],
  [
    'Infrared ball section retitled',
    'Premenovaná časť o infračervenej lopte',
    'Abschnitt zum Infrarotball umbenannt',
    '赤外線ボールの節の見出し変更',
  ],
  [
    'Section 3.8 is titled for the 2026 ball change and says the new ball is used starting this year.',
    'Časť 3.8 je nazvaná podľa zmeny lopty v roku 2026 a uvádza, že nová lopta sa používa od tohto roku.',
    'Abschnitt 3.8 ist nach dem Ballwechsel 2026 benannt und sagt, dass der neue Ball ab diesem Jahr verwendet wird.',
    '3.8節の見出しは2026年のボール変更を指し、新しいボールは今年から使用すると書かれています。',
  ],
  [
    'The title now reads “2026 and beyond”. The 42 mm infrared ball stays in use for the main league.',
    'Názov teraz znie „2026 and beyond“. Infračervená lopta s priemerom 42 mm sa v hlavnej lige používa aj naďalej.',
    'Der Titel lautet jetzt „2026 and beyond“. Der 42-mm-Infrarotball bleibt in der Hauptliga im Einsatz.',
    '見出しは「2026 and beyond」になりました。メインリーグでは引き続き42 mmの赤外線ボールを使用します。',
  ],
  [
    'Change marks start again from 2026',
    'Značky zmien sa začínajú odznova od roku 2026',
    'Änderungsmarkierungen beginnen neu ab 2026',
    '変更マークは2026年を起点にリセット',
  ],
  [
    'Red text and the list of changes in the document mark what changed from 2025 to 2026.',
    'Červený text a zoznam zmien v dokumente označujú, čo sa zmenilo medzi rokmi 2025 a 2026.',
    'Roter Text und die Änderungsliste im Dokument markieren, was sich von 2025 zu 2026 geändert hat.',
    '文書内の赤字と変更点一覧は、2025年から2026年への変更を示しています。',
  ],
  [
    'The earlier marks are gone. Red text and the list of changes now mark only what changed from 2026 to 2027.',
    'Staršie značky zmizli. Červený text a zoznam zmien teraz označujú len to, čo sa zmenilo medzi rokmi 2026 a 2027.',
    'Die früheren Markierungen sind entfernt. Roter Text und die Änderungsliste markieren jetzt nur, was sich von 2026 zu 2027 geändert hat.',
    '以前のマークはなくなりました。赤字と変更点一覧は、2026年から2027年への変更だけを示しています。',
  ],

  // Source notice of the published draft page
  [
    'In the draft page published on 2026-09-18, sections 2.2 to 2.6 appear without headings inside section 2.1, and the sections after them are numbered 2.2 to 2.6. The Lab uses the intended numbering 2.1 to 2.11. Until the page is corrected, the text of the sections without a heading is part of one long paragraph in section 2.1.',
    'Na stránke návrhu zverejnenej 2026-09-18 sa časti 2.2 až 2.6 zobrazujú bez nadpisov vnútri časti 2.1 a časti za nimi sú očíslované 2.2 až 2.6. Lab používa zamýšľané číslovanie 2.1 až 2.11. Kým stránka nebude opravená, text častí bez nadpisu je súčasťou jedného dlhého odseku v časti 2.1.',
    'Auf der am 2026-09-18 veröffentlichten Entwurfsseite erscheinen die Abschnitte 2.2 bis 2.6 ohne Überschriften innerhalb von Abschnitt 2.1, und die folgenden Abschnitte sind mit 2.2 bis 2.6 nummeriert. Das Lab verwendet die beabsichtigte Nummerierung 2.1 bis 2.11. Bis die Seite korrigiert ist, steht der Text der Abschnitte ohne Überschrift in einem langen Absatz in Abschnitt 2.1.',
    '2026-09-18に公開されたドラフトのページでは、2.2〜2.6節が見出しのないまま2.1節の中に表示され、それ以降の節に2.2〜2.6の番号が付いています。Labは本来意図された2.1〜2.11の番号を使用します。ページが修正されるまで、見出しのない節の本文は2.1節の長い1段落の一部として表示されます。',
  ],
];

export default rows;
