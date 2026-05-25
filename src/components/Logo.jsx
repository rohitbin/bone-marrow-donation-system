import React from 'react';

export default function Logo({ className = "h-10", showText = true, isDark = false }) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <svg 
        viewBox="0 0 64 64" 
        className="h-full w-auto flex-shrink-0"
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="tealGrad" x1="8" y1="4" x2="32" y2="54" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#06b6d4" />
            <stop offset="100%" stopColor="#0d9488" />
          </linearGradient>
          <linearGradient id="roseGrad" x1="56" y1="4" x2="32" y2="54" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#f43f5e" />
            <stop offset="100%" stopColor="#e11d48" />
          </linearGradient>
          <linearGradient id="greenGrad" x1="22" y1="13" x2="42" y2="26" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#4ade80" />
            <stop offset="100%" stopColor="#16a34a" />
          </linearGradient>
          <linearGradient id="boneGrad" x1="30" y1="6" x2="35" y2="54" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#f8fafc" />
            <stop offset="100%" stopColor="#e2e8f0" />
          </linearGradient>
        </defs>

        {/* Left hand/heart curve (Teal) */}
        <path 
          d="M 32,54 C 18,46 8,34 8,22 C 8,11 16,4 26,4 C 29,4 31,5.5 32,7 C 30.5,9.5 29.5,13 29.5,18 C 29.5,29 31.5,38 32,46 Z" 
          fill="url(#tealGrad)"
        />

        {/* Right hand/heart curve (Rose) */}
        <path 
          d="M 32,54 C 46,46 56,34 56,22 C 56,11 48,4 38,4 C 35,4 33,5.5 32,7 C 33.5,9.5 34.5,13 34.5,18 C 34.5,29 32.5,38 32,46 Z" 
          fill="url(#roseGrad)"
        />

        {/* Center Bone (White/Silver outline) */}
        <path 
          d="M 30,14 C 28,14 27,12 27,10 C 27,8 29,6 31,6 C 32,6 32.5,7 33,7.5 C 33.5,7 34,6 35,6 C 37,6 39,8 39,10 C 39,12 38,14 36,14 L 35,14 L 35,46 L 36,46 C 38,46 39,48 39,50 C 39,52 37,54 35,54 C 34,54 33.5,53 33,52.5 C 32.5,53 32,54 31,54 C 29,54 27,52 27,50 C 27,48 28,46 30,46 Z" 
          fill="url(#boneGrad)"
          stroke="#cbd5e1"
          strokeWidth="1"
        />

        {/* Leaves / Sprouts (Green) */}
        <path 
          d="M 31,26 C 26,26 22,22 22,17 C 26,17 30,21 31,26 Z" 
          fill="url(#greenGrad)"
        />
        <path 
          d="M 33,22 C 38,22 42,18 42,13 C 38,13 34,17 33,22 Z" 
          fill="url(#greenGrad)"
        />
        <path 
          d="M 32,30 C 32,27 32,24 33,22" 
          stroke="#16a34a" 
          strokeWidth="1.5" 
          strokeLinecap="round"
        />
      </svg>

      {showText && (
        <div className="flex flex-col justify-center leading-none select-none">
          <div className="text-lg font-bold tracking-tight">
            <span className={isDark ? "text-white" : "text-slate-800"}>BoneMarrow</span>
            <span className="text-rose-500">Donation</span>
          </div>
          <span className={`text-[9px] font-bold tracking-[0.16em] uppercase mt-0.5 ${isDark ? "text-slate-400" : "text-slate-500"}`}>
            Connect • Donate • Save Lives
          </span>
        </div>
      )}
    </div>
  );
}
