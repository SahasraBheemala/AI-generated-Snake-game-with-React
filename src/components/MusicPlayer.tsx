import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipForward, SkipBack, Volume2, VolumeX, Music } from 'lucide-react';

const TRACKS = [
  { 
    id: 1, 
    title: 'Neon Nights', 
    artist: 'AI Synthwave',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    duration: '6:12'
  },
  { 
    id: 2, 
    title: 'Cyber City', 
    artist: 'AI Synthwave',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
    duration: '7:05'
  },
  { 
    id: 3, 
    title: 'Digital Dream', 
    artist: 'AI Synthwave',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
    duration: '5:44'
  },
];

export default function MusicPlayer() {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(0.5);
  const [isMuted, setIsMuted] = useState(false);
  
  const audioRef = useRef<HTMLAudioElement>(null);
  const currentTrack = TRACKS[currentTrackIndex];

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  useEffect(() => {
    if (isPlaying && audioRef.current) {
      audioRef.current.play().catch(e => {
        console.error("Audio play failed:", e);
        setIsPlaying(false);
      });
    }
  }, [currentTrackIndex, isPlaying]);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch(e => console.error("Audio play failed:", e));
      }
      setIsPlaying(!isPlaying);
    }
  };

  const nextTrack = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % TRACKS.length);
  };

  const prevTrack = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + TRACKS.length) % TRACKS.length);
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const current = audioRef.current.currentTime;
      const duration = audioRef.current.duration;
      if (duration) {
        setProgress((current / duration) * 100);
      }
    }
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (audioRef.current) {
      const bounds = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - bounds.left;
      const percentage = x / bounds.width;
      audioRef.current.currentTime = percentage * audioRef.current.duration;
      setProgress(percentage * 100);
    }
  };

  return (
    <div className="bg-black p-6 border-2 border-magenta-glitch shadow-[4px_4px_0px_#00FFFF] w-full font-vt uppercase">
      <div className="flex items-center justify-between mb-6 border-b border-cyan-glitch/30 pb-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-black border-2 border-magenta-glitch flex items-center justify-center relative overflow-hidden">
            <div className="absolute inset-0 bg-magenta-glitch opacity-20 animate-pulse" />
            <Music className="w-6 h-6 text-cyan-glitch" />
          </div>
          <div>
            <h3 className="text-cyan-glitch font-pixel text-[10px] leading-tight mb-2">
              {currentTrack.title.toUpperCase()}
            </h3>
            <p className="text-magenta-glitch text-sm tracking-widest">ID: {currentTrack.artist.toUpperCase()}</p>
          </div>
        </div>
        
        {/* Visualizer blocks */}
        <div className="flex items-end gap-1 h-8">
          {[1, 2, 3, 4, 5].map((i) => (
            <div 
              key={i} 
              className="w-2 bg-cyan-glitch transition-all duration-75"
              style={{ 
                height: isPlaying ? `${Math.random() * 100}%` : '10%',
                animationDelay: `${i * 0.1}s`,
              }}
            />
          ))}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-6">
        <div 
          className="h-4 bg-black border border-cyan-glitch cursor-pointer relative"
          onClick={handleProgressClick}
        >
          <div 
            className="h-full bg-magenta-glitch transition-all duration-100 ease-linear"
            style={{ width: `${progress}%` }}
          />
          <div className="absolute inset-0 flex justify-between px-2 items-center text-[10px] font-pixel text-white mix-blend-difference pointer-events-none">
            <span>{Math.floor(progress)}%</span>
            <span>STREAM_ACTIVE</span>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button 
            onClick={prevTrack}
            className="p-2 text-cyan-glitch hover:bg-cyan-glitch hover:text-black transition-none border border-transparent hover:border-cyan-glitch"
          >
            <SkipBack className="w-5 h-5" />
          </button>
          
          <button 
            onClick={togglePlay}
            className="w-12 h-12 bg-black border-2 border-magenta-glitch flex items-center justify-center text-magenta-glitch hover:bg-magenta-glitch hover:text-black transition-none"
          >
            {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 ml-1" />}
          </button>
          
          <button 
            onClick={nextTrack}
            className="p-2 text-cyan-glitch hover:bg-cyan-glitch hover:text-black transition-none border border-transparent hover:border-cyan-glitch"
          >
            <SkipForward className="w-5 h-5" />
          </button>
        </div>

        {/* Volume */}
        <div className="flex items-center gap-2 group">
          <button 
            onClick={() => setIsMuted(!isMuted)}
            className="text-magenta-glitch hover:bg-magenta-glitch hover:text-black p-1 transition-none"
          >
            {isMuted || volume === 0 ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
          </button>
          <input 
            type="range" 
            min="0" 
            max="1" 
            step="0.01" 
            value={isMuted ? 0 : volume}
            onChange={(e) => {
              setVolume(parseFloat(e.target.value));
              setIsMuted(false);
            }}
            className="w-24 h-2 bg-black border border-cyan-glitch appearance-none cursor-pointer accent-magenta-glitch"
          />
        </div>
      </div>

      <audio 
        ref={audioRef}
        src={currentTrack.url}
        onTimeUpdate={handleTimeUpdate}
        onEnded={nextTrack}
      />
    </div>
  );
}
