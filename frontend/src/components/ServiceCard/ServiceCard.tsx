import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, MapPin, Building2, ExternalLink, Info, AlertCircle } from 'lucide-react';

interface ServiceCardProps {
  service: {
    id: string;
    name: string;
    provider: string;
    tier: 'CENTRAL' | 'LOCAL' | 'PRIVATE';
    summary: string;
    content: string;
    target: string;
    applyMethod: string;
    documents?: string;
    link?: string;
    urgencyLevel: number;
    topics: string[];
    region: string;
  };
}

export const ServiceCard: React.FC<ServiceCardProps> = ({ service }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const tierBadge = {
    CENTRAL: 'bg-blue-100 text-blue-700 border-blue-200',
    LOCAL: 'bg-green-100 text-green-700 border-green-200',
    PRIVATE: 'bg-purple-100 text-purple-700 border-purple-200',
  }[service.tier];

  const urgencyColor = service.urgencyLevel >= 4 ? 'bg-red-500' : 
                      service.urgencyLevel >= 3 ? 'bg-orange-500' : 'bg-slate-300';

  return (
    <motion.div 
      layout
      className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow overflow-hidden group"
    >
      <div className="flex">
        {/* Urgency indicator bar */}
        <div className={`w-1.5 ${urgencyColor}`} />
        
        <div className="flex-1 p-5">
          <div className="flex items-start justify-between mb-3">
            <div className="flex flex-wrap gap-2">
              <span className={`px-2 py-0.5 rounded text-[10px] font-bold border uppercase tracking-tighter ${tierBadge}`}>
                {service.tier}
              </span>
              {service.topics.slice(0, 2).map(topic => (
                <span key={topic} className="px-2 py-0.5 rounded text-[10px] font-medium bg-slate-100 text-slate-500 border border-slate-200">
                  {topic}
                </span>
              ))}
              {service.region !== '전국' && (
                <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-amber-50 text-amber-600 border border-amber-100">
                  지역한정
                </span>
              )}
            </div>
            {service.link && (
              <a 
                href={service.link} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-slate-400 hover:text-blue-600 transition-colors"
              >
                <ExternalLink size={16} />
              </a>
            )}
          </div>

          <div 
            className="cursor-pointer"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            <h3 className="text-lg font-bold text-slate-800 mb-1 group-hover:text-blue-600 transition-colors leading-tight">
              {service.name}
            </h3>
            <div className="flex items-center text-sm text-slate-500 mb-2">
              <Building2 size={14} className="mr-1" />
              <span>{service.provider}</span>
            </div>
            
            <p className="text-sm text-slate-600 line-clamp-2 leading-relaxed mb-3">
              {service.summary}
            </p>

            <div className="flex items-center justify-between mt-4">
              <div className="flex items-center text-xs text-slate-400">
                <MapPin size={12} className="mr-1" />
                <span>{service.region}</span>
              </div>
              <motion.button 
                animate={{ rotate: isExpanded ? 180 : 0 }}
                className="p-1 text-slate-400 hover:bg-slate-50 rounded-full"
              >
                <ChevronDown size={20} />
              </motion.button>
            </div>
          </div>

          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="mt-6 pt-6 border-t border-dashed border-slate-200 space-y-5">
                  <div>
                    <h4 className="flex items-center text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">
                      <Info size={14} className="mr-1.5" /> 지원대상
                    </h4>
                    <p className="text-sm text-slate-700 bg-slate-50 p-3 rounded-xl border border-slate-100 leading-relaxed font-medium">
                      {service.target}
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="flex items-center text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">
                      💰 주요내용
                    </h4>
                    <p className="text-sm text-slate-700 leading-relaxed">
                      {service.content}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">📋 신청방법</h4>
                      <p className="text-xs text-slate-600">{service.applyMethod}</p>
                    </div>
                    {service.documents && (
                      <div>
                        <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">📄 제출서류</h4>
                        <p className="text-xs text-slate-600">{service.documents}</p>
                      </div>
                    )}
                  </div>

                  {service.urgencyLevel >= 4 && (
                    <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
                      <AlertCircle className="text-red-500 shrink-0" size={20} />
                      <div>
                        <p className="text-xs font-bold text-red-700 mb-0.5">긴급 대응 필요</p>
                        <p className="text-[11px] text-red-600 leading-normal">
                          해당 서비스는 긴급도가 높은 자원입니다. 대상자의 위기 상황을 즉각 확인하여 연계해 주시기 바랍니다.
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
};
