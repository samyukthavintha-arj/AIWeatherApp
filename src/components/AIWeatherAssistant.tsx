import React, { useState, useEffect } from "react";
import {
  Sparkles,
  Bot,
  Send,
  Loader2,
  Shirt,
  Plane,
  Activity,
  MessageSquare,
  RefreshCw,
  Lightbulb,
} from "lucide-react";
import { WeatherData, TempUnit, AIInsights } from "../types/weather";
import { formatTemp } from "../utils/weatherUtils";
import { fetchAIInsights, fetchAIQuestionAnswer } from "../utils/apiClient";

interface AIWeatherAssistantProps {
  weather: WeatherData;
  cityName: string;
  tempUnit: TempUnit;
}

export const AIWeatherAssistant: React.FC<AIWeatherAssistantProps> = ({
  weather,
  cityName,
  tempUnit,
}) => {
  const [insights, setInsights] = useState<AIInsights | null>(null);
  const [loadingInsights, setLoadingInsights] = useState(false);

  // Chat Q&A State
  const [question, setQuestion] = useState("");
  const [chatMessages, setChatMessages] = useState<
    { role: "user" | "ai"; text: string }[]
  >([]);
  const [isAsking, setIsAsking] = useState(false);

  // Auto-fetch AI weather summary when city changes
  useEffect(() => {
    let isMounted = true;
    const loadInsights = async () => {
      setLoadingInsights(true);
      try {
        const weatherSummary = {
          city: cityName,
          currentTemp: `${formatTemp(weather.current.temperature_2m, tempUnit)}`,
          condition: weather.current.weather_code,
          windSpeed: `${weather.current.wind_speed_10m} km/h`,
          humidity: `${weather.current.relative_humidity_2m}%`,
          precipitationProb: `${
            weather.daily.precipitation_probability_max?.[0] || 0
          }%`,
          forecast7DaysMax: weather.daily.temperature_2m_max.slice(0, 7),
          forecast7DaysMin: weather.daily.temperature_2m_min.slice(0, 7),
        };

        const data = await fetchAIInsights({
          city: cityName,
          weatherSummary,
        });

        if (isMounted) setInsights(data);
      } catch (err) {
        console.error("AI Insights fetch error:", err);
      } finally {
        if (isMounted) setLoadingInsights(false);
      }
    };

    loadInsights();

    return () => {
      isMounted = false;
    };
  }, [cityName, weather.current.temperature_2m, tempUnit]);

  // Handle Question Submission
  const handleAskQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim() || isAsking) return;

    const userText = question.trim();
    setQuestion("");
    setChatMessages((prev) => [...prev, { role: "user", text: userText }]);
    setIsAsking(true);

    try {
      const weatherSummary = {
        city: cityName,
        currentTemp: formatTemp(weather.current.temperature_2m, tempUnit),
        humidity: `${weather.current.relative_humidity_2m}%`,
        wind: `${weather.current.wind_speed_10m} km/h`,
        rainChanceToday: `${
          weather.daily.precipitation_probability_max?.[0] || 0
        }%`,
      };

      const aiAnswer = await fetchAIQuestionAnswer(cityName, weatherSummary, userText);
      setChatMessages((prev) => [
        ...prev,
        { role: "ai", text: aiAnswer },
      ]);
    } catch (err) {
      console.error("QA error:", err);
      setChatMessages((prev) => [
        ...prev,
        { role: "ai", text: "Unable to process AI question." },
      ]);
    } finally {
      setIsAsking(false);
    }
  };

  const sampleQuestions = [
    `Will I need an umbrella in ${cityName} today?`,
    `Is it a good day to hang laundry outside?`,
    `What should I wear for an evening walk in ${cityName}?`,
  ];

  return (
    <div className="bg-gradient-to-br from-indigo-950/80 via-slate-900 to-slate-950 border border-indigo-500/30 rounded-3xl p-6 shadow-2xl relative overflow-hidden">
      {/* Subtle Glow */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex items-center justify-between mb-5 pb-4 border-b border-indigo-500/20">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-gradient-to-tr from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-500/30">
            <Sparkles className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              Gemini AI Weather Intelligence & Planning
            </h3>
            <p className="text-xs text-indigo-300/80">
              Personalized briefing & lifestyle advice for {cityName}
            </p>
          </div>
        </div>

        {loadingInsights && (
          <div className="flex items-center gap-1.5 text-xs text-indigo-300 font-mono">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Analyzing meteorology...</span>
          </div>
        )}
      </div>

      {/* Briefing Cards */}
      {insights && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {/* Summary */}
          <div className="bg-indigo-950/50 border border-indigo-500/30 rounded-2xl p-4 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 text-indigo-300 font-bold text-xs uppercase tracking-wider mb-2">
                <Bot className="w-4 h-4 text-purple-400" />
                <span>Smart Briefing</span>
              </div>
              <p className="text-xs text-slate-200 leading-relaxed">{insights.summary}</p>
            </div>
          </div>

          {/* Clothing Advice */}
          <div className="bg-indigo-950/50 border border-indigo-500/30 rounded-2xl p-4 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 text-indigo-300 font-bold text-xs uppercase tracking-wider mb-2">
                <Shirt className="w-4 h-4 text-amber-400" />
                <span>AI Outfit Advice</span>
              </div>
              <ul className="space-y-1.5 text-xs text-slate-200">
                {insights.clothingAdvice?.map((tip, idx) => (
                  <li key={idx} className="flex items-start gap-1.5">
                    <span className="text-amber-400 font-bold">•</span>
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Activity & Travel */}
          <div className="bg-indigo-950/50 border border-indigo-500/30 rounded-2xl p-4 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 text-indigo-300 font-bold text-xs uppercase tracking-wider mb-2">
                <Plane className="w-4 h-4 text-sky-400" />
                <span>Travel & Activity Note</span>
              </div>
              <p className="text-xs text-slate-200 leading-relaxed mb-2">
                {insights.activityHighlight}
              </p>
              <div className="text-[11px] text-sky-300 font-mono bg-sky-500/10 p-2 rounded-xl border border-sky-500/20">
                💡 {insights.travelTip}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Interactive AI Chat Box */}
      <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
            <MessageSquare className="w-4 h-4 text-sky-400" />
            Ask Gemini AI Weather Questions
          </span>
          <span className="text-[10px] text-slate-400 font-mono">
            e.g., outfit tips, picnic readiness, outdoor drying
          </span>
        </div>

        {/* Chat History */}
        {chatMessages.length > 0 && (
          <div className="space-y-2 mb-3 max-h-48 overflow-y-auto pr-1">
            {chatMessages.map((msg, idx) => (
              <div
                key={idx}
                className={`p-3 rounded-xl text-xs leading-relaxed ${
                  msg.role === "user"
                    ? "bg-sky-500/20 text-sky-200 border border-sky-500/30 ml-8 text-right"
                    : "bg-indigo-950/80 text-slate-200 border border-indigo-500/30 mr-8"
                }`}
              >
                <div className="font-bold text-[10px] uppercase tracking-wider text-slate-400 mb-0.5">
                  {msg.role === "user" ? "You" : "Gemini AI meteorologist"}
                </div>
                <div>{msg.text}</div>
              </div>
            ))}
          </div>
        )}

        {/* Quick Sample Questions Pills */}
        {chatMessages.length === 0 && (
          <div className="flex flex-wrap gap-2 mb-3">
            {sampleQuestions.map((sq, idx) => (
              <button
                key={idx}
                onClick={() => setQuestion(sq)}
                className="text-[11px] bg-indigo-500/10 border border-indigo-500/20 hover:border-sky-400 text-indigo-300 hover:text-sky-300 px-3 py-1.5 rounded-xl transition-all text-left"
              >
                "{sq}"
              </button>
            ))}
          </div>
        )}

        {/* Question Form */}
        <form onSubmit={handleAskQuestion} className="flex gap-2">
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder={`Ask AI anything about the weather in ${cityName}...`}
            className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-4 py-2 text-xs text-slate-100 placeholder-slate-400 focus:outline-none focus:border-sky-500"
          />
          <button
            type="submit"
            disabled={!question.trim() || isAsking}
            className="px-4 py-2 bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 disabled:opacity-50 shadow-md"
          >
            {isAsking ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>
                <span>Ask</span>
                <Send className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};
