import React, { useState, useEffect } from 'react';
import { FilterPanel } from './components/FilterPanel/FilterPanel';
import { ResultPanel } from './components/ResultPanel/ResultPanel';
import { useConditionStore } from './store/conditionStore';
import axios from 'axios';
import { ShieldCheck, Bell } from 'lucide-react';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api/services';

import type { ResultsState } from './types/service';

const App: React.FC = () => {
  const { condition } = useConditionStore();
  const [results, setResults] = useState<ResultsState>({ central: [], local: [], private: [] });
  const [isLoading, setIsLoading] = useState(false);
  const [apiStatus, setApiStatus] = useState<'online' | 'offline'>('online');

  // 9. Use useCallback to prevent unnecessary re-renders and fix dependency warnings
  const fetchResults = React.useCallback(async () => {
    // 10. Guard: Prevent API calls when no filters are selected
    const hasActiveFilters = 
      condition.sido || 
      condition.lifecycle.length > 0 || 
      condition.household.length > 0 || 
      condition.conditions.length > 0;

    if (!hasActiveFilters) {
      setResults({ central: [], local: [], private: [] });
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.post(`${API_BASE_URL}/match`, condition);
      setResults(response.data);
      setApiStatus('online');
    } catch (error) {
      console.error('Failed to fetch results:', error);
      setApiStatus('offline');
    } finally {
      setIsLoading(false);
    }
  }, [condition]);

  useEffect(() => {
    // Debounce API calls
    const timeout = setTimeout(() => {
      fetchResults();
    }, 500);
    return () => clearTimeout(timeout);
  }, [fetchResults]); // 9. Correct dependency

  return (
    <div className="flex h-screen bg-slate-50 font-sans selection:bg-blue-100 selection:text-blue-900 overflow-hidden">
      {/* Sidebar Filter */}
      <FilterPanel />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-slate-200 px-8 flex items-center justify-between shadow-sm z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
              <ShieldCheck size={24} />
            </div>
            <div>
              <h1 className="text-lg font-extrabold text-slate-800 tracking-tight leading-none">BokjiCall</h1>
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Case Management System</span>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${apiStatus === 'online' ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
              <span className="text-xs font-semibold text-slate-500">API Status</span>
            </div>
            
            <button className="relative p-2 text-slate-400 hover:text-slate-600 transition-colors">
              <Bell size={20} />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
            </button>
            
            <div className="flex items-center gap-3 pl-6 border-l border-slate-200">
              <div className="text-right">
                <p className="text-xs font-bold text-slate-700">김복지 사회복지사</p>
                <p className="text-[10px] text-slate-400">사례관리팀</p>
              </div>
              <div className="w-9 h-9 bg-slate-200 rounded-full border-2 border-white shadow-sm overflow-hidden">
                <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="Avatar" />
              </div>
            </div>
          </div>
        </header>

        {/* Results Panel */}
        <ResultPanel results={results} isLoading={isLoading} />
      </div>
    </div>
  );
};

export default App;
