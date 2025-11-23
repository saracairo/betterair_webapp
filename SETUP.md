# 🚀 Setup Rapido BetterAir

## Per chi clona il repository per la prima volta

### 1. Modalità Demo (senza API key)

Puoi subito aprire `demo.html` nel browser per vedere dati simulati, senza configurare nulla:

```bash
open demo.html
```

---

### 2. Modalità Reale (con API key IQAir)

#### a) Copia il file di configurazione

```bash
cp config.example.js config.js
```

#### b) Ottieni la tua API key IQAir

1. Vai su https://www.iqair.com/air-pollution-data-api
2. Clicca su "Get Free API Key"
3. Registrati gratuitamente
4. Copia la tua API key

#### c) Configura l'applicazione

Apri il file `config.js` e sostituisci il placeholder:

```javascript
const config = {
  IQAIR_API_KEY: 'la_tua_api_key_qui'  // <- Incolla qui la tua key
};
```

#### d) Avvia l'app

```bash
# Opzione 1: Apri direttamente il file
open iqapi.html

# Opzione 2: Usa un server locale (consigliato)
npm install
npm run dev
```

> **Nota:** Non sono richiesti altri pacchetti oltre a quelli già inclusi in package.json.

---

## Importante

- Il file `config.js` è già nel `.gitignore` e NON verrà caricato su GitHub
- Puoi committare tranquillamente tutti gli altri file
- NON modificare `config.example.js` con la tua API key vera

---

## Output atteso

- In modalità demo vedrai le card delle città con dati simulati
- In modalità reale vedrai dati aggiornati da IQAir (se la key è corretta)

---

## Problemi?

Consulta il file `README.md` per la documentazione completa e il troubleshooting.
