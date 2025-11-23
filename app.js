// ============================================
// BETTERAIR - AIR QUALITY MONITORING SYSTEM
// Versione IQAir con Dati Reali
// ============================================

// ============================================
// FASE 1: COSTANTI E CONFIGURAZIONE
// ============================================

const API_BASE_URL = 'https://api.airvisual.com/v2';
// API key caricata da config.js
// Per ottenere una API key gratuita: https://www.iqair.com/air-pollution-data-api
// Inserisci la tua API key in config.js (vedi README)
const API_KEY = typeof config !== 'undefined' ? config.IQAIR_API_KEY : 'YOUR_IQAIR_API_KEY_HERE';

// Città italiane con nome stato (richiesto da IQAir)
const CITIES_TO_MONITOR = [
  { city: 'Rome', state: 'Lazio', displayName: 'Roma' },
  { city: 'Milan', state: 'Lombardy', displayName: 'Milano' },
  { city: 'Naples', state: 'Campania', displayName: 'Napoli' },
  { city: 'Turin', state: 'Piedmont', displayName: 'Torino' },
  { city: 'Florence', state: 'Tuscany', displayName: 'Firenze' },
  { city: 'Bologna', state: 'Emilia-Romagna', displayName: 'Bologna' },
  { city: 'Venice', state: 'Veneto', displayName: 'Venezia' }
];

const AQI_CATEGORIES = [
  {
    min: 0,
    max: 50,
    level: 'Buono',
    description: 'La qualità dell\'aria è soddisfacente e non presenta rischi per la salute',
    color: '#00e400',
    emoji: '🟢',
    recommendations: 'Ideale per attività all\'aperto'
  },
  {
    min: 51,
    max: 100,
    level: 'Moderato',
    description: 'La qualità dell\'aria è accettabile, ma potrebbe esserci un rischio moderato per alcune persone',
    color: '#ffff00',
    emoji: '🟡',
    recommendations: 'Accettabile per la maggior parte delle persone'
  },
  {
    min: 101,
    max: 150,
    level: 'Insalubre per gruppi sensibili',
    description: 'I gruppi sensibili potrebbero avvertire effetti sulla salute',
    color: '#ff7e00',
    emoji: '🟠',
    recommendations: 'Bambini, anziani e persone con problemi respiratori dovrebbero limitare le attività all\'aperto'
  },
  {
    min: 151,
    max: 200,
    level: 'Insalubre',
    description: 'Tutti potrebbero iniziare ad avvertire effetti sulla salute',
    color: '#ff0000',
    emoji: '🔴',
    recommendations: 'Limitare le attività all\'aperto prolungate'
  },
  {
    min: 201,
    max: 300,
    level: 'Molto insalubre',
    description: 'Avviso sanitario: tutti potrebbero avvertire effetti più gravi sulla salute',
    color: '#8f3f97',
    emoji: '🟣',
    recommendations: 'Evitare attività all\'aperto. Usare mascherine se necessario uscire'
  },
  {
    min: 301,
    max: 500,
    level: 'Pericoloso',
    description: 'Allarme sanitario: tutta la popolazione è a rischio di effetti gravi sulla salute',
    color: '#7e0023',
    emoji: '🟤',
    recommendations: 'Rimanere in casa. Usare purificatori d\'aria. Consultare un medico se si avvertono sintomi'
  }
];

const UPDATE_INTERVAL = 300000; // 5 minuti
let monitoringIntervalId = null;
let citiesData = [];

// ============================================
// FASE 2: UTILITY FUNCTIONS
// ============================================

function getAQICategory(aqi) {
  const category = AQI_CATEGORIES.find(cat => aqi >= cat.min && aqi <= cat.max);
  return category || AQI_CATEGORIES[AQI_CATEGORIES.length - 1];
}

function formatTimestamp(date) {
  return date.toLocaleString('it-IT', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });
}

// ============================================
// FASE 3: API IQAIR FUNCTIONS
// ============================================

