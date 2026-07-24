import React, { useState } from "react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { TrendingUp, Droplets, Wind, Sun, Thermometer } from "lucide-react";
import { WeatherData, TempUnit } from "../types/weather";
import { celsiusToFahrenheit, kmhToMph } from "../utils/weatherUtils";

interface WeatherChartsProps {
  weather: WeatherData;
  tempUnit: TempUnit;
}

export const WeatherCharts: React.FC<WeatherChartsProps> = ({
  weather,
  tempUnit,
}) => {
  const [activeTab, setActiveTab] = useState<"temperature" | "precipitation" | "wind" | "uv">("temperature");

  if (!weather.hourly || !weather.hourly.time) return null;

  // Prepare 24-hour chart dataset
  const nowISO = new Date().toISOString().slice(0, 13);
  let startIndex = weather.hourly.time.findIndex((t) => t.startsWith(nowISO));
  if (startIndex === -1) startIndex = 0;

  const chartData = weather.hourly.time
    .slice(startIndex, startIndex + 24)
    .map((timeStr, idx) => {
      const realIdx = startIndex + idx;
      const dateObj = new Date(timeStr);
      const hourStr = dateObj.toLocaleTimeString([], {
        hour: "numeric",
        hour12: true,
      });

      const rawTemp = weather.hourly.temperature_2m[realIdx] ?? 0;
      const rawApparent = weather.hourly.apparent_temperature[realIdx] ?? rawTemp;
      const rawWind = weather.hourly.wind_speed_10m[realIdx] ?? 0;
      const precipProb = weather.hourly.precipitation_probability[realIdx] ?? 0;
      const precip = weather.hourly.precipitation[realIdx] ?? 0;
      const uv = weather.hourly.uv_index[realIdx] ?? 0;
      const humidity = weather.hourly.relative_humidity_2m[realIdx] ?? 0;

      const temp = tempUnit === "F" ? celsiusToFahrenheit(rawTemp) : Math.round(rawTemp);
      const apparentTemp =
        tempUnit === "F" ? celsiusToFahrenheit(rawApparent) : Math.round(rawApparent);
      const windSpeed = tempUnit === "F" ? kmhToMph(rawWind) : Math.round(rawWind);

      return {
        time: hourStr,
        temperature: temp,
        feelsLike: apparentTemp,
        precipitationProb: precipProb,
        precipitationMm: parseFloat(precip.toFixed(1)),
        windSpeed,
        uvIndex: uv,
        humidity,
      };
    });

  // Custom Dark Tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-900 border border-slate-700 p-3 rounded-xl shadow-2xl text-xs space-y-1 font-mono">
          <p className="font-bold text-slate-200 border-b border-slate-800 pb-1 mb-1">
            {label}
          </p>
          {payload.map((entry: any, index: number) => (
            <p key={`item-${index}`} style={{ color: entry.color }} className="flex justify-between gap-4">
              <span>{entry.name}:</span>
              <span className="font-bold">{entry.value} {entry.unit || ""}</span>
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-slate-900/80 backdrop-blur-md border border-slate-800 rounded-3xl p-5 shadow-xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
        <div className="flex items-center gap-2 text-slate-100 font-bold">
          <TrendingUp className="w-5 h-5 text-sky-400" />
          <span>Weather Analytics & Trend Charts</span>
        </div>

        {/* Tab Buttons */}
        <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800 overflow-x-auto">
          <button
            onClick={() => setActiveTab("temperature")}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all whitespace-nowrap ${
              activeTab === "temperature"
                ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <Thermometer className="w-3.5 h-3.5" />
            <span>Temperature</span>
          </button>

          <button
            onClick={() => setActiveTab("precipitation")}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all whitespace-nowrap ${
              activeTab === "precipitation"
                ? "bg-sky-500/20 text-sky-300 border border-sky-500/30"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <Droplets className="w-3.5 h-3.5" />
            <span>Precipitation</span>
          </button>

          <button
            onClick={() => setActiveTab("wind")}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all whitespace-nowrap ${
              activeTab === "wind"
                ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/30"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <Wind className="w-3.5 h-3.5" />
            <span>Wind</span>
          </button>

          <button
            onClick={() => setActiveTab("uv")}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all whitespace-nowrap ${
              activeTab === "uv"
                ? "bg-purple-500/20 text-purple-300 border border-purple-500/30"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <Sun className="w-3.5 h-3.5" />
            <span>UV & Humidity</span>
          </button>
        </div>
      </div>

      {/* Chart Canvas Area */}
      <div className="h-64 sm:h-72 w-full pt-2">
        <ResponsiveContainer width="100%" height="100%">
          {activeTab === "temperature" ? (
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="tempGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="apparentGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#38bdf8" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.4} />
              <XAxis dataKey="time" stroke="#94a3b8" fontSize={11} tickLine={false} />
              <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} unit={`°${tempUnit}`} />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ paddingTop: "10px", fontSize: "12px" }} />
              <Area
                type="monotone"
                dataKey="temperature"
                name={`Temperature (°${tempUnit})`}
                stroke="#f59e0b"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#tempGrad)"
              />
              <Area
                type="monotone"
                dataKey="feelsLike"
                name={`Feels Like (°${tempUnit})`}
                stroke="#38bdf8"
                strokeWidth={2}
                strokeDasharray="4 4"
                fillOpacity={1}
                fill="url(#apparentGrad)"
              />
            </AreaChart>
          ) : activeTab === "precipitation" ? (
            <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.4} />
              <XAxis dataKey="time" stroke="#94a3b8" fontSize={11} tickLine={false} />
              <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} unit="%" domain={[0, 100]} />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ paddingTop: "10px", fontSize: "12px" }} />
              <Bar
                dataKey="precipitationProb"
                name="Rain Chance (%)"
                fill="#38bdf8"
                radius={[6, 6, 0, 0]}
              />
            </BarChart>
          ) : activeTab === "wind" ? (
            <LineChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.4} />
              <XAxis dataKey="time" stroke="#94a3b8" fontSize={11} tickLine={false} />
              <YAxis
                stroke="#94a3b8"
                fontSize={11}
                tickLine={false}
                unit={tempUnit === "F" ? "mph" : "kmh"}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ paddingTop: "10px", fontSize: "12px" }} />
              <Line
                type="monotone"
                dataKey="windSpeed"
                name={`Wind Speed (${tempUnit === "F" ? "mph" : "km/h"})`}
                stroke="#22d3ee"
                strokeWidth={3}
                dot={{ r: 3, fill: "#22d3ee" }}
              />
            </LineChart>
          ) : (
            <LineChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.4} />
              <XAxis dataKey="time" stroke="#94a3b8" fontSize={11} tickLine={false} />
              <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ paddingTop: "10px", fontSize: "12px" }} />
              <Line
                type="monotone"
                dataKey="uvIndex"
                name="UV Index"
                stroke="#a855f7"
                strokeWidth={2.5}
                dot={{ r: 3, fill: "#a855f7" }}
              />
              <Line
                type="monotone"
                dataKey="humidity"
                name="Humidity (%)"
                stroke="#06b6d4"
                strokeWidth={2}
                strokeDasharray="3 3"
              />
            </LineChart>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  );
};
