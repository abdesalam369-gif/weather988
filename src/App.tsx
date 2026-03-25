import React, { useState, useEffect } from 'react';
import { 
  Cloud, CloudDrizzle, CloudFog, CloudLightning, CloudRain, 
  CloudSnow, Sun, Wind, Thermometer, Compass, Gauge, 
  AlertTriangle, Info, AlertCircle, Moon, Languages, Layers, Droplets, Map as MapIcon,
  MapPin, ChevronDown
} from 'lucide-react';
import { format } from 'date-fns';

// Locations in Karak Governorate
const LOCATIONS = [
  { id: 'mazar', lat: 31.066, lng: 35.695, nameAr: 'المزار - محافظة الكرك', nameEn: 'Al-Mazar - Karak' },
  { id: 'mutah', lat: 31.083, lng: 35.700, nameAr: 'مؤته - محافظة الكرك', nameEn: 'Mutah - Karak' },
  { id: 'taybeh', lat: 31.050, lng: 35.616, nameAr: 'الطيبة - محافظة الكرك', nameEn: 'Al-Taybeh - Karak' },
  { id: 'iraq', lat: 31.016, lng: 35.650, nameAr: 'العراق - محافظة الكرك', nameEn: 'Al-Iraq - Karak' },
  { id: 'sazal', lat: 31.116, lng: 35.716, nameAr: 'سزل - محافظة الكرك', nameEn: 'Sazal - Karak' },
  { id: 'hashimiyya', lat: 30.983, lng: 35.683, nameAr: 'الهاشمية الجنوبية - محافظة الكرك', nameEn: 'Al-Hashimiyya Al-Janubiyya - Karak' },
  { id: 'majra', lat: 31.033, lng: 35.700, nameAr: 'مجرا - محافظة الكرك', nameEn: 'Majra - Karak' },
];

interface WeatherData {
  temperature: number | null;
  windSpeed: number | null;
  windDirection: number | null;
  weatherCode: number | null;
  pressure: number | null;
  lastUpdated: Date | null;
  error: boolean;
}

// Translations
const translations = {
  en: {
    title: "Weather Monitoring Dashboard - Mutah and Mazar Municipality",
    subtitle: "Operations Center Monitoring System",
    systemOffline: "System Offline",
    liveDataActive: "Live Data Active",
    lastUpdated: "Last Updated:",
    currentConditions: "Current Conditions",
    noData: "No Data",
    temperature: "Temperature",
    windSpeed: "Wind Speed",
    windDir: "Wind Dir",
    pressure: "Pressure",
    status: "Status",
    toggleTheme: "Toggle Theme",
    mapLoading: "Loading live weather map...",
    mapError: "Failed to load weather map. Please check your connection.",
    windOverlay: "Wind",
    rainOverlay: "Rain & Radar",
    cloudsOverlay: "Clouds",
    pressureOverlay: "Pressure",
    mapControls: "Map Layers",
    selectLocation: "Select Region",
    // Weather descriptions
    clearSky: "Clear sky",
    mainlyClear: "Mainly clear",
    partlyCloudy: "Partly cloudy",
    overcast: "Overcast",
    fog: "Fog",
    drizzle: "Drizzle",
    freezingDrizzle: "Freezing Drizzle",
    rain: "Rain",
    freezingRain: "Freezing Rain",
    snowFall: "Snow fall",
    snowGrains: "Snow grains",
    rainShowers: "Rain showers",
    snowShowers: "Snow showers",
    thunderstorm: "Thunderstorm",
    thunderstormHail: "Thunderstorm with hail",
    unknown: "Unknown",
  },
  ar: {
    title: "لوحة مراقبة الطقس - بلدية مؤته والمزار",
    subtitle: "نظام المراقبة - غرفة الطوارى",
    systemOffline: "النظام متوقف",
    liveDataActive: "البيانات المباشرة نشطة",
    lastUpdated: "آخر تحديث:",
    currentConditions: "الظروف الحالية",
    noData: "لا توجد بيانات",
    temperature: "درجة الحرارة",
    windSpeed: "سرعة الرياح",
    windDir: "اتجاه الرياح",
    pressure: "الضغط الجوي",
    status: "الحالة",
    toggleTheme: "تبديل المظهر",
    mapLoading: "جاري تحميل خريطة الطقس المباشرة...",
    mapError: "فشل تحميل خريطة الطقس. يرجى التحقق من الاتصال.",
    windOverlay: "الرياح",
    rainOverlay: "الأمطار والرادار",
    cloudsOverlay: "السحب",
    pressureOverlay: "الضغط الجوي",
    mapControls: "طبقات الخريطة",
    selectLocation: "اختر المنطقة",
    // Weather descriptions
    clearSky: "سماء صافية",
    mainlyClear: "صافي غالباً",
    partlyCloudy: "غائم جزئياً",
    overcast: "غائم كلياً",
    fog: "ضباب",
    drizzle: "رذاذ",
    freezingDrizzle: "رذاذ متجمد",
    rain: "مطر",
    freezingRain: "مطر متجمد",
    snowFall: "تساقط الثلوج",
    snowGrains: "حبيبات ثلجية",
    rainShowers: "زخات مطر",
    snowShowers: "زخات ثلج",
    thunderstorm: "عاصفة رعدية",
    thunderstormHail: "عاصفة رعدية مع بَرَد",
    unknown: "غير معروف",
  }
};

