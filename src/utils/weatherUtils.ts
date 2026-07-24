import { WeatherConditionInfo, TempUnit } from "../types/weather";

// Convert Celsius to Fahrenheit
export const celsiusToFahrenheit = (c: number): number => {
  return Math.round((c * 9) / 5 + 32);
};

// Format temperature string with selected unit
export const formatTemp = (temp: number | undefined | null, unit: TempUnit): string => {
  if (temp === undefined || temp === null) return "--°";
  const rounded = Math.round(temp);
  if (unit === "F") {
    return `${celsiusToFahrenheit(rounded)}°F`;
  }
  return `${rounded}°C`;
};

// Convert Km/h to Mph
export const kmhToMph = (kmh: number): number => {
  return Math.round(kmh * 0.621371);
};

export const formatSpeed = (speedKmh: number, unit: TempUnit): string => {
  if (unit === "F") {
    return `${kmhToMph(speedKmh)} mph`;
  }
  return `${Math.round(speedKmh)} km/h`;
};

// WMO Weather Interpretation Codes (0-99)
export const getWeatherCondition = (code: number, isDay: number = 1): WeatherConditionInfo => {
  const day = isDay === 1;

  switch (code) {
    case 0:
      return {
        label: "Clear Sky",
        description: day ? "Sunny & bright" : "Clear starry night",
        iconName: day ? "Sun" : "Moon",
        theme: day ? "clear-day" : "clear-night",
        bgGradient: day
          ? "from-amber-400 via-orange-400 to-sky-500"
          : "from-slate-900 via-indigo-950 to-slate-900",
        textColor: "text-amber-500",
        cardBg: day ? "bg-amber-500/10 border-amber-500/20" : "bg-indigo-500/10 border-indigo-500/20",
      };
    case 1:
      return {
        label: "Mainly Clear",
        description: day ? "Mostly sunny with light sky" : "Mostly clear night",
        iconName: day ? "SunDim" : "Moon",
        theme: day ? "clear-day" : "clear-night",
        bgGradient: day
          ? "from-amber-300 via-sky-400 to-blue-500"
          : "from-slate-900 via-slate-800 to-indigo-950",
        textColor: "text-amber-400",
        cardBg: "bg-sky-500/10 border-sky-500/20",
      };
    case 2:
      return {
        label: "Partly Cloudy",
        description: "Scattered clouds in sky",
        iconName: day ? "CloudSun" : "CloudMoon",
        theme: "cloudy",
        bgGradient: day
          ? "from-sky-400 via-blue-500 to-slate-600"
          : "from-slate-900 via-slate-800 to-slate-900",
        textColor: "text-sky-400",
        cardBg: "bg-sky-500/10 border-sky-500/20",
      };
    case 3:
      return {
        label: "Overcast",
        description: "Dense cloud coverage",
        iconName: "Cloud",
        theme: "cloudy",
        bgGradient: "from-slate-600 via-slate-700 to-slate-800",
        textColor: "text-slate-300",
        cardBg: "bg-slate-500/10 border-slate-500/20",
      };
    case 45:
    case 48:
      return {
        label: "Foggy",
        description: "Depositing rime fog & reduced visibility",
        iconName: "CloudFog",
        theme: "fog",
        bgGradient: "from-slate-500 via-gray-600 to-slate-700",
        textColor: "text-teal-300",
        cardBg: "bg-teal-500/10 border-teal-500/20",
      };
    case 51:
    case 53:
    case 55:
      return {
        label: "Drizzle",
        description: "Light misty drizzle",
        iconName: "CloudDrizzle",
        theme: "rainy",
        bgGradient: "from-cyan-600 via-blue-600 to-slate-800",
        textColor: "text-cyan-400",
        cardBg: "bg-cyan-500/10 border-cyan-500/20",
      };
    case 56:
    case 57:
      return {
        label: "Freezing Drizzle",
        description: "Freezing mist and icy droplets",
        iconName: "CloudSnow",
        theme: "snowy",
        bgGradient: "from-cyan-700 via-slate-700 to-blue-900",
        textColor: "text-cyan-300",
        cardBg: "bg-cyan-500/10 border-cyan-500/20",
      };
    case 61:
      return {
        label: "Slight Rain",
        description: "Light rainfall showers",
        iconName: "CloudRain",
        theme: "rainy",
        bgGradient: "from-blue-600 via-indigo-700 to-slate-900",
        textColor: "text-blue-400",
        cardBg: "bg-blue-500/10 border-blue-500/20",
      };
    case 63:
      return {
        label: "Moderate Rain",
        description: "Steady rainfall expected",
        iconName: "CloudRain",
        theme: "rainy",
        bgGradient: "from-blue-700 via-indigo-800 to-slate-900",
        textColor: "text-blue-400",
        cardBg: "bg-blue-500/10 border-blue-500/20",
      };
    case 65:
      return {
        label: "Heavy Rain",
        description: "Torrential downpour and wet roads",
        iconName: "CloudRainWind",
        theme: "rainy",
        bgGradient: "from-slate-800 via-blue-900 to-slate-950",
        textColor: "text-blue-300",
        cardBg: "bg-blue-500/10 border-blue-500/20",
      };
    case 66:
    case 67:
      return {
        label: "Freezing Rain",
        description: "Icy freezing rain",
        iconName: "CloudHail",
        theme: "snowy",
        bgGradient: "from-slate-700 via-blue-900 to-slate-900",
        textColor: "text-teal-300",
        cardBg: "bg-teal-500/10 border-teal-500/20",
      };
    case 71:
    case 73:
    case 75:
      return {
        label: "Snowfall",
        description: "Snow accumulation and winter cold",
        iconName: "Snowflake",
        theme: "snowy",
        bgGradient: "from-sky-700 via-indigo-900 to-slate-900",
        textColor: "text-sky-300",
        cardBg: "bg-sky-500/10 border-sky-500/20",
      };
    case 77:
      return {
        label: "Snow Grains",
        description: "Tiny icy snow grains",
        iconName: "Snowflake",
        theme: "snowy",
        bgGradient: "from-sky-800 via-indigo-900 to-slate-900",
        textColor: "text-sky-300",
        cardBg: "bg-sky-500/10 border-sky-500/20",
      };
    case 80:
    case 81:
    case 82:
      return {
        label: "Rain Showers",
        description: "Passing rain showers",
        iconName: "CloudRain",
        theme: "rainy",
        bgGradient: "from-cyan-600 via-blue-800 to-slate-900",
        textColor: "text-cyan-400",
        cardBg: "bg-cyan-500/10 border-cyan-500/20",
      };
    case 85:
    case 86:
      return {
        label: "Snow Showers",
        description: "Frequent snow flurries",
        iconName: "Snowflake",
        theme: "snowy",
        bgGradient: "from-blue-800 via-slate-800 to-slate-950",
        textColor: "text-sky-200",
        cardBg: "bg-sky-500/10 border-sky-500/20",
      };
    case 95:
      return {
        label: "Thunderstorm",
        description: "Slight or moderate thunderstorm",
        iconName: "CloudLightning",
        theme: "thunder",
        bgGradient: "from-slate-900 via-purple-950 to-slate-950",
        textColor: "text-purple-400",
        cardBg: "bg-purple-500/10 border-purple-500/20",
      };
    case 96:
    case 99:
      return {
        label: "Thunderstorm with Hail",
        description: "Severe thunderstorm with hail risk",
        iconName: "CloudLightning",
        theme: "thunder",
        bgGradient: "from-purple-900 via-slate-900 to-slate-950",
        textColor: "text-purple-300",
        cardBg: "bg-purple-500/10 border-purple-500/20",
      };
    default:
      return {
        label: "Variable Weather",
        description: "Changing meteorological conditions",
        iconName: "SunMedium",
        theme: "clear-day",
        bgGradient: "from-sky-500 via-blue-600 to-slate-700",
        textColor: "text-sky-400",
        cardBg: "bg-sky-500/10 border-sky-500/20",
      };
  }
};

