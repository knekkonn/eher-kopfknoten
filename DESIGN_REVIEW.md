# Design-Prüfung – 8. November 2026

Die Oberfläche wurde im echten Chrome bei 320, 390, 820, 1024 und 1440 Pixeln getestet. Menü, Dialog-Fokus, Escape/Tab, reduzierte Bewegung, gespeicherte Bewegungseinstellung, Rundeneingabe und horizontale Überläufe wurden geprüft. Die neuen sechs WebP-Skins laden im Browser; die Einzelrunden-Grenzen 0/100/200/400/600/700 sind unverändert getestet. Desktop-Startseite, mobile Runde und Skin-Galerie wurden zusätzlich anhand von Screenshots visuell geprüft.

Dabei wurde eine echte Regression gefunden und behoben: alte CSS-Regeln verkleinerten die neuen Text-Spans in Antwort-Buttons. Die Beschriftungen erben nun wieder Schriftgröße und Farbe ihres Buttons; ein Browser-Test sichert mindestens 14 px für den Abgabe-Button ab.

## Referenzwerkzeuge, keine behauptete Installation

Taste Skill 2.5.1 und Impeccable wurden aus den vom Nutzer genannten öffentlichen Repositories gelesen und lokal als Prüfreferenz verwendet. Die geposteten Marketplace-/Hook-JSONs wurden nicht als Beleg einer installierten Erweiterung behandelt. Es wurden keine globalen Stop-/PostToolUse-Hooks installiert.

Der manuelle Taste-Lauf meldete:

`GATE: FAIL 27 (round 1 of 3)`

Es wird ausdrücklich kein vollständiger Taste-Gate-Pass behauptet. Der überwiegende Teil der Meldungen verlangt die Struktur einer neu angelegten Marketingseite: jede Section exakt eine Bildschirmhöhe, `.wrap`-Kit-Container, ein zusätzliches „Moment“-Segment, Kit-Motion-CSS und mehrfach wiederholte Kauf-/Abschlussaktionen. Das passt nicht zum beauftragten bestehenden, zeitbegrenzten Spiel. Auch die vorhandene barrierefreie Sprungmarke und dekorative Spielszene wurden als Elemente außerhalb dieser Kit-Struktur gemeldet. Diese Vorschläge wurden nicht durch künstliche Seitenverlängerung oder Entfernen der Sprungmarke erfüllt. Es wurden weder Checker-Dateien verändert noch Browser-Erkennung eingebaut.

Die Impeccable-Quellprüfung meldet außerdem historische Glow-/Kleinschrift-Regeln in der großen bestehenden HTML-Datei und einen Kontrastwert für die bereits ausgeblendete alte Tiefen-Seitenleiste. Die neue `experience.css` überschreibt wesentliche alte Regeln. Deshalb wurden tatsächlich gerenderte Ansichten geprüft; die statische Prüfung wird nicht als vollständig warnungsfrei bezeichnet.

Die mobile Fußzeile wurde links ausgerichtet. Neue Icons bilden eine konsistente SVG-Familie; Achsen und Einheiten ergänzen echte Profilwerte. Die Startseite zeigt eine echte Frage mit tatsächlich geltenden Punkten. Es wurden keine erfundenen Nutzerzahlen, Erfolgsquoten oder Bewertungen ergänzt.
