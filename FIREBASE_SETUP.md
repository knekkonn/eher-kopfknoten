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
