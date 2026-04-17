import React from 'react';
import { ServiceCard } from '../ServiceCard/ServiceCard';
import { Search, Loader2, Info } from 'lucide-react';

import type { ResultsState, ServiceResult } from '../../types/service';

interface ResultPanelProps {
  results: ResultsState;
  isLoading: boolean;
}

export const ResultPanel: React.FC<ResultPanelProps> = ({ results, isLoading }) => {
  const totalCount = results.central.length + results.local.length + results.private.length;
  
  // Combine all categories into one list and sort by urgency level Desc (higher first)
  const allResults: ServiceResult[] = [
    ...results.private,
    ...results.central,
    ...results.local,
  ].sort((a, b) => (b.urgencyLevel || 0) - (a.urgencyLevel || 0));

  if (isLoading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-slate-50">
        <Loader2 className="animate-spin text-blue-600 mb-4" size={40} />
        <p className="text-slate-500 font-medium">맞춤형 자원을 매칭 중입니다...</p>
      </div>
    );
  }

  if (totalCount === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-slate-50 p-10">
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200 text-center max-w-md">
          <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <Search size={32} />
          </div>
          <h3 className="text-xl font-bold text-slate-800 mb-2">매칭된 자원이 없습니다</h3>
          <p className="text-slate-500 mb-6 leading-relaxed text-sm">
            선택하신 필터 조건에 해당하는 자원이 현재 없습니다.<br/>
            일부 필터를 해제하거나 범위를 넓혀 확인해 보세요.
          </p>
          <button className="text-blue-600 font-semibold text-sm hover:underline">
            조건 완화하여 다시 검색하기
          </button>
        </div>
      </div>
    );
  }

  return (
    <main className="flex-1 bg-slate-50 overflow-y-auto p-8 custom-scrollbar">
      <header className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">매칭 결과</h2>
          <p className="text-slate-500 text-sm mt-1">
            총 <span className="text-blue-600 font-bold">{totalCount}건</span>의 자원이 검색되었습니다.
          </p>
        </div>
        
        <div className="flex bg-white p-1 rounded-xl border border-slate-200 shadow-sm">
          <div className="px-4 py-2 text-center border-r border-slate-100 last:border-0">
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter mb-0.5">중앙</div>
            <div className="text-sm font-bold text-blue-600">{results.central.length}</div>
          </div>
          <div className="px-4 py-2 text-center border-r border-slate-100 last:border-0">
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter mb-0.5">지자체</div>
            <div className="text-sm font-bold text-green-600">{results.local.length}</div>
          </div>
          <div className="px-4 py-2 text-center border-r border-slate-100 last:border-0">
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter mb-0.5">민간</div>
            <div className="text-sm font-bold text-purple-600">{results.private.length}</div>
          </div>
        </div>
      </header>

      {/* Urgent Services Alert (Optional highlight) */}
      {allResults.some(s => s.urgencyLevel >= 4) && (
        <div className="mb-8 bg-gradient-to-r from-red-50 to-orange-50 border border-red-100 rounded-2xl p-4 flex items-center gap-4 shadow-sm animate-pulse">
          <div className="bg-red-500 text-white p-2 rounded-xl">
            <Info size={20} />
          </div>
          <div>
            <h4 className="text-sm font-bold text-red-800">긴급 지원 필요 대상 자원 발견</h4>
            <p className="text-xs text-red-600">즉각적인 개입이 필요한 상위 매칭 자원들이 검색되었습니다. 최상단 항목을 먼저 확인하십시오.</p>
          </div>
        </div>
      )}

      {/* Result Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 pb-20">
        {allResults.map((service) => (
          <ServiceCard key={`${service.tier}-${service.id}`} service={service} />
        ))}
      </div>
    </main>
  );
};
