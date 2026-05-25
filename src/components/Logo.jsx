import React from 'react';

export default function Logo({ className = "h-10", showText = true, isDark = false }) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <svg 
        viewBox="0 0 64 64" 
        className="h-full w-auto flex-shrink-0 logo-svg"
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Main Ribbon Gradients */}
          <linearGradient id="indigoGrad" x1="8" y1="4" x2="32" y2="54" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#818cf8" />
            <stop offset="60%" stopColor="#6366f1" />
            <stop offset="100%" stopColor="#4f46e5" />
          </linearGradient>
          <linearGradient id="roseGrad" x1="56" y1="4" x2="32" y2="54" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#fb7185" />
            <stop offset="60%" stopColor="#f43f5e" />
            <stop offset="100%" stopColor="#e11d48" />
          </linearGradient>

          {/* DNA Helix Gradient */}
          <linearGradient id="helixGrad" x1="30" y1="12" x2="34" y2="48" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#22d3ee" />
            <stop offset="50%" stopColor="#0d9488" />
            <stop offset="100%" stopColor="#0f766e" />
          </linearGradient>

          {/* Glow filter for DNA nodes */}
          <filter id="glow" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="1.2" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>

          <style>{`
            @keyframes pulseNode {
              0%, 100% { r: 1.2; opacity: 0.8; }
              50% { r: 2.0; opacity: 1; filter: drop-shadow(0 0 1px #fff); }
            }
            .dna-node {
              animation: pulseNode 3s infinite ease-in-out;
            }
            .dna-node-1 { animation-delay: 0s; }
            .dna-node-2 { animation-delay: 1s; }
            .dna-node-3 { animation-delay: 2s; }
            
            .heart-ribbon {
              transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
              transform-origin: 32px 30px;
            }
            .logo-svg:hover .heart-ribbon {
              transform: scale(1.04);
            }
            .logo-svg:hover .dna-strand {
              stroke-width: 3px;
            }
            .dna-strand {
              transition: stroke-width 0.3s ease;
            }
          `}</style>
        </defs>

        {/* Left hand/heart ribbon (Indigo/Violet) */}
        <path 
          className="heart-ribbon"
          d="M 32,54 C 18,46 8,34 8,22 C 8,11 16,4 26,4 C 29,4 31,5.5 32,7 C 30.5,9.5 29.5,13 29.5,18 C 29.5,29 31.5,38 32,46 Z" 
          fill="url(#indigoGrad)"
        />

        {/* Right hand/heart ribbon (Rose/Coral) */}
        <path 
          className="heart-ribbon"
          d="M 32,54 C 46,46 56,34 56,22 C 56,11 48,4 38,4 C 35,4 33,5.5 32,7 C 33.5,9.5 34.5,13 34.5,18 C 34.5,29 32.5,38 32,46 Z" 
          fill="url(#roseGrad)"
        />

        {/* Central DNA Double Helix */}
        {/* DNA Rungs */}
        <line x1="30" y1="12" x2="34" y2="12" stroke="#e0f2fe" strokeWidth="1.2" strokeLinecap="round" opacity="0.6" />
        <line x1="31.2" y1="15.5" x2="32.8" y2="15.5" stroke="#e0f2fe" strokeWidth="1.2" strokeLinecap="round" opacity="0.6" />
        <line x1="31.2" y1="22.5" x2="32.8" y2="22.5" stroke="#e0f2fe" strokeWidth="1.2" strokeLinecap="round" opacity="0.6" />
        <line x1="30" y1="26" x2="34" y2="26" stroke="#e0f2fe" strokeWidth="1.2" strokeLinecap="round" opacity="0.6" />
        <line x1="31.2" y1="29.5" x2="32.8" y2="29.5" stroke="#e0f2fe" strokeWidth="1.2" strokeLinecap="round" opacity="0.6" />
        <line x1="31.2" y1="36.5" x2="32.8" y2="36.5" stroke="#e0f2fe" strokeWidth="1.2" strokeLinecap="round" opacity="0.6" />
        <line x1="30" y1="40" x2="34" y2="40" stroke="#e0f2fe" strokeWidth="1.2" strokeLinecap="round" opacity="0.6" />
        <line x1="31.2" y1="43.5" x2="32.8" y2="43.5" stroke="#e0f2fe" strokeWidth="1.2" strokeLinecap="round" opacity="0.6" />

        {/* DNA Strand 1 */}
        <path 
          className="dna-strand"
          d="M 30,12 C 30,19 34,19 34,26 C 34,33 30,33 30,40 C 30,47 34,47 34,48" 
          stroke="url(#helixGrad)"
          strokeWidth="2"
          strokeLinecap="round"
        />

        {/* DNA Strand 2 */}
        <path 
          className="dna-strand"
          d="M 34,12 C 34,19 30,19 30,26 C 30,33 34,33 34,40 C 34,47 30,47 30,48" 
          stroke="url(#helixGrad)"
          strokeWidth="2"
          strokeLinecap="round"
        />

        {/* DNA Glowing Node Dots */}
        <circle className="dna-node dna-node-1" cx="32" cy="19" r="1.5" fill="#ffffff" filter="url(#glow)" />
        <circle className="dna-node dna-node-2" cx="32" cy="33" r="1.5" fill="#ffffff" filter="url(#glow)" />
        <circle className="dna-node dna-node-3" cx="32" cy="47" r="1.5" fill="#ffffff" filter="url(#glow)" />
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
