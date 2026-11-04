# ABGRUND – überprüfter Stand am 4. November 2026

Ausgangspunkt: `main` bei `bdeae03` (PRs #4–#8). Referenzchat „Übersetzung und Spielupdates“ wurde gelesen. Der lokale Ordner war zunächst leer.

## Umgesetzt und lokal geprüft

- Sieben Fragen, maximal 700 Punkte; Skin-Grenzen bleiben 0/100/200/400/600/700 nach bester Einzelrunde.
- Neue Runden angemeldeter Nutzer reservieren ihre Fragen in einer Firestore-Transaktion auf `users/{uid}/profile/rotation`. Gleichzeitige Geräte werden durch Transaktionswiederholungen serialisiert. Ein fehlgeschlagener Zugriff startet keine unsynchronisierte Ersatzrunde. Gastspiele bleiben lokal.
- Zykluswechsel funktionieren auch mitten in einem Siebenerpaket: kein erneutes Verwenden bereits verbrauchter Fragen vor vollständiger Ausschöpfung. Neun Runden Abstand werden bevorzugt, soweit die verfügbare Fragenmenge das zulässt. Verschiedene Konten haben eigene Verläufe; es gibt absichtlich keinen gemeinsamen globalen Verbrauch zwischen fremden Konten.
- Gezielte Ergänzungen in `reviewed-answers.js`: Coffee Fellows bei Coffeeshops, Ohrenwärmer bei Winterkleidung/Kleidung, Hermes bei griechischen Gottheiten, Pampelmuse/Physalis bei Eissorten, Togarashi bei Kräutern/Gewürzen. Keine pauschale Zulassung in ähnlich klingenden, engeren Kategorien. Die Ergänzungen werden nach Archiv-Nachladen erneut angewandt.
- Explizite Synonyme erhalten denselben kanonischen Punktwert. Vorhandene Werte des gewählten kanonischen Archiveintrags bleiben erhalten; neue redaktionelle Schätzungen sind als solche im Datenmodell markiert. Ein bereits separat bewertetes Synonym kann durch diese ausdrückliche Gleichsetzung andere Punkte erhalten. Archivwerte sind keine gemessenen deutschen Spielerhäufigkeiten.
- `Leonardo di` schlägt Leonardo DiCaprio vor; `Johnny` allein enthüllt keinen vollständigen Namen. Vorschläge müssen ausdrücklich ausgewählt werden.
- Beschädigte Datei `archive-data/dive-110.json.gz` rekonstruiert. Der alte Deflate-Datenstrom war ungültig. Quelle vom 4. November erneut geladen; intakte alte Aliaszeilen soweit möglich erhalten. Aktuell 589.649 Archiv-Antwortzeilen und im Archivtest 41.174 geprüfte Alias-Zuordnungen. Historische Importzahlen in älteren Dokumenten sind keine aktuelle Bestandsmessung.
- Abgelehnte Antworten angemeldeter Nutzer werden zuerst in einer lokalen, kontogetrennten Warteschlange gespeichert und bei Verbindung an Firestore übertragen; Wiederholung alle 30 Sekunden und beim Online-Ereignis. Maximal 100 ausstehende Einträge pro Konto und Gerät; ältere Einträge werden bei Überlauf verdrängt. Leere/überlange Antworten werden nicht übertragen. Nach unklarer Netzwerkbestätigung sind doppelte Servereinträge möglich; tägliche Auswertung gruppiert identische Frage/Antwort-Paare.
- Updatehinweis wird pro Konto/Version durch eine Transaktion beansprucht. Cache-Snapshots lösen ihn nicht aus. Bei gleichzeitig geöffneten Geräten zeigt nur eines den Hinweis; bei einem Absturz direkt nach der Reservierung kann der Hinweis unangezeigt als gesehen gelten.
- Profil- und Spiele-Listener werden bei Kontowechsel beendet; verspätete Antworten verworfen. Laufende Antwortprüfungen schreiben nach einem Kontowechsel keine Punkte in das andere Konto. Eine alte Runde muss unter ihrem ursprünglichen Konto fortgesetzt werden.
- JSON-Export eigener Ergebnisse im Kontodialog. Bereits bestehend: Passwort-Reset, E-Mail-Bestätigung, Google/E-Mail-Verknüpfung, Erfolge und Rundengeschichte.
- Guest-Skin wird sofort ohne Firebase-Netzwerkantwort angezeigt. Touch-Eingabeschrift mit 16 px verhindert typisches iOS-Eingabezoom; flexible Kopfzeile, scrollbare Dialoge und systemweite Bewegungsreduktion ergänzt.
- Service Worker lädt beim Update keine laufenden Fenster zwangsweise neu.
- Automatischer GitHub-Testworkflow; aus vorhandenen Tests entfernte Abhängigkeit von undefinierten lokalen Pfadvariablen.

## Tägliche Prüfung und kontrollierte Freigabe

`.github/workflows/daily-answer-review.yml` ist täglich für 05:17 UTC geplant (06:17 MEZ / 07:17 MESZ). GitHub-Zeitpläne können verspätet ausgeführt werden. Der Lauf liest die Firebase-Warteschlange, gruppiert Dubletten und prüft eine begrenzte Auswahl exakt gegen die lokal veröffentlichten Antwortlisten. Unbekannte Antworten bleiben zur menschlichen Sachprüfung offen. Freitext wird weder ausgeführt noch an eine KI gesendet. Öffentliche Protokolle/Artefakte enthalten nur Summen, keine Antworten, UIDs oder Zugangstoken.

Freigabe neuer Antworten: Ein berechtigter Betreuer liest die konkreten Einträge in der Firebase-Konsole, prüft Kategorie und belastbare Quelle, ergänzt gezielt `reviewed-answers.js`, führt die Tests aus und gibt den PR frei. Erst die veröffentlichte Codeänderung erweitert die akzeptierten Antworten. Der tägliche Dienst besitzt ausschließlich Leserechte; er kann weder Antworten freigeben noch Konten oder Punkte ändern.

## Live-Firebase-Prüfung nach autorisierter Anmeldung

Die offizielle Firebase-Anmeldung wurde in dieser Sitzung erfolgreich abgeschlossen. Projekt `krillion-d74e1` und Datenbank `abgrund` sind live bestätigt: Enterprise/native, `europe-west3`, optimistische Transaktionen und Echtzeitaktualisierungen aktiv; Free Tier. Der Tarif wurde nicht geändert.

Die bisher veröffentlichten Regeln enthielten ausschließlich die privaten Rundenergebnisse. Rotation, Präferenzen und Warteschlange waren deshalb tatsächlich blockiert. Der vorige Regelstand wurde lokal gesichert, die vorhandenen Repository-Regeln mit dem Firebase-MCP-Validator geprüft („No errors detected“) und erfolgreich ausschließlich als Firestore-Regeln veröffentlicht. Anschließendes erneutes Lesen des benannten Datenbank-Releases bestätigt exakte Übereinstimmung mit `firestore.rules`. Neuer Ruleset: `e1bdae4c-182d-4ecd-a549-cd595d46917a`.

Der tägliche Dienst wurde ohne private Schlüssel eingerichtet:

- Service Account: `abgrund-answer-review@krillion-d74e1.iam.gserviceaccount.com`.
- Workload Identity Provider: `projects/1054616756639/locations/global/workloadIdentityPools/abgrund-github/providers/answer-review`.
- Vertrauen beschränkt auf numerische Repository-ID `1441115891`, Eigentümer-ID `347604765`, Repositoryname, `main` und genau die Datei `daily-answer-review.yml`; erlaubte Ereignisse: Zeitplan, manueller Start und initialer/aktualisierender Push auf main.
- Rolle `roles/datastore.viewer`, per IAM-Bedingung auf Datenbank `abgrund` begrenzt. Diese Rolle erlaubt Lesen in dieser Datenbank; das Prüfprogramm selbst liest nur `rejectedAnswers`. Keine Schreibrolle, keine Freigaberechte, keine Administrationsrechte, kein privater Service-Account-Schlüssel erstellt.
- Die öffentlichen Provider-/Kontonamen sind direkt im Workflow hinterlegt; zusätzliche GitHub-Variablen oder Secrets sind nicht erforderlich.

Ein erster live ausgeführter Prüflauf mit der autorisierten Verwaltungssitzung war erfolgreich: am 4. November 2026 um 20:38:58 UTC wurden null Warteschlangeneinträge gefunden. Das passt dazu, dass die vorherigen Regeln das Anlegen dieser Einträge verboten. Dieser manuelle Lauf belegt noch keinen GitHub-Zeitplanlauf. Der erste GitHub-Lauf wird beim Merge durch den main-Push ausgelöst; spätere Tagesläufe sind separat an ihrem erfolgreichen Workflow-Ergebnis zu überprüfen.

## Grenzen und weiter notwendige Produktarbeit

- Die Datenbank ist umfangreich, aber nicht vollständig deutsch übersetzt oder erschöpfend für jede mögliche richtige Antwort. Viele Archivantworten sind weiterhin englische Fachbegriffe. Ein vollständiges deutsches, fachlich geprüftes Lexikon aller offenen Kategorien lässt sich aus den bestehenden Quellen nicht automatisch zuverlässig erzeugen. Exakte deutsche Sprachverknüpfungen und geprüfte lokale Aliase bleiben aktiv; unbekannte Antworten bleiben prüfbar statt pauschal akzeptiert.
- Rückwirkende Punkte sind für alte Warteschlangeneinträge **nicht sicher rekonstruierbar**: Diese speichern nur UID, Frage, Antwort und Zeitpunkt, ohne belastbare Runde, Frageposition, endgültige Antwort und bereits vergebene Punkte. Es gibt deshalb keine automatische Nachvergütung. Vor einem solchen Feature sind serverseitig nachgewiesene Runden und ein idempotentes Freigabe-/Korrekturprotokoll erforderlich. Auch vorhandene Firebase-Ergebnisse sind vom Client gemeldete Werte, kein manipulationssicherer Punktnachweis.
- Die vorhandene Community-Komponente besitzt eigene serverseitige Antwortvalidierung in `community/worker.js`. Der konfigurierte Cloudflare-Endpunkt ist lesend erreichbar; sein aktueller Quellstand und eine Veröffentlichung dieser Änderungen dort sind nicht bestätigt. Neue ausschließlich lokale Antworten sind nicht automatisch auch im Community-Validierungsindex enthalten; dieser muss bei aktiviertem Community-Backend passend aktualisiert werden.
- Keine Aussage über Live-Veröffentlichung durch GitHub Pages oder Firebase. Merge und erfolgreicher lokaler Test sind keine Deploymentbestätigung.
- Lokale Browseransichten sind keine physischen iPad-/Safari-Tests. Google-Popup, reale Geräte-Synchronisierung, einmalige Updatehinweise über zwei echte Browser-Sitzungen benötigen ergänzende End-to-End-Prüfung.

## Reproduzierbare Prüfungen

`node scripts/test.cjs` führt Account-/Transaktions-, Antwort-, Archiv-, Community-, Rotations- und Timerprüfungen aus. Community-Tests verwenden SQLite und Python 3; Firebase-Kontotests verwenden ein Mock-Backend und belegen kein Live-Verhalten. Archivprüfung lädt alle 110 lokalen Dateien, prüft Annahme und Quellpunkte samt dokumentierten redaktionellen Synonymkorrekturen.

Transaktionsgrundlage: [Firebase-Dokumentation](https://firebase.google.com/docs/firestore/manage-data/transactions).
Quellen der Ergänzungen: [Coffee-Fellows-Angebot](https://www.coffee-fellows.com/produkte/bagelsundsnacks), [Standorte](https://www.coffee-fellows.com/en/locations). Die übrigen genannten Korrekturen sind eng gefasste redaktionelle Ergänzungen entsprechend dem Projektauftrag; spezifische Produktverfügbarkeit oder Popularität wird daraus nicht behauptet.

Zusätzliche lokale Browserprüfung: Chrome mit Ansichten 390×844, 768×1024 und 1024×768; Rundenstart und Fragenladen ohne JavaScript-Fehler oder horizontales Überlaufen. Separater Browsertest mit nachgestelltem Firebase prüft alle sechs Einzelrunden-Freischaltungen, Skin-Ersatz in `#diver`, Updatehinweise nur für Accounts, Unterdrückung nach erneutem Login und Listener-Abmeldung. Automatisiert unter `tests/browser/`; kein Live-Firebase-Nachweis.

Der konfigurierte öffentliche Community-Endpunkt `/stats` antwortete bei der rein lesenden Prüfung am 4. November 2026 erfolgreich. Dies bestätigt seine Erreichbarkeit, aber weder seinen aktuellen Quellstand noch ein Deployment dieser Änderungen.

Live-Regeltest mit temporären Firebase-Accounts am 4. November 2026: Zwei gleichzeitig angemeldete Instanzen desselben Testkontos reservierten erfolgreich zwei disjunkte Fragenpakete; der Serververlauf stand anschließend auf Runde 2. Eigene Präferenzen und das Erstellen eines Warteschlangeneintrags funktionierten. Fremde sowie unangemeldete Zugriffe, eine fremde UID im Warteschlangeneintrag, ein Ergebnis über 700 und das nachträgliche Ändern eines gespeicherten Ergebnisses wurden abgewiesen. Identisches erneutes Hochladen eines Ergebnisses funktionierte. Die synthetischen Testdokumente und beide Testkonten wurden danach entfernt. Es wurden keine bestehenden Nutzerkonten oder Rundenergebnisse geändert.

## Nachtrag: deutsche Darstellung, Meldungen und soziale Profile

PR #9 wurde nach grünen GitHub-Prüfungen zusammengeführt. Die Seitenveröffentlichung und der initiale automatische Antwort-Prüflauf waren erfolgreich. Der weiterführende, aktuelle Stand mit deutscher Priorität, geänderten Zustelldienst-/Guam-Punkten, Sofortmeldungen, Profilstatistiken, Freundschaften und zusätzlichen Live-Deployments ist in `GERMAN_SOCIAL_UPDATE.md` dokumentiert. Frühere Absätze dieses Dokuments beschreiben den geprüften Grundstand von PR #9.