// Air Quality Index Helper
export const getAQIInfo = (usAqi: number) => {
  if (usAqi <= 50) {
    return {
      label: "Good",
      color: "text-emerald-400",
      bgColor: "bg-emerald-500/20 border-emerald-500/30",
      badgeBg: "bg-emerald-500 text-white",
      description: "Air quality is satisfactory with minimal health risk.",
    };
  } else if (usAqi <= 100) {
    return {
      label: "Moderate",
      color: "text-amber-400",
      bgColor: "bg-amber-500/20 border-amber-500/30",
      badgeBg: "bg-amber-500 text-slate-950",
      description: "Acceptable air quality for most. Unusually sensitive people should take care.",
    };
  } else if (usAqi <= 150) {
    return {
      label: "Unhealthy for Sensitive Groups",
      color: "text-orange-400",
      bgColor: "bg-orange-500/20 border-orange-500/30",
      badgeBg: "bg-orange-500 text-white",
      description: "Sensitive groups may experience health effects. General public less affected.",
    };
  } else if (usAqi <= 200) {
    return {
      label: "Unhealthy",
      color: "text-rose-400",
      bgColor: "bg-rose-500/20 border-rose-500/30",
      badgeBg: "bg-rose-500 text-white",
      description: "Everyone may begin to experience health effects. Limit prolonged outdoor exertion.",
    };
  } else if (usAqi <= 300) {
    return {
      label: "Very Unhealthy",
      color: "text-purple-400",
      bgColor: "bg-purple-500/20 border-purple-500/30",
      badgeBg: "bg-purple-500 text-white",
      description: "Health alert: risk of severe health effects for everyone.",
    };
  } else {
    return {
      label: "Hazardous",
      color: "text-red-500",
      bgColor: "bg-red-500/20 border-red-500/30",
      badgeBg: "bg-red-600 text-white",
      description: "Emergency condition! Avoid outdoor activities and keep windows closed.",
    };
  }
};

