# Examensarbete av Sofia Rosborg

**Examensarbete för Frontendutvecklare distans, Folkuniversitetet Göteborg**

## Beskrivning

Detta är ett verktyg för bildverifiering och ska komplettera ett AI-baserat system för automatisk bildextraktion från filmer med inbrända undertexter. Eftersom AI-verktyget inte är helt exakt, behövs en lösning för att granska och bekräfta resultaten i efterhand.

Den här första versionen av verktyget hämtar bilder från ett API, presenterar det för användaren som sedan kan markera vilka bilder som är korrekta och skickar svaret som json-fil. Resultaten kommer både användas för att träna systemet att bli bättre och för att rapportera att det finns inbränd undertext till mottagaren.

## Körning

För att köra verktyget:

### Starta frontend:

```
cd frontend
npm run dev
```

### Starta backend

```
cd backend
node server.js
```
