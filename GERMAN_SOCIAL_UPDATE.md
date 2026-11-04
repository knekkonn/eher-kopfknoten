# Deutsch zuerst, Wortmeldungen, Profile und Freunde

Stand: 4. November 2026. Ergänzt den Grundstand aus PR #9.

## Sprache und Antwortprüfung

Alle 864 geladenen Fragen und 642.421 Antwortvarianten wurden automatisch auf Annahme, Darstellungsnamen und Punktegleichheit geprüft. Keine Frage ist ohne lokale Antwortliste. `german-answer-audit.json` enthält den Bericht je Frage. 65.207 Darstellungen verwenden eine vorhandene deutsche Entsprechung mit gleichem Punktwert. Das sind Vorkommen, keine Anzahl unterschiedlicher Wörter oder eine Behauptung vollständiger fachlicher Übersetzung.

Deutsche Bezeichnungen werden bei Vervollständigungen, den Beispielen und in Ergebnissen bevorzugt; eine englische Ausgangsbezeichnung wird beim Vorschlag sekundär angezeigt und bleibt als Eingabe gültig. Eigennamen und nicht belegte Übersetzungen werden nicht erfunden. Die interne Antwortidentität bleibt für die Punktvergabe stabil. Mehrstufige Namens-Aliase werden bis zur kanonischen Antwort aufgelöst; dadurch erhalten etwa Kurz-/Tippvarianten desselben Spielers keine abweichenden Punkte.

Explizite neue Punktregeln:

- Zustelldienst: DHL 10, DoorDash 60 (der bisherige DHL-Wert), Deutsche Post 10. Deutsche Post war bereits vorhanden. DHL Express, Door Dash und Deutsche Post AG werden passend zugeordnet; Hermes wird bei Zustelldiensten als Variante von Hermes Europe erkannt.
- Guam 60 in den drei Kategorien, in denen es hier gültig ist: abhängiges Gebiet/Landesteil/autonome Region, Land oder abhängiges Gebiet sowie die im Quellenarchiv enthaltene Parfum-/Duftmarke. Guam wird nicht als souveräner Staat oder Karibik-/Mittelmeerinsel hinzugefügt.
- Diese redaktionellen Regeln gelten auch vor gemessenen Community-Werten. Bereits abgeschlossene Runden werden nicht nachträglich umgeschrieben.

Die neue Live-Prüfung ist bewusst auf zwölf ausdrücklich zugeordnete Kategorien begrenzt, darunter Zustelldienste, Coffeeshop-Ketten, Gewürze, chemische Elemente und Musikinstrumente. Sie akzeptiert nur den eingegebenen vollständigen Begriff bzw. eine passende Weiterleitung und eine genaue, zulässige Wikipedia-Kategorie; mehrdeutige Seiten und etwa Kampfsportfilme statt Kampfkünste werden abgewiesen. Vorhandene spezialisierte Wörterbuch-/Wikidata-Prüfungen und deutsche Sprachverknüpfungen bleiben zusätzlich bestehen.

Neue, ausschließlich live belegte Antworten erhalten vorläufig 30 Punkte, ausdrücklich als Schätzung angezeigt. Daraus wird keine beobachtete deutsche Spielerhäufigkeit oder automatisch ein 100-Punkte-Treffer behauptet. Eine Live-Prüfung hängt von der Erreichbarkeit und den Daten der externen Quelle ab; sie ersetzt keine universelle semantische Prüfung aller denkbaren Antworten. Positive Nachweise werden einen Tag lokal zwischengespeichert. Ungeklärte Begriffe können gemeldet werden.

## Meldungen ohne Unterbrechung

Nach einer nicht erkannten Antwort sehen angemeldete Nutzer „Begriff melden & weiterspielen“. Der Klick speichert die Meldung sofort lokal, leert das Eingabefeld und setzt den Fokus zurück. Es gibt weder Punkteabzug noch eine zusätzliche Zeitsperre und keinen wartenden Netzwerkdialog. Der bestehende Rundentimer wird dabei weder zurückgesetzt noch angehalten.

Explizite Meldungen erhalten `priority: 1`, automatische Erfassungen `priority: 0`. Der tägliche Prüflauf sortiert explizite Meldungen vor normalen Einträgen; innerhalb einer Priorität rotiert die begrenzte Auswahl täglich. Die lokale Warteschlange hält bis zu 100 Einträge und bevorzugt dabei explizite Meldungen. Offline bedeutet die Bestätigung „vorgemerkt“; die Übertragung erfolgt später automatisch. Mehrere Servereinträge desselben Begriffs werden zur Prüfung gruppiert. Eine Meldung ist keine automatische Freigabe einer Antwort.

Der schlüssellose GitHub-Prüflauf wurde nach PR #9 tatsächlich erfolgreich ausgeführt: [Lauf 41909619743](https://github.com/knekkonn/eher-kopfknoten/actions/runs/41909619743). Der Tageszeitplan ist 05:17 UTC, entsprechend 06:17 MEZ bzw. 07:17 MESZ; GitHub kann geplante Ausführungen verzögern. Ein erfolgreicher Startlauf belegt keine Garantie zukünftiger Tagesläufe.

## Profil und Freunde