const getWeatherIcon = (code: number | null) => {
  if (code === null) return <AlertTriangle className="w-12 h-12 text-gray-400" />;
  
  // WMO Weather interpretation codes
  if (code === 0) return <Sun className="w-12 h-12 text-yellow-500" />;
  if (code === 1 || code === 2 || code === 3) return <Cloud className="w-12 h-12 text-gray-400" />;
  if (code === 45 || code === 48) return <CloudFog className="w-12 h-12 text-gray-400" />;
  if (code >= 51 && code <= 57) return <CloudDrizzle className="w-12 h-12 text-blue-400" />;
  if (code >= 61 && code <= 67) return <CloudRain className="w-12 h-12 text-blue-500" />;
  if (code >= 71 && code <= 77) return <CloudSnow className="w-12 h-12 text-blue-200" />;
  if (code >= 80 && code <= 82) return <CloudRain className="w-12 h-12 text-blue-600" />;
  if (code >= 85 && code <= 86) return <CloudSnow className="w-12 h-12 text-blue-300" />;
  if (code >= 95 && code <= 99) return <CloudLightning className="w-12 h-12 text-purple-500" />;
  
  return <Cloud className="w-12 h-12 text-gray-400" />;
};

const getWeatherDescription = (code: number | null, lang: 'en' | 'ar') => {
  const t = translations[lang];
  if (code === null) return t.noData;
  
  if (code === 0) return t.clearSky;
  if (code === 1) return t.mainlyClear;
  if (code === 2) return t.partlyCloudy;
  if (code === 3) return t.overcast;
  if (code === 45 || code === 48) return t.fog;
  if (code >= 51 && code <= 55) return t.drizzle;
  if (code === 56 || code === 57) return t.freezingDrizzle;
  if (code >= 61 && code <= 65) return t.rain;
  if (code === 66 || code === 67) return t.freezingRain;
  if (code >= 71 && code <= 75) return t.snowFall;
  if (code === 77) return t.snowGrains;
  if (code >= 80 && code <= 82) return t.rainShowers;
  if (code === 85 || code === 86) return t.snowShowers;
  if (code === 95) return t.thunderstorm;
  if (code >= 96 && code <= 99) return t.thunderstormHail;
  
  return t.unknown;
};

type OverlayType = 'wind' | 'rain' | 'clouds' | 'pressure';

