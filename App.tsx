import React, { useState, useEffect } from 'react';
import type { Expense, Category } from './types';
import AmountInputModal from './components/AmountInputModal';
import DataSheetView from './components/DataSheetView';
import ExpenseCategoryPanel from './components/ExpenseCategoryPanel';

const DataSheetIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V7a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
  </svg>
);

const DEFAULT_CATEGORIES: Category[] = [
  { id: '食費', label: '食費' },
  { id: '交通費', label: '交通費' },
  { id: '通信費', label: '通信費' },
  { id: '水道光熱費', label: '水道光熱費' },
  { id: '家賃', label: '家賃' },
  { id: '日用品', label: '日用品' },
  { id: '交際費', label: '交際費' },
  { id: '趣味・娯楽', label: '趣味・娯楽' },
  { id: '教育・教養', label: '教育・教養' },
  { id: '医療費', label: '医療費' },
  { id: '保険', label: '保険' },
  { id: 'その他', label: 'その他' },
  { id: '美容・衣類', label: '美容・衣類' },
  { id: '家具・家電', label: '家具・家電' },
  { id: '税金・社会保険', label: '税金・社会保険' },
  { id: 'ペット関連', label: 'ペット関連' },
  { id: '慶弔費', label: '慶弔費' },
  { id: '旅行', label: '旅行' },
];

const loadCategories = (): Category[] => {
  try {
    const storedCategories = localStorage.getItem('expenseCategories');
    if (storedCategories) {
      const parsed = JSON.parse(storedCategories);
      // Ensure we have 18 categories, merging stored with default
      if (Array.isArray(parsed) && parsed.length > 0) {
        const storedIds = new Set(parsed.map(c => c.id));
        const merged = [
          ...parsed,
          ...DEFAULT_CATEGORIES.filter(c => !storedIds.has(c.id))
        ];
        return merged.slice(0, 18);
      }
    }
  } catch (error) {
    console.error("Failed to parse categories from localStorage", error);
  }
  return DEFAULT_CATEGORIES;
};

const App: React.FC = () => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [categories, setCategories] = useState<Category[]>(loadCategories);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isDataSheetVisible, setIsDataSheetVisible] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem('expenseCategories', JSON.stringify(categories));
    } catch (error) {
      console.error("Failed to save categories to localStorage", error);
    }
  }, [categories]);

  const handleCategoryClick = (categoryLabel: string) => {
    setSelectedCategory(categoryLabel);
    setIsModalOpen(true);
  };

  const handleUpdateCategory = (id: string, newLabel: string) => {
    setCategories(prevCategories =>
      prevCategories.map(cat =>
        cat.id === id ? { ...cat, label: newLabel } : cat
      )
    );
  };

  const handleAddExpense = (amount: number) => {
    if (selectedCategory) {
      const newExpense: Expense = {
        id: new Date().getTime().toString(),
        category: selectedCategory,
        amount,
      };
      setExpenses(prevExpenses => [...prevExpenses, newExpense]);
    }
    setIsModalOpen(false);
    setSelectedCategory(null);
  };
  
  const handleClearExpenses = () => {
    setExpenses([]);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedCategory(null);
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col items-center p-4 sm:p-6 md:p-8">
      <div className="w-full max-w-6xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-700">経費入力パネル</h1>
          <p className="text-slate-500 mt-2">カテゴリをクリックして金額を入力してください。</p>
        </header>

        <main className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {categories.map(category => (
            <ExpenseCategoryPanel 
              key={category.id} 
              category={category} 
              onClick={handleCategoryClick}
              onUpdate={handleUpdateCategory} 
            />
          ))}
        </main>

        <footer className="mt-12 text-center">
            <button
              onClick={() => setIsDataSheetVisible(true)}
              className="inline-flex items-center gap-2 bg-indigo-600 text-white font-semibold py-3 px-6 rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-transform transform hover:scale-105"
            >
              <DataSheetIcon className="w-6 h-6" />
              データシートを表示する
            </button>
        </footer>
      </div>

      {isModalOpen && selectedCategory && (
        <AmountInputModal
          category={selectedCategory}
          onSubmit={handleAddExpense}
          onClose={handleCloseModal}
        />
      )}
      
      {isDataSheetVisible && (
        <DataSheetView
          expenses={expenses}
          onClose={() => setIsDataSheetVisible(false)}
          onClear={handleClearExpenses}
        />
      )}
    </div>
  );
};

export default App;