async function fetchAirQuality(cityInfo) {
  try {
    const { city, state, displayName } = cityInfo;
    
    // Endpoint IQAir per città specifica
    const url = `${API_BASE_URL}/city?city=${encodeURIComponent(city)}&state=${encodeURIComponent(state)}&country=Italy&key=${API_KEY}`;
    
    console.log(`[${displayName}] Fetching from IQAir:`, url.replace(API_KEY, 'API_KEY_HIDDEN'));
    
    const response = await fetch(url);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`Errore HTTP ${response.status}: ${errorData.data?.message || response.statusText}`);
    }
    
    const data = await response.json();
    
    if (data.status !== 'success') {
      throw new Error(`API Error: ${data.data?.message || 'Unknown error'}`);
    }
    
    console.log(`[${displayName}] Data received:`, data.data);
    
    const pollution = data.data.current.pollution;
    const weather = data.data.current.weather;
    
    // IQAir fornisce già l'AQI calcolato (US EPA)
    const aqi = pollution.aqius;
    const category = getAQICategory(aqi);
    
    // Estrai gli inquinanti disponibili
    const pollutants = {
      pm25: pollution.p2 ? pollution.p2.conc : 0,
      pm10: pollution.p1 ? pollution.p1.conc : 0,
      o3: pollution.o3 ? pollution.o3.conc : 0,
      no2: pollution.n2 ? pollution.n2.conc : 0,
      co: pollution.co ? pollution.co.conc : 0
    };
    
    const timestamp = new Date(pollution.ts);
    
    console.log(`[${displayName}] ✅ AQI: ${aqi}, Main Pollutant: ${pollution.mainus}`);
    
    return {
      city: displayName,
      aqi: aqi,
      category: category.level,
      categoryInfo: category,
      pollutants: pollutants,
      mainPollutant: pollution.mainus, // Inquinante principale
      timestamp: timestamp,
      formattedTime: formatTimestamp(timestamp),
      source: 'IQAir',
      locationName: data.data.city,
      weather: {
        temperature: weather.tp,
        humidity: weather.hu,
        pressure: weather.pr,
        windSpeed: weather.ws
      }
    };
    
  } catch (error) {
    console.error(`[${cityInfo.displayName}] ❌ Errore:`, error);
    return {
      city: cityInfo.displayName,
      error: true,
      errorMessage: error.message,
      timestamp: new Date()
    };
  }
}

async function fetchAllCities() {
  const promises = CITIES_TO_MONITOR.map(cityInfo => fetchAirQuality(cityInfo));
  const results = await Promise.all(promises);
  citiesData = results;
  return results;
}

// ============================================
// FASE 4-6: DOM FUNCTIONS
// ============================================

function createElement(tag, className, content) {
  const element = document.createElement(tag);
  if (className) element.className = className;
  if (content) element.textContent = content;
  return element;
}

function createHeader() {
  const header = createElement('header', 'header');
  const title = createElement('h1', 'title', 'BetterAir');
  const subtitle = createElement('p', 'subtitle', 'Sistema di Monitoraggio Qualità Aria');
	const dataInfo = createElement('p', 'subtitle-data-info', 'REAL DATA - IQAir');
  
  const backLink = document.createElement('a');
  backLink.href = 'index.html';
  backLink.textContent = '← Torna alla selezione modalità';
  
  header.appendChild(title);
  header.appendChild(subtitle);
	header.appendChild(dataInfo);
  header.appendChild(backLink);
  
  return header;
}

function createControls() {
  const controls = createElement('div', 'controls');
  
  const startBtn = createElement('button', 'btn btn-start', '▶ Avvia Monitoraggio');
  startBtn.onclick = startMonitoring;
  
  const stopBtn = createElement('button', 'btn btn-stop', '⏸ Ferma Monitoraggio');
  stopBtn.onclick = stopMonitoring;
  stopBtn.disabled = true;
  stopBtn.id = 'stopBtn';
  
  const refreshBtn = createElement('button', 'btn btn-refresh', '🔄 Aggiorna Ora');
  refreshBtn.onclick = () => updateData();
  
  controls.appendChild(startBtn);
  controls.appendChild(stopBtn);
  controls.appendChild(refreshBtn);
  
  return controls;
}

