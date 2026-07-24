# Weather Intelligence App 🌤️

An intelligent, real-time weather forecasting dashboard and planning assistant powered by **Open-Meteo APIs** and **Google Gemini AI**.

---

## 🌟 Key Features

- **🔍 Smart Location Search & Autocomplete**: Real-time geocoding search for any city worldwide, featuring one-click current geolocation support and saved favorite cities.
- **⚡ Live Weather Telemetry**: Instant view of current temperature, "feels like" index, precipitation levels, cloud cover, wind speed & directional gusts, surface pressure, max UV index, and atmospheric visibility.
- **🕒 24-Hour Hourly Timeline**: Interactive hourly slider with precipitation chances, wind metrics, and dynamic daytime/nighttime status icons.
- **📅 7-Day Extended Forecast**: Detailed week-ahead weather outlook with temperature range bars, rain probability badges, and expandable day-by-day hourly breakdowns.
- **📊 Interactive Analytics & Trend Charts**: Visual charts powered by Recharts covering temperature trends, rain probability, wind speeds, UV index, and relative humidity over a 24-hour window.
- **🏃 Outdoor Activity & Wardrobe Planner**: Calculated suitability index for running, cycling, hiking, beach trips, and stargazing, paired with a smart wardrobe checklist based on temperature, UV, and rain.
- **🛡️ Air Quality & Solar Cycle**: Real-time US AQI metrics with detailed pollutant breakdowns (PM2.5, PM10, O3, NO2, CO, SO2) alongside a visual solar arc tracking sunrise, sunset, and daylight progression.
- **🤖 Gemini AI Weather Intelligence**: Personalized weather briefings, outfit advice, travel warnings, and an interactive QA assistant for custom weather questions.

---

## 🛠️ Tech Stack

- **Frontend**: React 19, TypeScript, Tailwind CSS v4, Lucide React Icons, Recharts
- **Backend Service**: Express.js server proxying Open-Meteo and Gemini API calls
- **AI Engine**: `@google/genai` SDK using Gemini Flash (`gemini-3.6-flash`)
- **Data Provider**: Open-Meteo Geocoding, Forecast & Air Quality REST APIs

---

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or pnpm

### Environment Configuration

Copy `.env.example` to `.env`:

```bash
GEMINI_API_KEY=your_gemini_api_key_here
```

### Installation & Execution

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Start Development Server**:
   ```bash
   npm run dev
   ```
   Open `http://localhost:3000` in your browser.

3. **Production Build**:
   ```bash
   npm run build
   npm start
   ```

---

## 📄 License

Apache-2.0 License
