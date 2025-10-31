import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';


const Card = ({ id,game, title, author, skillLevel, max, count, tags }) => {
    const authorInitial = author.charAt(0).toUpperCase();
    const navigate = useNavigate();
    const handleJoin = (e)=>{
        e.stopPropagation();

navigate(`/lobby/${id}`);
    }
    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-xl border border-gray-200 dark:border-gray-700 text-huddle-text-light dark:text-huddle-text-dark flex flex-col h-full transition-all duration-300 hover:-translate-y-2 cursor-pointer">
            <div className="p-4 pb-2 flex justify-between items-start border-b border-gray-100 dark:border-gray-700">
                <div>
                    <span className="text-huddle-orange font-semibold text-sm">{game}</span>
                </div>
                <div className="text-right">
                    <span className="text-xs text-gray-500 dark:text-gray-400 block">Slots</span>
                    <span className="text-xl font-bold text-gray-800 dark:text-gray-200">{count}/{max}</span>
                </div>
            </div>
            <div className="p-4 flex-grow">
                <h3 className="font-bold text-xl mb-3 text-gray-900 dark:text-gray-100 leading-tight">{title}</h3>
                <div className="flex items-center text-sm text-gray-700 dark:text-gray-300">
                    <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-semibold text-xs mr-2">
                        {authorInitial}
                    </span>
                    <span className="mr-1">Hosted by</span>
                    <span className="font-semibold text-gray-900 dark:text-gray-100 mr-2">{author}</span>

                    <span className="text-huddle-orange font-semibold">{skillLevel}</span>
                </div>
            </div>
            <div className="p-4 pt-0 flex justify-between items-center">
                <div className="flex flex-wrap gap-2">
                    {tags?.map(tag => (
                        <span key={tag} className="bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs font-semibold px-2.5 py-1 rounded-full">
                            #{tag}
                        </span>
                    ))}
                </div>
                <button 
                onClick={handleJoin}
                className="bg-huddle-orange text-white font-bold py-2 px-6 rounded-lg shadow hover:bg-huddle-blue transition-colors duration-200">
                    Join
                </button>
            </div>
        </div>
    );
};

export default Card;

