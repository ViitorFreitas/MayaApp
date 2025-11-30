import { useState } from 'react';
import { Droplet, Check } from 'lucide-react';

type RegisterScreenProps = {
  onAddEntry: (amount: number) => void;
  onNavigate: (screen: 'home' | 'register' | 'history' | 'settings') => void;
};

export function RegisterScreen({ onAddEntry, onNavigate }: RegisterScreenProps) {
  const [customAmount, setCustomAmount] = useState('');
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);

  const predefinedAmounts = [
    { value: 200, label: '200ml', icon: '💧' },
    { value: 300, label: '300ml', icon: '💧💧' },
    { value: 500, label: '500ml', icon: '💧💧💧' },
    { value: 750, label: '750ml', icon: '💧💧💧💧' },
    { value: 1000, label: '1L', icon: '💧💧💧💧💧' },
  ];

  const handleQuickAdd = (amount: number) => {
    setSelectedAmount(amount);
    onAddEntry(amount);
    setShowSuccess(true);
    setTimeout(() => {
      setShowSuccess(false);
      setSelectedAmount(null);
    }, 1500);
  };

  const handleCustomAdd = () => {
    const amount = parseInt(customAmount);
    if (amount > 0) {
      onAddEntry(amount);
      setShowSuccess(true);
      setCustomAmount('');
      setTimeout(() => {
        setShowSuccess(false);
      }, 1500);
    }
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
          <Droplet className="w-10 h-10 text-cyan-600" fill="currentColor" />
          <h1 className="text-cyan-700">Registrar Consumo</h1>
        </div>
        <p className="text-gray-600">Quanto de água você bebeu?</p>
      </div>

      {showSuccess && (
        <div className="mb-6 bg-green-50 border border-green-200 rounded-2xl p-4 flex items-center gap-3 animate-fade-in">
          <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
            <Check className="w-6 h-6 text-white" />
          </div>
          <div>
            <p className="text-green-800">Registrado com sucesso!</p>
            <p className="text-sm text-green-600">Continue assim! 💪</p>
          </div>
        </div>
      )}

      <div className="bg-white rounded-3xl shadow-lg p-6 mb-6">
        <h2 className="text-gray-700 mb-4">Valores Rápidos</h2>
        
        <div className="grid grid-cols-2 gap-4">
          {predefinedAmounts.map((item) => (
            <button
              key={item.value}
              onClick={() => handleQuickAdd(item.value)}
              className={`group relative bg-gradient-to-br from-cyan-50 to-blue-50 hover:from-cyan-100 hover:to-blue-100 rounded-2xl p-6 transition-all hover:shadow-lg ${
                selectedAmount === item.value ? 'ring-2 ring-cyan-500' : ''
              }`}
            >
              <div className="flex flex-col items-center gap-3">
                <div className="w-16 h-16 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                  <Droplet className="w-8 h-8 text-white" fill="currentColor" />
                </div>
                <div className="text-center">
                  <p className="text-cyan-700 mb-1">{item.label}</p>
                  <p className="text-xs text-gray-500">{item.icon}</p>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-lg p-6">
        <h2 className="text-gray-700 mb-4">Valor Personalizado</h2>
        
        <div className="flex gap-3">
          <div className="flex-1 relative">
            <input
              type="number"
              value={customAmount}
              onChange={(e) => setCustomAmount(e.target.value)}
              placeholder="Digite a quantidade"
              className="w-full px-4 py-4 pr-12 border-2 border-cyan-200 rounded-xl focus:border-cyan-500 focus:outline-none transition-colors"
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500">ml</span>
          </div>
          <button
            onClick={handleCustomAdd}
            disabled={!customAmount || parseInt(customAmount) <= 0}
            className="px-6 py-4 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg transition-shadow flex items-center gap-2"
          >
            <Droplet className="w-5 h-5" fill="currentColor" />
            <span>Adicionar</span>
          </button>
        </div>

        <div className="mt-4 p-4 bg-gradient-to-r from-cyan-50 to-blue-50 rounded-xl">
          <p className="text-sm text-gray-600 text-center">
            💡 Dica: Um copo padrão tem cerca de 200ml
          </p>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-3 gap-3">
        <button
          onClick={() => handleQuickAdd(100)}
          className="py-3 bg-white border-2 border-cyan-200 text-cyan-700 rounded-xl hover:bg-cyan-50 transition-colors"
        >
          +100ml
        </button>
        <button
          onClick={() => handleQuickAdd(250)}
          className="py-3 bg-white border-2 border-cyan-200 text-cyan-700 rounded-xl hover:bg-cyan-50 transition-colors"
        >
          +250ml
        </button>
        <button
          onClick={() => handleQuickAdd(350)}
          className="py-3 bg-white border-2 border-cyan-200 text-cyan-700 rounded-xl hover:bg-cyan-50 transition-colors"
        >
          +350ml
        </button>
      </div>
    </div>
  );
}
