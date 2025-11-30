import { useState, useEffect } from "react";
import { HomePage } from "./components/HomePage";
import { RegisterScreen } from "./components/RegisterScreen";
import { HistoryScreen } from "./components/HistoryScreen";
import { SettingsScreen } from "./components/SettingsScreen";

export type WaterEntry = {
  id: string;
  amount: number;
  timestamp: number;
};

export type Settings = {
  dailyGoal: number;
  weeklyGoal: number;
  reminderInterval: number;
};

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<
    "home" | "register" | "history" | "settings"
  >("home");
  const [waterEntries, setWaterEntries] = useState<
    WaterEntry[]
  >([]);
  const [settings, setSettings] = useState<Settings>({
    dailyGoal: 2000,
    weeklyGoal: 14000,
    reminderInterval: 120,
  });
  const [lastNotification, setLastNotification] =
    useState<number>(Date.now());

  useEffect(() => {
    const savedEntries = localStorage.getItem(
      "maya-water-entries",
    );
    const savedSettings = localStorage.getItem("maya-settings");
    const savedLastNotification = localStorage.getItem(
      "maya-last-notification",
    );

    if (savedEntries) {
      setWaterEntries(JSON.parse(savedEntries));
    }
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }
    if (savedLastNotification) {
      setLastNotification(parseInt(savedLastNotification));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(
      "maya-water-entries",
      JSON.stringify(waterEntries),
    );
  }, [waterEntries]);

  useEffect(() => {
    localStorage.setItem(
      "maya-settings",
      JSON.stringify(settings),
    );
  }, [settings]);

  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      const minutesSinceLastNotification =
        (now - lastNotification) / (1000 * 60);

      if (
        minutesSinceLastNotification >=
        settings.reminderInterval
      ) {
        showNotification();
        setLastNotification(now);
        localStorage.setItem(
          "maya-last-notification",
          now.toString(),
        );
      }
    }, 60000);

    return () => clearInterval(interval);
  }, [lastNotification, settings.reminderInterval]);

  const showNotification = () => {
    if ("Notification" in window) {
      if (Notification.permission === "granted") {
        new Notification("💧 Maya - Hora de beber água!", {
          body: "Lembre-se de se hidratar e registrar seu consumo.",
          icon: "💧",
        });
      } else if (Notification.permission !== "denied") {
        Notification.requestPermission().then((permission) => {
          if (permission === "granted") {
            new Notification("💧 Maya - Hora de beber água!", {
              body: "Lembre-se de se hidratar e registrar seu consumo.",
              icon: "💧",
            });
          }
        });
      }
    }
  };

  const addWaterEntry = (amount: number) => {
    const newEntry: WaterEntry = {
      id: Date.now().toString(),
      amount,
      timestamp: Date.now(),
    };
    setWaterEntries([...waterEntries, newEntry]);
  };

  const updateSettings = (newSettings: Settings) => {
    setSettings(newSettings);
  };

  const requestNotificationPermission = () => {
    if (
      "Notification" in window &&
      Notification.permission === "default"
    ) {
      Notification.requestPermission();
    }
  };

  useEffect(() => {
    requestNotificationPermission();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 to-blue-50">
      {currentScreen === "home" && (
        <HomePage
          waterEntries={waterEntries}
          settings={settings}
          onNavigate={setCurrentScreen}
        />
      )}
      {currentScreen === "register" && (
        <RegisterScreen
          onAddEntry={addWaterEntry}
          onNavigate={setCurrentScreen}
        />
      )}
      {currentScreen === "history" && (
        <HistoryScreen
          waterEntries={waterEntries}
          settings={settings}
          onNavigate={setCurrentScreen}
        />
      )}
      {currentScreen === "settings" && (
        <SettingsScreen
          settings={settings}
          onUpdateSettings={updateSettings}
          onNavigate={setCurrentScreen}
        />
      )}

      <nav className="fixed bottom-0 left-0 right-0 bg-white shadow-lg border-t border-gray-200">
        <div className="max-w-md mx-auto flex justify-around items-center py-3 px-4">
          <button
            onClick={() => setCurrentScreen("home")}
            className={`flex flex-col items-center gap-1 px-4 py-2 rounded-lg transition-colors ${
              currentScreen === "home"
                ? "text-cyan-600 bg-cyan-50"
                : "text-gray-500"
            }`}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
              />
            </svg>
            <span className="text-xs">Início</span>
          </button>

          <button
            onClick={() => setCurrentScreen("register")}
            className={`flex flex-col items-center gap-1 px-4 py-2 rounded-lg transition-colors ${
              currentScreen === "register"
                ? "text-cyan-600 bg-cyan-50"
                : "text-gray-500"
            }`}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
            <span className="text-xs">Registrar</span>
          </button>

          <button
            onClick={() => setCurrentScreen("history")}
            className={`flex flex-col items-center gap-1 px-4 py-2 rounded-lg transition-colors ${
              currentScreen === "history"
                ? "text-cyan-600 bg-cyan-50"
                : "text-gray-500"
            }`}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
              />
            </svg>
            <span className="text-xs">Histórico</span>
          </button>

          <button
            onClick={() => setCurrentScreen("settings")}
            className={`flex flex-col items-center gap-1 px-4 py-2 rounded-lg transition-colors ${
              currentScreen === "settings"
                ? "text-cyan-600 bg-cyan-50"
                : "text-gray-500"
            }`}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            <span className="text-xs">Configurações</span>
          </button>
        </div>
      </nav>
    </div>
  );
}