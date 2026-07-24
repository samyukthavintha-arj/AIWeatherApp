import React from "react";
import {
  Compass,
  Shirt,
  CheckCircle2,
  AlertCircle,
  Activity,
  Bike,
  Footprints,
  Waves,
  Sparkles,
  Shield,
  Umbrella,
  Sun,
  Wind,
  Clock,
} from "lucide-react";
import { WeatherData, TempUnit } from "../types/weather";
import {
  calculateActivityScores,
  getWardrobeRecommendations,
  formatTemp,
} from "../utils/weatherUtils";

interface PlanningRecommendationsProps {
  weather: WeatherData;
  tempUnit: TempUnit;
}

export const PlanningRecommendations: React.FC<PlanningRecommendationsProps> = ({
  weather,
  tempUnit,
}) => {
  const current = weather.current;
  const uvMax = weather.daily.uv_index_max?.[0] || 0;
  const precipProb = weather.daily.precipitation_probability_max?.[0] || 0;

  const activityScores = calculateActivityScores(
    current.temperature_2m,
    current.wind_speed_10m,
    precipProb,
    uvMax,
    current.weather_code
  );

  const wardrobeItems = getWardrobeRecommendations(
    current.temperature_2m,
    precipProb,
    current.wind_speed_10m,
    uvMax
  );

  // Find optimal outdoor hours today
  const hourly = weather.hourly;
  let bestHoursText = "Morning (7 AM - 10 AM)";
  if (hourly && hourly.time) {
    const todayISO = new Date().toISOString().slice(0, 10);
    const todayIndices = hourly.time
      .map((t, idx) => (t.startsWith(todayISO) ? idx : -1))
      .filter((idx) => idx !== -1);

    if (todayIndices.length > 0) {
      const best = todayIndices
        .map((idx) => ({
          time: new Date(hourly.time[idx]).toLocaleTimeString([], {
            hour: "numeric",
            hour12: true,
          }),
          temp: hourly.temperature_2m[idx],
          rain: hourly.precipitation_probability[idx] ?? 0,
        }))
        .filter((item) => item.rain < 20)
        .slice(0, 3);

      if (best.length > 0) {
        bestHoursText = `${best[0].time} - ${best[best.length - 1].time} (${formatTemp(
          best[0].temp,
          tempUnit
        )})`;
      }
    }
  }

  const renderActivityIcon = (icon: string) => {
    const props = { className: "w-5 h-5 text-sky-400" };
    switch (icon) {
      case "Activity":
        return <Activity {...props} />;
      case "Bike":
        return <Bike {...props} />;
      case "Footprints":
        return <Footprints {...props} />;
      case "Waves":
        return <Waves {...props} />;
      case "Sparkles":
        return <Sparkles {...props} />;
      default:
        return <Compass {...props} />;
    }
  };

  const renderWardrobeIcon = (iconName: string) => {
    const props = { className: "w-4 h-4 text-sky-300" };
    switch (iconName) {
      case "Shirt":
        return <Shirt {...props} />;
      case "Umbrella":
        return <Umbrella {...props} className="w-4 h-4 text-sky-400" />;
      case "Sun":
        return <Sun {...props} className="w-4 h-4 text-amber-400" />;
      case "Wind":
        return <Wind {...props} className="w-4 h-4 text-cyan-300" />;
      case "Shield":
        return <Shield {...props} className="w-4 h-4 text-indigo-300" />;
      default:
        return <CheckCircle2 {...props} />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Activity Suitability Grid */}
      <div className="bg-slate-900/80 backdrop-blur-md border border-slate-800 rounded-3xl p-5 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-5">
          <div className="flex items-center gap-2 text-slate-100 font-bold">
            <Compass className="w-5 h-5 text-sky-400" />
            <span>Outdoor Activity Suitability Index</span>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-sky-300 bg-sky-500/10 px-3 py-1 rounded-full border border-sky-500/20 font-medium">
            <Clock className="w-3.5 h-3.5" />
            <span>Best Window Today: {bestHoursText}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {activityScores.map((item) => {
            const isHigh = item.score >= 75;
            const isMid = item.score >= 45 && item.score < 75;

            return (
              <div
                key={item.name}
                className="bg-slate-800/40 border border-slate-700/60 rounded-2xl p-4 flex flex-col justify-between transition-all hover:bg-slate-800/70 hover:border-slate-600"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2.5">
                      <div className="p-2 rounded-xl bg-slate-900 border border-slate-700">
                        {renderActivityIcon(item.icon)}
                      </div>
                      <span className="text-sm font-bold text-slate-100">{item.name}</span>
                    </div>

                    <span
                      className={`px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider ${
                        isHigh
                          ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                          : isMid
                          ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                          : "bg-rose-500/20 text-rose-300 border border-rose-500/30"
                      }`}
                    >
                      {item.status}
                    </span>
                  </div>

                  {/* Progress Bar */}
                  <div className="my-2.5">
                    <div className="flex justify-between text-xs font-mono text-slate-400 mb-1">
                      <span>Score</span>
                      <span className="font-bold text-slate-200">{item.score}/100</span>
                    </div>
                    <div className="h-2 w-full bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          isHigh
                            ? "bg-gradient-to-r from-emerald-500 to-teal-400"
                            : isMid
                            ? "bg-gradient-to-r from-amber-500 to-orange-400"
                            : "bg-gradient-to-r from-rose-500 to-red-600"
                        }`}
                        style={{ width: `${item.score}%` }}
                      />
                    </div>
                  </div>

                  <p className="text-xs text-slate-300/80 mt-2 line-clamp-2">{item.reason}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Wardrobe & Gear Recommendations */}
      <div className="bg-slate-900/80 backdrop-blur-md border border-slate-800 rounded-3xl p-5 shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2 text-slate-100 font-bold">
            <Shirt className="w-5 h-5 text-amber-400" />
            <span>Smart Wardrobe & Essentials Checklist</span>
          </div>
          <span className="text-xs text-slate-400">Tailored to active weather</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
          {wardrobeItems.map((item, index) => (
            <div
              key={index}
              className={`p-3.5 rounded-2xl border flex items-center gap-3 transition-all ${
                item.important
                  ? "bg-amber-500/10 border-amber-500/30 text-slate-100"
                  : "bg-slate-800/40 border-slate-700/60 text-slate-200"
              }`}
            >
              <div
                className={`p-2 rounded-xl shrink-0 ${
                  item.important
                    ? "bg-amber-500/20 text-amber-300"
                    : "bg-slate-900 text-slate-300"
                }`}
              >
                {renderWardrobeIcon(item.icon)}
              </div>
              <div>
                <div className="text-xs font-bold leading-snug">{item.name}</div>
                <div className="text-[10px] text-slate-400 font-mono uppercase tracking-wider mt-0.5">
                  {item.category} {item.important ? "• Recommended" : ""}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