// UV Index Helper
export const getUVInfo = (uv: number) => {
  if (uv <= 2) {
    return { label: "Low", color: "text-emerald-400", advice: "Minimal danger. No protection required." };
  } else if (uv <= 5) {
    return { label: "Moderate", color: "text-amber-400", advice: "Wear sunglasses & SPF 30+ sunscreen if outside." };
  } else if (uv <= 7) {
    return { label: "High", color: "text-orange-400", advice: "Seek shade during peak hours (10am–4pm). Wear hat & sunscreen." };
  } else if (uv <= 10) {
    return { label: "Very High", color: "text-rose-400", advice: "Extra protection required. Avoid direct sun Exposure." };
  } else {
    return { label: "Extreme", color: "text-purple-400", advice: "Take all precautions. Unprotected skin burns in minutes." };
  }
};

// Calculate Activity Suitability Scores (0-100)
export interface ActivityScore {
  name: string;
  score: number;
  icon: string;
  status: "Ideal" | "Good" | "Fair" | "Poor";
  reason: string;
}

export const calculateActivityScores = (
  tempC: number,
  windKmh: number,
  precipProb: number,
  uvMax: number,
  code: number
): ActivityScore[] => {
  // Running
  let runScore = 100;
  if (tempC < 5 || tempC > 28) runScore -= 25;
  if (tempC > 32) runScore -= 30;
  if (precipProb > 30) runScore -= precipProb * 0.5;
  if (windKmh > 25) runScore -= 20;
  if ([95, 96, 99].includes(code)) runScore = 5;
  runScore = Math.max(0, Math.min(100, Math.round(runScore)));

  // Cycling
  let cycleScore = 100;
  if (windKmh > 20) cycleScore -= (windKmh - 20) * 2;
  if (precipProb > 20) cycleScore -= precipProb * 0.6;
  if (tempC < 8 || tempC > 30) cycleScore -= 20;
  if ([95, 96, 99].includes(code)) cycleScore = 5;
  cycleScore = Math.max(0, Math.min(100, Math.round(cycleScore)));

  // Hiking / Outdoor Walk
  let hikeScore = 100;
  if (precipProb > 25) hikeScore -= precipProb * 0.6;
  if (tempC < 2 || tempC > 33) hikeScore -= 30;
  if (windKmh > 30) hikeScore -= 25;
  if ([95, 96, 99].includes(code)) hikeScore = 5;
  hikeScore = Math.max(0, Math.min(100, Math.round(hikeScore)));

  // Beach / Swimming
  let beachScore = 50;
  if (tempC >= 24 && tempC <= 36) beachScore += 35;
  if (uvMax >= 4) beachScore += 15;
  if (precipProb > 20) beachScore -= precipProb * 0.7;
  if (windKmh > 25) beachScore -= 20;
  if (tempC < 20) beachScore = Math.min(20, beachScore);
  beachScore = Math.max(0, Math.min(100, Math.round(beachScore)));

  // Stargazing (night)
  let starScore = 100;
  if ([1, 2].includes(code)) starScore -= 30;
  if ([3, 45, 48, 51, 61, 63, 65, 95].includes(code)) starScore -= 70;
  if (precipProb > 10) starScore -= precipProb * 0.5;
  starScore = Math.max(0, Math.min(100, Math.round(starScore)));

  const getStatus = (score: number) => {
    if (score >= 80) return "Ideal";
    if (score >= 60) return "Good";
    if (score >= 40) return "Fair";
    return "Poor";
  };

  return [
    {
      name: "Running & Jogging",
      score: runScore,
      icon: "Activity",
      status: getStatus(runScore),
      reason:
        runScore > 75
          ? "Great thermal comfort and minimal rain risk."
          : runScore > 45
          ? "Manageable conditions, pace yourself."
          : "Challenging conditions due to rain, wind, or extreme temperature.",
    },
    {
      name: "Cycling & Biking",
      score: cycleScore,
      icon: "Bike",
      status: getStatus(cycleScore),
      reason:
        cycleScore > 75
          ? "Smooth roads and favorable wind speeds."
          : cycleScore > 45
          ? "Watch out for localized wind gusts."
          : "Wet pavement or high crosswinds expected.",
    },
    {
      name: "Hiking & Park Walk",
      score: hikeScore,
      icon: "Footprints",
      status: getStatus(hikeScore),
      reason:
        hikeScore > 75
          ? "Pleasant trail conditions with steady skies."
          : hikeScore > 45
          ? "Carry light rain gear just in case."
          : "High chance of precipitation or uncomfortable chill.",
    },
    {
      name: "Beach & Outdoor Pool",
      score: beachScore,
      icon: "Waves",
      status: getStatus(beachScore),
      reason:
        beachScore > 75
          ? "Warm sunshine and high UV index perfect for swimming."
          : beachScore > 45
          ? "Mild temperatures, bring a beach cover-up."
          : "Too cool or overcast for beach outings.",
    },
    {
      name: "Night Stargazing",
      score: starScore,
      icon: "Sparkles",
      status: getStatus(starScore),
      reason:
        starScore > 75
          ? "Clear night sky with sharp visibility."
          : starScore > 45
          ? "Partial cloud cover may obstruct stars."
          : "Overcast or rainy conditions obscure celestial views.",
    },
  ];
};

