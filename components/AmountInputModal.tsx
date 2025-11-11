
import React, { useState, useEffect, useRef } from 'react';

interface AmountInputModalProps {
  category: string;
  onSubmit: (amount: number) => void;
  onClose: () => void;
}

const AmountInputModal: React.FC<AmountInputModalProps> = ({ category, onSubmit, onClose }) => {
  const [amount, setAmount] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const numericAmount = parseInt(amount, 10);
    if (!isNaN(numericAmount) && numericAmount > 0) {
      onSubmit(numericAmount);
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-lg shadow-xl p-6 sm:p-8 w-full max-w-sm"
        onClick={e => e.stopPropagation()}
      >
        <h2 className="text-2xl font-bold text-slate-800 mb-2">金額を入力</h2>
        <p className="text-slate-500 mb-6">カテゴリ: <span className="font-semibold text-indigo-600">{category}</span></p>

        <form onSubmit={handleSubmit}>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-500 text-lg">¥</span>
            <input
              ref={inputRef}
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0"
              className="w-full pl-8 pr-4 py-3 text-2xl border-2 border-slate-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 transition"
              required
              min="1"
            />
          </div>
          
          <div className="flex justify-end gap-3 mt-8">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 rounded-md bg-slate-200 text-slate-700 font-semibold hover:bg-slate-300 transition"
            >
              キャンセル
            </button>
            <button
              type="submit"
              className="px-6 py-2 rounded-md bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition"
            >
              追加
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AmountInputModal;