Das Profil bietet 19 Kennzahlen: Runden, beste Runde, Punktedurchschnitt, Gesamtpunkte, perfekte 700er-Runden, durchschnittliche/schnellste/langsamste gültige Abgabezeit, Antworten unter fünf Sekunden, richtige Antworten, Skips, echte Zeitabläufe, ungültige Versuche, Meldungen, seltene Treffer, 100-Punkte-Antworten sowie Antwort-, Skip- und Timeout-Quote. Hinzu kommen kleine Verlaufssäulen, ein Balken für das Antwortverhalten und passende spielerische Abzeichen.

Neue abgeschlossene Runden synchronisieren ausschließlich zusammengefasste Messwerte mit dem privaten Ergebnis, keine einzelnen Antworttexte. Durchschnittszeiten beziehen sich auf gültige, tatsächlich gemessene Abgaben und den Zeitpunkt des Absendeversuchs, nicht auf nachfolgende Prüfwartezeit. Skips und echte Zeitabläufe werden getrennt gezählt. Alte Rundenergebnisse bleiben erhalten; für sie werden keine Zeiten erfunden. Das Profil nennt ausdrücklich die Zahl der Runden mit Detailmessungen.

Freundschaften funktionieren über zufällige 128-Bit-Freundescodes. Es gibt keine öffentliche E-Mail-/Nutzersuche und kein auslesbares Codeverzeichnis. Die Anfrage steht bei beiden Beteiligten auf „ausstehend“. Nur der Empfänger kann sie mit einem passenden atomaren Update beider Seiten annehmen. Erst danach dürfen beide die zusammengefassten Profilstatistiken lesen. Private Rundendokumente, E-Mail-Adressen und einzelne Antworten bleiben auch Freunden verborgen. Entfernen entzieht den gegenseitigen Profilzugriff.

Im Endbildschirm erscheint der Durchschnitt bestätigter Freunde mit synchronisierten Runden. Zuerst wird pro Person ihr Rundendurchschnitt berechnet, dann über die Personen gemittelt; Vielspieler erhalten kein größeres Gewicht. Profile und Ergebniswerte sind persönliche, vom Client gemeldete Daten mit serverseitiger Schema-/Zugriffskontrolle, keine manipulationssichere Wettbewerbsrangliste.

## Validierung und Live-Nachweise

- Alle bisherigen lokalen Prüfungen sowie neue Sprach-, Live-Check-, Statistik- und Prioritätsprüfungen bestehen.
- Browserprüfungen bei 390, 768 und 1024 Pixel Breite; zusätzliche nachgestellte Firebase-Abläufe für Meldung mit sofort geleertem Feld und unverändertem Timer sowie Anfrage/Annahme/Entfernen und Freundesvergleich.
- Separater Firestore-Emulator prüft Besitzer-/Fremdzugriffe, Zustimmung, einseitige und selbst angenommene Anfragen, Widerruf, Codeverzeichnis, Statistikfelder, Messwerte, unveränderliche Ergebnisse, unzulässige Priorität und falsche Rotationselement-Typen.
- Die neuen Regeln wurden zusätzlich mit dem Firebase-MCP validiert und ausschließlich für Firestore veröffentlicht. Ruleset `f0513ed8-029d-4d27-87eb-4319590ff46a` wurde für die benannte Datenbank `abgrund` zurückgelesen und stimmt exakt mit der Datei überein.
- Live-Test mit drei temporären Firebase-Konten: Codes, private Profile vor Annahme, Annahme nur durch den Empfänger, gegenseitiger Statistikzugriff danach, Ablehnung fremder Zugriffe und privater Rundenzugriffe, Widerruf, Speicherung von Messwerten und priorisierten Meldungen. Alle Testkonten und Testdokumente anschließend gelöscht; bestehende Nutzerdaten nicht geändert.
- Cloudflare-Worker mit unveränderter D1-Anbindung und Kompatibilitätseinstellung veröffentlicht: Deployment `db15eb81858748509f3a1d6f9160cb78`. Live `/health` bestätigt `abgrund-community-v2`; `/scores` bestätigt DHL 10, DoorDash 60, Deutsche Post 10 und Guam 60. Voriger Live-Code wurde vollständig mit dem bisherigen Hauptbranch abgeglichen und gesichert.
- Ein echter iPad-/Safari-Test, echte Google-Popup-Anmeldung und eine umfassende fachliche Einzelprüfung sämtlicher Archivbegriffe bleiben separate Grenzen. Die automatischen Prüfungen belegen Code-, Zuordnungs- und Punkte-Konsistenz, keine erschöpfende linguistische oder sachliche Richtigkeit jedes importierten Begriffs.

## Reproduzieren

`node scripts/test.cjs` prüft die lokalen Funktionen einschließlich aller Antwortvarianten. `WRITE_GERMAN_AUDIT=1 node tests/german-first.cjs` erstellt den Fragenbericht neu. Für die Regeln: `npx -y firebase-tools@latest emulators:exec --only firestore --project demo-abgrund --config firebase.emulator.json "node tests/firestore.cjs"` mit Java 21 und den in CI angegebenen Firebase-Testabhängigkeiten. Browserprüfungen stehen unter `tests/browser/` und verwenden Playwright. Die CI führt Regeln und Browser getrennt aus.
