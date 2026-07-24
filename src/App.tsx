import React, { useState, useEffect } from "react";
import { Header } from "./components/Header";
import { CurrentWeatherCard } from "./components/CurrentWeatherCard";
import { HourlyForecastCard } from "./components/HourlyForecastCard";
import { DailyForecastCard } from "./components/DailyForecastCard";
import { WeatherCharts } from "./components/WeatherCharts";
import { PlanningRecommendations } from "./components/PlanningRecommendations";
import { AirQualityCard } from "./components/AirQualityCard";
import { SunMoonCard } from "./components/SunMoonCard";
import { AIWeatherAssistant } from "./components/AIWeatherAssistant";
import {
  GeocodingResult,
  WeatherData,
  AirQualityData,
  TempUnit,
} from "./types/weather";
import { fetchWeather, fetchAirQuality } from "./utils/apiClient";
import { Loader2, AlertTriangle, RefreshCw, Compass, Sparkles } from "lucide-react";

// Default City: London, UK
const DEFAULT_CITY: GeocodingResult = {
  id: 2643743,
  name: "London",
  latitude: 51.50853,
  longitude: -0.12574,
  country: "United Kingdom",
  country_code: "GB",
  admin1: "England",
};

export default function App() {
  const [currentCity, setCurrentCity] = useState<GeocodingResult>(() => {
    const saved = localStorage.getItem("weather_intel_last_city");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return DEFAULT_CITY;
      }
    }
    return DEFAULT_CITY;
  });

  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [airQualityData, setAirQualityData] = useState<AirQualityData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [tempUnit, setTempUnit] = useState<TempUnit>(() => {
    return (localStorage.getItem("weather_intel_unit") as TempUnit) || "C";
  });

  const [favorites, setFavorites] = useState<GeocodingResult[]>(() => {
    const saved = localStorage.getItem("weather_intel_favorites");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return [
          DEFAULT_CITY,
          {
            id: 5128581,
            name: "New York",
            latitude: 40.71427,
            longitude: -74.00597,
            country: "United States",
            country_code: "US",
            admin1: "New York",
          },
          {
            id: 1850147,
            name: "Tokyo",
            latitude: 35.6895,
            longitude: 139.69171,
            country: "Japan",
            country_code: "JP",
            admin1: "Tokyo",
          },
        ];
      }
    }
    return [DEFAULT_CITY];
  });

  // Navigation Filter Tabs
  const [activeTab, setActiveTab] = useState<"all" | "analytics" | "planning" | "ai">("all");

  // Save changes to localStorage
  useEffect(() => {
    localStorage.setItem("weather_intel_last_city", JSON.stringify(currentCity));
  }, [currentCity]);

  useEffect(() => {
    localStorage.setItem("weather_intel_unit", tempUnit);
  }, [tempUnit]);

  useEffect(() => {
    localStorage.setItem("weather_intel_favorites", JSON.stringify(favorites));
  }, [favorites]);

  // Fetch Weather & Air Quality Data
  const fetchWeatherData = async (lat: number, lon: number) => {
    setIsLoading(true);
    setError(null);
    try {
      const [wData, aData] = await Promise.all([
        fetchWeather(lat, lon),
        fetchAirQuality(lat, lon),
      ]);

      setWeatherData(wData);
      setAirQualityData(aData);
    } catch (err: any) {
      console.error("Fetch weather error:", err);
      setError(err.message || "Could not retrieve weather information.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (currentCity) {
      fetchWeatherData(currentCity.latitude, currentCity.longitude);
    }
  }, [currentCity.latitude, currentCity.longitude]);

  // Handle Current Geolocation
  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser.");
      return;
    }

    setIsLoading(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude;
        const lon = pos.coords.longitude;

        // Try reverse geocoding or set placeholder city name
        try {
          const res = await fetch(
            `https://geocoding-api.open-meteo.com/v1/search?name=Current&count=1`
          );
          const customCity: GeocodingResult = {
            id: Date.now(),
            name: "My Location",
            latitude: lat,
            longitude: lon,
            country: "",
          };
          setCurrentCity(customCity);
        } catch (e) {
          setCurrentCity({
            id: Date.now(),
            name: "My Location",
            latitude: lat,
            longitude: lon,
          });
        }
      },
      (err) => {
        console.error("Geolocation error:", err);
        alert("Unable to access current location. Please check browser permissions.");
        setIsLoading(false);
      }
    );
  };

  // Favorite toggle handler
  const handleToggleFavorite = (city: GeocodingResult) => {
    setFavorites((prev) => {
      const exists = prev.some(
        (f) =>
          Math.abs(f.latitude - city.latitude) < 0.05 &&
          Math.abs(f.longitude - city.longitude) < 0.05
      );
      if (exists) {
        return prev.filter(
          (f) =>
            !(
              Math.abs(f.latitude - city.latitude) < 0.05 &&
              Math.abs(f.longitude - city.longitude) < 0.05
            )
        );
      } else {
        return [...prev, city];
      }
    });
  };

  const handleToggleTempUnit = () => {
    setTempUnit((prev) => (prev === "C" ? "F" : "C"));
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans antialiased selection:bg-sky-500 selection:text-white p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Top Header & Search Bar */}
        <Header
          currentCity={currentCity}
          onSelectCity={(city) => setCurrentCity(city)}
          onUseCurrentLocation={handleUseCurrentLocation}
          tempUnit={tempUnit}
          onToggleTempUnit={handleToggleTempUnit}
          favorites={favorites}
          onToggleFavorite={handleToggleFavorite}
          onRefresh={() => fetchWeatherData(currentCity.latitude, currentCity.longitude)}
          isLoading={isLoading}
        />

        {/* View Navigation Pills */}
        <div className="flex items-center justify-between mb-6 overflow-x-auto pb-2 scrollbar-none">
          <div className="flex items-center gap-2 bg-slate-900 p-1.5 rounded-2xl border border-slate-800">
            <button
              onClick={() => setActiveTab("all")}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === "all"
                  ? "bg-sky-500 text-white shadow-lg shadow-sky-500/25"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              Full Weather Dashboard
            </button>
            <button
              onClick={() => setActiveTab("analytics")}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === "analytics"
                  ? "bg-sky-500 text-white shadow-lg shadow-sky-500/25"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              Trend Analytics
            </button>
            <button
              onClick={() => setActiveTab("planning")}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === "planning"
                  ? "bg-sky-500 text-white shadow-lg shadow-sky-500/25"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              Activity & Wardrobe Planner
            </button>
            <button
              onClick={() => setActiveTab("ai")}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeTab === "ai"
                  ? "bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-500/25"
                  : "text-slate-400 hover:text-indigo-300"
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Gemini AI Insights</span>
            </button>
          </div>

          <div className="hidden md:flex items-center gap-2 text-xs text-slate-400 font-mono">
            <span>Data provided by Open-Meteo</span>
          </div>
        </div>

        {/* Loading Overlay */}
        {isLoading && !weatherData && (
          <div className="min-h-[400px] flex flex-col items-center justify-center bg-slate-900/50 border border-slate-800 rounded-3xl p-8">
            <Loader2 className="w-10 h-10 text-sky-400 animate-spin mb-4" />
            <h3 className="text-lg font-bold text-slate-200">
              Fetching Weather Intelligence...
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Retrieving high-precision satellite telemetry for {currentCity.name}
            </p>
          </div>
        )}

        {/* Error View */}
        {error && (
          <div className="bg-rose-950/40 border border-rose-500/30 rounded-3xl p-6 text-center my-6">
            <AlertTriangle className="w-8 h-8 text-rose-400 mx-auto mb-2" />
            <h3 className="text-base font-bold text-rose-200">{error}</h3>
            <p className="text-xs text-slate-300 mt-1 mb-4">
              Check connection or try searching another city.
            </p>
            <button
              onClick={() => fetchWeatherData(currentCity.latitude, currentCity.longitude)}
              className="px-4 py-2 bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 rounded-xl text-xs font-bold border border-rose-500/40 transition-all inline-flex items-center gap-2"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Retry Load</span>
            </button>
          </div>
        )}

        {/* Main Dashboard Layout */}
        {weatherData && !isLoading && (
          <div className="space-y-6">
            {/* Overview / All View */}
            {(activeTab === "all" || activeTab === "analytics") && (
              <>
                {/* Hero Current Weather */}
                <CurrentWeatherCard
                  weather={weatherData}
                  airQuality={airQualityData}
                  tempUnit={tempUnit}
                  cityName={currentCity.name}
                />

                {/* 24-Hour Timeline */}
                <HourlyForecastCard weather={weatherData} tempUnit={tempUnit} />

                {/* Grid layout for 7-Day & Analytics / Solar */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-2">
                    <DailyForecastCard weather={weatherData} tempUnit={tempUnit} />
                  </div>
                  <div className="space-y-6">
                    <SunMoonCard weather={weatherData} />
                    <AirQualityCard airQuality={airQualityData} />
                  </div>
                </div>

                {/* Recharts Analytics */}
                <WeatherCharts weather={weatherData} tempUnit={tempUnit} />
              </>
            )}

            {/* Activity & Wardrobe Planning View */}
            {(activeTab === "all" || activeTab === "planning") && (
              <PlanningRecommendations weather={weatherData} tempUnit={tempUnit} />
            )}

            {/* Gemini AI Assistant View */}
            {(activeTab === "all" || activeTab === "ai") && (
              <AIWeatherAssistant
                weather={weatherData}
                cityName={currentCity.name}
                tempUnit={tempUnit}
              />
            )}
          </div>
        )}

        {/* Footer */}
        <footer className="mt-12 pt-6 border-t border-slate-900 text-center text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Compass className="w-4 h-4 text-sky-400" />
            <span>Weather Intelligence App • Live Open-Meteo & Gemini AI</span>
          </div>
          <div className="font-mono text-[11px] text-slate-600">
            Latitude: {currentCity.latitude.toFixed(2)}° | Longitude:{" "}
            {currentCity.longitude.toFixed(2)}°
          </div>
        </footer>
      </div>
    </div>
  );
}
