import { useState } from 'react';
import { useHuddle } from './useHuddle'; // Make sure this path is correct
import { useNavigate } from 'react-router-dom';

/**
 * This hook manages all the state and logic
 * for the CreateHuddle modal form.
 */
export const useCreateHuddleForm = () => {
  // --- All state lives here ---
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [huddleName, setHuddleName] = useState('');
  const [description, setDescription] = useState('');
  const [game, setGame] = useState('Valorant');
  const [skillLevel, setSkillLevel] = useState('Any');
  const [maxParticipants, setMaxParticipants] = useState(10);
  const [tagsInput, setTagsInput] = useState('');

  // --- Logic hooks ---
  const { huddleLoading, huddleError, createHuddle, clearHuddleError } = useHuddle();
  const navigate = useNavigate();

  // --- All event handlers live here ---
  const openModal = () => {
    setHuddleName('');
    setDescription('');
    setGame('Valorant');
    setSkillLevel('Any');
    setMaxParticipants(10);
    setTagsInput('');
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
      .split(',')
      .map(tag => tag.trim())
      .filter(tag => tag.length > 0);

    // Call the hook's create function
    const newHuddle = await createHuddle(
      {
        name: huddleName,
        description,
        game,
        skillLevel,
        maxParticipants,
        tags
      },
      () => {
        // Success callback
        closeModal();
      }
    );

    // After creation, navigate to the new lobby
    if (newHuddle && newHuddle.id) {
      navigate(`/lobby/${newHuddle.id}`);
    }
  };

  // --- Return everything the component needs ---
  return {
    isModalOpen,
    huddleName, setHuddleName,
    description, setDescription,
    game, setGame,
    skillLevel, setSkillLevel,
    maxParticipants, setMaxParticipants,
    tagsInput, setTagsInput,
    huddleLoading,
    huddleError,
    openModal,
    closeModal,
    handleSubmit
  };
};
