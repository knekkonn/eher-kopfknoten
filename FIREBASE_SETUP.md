# ABGRUND Firebase

Projekt: `krillion-d74e1`. Die öffentliche Web-Konfiguration liegt in `firebase-config.js`.

Am 2. November 2026 eingerichtet:

- Authentication: Google und E-Mail/Passwort aktiviert, öffentlicher Name ABGRUND.
- Autorisierte Webadresse: `knekkonn.github.io` zusätzlich zu den Firebase-Domains und localhost.
- Firestore: Enterprise/native, Datenbank-ID `abgrund`, Standort `europe-west3` (Frankfurt), Echtzeitaktualisierungen aktiv. Spark-Tarif beibehalten; keine kostenpflichtigen Sicherungen aktiviert.
- `accounts.js` verwendet die explizite Datenbank-ID aus `ABGRUND_FIRESTORE_DATABASE`.
- Echtzeit-Listener sind erforderlich, damit Rundenergebnisse auf mehreren Geräten automatisch aktualisiert werden; daher verwendet die App Core-Abfragen statt Pipelines.
- `firestore.rules` veröffentlicht: nur Kontoinhaber können eigene Runden lesen und gültige Ergebnisse schreiben. Identische Wiederholungen sind erlaubt; Änderungen und Löschen werden abgewiesen.

Live geprüft mit zwei temporären Testkonten: Registrierung und Passwortanmeldung, Schreiben und Lesen eigener Ergebnisse, identische Wiederholung, Ablehnung fremder und unangemeldeter Zugriffe, Ablehnung von Werten über 700 und Ergebnisänderungen. Testkonten anschließend gelöscht. Ein synthetisches Testdokument (123 Punkte) bleibt unter einer nicht mehr anmeldbaren Test-UID; keine echten Nutzerdaten.

Die Google-Anmeldemethode wurde in der Konsole aktiviert. Der tatsächliche Popup-Ablauf auf der veröffentlichten Website und die Synchronisierung auf zwei physischen Geräten müssen separat geprüft werden.

## Nachprüfung am 4. November 2026

Nach offizieller Anmeldung wurden Projekt, Datenbankedition, Frankfurt und aktive Echtzeitaktualisierungen live bestätigt. Der zuvor aktive Regelstand erlaubte nur Rundenergebnisse; die im Repository bereits vorhandenen Regeln für Rotation, Präferenzen und `rejectedAnswers` fehlten live. Diese Regeln wurden mit dem Firebase-MCP validiert, am 4. November erfolgreich veröffentlicht und für die benannte Datenbank anschließend erneut gelesen und mit der lokalen Datei verglichen. Ruleset: `e1bdae4c-182d-4ecd-a549-cd595d46917a`.

Für den täglichen Prüflauf wurde ein schlüsselloser, auf das genaue GitHub-Repository, `main` und die Review-Workflowdatei beschränkter Workload-Identity-Zugang eingerichtet. Das Dienstkonto besitzt ausschließlich datenbankbezogene Leserechte und kann weder Punkte noch Antworten ändern. Details und Nachweise: `COMPLETION_STATUS.md`. Der erste manuelle Live-Prüflauf war erfolgreich, die Warteschlange war leer. Ein GitHub-Zeitplanlauf ist damit noch nicht nachgewiesen.

Live mit zwei temporären Konten geprüft: gleichzeitige Transaktionen zweier Instanzen desselben Kontos, disjunkte Fragenpakete, private Präferenzen, Erstellen eines abgelehnten Antwortvorschlags, Verweigerung fremder/unangemeldeter Zugriffe, UID-Fälschung, Werte über 700 und Ergebnisänderungen. Identische Wiederholung eines Uploads erlaubt. Testkonten und synthetische Testdokumente anschließend entfernt.
