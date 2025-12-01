# Google AdSense Integration Anleitung

## Schritt 1: Google AdSense Account erstellen

1. Gehe zu [Google AdSense](https://www.google.com/adsense/)
2. Melde dich mit deinem Google-Konto an (bnjmnlssmnn@gmail.com)
3. Klicke auf "Get Started" / "Jetzt starten"
4. Gib deine Website-URL ein: `https://nba-h2h.web.app`
5. Fülle die erforderlichen Informationen aus (Name, Adresse, etc.)

## Schritt 2: AdSense Code in index.html einfügen

1. Nach der Anmeldung erhältst du einen AdSense-Code
2. Dieser sieht ungefähr so aus:
```html
<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-XXXXXXXXXXXXXXXX"
     crossorigin="anonymous"></script>
```

3. Kopiere deine **Publisher-ID** (ca-pub-XXXXXXXXXXXXXXXX)

## Schritt 3: Publisher-ID in Footer.jsx eintragen

Öffne `/Users/ben/Dev/nba-programm/src/components/Footer.jsx` und ersetze:
- Zeile 11: `ca-pub-XXXXXXXXXXXXXXXX` mit deiner echten Publisher-ID
- Zeile 35: `ca-pub-XXXXXXXXXXXXXXXX` mit deiner echten Publisher-ID
- Zeile 36: `data-ad-slot="YYYYYYYYYY"` mit deiner Ad-Slot-ID (siehe Schritt 4)

## Schritt 4: Ad Unit erstellen

1. Gehe im AdSense Dashboard zu **Ads** → **By ad unit**
2. Klicke auf **Display ads**
3. Wähle **Horizontal** als Format
4. Gib einen Namen ein (z.B. "NBA Footer Banner")
5. Klicke auf **Create**
6. Kopiere die **Ad Slot ID** (eine Nummer wie 1234567890)
7. Füge diese in `Footer.jsx` Zeile 36 ein

## Schritt 5: Website verifizieren

1. AdSense wird dich bitten, deine Website zu verifizieren
2. Du musst den AdSense-Code in den `<head>` deiner Website einfügen
3. Öffne `/Users/ben/Dev/nba-programm/index.html`
4. Füge den Verifizierungscode zwischen `<head>` und `</head>` ein

Beispiel:
```html
<head>
  <meta charset="UTF-8" />
  <link rel="icon" type="image/png" href="/h2h_logo.png" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Head to Head NBA</title>
  
  <!-- Google AdSense Verification -->
  <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-XXXXXXXXXXXXXXXX"
       crossorigin="anonymous"></script>
</head>
```

## Schritt 6: Neu deployen

Nach allen Änderungen:
```bash
npm run build
firebase deploy
```

## Schritt 7: Genehmigung abwarten

- AdSense prüft deine Website (kann 1-2 Wochen dauern)
- Du erhältst eine E-Mail, wenn deine Website genehmigt wurde
- Danach werden Anzeigen automatisch geschaltet

## Wichtige Hinweise

⚠️ **AdSense Richtlinien beachten:**
- Mindestens 20-30 Seiten mit qualitativ hochwertigem Inhalt
- Keine urheberrechtlich geschützten Inhalte ohne Erlaubnis
- Keine irreführenden Inhalte
- Website muss mindestens 6 Monate alt sein (manchmal)

⚠️ **Datenschutz:**
- Du musst eine Datenschutzerklärung haben
- Cookie-Consent ist bereits implementiert ✅
- Erwähne Google AdSense in deiner Datenschutzerklärung

## Testen

Während der Entwicklung werden keine echten Anzeigen angezeigt. Du siehst:
- "Advertisement Space" Platzhalter
- Oder leere Bereiche

Nach der Genehmigung werden automatisch Anzeigen geschaltet.

## Alternative: Google Ad Manager

Falls AdSense nicht genehmigt wird, kannst du auch Google Ad Manager verwenden oder andere Werbenetzwerke wie:
- Media.net
- PropellerAds
- Ezoic

## Troubleshooting

**Problem:** Anzeigen werden nicht angezeigt
- Lösung: Prüfe, ob AdSense deine Website genehmigt hat
- Lösung: Prüfe die Browser-Konsole auf Fehler
- Lösung: Deaktiviere AdBlocker zum Testen

**Problem:** "AdSense code not found"
- Lösung: Stelle sicher, dass der Code in `index.html` ist
- Lösung: Deploye die Website neu

**Problem:** Mixed Content Error
- Lösung: Alle AdSense-URLs verwenden bereits HTTPS ✅
