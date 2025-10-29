import React, { useState } from 'react';
import { Plus, X } from 'lucide-react';
import ReactDOM from 'react-dom'
import { useHuddle } from '../../hooks/useHuddle'; 

const CreateHuddle = ({ isMobile = false }) => {
  // --- Local UI State ---
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [huddleName, setHuddleName] = useState('');
  const [description, setDescription] = useState('');
  // 2. Changed state to 'game'
  const [game, setGame] = useState('Valorant'); // Default value
  const [skillLevel, setSkillLevel] = useState('Any'); // Default value

  // 3. Use the hook to get all logic and state
  const { huddleLoading, huddleError, createHuddle, clearHuddleError } = useHuddle();

  // --- UI Functions ---
  const openModal = () => {
    setHuddleName(''); 
    setDescription('');

    setGame('Valorant');
    setSkillLevel('Any');
    clearHuddleError();
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!huddleName) return;

    // 5. Call the hook's create function with 'game'
    await createHuddle(
      { name: huddleName, description, game, skillLevel },
      () => {
        closeModal();
      }
    );
  };
  
  // Dynamic class for desktop vs. mobile button
  const buttonClass = isMobile
    ? "w-full bg-huddle-orange text-white font-semibold py-2 px-5 rounded-lg shadow-md hover:bg-huddle-blue transition-all duration-200 flex items-center justify-center space-x-2 cursor-pointer"
    : "bg-huddle-orange text-white font-semibold py-2 px-5 rounded-lg shadow-md hover:bg-huddle-blue transition-all duration-200 flex items-center space-x-2 cursor-pointer";

  const inputStyles = "mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-huddle-orange focus:border-huddle-orange text-huddle-text-light dark:text-huddle-text-dark";
  const labelStyles = "block text-sm font-medium text-huddle-text-light dark:text-huddle-text-dark";

  return (
    <>
      <button onClick={openModal} className={buttonClass}>
        <Plus size={20} />
        <span>Post a Huddle</span>
      </button>

      {isModalOpen && ReactDOM.createPortal (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center  backdrop-blur-sm"
          onClick={closeModal} 
        >
          <div
            className="bg-huddle-light dark:bg-huddle-dark w-full max-w-md rounded-lg shadow-xl p-6 mx-4 relative"
            onClick={(e) => e.stopPropagation()} 
          >
            <div className="flex justify-between items-center pb-4 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-xl font-semibold text-huddle-text-light dark:text-huddle-text-dark">
                Create a Huddle
              </h3>
              <button
                onClick={closeModal}
                className="p-1 rounded-full text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 dark:text-gray-300"
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="mt-4 space-y-4">
              <div>
                <label htmlFor="huddleName" className={labelStyles}>
                  Huddle Name
                </label>
                <input
                  type="text"
                  id="huddleName"
                  value={huddleName}
                  onChange={(e) => setHuddleName(e.target.value)}
                  className={inputStyles}
                  placeholder="What's the topic?"
                  autoFocus
                />
              </div>

              <div>
                <label htmlFor="description" className={labelStyles}>
                  Description (Optional)
                </label>
                <textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className={inputStyles}
                  rows="3"
                  placeholder="Any details to add?"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* 6. Changed to 'game' */}
                <div>
                  <label htmlFor="game" className={labelStyles}>
                    Game
                  </label>
                  <select
                    id="game"
                    value={game}
                    onChange={(e) => setGame(e.target.value)}
                    className={inputStyles}
                  >
                    <option>Valorant</option>
                    <option>League of Legends</option>
                    <option>Apex Legends</option>
                    <option>Other</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="skillLevel" className={labelStyles}>
                    Skill Level
                  </label>
                  <select
                    id="skillLevel"
                    value={skillLevel}
                    onChange={(e) => setSkillLevel(e.target.value)}
                    className={inputStyles}
                  >
                    <option>Any</option>
                    <option>Casual</option>
                    <option>Competitive</option>
                    <option>Pro</option>
                  </select>
                </div>
              </div>

              {huddleError && (
                <p className="text-sm text-red-600 dark:text-red-500">
                  {huddleError}
                </p>
              )}

              <div className="flex justify-end pt-4">
                <button
                  type="submit"
                  disabled={huddleLoading || !huddleName}
                  className="bg-huddle-orange text-white font-semibold py-2 px-5 rounded-lg shadow-md hover:bg-huddle-blue transition-all duration-200 flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {huddleLoading ? (
                    'Creating...'
                  ) : (
                    'Create Huddle'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>, document.getElementById('modal-root')
      )}
    </>
  );
};

export default CreateHuddle;

