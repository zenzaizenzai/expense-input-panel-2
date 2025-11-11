import React, { useMemo, useRef } from 'react';
import type { Expense } from '../types';

interface DataSheetViewProps {
  expenses: Expense[];
  onClose: () => void;
  onClear: () => void;
}

const CopyIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
  </svg>
);

const DataSheetView: React.FC<DataSheetViewProps> = ({ expenses, onClose, onClear }) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const tsvData = useMemo(() => {
    return expenses.map(e => `${e.category}\t${e.amount}`).join('\n');
  }, [expenses]);

  const handleCopy = () => {
    if (textareaRef.current) {
      textareaRef.current.select();
      document.execCommand('copy');
    }
  };

  const handleClear = () => {
    onClear();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl p-6 sm:p-8 w-full max-w-2xl flex flex-col max-h-[90vh]">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-slate-800">経費データシート</h2>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-800 text-2xl font-bold">&times;</button>
        </div>

        {expenses.length === 0 ? (
          <p className="text-slate-500 text-center py-10">まだ経費が入力されていません。</p>
        ) : (
          <>
            <div className="flex-grow overflow-y-auto border border-slate-200 rounded-lg">
              <table className="w-full text-left">
                <thead className="bg-slate-100 sticky top-0">
                  <tr>
                    <th className="p-3 font-semibold text-slate-600">カテゴリ</th>
                    <th className="p-3 font-semibold text-slate-600 text-right">金額 (円)</th>
                  </tr>
                </thead>
                <tbody>
                  {expenses.map((expense) => (
                    <tr key={expense.id} className="border-b border-slate-200 last:border-b-0">
                      <td className="p-3">{expense.category}</td>
                      <td className="p-3 text-right font-mono">{expense.amount.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-6">
              <label htmlFor="tsv-output" className="block text-sm font-medium text-slate-700 mb-2">
                スプレッドシート用データ (TSV形式)
              </label>
              <div className="relative">
                <textarea
                  ref={textareaRef}
                  id="tsv-output"
                  readOnly
                  value={tsvData}
                  className="w-full h-32 p-3 font-mono text-sm bg-slate-50 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <button
                  onClick={handleCopy}
                  title="Copy to clipboard"
                  className="absolute top-2 right-2 p-2 bg-slate-200 rounded-md hover:bg-slate-300 text-slate-600"
                >
                  <CopyIcon className="w-5 h-5" />
                </button>
              </div>
            </div>
          </>
        )}

        <div className="mt-8 flex justify-end items-center gap-4">
          <button
            onClick={handleClear}
            disabled={expenses.length === 0}
            className="px-6 py-2 rounded-md bg-red-100 text-red-700 font-semibold hover:bg-red-200 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            データをクリア
          </button>
          <button
            onClick={onClose}
            className="px-6 py-2 rounded-md bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition"
          >
            閉じる
          </button>
        </div>
      </div>
    </div>
  );
};

export default DataSheetView;