// Generate Recommended Wardrobe Items
export interface WardrobeItem {
  name: string;
  category: "Clothing" | "Footwear" | "Accessory" | "Gear";
  icon: string;
  important: boolean;
}

export const getWardrobeRecommendations = (
  tempC: number,
  precipProb: number,
  windKmh: number,
  uvMax: number
): WardrobeItem[] => {
  const items: WardrobeItem[] = [];

  // Temperature based
  if (tempC < 5) {
    items.push({ name: "Heavy Thermal Coat", category: "Clothing", icon: "Shirt", important: true });
    items.push({ name: "Warm Wool Scarf & Gloves", category: "Accessory", icon: "Sparkles", important: true });
  } else if (tempC < 15) {
    items.push({ name: "Fleece Hoodie or Jacket", category: "Clothing", icon: "Shirt", important: false });
    items.push({ name: "Long Denim / Chinos", category: "Clothing", icon: "Shirt", important: false });
  } else if (tempC < 24) {
    items.push({ name: "Breathable Cotton Tee", category: "Clothing", icon: "Shirt", important: false });
    items.push({ name: "Light Cardigan / Layers", category: "Clothing", icon: "Shirt", important: false });
  } else {
    items.push({ name: "Lightweight Linen / Shorts", category: "Clothing", icon: "Shirt", important: true });
  }

  // Rain gear
  if (precipProb >= 35) {
    items.push({ name: "Compact Windproof Umbrella", category: "Gear", icon: "Umbrella", important: true });
    items.push({ name: "Waterproof Rain Jacket", category: "Clothing", icon: "Shield", important: true });
    items.push({ name: "Water-resistant Footwear", category: "Footwear", icon: "Footprints", important: false });
  }

  // Wind gear
  if (windKmh > 25 && precipProb < 35) {
    items.push({ name: "Windbreaker Jacket", category: "Clothing", icon: "Wind", important: true });
  }

  // Sun gear
  if (uvMax >= 4) {
    items.push({ name: "UV Protection Sunglasses", category: "Accessory", icon: "Sun", important: true });
    items.push({ name: "Broad Spectrum Sunscreen (SPF 30+)", category: "Gear", icon: "Sun", important: true });
  }

  return items;
};
