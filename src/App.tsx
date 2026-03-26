/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import SnakeGame from './components/SnakeGame';
import MusicPlayer from './components/MusicPlayer';

export default function App() {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-4 font-vt relative overflow-hidden crt-flicker">
      <div className="static-noise" />
      <div className="scanline" />
      
      <div className="z-10 flex flex-col items-center w-full max-w-5xl screen-tear">
        <h1 
          className="text-3xl md:text-5xl font-pixel mb-12 text-white glitch-text tracking-tighter"
          data-text="SYS_OVERRIDE//SNAKE.EXE"
        >
          SYS_OVERRIDE//SNAKE.EXE
        </h1>
        
        <div className="flex flex-col md:flex-row gap-8 items-center md:items-start w-full justify-center">
          <div className="w-full max-w-md">
            <SnakeGame />
          </div>
          <div className="w-full max-w-sm flex flex-col gap-6">
            <MusicPlayer />
            
            <div className="bg-black p-6 border-2 border-magenta-glitch shadow-[4px_4px_0px_#00FFFF] relative">
              <div className="absolute top-0 left-0 w-full h-1 bg-magenta-glitch animate-pulse" />
              <h2 className="text-cyan-glitch font-pixel text-sm mb-4">OPERATIONAL_PARAMETERS</h2>
              <ul className="text-white text-xl space-y-3 font-vt">
                <li className="flex items-start gap-2">
                  <span className="text-magenta-glitch">]</span>
                  <span>ENGAGE_AUDIO_STREAM_DURING_EXECUTION.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-magenta-glitch">]</span>
                  <span>INPUT_VECTOR: W_A_S_D || ARROWS.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-magenta-glitch">]</span>
                  <span>INTERRUPT_SIGNAL: SPACEBAR.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-magenta-glitch">]</span>
                  <span>CONSUME_MAGENTA_DATA_PACKETS_TO_EXPAND.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
