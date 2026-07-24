import React from "react";
import {
  Clock,
  Droplets,
  Wind,
  Sun,
  Moon,
  CloudSun,
  CloudMoon,
  Cloud,
  CloudFog,
  CloudDrizzle,
  CloudRain,
  Snowflake,
  CloudLightning,
} from "lucide-react";
import { WeatherData, TempUnit } from "../types/weather";
import { formatTemp, formatSpeed } from "../utils/weatherUtils";

interface HourlyForecastCardProps {
  weather: WeatherData;
  tempUnit: TempUnit;
}

export const HourlyForecastCard: React.FC<HourlyForecastCardProps> = ({
  weather,
  tempUnit,
}) => {
  const hourly = weather.hourly;
  if (!hourly || !hourly.time) return null;

  // Take next 24 hours starting from current hour
  const nowISO = new Date().toISOString().slice(0, 13);
  let startIndex = hourly.time.findIndex((t) => t.startsWith(nowISO));
  if (startIndex === -1) startIndex = 0;

  const next24 = hourly.time.slice(startIndex, startIndex + 24).map((timeStr, idx) => {
    const realIdx = startIndex + idx;
    const dateObj = new Date(timeStr);
    const hourFormatted = dateObj.toLocaleTimeString([], {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
    const code = hourly.weather_code[realIdx] ?? 0;
    const temp = hourly.temperature_2m[realIdx];
    const precipProb = hourly.precipitation_probability[realIdx] ?? 0;
    const wind = hourly.wind_speed_10m[realIdx] ?? 0;
    const isDay = dateObj.getHours() >= 6 && dateObj.getHours() < 20 ? 1 : 0;

    return {
      timeStr,
      hourFormatted: idx === 0 ? "Now" : hourFormatted,
      code,
      temp,
      precipProb,
      wind,
      isDay,
    };
  });

  const renderIcon = (code: number, isDay: number) => {
    const props = { className: "w-6 h-6" };
    if (code === 0) {
      return isDay ? (
        <Sun {...props} className="text-amber-400" />
      ) : (
        <Moon {...props} className="text-indigo-300" />
      );
    }
    if ([1, 2].includes(code)) {
      return isDay ? (
        <CloudSun {...props} className="text-amber-300" />
      ) : (
        <CloudMoon {...props} className="text-indigo-200" />
      );
    }
    if (code === 3) return <Cloud {...props} className="text-slate-300" />;
    if ([45, 48].includes(code)) return <CloudFog {...props} className="text-teal-300" />;
    if ([51, 53, 55].includes(code)) return <CloudDrizzle {...props} className="text-cyan-300" />;
    if ([61, 63, 65, 80, 81, 82].includes(code))
      return <CloudRain {...props} className="text-blue-400" />;
    if ([71, 73, 75, 77, 85, 86].includes(code))
      return <Snowflake {...props} className="text-sky-200" />;
    if ([95, 96, 99].includes(code))
      return <CloudLightning {...props} className="text-purple-400" />;
    return <Sun {...props} className="text-amber-400" />;
  };

  return (
    <div className="bg-slate-900/80 backdrop-blur-md border border-slate-800 rounded-3xl p-5 shadow-xl">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2 text-slate-100 font-bold">
          <Clock className="w-5 h-5 text-sky-400" />
          <span>Hourly Forecast (Next 24 Hours)</span>
        </div>
        <span className="text-xs text-slate-400 font-mono">24h Timeline</span>
      </div>

      {/* Horizontal Scroll Container */}
      <div className="flex items-center gap-3 overflow-x-auto pb-3 pt-1 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-slate-800/50">
        {next24.map((item, index) => (
          <div
            key={item.timeStr + index}
            className={`flex-shrink-0 w-24 p-3 rounded-2xl border flex flex-col items-center justify-between gap-2.5 transition-all hover:border-sky-500/50 hover:scale-105 ${
              index === 0
                ? "bg-sky-500/15 border-sky-500/40 text-white shadow-lg shadow-sky-500/10"
                : "bg-slate-800/60 border-slate-700/70 text-slate-200"
            }`}
          >
            {/* Time */}
            <span
              className={`text-xs font-semibold ${
                index === 0 ? "text-sky-300 font-bold" : "text-slate-300"
              }`}
            >
              {item.hourFormatted}
            </span>

            {/* Weather Icon */}
            <div className="p-1.5 rounded-full bg-slate-900/50">
              {renderIcon(item.code, item.isDay)}
            </div>

            {/* Temperature */}
            <span className="text-sm font-extrabold font-mono">
              {formatTemp(item.temp, tempUnit)}
            </span>

            {/* Precipitation Chance */}
            <div className="w-full flex items-center justify-center gap-1 text-[11px] font-mono">
              <Droplets
                className={`w-3 h-3 ${
                  item.precipProb > 30 ? "text-sky-400 fill-sky-400" : "text-slate-500"
                }`}
              />
              <span
                className={
                  item.precipProb > 30 ? "text-sky-400 font-bold" : "text-slate-400"
                }
              >
                {item.precipProb}%
              </span>
            </div>

            {/* Wind */}
            <div className="text-[10px] text-slate-400 font-mono flex items-center gap-0.5">
              <Wind className="w-2.5 h-2.5 text-slate-500" />
              <span>{formatSpeed(item.wind, tempUnit)}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
