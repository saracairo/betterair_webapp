// ============================================
// BETTERAIR - AIR QUALITY MONITORING SYSTEM
// Versione Demo Web App
// ============================================

// ============================================
// FASE 1: COSTANTI E CONFIGURAZIONE
// ============================================

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

const CITIES_TO_MONITOR = ['Roma', 'Milano', 'Napoli', 'Torino', 'Firenze', 'Bologna', 'Venezia'];
const UPDATE_INTERVAL = 60000; // 1 minuto
let monitoringIntervalId = null;
let citiesData = [];

// ============================================
// FASE 2: UTILITY FUNCTIONS
// ============================================

function getAQICategory(aqi) {
  const category = AQI_CATEGORIES.find(cat => aqi >= cat.min && aqi <= cat.max);
  return category || AQI_CATEGORIES[AQI_CATEGORIES.length - 1];
}

function generateRandomAQI() {
  const rand = Math.random();
  
  if (rand < 0.7) {
    return Math.floor(Math.random() * 100) + 20;
  } else if (rand < 0.9) {
    return Math.floor(Math.random() * 80) + 120;
  } else {
    return Math.floor(Math.random() * 200) + 200;
  }
}

function generatePollutants(aqi) {
  return {
    pm25: Math.round(aqi * 0.4 + Math.random() * 10),
    pm10: Math.round(aqi * 0.6 + Math.random() * 15),
    o3: Math.round(aqi * 0.3 + Math.random() * 20),
    no2: Math.round(aqi * 0.35 + Math.random() * 12),
    co: Math.round(aqi * 0.2 + Math.random() * 5)
  };
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
// FASE 3: API SIMULATION FUNCTIONS
// ============================================

async function fetchAirQuality(city) {
  try {
    await new Promise(resolve => setTimeout(resolve, Math.random() * 1000 + 500));
    
    if (Math.random() < 0.05) {
      throw new Error(`Errore di connessione per ${city}`);
    }
    
    const aqi = generateRandomAQI();
    const category = getAQICategory(aqi);
    const pollutants = generatePollutants(aqi);
    const timestamp = new Date();
    
    return {
      city: city,
      aqi: aqi,
      category: category.level,
      categoryInfo: category,
      pollutants: pollutants,
      timestamp: timestamp,
      formattedTime: formatTimestamp(timestamp)
    };
    
  } catch (error) {
    return {
      city: city,
      error: true,
      errorMessage: error.message,
      timestamp: new Date()
    };
  }
}

async function fetchAllCities() {
  const promises = CITIES_TO_MONITOR.map(city => fetchAirQuality(city));
  const results = await Promise.all(promises);
  citiesData = results;
  return results;
}

// ============================================
// FASE 4: DOM CREATION FUNCTIONS
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
  const subtitle = createElement('p', 'subtitle', 'Sistema di Monitoraggio Qualità Aria - Dati Demo');
	const dataInfo = createElement('p', 'subtitle-data-info', 'MOCK DATA - Demo');

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
    statsContainer.innerHTML = '<p>Nessun dato disponibile</p>';
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
    `;
    return card;
  }
  
  const { city, aqi, categoryInfo, pollutants, formattedTime } = cityData;
  
  card.style.borderLeftColor = categoryInfo.color;
  
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
  
  const timestamp = createElement('div', 'timestamp', `⏰ ${formattedTime}`);
  
  const pollutantsContainer = createElement('div', 'pollutants');
  const pollutantsTitle = createElement('h4', '', '🔬 Inquinanti');
  pollutantsContainer.appendChild(pollutantsTitle);
  
  const pollutantsList = [
    { name: 'PM2.5', value: pollutants.pm25, unit: 'μg/m³' },
    { name: 'PM10', value: pollutants.pm10, unit: 'μg/m³' },
    { name: 'O₃', value: pollutants.o3, unit: 'ppb' },
    { name: 'NO₂', value: pollutants.no2, unit: 'ppb' },
    { name: 'CO', value: pollutants.co, unit: 'ppm' }
  ];
  
  pollutantsList.forEach(p => {
    const item = createElement('div', 'pollutant-item', `${p.name}: ${p.value} ${p.unit}`);
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
  loading.innerHTML = '🔄 Caricamento dati in corso...';
  return loading;
}

function createLastUpdate() {
  const updateDiv = createElement('div', 'last-update');
  updateDiv.id = 'lastUpdate';
  return updateDiv;
}

// ============================================
// FASE 5: RENDER FUNCTIONS
// ============================================

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
  
  const data = await fetchAllCities();
  
  mainContent.innerHTML = '';
  mainContent.appendChild(createStats(data));
  mainContent.appendChild(createCitiesGrid(data));
  
  updateLastUpdateTime();
}

function updateLastUpdateTime() {
  const lastUpdate = document.getElementById('lastUpdate');
  if (lastUpdate) {
    lastUpdate.textContent = `Ultimo aggiornamento: ${new Date().toLocaleTimeString('it-IT')}`;
  }
}

// ============================================
// FASE 6: MONITORING FUNCTIONS
// ============================================

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

// ============================================
// INIZIALIZZAZIONE
// ============================================

document.addEventListener('DOMContentLoaded', () => {
  renderApp();
  updateData();
});
