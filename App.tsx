import React, { useState, useCallback, useEffect } from 'react';
import { RotatingTree, Star } from './components/TreeParts';
import Snowfall from './components/Snowfall';
import { GiftBox } from './components/GiftBox';
import { playBellSound, toggleChristmasMusic } from './utils/audioUtils';
import { GiftState } from './types';
import { Gem, Heart, Clover } from 'lucide-react';

const INITIAL_GIFTS: GiftState[] = [
  { id: '1', isOpen: false, x: -60, y: 10, rotation: -5, content: { id: 'g1', name: 'Diamond', icon: Gem, color: '#fff' } },
  { id: '2', isOpen: false, x: 0, y: -5, rotation: 0, content: { id: 'g2', name: 'Love', icon: Heart, color: '#fff' } },
  { id: '3', isOpen: false, x: 60, y: 20, rotation: 5, content: { id: 'g3', name: 'Luck', icon: Clover, color: '#fff' } },
];

export default function App() {
  const [gifts, setGifts] = useState<GiftState[]>(INITIAL_GIFTS);
  const [isLightsOn, setIsLightsOn] = useState(false);

  // Toggle Music and Visuals
  const handleToggleLights = () => {
    const newState = !isLightsOn;
    setIsLightsOn(newState);
    toggleChristmasMusic(newState);
    
    if (newState) {
       document.body.classList.add('golden-mode');
    } else {
       document.body.classList.remove('golden-mode');
    }
  };

  const handleToggleGift = (id: string) => {
    playBellSound(); 
    setGifts(prev => prev.map(g => {
        if (g.id === id) {
            return { ...g, isOpen: !g.isOpen };
        }
        return g;
    }));
  };

  const handleInteract = useCallback(() => {
    playBellSound();
  }, []);

  // Stop music on unmount
  useEffect(() => {
    return () => toggleChristmasMusic(false);
  }, []);

  // Tree Dimensions tailored for the globe
  const TREE_H = 420;
  const TREE_W = 280;

  return (
    <div className={`relative w-full h-screen overflow-hidden flex flex-col items-center justify-center transition-colors duration-1000 ${isLightsOn ? "bg-[#1a0500]" : "bg-black"}`}>
      
      {/* --- The Crystal Globe --- */}
      <div className="relative z-10 scale-75 md:scale-100">
        
        {/* Glass Sphere */}
        <div className="relative w-[500px] h-[500px] rounded-full globe-shadow border border-white/20 bg-black/20 backdrop-blur-[1px] overflow-hidden z-20">
          
          {/* Internal Shine/Reflection layers */}
          <div className="glass-shine"></div>
          <div className="glass-shine-2"></div>

          {/* Environment Inside Globe - Snow falls only when lights are on */}
          <div className={`absolute inset-0 z-0 transition-opacity duration-1000 ${isLightsOn ? 'opacity-100' : 'opacity-0'}`}>
             {isLightsOn && <Snowfall />}
          </div>

          {/* Tree Container inside Globe */}
          <div className="absolute inset-x-0 bottom-[-40px] h-full flex justify-center items-end pb-8">
             <div className="relative w-full h-full flex justify-center items-end">
                <svg 
                  viewBox="-300 0 600 700" 
                  className="w-full h-[90%] overflow-visible pointer-events-none" 
                  style={{ pointerEvents: 'visiblePainted' }}
                >
                  {/* Moved tree up (translate Y from 100 to 50) to separate from gifts */}
                  <g transform="translate(0, 50)">
                     <RotatingTree 
                        height={TREE_H} 
                        width={TREE_W} 
                        isGolden={isLightsOn} 
                        onInteract={handleInteract}
                     />
                     <g transform="translate(0, 0) scale(1.5)">
                       <Star isGolden={isLightsOn} />
                     </g>
                  </g>
                </svg>

                {/* Gifts - Positioned absolutely within the globe */}
                {gifts.map(gift => (
                  <GiftBox key={gift.id} gift={gift} onOpen={handleToggleGift} />
                ))}
             </div>
          </div>
        </div>

        {/* --- The Base --- */}
        {/* Changed from -mt-8 to -mt-3 to increase visual distance slightly */}
        <div className="relative -mt-3 flex flex-col items-center z-10">
           {/* Top Rim of Base */}
           <div className="w-[420px] h-6 bg-gradient-to-r from-gray-700 via-gray-400 to-gray-700 rounded-[50%] shadow-lg"></div>
           
           {/* Main Base Body */}
           <div className="w-[380px] h-24 bg-gradient-to-b from-gray-800 to-black relative flex items-center justify-center shadow-2xl"
                style={{ clipPath: 'polygon(0 0, 100% 0, 95% 100%, 5% 100%)' }}>
               
               {/* Wood/Material Texture Overlay */}
               <div className="absolute inset-0 opacity-30 bg-[url('https://www.transparenttextures.com/patterns/wood-pattern.png')]"></div>

               {/* Plaque / Switch Area */}
               <div className="relative z-20 flex flex-col items-center justify-center gap-2">
                   
                   {/* The Switch Button */}
                   <button 
                      onClick={handleToggleLights}
                      className={`group relative w-12 h-12 rounded-full border-4 transition-all duration-500 shadow-xl
                        ${isLightsOn 
                            ? 'border-yellow-600 bg-yellow-900/80 animate-glow' 
                            : 'border-gray-500 bg-gray-900'}`}
                   >
                      {/* Inner Light */}
                      <div className={`absolute inset-2 rounded-full transition-all duration-500
                          ${isLightsOn ? 'bg-yellow-400 shadow-[0_0_15px_#facc15]' : 'bg-gray-700'}`}>
                      </div>
                      
                      {/* Click Feedback Ripple */}
                      <div className="absolute inset-0 rounded-full border border-white/20 scale-125 opacity-0 group-active:scale-100 group-active:opacity-100 transition-all"></div>
                   </button>
                   
                   <span className="text-[10px] uppercase tracking-[0.3em] text-gray-400 font-serif opacity-60">
                      {isLightsOn ? 'On' : 'Off'}
                   </span>
               </div>
           </div>

           {/* Bottom Base Foot */}
           <div className="w-[400px] h-4 bg-gradient-to-r from-gray-900 via-gray-600 to-gray-900 rounded-full -mt-2 shadow-[0_10px_30px_rgba(0,0,0,0.8)]"></div>
        </div>

      </div>

    </div>
  );
}