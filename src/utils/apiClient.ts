import { WeatherData, AirQualityData, GeocodingResult, AIInsights } from "../types/weather";

/**
 * Safely parses response as JSON, verifying content type and preventing
 * "Unexpected token '<', '<!doctype' ... is not valid JSON" errors
 * when static hosting like Cloudflare Pages returns index.html for unknown /api routes.
 */
async function safeJsonFetch(res: Response): Promise<any> {
  const contentType = res.headers.get("content-type") || "";
  const text = await res.text();

  if (!res.ok) {
    throw new Error(`Server returned HTTP ${res.status}`);
  }

  if (contentType.includes("text/html") || text.trim().startsWith("<!") || text.trim().startsWith("<html")) {
    throw new Error("HTML_RESPONSE_RECEIVED");
  }

  try {
    return JSON.parse(text);
  } catch (err) {
    throw new Error("INVALID_JSON_RESPONSE");
  }
}

/**
 * Search Geocoding Locations
 * Tries Express /api/geocoding first, falls back to Open-Meteo direct API on client
 */
export async function fetchGeocoding(query: string): Promise<GeocodingResult[]> {
  try {
    const res = await fetch(`/api/geocoding?q=${encodeURIComponent(query)}`);
    const data = await safeJsonFetch(res);
    return data.results || [];
  } catch (err) {
    // Direct client fallback to Open-Meteo
    const fallbackRes = await fetch(
      `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=8&language=en&format=json`
    );
    if (!fallbackRes.ok) return [];
    const data = await fallbackRes.json();
    return data.results || [];
  }
}

/**
 * Fetch Weather Data
 * Tries Express /api/weather first, falls back to Open-Meteo direct API on client
 */
export async function fetchWeather(lat: number, lon: number): Promise<WeatherData> {
  const directUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,rain,showers,snowfall,weather_code,cloud_cover,pressure_msl,surface_pressure,wind_speed_10m,wind_direction_10m,wind_gusts_10m&hourly=temperature_2m,relative_humidity_2m,dew_point_2m,apparent_temperature,precipitation_probability,precipitation,weather_code,pressure_msl,cloud_cover,visibility,wind_speed_10m,uv_index&daily=weather_code,temperature_2m_max,temperature_2m_min,apparent_temperature_max,apparent_temperature_min,sunrise,sunset,uv_index_max,precipitation_sum,rain_sum,showers_sum,snowfall_sum,precipitation_hours,precipitation_probability_max,wind_speed_10m_max,wind_gusts_10m_max,wind_direction_10m_dominant&timezone=auto`;

  try {
    const res = await fetch(`/api/weather?lat=${lat}&lon=${lon}`);
    return await safeJsonFetch(res);
  } catch (err) {
    // Direct client fallback to Open-Meteo
    const fallbackRes = await fetch(directUrl);
    if (!fallbackRes.ok) {
      throw new Error("Unable to fetch weather forecast from Open-Meteo");
    }
    return await fallbackRes.json();
  }
}

/**
 * Fetch Air Quality Data
 * Tries Express /api/air-quality first, falls back to Open-Meteo direct API on client
 */
export async function fetchAirQuality(lat: number, lon: number): Promise<AirQualityData | null> {
  const directUrl = `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${lat}&longitude=${lon}&current=us_aqi,pm10,pm2_5,carbon_monoxide,nitrogen_dioxide,sulphur_dioxide,ozone&timezone=auto`;

  try {
    const res = await fetch(`/api/air-quality?lat=${lat}&lon=${lon}`);
    return await safeJsonFetch(res);
  } catch (err) {
    try {
      const fallbackRes = await fetch(directUrl);
      if (!fallbackRes.ok) return null;
      return await fallbackRes.json();
    } catch {
      return null;
    }
  }
}

/**
 * Fetch AI Insights
 * Handles server proxy or graceful fallback if hosted on static hosting without Gemini backend
 */
export async function fetchAIInsights(bodyData: any): Promise<AIInsights> {
  try {
    const res = await fetch("/api/ai-insights", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(bodyData),
    });
    return await safeJsonFetch(res);
  } catch (err) {
    return {
      summary: "Current weather data is actively loaded from live satellite feeds. (Gemini AI server features require node backend / serverless environment).",
      clothingAdvice: [
        "Dress in comfortable layers for current temperatures",
        "Check local UV and wind index before heading out",
        "Carry weather appropriate accessories"
      ],
      activityHighlight: "Check the Outdoor Activity Index tab for real-time suitability scores.",
      travelTip: "Monitor real-time weather forecasts before traveling."
    };
  }
}

/**
 * Ask AI Assistant Question
 */
export async function fetchAIQuestionAnswer(cityName: string, weatherSummary: any, questionText: string): Promise<string> {
  try {
    const res = await fetch("/api/ai-insights", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        city: cityName,
        weatherSummary,
        type: "qa",
        userQuestion: questionText,
      }),
    });
    const data = await safeJsonFetch(res);
    return data.answer || "I processed your weather query based on current atmospheric telemetry.";
  } catch (err) {
    return "AI Assistant functions require a running backend server or Gemini API setup. Outdoor metrics above are actively updating from live Open-Meteo streams!";
  }
}
