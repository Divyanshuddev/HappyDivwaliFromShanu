import React, { useState, useRef } from 'react';
import { Upload, Camera, Sparkles, User, RefreshCw, Check } from 'lucide-react';


export default function PhotoUploader({ onPhotoSelected, initialPhoto, onProceed }) {
  const [photo, setPhoto] = useState(initialPhoto || null);
  const [userName, setUserName] = useState('');
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);

  const handleFile = (file) => {
    if (!file || !file.type.startsWith('image/')) {
      alert('Please upload a valid image file (PNG, JPG, WEBP).');
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target.result;
      setPhoto(result);
      onPhotoSelected(result, userName);
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };


  return (
    <div className="relative z-20 max-w-lg w-full mx-auto px-4 py-6">
      {/* Glow effect behind card */}
      <div className="absolute -inset-1 bg-gradient-to-r from-amber-500 via-orange-500 to-yellow-400 rounded-3xl blur-xl opacity-40 animate-pulse-glow" />

      <div className="relative bg-[#160c29]/90 border border-amber-500/40 rounded-3xl p-6 md:p-8 backdrop-blur-xl shadow-2xl text-center">
        {/* Festive Header Accent */}
        <div className="flex items-center justify-center gap-2 mb-2">
          <span className="text-2xl animate-bounce">🪔</span>
          <span className="text-xs uppercase tracking-widest text-amber-300 font-semibold bg-amber-500/20 px-3 py-1 rounded-full border border-amber-400/30">
            Step 1 • Face Upload
          </span>
          <span className="text-2xl animate-bounce" style={{ animationDelay: '0.2s' }}>✨</span>
        </div>

        <h2 className="text-2xl md:text-3xl font-bold text-gold-gradient mb-2">
          Upload Your Face for the Diwali Boom!
        </h2>
        <p className="text-amber-200/80 text-sm mb-6">
          Your photo will burst into thousands of dazzling sparks when the cracker explodes!
        </p>

        {/* Upload Dropzone / Preview */}
        {!photo ? (
          <div
            onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
            onDragLeave={() => setDragActive(false)}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-2xl p-8 cursor-pointer transition-all duration-300 flex flex-col items-center justify-center ${
              dragActive
                ? 'border-yellow-400 bg-amber-500/20 scale-[1.02]'
                : 'border-amber-500/40 hover:border-amber-400 bg-amber-950/20 hover:bg-amber-900/30'
            }`}
          >
            <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-amber-600 to-yellow-400 flex items-center justify-center shadow-lg mb-4 text-black animate-pulse">
              <Upload className="w-9 h-9" />
            </div>
            <p className="font-semibold text-amber-100 text-base mb-1">
              Click to browse or drag & drop photo
            </p>
            <p className="text-xs text-amber-300/60">
              Supports JPG, PNG, WEBP • Max 10MB
            </p>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  handleFile(e.target.files[0]);
                }
              }}
            />
          </div>
        ) : (
          <div className="flex flex-col items-center">
            {/* Circular Preview with Ornate Gold Ring */}
            <div className="relative group">
              <div className="absolute -inset-2 bg-gradient-to-r from-yellow-400 via-orange-500 to-amber-500 rounded-full blur-md opacity-80 group-hover:opacity-100 transition animate-spin" style={{ animationDuration: '8s' }} />
              <div className="relative w-36 h-36 rounded-full p-1.5 bg-gradient-to-b from-yellow-300 to-amber-600 shadow-2xl">
                <img
                  src={photo}
                  alt="Uploaded face preview"
                  className="w-full h-full object-cover rounded-full border-2 border-white/70"
                />
              </div>

              {/* Sparkle badge */}
              <div className="absolute -bottom-1 -right-1 bg-amber-500 text-black p-2 rounded-full shadow-lg border-2 border-white animate-bounce">
                <Sparkles className="w-5 h-5 fill-current" />
              </div>
            </div>

            <p className="text-emerald-400 text-sm font-medium mt-4 flex items-center gap-1.5">
              <Check className="w-4 h-4" /> Face Ready for Cracker Sparkles!
            </p>

            <button
              onClick={() => fileInputRef.current?.click()}
              className="mt-2 text-xs text-amber-300/70 hover:text-amber-200 underline flex items-center gap-1"
            >
              <RefreshCw className="w-3 h-3" /> Change Photo
            </button>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  handleFile(e.target.files[0]);
                }
              }}
            />
          </div>
        )}

        {/* Name input */}
        <div className="mt-5 text-left">
          <label className="block text-xs font-medium text-amber-300/90 mb-1.5">
            Your Name / Family Greeting (Optional)
          </label>
          <div className="relative">
            <input
              type="text"
              placeholder="e.g. Divyanshu & Family"
              value={userName}
              onChange={(e) => {
                setUserName(e.target.value);
                if (photo) onPhotoSelected(photo, e.target.value);
              }}
              className="w-full bg-[#0a0518]/80 border border-amber-500/40 rounded-xl px-4 py-2.5 text-amber-100 placeholder-amber-400/40 focus:outline-none focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 text-sm"
            />
          </div>
        </div>


        {/* Action Button */}
        {photo && (
          <button
            onClick={() => onProceed && onProceed()}
            className="w-full mt-6 bg-gradient-to-r from-amber-500 via-orange-500 to-yellow-400 hover:from-amber-400 hover:to-orange-400 text-black font-bold py-3.5 px-6 rounded-2xl shadow-xl transform hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 text-base uppercase tracking-wider"
          >
            <span>Proceed to Ignite Cracker</span>
            <span className="text-xl">🚀</span>
          </button>
        )}
      </div>
    </div>
  );
}
