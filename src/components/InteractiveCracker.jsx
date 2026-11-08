import React, { useState, useEffect, useRef } from 'react';
import { soundManager } from '../utils/audio';
import { Flame, Sparkles, RefreshCw, Volume2, VolumeX, ArrowLeft } from 'lucide-react';

const CRACKER_TYPES = [
  {
    id: 'rocket',
    name: 'Diwali Sky Rocket',
    hindi: 'रॉकेट',
    icon: '🚀',
    desc: 'Soars high into the night sky & detonates with high-altitude face sparks!'
  },
  {
    id: 'bomb',
    name: 'Grand Sutli Bomb',
    hindi: 'सुतली बम',
    icon: '💥',
    desc: 'The classic mega-loud blast that shakes the ground into golden face dust!'
  },
  {
    id: 'anaar',
    name: 'Royal Anaar (Flower Pot)',
    hindi: 'अनार',
    icon: '🌋',
    desc: 'Erupts in a golden spark fountain before exploding into face sparkles!'
  },
  {
    id: 'chakri',
    name: 'Whirling Chakri',
    hindi: 'चकरी',
    icon: '🌀',
    desc: 'Spins in blazing rainbow spirals before lifting off into face fireworks!'
  }
];

export default function InteractiveCracker({
  faceImageSrc,
  userName,
  onTriggerCanvasBurst,
  onChangePhoto
}) {
  const [selectedCracker, setSelectedCracker] = useState('rocket');
  const [crackerState, setCrackerState] = useState('idle'); // 'idle' | 'lighting' | 'launching' | 'boomed'
  const [fuseProgress, setFuseProgress] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [shakeScreen, setShakeScreen] = useState(false);
  const [showFlash, setShowFlash] = useState(false);
  const crackerAreaRef = useRef(null);

  // Clean up sounds on unmount
  useEffect(() => {
    return () => {
      soundManager.stopFuseSound();
    };
  }, []);

  const handleToggleMute = () => {
    const muted = soundManager.toggleMute();
    setIsMuted(muted);
  };

  // Ignition sequence
  const startIgnition = () => {
    if (crackerState !== 'idle') return;

    setCrackerState('lighting');
    setFuseProgress(0);
    soundManager.startFuseSound();

    let progress = 0;
    const interval = setInterval(() => {
      progress += 4;
      setFuseProgress(progress);

      if (progress >= 100) {
        clearInterval(interval);
        soundManager.stopFuseSound();
        triggerLaunchOrBoom();
      }
    }, 60);
  };

  const triggerLaunchOrBoom = () => {
    if (selectedCracker === 'rocket') {
      setCrackerState('launching');
      soundManager.playRocketWhistle();

      // Launch rocket on canvas as well
      setTimeout(() => {
        executeBoom(window.innerWidth / 2, window.innerHeight * 0.28);
      }, 1000);
    } else if (selectedCracker === 'anaar') {
      setCrackerState('launching');
      soundManager.playSparkleCrackles(soundManager.ctx?.currentTime || 0, 16);

      setTimeout(() => {
        executeBoom(window.innerWidth / 2, window.innerHeight * 0.45);
      }, 1500);
    } else if (selectedCracker === 'chakri') {
      setCrackerState('launching');
      soundManager.playSparkleCrackles(soundManager.ctx?.currentTime || 0, 20);

      setTimeout(() => {
        executeBoom(window.innerWidth / 2, window.innerHeight * 0.5);
      }, 1400);
    } else {
      // Bomb: instant dramatic boom with shake
      setCrackerState('launching');
      setTimeout(() => {
        executeBoom(window.innerWidth / 2, window.innerHeight * 0.55);
      }, 300);
    }
  };

  const executeBoom = (boomX, boomY) => {
    setCrackerState('boomed');
    setShakeScreen(true);
    setShowFlash(true);

    soundManager.playExplosionBoom(1.2);
    soundManager.playCelebrationChimes();

    // Trigger canvas particle explosion containing face
    onTriggerCanvasBurst({
      x: boomX,
      y: boomY,
      faceRatio: 0.65,
      count: 95
    });

    setTimeout(() => {
      setShowFlash(false);
    }, 450);

    setTimeout(() => {
      setShakeScreen(false);
    }, 700);
  };

  const resetCracker = () => {
    setCrackerState('idle');
    setFuseProgress(0);
  };

  return (
    <div className={`relative z-20 w-full max-w-4xl mx-auto px-4 py-4 flex flex-col items-center ${shakeScreen ? 'screen-shake' : ''}`}>
      {/* Screen flash on boom */}
      {showFlash && (
        <div className="fixed inset-0 bg-gradient-to-r from-amber-200 via-white to-yellow-100 pointer-events-none z-50 animate-boom-flash" />
      )}

      {/* Top Bar: Controls */}
      <div className="w-full flex items-center justify-between mb-4">
        <button
          onClick={onChangePhoto}
          className="flex items-center gap-1.5 text-xs font-medium text-amber-300 hover:text-white bg-amber-950/40 hover:bg-amber-900/60 border border-amber-500/30 px-3.5 py-2 rounded-xl transition backdrop-blur-md"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Change Photo
        </button>

        {/* Selected Face Avatar Badge */}
        {faceImageSrc && (
          <div className="flex items-center gap-2 bg-[#1b0c36]/80 border border-amber-400/40 rounded-full px-3 py-1 shadow-lg backdrop-blur-md">
            <div className="w-7 h-7 rounded-full overflow-hidden border border-yellow-300">
              <img src={faceImageSrc} alt="User Face" className="w-full h-full object-cover" />
            </div>
            <span className="text-xs font-semibold text-amber-200">
              {userName || 'Your Diwali Spark'}
            </span>
          </div>
        )}

        <button
          onClick={handleToggleMute}
          className="p-2 text-amber-300 hover:text-white bg-amber-950/40 border border-amber-500/30 rounded-xl transition backdrop-blur-md"
          title={isMuted ? 'Unmute Sound' : 'Mute Sound'}
        >
          {isMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4 text-amber-400" />}
        </button>
      </div>

      {/* Cracker Selector Pills */}
      {crackerState === 'idle' && (
        <div className="w-full max-w-2xl grid grid-cols-2 sm:grid-cols-4 gap-2 mb-6">
          {CRACKER_TYPES.map((c) => {
            const isSelected = selectedCracker === c.id;
            return (
              <button
                key={c.id}
                onClick={() => setSelectedCracker(c.id)}
                className={`p-3 rounded-2xl border transition-all text-left flex flex-col items-center justify-center text-center backdrop-blur-md ${
                  isSelected
                    ? 'bg-gradient-to-b from-amber-500/30 to-orange-500/20 border-yellow-400 text-yellow-200 shadow-lg shadow-amber-500/20 scale-105 ring-1 ring-yellow-400'
                    : 'bg-[#150a2b]/70 border-amber-500/20 text-amber-300/80 hover:border-amber-400/60 hover:text-amber-100'
                }`}
              >
                <span className="text-3xl mb-1">{c.icon}</span>
                <span className="font-bold text-xs">{c.name}</span>
                <span className="text-[10px] text-amber-400/70">{c.hindi}</span>
              </button>
            );
          })}
        </div>
      )}

      {/* Cracker Stage Visualizer */}
      <div
        ref={crackerAreaRef}
        className="relative w-full max-w-lg min-h-[380px] sm:min-h-[420px] rounded-3xl bg-gradient-to-b from-[#1b0c36]/90 via-[#130728]/95 to-[#0b0318]/95 border border-amber-500/30 backdrop-blur-xl shadow-2xl flex flex-col items-center justify-center p-6 overflow-hidden"
      >
        {/* Subtle Rangoli backdrop decoration */}
        <div className="absolute inset-0 opacity-10 pointer-events-none flex items-center justify-center">
          <svg className="w-80 h-80 animate-spin" style={{ animationDuration: '60s' }} viewBox="0 0 200 200">
            <circle cx="100" cy="100" r="90" fill="none" stroke="#FFD700" strokeWidth="2" strokeDasharray="8 6" />
            <circle cx="100" cy="100" r="70" fill="none" stroke="#FF8C00" strokeWidth="1.5" />
            <circle cx="100" cy="100" r="45" fill="none" stroke="#FFD700" strokeWidth="2" strokeDasharray="4 4" />
          </svg>
        </div>

        {/* State 1 & 2: IDLE or LIGHTING */}
        {crackerState !== 'boomed' && (
          <div className="relative flex flex-col items-center justify-center w-full">
            {/* Visual Cracker Model */}
            <div className={`relative transition-all duration-700 ${
              crackerState === 'launching'
                ? selectedCracker === 'rocket'
                  ? '-translate-y-[400px] scale-75 opacity-20'
                  : selectedCracker === 'anaar'
                  ? 'scale-110'
                  : 'scale-125 rotate-12'
                : 'translate-y-0 scale-100'
            }`}>

              {/* ROCKET MODEL */}
              {selectedCracker === 'rocket' && (
                <div className="relative flex flex-col items-center">
                  {/* Fuse with burning spark */}
                  <div className="relative w-1 h-14 bg-gradient-to-b from-stone-600 to-amber-700 -mb-1">
                    {/* Burn progress line */}
                    {crackerState === 'lighting' && (
                      <div
                        className="absolute bottom-0 w-full bg-orange-400"
                        style={{ height: `${fuseProgress}%` }}
                      />
                    )}
                    {/* Burning spark ember */}
                    {crackerState === 'lighting' && (
                      <div
                        className="absolute w-5 h-5 -left-2 rounded-full bg-yellow-300 animate-spark-burn shadow-lg shadow-orange-500"
                        style={{ bottom: `${fuseProgress}%` }}
                      >
                        <div className="absolute inset-0 bg-red-500 rounded-full animate-ping opacity-75" />
                      </div>
                    )}
                  </div>

                  {/* Rocket Body */}
                  <div className="relative w-16 h-36 rounded-t-xl bg-gradient-to-r from-red-700 via-amber-600 to-red-700 border-2 border-yellow-400 shadow-2xl flex flex-col items-center justify-between p-2 overflow-hidden">
                    {/* Decorative gold foil bands */}
                    <div className="w-full h-2 bg-yellow-400 shadow-sm" />
                    <div className="text-[10px] font-black uppercase text-yellow-300 tracking-tighter text-center leading-none">
                      DIWALI<br />SUPER<br />BOOM
                    </div>
                    <div className="w-full h-2 bg-yellow-400 shadow-sm" />

                    {/* Shimmer light on rocket */}
                    <div className="absolute -inset-full bg-gradient-to-r from-transparent via-white/20 to-transparent rotate-45 transform pointer-events-none" />
                  </div>

                  {/* Rocket Cone Tip */}
                  <div
                    className="w-0 h-0 border-l-[32px] border-l-transparent border-r-[32px] border-r-transparent border-b-[40px] border-b-yellow-400 -mt-44 filter drop-shadow(0 -4px 6px rgba(255,200,0,0.5))"
                  />

                  {/* Rocket Bamboo Stick */}
                  <div className="w-1.5 h-36 bg-amber-900 border-l border-amber-700 mt-2 rounded-b" />

                  {/* Rocket Launch Bottle Stand */}
                  <div className="w-10 h-16 bg-emerald-950/80 border border-emerald-500/40 rounded-t-lg -mt-16 -z-10 shadow-inner" />
                </div>
              )}

              {/* BOMB MODEL */}
              {selectedCracker === 'bomb' && (
                <div className="relative flex flex-col items-center">
                  {/* Fuse */}
                  <div className="relative w-1.5 h-12 bg-stone-500 -mb-2">
                    {crackerState === 'lighting' && (
                      <div
                        className="absolute w-5 h-5 -left-1.5 rounded-full bg-yellow-300 animate-spark-burn shadow-lg shadow-orange-500"
                        style={{ top: `${100 - fuseProgress}%` }}
                      >
                        <div className="absolute inset-0 bg-red-500 rounded-full animate-ping opacity-75" />
                      </div>
                    )}
                  </div>

                  {/* Jute Sutli Bomb Sphere */}
                  <div className={`relative w-28 h-28 rounded-3xl bg-gradient-to-tr from-emerald-900 via-green-800 to-emerald-700 border-4 border-green-600 shadow-2xl flex items-center justify-center transform ${
                    crackerState === 'launching' ? 'animate-ping' : ''
                  }`}>
                    {/* Jute string cross wraps */}
                    <div className="absolute inset-0 border-2 border-dashed border-amber-200/40 rounded-3xl" />
                    <div className="absolute w-full h-1 bg-amber-300/30 rotate-45" />
                    <div className="absolute w-full h-1 bg-amber-300/30 -rotate-45" />

                    {/* Red Label */}
                    <div className="bg-red-600 px-3 py-1 rounded shadow-lg border border-yellow-300 text-center">
                      <span className="text-[11px] font-black tracking-widest text-yellow-200">
                        555 BOOM
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* ANAAR (FLOWER POT) MODEL */}
              {selectedCracker === 'anaar' && (
                <div className="relative flex flex-col items-center">
                  {/* Glowing tip */}
                  <div className="relative w-4 h-6 -mb-1 flex justify-center">
                    {crackerState === 'lighting' && (
                      <div className="w-6 h-6 rounded-full bg-yellow-300 animate-spark-burn shadow-lg shadow-orange-500">
                        <div className="absolute inset-0 bg-red-500 rounded-full animate-ping opacity-75" />
                      </div>
                    )}
                    {crackerState === 'launching' && (
                      <div className="absolute -top-16 w-16 h-28 bg-gradient-to-t from-yellow-300 via-orange-500 to-transparent rounded-t-full filter blur-sm animate-pulse-glow" />
                    )}
                  </div>

                  {/* Conical Pot */}
                  <div
                    className="w-0 h-0 border-l-[46px] border-l-transparent border-r-[46px] border-r-transparent border-b-[90px] border-b-amber-800 filter drop-shadow(0 10px 15px rgba(0,0,0,0.6)) relative flex justify-center"
                  >
                    <div className="absolute -bottom-1 text-[9px] font-black text-amber-200 uppercase tracking-tighter">
                      ROYAL ANAAR
                    </div>
                  </div>
                  <div className="w-28 h-4 bg-amber-950 rounded-b-xl border-t border-amber-600 shadow" />
                </div>
              )}

              {/* CHAKRI MODEL */}
              {selectedCracker === 'chakri' && (
                <div className="relative flex flex-col items-center">
                  {/* Fuse */}
                  <div className="relative w-8 h-1.5 bg-stone-500 -mb-1">
                    {crackerState === 'lighting' && (
                      <div className="absolute right-0 w-4 h-4 rounded-full bg-yellow-300 animate-spark-burn shadow-lg shadow-orange-500" />
                    )}
                  </div>

                  {/* Wheel */}
                  <div className={`relative w-28 h-28 rounded-full border-4 border-yellow-400 bg-gradient-to-r from-red-600 via-yellow-500 to-blue-600 shadow-2xl flex items-center justify-center ${
                    crackerState === 'launching' ? 'animate-spin' : ''
                  }`} style={{ animationDuration: '0.2s' }}>
                    <div className="w-16 h-16 rounded-full border-2 border-dashed border-white bg-amber-900/60 flex items-center justify-center">
                      <span className="text-xl">🌀</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Spark Launch Fountain during anaar / chakri launch */}
            {crackerState === 'launching' && selectedCracker === 'anaar' && (
              <div className="absolute -top-10 text-yellow-300 animate-bounce text-2xl flex gap-2">
                <span>✨</span><span>🌟</span><span>✨</span>
              </div>
            )}

            {/* Action Bar */}
            <div className="mt-8 flex flex-col items-center gap-3">
              {crackerState === 'idle' ? (
                <button
                  onClick={startIgnition}
                  className="group relative inline-flex items-center gap-3 bg-gradient-to-r from-red-600 via-orange-500 to-amber-500 hover:from-red-500 hover:to-amber-400 text-white font-extrabold px-8 py-4 rounded-2xl shadow-xl shadow-orange-500/30 transform hover:scale-105 active:scale-95 transition-all text-lg uppercase tracking-wider"
                >
                  <Flame className="w-6 h-6 fill-yellow-300 text-yellow-300 animate-bounce" />
                  <span>Light Fuse & Boom!</span>
                  <Sparkles className="w-5 h-5 text-yellow-200 animate-spin" />
                </button>
              ) : crackerState === 'lighting' ? (
                <div className="flex flex-col items-center">
                  <div className="flex items-center gap-2 text-yellow-300 font-bold text-sm animate-pulse mb-1">
                    <Flame className="w-4 h-4 text-orange-400 animate-bounce" />
                    <span>Fuse Sizzling... Get Ready for BOOM!</span>
                  </div>
                  <div className="w-48 bg-stone-800 rounded-full h-2.5 overflow-hidden border border-amber-500/30">
                    <div
                      className="bg-gradient-to-r from-yellow-400 to-orange-500 h-full rounded-full transition-all duration-75"
                      style={{ width: `${fuseProgress}%` }}
                    />
                  </div>
                </div>
              ) : (
                <div className="text-amber-300 font-extrabold text-xl tracking-widest animate-ping">
                  💥 BOOOOOOM! 💥
                </div>
              )}
            </div>
          </div>
        )}

        {/* State 3: BOOMED & CELEBRATING */}
        {crackerState === 'boomed' && (
          <div className="relative flex flex-col items-center text-center py-2 animate-fade-in">
            {/* Grand Festive Centerpiece Face */}
            <div className="relative mb-5">
              {/* Spinning Rangoli Mandala Halo */}
              <div
                className="absolute -inset-6 rounded-full border-2 border-dashed border-yellow-400/80 animate-spin"
                style={{ animationDuration: '14s' }}
              />
              <div
                className="absolute -inset-10 rounded-full border border-orange-500/50 animate-spin"
                style={{ animationDuration: '22s', animationDirection: 'reverse' }}
              />

              {/* Pulsing Aura */}
              <div className="absolute -inset-4 bg-gradient-to-tr from-yellow-400 via-orange-500 to-amber-300 rounded-full blur-xl opacity-75 animate-pulse" />

              {/* Uploaded Face Frame */}
              <div className="relative w-36 h-36 md:w-44 md:h-44 rounded-full p-2 bg-gradient-to-b from-yellow-300 via-amber-500 to-orange-600 shadow-2xl">
                <img
                  src={faceImageSrc}
                  alt="Celebrant Face"
                  className="w-full h-full object-cover rounded-full border-4 border-white shadow-inner"
                />

                {/* Floating Diya Badge */}
                <div className="absolute -top-3 -right-2 text-3xl animate-bounce">
                  🪔
                </div>
                <div className="absolute -bottom-2 -left-2 text-2xl animate-bounce" style={{ animationDelay: '0.3s' }}>
                  ✨
                </div>
              </div>
            </div>

            {/* Festive Text */}
            <h3 className="text-3xl md:text-4xl font-extrabold text-gold-gradient mb-1">
              शुभ दीपावली!
            </h3>
            <p className="text-lg md:text-xl font-bold text-amber-200 mb-2">
              Happy Diwali, {userName || 'Friend'}!
            </p>
            <p className="text-xs md:text-sm text-amber-300/80 max-w-sm mb-6">
              May the festive sparks bring endless happiness, wealth, and vibrant illumination to your life!
            </p>

            {/* Click to launch notice */}
            <div className="bg-amber-500/20 border border-yellow-400/40 rounded-xl px-4 py-2 mb-6 text-xs text-yellow-300 flex items-center gap-2 animate-pulse">
              <span>🎆</span>
              <span>Click anywhere on screen to launch more face rockets!</span>
            </div>

            {/* Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-3">
              <button
                onClick={resetCracker}
                className="flex items-center gap-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-black font-extrabold px-6 py-3 rounded-2xl shadow-lg transition transform hover:scale-105 active:scale-95 text-sm uppercase tracking-wider"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Boom Another Cracker</span>
              </button>

              <button
                onClick={() => {
                  onTriggerCanvasBurst({
                    x: Math.random() * window.innerWidth * 0.7 + window.innerWidth * 0.15,
                    y: window.innerHeight * 0.3,
                    faceRatio: 0.75,
                    count: 100
                  });
                  soundManager.playExplosionBoom(1.1);
                  soundManager.playCelebrationChimes();
                }}
                className="flex items-center gap-2 bg-[#251042] hover:bg-[#34165d] border border-amber-400/40 text-amber-200 font-bold px-5 py-3 rounded-2xl shadow transition transform hover:scale-105 active:scale-95 text-sm"
              >
                <Sparkles className="w-4 h-4 text-yellow-400" />
                <span>Shower More Face Sparks</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
