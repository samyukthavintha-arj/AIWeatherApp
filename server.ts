import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini AI (server-side only)
const getAiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return null;
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
};

// 1. Geocoding API Proxy
app.get("/api/geocoding", async (req, res) => {
  try {
    const { q } = req.query;
    if (!q || typeof q !== "string" || q.trim().length < 2) {
      return res.json({ results: [] });
    }
    const response = await fetch(
      `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
        q.trim()
      )}&count=8&language=en&format=json`
    );
    if (!response.ok) {
      throw new Error(`Open-Meteo Geocoding failed: ${response.statusText}`);
    }
    const data = await response.json();
    return res.json(data);
  } catch (error: any) {
    console.error("Geocoding error:", error);
    return res.status(500).json({ error: error.message || "Failed to search location" });
  }
});

// 2. Weather Forecast API Proxy
app.get("/api/weather", async (req, res) => {
  try {
    const { lat, lon } = req.query;
    if (!lat || !lon) {
      return res.status(400).json({ error: "Latitude and longitude are required" });
    }

    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,rain,showers,snowfall,weather_code,cloud_cover,pressure_msl,surface_pressure,wind_speed_10m,wind_direction_10m,wind_gusts_10m&hourly=temperature_2m,relative_humidity_2m,dew_point_2m,apparent_temperature,precipitation_probability,precipitation,weather_code,pressure_msl,cloud_cover,visibility,wind_speed_10m,uv_index&daily=weather_code,temperature_2m_max,temperature_2m_min,apparent_temperature_max,apparent_temperature_min,sunrise,sunset,uv_index_max,precipitation_sum,rain_sum,showers_sum,snowfall_sum,precipitation_hours,precipitation_probability_max,wind_speed_10m_max,wind_gusts_10m_max,wind_direction_10m_dominant&timezone=auto`;

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Open-Meteo Weather failed: ${response.statusText}`);
    }
    const data = await response.json();
    return res.json(data);
  } catch (error: any) {
    console.error("Weather error:", error);
    return res.status(500).json({ error: error.message || "Failed to fetch weather data" });
  }
});

// 3. Air Quality API Proxy
app.get("/api/air-quality", async (req, res) => {
  try {
    const { lat, lon } = req.query;
    if (!lat || !lon) {
      return res.status(400).json({ error: "Latitude and longitude are required" });
    }

    const url = `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${lat}&longitude=${lon}&current=us_aqi,pm10,pm2_5,carbon_monoxide,nitrogen_dioxide,sulphur_dioxide,ozone&timezone=auto`;

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Air Quality failed: ${response.statusText}`);
    }
    const data = await response.json();
    return res.json(data);
  } catch (error: any) {
    console.error("Air Quality error:", error);
    return res.status(500).json({ error: error.message || "Failed to fetch air quality data" });
  }
});

// 4. AI Weather Intelligence & Assistant (Gemini API)
app.post("/api/ai-insights", async (req, res) => {
  try {
    const ai = getAiClient();
    if (!ai) {
      return res.json({
        summary: "AI Insights unavailable (Gemini API key not configured). Enjoy the live Open-Meteo weather intelligence metrics!",
        activities: [],
        travelTip: "Check local weather forecasts before traveling.",
      });
    }

    const { city, weatherSummary, type, userQuestion } = req.body;

    if (type === "qa") {
      const prompt = `You are an expert meteorologist and lifestyle weather assistant for the city of ${city}.
Given the following weather conditions:
${JSON.stringify(weatherSummary)}

Answer the user's specific question in a friendly, practical, and informative way (2-4 sentences max):
Question: "${userQuestion}"`;

      const response = await ai.models.generateContent({
        model: "gemini-3.6-flash",
        contents: prompt,
      });

      return res.json({ answer: response.text || "I couldn't process that weather question right now." });
    } else {
      const prompt = `You are a Weather Intelligence Expert for ${city}.
Analyze the following current weather and 7-day forecast data:
${JSON.stringify(weatherSummary)}

Generate a JSON object with:
1. "summary": A concise 2-3 sentence smart weather briefing emphasizing overall feel, notable changes, and key highlights.
2. "clothingAdvice": A short list of 3 specific clothing/gear tips (e.g., "Bring a windbreaker", "UV protection needed", "Light cotton shirt").
3. "activityHighlight": 1-2 sentences on the best outdoor/indoor activity window today.
4. "travelTip": A brief safety or travel recommendation for this week's weather pattern.

Return ONLY raw JSON in this format:
{
  "summary": "...",
  "clothingAdvice": ["...", "...", "..."],
  "activityHighlight": "...",
  "travelTip": "..."
}`;

      const response = await ai.models.generateContent({
        model: "gemini-3.6-flash",
        contents: prompt,
      });

      let text = response.text || "{}";
      text = text.replace(/```json/g, "").replace(/```/g, "").trim();
      
      try {
        const parsed = JSON.parse(text);
        return res.json(parsed);
      } catch (parseErr) {
        return res.json({
          summary: response.text || "Weather conditions look moderate for outdoor activities today.",
          clothingAdvice: ["Dress comfortably in layers", "Check local wind conditions", "Stay hydrated"],
          activityHighlight: "Mid-day hours look pleasant for a stroll.",
          travelTip: "Keep an eye on precipitation chances if driving.",
        });
      }
    }
  } catch (error: any) {
    console.error("AI Insights error:", error);
    return res.status(500).json({ error: "Failed to generate AI insights" });
  }
});

// Vite Middleware for development / static serving for production
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Weather Intelligence App running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
