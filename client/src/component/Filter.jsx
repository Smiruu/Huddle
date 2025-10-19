import React from 'react';

const Filter = () => {
  return (
    // Main container using standard Tailwind colors for background and border
    <div className="bg-white p-4 rounded-lg shadow-lg border border-gray-200 mb-8 text-huddle-text-light">
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-center">
        
        {/* Game Selector */}
        <div className="md:col-span-2">
          <label htmlFor="game-select" className="block text-sm font-medium text-gray-600 mb-1">
            Game
          </label>
          <select 
            id="game-select" 
            className="w-full bg-huddle-light border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-huddle-orange focus:border-huddle-orange transition"
          >
            <option>Valorant</option>
            <option>Apex Legends</option>
            <option>League of Legends</option>
            <option>Overwatch 2</option>
          </select>
        </div>

        {/* Region Selector */}
        <div>
          <label htmlFor="region-select" className="block text-sm font-medium text-gray-600 mb-1">
            Region
          </label>
          <select 
            id="region-select" 
            className="w-full bghuddle-light border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-huddle-orange focus:border-huddle-orange transition"
          >
            <option>Asia</option>
            <option>North America</option>
            <option>Europe</option>
          </select>
        </div>
        
        {/* Rank Selector */}
        <div>
          <label htmlFor="rank-select" className="block text-sm font-medium text-gray-600 mb-1">
            Rank
          </label>
          <select 
            id="rank-select" 
            className="w-full bg-[--color-huddle-light] border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-[--color-huddle-orange] focus:border-[--color-huddle-orange] transition"
          >
            <option>Any Rank</option>
            <option>Iron - Gold</option>
            <option>Platinum - Diamond</option>
            <option>Ascendant+</option>
          </select>
        </div>
        
        {/* Search Tags Input */}
        <div className="relative">
          <label htmlFor="tags-search" className="block text-sm font-medium text-gray-600 mb-1">
            Search Tags
          </label>
          <input 
            type="text" 
            id="tags-search" 
            placeholder="#Competitive, #Chill..." 
            className="w-full bg-[--color-huddle-light] border border-gray-300 rounded-lg p-2 pl-8 focus:ring-2 focus:ring-[--color-huddle-orange] focus:border-[--color-huddle-orange] transition"
          />
          {/* Search Icon SVG */}
          <div className="absolute inset-y-0 left-0 flex items-center pl-2.5 pt-7 pointer-events-none">
             <svg className="w-4 h-4 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
               <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
             </svg>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Filter;

