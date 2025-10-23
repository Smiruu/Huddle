import React from 'react';

const Filter = () => {
  return (
    // Added dark mode classes for bg, border, and text
    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 mb-8 text-huddle-text-light dark:text-huddle-text-dark">
      
      {/* Title - dark mode text already handled by parent */}
      <h3 className="text-lg font-semibold mb-3">Find your Huddle</h3>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        
        {/* Game Select */}
        <div className="flex flex-col space-y-1">
          <label htmlFor="game-select" className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Game
          </label>
          <select
            id="game-select"
            className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 rounded-lg p-2 focus:ring-huddle-blue focus:border-huddle-blue dark:focus:ring-huddle-orange dark:focus:border-huddle-orange"
          >
            <option value="" disabled selected>
              Select a game...
            </option>
            <option>Valorant</option>
            <option>League of Legends</option>
            <option>Apex Legends</option>
            <option>Overwatch 2</option>
          </select>
        </div>

        {/* Region Select */}
        <div className="flex flex-col space-y-1">
          <label htmlFor="region-select" className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Region
          </label>
          <select
            id="region-select"
            className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 rounded-lg p-2 focus:ring-huddle-blue focus:border-huddle-blue dark:focus:ring-huddle-orange dark:focus:border-huddle-orange"
          >
            <option value="" disabled selected>
              Select a region...
            </option>
            <option>Asia</option>
            <option>North America</option>
            <option>Europe</option>
            <option>Latin America</option>
          </select>
        </div>

        {/* Skill Select */}
        <div className="flex flex-col space-y-1">
          <label htmlFor="skill-select" className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Skill Level
          </label>
          <select
            id="skill-select"
            className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 rounded-lg p-2 focus:ring-huddle-blue focus:border-huddle-blue dark:focus:ring-huddle-orange dark:focus:border-huddle-orange"
          >
            <option value="" disabled selected>
              Any skill...
            </option>
            <option>Casual</option>
            <option>Bronze</option>
            <option>Silver</option>
            <option>Gold</option>
            <option>Platinum</option>
            <option>Diamond+</option>
          </select>
        </div>

        {/* Group Size Select */}
        <div className="flex flex-col space-y-1">
          <label htmlFor="size-select" className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Group Size
          </label>
          <select
            id="size-select"
            className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 rounded-lg p-2 focus:ring-huddle-blue focus:border-huddle-blue dark:focus:ring-huddle-orange dark:focus:border-huddle-orange"
          >
            <option value="" disabled selected>
              Any size...
            </option>
            <option>Duo (2)</option>
            <option>Trio (3)</option>
            <option>Quad (4)</option>
            <option>Full (5+)</option>
          </select>
        </div>

        {/* Find Button */}
        <div className="flex flex-col justify-end h-full">
         
          <button
            className="w-full bg-huddle-orange text-white font-semibold py-2 px-4 rounded-lg shadow
                       hover:bg-huddle-blue transition-colors duration-200"
          >
            Find
          </button>
        </div>

      </div>
    </div>
  );
};

export default Filter;

