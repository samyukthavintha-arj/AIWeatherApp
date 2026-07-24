import React, { useState } from "react";
import {
  Calendar,
  ChevronDown,
  ChevronUp,
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
  Sparkles,
} from "lucide-react";
import { WeatherData, TempUnit } from "../types/weather";
import {
  getWeatherCondition,
  formatTemp,
  formatSpeed,
} from "../utils/weatherUtils";

interface DailyForecastCardProps {
  weather: WeatherData;
  tempUnit: TempUnit;
}

export const DailyForecastCard: React.FC<DailyForecastCardProps> = ({
  weather,
  tempUnit,
}) => {
  const daily = weather.daily;
  const [expandedDayIndex, setExpandedDayIndex] = useState<number | null>(null);

  if (!daily || !daily.time) return null;

  // Calculate overall min/max for temperature range bar math
  const allMax = Math.max(...daily.temperature_2m_max);
  const allMin = Math.min(...daily.temperature_2m_min);
  const tempRange = allMax - allMin || 1;

  const renderIcon = (code: number) => {
    const props = { className: "w-6 h-6" };
    if (code === 0) return <Sun {...props} className="text-amber-400" />;
    if ([1, 2].includes(code)) return <CloudSun {...props} className="text-amber-300" />;
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

  const toggleExpand = (index: number) => {
    setExpandedDayIndex(expandedDayIndex === index ? null : index);
  };

  return (
    <div className="bg-slate-900/80 backdrop-blur-md border border-slate-800 rounded-3xl p-5 shadow-xl">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2 text-slate-100 font-bold">
          <Calendar className="w-5 h-5 text-sky-400" />
          <span>7-Day Weather Outlook</span>
        </div>
        <span className="text-xs text-slate-400">Click day for hourly details</span>
      </div>

      <div className="space-y-2.5">
        {daily.time.slice(0, 7).map((dateStr, index) => {
          const dateObj = new Date(dateStr + "T00:00:00");
          const isToday = index === 0;

          const dayName = isToday
            ? "Today"
            : dateObj.toLocaleDateString("en-US", { weekday: "short" });
          const monthDay = dateObj.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
          });

          const code = daily.weather_code[index];
          const cond = getWeatherCondition(code, 1);
          const maxTemp = daily.temperature_2m_max[index];
          const minTemp = daily.temperature_2m_min[index];
          const precipProb = daily.precipitation_probability_max?.[index] ?? 0;
          const precipSum = daily.precipitation_sum?.[index] ?? 0;
          const uvMax = daily.uv_index_max?.[index] ?? 0;
          const windMax = daily.wind_speed_10m_max?.[index] ?? 0;

          // Bar calculations
          const leftPercent = ((minTemp - allMin) / tempRange) * 100;
          const widthPercent = Math.max(8, ((maxTemp - minTemp) / tempRange) * 100);

          const isExpanded = expandedDayIndex === index;

          // Extract hourly items for this specific day
          const dayISO = dateStr;
          const dayHourlyIndices = weather.hourly?.time
            ? weather.hourly.time
                .map((t, idx) => (t.startsWith(dayISO) ? idx : -1))
                .filter((idx) => idx !== -1)
            : [];

          return (
            <div
              key={dateStr}
              className={`rounded-2xl border transition-all overflow-hidden ${
                isExpanded
                  ? "bg-slate-800/90 border-sky-500/50 ring-1 ring-sky-500/30"
                  : isToday
                  ? "bg-slate-800/50 border-sky-500/30 hover:border-slate-700"
                  : "bg-slate-800/30 border-slate-800 hover:bg-slate-800/60 hover:border-slate-700"
              }`}
            >
              <div
                onClick={() => toggleExpand(index)}
                className="p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 cursor-pointer select-none"
              >
                {/* Day & Icon */}
                <div className="flex items-center gap-3 min-w-[170px]">
                  <div className="p-2 rounded-xl bg-slate-900/60 shrink-0">
                    {renderIcon(code)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-100 text-sm">{dayName}</span>
                      {isToday && (
                        <span className="px-2 py-0.5 rounded-full bg-sky-500/20 text-sky-400 text-[10px] font-bold uppercase tracking-wider">
                          Today
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-slate-400 flex items-center gap-2">
                      <span>{monthDay}</span>
                      <span className="text-slate-600">•</span>
                      <span className="text-slate-300 font-medium">{cond.label}</span>
                    </div>
                  </div>
                </div>

                {/* Rain & UV Badges */}
                <div className="flex items-center gap-3 text-xs font-mono">
                  {precipProb > 0 ? (
                    <div className="flex items-center gap-1 text-sky-400 bg-sky-500/10 px-2.5 py-1 rounded-lg border border-sky-500/20">
                      <Droplets className="w-3.5 h-3.5" />
                      <span>{precipProb}%</span>
                      {precipSum > 0 && (
                        <span className="text-[10px] text-sky-300/80">({precipSum}mm)</span>
                      )}
                    </div>
                  ) : (
                    <div className="flex items-center gap-1 text-slate-500 px-2.5 py-1">
                      <Droplets className="w-3.5 h-3.5" />
                      <span>0%</span>
                    </div>
                  )}

                  <div className="hidden md:flex items-center gap-1 text-amber-400 bg-amber-500/10 px-2 py-1 rounded-lg border border-amber-500/20">
                    <Sun className="w-3.5 h-3.5" />
                    <span>UV {uvMax}</span>
                  </div>
                </div>

                {/* Temperature Range Visual Bar */}
                <div className="flex items-center gap-3 min-w-[180px] flex-1 sm:flex-initial">
                  <span className="text-xs font-semibold text-slate-400 font-mono w-10 text-right">
                    {formatTemp(minTemp, tempUnit)}
                  </span>
                  <div className="relative flex-1 h-2 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                    <div
                      className="absolute top-0 bottom-0 rounded-full bg-gradient-to-r from-sky-400 via-amber-400 to-rose-500"
                      style={{
                        left: `${leftPercent}%`,
                        width: `${widthPercent}%`,
                      }}
                    />
                  </div>
                  <span className="text-xs font-bold text-slate-100 font-mono w-10">
                    {formatTemp(maxTemp, tempUnit)}
                  </span>
                </div>

                {/* Expand Chevron */}
                <button className="text-slate-400 hover:text-white p-1 rounded-lg">
                  {isExpanded ? (
                    <ChevronUp className="w-4 h-4 text-sky-400" />
                  ) : (
                    <ChevronDown className="w-4 h-4" />
                  )}
                </button>
              </div>

              {/* Expandable Drilldown Content */}
              {isExpanded && (
                <div className="px-4 pb-4 pt-2 border-t border-slate-800 bg-slate-950/40">
                  <div className="flex items-center justify-between text-xs text-slate-400 font-semibold mb-3">
                    <span className="flex items-center gap-1 text-sky-300">
                      <Sparkles className="w-3.5 h-3.5" />
                      Detailed Hourly Breakdown for {dayName} ({monthDay})
                    </span>
                    <span className="text-slate-500 font-mono">
                      Max Wind: {formatSpeed(windMax, tempUnit)}
                    </span>
                  </div>

                  {/* Hourly mini list for this day */}
                  <div className="grid grid-cols-4 sm:grid-cols-8 md:grid-cols-12 gap-2">
                    {dayHourlyIndices.map((hIdx) => {
                      const hTime = weather.hourly.time[hIdx];
                      const hourStr = new Date(hTime).toLocaleTimeString([], {
                        hour: "numeric",
                        hour12: true,
                      });
                      const hTemp = weather.hourly.temperature_2m[hIdx];
                      const hPrecip = weather.hourly.precipitation_probability[hIdx] ?? 0;

                      return (
                        <div
                          key={hTime}
                          className="bg-slate-900/80 border border-slate-800 rounded-xl p-2 flex flex-col items-center justify-between text-center"
                        >
                          <span className="text-[10px] text-slate-400 font-medium">
                            {hourStr}
                          </span>
                          <span className="text-xs font-bold font-mono my-1 text-white">
                            {formatTemp(hTemp, tempUnit)}
                          </span>
                          <span
                            className={`text-[9px] font-mono ${
                              hPrecip > 20 ? "text-sky-400 font-bold" : "text-slate-500"
                            }`}
                          >
                            {hPrecip}%
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
