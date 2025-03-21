# Examensarbete av Sofia Rosborg

**Examensarbete för Frontendutvecklare distans, Folkuniversitetet Göteborg**

## Beskrivning

Detta är ett verktyg för bildverifiering och ska komplettera ett AI-baserat system för automatisk bildextraktion från filmer med inbrända undertexter. Eftersom AI-verktyget inte är helt exakt behövs en lösning för att granska och bekräfta resultaten i efterhand. Det här verktyget är till en början fristående men ska senare implementeras i ett annat system.

Den här första versionen av verktyget hämtar bilder från ett gratis-API (då annat testmaterial saknades), presenterar dem för användaren som sedan kan markera vilka bilder som är korrekta och skickar sedan svaret som json-fil. Resultaten kommer både användas för att träna systemet att bli bättre och för att rapportera att det finns inbränd undertext till mottagaren.

## Körning

För att köra verktyget, öppna terminalen i VSCode, navigera till den mapp där du vill ladda ner repot och skriv sedan:

```
git clone https://github.com/sofrosb/examensarbete
cd examensarbete
```

### Starta frontend:

```
cd frontend
npm install
npm run dev
```

### Starta backend

```
cd backend
npm install
node server.js
```
