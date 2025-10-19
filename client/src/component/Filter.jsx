import React from 'react';

const Filter = () => {
  return (
    // Main container using standard Tailwind colors for background and border
    <div className="bg-white p-4 rounded-lg shadow-lg border border-gray-200 mb-8 text-huddle-text-light">
     <div className='grid grid-cols-1 md:grid-cols-5 gap-4 '>
        <div className="flex-row-2 items-baseline space-x-3">
        <label className="text-sm font-medium text-gray-800">
          Game
        </label>
        <select
          id="game-select"
          className="w-full bg-gray-50 border border-gray-300 rounded-lg p-2"
        >
          <option value="" disabled selected>Select a game...</option>
          
          <option>Valorant</option>
        </select>
      </div>
       <div className="flex-row-2 items-baseline space-x-3">
        <label className="text-sm font-medium text-gray-800">
          Region
        </label>
        <select
          id="game-select"
          className="w-full bg-gray-50 border border-gray-300 rounded-lg p-2"
        >
          <option value="" disabled selected>Select a region...</option>
          
          <option>Asia</option>
        </select>
      </div>
        
     </div>
    </div>
  );
};

export default Filter;

