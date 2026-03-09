import React, { useState } from 'react';

const DriveCard = ({ drive }) => {
    const [joined, setJoined] = useState(false);

    const handleJoin = () => {
        setJoined(true);
        // Dummy logic as requested: no backend update, just local state
    };

    return (
        <div className="bg-white rounded-3xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 hover:shadow-[0_20px_50px_rgba(30,41,59,0.08)] transition-all duration-300">
            <div className="flex justify-between items-start mb-4">
                <div>
                    <span className="inline-block px-3 py-1 rounded-full bg-slate-100 text-slate-600 text-xs font-bold uppercase tracking-wider mb-2">
                        Community Drive
                    </span>
                    <h3 className="text-xl font-bold text-gray-900">{drive.lake_name}</h3>
                </div>
                <div className="text-right">
                    <p className="text-sm font-semibold text-gray-500">{drive.date}</p>
                    <p className="text-sm text-gray-400">{drive.time}</p>
                </div>
            </div>

            <div className="space-y-3 mb-6">
                <div className="flex items-start gap-3 text-sm text-gray-600">
                    <svg className="w-5 h-5 text-slate-400 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span>{drive.location}</span>
                </div>
                <p className="text-gray-600 text-sm leading-relaxed line-clamp-3">
                    {drive.description}
                </p>
            </div>

            <div className="flex gap-3">
                <a
                    href={drive.whatsapp_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 text-center py-3 rounded-xl border-2 border-green-500 text-green-600 font-bold text-sm hover:bg-green-50 transition-colors"
                >
                    WhatsApp Group
                </a>
                <button
                    onClick={handleJoin}
                    disabled={joined}
                    className={`flex-1 py-3 rounded-xl font-bold text-sm transition-all ${joined
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'bg-[#455a64] text-white hover:bg-[#37474f] shadow-lg shadow-slate-200'
                        }`}
                >
                    {joined ? 'Joined ✓' : 'Join Drive'}
                </button>
            </div>
        </div>
    );
};

export default DriveCard;
