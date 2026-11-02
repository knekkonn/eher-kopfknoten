# Community-Auswertung

Die Anmeldung und privaten Rundenergebnisse bleiben in Firebase. Der Worker `abgrund-community` prüft Firebase-ID-Tokens (Signatur, Projekt, Aussteller, Ablaufzeit) und speichert pseudonyme Spielmessungen in einer separaten Cloudflare-D1-Datenbank in der EU. Es gibt keinen Firebase-Administrationsschlüssel im Browser oder Worker.

Pro Frage gelten serverseitig 30 Sekunden. Wiederholtes Öffnen derselben Frage setzt den Startzeitpunkt nicht zurück. Browser und Server bewahren die Ablaufzeit auch bei Appwechsel, Hintergrundbetrieb und Neuladen. Übertragungsverzögerungen haben einen kurzen serverseitigen Toleranzbereich; der sichtbare Browser-Timer bleibt bei 30 Sekunden.

Nur bekannte, validierte Antworten aus bestätigten Konten gehen in die Häufigkeitsmessung ein. Ein Konto zählt pro Frage und Berliner Kalendertag einmal. Antworttexte werden dabei nicht gespeichert; gespeichert werden Frage-ID, kryptographische Antwortkennung, gehashte Nutzerkennung, Tag und servergemessene Antwortdauer. Übersprungene oder abgelaufene Fragen geben null Punkte und verändern keine Antwort-Häufigkeit.

Ein stündlicher Cron-Trigger prüft, ob die tägliche Berechnung für das aktuelle Berliner Datum fehlt. Berechnet wird ausschließlich aus abgeschlossenen Tagen der letzten 30 Tage. Je Frage sind mindestens zehn unterschiedliche Konten und 30 gültige Messungen erforderlich. Häufigkeit und mediane Antwortzeit werden geglättet mit den Archivpunkten kombiniert. Änderungen betragen maximal eine Seltenheitsstufe je Tag. Bei zu wenigen Daten bleiben Archivpunkte bestehen. Eine laufende Kontorunde behält dieselbe Punkteversion.

Der öffentliche Spielerdurchschnitt verwendet vollständig geprüfte Sieben-Fragen-Runden bestätigter Konten. Zuerst wird der Rundendurchschnitt je Person berechnet, anschließend der Mittelwert dieser Personen: Vielspieler erhalten kein größeres Gewicht. Einzelne Spieler werden öffentlich nicht identifiziert. Es gibt keine erfundenen Startwerte oder simulierten Community-Kurven. Rohmessungen und Community-Runden werden nach 90 Tagen gelöscht; private Firebase-Ergebnisse bleiben bestehen.

Offline- oder nicht vollständig prüfbare Runden bleiben privat spielbar und werden nicht in den öffentlichen Rundendurchschnitt eingerechnet. Unbestätigte E-Mail-Konten können privat synchronisieren; für die Community gibt es im Kontofenster die Schaltfläche zur E-Mail-Bestätigung. Google-Konten liefern die Bestätigung über Firebase.

Tests: `tests/archive.cjs`, `tests/timer.cjs`, `tests/community.cjs`, `tests/account-sync.cjs` und `tests/reported-answers.cjs`.
