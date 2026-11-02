# ABGRUND: Konten aktivieren

Die Anmeldungen bleiben verborgen, solange in `firebase-config.js` keine Konfiguration steht. Bis dahin funktioniert das Spiel als Gast.

1. In der [Firebase Console](https://console.firebase.google.com/) ein eigenes Projekt für ABGRUND erstellen oder ein ausdrücklich dafür freigegebenes Projekt auswählen.
2. Unter **Projekteinstellungen → Allgemein → Deine Apps** eine Web-App hinzufügen und das angezeigte `firebaseConfig`-Objekt kopieren. Es enthält öffentliche Projektkennungen, keine Admin-Anmeldedaten.
3. In `firebase-config.js` `null` durch das Objekt ersetzen. Mindestens `apiKey`, `authDomain`, `projectId` und `appId` müssen vorhanden sein. Keine Service-Account-Dateien, Passwörter oder privaten Schlüssel ins Repository kopieren.
4. Unter **Authentication → Sign-in-Methode** sowohl **E-Mail/Passwort** als auch **Google** aktivieren. Bei Google Support-E-Mail und Projektname festlegen.
5. Unter **Authentication → Einstellungen → Autorisierte Domains** `knekkonn.github.io` hinzufügen. Die bestehende Firebase-Domain beibehalten.
6. Unter **Firestore Database** eine Datenbank erstellen. Unter **Regeln** den Inhalt von `firestore.rules` veröffentlichen. Die Regeln gestatten ausschließlich angemeldeten Nutzern den Zugriff auf ihre eigenen Rundenergebnisse. Nicht im offenen Testmodus betreiben.
7. Erst danach diese Änderungen veröffentlichen und auf zwei verschiedenen Geräten mit einem Testkonto prüfen: Registrierung, Anmeldung beider Methoden, Gastübernahme, neue Runde, Synchronisierung, Abmeldung und Anmeldung mit einem anderen Konto.

Gespeicherte Rundenergebnisse enthalten nur Punkte, optionale Tagesangabe und eine zufällige Runden-ID. Gastdaten werden beim Anmelden einmalig auf diesem Gerät in das gewählte Konto übernommen; bereits mit einem anderen Konto synchronisierte Daten werden nicht übernommen. Die Synchronisierung ist für die auf diesem Gerät weiterhin gespeicherten Runden auch nach einem vorübergehenden Verbindungsverlust erneut möglich.
