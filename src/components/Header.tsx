import React, { useState, useEffect, useRef } from "react";
import {
  Search,
  MapPin,
  Star,
  RefreshCw,
  Loader2,
  Compass,
  X,
  Thermometer,
} from "lucide-react";
import { GeocodingResult, TempUnit } from "../types/weather";
import { fetchGeocoding } from "../utils/apiClient";

interface HeaderProps {
  currentCity: GeocodingResult | null;
  onSelectCity: (city: GeocodingResult) => void;
  onUseCurrentLocation: () => void;
  tempUnit: TempUnit;
  onToggleTempUnit: () => void;
  favorites: GeocodingResult[];
  onToggleFavorite: (city: GeocodingResult) => void;
  onRefresh: () => void;
  isLoading: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  currentCity,
  onSelectCity,
  onUseCurrentLocation,
  tempUnit,
  onToggleTempUnit,
  favorites,
  onToggleFavorite,
  onRefresh,
  isLoading,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [results, setResults] = useState<GeocodingResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  // Debounced search query
  useEffect(() => {
    if (!searchQuery.trim() || searchQuery.trim().length < 2) {
      setResults([]);
      setIsSearching(false);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearching(true);
      try {
        const cityResults = await fetchGeocoding(searchQuery.trim());
        setResults(cityResults);
        setIsOpen(true);
      } catch (err) {
        console.error("Geocoding fetch error:", err);
      } finally {
        setIsSearching(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Click outside listener
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleCitySelect = (city: GeocodingResult) => {
    onSelectCity(city);
    setSearchQuery("");
    setIsOpen(false);
  };

  const isCurrentFavorite =
    currentCity &&
    favorites.some(
      (f) =>
        Math.abs(f.latitude - currentCity.latitude) < 0.05 &&
        Math.abs(f.longitude - currentCity.longitude) < 0.05
    );

  return (
    <header className="relative z-30 mb-6 bg-slate-900/80 backdrop-blur-md border border-slate-800 rounded-2xl p-4 shadow-xl">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Brand & Active City */}
        <div className="flex items-center justify-between lg:justify-start gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-500 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-sky-500/25">
              <Compass className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
                Weather Intel
              </h1>
              {currentCity && (
                <div className="flex items-center gap-1.5 text-xs text-sky-400 font-medium">
                  <MapPin className="w-3.5 h-3.5 shrink-0" />
                  <span className="truncate max-w-[200px]">
                    {currentCity.name}
                    {currentCity.admin1 ? `, ${currentCity.admin1}` : ""}
                    {currentCity.country ? `, ${currentCity.country}` : ""}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Quick Favorite Star for current city */}
          {currentCity && (
            <button
              onClick={() => onToggleFavorite(currentCity)}
              title={isCurrentFavorite ? "Remove from saved cities" : "Save this city"}
              className={`p-2 rounded-xl border transition-colors ${
                isCurrentFavorite
                  ? "bg-amber-500/20 border-amber-500/40 text-amber-400"
                  : "bg-slate-800/80 border-slate-700 text-slate-400 hover:text-amber-400"
              }`}
            >
              <Star
                className={`w-4 h-4 ${
                  isCurrentFavorite ? "fill-amber-400" : ""
                }`}
              />
            </button>
          )}
        </div>

        {/* Search Bar Container */}
        <div ref={searchContainerRef} className="relative flex-1 max-w-md w-full">
          <div className="relative flex items-center">
            <Search className="absolute left-3.5 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => {
                if (results.length > 0) setIsOpen(true);
              }}
              placeholder="Search city, e.g. London, Tokyo, New York..."
              className="w-full pl-10 pr-10 py-2.5 bg-slate-800/90 border border-slate-700 rounded-xl text-sm text-slate-100 placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition-all shadow-inner"
            />
            {isSearching ? (
              <Loader2 className="absolute right-3.5 w-4 h-4 text-sky-400 animate-spin" />
            ) : searchQuery ? (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3.5 p-0.5 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            ) : null}
          </div>

          {/* Autocomplete Dropdown */}
          {isOpen && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl overflow-hidden z-50 divide-y divide-slate-800 max-h-72 overflow-y-auto">
              {results.length > 0 ? (
                results.map((res) => (
                  <button
                    key={`${res.id}-${res.latitude}-${res.longitude}`}
                    onClick={() => handleCitySelect(res)}
                    className="w-full px-4 py-3 text-left flex items-center justify-between hover:bg-sky-500/10 transition-colors group"
                  >
                    <div>
                      <div className="text-sm font-semibold text-slate-100 group-hover:text-sky-400 transition-colors">
                        {res.name}
                      </div>
                      <div className="text-xs text-slate-400">
                        {res.admin1 ? `${res.admin1}, ` : ""}
                        {res.country || ""}
                      </div>
                    </div>
                    <span className="text-[10px] uppercase tracking-wider font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
                      {res.country_code || "CITY"}
                    </span>
                  </button>
                ))
              ) : (
                <div className="p-4 text-center text-xs text-slate-400">
                  No cities found matching "{searchQuery}"
                </div>
              )}
            </div>
          )}
        </div>

        {/* Control Actions */}
        <div className="flex items-center gap-2">
          {/* Current Geolocation Button */}
          <button
            onClick={onUseCurrentLocation}
            title="Use My Current Location"
            className="flex items-center gap-1.5 px-3 py-2 bg-slate-800 border border-slate-700 hover:border-sky-500/50 rounded-xl text-xs font-medium text-slate-200 hover:text-sky-400 transition-all shadow-sm"
          >
            <MapPin className="w-3.5 h-3.5 text-sky-400" />
            <span className="hidden sm:inline">My Location</span>
          </button>

          {/* Unit Switcher C/F */}
          <button
            onClick={onToggleTempUnit}
            title="Toggle Temperature Unit"
            className="flex items-center gap-1 px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs font-semibold text-slate-200 hover:border-slate-600 transition-colors"
          >
            <Thermometer className="w-3.5 h-3.5 text-amber-400" />
            <span className={tempUnit === "C" ? "text-sky-400 font-bold" : "text-slate-400"}>
              °C
            </span>
            <span className="text-slate-600">/</span>
            <span className={tempUnit === "F" ? "text-sky-400 font-bold" : "text-slate-400"}>
              °F
            </span>
          </button>

          {/* Refresh Button */}
          <button
            onClick={onRefresh}
            disabled={isLoading}
            title="Refresh weather data"
            className="p-2.5 bg-slate-800 border border-slate-700 hover:border-sky-500/50 rounded-xl text-slate-300 hover:text-sky-400 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin text-sky-400" : ""}`} />
          </button>
        </div>
      </div>

      {/* Favorite Cities Bar */}
      {favorites.length > 0 && (
        <div className="mt-3 pt-3 border-t border-slate-800/80 flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          <span className="text-[11px] uppercase tracking-wider text-slate-400 font-medium shrink-0 flex items-center gap-1">
            <Star className="w-3 h-3 text-amber-400 fill-amber-400" /> Saved:
          </span>
          <div className="flex items-center gap-2">
            {favorites.map((fav) => {
              const isActive =
                currentCity &&
                Math.abs(fav.latitude - currentCity.latitude) < 0.05 &&
                Math.abs(fav.longitude - currentCity.longitude) < 0.05;
              return (
                <button
                  key={`${fav.id}-${fav.latitude}`}
                  onClick={() => onSelectCity(fav)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition-all flex items-center gap-1.5 ${
                    isActive
                      ? "bg-sky-500/20 border border-sky-500/50 text-sky-300 shadow-sm"
                      : "bg-slate-800/80 border border-slate-700/80 text-slate-300 hover:bg-slate-700 hover:text-white"
                  }`}
                >
                  <span>{fav.name}</span>
                  {fav.country_code && (
                    <span className="text-[10px] text-slate-500 font-mono uppercase">
                      {fav.country_code}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </header>
  );
};
