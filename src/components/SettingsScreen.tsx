import { useState, useEffect } from 'react';
import { Settings } from '../App';
import { Settings2, Target, Bell, Save, Droplet } from 'lucide-react';

type SettingsScreenProps = {
  settings: Settings;
  onUpdateSettings: (settings: Settings) => void;
  onNavigate: (screen: 'home' | 'register' | 'history' | 'settings') => void;
};

export function SettingsScreen({ settings, onUpdateSettings, onNavigate }: SettingsScreenProps) {
  const [dailyGoal, setDailyGoal] = useState(settings.dailyGoal);
  const [weeklyGoal, setWeeklyGoal] = useState(settings.weeklyGoal);
  const [reminderInterval, setReminderInterval] = useState(settings.reminderInterval);
  const [showSaved, setShowSaved] = useState(false);
  const [notificationPermission, setNotificationPermission] = useState<NotificationPermission>('default');

  useEffect(() => {
    if ('Notification' in window) {
      setNotificationPermission(Notification.permission);
    }
  }, []);

  useEffect(() => {
    const handleUpdateGoal = (event: Event) => {
      const customEvent = event as CustomEvent;
      setDailyGoal(customEvent.detail);
      handleSave(customEvent.detail, weeklyGoal, reminderInterval);
    };

    window.addEventListener('updateGoal', handleUpdateGoal);
    return () => window.removeEventListener('updateGoal', handleUpdateGoal);
  }, [weeklyGoal, reminderInterval]);

  const handleSave = (daily?: number, weekly?: number, reminder?: number) => {
    const newSettings: Settings = {
      dailyGoal: daily ?? dailyGoal,
      weeklyGoal: weekly ?? weeklyGoal,
      reminderInterval: reminder ?? reminderInterval,
    };
    onUpdateSettings(newSettings);
    setShowSaved(true);
    setTimeout(() => setShowSaved(false), 2000);
  };

  const requestNotificationPermission = async () => {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      setNotificationPermission(permission);
    }
  };

  const getReminderText = (minutes: number) => {
    if (minutes < 60) {
      return `${minutes} minutos`;
    }
    const hours = minutes / 60;
    return `${hours} ${hours === 1 ? 'hora' : 'horas'}`;
  };

  return (
    <div className="max-w-md mx-auto pb-24 px-4">
      <div className="pt-8 pb-6">
        <button
          onClick={() => onNavigate('home')}
          className="flex items-center gap-2 text-cyan-600 mb-4"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          <span>Voltar</span>
        </button>

        <div className="flex items-center gap-3 mb-2">
          <Settings2 className="w-10 h-10 text-cyan-600" />
          <h1 className="text-cyan-700">Configurações</h1>
        </div>
        <p className="text-gray-600">Personalize seu aplicativo</p>
      </div>

      {showSaved && (
        <div className="mb-6 bg-green-50 border border-green-200 rounded-2xl p-4 flex items-center gap-3 animate-fade-in">
          <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
            <Save className="w-6 h-6 text-white" />
          </div>
          <div>
            <p className="text-green-800">Configurações salvas!</p>
            <p className="text-sm text-green-600">Suas preferências foram atualizadas</p>
          </div>
        </div>
      )}

      <div className="bg-white rounded-3xl shadow-lg p-6 mb-6">
        <div className="flex items-center gap-3 mb-6">
          <Target className="w-6 h-6 text-cyan-600" />
          <h2 className="text-gray-700">Metas de Consumo</h2>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-sm text-gray-600 mb-2">Meta Diária (ml)</label>
            <div className="flex items-center gap-3">
              <input
                type="range"
                min="500"
                max="5000"
                step="100"
                value={dailyGoal}
                onChange={(e) => setDailyGoal(parseInt(e.target.value))}
                className="flex-1 h-2 bg-gradient-to-r from-cyan-200 to-blue-200 rounded-lg appearance-none cursor-pointer slider"
              />
              <div className="w-24 px-3 py-2 bg-gradient-to-r from-cyan-50 to-blue-50 rounded-xl text-center">
                <span className="text-cyan-700">{dailyGoal}ml</span>
              </div>
            </div>
            <div className="flex justify-between text-xs text-gray-500 mt-2">
              <span>500ml</span>
              <span>5000ml</span>
            </div>
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-2">Meta Semanal (ml)</label>
            <div className="flex items-center gap-3">
              <input
                type="range"
                min="3500"
                max="35000"
                step="500"
                value={weeklyGoal}
                onChange={(e) => setWeeklyGoal(parseInt(e.target.value))}
                className="flex-1 h-2 bg-gradient-to-r from-cyan-200 to-blue-200 rounded-lg appearance-none cursor-pointer slider"
              />
              <div className="w-24 px-3 py-2 bg-gradient-to-r from-cyan-50 to-blue-50 rounded-xl text-center">
                <span className="text-cyan-700">{(weeklyGoal / 1000).toFixed(1)}L</span>
              </div>
            </div>
            <div className="flex justify-between text-xs text-gray-500 mt-2">
              <span>3.5L</span>
              <span>35L</span>
            </div>
          </div>

          <div className="p-4 bg-gradient-to-r from-cyan-50 to-blue-50 rounded-xl">
            <p className="text-sm text-gray-600">
              💡 <strong>Recomendação:</strong> A maioria dos adultos deve consumir entre 2L e 3L de água por dia.
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-lg p-6 mb-6">
        <div className="flex items-center gap-3 mb-6">
          <Bell className="w-6 h-6 text-cyan-600" />
          <h2 className="text-gray-700">Lembretes</h2>
        </div>

        {notificationPermission === 'default' && (
          <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
            <p className="text-sm text-yellow-800 mb-3">
              Para receber lembretes, é necessário permitir notificações.
            </p>
            <button
              onClick={requestNotificationPermission}
              className="w-full py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors"
            >
              Permitir Notificações
            </button>
          </div>
        )}

        {notificationPermission === 'denied' && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-xl">
            <p className="text-sm text-red-800">
              As notificações foram bloqueadas. Você pode habilitar nas configurações do navegador.
            </p>
          </div>
        )}

        {notificationPermission === 'granted' && (
          <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-xl">
            <p className="text-sm text-green-800">
              ✓ Notificações ativadas! Você receberá lembretes para beber água.
            </p>
          </div>
        )}

        <div>
          <label className="block text-sm text-gray-600 mb-3">
            Frequência dos Lembretes: <strong className="text-cyan-600">{getReminderText(reminderInterval)}</strong>
          </label>
          
          <div className="space-y-2">
            {[30, 60, 90, 120, 180, 240].map((minutes) => (
              <button
                key={minutes}
                onClick={() => setReminderInterval(minutes)}
                className={`w-full p-4 rounded-xl transition-all ${
                  reminderInterval === minutes
                    ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg'
                    : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span>{getReminderText(minutes)}</span>
                  {reminderInterval === minutes && (
                    <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center">
                      <div className="w-3 h-3 bg-cyan-600 rounded-full"></div>
                    </div>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      <button
        onClick={() => handleSave()}
        className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 text-white py-4 rounded-2xl shadow-lg flex items-center justify-center gap-3 hover:shadow-xl transition-shadow"
      >
        <Save className="w-6 h-6" />
        <span>Salvar Configurações</span>
      </button>

      <div className="mt-6 bg-white rounded-2xl shadow-lg p-6">
        <div className="flex items-center gap-3 mb-4">
          <Droplet className="w-6 h-6 text-cyan-600" fill="currentColor" />
          <h2 className="text-gray-700">Sobre o Maya</h2>
        </div>
        <p className="text-sm text-gray-600 mb-3">
          O Maya é seu companheiro de hidratação, ajudando você a manter hábitos saudáveis de consumo de água.
        </p>
        <div className="flex items-center justify-between text-sm text-gray-500">
          <span>Versão 1.0.0</span>
          <span>❤️ Feito com carinho</span>
        </div>
      </div>
    </div>
  );
}
