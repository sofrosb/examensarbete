# Examensarbete av Sofia Rosborg

**Examensarbete för Frontendutvecklare distans, Folkuniversitetet Göteborg**

## Beskrivning

Detta är ett verktyg för bildverifiering och ska komplettera ett AI-baserat system för automatisk bildextraktion från filmer med inbrända undertexter. Eftersom AI-verktyget inte är helt exakt behövs en lösning för att manuellt granska och bekräfta resultaten. Det här verktyget är nu fristående men ska på sikt implementeras i ett annat system.

I den här första versionen hämtar verktyget bilder från backend, visar dem för användaren, som sedan kan markera vilka bilder som är korrekta. Därefter skickas resultatet som json-fil. Informationen kommer att användas både för att förbättra AI-modellen och för att rapportera förekomst av inbränd undertext.

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
