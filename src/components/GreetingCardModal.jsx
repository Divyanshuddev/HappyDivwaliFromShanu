import React, { useRef } from 'react';
import { Download, X, Sparkles, Share2 } from 'lucide-react';

export default function GreetingCardModal({ isOpen, onClose, faceImageSrc, userName }) {
  const cardCanvasRef = useRef(null);

  if (!isOpen) return null;

  const downloadCard = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 800;
    canvas.height = 1000;
    const ctx = canvas.getContext('2d');

    // Background gradient
    const bgGrad = ctx.createLinearGradient(0, 0, 0, 1000);
    bgGrad.addColorStop(0, '#100624');
    bgGrad.addColorStop(0.5, '#1e0a3c');
    bgGrad.addColorStop(1, '#0a0316');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, 800, 1000);

    // Decorative ornate border
    ctx.strokeStyle = '#FFD700';
    ctx.lineWidth = 6;
    ctx.strokeRect(25, 25, 750, 950);
    ctx.strokeStyle = '#FF8C00';
    ctx.lineWidth = 2;
    ctx.strokeRect(35, 35, 730, 930);

    // Header text
    ctx.fillStyle = '#FFD700';
    ctx.font = 'bold 34px serif';
    ctx.textAlign = 'center';
    ctx.fillText('✨ शुभ दीपावली ✨', 400, 100);

    ctx.font = 'bold 50px serif';
    ctx.fillStyle = '#FFF2A8';
    ctx.fillText('HAPPY DIWALI', 400, 160);

    // Draw user face in center circular frame
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = faceImageSrc;
    img.onload = () => {
      ctx.save();
      ctx.beginPath();
      ctx.arc(400, 420, 180, 0, Math.PI * 2);
      ctx.closePath();
      ctx.clip();

      const aspect = img.width / img.height;
      let sx = 0, sy = 0, sw = img.width, sh = img.height;
      if (aspect > 1) {
        sw = img.height;
        sx = (img.width - sw) / 2;
      } else {
        sh = img.width;
        sy = (img.height - sh) / 2;
      }
      ctx.drawImage(img, sx, sy, sw, sh, 220, 240, 360, 360);
      ctx.restore();

      // Gold frame around face
      ctx.strokeStyle = '#FFD700';
      ctx.lineWidth = 10;
      ctx.beginPath();
      ctx.arc(400, 420, 185, 0, Math.PI * 2);
      ctx.stroke();

      // Festive Greeting text
      ctx.fillStyle = '#FFD700';
      ctx.font = 'bold 36px sans-serif';
      ctx.fillText(userName ? `Greetings from ${userName}` : 'May Your Life Glow With Happiness & Wealth!', 400, 680);

      ctx.fillStyle = '#FFE082';
      ctx.font = '22px sans-serif';
      ctx.fillText('May the festival of lights bring triumph of light over darkness,', 400, 730);
      ctx.fillText('good over evil, and knowledge over ignorance.', 400, 765);

      // Bottom Diyas text
      ctx.font = '40px sans-serif';
      ctx.fillText('🪔 🎆 🪔', 400, 840);

      // Trigger download
      const link = document.createElement('a');
      link.download = `Happy-Diwali-${userName || 'Wishes'}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    };
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-md bg-[#180a33] border-2 border-amber-400/50 rounded-3xl p-6 shadow-2xl text-center">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-amber-300 hover:text-white rounded-full bg-white/5"
        >
          <X className="w-5 h-5" />
        </button>

        <h3 className="text-2xl font-bold text-gold-gradient mb-4">
          Personalized Diwali Card
        </h3>

        {/* Card preview */}
        <div className="w-full bg-gradient-to-b from-[#210c44] to-[#0c0318] border border-amber-400/40 rounded-2xl p-5 mb-5 shadow-inner">
          <div className="w-28 h-28 mx-auto rounded-full p-1 bg-gradient-to-tr from-yellow-400 to-orange-500 mb-3 shadow-lg">
            <img
              src={faceImageSrc}
              alt="Face"
              className="w-full h-full object-cover rounded-full border-2 border-white"
            />
          </div>
          <p className="text-xl font-bold text-yellow-300">
            Happy Diwali!
          </p>
          <p className="text-sm text-amber-200 mt-1">
            {userName ? `Warm wishes from ${userName}` : 'Shubh Deepavali to you & your loved ones!'}
          </p>
        </div>

        <button
          onClick={downloadCard}
          className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-black font-extrabold py-3 rounded-2xl shadow-xl flex items-center justify-center gap-2 text-sm uppercase tracking-wider transition"
        >
          <Download className="w-4 h-4" />
          <span>Download Festive Greeting Card</span>
        </button>
      </div>
    </div>
  );
}
