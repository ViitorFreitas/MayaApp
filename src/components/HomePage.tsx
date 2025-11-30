import { useState } from 'react';
import { WaterEntry, Settings } from '../App';
import { Droplet, Edit2, TrendingUp } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

type HomePageProps = {
  waterEntries: WaterEntry[];
  settings: Settings;
  onNavigate: (screen: 'home' | 'register' | 'history' | 'settings') => void;
};

export function HomePage({ waterEntries, settings, onNavigate }: HomePageProps) {
  const [isEditingGoal, setIsEditingGoal] = useState(false);
  const [tempGoal, setTempGoal] = useState(settings.dailyGoal);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const todayEntries = waterEntries.filter((entry) => {
    const entryDate = new Date(entry.timestamp);
    entryDate.setHours(0, 0, 0, 0);
    return entryDate.getTime() === today.getTime();
  });

  const todayTotal = todayEntries.reduce((sum, entry) => sum + entry.amount, 0);
  const progressPercentage = Math.min((todayTotal / settings.dailyGoal) * 100, 100);
  const remaining = Math.max(settings.dailyGoal - todayTotal, 0);

  const getHourlyData = () => {
    const hourlyData = Array.from({ length: 24 }, (_, i) => ({
      hour: `${i}h`,
      amount: 0,
    }));

    todayEntries.forEach((entry) => {
      const hour = new Date(entry.timestamp).getHours();
      hourlyData[hour].amount += entry.amount;
    });

    const currentHour = new Date().getHours();
    return hourlyData.slice(0, currentHour + 1);
  };

  const handleSaveGoal = () => {
    const event = new CustomEvent('updateGoal', { detail: tempGoal });
    window.dispatchEvent(event);
    setIsEditingGoal(false);
  };

  return (
    <div className="max-w-md mx-auto pb-24 px-4">
      <div className="pt-8 pb-6">
        <div className="flex items-center justify-center gap-3 mb-2">
          <Droplet className="w-10 h-10 text-cyan-600" fill="currentColor" />
          <h1 className="text-cyan-600">Maya</h1>
        </div>
        <p className="text-center text-gray-600">Seu companheiro de hidratação</p>
      </div>

      <div className="bg-white rounded-3xl shadow-lg p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-gray-700">Consumo de Hoje</h2>
          <div className="flex items-center gap-2 text-cyan-600">
            <Droplet className="w-5 h-5" fill="currentColor" />
            <span>{todayTotal}ml</span>
          </div>
        </div>

        <div className="relative mb-6">
          <div className="w-full h-6 bg-gradient-to-r from-cyan-100 to-blue-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full transition-all duration-500 ease-out shadow-lg"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
          <div className="flex justify-between mt-2">
            <span className="text-sm text-gray-600">0ml</span>
            <span className="text-sm text-cyan-600">{Math.round(progressPercentage)}%</span>
            <span className="text-sm text-gray-600">{settings.dailyGoal}ml</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gradient-to-br from-cyan-50 to-blue-50 rounded-2xl p-4">
            <p className="text-sm text-gray-600 mb-1">Meta Diária</p>
            {isEditingGoal ? (
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={tempGoal}
                  onChange={(e) => setTempGoal(parseInt(e.target.value) || 0)}
                  className="w-20 px-2 py-1 border border-cyan-300 rounded-lg text-cyan-700"
                  autoFocus
                />
                <button
                  onClick={handleSaveGoal}
                  className="text-xs bg-cyan-600 text-white px-2 py-1 rounded-lg"
                >
                  OK
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <span className="text-cyan-700">{settings.dailyGoal}ml</span>
                <button onClick={() => setIsEditingGoal(true)} className="text-cyan-600">
                  <Edit2 className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

          <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-2xl p-4">
            <p className="text-sm text-gray-600 mb-1">Falta</p>
            <span className="text-orange-700">{remaining}ml</span>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-lg p-6 mb-6">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="w-5 h-5 text-cyan-600" />
          <h2 className="text-gray-700">Evolução de Hoje</h2>
        </div>

        {todayEntries.length > 0 ? (
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={getHourlyData()}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e0f2fe" />
              <XAxis dataKey="hour" tick={{ fontSize: 12 }} stroke="#64748b" />
              <YAxis tick={{ fontSize: 12 }} stroke="#64748b" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#fff',
                  border: '1px solid #06b6d4',
                  borderRadius: '12px',
                }}
              />
              <Bar dataKey="amount" fill="url(#colorGradient)" radius={[8, 8, 0, 0]} />
              <defs>
                <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#06b6d4" />
                  <stop offset="100%" stopColor="#0891b2" />
                </linearGradient>
              </defs>
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-48 flex flex-col items-center justify-center text-gray-400">
            <Droplet className="w-12 h-12 mb-2" />
            <p>Nenhum registro hoje ainda</p>
          </div>
        )}
      </div>

      <button
        onClick={() => onNavigate('register')}
        className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 text-white py-4 rounded-2xl shadow-lg flex items-center justify-center gap-3 hover:shadow-xl transition-shadow"
      >
        <Droplet className="w-6 h-6" fill="currentColor" />
        <span>Registrar Consumo de Água</span>
      </button>
    </div>
  );
}
