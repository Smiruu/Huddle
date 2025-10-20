import React from 'react';

// Simplified Diamond icon for skill level
const DiamondIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 inline-block text-huddle-orange -mt-0.5" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
    </svg>
);

const Card = ({ game, type, title, author, skillLevel, slots, tags }) => {
    // Fallback for avatar (though not displayed in new design, kept for potential future use)
    const authorInitial = author.charAt(0).toUpperCase();

    return (
        <div className="bg-white rounded-lg shadow-md border border-gray-200 text-huddle-text-light flex flex-col h-full">
            {/* Card Header */}
            <div className="p-4 pb-2 flex justify-between items-start border-b border-gray-100">
                <div>
                    <span className="text-huddle-orange font-semibold text-sm">{game}{type && ` - ${type}`}</span>
                </div>
                <div className="text-right">
                    <span className="text-xs text-gray-500 block">Slots</span>
                    <span className="text-xl font-bold text-gray-800">{slots.filled}/{slots.total}</span>
                </div>
            </div>
            
            <div className="p-4 flex-grow">
                {/* Card Title */}
                <h3 className="font-bold text-xl mb-3 text-gray-900 leading-tight">{title}</h3>
                
                {/* Author Info and Skill Level */}
                <div className="flex items-center text-sm text-gray-700">
                    <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-gray-200 text-gray-700 font-semibold text-xs mr-2">
                        {authorInitial}
                    </span>
                    <span className="mr-1">Hosted by</span>
                    <span className="font-semibold text-gray-900 mr-2">{author}</span>
                    <DiamondIcon />
                    <span className="text-huddle-orange font-semibold">{skillLevel}</span>
                </div>
            </div>

            {/* Card Footer */}
            <div className="p-4 pt-0 flex justify-between items-center">
                <div className="flex flex-wrap gap-2">
                    {tags.map(tag => (
                        <span key={tag} className="bg-gray-100 text-gray-600 text-xs font-semibold px-2.5 py-1 rounded-full">
                            #{tag}
                        </span>
                    ))}
                </div>
                <button className="bg-huddle-orange text-white font-bold py-2 px-6 rounded-lg shadow hover:bg-huddle-blue transition-colors duration-200">
                    Join
                </button>
            </div>
        </div>
    );
};

export default Card;

