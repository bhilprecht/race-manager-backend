# RaceManager

Bei Langstreckenkartrennen treten verschiedene Teams mit mehreren Fahrern pro Kart an, um Rennen zwischen 6 und 24h zu absolvieren. Dabei müssen für den Fahrereinsatz bestimmte Regeln erfüllt sein. Dazu gehören
- Maximale und minimale Fahrtzeiten pro Fahrereinsatz (Stint)
- Für Gesamtfahrzeiten für einen Fahrer bei einem Rennen gibt es ein Minimum.

Welcher Fahrer wie lange zu welcher Zeit gefahren ist, muss in einem Protokoll festgehalten werden.

Deshalb müssen die Einsätze der Fahrer vorher geplant werden. Außerdem muss auf Rennereignisse dynamisch reagiert werden wie zum Beispiel Unfälle, Unterbrechungen und schlechte Wetterverhältnisse.

Diese App soll die Fahrerplanung ermöglichen und aus der aktualisierten Fahrerplanung am Ende automatisch ein Fahrtenprotokoll ausgeben.

Funktionen

- Verwaltung des Teams und der Veranstaltungen
- Planen des Fahrereinsatzes
- Dynamisches Anpassen der Fahrereinsätze zur Rennzeit 
- Minimal- und Maximalzeiten sollen angezeigt werden
- Am Ende soll ein Protokoll ausgegeben werden

Mobile-Funktionalitäten

- Keine vollwertige Userverwaltung sondern Authentifizierung über Geräte-ID
- Sharing über Deep-Links
- ggf. Push-Notifications, falls man bald fahren muss und bei Änderungen

Abgrenzung

- keine Gewichtsplanung für Karts
- keine Rennsimulation (Spritverbrauch)
- keine strategischen Prognosen
- kein GPS-Tracking oder Tracken von Rundenzeiten (gibt es schon)
