import React, { useState } from 'react';
import FireworksCanvas from './components/FireworksCanvas';
import PhotoUploader from './components/PhotoUploader';
import InteractiveCracker from './components/InteractiveCracker';
import DiyaDecoration from './components/DiyaDecoration';
import GreetingCardModal from './components/GreetingCardModal';
import { Sparkles, Download, Volume2, VolumeX } from 'lucide-react';
import { soundManager } from './utils/audio';

export default function App() {
  const [photo, setPhoto] = useState(null);
  const [userName, setUserName] = useState('');
  const [stage, setStage] = useState('upload'); // 'upload' | 'cracker'
  const [canvasBurstTrigger, setCanvasBurstTrigger] = useState(null);
  const [showCardModal, setShowCardModal] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  const handlePhotoSelected = (photoData, name) => {
    setPhoto(photoData);
    if (name !== undefined) setUserName(name);
  };

  const handleProceedToCracker = () => {
    if (photo) {
      setStage('cracker');
      soundManager.init();
    }
  };

  const triggerCanvasBurst = (config) => {
    setCanvasBurstTrigger({
      ...config,
      timestamp: Date.now()
    });
  };

  const toggleSound = () => {
    const muted = soundManager.toggleMute();
    setIsMuted(muted);
  };

  return (
    <div className="relative min-h-screen w-full bg-[#0a0518] text-amber-50 flex flex-col justify-between overflow-x-hidden selection:bg-amber-500 selection:text-black">
      {/* Dynamic Starry Night Sky Background Gradient */}
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#1d0b38] via-[#0f0421] to-[#05020c] pointer-events-none z-0" />

      {/* Decorative Traditional Toran & Flickering Corner Diyas */}
      <DiyaDecoration />

      {/* 60FPS High-Performance Firework Particle Canvas (Renders Face Sparks) */}
      <FireworksCanvas
        faceImageSrc={photo}
        triggerBurst={canvasBurstTrigger}
      />

      {/* Top Header */}
      <header className="relative z-30 pt-6 pb-2 px-4 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-amber-500/20 via-orange-500/20 to-amber-500/20 border border-amber-400/30 text-amber-300 text-xs font-semibold tracking-wider uppercase mb-3 backdrop-blur-md">
          <Sparkles className="w-3.5 h-3.5 text-yellow-300 animate-spin" />
          <span>Interactive Festival of Lights Celebration</span>
          <Sparkles className="w-3.5 h-3.5 text-yellow-300 animate-spin" />
        </div>

        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-gold-gradient tracking-tight drop-shadow-md">
          ✨ Happy Diwali from Shivam ✨
        </h1>
        <p className="text-sm sm:text-base text-amber-200/80 max-w-xl mx-auto mt-2 font-medium">
          Upload your face photo, light up the festival cracker, and watch the sparkling boom shower your face across the sky!
        </p>

        {/* Global Quick Action Bar */}
        <div className="flex items-center justify-center gap-3 mt-3">
          <button
            onClick={toggleSound}
            className="inline-flex items-center gap-1.5 text-xs bg-[#190a30]/80 hover:bg-[#251044] border border-amber-500/30 text-amber-300 px-3 py-1.5 rounded-full transition shadow backdrop-blur-sm"
          >
            {isMuted ? <VolumeX className="w-3.5 h-3.5 text-red-400" /> : <Volume2 className="w-3.5 h-3.5 text-amber-400" />}
            <span>{isMuted ? 'Sound Muted' : 'Sound ON'}</span>
          </button>

          {photo && (
            <button
              onClick={() => setShowCardModal(true)}
              className="inline-flex items-center gap-1.5 text-xs bg-gradient-to-r from-amber-500/20 to-orange-500/20 hover:from-amber-500/30 hover:to-orange-500/30 border border-amber-400/40 text-amber-200 px-3.5 py-1.5 rounded-full transition shadow backdrop-blur-sm"
            >
              <Download className="w-3.5 h-3.5 text-yellow-300" />
              <span>Diwali Card</span>
            </button>
          )}
        </div>
      </header>

      {/* Main Content Area */}
      <main className="relative z-20 flex-1 flex flex-col items-center justify-center px-4 py-4">
        {stage === 'upload' ? (
          <PhotoUploader
            initialPhoto={photo}
            onPhotoSelected={handlePhotoSelected}
            onProceed={handleProceedToCracker}
          />
        ) : (
          <InteractiveCracker
            faceImageSrc={photo}
            userName={userName}
            onTriggerCanvasBurst={triggerCanvasBurst}
            onChangePhoto={() => setStage('upload')}
          />
        )}
      </main>

      {/* Footer Info */}
      <footer className="relative z-20 py-4 px-4 text-center text-xs text-amber-400/60 flex flex-col sm:flex-row items-center justify-center gap-3 backdrop-blur-sm">
        <span>🪔 Wishing you a joyful, prosperous & safe Deepavali! 🪔</span>
        <span className="hidden sm:inline">•</span>
        <span>Click on the sky anytime to launch personalized face rockets!</span>
      </footer>

      {/* Personalized Greeting Card Modal */}
      <GreetingCardModal
        isOpen={showCardModal}
        onClose={() => setShowCardModal(false)}
        faceImageSrc={photo}
        userName={userName}
      />
    </div>
  );
}
