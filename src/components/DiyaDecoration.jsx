import React from 'react';

export default function DiyaDecoration() {
  return (
    <>
      {/* Top Toran / Festive Marigold & Leaf Garland */}
      <div className="fixed top-0 left-0 right-0 pointer-events-none z-30 flex justify-between overflow-hidden opacity-90">
        <svg className="w-full h-12 md:h-16" preserveAspectRatio="none" viewBox="0 0 1200 60">
          <defs>
            <linearGradient id="marigold" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFA500" />
              <stop offset="50%" stopColor="#FF4500" />
              <stop offset="100%" stopColor="#FFD700" />
            </linearGradient>
            <linearGradient id="leaf" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#2E7D32" />
              <stop offset="100%" stopColor="#1B5E20" />
            </linearGradient>
          </defs>
          {/* Swags */}
          <path d="M0,0 Q150,55 300,0 Q450,55 600,0 Q750,55 900,0 Q1050,55 1200,0" fill="none" stroke="#FF8C00" strokeWidth="4" />
          {/* Hanging Marigold flowers & mango leaves */}
          {[150, 450, 750, 1050].map((x, i) => (
            <g key={i} transform={`translate(${x - 15}, 10)`}>
              <circle cx="15" cy="25" r="14" fill="url(#marigold)" filter="drop-shadow(0 2px 4px rgba(0,0,0,0.4))" />
              <circle cx="15" cy="25" r="9" fill="#FFD700" />
              <circle cx="15" cy="25" r="4" fill="#FF4500" />
              <path d="M15,25 Q18,48 15,55 Q12,48 15,25" fill="url(#leaf)" />
            </g>
          ))}
        </svg>
      </div>

      {/* Bottom Left Diya */}
      <div className="fixed bottom-4 left-4 pointer-events-none z-20 flex flex-col items-center">
        {/* Diya Flame */}
        <div className="w-6 h-10 bg-gradient-to-t from-orange-500 via-yellow-300 to-white rounded-full animate-diya-flame shadow-lg shadow-orange-500/80 -mb-2" />
        {/* Terracotta Clay Base */}
        <div className="w-16 h-8 bg-gradient-to-b from-amber-700 to-amber-900 rounded-b-full border-t-2 border-yellow-500 shadow-2xl relative">
          <div className="absolute top-1 left-2 right-2 h-1 bg-yellow-400/50 rounded-full" />
        </div>
      </div>

      {/* Bottom Right Diya */}
      <div className="fixed bottom-4 right-4 pointer-events-none z-20 flex flex-col items-center">
        {/* Diya Flame */}
        <div className="w-6 h-10 bg-gradient-to-t from-orange-500 via-yellow-300 to-white rounded-full animate-diya-flame shadow-lg shadow-orange-500/80 -mb-2" />
        {/* Terracotta Clay Base */}
        <div className="w-16 h-8 bg-gradient-to-b from-amber-700 to-amber-900 rounded-b-full border-t-2 border-yellow-500 shadow-2xl relative">
          <div className="absolute top-1 left-2 right-2 h-1 bg-yellow-400/50 rounded-full" />
        </div>
      </div>
    </>
  );
}

