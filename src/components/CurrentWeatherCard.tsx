import React from "react";
import {
  Sun,
  Moon,
  CloudSun,
  CloudMoon,
  Cloud,
  CloudFog,
  CloudDrizzle,
  CloudRain,
  CloudRainWind,
  CloudHail,
  Snowflake,
  CloudLightning,
  SunDim,
  Wind,
  Droplets,
  Gauge,
  Eye,
  Thermometer,
  ShieldAlert,
  ArrowUp,
  ArrowDown,
  Navigation,
} from "lucide-react";
import { WeatherData, AirQualityData, TempUnit } from "../types/weather";
import {
  getWeatherCondition,
  formatTemp,
  formatSpeed,
  getUVInfo,
  getAQIInfo,
} from "../utils/weatherUtils";

interface CurrentWeatherCardProps {
  weather: WeatherData;
  airQuality?: AirQualityData | null;
  tempUnit: TempUnit;
  cityName: string;
}

export const CurrentWeatherCard: React.FC<CurrentWeatherCardProps> = ({
  weather,
  airQuality,
  tempUnit,
  cityName,
}) => {
  const current = weather.current;
  const condition = getWeatherCondition(current.weather_code, current.is_day);
  const uvMax = weather.daily.uv_index_max?.[0] || 0;
  const uvInfo = getUVInfo(uvMax);
  const aqiVal = airQuality?.current?.us_aqi;
  const aqiInfo = aqiVal !== undefined ? getAQIInfo(aqiVal) : null;

  // Render weather icon dynamically based on name
  const renderWeatherIcon = (iconName: string) => {
    const props = { className: "w-16 h-16 sm:w-20 sm:h-20 drop-shadow-md animate-pulse" };
    switch (iconName) {
      case "Sun":
        return <Sun {...props} className={`${props.className} text-amber-400`} />;
      case "Moon":
        return <Moon {...props} className={`${props.className} text-indigo-300`} />;
      case "SunDim":
        return <SunDim {...props} className={`${props.className} text-amber-300`} />;
      case "CloudSun":
        return <CloudSun {...props} className={`${props.className} text-amber-300`} />;
      case "CloudMoon":
        return <CloudMoon {...props} className={`${props.className} text-indigo-200`} />;
      case "Cloud":
        return <Cloud {...props} className={`${props.className} text-slate-300`} />;
      case "CloudFog":
        return <CloudFog {...props} className={`${props.className} text-teal-300`} />;
      case "CloudDrizzle":
        return <CloudDrizzle {...props} className={`${props.className} text-cyan-300`} />;
      case "CloudRain":
        return <CloudRain {...props} className={`${props.className} text-blue-400`} />;
      case "CloudRainWind":
        return <CloudRainWind {...props} className={`${props.className} text-blue-300`} />;
      case "CloudHail":
        return <CloudHail {...props} className={`${props.className} text-cyan-200`} />;
      case "Snowflake":
        return <Snowflake {...props} className={`${props.className} text-sky-200`} />;
      case "CloudLightning":
        return <CloudLightning {...props} className={`${props.className} text-purple-400`} />;
      default:
        return <Sun {...props} className={`${props.className} text-amber-400`} />;
    }
  };

  const todayMax = weather.daily.temperature_2m_max?.[0];
  const todayMin = weather.daily.temperature_2m_min?.[0];

  return (
    <div
      className={`relative overflow-hidden rounded-3xl p-6 sm:p-8 bg-gradient-to-br ${condition.bgGradient} shadow-2xl border border-white/10 text-white transition-all duration-500`}
    >
      {/* Decorative Atmosphere Glow Circle */}
      <div className="absolute -top-24 -right-24 w-72 h-72 bg-white/10 rounded-full blur-3xl pointer-events-none" />

      {/* Main Top Header */}
      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-white/15">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black/20 backdrop-blur-md border border-white/15 text-xs font-semibold uppercase tracking-wider mb-2 text-slate-200">
            <span>Live Weather</span>
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">{cityName}</h2>
          <p className="text-sm text-slate-200/90 font-medium mt-0.5">{condition.description}</p>
        </div>

        {/* Condition Icon & Condition Badge */}
        <div className="flex items-center gap-4">
          {renderWeatherIcon(condition.iconName)}
          <div>
            <div className="text-xl sm:text-2xl font-bold leading-none">{condition.label}</div>
            <div className="text-xs text-slate-200/80 mt-1 flex items-center gap-2 font-mono">
              <span className="flex items-center gap-0.5">
                <ArrowUp className="w-3 h-3 text-rose-300" />
                {formatTemp(todayMax, tempUnit)}
              </span>
              <span className="flex items-center gap-0.5">
                <ArrowDown className="w-3 h-3 text-sky-300" />
                {formatTemp(todayMin, tempUnit)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Temperature display */}
      <div className="relative z-10 my-6 flex flex-col sm:flex-row sm:items-baseline gap-2 sm:gap-6">
        <div className="text-6xl sm:text-7xl font-black tracking-tight font-mono">
          {formatTemp(current.temperature_2m, tempUnit)}
        </div>
        <div className="flex flex-col">
          <div className="text-sm font-semibold text-slate-200 flex items-center gap-1.5">
            <Thermometer className="w-4 h-4 text-amber-300" />
            Feels like {formatTemp(current.apparent_temperature, tempUnit)}
          </div>
          <div className="text-xs text-slate-300/80 mt-1">
            Cloud cover: <span className="font-semibold text-white">{current.cloud_cover}%</span>
          </div>
        </div>
      </div>

      {/* Key Metrics Grid */}
      <div className="relative z-10 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 pt-2">
        {/* Wind */}
        <div className="bg-black/25 backdrop-blur-md border border-white/10 rounded-2xl p-3.5 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-300 text-xs font-medium">
            <span>Wind</span>
            <Wind className="w-4 h-4 text-cyan-300" />
          </div>
          <div className="mt-2">
            <div className="text-base font-bold font-mono">
              {formatSpeed(current.wind_speed_10m, tempUnit)}
            </div>
            <div className="text-[11px] text-slate-300/80 flex items-center gap-1 mt-0.5">
              <Navigation
                className="w-3 h-3 text-cyan-300 inline-block"
                style={{ transform: `rotate(${current.wind_direction_10m}deg)` }}
              />
              <span>Gusts: {formatSpeed(current.wind_gusts_10m, tempUnit)}</span>
            </div>
          </div>
        </div>

        {/* Humidity */}
        <div className="bg-black/25 backdrop-blur-md border border-white/10 rounded-2xl p-3.5 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-300 text-xs font-medium">
            <span>Humidity</span>
            <Droplets className="w-4 h-4 text-sky-300" />
          </div>
          <div className="mt-2">
            <div className="text-base font-bold font-mono">{current.relative_humidity_2m}%</div>
            <div className="text-[11px] text-slate-300/80 mt-0.5">
              Precip: {current.precipitation} mm
            </div>
          </div>
        </div>

        {/* Pressure */}
        <div className="bg-black/25 backdrop-blur-md border border-white/10 rounded-2xl p-3.5 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-300 text-xs font-medium">
            <span>Pressure</span>
            <Gauge className="w-4 h-4 text-purple-300" />
          </div>
          <div className="mt-2">
            <div className="text-base font-bold font-mono">{Math.round(current.pressure_msl)} hPa</div>
            <div className="text-[11px] text-slate-300/80 mt-0.5">Sea Level</div>
          </div>
        </div>

        {/* UV Index */}
        <div className="bg-black/25 backdrop-blur-md border border-white/10 rounded-2xl p-3.5 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-300 text-xs font-medium">
            <span>Max UV</span>
            <Sun className="w-4 h-4 text-amber-300" />
          </div>
          <div className="mt-2">
            <div className="text-base font-bold font-mono flex items-center gap-1.5">
              <span>{uvMax}</span>
              <span className={`text-xs px-1.5 py-0.5 rounded font-sans font-medium ${uvInfo.color} bg-black/40`}>
                {uvInfo.label}
              </span>
            </div>
            <div className="text-[11px] text-slate-300/80 mt-0.5 truncate">{uvInfo.advice}</div>
          </div>
        </div>

        {/* Visibility */}
        <div className="bg-black/25 backdrop-blur-md border border-white/10 rounded-2xl p-3.5 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-300 text-xs font-medium">
            <span>Visibility</span>
            <Eye className="w-4 h-4 text-emerald-300" />
          </div>
          <div className="mt-2">
            <div className="text-base font-bold font-mono">
              {weather.hourly?.visibility?.[0]
                ? `${(weather.hourly.visibility[0] / 1000).toFixed(1)} km`
                : "10+ km"}
            </div>
            <div className="text-[11px] text-slate-300/80 mt-0.5">Clear Line of Sight</div>
          </div>
        </div>

        {/* Air Quality Preview */}
        <div className="bg-black/25 backdrop-blur-md border border-white/10 rounded-2xl p-3.5 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-300 text-xs font-medium">
            <span>Air Quality</span>
            <ShieldAlert className="w-4 h-4 text-emerald-300" />
          </div>
          <div className="mt-2">
            {aqiVal !== undefined && aqiInfo ? (
              <>
                <div className="text-base font-bold font-mono flex items-center gap-1.5">
                  <span>AQI {aqiVal}</span>
                </div>
                <div className={`text-[11px] font-semibold mt-0.5 ${aqiInfo.color}`}>
                  {aqiInfo.label}
                </div>
              </>
            ) : (
              <div className="text-xs text-slate-400 mt-1">Loading AQI...</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