function createStats(data) {
  const validData = data.filter(c => !c.error);
  
  if (validData.length === 0) {
    const statsContainer = createElement('div', 'stats-container');
    const warning = createElement('p', '', '⚠️ Nessun dato disponibile.');
    warning.style.color = '#ff0000';
    
    if (API_KEY === 'YOUR_IQAIR_API_KEY_HERE') {
      const apiKeyHelp = createElement('p', '', '📝 Inserisci la tua API key IQAir nel file config.js (riga 12)');
      apiKeyHelp.style.color = '#ffff00';
      apiKeyHelp.style.marginTop = '10px';
      statsContainer.appendChild(warning);
      statsContainer.appendChild(apiKeyHelp);
      
      const link = document.createElement('a');
      link.href = 'https://www.iqair.com/air-pollution-data-api';
      link.textContent = '→ Ottieni API key gratuita';
      link.style.color = '#00ffff';
      link.target = '_blank';
      statsContainer.appendChild(link);
    } else {
      statsContainer.appendChild(warning);
    }
    
    return statsContainer;
  }
  
  const aqiValues = validData.map(c => c.aqi);
  const avgAQI = Math.round(aqiValues.reduce((a, b) => a + b, 0) / aqiValues.length);
  const minAQI = Math.min(...aqiValues);
  const maxAQI = Math.max(...aqiValues);
  const bestCity = validData.find(c => c.aqi === minAQI);
  const worstCity = validData.find(c => c.aqi === maxAQI);
  
  const statsContainer = createElement('div', 'stats-container');
  
  const stats = [
    { label: '📊 AQI Medio', value: avgAQI },
    { label: '🏆 Migliore', value: `${bestCity.city} (${minAQI})` },
    { label: '⚠️ Peggiore', value: `${worstCity.city} (${maxAQI})` },
    { label: '🌍 Città', value: `${validData.length}/${CITIES_TO_MONITOR.length}` }
  ];
  
  stats.forEach(stat => {
    const statCard = createElement('div', 'stat-card');
    const label = createElement('div', 'stat-label', stat.label);
    const value = createElement('div', 'stat-value', String(stat.value));
    
    statCard.appendChild(label);
    statCard.appendChild(value);
    statsContainer.appendChild(statCard);
  });
  
  return statsContainer;
}

function createCityCard(cityData) {
  const card = createElement('div', 'city-card');
  
  if (cityData.error) {
    card.classList.add('error');
    card.innerHTML = `
      <h3>${cityData.city}</h3>
      <p class="error-message">❌ ${cityData.errorMessage}</p>
      <p style="font-size: 0.85em; color: #888; margin-top: 10px;">
        ${API_KEY === 'YOUR_IQAIR_API_KEY_HERE' 
          ? 'Configura la tua API key IQAir nel file config.js' 
          : 'Verifica la console per maggiori dettagli'}
      </p>
    `;
    return card;
  }
  
  const { city, aqi, categoryInfo, pollutants, formattedTime, mainPollutant, weather } = cityData;
  
  card.style.borderColor = categoryInfo.color;
  
  const header = createElement('div', 'city-card-header');
  const cityName = createElement('h3', '', `${categoryInfo.emoji} ${city}`);
  const aqiValue = createElement('div', 'aqi-value', String(aqi));
  aqiValue.style.backgroundColor = categoryInfo.color;
  aqiValue.style.color = aqi > 100 ? '#fff' : '#000';
  
  header.appendChild(cityName);
  header.appendChild(aqiValue);
  
  const category = createElement('div', 'category', categoryInfo.level);
  category.style.color = categoryInfo.color;
  
  const description = createElement('p', 'description', categoryInfo.description);
  
  const timestamp = createElement('div', 'timestamp', `⏰ ${formattedTime} | 🎯 ${mainPollutant} | 🌐 IQAir`);
  
  // Weather info
  const weatherContainer = createElement('div', 'pollutants');
  weatherContainer.style.marginBottom = '12px';
  const weatherTitle = createElement('h4', '', '🌤️ Meteo');
  weatherContainer.appendChild(weatherTitle);
  
  const weatherInfo = createElement('div', 'pollutant-item');
  weatherInfo.innerHTML = `
    <span>🌡️ ${weather.temperature}°C | 💧 ${weather.humidity}% | 🌬️ ${weather.windSpeed} m/s</span>
  `;
  weatherContainer.appendChild(weatherInfo);
  
  // Pollutants
  const pollutantsContainer = createElement('div', 'pollutants');
  const pollutantsTitle = createElement('h4', '', '🔬 Inquinanti (Dati Reali)');
  pollutantsContainer.appendChild(pollutantsTitle);
  
  const pollutantsList = [
    { name: 'PM2.5', value: pollutants.pm25.toFixed(1), unit: 'μg/m³' },
    { name: 'PM10', value: pollutants.pm10.toFixed(1), unit: 'μg/m³' },
    { name: 'O₃', value: pollutants.o3.toFixed(1), unit: 'μg/m³' },
    { name: 'NO₂', value: pollutants.no2.toFixed(1), unit: 'μg/m³' },
    { name: 'CO', value: pollutants.co.toFixed(1), unit: 'μg/m³' }
  ];
  
  pollutantsList.forEach(p => {
    const item = createElement('div', 'pollutant-item');
    const name = createElement('span', '', p.name);
    const value = createElement('span', '', `${p.value} ${p.unit}`);
    item.appendChild(name);
    item.appendChild(value);
    pollutantsContainer.appendChild(item);
  });
  
  const recommendations = createElement('div', 'recommendations');
  const recTitle = createElement('h4', '', '💡 Raccomandazioni');
  const recText = createElement('p', '', categoryInfo.recommendations);
  recommendations.appendChild(recTitle);
  recommendations.appendChild(recText);
  
  card.appendChild(header);
  card.appendChild(category);
  card.appendChild(description);
  card.appendChild(timestamp);
  card.appendChild(weatherContainer);
  card.appendChild(pollutantsContainer);
  card.appendChild(recommendations);
  
  return card;
}

