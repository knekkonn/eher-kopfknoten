# Archivimport

Historischer Importstand: 2. November 2026. Alle 110 in der Archivübersicht verlinkten Dives vom 16. Juli bis 2. November wurden abgerufen: 770 Fragen und 707.449 gespeicherte Antwortzeilen.

704 deutsch nutzbare Fragen mit 588.129 Antwortzeilen wurden übernommen. 66 Aufgaben mit englischabhängigen Namens-, Schreib-, Reim- oder Silbenbedingungen wurden ausgeschlossen. Bereits vorhandene gleichwertige Fragen werden ergänzt. Engere Bedingungen (z. B. Länder an China statt alle Länder) bleiben eigene Fragen.

41.996 geprüfte Zuordnungen deutscher Schreibweisen und lokalisierter Werktitel stehen zusätzlich in den Antwortdateien. Eigennamen bleiben erhalten. Weitere deutsche Bezeichnungen können beim Antworten über eine exakte Wikipedia-Sprachverknüpfung auf eine bereits vorhandene englische Antwort aufgelöst werden; mehrdeutige Seiten werden abgewiesen. Alle Sprachvarianten erhalten denselben Punktwert. Es werden keine Antworten aus einem bloßen Vornamen ergänzt.

Die Zahlen sind gespeicherte Archivpunkte, keine beobachteten Spielerhäufigkeiten. Alle Archivantworten werden beim Import auf Annahme und Punktegleichheit getestet. Neue Community-Werte ersetzen die Ausgangspunkte erst bei ausreichender gemessener Stichprobe.

Die komprimierten Dateien enthalten jeweils einen Dive und werden erst bei Bedarf geladen. Der vollständige Import einschließlich Ausschlüssen ist in `archive-import-report.json` protokolliert. Quellen je Frage: `archive-manifest.json`.

Quellen:

- https://krilliongame.com/krillion-answers/ und die 110 dort verlinkten datierten Seiten; kurze Fragen wurden ins Deutsche übertragen, keine erläuternden Artikeltexte übernommen.
- Ding/FreeDict English–German 1.9-fd1: https://download.freedict.org/dictionaries/eng-deu/1.9-fd1/freedict-eng-deu-1.9-fd1.src.tar.xz. Urheber und Lizenzbedingungen: `ARCHIVE-DICTIONARY-LICENSE.txt`. Die aus diesem Wörterbuch abgeleiteten Übersetzungszuordnungen werden unter den dort genannten freien Lizenzen weitergegeben. Quellform und Konvertierungswerkzeuge sind über die verlinkte Originaldistribution verfügbar.
- Wikipedia-Sprachverknüpfungen für offizielle deutsche Werktitel, keine wörtlichen Übersetzungen von Filmtiteln.
- Pokémon-Speziesnamen: https://github.com/PokeAPI/pokeapi/blob/master/data/v2/csv/pokemon_species_names.csv.

Nachprüfung 4. November 2026: Die Datei für Dive 110 enthielt einen beschädigten Deflate-Datenstrom. Sie wurde aus der erneut abgerufenen datierten Quelle rekonstruiert. Damals: 589.649 Antwortzeilen und 41.174 geprüfte Alias-Zuordnungen. Diese Zahlen beschreiben den Stand vor dem folgenden Update. Details und verbleibende Übersetzungslücken: `COMPLETION_STATUS.md`.

## Nachprüfung vom 9. November 2026

Die [Krillion-Archivübersicht](https://krilliongame.com/krillion-answers/) und eine [zweite datierte Quelle](https://minutecryptic.today/krillion-answers/2026-11-03) enthalten zusammen sieben weitere gespeicherte Dives (#111–117, 3.–9. November) mit 49 Fragen und 296.026 Antwortzeilen. 40 Fragen mit 164.941 gespeicherten Antworten sind als neue, datierte Schnappschüsse übernommen. Die 117 lokalen Dive-Dateien enthalten nun insgesamt 744 Archiv-Frageneinträge und 754.590 gespeicherte Antwortzeilen. Die Gesamtzahl einzigartiger Spiel-Fragen kann geringer sein, weil mehrfach erschienene Kategorien zusammengeführt werden.

Neun Fragen wurden bewusst ausgelassen: Länder mit „and“ oder „in“ im englischen Namen und Orte mit „Great/Grand“ im englischen Namen lassen sich nicht ohne Änderung der Antwortbedingung auf deutsche Namen übertragen. Eine Liste proteinreicher Lebensmittel enthielt unter anderem „Aardvark“; eine Liste von Spielzeugmarken führte auch Händler. Diese Listen wären als geprüfte Antwortbasis irreführend. Beim zusätzlichen Dive #111 enthielten Listen zu aktuellen Serien, Hautpflegemarken, Teamsportarten und Regierungsmitgliedern ebenfalls unpassende oder schnell veraltende Einträge. Die ausgeschlossenen Quellenfragen sind im Importbericht benannt.

Die Quellen sind unabhängige, öffentlich lesbare [gespeicherte Tageslisten](https://krilliongame.com/content-sources/) und keine offizielle Live-Prüfung. Das [offizielle Krillion-Archiv](https://krillion.io/archive) verlangt eine Freischaltung für ältere Runden; Dive #111 vom 3. November stammt aus einer [zweiten datierten Quelle](https://minutecryptic.today/krillion-answers/2026-11-03), da er in der ersten unabhängigen Übersicht fehlte. Abfragen mit veränderlichen Grenzen (z. B. Hörerzahlen, IMDb-Stimmen und Einwohnerzahlen) beziehen sich auf den jeweiligen Aufnahmetag. Die gespeicherten Punktstufen sind keine gemessenen ABGRUND-Spielerhäufigkeiten.

Für die neue allgemeine Pokémon-Frage wurden 841 deutsche Namensvarianten anhand der bereits dokumentierten PokeAPI-Speziesnamendatei zu ihren englischen Namen mit identischer Punktzahl verknüpft. Dazu kommen 85 gezielte deutsche Alltagsbegriffe für Ballonarten, Spieleinstellungen, Sportziele, Haushaltsrechnungen, Werbung und Körperteile. Die englischen Originalbegriffe bleiben gültig und behalten denselben Punktwert.

Die Antwortdateien für alle 40 neu übernommenen Fragen enthalten die vollständigen gespeicherten Original-Listen samt Punktstufen. Deutsche Bezeichnungen werden nur für eindeutig zuordenbare Antworten ergänzt; Eigennamen und Arten ohne verlässlich belegten deutschen Namen bleiben im Original. Unbekannte deutsche Bezeichnungen können weiterhin über eine exakte Sprachverknüpfung geprüft werden.
