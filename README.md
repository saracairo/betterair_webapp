# 🍃 BetterAir

> Air Quality Monitoring System

[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat&logo=javascript&logoColor=black)](https://developer.mozilla.org/it/docs/Web/JavaScript)
[![HTML](https://img.shields.io/badge/HTML5-E34F26?style=flat&logo=html5&logoColor=white)](https://developer.mozilla.org/it/docs/Web/HTML)
[![CSS](https://img.shields.io/badge/CSS3-1572B6?style=flat&logo=css3&logoColor=white)](https://developer.mozilla.org/it/docs/Web/CSS)
[![Netlify Status](https://api.netlify.com/api/v1/badges/67358e9b-f156-48cf-b7e1-472eb808962b/deploy-status)](https://app.netlify.com/projects/better-4ir/deploys)

Sistema di monitoraggio qualità dell'aria per le principali città italiane, con supporto sia per dati simulati che dati reali da IQAir. Web app sviluppata in JavaScript.

## 🚀 Avvio Rapido

### Live Server (consigliato)

```bash
npm install
npm run dev
```

> **Nota:** Non sono richiesti altri pacchetti oltre a quelli già inclusi in package.json.

## 📖 Modalità Disponibili

### 🎭 Modalità Demo (`demo.html`)

- ✅ Funziona sempre, nessuna configurazione necessaria
- Dati simulati realistici per 7 città italiane
- Aggiornamenti automatici ogni minuto
- Perfetto per sviluppo, testing e demo
- **File JavaScript**: `app-demo.js`
- **Non serve API key**

### 🌍 Modalità Reale (`iqapi.html`)

- 📊 Dati reali in tempo reale da **IQAir** tramite funzione serverless Netlify
- Richiede API key gratuita (10.000 chiamate/mese)
- La key va inserita come variabile ambiente su Netlify (`IQAIR_API_KEY`)
- Include dati meteo (temperatura, umidità, vento)
- Identifica l'inquinante principale
- Aggiornamenti ogni 5 minuti
- **File JavaScript**: `app.js`

## 🔑 Configurazione API IQAir

### Sviluppo locale

- Inserisci la tua API key in `config.js` (non committare mai la key!)
- Usa `config.example.js` come template

### Deploy su Netlify

- Inserisci la key come variabile ambiente `IQAIR_API_KEY` nelle impostazioni del sito
- Non serve più il file `config.js` in produzione
- Il frontend chiama la funzione serverless: `/.netlify/functions/proxy-iqair?city=Rome&state=Lazio`

## 🚀 Deploy su Netlify

1. Vai su Site Settings → Environment Variables
2. Aggiungi la variabile `IQAIR_API_KEY` con la tua API key
3. Netlify rileva automaticamente la funzione in `netlify/functions/proxy-iqair.js`
4. Il frontend chiama `/.netlify/functions/proxy-iqair?city=Rome&state=Lazio`

## 🔒 Sicurezza della API Key

### Perché questo metodo è sicuro per GitHub?

1. **File `config.js` escluso**: Il file contenente la tua API key è nel `.gitignore`
2. **Template pubblico**: Solo `config.example.js` viene committato (senza la vera key)
3. **Istruzioni chiare**: Altri sviluppatori sanno come configurare la loro key

### ⚠️ Importante: Non usare dotenv

Questo è un progetto **frontend puro** (HTML/CSS/JS nel browser), quindi:

- ❌ **NON puoi usare dotenv** - funziona solo in Node.js server-side
- ❌ Le variabili d'ambiente `.env` non funzionano nel browser
- ✅ Usiamo `config.js` + `.gitignore` come soluzione frontend


### Se carichi su GitHub

Prima di fare commit:

```bash
# Verifica che config.js NON sia tracciato
git status

# Dovrebbe mostrare solo config.example.js
# Se vedi config.js, aggiungilo subito al .gitignore!
```


## 🌍 Città Monitorate

| Città   | Regione         | Nome API (IQAir) |
|---------|-----------------|------------------|
| Roma    | Lazio           | Rome             |
| Milano  | Lombardia       | Milan            |
| Napoli  | Campania        | Naples           |
| Torino  | Piemonte        | Turin            |
| Firenze | Toscana         | Florence         |
| Bologna | Emilia-Romagna  | Bologna          |
| Venezia | Veneto          | Venice           |

## 📊 Categorie AQI (Air Quality Index)

| Range AQI | Categoria                        | Colore | Emoji |
|-----------|----------------------------------|--------|-------|
| 0-50      | Buono                            | Verde  | 🟢    |
| 51-100    | Moderato                         | Giallo | 🟡    |
| 101-150   | Insalubre per gruppi sensibili   | Aranc. | 🟠    |
| 151-200   | Insalubre                        | Rosso  | 🔴    |
| 201-300   | Molto Insalubre                  | Viola  | 🟣    |
| 301-500   | Pericoloso                       | Marr.  | 🟤    |

## 🔬 Inquinanti Monitorati

- **PM2.5** - Particolato fine (≤2.5 μm)
- **PM10** - Particolato (≤10 μm)
- **O₃** - Ozono troposferico
- **NO₂** - Diossido di azoto
- **CO** - Monossido di carbonio

## 🎨 Features

- ✨ **Design Retro** - Stile terminale anni '80 con font monospaziato
- 📱 **Responsive** - Ottimizzato per desktop, tablet e mobile
- 🔄 **Auto-refresh** - Aggiornamenti automatici configurabili
- 📈 **Statistiche** - AQI medio, migliore/peggiore città
- 🌤️ **Dati Meteo** - Temperatura, umidità, vento (modalità IQAir)
- 💡 **Raccomandazioni** - Suggerimenti personalizzati per categoria
- 🎯 **Inquinante Principale** - Identifica il pollutante dominante
- 🚦 **Codifica a Colori** - Visualizzazione immediata della qualità

## 📁 Struttura del Progetto

```plaintext
better_air_app/
├── index.html          # Pagina di selezione modalità
├── demo.html           # Modalità demo (dati simulati)
├── iqapi.html          # Modalità reale (IQAir API)
├── app-demo.js         # Logica modalità demo
├── app.js              # Logica modalità IQAir (dati reali)
├── config.js           # 🔒 Configurazione API key (NON committare!)
├── config.example.js   # Template per configurazione
├── style.css           # Stili retro completi
├── .gitignore          # File da escludere da Git
├── package.json        # Configurazione NPM
└── README.md           # Questa documentazione
```


> **🔒 Sicurezza**: Il file `config.js` contiene dati sensibili ed è escluso da Git tramite `.gitignore`

## 🛠️ Tecnologie Utilizzate

- **HTML5** - Struttura semantica
- **CSS3** - Design retro con variabili e grid
- **JavaScript ES6+** - Vanilla JS, niente framework
- **Fetch API** - Chiamate HTTP asincrone
- **IQAir API v2** - Dati qualità aria reali
- **Font**: Courier New (monospaced)

## 🧩 Troubleshooting

### API Key non funziona

- Verifica di aver inserito correttamente la key in `config.js`
- Controlla che la key sia attiva su [IQAir Dashboard](https://www.iqair.com/dashboard/api)
- Verifica di non aver superato il limite di 10.000 chiamate/mese
- Apri la console del browser (F12) per vedere eventuali errori

### Dati non disponibili per una città

- IQAir potrebbe non avere dati recenti per quella specifica città
- Verifica nella console quali città hanno restituito errori
- Alcune città minori potrebbero avere copertura limitata

### L'app non si aggiorna automaticamente

- Verifica di aver premuto "▶ Avvia Monitoraggio"
- Il monitoraggio si ferma quando si cambia scheda del browser
- Controlla la console per eventuali errori di rete

### Problemi con il server locale

```bash
# Se npm run dev non funziona, installa live-server globalmente
npm install -g live-server

# Poi avvia da dentro la cartella del progetto
live-server --port=8080
```

## 📚 Documentazione API

- [IQAir API Documentation](https://www.iqair.com/air-pollution-data-api)
- [Air Quality Index (EPA)](https://www.airnow.gov/aqi/aqi-basics/)
- [WHO Air Quality Guidelines](https://www.who.int/news-room/feature-stories/detail/what-are-the-who-air-quality-guidelines)

## 🎓 Uso Educativo

Questo progetto è stato sviluppato per scopi educativi e dimostra:

- Integrazione con API REST esterne
- Manipolazione del DOM con JavaScript
- Design responsive CSS
- Gestione asincrona con Promises
- Best practices nello sviluppo frontend
- Gestione sicura di API keys

## 📝 Limitazioni

- **Piano gratuito IQAir**: 10.000 chiamate/mese (circa 1 chiamata ogni 4 minuti per 7 città)
- **Aggiornamenti**: Dati IQAir aggiornati ogni 10-30 minuti (non in real-time assoluto)
- **Copertura**: Limitata alle città con stazioni di monitoraggio IQAir

## 🚀 Possibili miglioramenti implementabili

- [ ] Grafici storici dell'AQI
- [ ] Notifiche push per livelli critici
- [ ] Comparazione tra città
- [ ] Export dati in CSV/JSON
- [ ] Modalità dark/light
- [ ] Selezione manuale città da monitorare
- [ ] Integrazione con più provider (OpenWeather, WAQI)
- [ ] PWA (Progressive Web App) per uso offline

## 📄 Licenza

ISC License - Libero per uso personale ed educativo.

## 👤 Autore
Sviluppato da Sara Cairo come esercizio e progetto educativo.

## 🤝 Contribuire

Sentiti libero di:

- Aprire issue per bug o suggerimenti
- Proporre miglioramenti
- Forkare il progetto per uso personale

---

**🍃 Respira meglio con BetterAir!**

*Made with 💚 for cleaner air*

## ❓ FAQ

**D: Posso usare la modalità demo senza API key?**
R: Sì, la modalità demo (`demo.html`) funziona sempre senza configurazione.

**D: Cosa faccio se la key non funziona?**
R: Verifica che sia corretta, attiva e non scaduta. Consulta la sezione Troubleshooting.

**D: Posso usare altri server locali?**
R: Sì, basta che serva i file HTML/JS/CSS. Live Server è solo il più semplice.

**D: Posso committare config.js?**
R: No! È già escluso da `.gitignore` per sicurezza.
