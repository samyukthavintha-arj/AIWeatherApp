import React from "react";
import { ShieldAlert, Info, Wind, HeartHandshake } from "lucide-react";
import { AirQualityData } from "../types/weather";
import { getAQIInfo } from "../utils/weatherUtils";

interface AirQualityCardProps {
  airQuality: AirQualityData | null;
}

export const AirQualityCard: React.FC<AirQualityCardProps> = ({ airQuality }) => {
  if (!airQuality || !airQuality.current) {
    return (
      <div className="bg-slate-900/80 backdrop-blur-md border border-slate-800 rounded-3xl p-5 shadow-xl text-center text-slate-400 text-xs">
        Loading real-time Air Quality metrics...
      </div>
    );
  }

  const curr = airQuality.current;
  const aqiVal = curr.us_aqi ?? 0;
  const aqiInfo = getAQIInfo(aqiVal);

  const pollutants = [
    { name: "PM2.5", value: curr.pm2_5, unit: "µg/m³", desc: "Fine Particles" },
    { name: "PM10", value: curr.pm10, unit: "µg/m³", desc: "Coarse Particles" },
    { name: "Ozone (O3)", value: curr.ozone, unit: "µg/m³", desc: "Ground Ozone" },
    { name: "NO2", value: curr.nitrogen_dioxide, unit: "µg/m³", desc: "Nitrogen Dioxide" },
    { name: "CO", value: curr.carbon_monoxide, unit: "µg/m³", desc: "Carbon Monoxide" },
    { name: "SO2", value: curr.sulphur_dioxide, unit: "µg/m³", desc: "Sulphur Dioxide" },
  ];

  return (
    <div className="bg-slate-900/80 backdrop-blur-md border border-slate-800 rounded-3xl p-5 shadow-xl">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2 text-slate-100 font-bold">
          <ShieldAlert className="w-5 h-5 text-emerald-400" />
          <span>Air Quality & Atmospheric Composition</span>
        </div>
        <span className="text-xs text-slate-400 font-mono">US AQI Standard</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* AQI Score Hero */}
        <div className={`p-5 rounded-2xl border ${aqiInfo.bgColor} flex flex-col justify-between`}>
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-slate-300">
              Current Air Quality Index
            </div>
            <div className="text-4xl font-extrabold font-mono my-2 text-white flex items-baseline gap-2">
              <span>{aqiVal}</span>
              <span className={`text-sm px-2.5 py-0.5 rounded-full ${aqiInfo.badgeBg} font-sans font-bold`}>
                {aqiInfo.label}
              </span>
            </div>
            <p className="text-xs text-slate-200/90 leading-relaxed">{aqiInfo.description}</p>
          </div>

          <div className="mt-4 pt-3 border-t border-white/10 flex items-center gap-1.5 text-xs text-slate-300">
            <HeartHandshake className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Outdoor workouts are safe for healthy individuals today.</span>
          </div>
        </div>

        {/* Pollutant Grid */}
        <div className="md:col-span-2 grid grid-cols-2 sm:grid-cols-3 gap-2.5">
          {pollutants.map((p) => (
            <div
              key={p.name}
              className="bg-slate-800/40 border border-slate-700/60 rounded-xl p-3 flex flex-col justify-between"
            >
              <div className="text-xs font-bold text-slate-200">{p.name}</div>
              <div className="text-lg font-extrabold font-mono text-sky-300 my-1">
                {p.value !== undefined ? p.value.toFixed(1) : "--"}
                <span className="text-[10px] font-normal text-slate-400 ml-1">{p.unit}</span>
              </div>
              <div className="text-[10px] text-slate-400 truncate">{p.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
