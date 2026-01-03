import React from 'react';
import { MOCK_NEWS } from '../constants';
import { Newspaper, Bell, FileText, ChevronRight } from 'lucide-react';

export const NewsView: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
       <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">政策资讯 (News & Policy)</h2>
          <p className="text-gray-500 text-sm mt-1">海关公告、互市政策与行业动态</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-indigo-600 rounded-xl p-6 text-white shadow-lg md:col-span-3 flex flex-col md:flex-row items-center justify-between gap-6">
           <div className="flex-1">
             <span className="bg-indigo-500/50 text-indigo-100 px-2 py-1 rounded text-xs mb-2 inline-block border border-indigo-400">重要通知</span>
             <h3 className="text-xl font-bold mb-2">关于2023年国庆期间边民互市贸易通关安排的通知</h3>
             <p className="text-indigo-200 text-sm line-clamp-2">根据口岸办最新部署，国庆期间（10月1日-10月3日）实行预约通关制，请各互助组提前24小时申报计划。</p>
           </div>
           <button className="px-6 py-2 bg-white text-indigo-600 font-bold rounded-lg hover:bg-indigo-50 transition-colors whitespace-nowrap">
             查看详情
           </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="divide-y divide-gray-100">
           {MOCK_NEWS.map((news) => (
             <div key={news.id} className="p-6 hover:bg-gray-50 transition-colors cursor-pointer group">
                <div className="flex items-start gap-4">
                   <div className={`p-3 rounded-lg shrink-0 ${
                     news.type === 'policy' ? 'bg-red-100 text-red-600' :
                     news.type === 'notice' ? 'bg-orange-100 text-orange-600' :
                     'bg-blue-100 text-blue-600'
                   }`}>
                      {news.type === 'policy' && <FileText size={20} />}
                      {news.type === 'notice' && <Bell size={20} />}
                      {news.type === 'news' && <Newspaper size={20} />}
                   </div>
                   <div className="flex-1">
                      <div className="flex justify-between items-start mb-1">
                        <h4 className="font-bold text-gray-800 group-hover:text-blue-600 transition-colors">{news.title}</h4>
                        <span className="text-xs text-gray-400 whitespace-nowrap ml-4">{news.date}</span>
                      </div>
                      <p className="text-sm text-gray-500 line-clamp-2">{news.summary}</p>
                      <div className="mt-2 flex gap-2">
                        <span className={`text-[10px] px-2 py-0.5 rounded border ${
                            news.type === 'policy' ? 'border-red-200 text-red-600 bg-red-50' :
                            news.type === 'notice' ? 'border-orange-200 text-orange-600 bg-orange-50' :
                            'border-blue-200 text-blue-600 bg-blue-50'
                        }`}>
                           {news.type === 'policy' ? '政策法规' : news.type === 'notice' ? '口岸公告' : '行业新闻'}
                        </span>
                        {!news.read && <span className="text-[10px] px-2 py-0.5 rounded bg-red-500 text-white">未读</span>}
                      </div>
                   </div>
                   <ChevronRight className="text-gray-300 group-hover:text-gray-500 self-center" />
                </div>
             </div>
           ))}
        </div>
      </div>
    </div>
  );
};
