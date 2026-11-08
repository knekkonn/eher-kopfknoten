# Sicherheitsprüfung – 8. November 2026

Diese Prüfung betrifft den lokalen Änderungssatz nach PR #10. Sie ist kein Nachweis einer Veröffentlichung. Deployment und abschließende CI-Ergebnisse werden nach ihrer tatsächlichen Ausführung dokumentiert.

## Geprüft und verbessert

- Firebase übernimmt Passwörter, Anmeldung und Zurücksetzen; die Anwendung speichert keine eigenen Passwort-Hashes. Die Projektkonfiguration wurde lesend geprüft: Schutz gegen E-Mail-Enumeration ist aktiviert. MFA ist nicht aktiviert.
- Firestore trennt private Spiele, Einstellungen, Frage-Rotation und Berichte nach Benutzer-ID. Freundschaftsanfragen und gegenseitige Statistikfreigaben werden durch Regeln begrenzt. Ein fremder Benutzer darf nicht über eine übergebene UID auf private Daten zugreifen.
- Neue Antwortmeldungen benötigen eine atomare Transaktion mit einem nicht zurücksetzbaren Tageszähler. Pro Account sind 80 automatische Meldungen möglich; explizite Meldungen können bis zum Gesamtlimit von 100 priorisiert werden. Wiederholte Übertragung derselben Meldung zählt nicht doppelt. Fehlgeschlagene Übertragungen bleiben lokal gespeichert und blockieren die laufende Runde nicht.
- Regeln verhindern das Überschreiben, Freigeben und Löschen von Meldungen durch Spielclients. Die Freigabe neuer Antworten bleibt ein getrennter, überprüfbarer Prozess. Die tägliche Prüfung darf keine ungeprüften Antworten automatisch ins Spiel übernehmen.
- Emulator-Tests prüfen unter anderem fremde UIDs, ungültige Felder, manipulierte Zähler, zukünftige Tage, Wiederholungen, 80/100-Grenzen und den Tageswechsel. Diese Tests sind lokal bestanden.
- Antwortdarstellung wurde mit einem HTML-/Eventhandler-Payload im echten Browser geprüft. Eingaben erscheinen als Text; der Payload wird nicht ausgeführt.
- Die Community-API validiert Firebase-Token, Herkunft, Größenlimits, Besitz der Runde, Reihenfolge und Zeitfenster serverseitig. Persönliche Offline-Spielstände sind weiterhin clientseitige Daten und keine manipulationssichere Rangliste.
- Entwicklungsabhängigkeiten sind mit Lockfile fixiert. Das transitive Node-gRPC-Paket wurde auf 1.14.7 aktualisiert. `npm audit` meldete danach null bekannte Schwachstellen. Dieses Paket gehört zum Testwerkzeug, nicht zum Browser-Spiel.
- Ein musterbasierter Scan über 219 eindeutige Textdatei-Versionen der Git-Historie und 84 aktuelle Dateien fand keine der geprüften privaten Schlüssel-/Token-Muster. Ein solcher Scan beweist nicht die Abwesenheit aller möglichen Geheimnisse.

## Grenzen und Betrieb

Firebase-Web-Konfigurationswerte sind öffentliche Projektkennungen; ihre Sicherheit beruht auf Authentifizierung und Datenbankregeln, nicht auf Geheimhaltung. Keine neuen privaten Zugangsdaten wurden in den Änderungssatz aufgenommen.

Die neue Berichtsquote begrenzt einen Account, nicht alle möglichen neu angelegten Accounts gemeinsam. App Check, globale Kostenobergrenzen und zusätzliche Missbrauchserkennung sind weiterführende Betriebsmaßnahmen. Provider-Limits ersetzen keine vollständige Last- oder Penetrationsprüfung. Zahlungs- und Datei-Upload-Flows existieren hier nicht und wurden nicht als erfolgreich geprüft ausgegeben.

Die neuen Regeln müssen passend zum neuen Client ausgerollt werden. Alte Clients ohne Quotentransaktion können nach dem Regelwechsel Berichte zunächst nur lokal puffern; nach Aktualisierung kann der neue Client sie übertragen. Freischaltungen und private Statistiken sind kosmetische/persönliche Funktionen und keine serververifizierten Wettbewerbsnachweise.

## Regelprüfung

Die Regeln wurden gezielt gehärtet und mit dem Emulator geprüft. Der verwendete Firebase-Regel-Workflow verlangt zusätzlich folgenden Hinweis für generierte Regeln:

> I've set up prototype Security Rules to keep the data in Firestore safe. They are designed to be secure for authenticated private game data, friendship access and bounded answer reports. However, you should review and verify them before broadly sharing your app. If you'd like, I can help you harden these rules.

Die oben dokumentierten Prüfungen sind bereits erfolgt; der Hinweis ist keine Behauptung einer unabhängigen Sicherheitszertifizierung.

## Quellen

- [Firebase API keys](https://firebase.google.com/docs/projects/api-keys)
- [Firebase Authentication limits](https://firebase.google.com/docs/auth/limits)
- [Email enumeration protection](https://docs.cloud.google.com/identity-platform/docs/admin/email-enumeration-protection)
- [gRPC advisory GHSA-m9gg-hp2v-232j](https://github.com/advisories/GHSA-m9gg-hp2v-232j)
