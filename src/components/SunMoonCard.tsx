import React from "react";
import { Sunrise, Sunset, Sun, Moon, Clock } from "lucide-react";
import { WeatherData } from "../types/weather";

interface SunMoonCardProps {
  weather: WeatherData;
}

export const SunMoonCard: React.FC<SunMoonCardProps> = ({ weather }) => {
  const daily = weather.daily;
  if (!daily || !daily.sunrise || !daily.sunset) return null;

  const sunriseStr = daily.sunrise[0];
  const sunsetStr = daily.sunset[0];

  const sunriseDate = new Date(sunriseStr);
  const sunsetDate = new Date(sunsetStr);

  const formattedSunrise = sunriseDate.toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });

  const formattedSunset = sunsetDate.toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });

  // Calculate day length duration
  const diffMs = sunsetDate.getTime() - sunriseDate.getTime();
  const hours = Math.floor(diffMs / (1000 * 60 * 60));
  const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

  // Calculate day progress percentage
  const now = new Date();
  const dayProgress =
    now.getTime() < sunriseDate.getTime()
      ? 0
      : now.getTime() > sunsetDate.getTime()
      ? 100
      : Math.round(((now.getTime() - sunriseDate.getTime()) / diffMs) * 100);

  return (
    <div className="bg-slate-900/80 backdrop-blur-md border border-slate-800 rounded-3xl p-5 shadow-xl flex flex-col justify-between">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2 text-slate-100 font-bold">
          <Sun className="w-5 h-5 text-amber-400" />
          <span>Solar Cycle & Day Length</span>
        </div>
        <span className="text-xs text-slate-400 font-mono">
          {hours}h {minutes}m Daylight
        </span>
      </div>

      {/* Solar Arc Graphic */}
      <div className="relative my-4 flex flex-col items-center">
        {/* Semi-circle Arc Background */}
        <div className="w-full max-w-[260px] h-28 border-t-2 border-dashed border-amber-400/40 rounded-t-full relative flex items-end justify-between px-2">
          {/* Animated Sun Position along Arc */}
          <div
            className="absolute -top-3 w-6 h-6 rounded-full bg-amber-400 shadow-lg shadow-amber-400/50 flex items-center justify-center text-slate-950 font-bold transition-all duration-700"
            style={{
              left: `calc(${dayProgress}% - 12px)`,
            }}
          >
            <Sun className="w-4 h-4 animate-spin-slow" />
          </div>
        </div>

        {/* Base Horizon Line */}
        <div className="w-full border-b border-slate-700 mt-[-2px]" />

        {/* Progress Bar Label */}
        <div className="w-full flex justify-between text-xs text-slate-400 font-mono mt-3">
          <div className="flex items-center gap-1.5 text-slate-200">
            <Sunrise className="w-4 h-4 text-amber-400" />
            <div>
              <div className="text-[10px] text-slate-400">Sunrise</div>
              <div className="font-bold">{formattedSunrise}</div>
            </div>
          </div>

          <div className="flex items-center gap-1 text-sky-400 font-semibold text-xs">
            <Clock className="w-3.5 h-3.5" />
            <span>{dayProgress}% Day Complete</span>
          </div>

          <div className="flex items-center gap-1.5 text-slate-200 text-right">
            <div>
              <div className="text-[10px] text-slate-400">Sunset</div>
              <div className="font-bold">{formattedSunset}</div>
            </div>
            <Sunset className="w-4 h-4 text-orange-400" />
          </div>
        </div>
      </div>
    </div>
  );
};
