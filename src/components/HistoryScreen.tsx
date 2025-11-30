import { useState } from 'react';
import { WaterEntry, Settings } from '../App';
import { Droplet, Calendar, TrendingUp, Award } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

type HistoryScreenProps = {
  waterEntries: WaterEntry[];
  settings: Settings;
  onNavigate: (screen: 'home' | 'register' | 'history' | 'settings') => void;
};

export function HistoryScreen({ waterEntries, settings, onNavigate }: HistoryScreenProps) {
  const [viewMode, setViewMode] = useState<'daily' | 'weekly' | 'monthly'>('daily');

  const getDailyData = () => {
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (6 - i));
      date.setHours(0, 0, 0, 0);
      return date;
    });

    return last7Days.map((date) => {
      const dayEntries = waterEntries.filter((entry) => {
        const entryDate = new Date(entry.timestamp);
        entryDate.setHours(0, 0, 0, 0);
        return entryDate.getTime() === date.getTime();
      });

      const total = dayEntries.reduce((sum, entry) => sum + entry.amount, 0);

      return {
        date: date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }),
        consumo: total,
        meta: settings.dailyGoal,
      };
    });
  };

  const getWeeklyData = () => {
    const last4Weeks = Array.from({ length: 4 }, (_, i) => {
      const endDate = new Date();
      endDate.setDate(endDate.getDate() - i * 7);
      const startDate = new Date(endDate);
      startDate.setDate(startDate.getDate() - 6);
      return { startDate, endDate, weekNum: 4 - i };
    }).reverse();

    return last4Weeks.map(({ startDate, endDate, weekNum }) => {
      const weekEntries = waterEntries.filter((entry) => {
        const entryDate = new Date(entry.timestamp);
        return entryDate >= startDate && entryDate <= endDate;
      });

      const total = weekEntries.reduce((sum, entry) => sum + entry.amount, 0);

      return {
        date: `Sem ${weekNum}`,
        consumo: total,
        meta: settings.weeklyGoal,
      };
    });
  };

  const getMonthlyData = () => {
    const last6Months = Array.from({ length: 6 }, (_, i) => {
      const date = new Date();
      date.setMonth(date.getMonth() - (5 - i));
      return date;
    });

    return last6Months.map((date) => {
      const monthEntries = waterEntries.filter((entry) => {
        const entryDate = new Date(entry.timestamp);
        return (
          entryDate.getMonth() === date.getMonth() &&
          entryDate.getFullYear() === date.getFullYear()
        );
      });

      const total = monthEntries.reduce((sum, entry) => sum + entry.amount, 0);
      const daysInMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
      const monthlyGoal = settings.dailyGoal * daysInMonth;

      return {
        date: date.toLocaleDateString('pt-BR', { month: 'short' }),
        consumo: total,
        meta: monthlyGoal,
      };
    });
  };

  const getChartData = () => {
    switch (viewMode) {
      case 'daily':
        return getDailyData();
      case 'weekly':
        return getWeeklyData();
      case 'monthly':
        return getMonthlyData();
      default:
        return getDailyData();
    }
  };

  const getStats = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const last30Days = waterEntries.filter((entry) => {
      const entryDate = new Date(entry.timestamp);
      const daysDiff = Math.floor((today.getTime() - entryDate.getTime()) / (1000 * 60 * 60 * 24));
      return daysDiff < 30;
    });

    const totalLast30Days = last30Days.reduce((sum, entry) => sum + entry.amount, 0);
    const avgPerDay = last30Days.length > 0 ? totalLast30Days / 30 : 0;

    const daysWithGoal = Array.from({ length: 30 }, (_, i) => {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      date.setHours(0, 0, 0, 0);

      const dayEntries = waterEntries.filter((entry) => {
        const entryDate = new Date(entry.timestamp);
        entryDate.setHours(0, 0, 0, 0);
        return entryDate.getTime() === date.getTime();
      });

      const dayTotal = dayEntries.reduce((sum, entry) => sum + entry.amount, 0);
      return dayTotal >= settings.dailyGoal;
    });

    const daysMetGoal = daysWithGoal.filter(Boolean).length;

    return {
      totalLast30Days,
      avgPerDay: Math.round(avgPerDay),
      daysMetGoal,
      successRate: Math.round((daysMetGoal / 30) * 100),
    };
  };

  const stats = getStats();
  const chartData = getChartData();

  const getRecentEntries = () => {
    return [...waterEntries]
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(0, 10);
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
          <Calendar className="w-10 h-10 text-cyan-600" />
          <h1 className="text-cyan-700">Histórico</h1>
        </div>
        <p className="text-gray-600">Acompanhe sua evolução</p>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-gradient-to-br from-cyan-500 to-blue-500 rounded-2xl p-4 text-white shadow-lg">
          <div className="flex items-center gap-2 mb-2">
            <Droplet className="w-5 h-5" fill="currentColor" />
            <p className="text-sm opacity-90">Média/Dia (30d)</p>
          </div>
          <p className="text-2xl">{stats.avgPerDay}ml</p>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl p-4 text-white shadow-lg">
          <div className="flex items-center gap-2 mb-2">
            <Award className="w-5 h-5" />
            <p className="text-sm opacity-90">Taxa de Sucesso</p>
          </div>
          <p className="text-2xl">{stats.successRate}%</p>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl p-4 text-white shadow-lg">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-5 h-5" />
            <p className="text-sm opacity-90">Total (30d)</p>
          </div>
          <p className="text-2xl">{(stats.totalLast30Days / 1000).toFixed(1)}L</p>
        </div>

        <div className="bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl p-4 text-white shadow-lg">
          <div className="flex items-center gap-2 mb-2">
            <Calendar className="w-5 h-5" />
            <p className="text-sm opacity-90">Dias c/ Meta</p>
          </div>
          <p className="text-2xl">{stats.daysMetGoal}/30</p>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-lg p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-gray-700">Gráfico de Consumo</h2>
          <div className="flex gap-2">
            <button
              onClick={() => setViewMode('daily')}
              className={`px-3 py-1 rounded-lg text-sm transition-colors ${
                viewMode === 'daily'
                  ? 'bg-cyan-500 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Diário
            </button>
            <button
              onClick={() => setViewMode('weekly')}
              className={`px-3 py-1 rounded-lg text-sm transition-colors ${
                viewMode === 'weekly'
                  ? 'bg-cyan-500 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Semanal
            </button>
            <button
              onClick={() => setViewMode('monthly')}
              className={`px-3 py-1 rounded-lg text-sm transition-colors ${
                viewMode === 'monthly'
                  ? 'bg-cyan-500 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Mensal
            </button>
          </div>
        </div>

        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e0f2fe" />
            <XAxis dataKey="date" tick={{ fontSize: 12 }} stroke="#64748b" />
            <YAxis tick={{ fontSize: 12 }} stroke="#64748b" />
            <Tooltip
              contentStyle={{
                backgroundColor: '#fff',
                border: '1px solid #06b6d4',
                borderRadius: '12px',
              }}
            />
            <Legend />
            <Bar dataKey="consumo" fill="#06b6d4" radius={[8, 8, 0, 0]} name="Consumo (ml)" />
            <Bar dataKey="meta" fill="#e0f2fe" radius={[8, 8, 0, 0]} name="Meta (ml)" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-white rounded-3xl shadow-lg p-6">
        <h2 className="text-gray-700 mb-4">Registros Recentes</h2>
        
        <div className="space-y-3">
          {getRecentEntries().length > 0 ? (
            getRecentEntries().map((entry) => (
              <div
                key={entry.id}
                className="flex items-center justify-between p-4 bg-gradient-to-r from-cyan-50 to-blue-50 rounded-xl"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-full flex items-center justify-center">
                    <Droplet className="w-5 h-5 text-white" fill="currentColor" />
                  </div>
                  <div>
                    <p className="text-cyan-700">{entry.amount}ml</p>
                    <p className="text-xs text-gray-500">
                      {new Date(entry.timestamp).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                </div>
                <p className="text-sm text-gray-600">
                  {new Date(entry.timestamp).toLocaleTimeString('pt-BR', {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-gray-400">
              <Droplet className="w-12 h-12 mx-auto mb-2" />
              <p>Nenhum registro ainda</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