function createCitiesGrid(data) {
  const grid = createElement('div', 'cities-grid');
  
  const sortedData = [...data].sort((a, b) => {
    if (a.error) return 1;
    if (b.error) return -1;
    return b.aqi - a.aqi;
  });
  
  sortedData.forEach(cityData => {
    const card = createCityCard(cityData);
    grid.appendChild(card);
  });
  
  return grid;
}

function createLoadingState() {
  const loading = createElement('div', 'loading');
  loading.innerHTML = '>>> Caricamento dati reali da IQAir...';
  return loading;
}

function createLastUpdate() {
  const updateDiv = createElement('div', 'last-update');
  updateDiv.id = 'lastUpdate';
  return updateDiv;
}

function renderApp() {
  const app = document.getElementById('app');
  app.innerHTML = '';
  
  app.appendChild(createHeader());
  app.appendChild(createControls());
  app.appendChild(createLastUpdate());
  
  const mainContent = createElement('div', 'main-content');
  mainContent.id = 'mainContent';
  mainContent.appendChild(createLoadingState());
  
  app.appendChild(mainContent);
}

async function updateData() {
  const mainContent = document.getElementById('mainContent');
  mainContent.innerHTML = '';
  mainContent.appendChild(createLoadingState());
  
  console.log('=== Inizio aggiornamento dati IQAir ===');
  const data = await fetchAllCities();
  console.log('=== Fine aggiornamento dati ===');
  
  mainContent.innerHTML = '';
  mainContent.appendChild(createStats(data));
  mainContent.appendChild(createCitiesGrid(data));
  
  updateLastUpdateTime();
}

function updateLastUpdateTime() {
  const lastUpdate = document.getElementById('lastUpdate');
  if (lastUpdate) {
    lastUpdate.textContent = `>>> Ultimo aggiornamento: ${new Date().toLocaleTimeString('it-IT')} (Dati IQAir)`;
  }
}

function startMonitoring() {
  if (monitoringIntervalId !== null) {
    alert('⚠️ Il monitoraggio è già attivo!');
    return;
  }
  
  document.querySelector('.btn-start').disabled = true;
  document.getElementById('stopBtn').disabled = false;
  
  updateData();
  
  monitoringIntervalId = setInterval(() => {
    updateData();
  }, UPDATE_INTERVAL);
}

function stopMonitoring() {
  if (monitoringIntervalId === null) {
    return;
  }
  
  clearInterval(monitoringIntervalId);
  monitoringIntervalId = null;
  
  document.querySelector('.btn-start').disabled = false;
  document.getElementById('stopBtn').disabled = true;
}

document.addEventListener('DOMContentLoaded', () => {
  console.log('🚀 BetterAir avviato - Modalità IQAir');
  console.log('API Key configurata:', API_KEY !== 'YOUR_IQAIR_API_KEY_HERE' ? 'Sì ✓' : 'No ✗');
  
  if (API_KEY === 'YOUR_IQAIR_API_KEY_HERE') {
    console.warn('⚠️ ATTENZIONE: Inserisci la tua API key IQAir!');
    console.log('📝 Ottienila gratuitamente su: https://www.iqair.com/air-pollution-data-api');
  }
  
  renderApp();
  updateData();
});