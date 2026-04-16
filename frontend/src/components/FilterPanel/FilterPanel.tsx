import React from 'react';
import { useConditionStore } from '../../store/conditionStore';
import { REGIONS, LIFECYCLES, HOUSEHOLDS, CONDITIONS, INCOME_LEVELS } from '../../utils/filterData';
import { ChevronDown, RotateCcw } from 'lucide-react';

export const FilterPanel: React.FC = () => {
  const { 
    condition, 
    setSido, 
    setSigungu, 
    toggleLifecycle, 
    toggleHousehold, 
    toggleCondition,
    setIncomeLevel,
    resetFilters 
  } = useConditionStore();

  return (
    <aside className="w-80 h-screen overflow-y-auto bg-white border-r border-slate-200 p-6 sticky top-0 custom-scrollbar">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-xl font-bold text-slate-800">맞춤형 필터</h2>
        <button 
          onClick={resetFilters}
          className="p-2 text-slate-400 hover:text-blue-600 transition-colors"
          title="필터 초기화"
        >
          <RotateCcw size={18} />
        </button>
      </div>

      <div className="space-y-8">
        {/* 거주지 */}
        <section>
          <label className="block text-sm font-semibold text-slate-500 mb-3 uppercase tracking-wider">거주지</label>
          <div className="space-y-3">
            <div className="relative">
              <select 
                value={condition.sido}
                onChange={(e) => setSido(e.target.value)}
                className="w-full appearance-none bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm"
              >
                <option value="">시·도 선택</option>
                {Object.keys(REGIONS).map(sido => (
                  <option key={sido} value={sido}>{sido}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-3 text-slate-400 pointer-events-none" size={16} />
            </div>
            
            <div className="relative">
              <select 
                value={condition.sigungu}
                onChange={(e) => setSigungu(e.target.value)}
                disabled={!condition.sido}
                className="w-full appearance-none bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm disabled:opacity-50"
              >
                <option value="">시·군·구 선택</option>
                {condition.sido && (REGIONS as any)[condition.sido]?.map((sigungu: string) => (
                  <option key={sigungu} value={sigungu}>{sigungu}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-3 text-slate-400 pointer-events-none" size={16} />
            </div>
          </div>
        </section>

        {/* 생애주기 */}
        <section>
          <label className="block text-sm font-semibold text-slate-500 mb-3 uppercase tracking-wider">생애주기</label>
          <div className="flex flex-wrap gap-2">
            {LIFECYCLES.map(l => (
              <button
                key={l}
                onClick={() => toggleLifecycle(l)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                  condition.lifecycle.includes(l)
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {l}
              </button>
            ))}
          </div>
        </section>

        {/* 가구상황 */}
        <section>
          <label className="block text-sm font-semibold text-slate-500 mb-3 uppercase tracking-wider">가구상황</label>
          <div className="flex flex-wrap gap-2">
            {HOUSEHOLDS.map(h => (
              <button
                key={h}
                onClick={() => toggleHousehold(h)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                  condition.household.includes(h)
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {h}
              </button>
            ))}
          </div>
        </section>

        {/* 생활조건·질환 */}
        <section>
          <label className="block text-sm font-semibold text-slate-500 mb-3 uppercase tracking-wider">생활조건 · 질환</label>
          <div className="grid grid-cols-2 gap-2">
            {CONDITIONS.map(c => (
              <button
                key={c}
                onClick={() => toggleCondition(c)}
                className={`px-3 py-2 rounded-xl text-xs font-medium text-left transition-all border ${
                  condition.conditions.includes(c)
                    ? 'border-blue-600 bg-blue-50 text-blue-700'
                    : 'border-slate-100 bg-slate-50 text-slate-600 hover:border-slate-200'
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </section>

        {/* 소득수준 */}
        <section>
          <label className="block text-sm font-semibold text-slate-500 mb-3 uppercase tracking-wider">소득수준</label>
          <div className="relative">
            <select 
              value={condition.incomeLevel}
              onChange={(e) => setIncomeLevel(e.target.value)}
              className="w-full appearance-none bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm"
            >
              <option value="">소득수준 선택</option>
              {INCOME_LEVELS.map(level => (
                <option key={level} value={level}>{level}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-3 text-slate-400 pointer-events-none" size={16} />
          </div>
        </section>
      </div>
    </aside>
  );
};
