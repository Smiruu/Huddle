import React, { useState } from 'react';
import { Plus, X } from 'lucide-react';
import ReactDOM from 'react-dom'
import { useHuddle } from '../../hooks/useHuddle'; 

const CreateHuddle = ({ isMobile = false }) => {
  // --- Local UI State ---
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [huddleName, setHuddleName] = useState('');
  const [description, setDescription] = useState('');
  const [game, setGame] = useState('Valorant'); 
  const [skillLevel, setSkillLevel] = useState('Any');
  const [maxParticipants, setMaxParticipants] = useState(10); // <-- ADDED: Default to 10
  const [tagsInput, setTagsInput] = useState('');             // <-- ADDED: State for the tag input string

  // --- Hook ---
  const { huddleLoading, huddleError, createHuddle, clearHuddleError } = useHuddle();

  // --- UI Functions ---
  const openModal = () => {
    setHuddleName(''); 
    setDescription('');
    setGame('Valorant');
    setSkillLevel('Any');
    setMaxParticipants(10);    // <-- ADDED: Reset on open
    setTagsInput('');          // <-- ADDED: Reset on open
    clearHuddleError();
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!huddleName) return;

    // Process the tags string into an array
    const tags = tagsInput
      .split(',')                     // Split by comma
      .map(tag => tag.trim())         // Trim whitespace
      .filter(tag => tag.length > 0); // Remove any empty strings

    // Call the hook's create function with all fields
    await createHuddle(
      { 
        name: huddleName, 
        description, 
        game, 
        skillLevel,
        maxParticipants, // <-- ADDED
        tags             // <-- ADDED
      },
      () => {
        closeModal();
      }
    );
  };
  
  // --- Styles (no changes) ---
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
            {/* --- Header (no change) --- */}
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
              {/* --- Huddle Name (no change) --- */}
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

              {/* --- Description (no change) --- */}
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

              {/* --- Game & Skill Grid (no change) --- */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

              {/* --- NEW GRID for Max Participants & Tags --- */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="maxParticipants" className={labelStyles}>
                    Max Participants
                  </label>
                  <input
                    type="number"
                    id="maxParticipants"
                    value={maxParticipants}
                    // Cast to number
                    onChange={(e) => setMaxParticipants(Number(e.target.value))}
                    className={inputStyles}
                    min="2"
                    max="100" // Set a reasonable max
                  />
                </div>

                <div>
                  <label htmlFor="tags" className={labelStyles}>
                    Tags (comma-separated)
                  </label>
                  <input
                    type="text"
                    id="tags"
                    value={tagsInput}
                    onChange={(e) => setTagsInput(e.target.value)}
                    className={inputStyles}
                    placeholder="e.g. casual, ranked, mic-required"
                  />
                </div>
              </div>

              {/* --- Error & Submit Button (no change) --- */}
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