export default function App() {
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
  const [lang, setLang] = useState<'en' | 'ar'>('ar');
  const [activeOverlay, setActiveOverlay] = useState<OverlayType>('wind');
  const [selectedLocIndex, setSelectedLocIndex] = useState<number>(0);
  const [iframeLoaded, setIframeLoaded] = useState<boolean>(false);
  const [iframeError, setIframeError] = useState<boolean>(false);
  
  const [weather, setWeather] = useState<WeatherData>({
    temperature: null,
    windSpeed: null,
    windDirection: null,
    weatherCode: null,
    pressure: null,
    lastUpdated: null,
    error: false,
  });

  const t = translations[lang];
  const currentLocation = LOCATIONS[selectedLocIndex];

  // Fetch Weather Data from Open-Meteo
  const fetchWeather = async () => {
    try {
      const response = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${currentLocation.lat}&longitude=${currentLocation.lng}&current=temperature_2m,wind_speed_10m,wind_direction_10m,weather_code,surface_pressure`
      );
      
      if (!response.ok) throw new Error('Weather API failed');
      
      const data = await response.json();
      const current = data.current;
      
      setWeather({
        temperature: current.temperature_2m,
        windSpeed: current.wind_speed_10m,
        windDirection: current.wind_direction_10m,
        weatherCode: current.weather_code,
        pressure: current.surface_pressure,
        lastUpdated: new Date(),
        error: false,
      });
    } catch (error) {
      console.error("Failed to fetch weather:", error);
      setWeather(prev => ({ ...prev, error: true, lastUpdated: new Date() }));
    }
  };

  // Initial fetch and intervals
  useEffect(() => {
    fetchWeather();
    const weatherInterval = setInterval(fetchWeather, 5 * 60 * 1000); // 5 mins

    // Fallback timeout for iframe loading
    const iframeTimeout = setTimeout(() => {
      if (!iframeLoaded) {
        // We don't set error automatically because it might just be slow,
        // but we could if needed.
      }
    }, 10000);

    return () => {
      clearInterval(weatherInterval);
      clearTimeout(iframeTimeout);
    };
  }, [iframeLoaded, selectedLocIndex]);

  // Construct Windy Embed URL
  // pressure=true adds isobars to visualize low pressure systems
  const windyUrl = `https://embed.windy.com/embed.html?type=map&location=coordinates&metricRain=mm&metricTemp=%C2%B0C&metricWind=km%2Fh&zoom=10&overlay=${activeOverlay}&product=ecmwf&level=surface&lat=${currentLocation.lat}&lon=${currentLocation.lng}&pressure=true&message=true`;

  return (
    <div 
      dir={lang === 'ar' ? 'rtl' : 'ltr'} 
      className={`flex flex-col h-screen overflow-hidden font-sans transition-colors duration-300 ${isDarkMode ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-900'}`}
    >
      {/* Header */}
      <header className={`border-b p-4 flex justify-between items-center shadow-md z-20 transition-colors duration-300 ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-50/90 backdrop-blur-md border-slate-200'}`}>
        <div className="flex items-center gap-3">
          <div className="bg-blue-600 p-2 rounded-lg">
            <AlertTriangle className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight">{t.title}</h1>
            <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>{t.subtitle}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <div className={`flex items-center gap-2 text-sm px-3 py-1.5 rounded-full ${isDarkMode ? 'bg-slate-700 text-slate-300' : 'bg-slate-100 text-slate-700'}`}>
            <div className={`w-2 h-2 rounded-full ${weather.error ? 'bg-red-500' : 'bg-green-500 animate-pulse'}`}></div>
            <span className="hidden sm:inline">
              {weather.error ? t.systemOffline : t.liveDataActive}
            </span>
          </div>
          
          <div className={`text-sm text-end hidden md:block ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
            {t.lastUpdated}<br/>
            <span className={`font-mono ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
              {weather.lastUpdated ? format(weather.lastUpdated, 'HH:mm:ss') : '--:--:--'}
            </span>
          </div>

          <div className={`w-px h-8 mx-2 ${isDarkMode ? 'bg-slate-700' : 'bg-slate-300'}`}></div>

          <button 
            onClick={() => setLang(lang === 'en' ? 'ar' : 'en')}
            className={`p-2 rounded-lg transition-colors flex items-center gap-2 ${isDarkMode ? 'bg-slate-700 hover:bg-slate-600 text-white' : 'bg-slate-200 hover:bg-slate-300 text-slate-800'}`}
            title={lang === 'en' ? 'Switch to Arabic' : 'التبديل للإنجليزية'}
          >
            <Languages className="w-5 h-5" />
            <span className="text-sm font-bold">{lang === 'en' ? 'عربي' : 'EN'}</span>
          </button>

          <button 
            onClick={() => setIsDarkMode(!isDarkMode)}
            className={`p-2 rounded-lg transition-colors ${isDarkMode ? 'bg-slate-700 hover:bg-slate-600 text-yellow-400' : 'bg-slate-200 hover:bg-slate-300 text-slate-800'}`}
            title={t.toggleTheme}
          >
            {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden relative">
        
        {/* Map Area (Center) */}
        <div className="flex-1 relative z-0 bg-slate-950">
          {!iframeLoaded && !iframeError && (
            <div className="absolute inset-0 flex flex-col items-center justify-center z-10 bg-slate-900/80 backdrop-blur-sm">
              <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
              <p className="text-lg font-medium text-white">{t.mapLoading}</p>
            </div>
          )}

          {iframeError ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center z-10 bg-slate-900">
              <AlertCircle className="w-16 h-16 text-red-500 mb-4" />
              <p className="text-lg font-medium text-white">{t.mapError}</p>
            </div>
          ) : (
            <iframe
              src={windyUrl}
              className="w-full h-full border-0"
              title="Windy Live Weather Map"
              onLoad={() => setIframeLoaded(true)}
              onError={() => setIframeError(true)}
              allow="fullscreen"
            ></iframe>
          )}

          {/* Map Overlay Controls */}
          <div className="absolute top-4 start-4 z-[400] flex flex-col gap-2">
            <div className={`p-2 rounded-lg shadow-lg backdrop-blur-md ${isDarkMode ? 'bg-slate-800/90 border border-slate-700' : 'bg-white/90 border border-slate-200'}`}>
              <div className={`text-xs font-bold uppercase tracking-wider mb-2 px-2 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                {t.mapControls}
              </div>
              <div className="flex flex-col gap-1">
                <button 
                  onClick={() => setActiveOverlay('wind')}
                  className={`px-4 py-2 rounded-md font-medium text-sm transition-colors flex items-center gap-3 ${
                    activeOverlay === 'wind' 
                      ? 'bg-blue-600 text-white' 
                      : isDarkMode ? 'hover:bg-slate-700 text-slate-200' : 'hover:bg-slate-100 text-slate-700'
                  }`}
                >
                  <Wind className="w-4 h-4" />
                  {t.windOverlay}
                </button>
                <button 
                  onClick={() => setActiveOverlay('rain')}
                  className={`px-4 py-2 rounded-md font-medium text-sm transition-colors flex items-center gap-3 ${
                    activeOverlay === 'rain' 
                      ? 'bg-blue-600 text-white' 
                      : isDarkMode ? 'hover:bg-slate-700 text-slate-200' : 'hover:bg-slate-100 text-slate-700'
                  }`}
                >
                  <Droplets className="w-4 h-4" />
                  {t.rainOverlay}
                </button>
                <button 
                  onClick={() => setActiveOverlay('clouds')}
                  className={`px-4 py-2 rounded-md font-medium text-sm transition-colors flex items-center gap-3 ${
                    activeOverlay === 'clouds' 
                      ? 'bg-blue-600 text-white' 
                      : isDarkMode ? 'hover:bg-slate-700 text-slate-200' : 'hover:bg-slate-100 text-slate-700'
                  }`}
                >
                  <Cloud className="w-4 h-4" />
                  {t.cloudsOverlay}
                </button>
                <button 
                  onClick={() => setActiveOverlay('pressure')}
                  className={`px-4 py-2 rounded-md font-medium text-sm transition-colors flex items-center gap-3 ${
                    activeOverlay === 'pressure' 
                      ? 'bg-blue-600 text-white' 
                      : isDarkMode ? 'hover:bg-slate-700 text-slate-200' : 'hover:bg-slate-100 text-slate-700'
                  }`}
                >
                  <Gauge className="w-4 h-4" />
                  {t.pressureOverlay}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Panel: Real-time Data */}
        <div className={`w-80 border-s flex flex-col z-10 shadow-2xl transition-colors duration-300 ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-50/95 backdrop-blur-xl border-slate-200'}`}>
          <div className={`p-5 border-b flex-1 ${isDarkMode ? 'border-slate-700' : 'border-slate-200'}`}>
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <MapIcon className="w-5 h-5 text-blue-500" />
              {t.currentConditions}
            </h2>

            {/* Location Selector */}
            <div className="mb-6 relative">
              <label className={`block text-xs font-bold uppercase tracking-wider mb-2 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                {t.selectLocation}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                  <MapPin className={`w-5 h-5 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`} />
                </div>
                <select
                  value={selectedLocIndex}
                  onChange={(e) => setSelectedLocIndex(Number(e.target.value))}
                  className={`w-full py-3 ps-10 pe-10 appearance-none rounded-xl border-2 outline-none transition-all font-medium ${
                    isDarkMode 
                      ? 'bg-slate-800 border-slate-700 text-white focus:border-blue-500 focus:bg-slate-700 hover:border-slate-600' 
                      : 'bg-white/80 border-slate-200 text-slate-900 focus:border-blue-500 focus:bg-white hover:border-slate-300 shadow-sm'
                  }`}
                >
                  {LOCATIONS.map((loc, idx) => (
                    <option key={loc.id} value={idx}>
                      {lang === 'ar' ? loc.nameAr : loc.nameEn}
                    </option>
                  ))}
                </select>
                <div className="absolute inset-y-0 end-0 flex items-center pe-3 pointer-events-none">
                  <ChevronDown className={`w-5 h-5 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`} />
                </div>
              </div>
            </div>
            
            {/* Current Condition Hero */}
            <div className={`relative overflow-hidden flex flex-col items-center justify-center py-8 rounded-2xl border mb-6 ${isDarkMode ? 'bg-gradient-to-br from-slate-800 to-slate-900 border-slate-700 shadow-inner' : 'bg-gradient-to-br from-blue-50 to-white border-blue-100 shadow-sm'}`}>
              <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-blue-500 opacity-10 rounded-full blur-2xl"></div>
              <div className="absolute bottom-0 left-0 -mb-4 -ml-4 w-24 h-24 bg-purple-500 opacity-10 rounded-full blur-2xl"></div>
              
              <div className="relative z-10 transform transition-transform hover:scale-110 duration-500">
                {getWeatherIcon(weather.weatherCode)}
              </div>
              <div className="relative z-10 text-xl font-bold mt-4 text-center px-4 tracking-tight">
                {weather.error ? t.noData : getWeatherDescription(weather.weatherCode, lang)}
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-3">
              {/* Temperature */}
              <div className={`flex flex-col p-4 rounded-2xl border transition-all duration-300 ${isDarkMode ? 'bg-slate-800/50 border-slate-700 hover:bg-slate-700/50' : 'bg-white/60 border-slate-200/60 shadow-sm hover:shadow-md hover:bg-white/90'}`}>
                <div className="flex items-center gap-2 mb-2">
                  <div className={`p-1.5 rounded-lg ${isDarkMode ? 'bg-red-500/20' : 'bg-red-100'}`}>
                    <Thermometer className="w-4 h-4 text-red-500" />
                  </div>
                  <span className={`text-xs font-medium ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>{t.temperature}</span>
                </div>
                <div className="text-2xl font-bold font-mono tracking-tight mb-2">
                  {weather.error || weather.temperature === null ? t.noData : `${weather.temperature.toFixed(1)}°C`}
                </div>
                {/* Mini Progress Bar for Temperature */}
                {!weather.error && weather.temperature !== null && (
                  <div className={`w-full h-1.5 rounded-full overflow-hidden ${isDarkMode ? 'bg-slate-700' : 'bg-slate-200'}`}>
                    <div 
                      className="h-full bg-gradient-to-r from-blue-400 via-yellow-400 to-red-500 rounded-full"
                      style={{ width: `${Math.min(Math.max((weather.temperature + 10) / 50 * 100, 0), 100)}%` }}
                    ></div>
                  </div>
                )}
              </div>

              {/* Wind Speed */}
              <div className={`flex flex-col p-4 rounded-2xl border transition-all duration-300 ${isDarkMode ? 'bg-slate-800/50 border-slate-700 hover:bg-slate-700/50' : 'bg-white/60 border-slate-200/60 shadow-sm hover:shadow-md hover:bg-white/90'}`}>
                <div className="flex items-center gap-2 mb-2">
                  <div className={`p-1.5 rounded-lg ${isDarkMode ? 'bg-teal-500/20' : 'bg-teal-100'}`}>
                    <Wind className="w-4 h-4 text-teal-500" />
                  </div>
                  <span className={`text-xs font-medium ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>{t.windSpeed}</span>
                </div>
                <div className="text-xl font-bold font-mono tracking-tight mb-2">
                  {weather.error || weather.windSpeed === null ? t.noData : `${weather.windSpeed.toFixed(1)}`}
                  <span className="text-sm font-normal text-slate-400 ms-1">km/h</span>
                </div>
                {/* Mini Progress Bar for Wind Speed */}
                {!weather.error && weather.windSpeed !== null && (
                  <div className={`w-full h-1.5 rounded-full overflow-hidden ${isDarkMode ? 'bg-slate-700' : 'bg-slate-200'}`}>
                    <div 
                      className="h-full bg-gradient-to-r from-teal-300 to-teal-600 rounded-full"
                      style={{ width: `${Math.min((weather.windSpeed / 100) * 100, 100)}%` }}
                    ></div>
                  </div>
                )}
              </div>

              {/* Wind Direction */}
              <div className={`flex flex-col p-4 rounded-2xl border transition-all duration-300 ${isDarkMode ? 'bg-slate-800/50 border-slate-700 hover:bg-slate-700/50' : 'bg-white/60 border-slate-200/60 shadow-sm hover:shadow-md hover:bg-white/90'}`}>
                <div className="flex items-center gap-2 mb-2">
                  <div className={`p-1.5 rounded-lg ${isDarkMode ? 'bg-indigo-500/20' : 'bg-indigo-100'}`}>
                    <Compass className="w-4 h-4 text-indigo-500" />
                  </div>
                  <span className={`text-xs font-medium ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>{t.windDir}</span>
                </div>
                <div className="flex items-center justify-between mt-1">
                  <div className="text-xl font-bold font-mono tracking-tight">
                    {weather.error || weather.windDirection === null ? t.noData : `${weather.windDirection}°`}
                  </div>
                  {!weather.error && weather.windDirection !== null && (
                    <div className={`relative w-8 h-8 flex items-center justify-center rounded-full border-2 ${isDarkMode ? 'border-indigo-500/30 bg-indigo-500/10' : 'border-indigo-200 bg-indigo-50'}`}>
                      <div 
                        style={{ transform: `rotate(${weather.windDirection}deg)` }}
                        className="absolute w-full h-full flex items-center justify-center text-indigo-500 transition-transform duration-500"
                      >
                        <div className="w-1 h-3 bg-indigo-500 rounded-full -mt-3"></div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Pressure */}
              <div className={`flex flex-col p-4 rounded-2xl border transition-all duration-300 ${isDarkMode ? 'bg-slate-800/50 border-slate-700 hover:bg-slate-700/50' : 'bg-white/60 border-slate-200/60 shadow-sm hover:shadow-md hover:bg-white/90'}`}>
                <div className="flex items-center gap-2 mb-2">
                  <div className={`p-1.5 rounded-lg ${isDarkMode ? 'bg-purple-500/20' : 'bg-purple-100'}`}>
                    <Gauge className="w-4 h-4 text-purple-500" />
                  </div>
                  <span className={`text-xs font-medium ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>{t.pressure}</span>
                </div>
                <div className="text-xl font-bold font-mono tracking-tight mb-2">
                  {weather.error || weather.pressure === null ? t.noData : `${weather.pressure.toFixed(0)}`}
                  <span className="text-sm font-normal text-slate-400 ms-1">hPa</span>
                </div>
                {/* Mini Progress Bar for Pressure (Range ~950 to 1050) */}
                {!weather.error && weather.pressure !== null && (
                  <div className={`w-full h-1.5 rounded-full overflow-hidden ${isDarkMode ? 'bg-slate-700' : 'bg-slate-200'}`}>
                    <div 
                      className="h-full bg-gradient-to-r from-purple-400 to-purple-600 rounded-full"
                      style={{ width: `${Math.min(Math.max(((weather.pressure - 950) / 100) * 100, 0), 100)}%` }}
                    ></div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
