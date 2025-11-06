import React, { useState, useRef } from "react";
import { useProfile } from "../hooks/useProfile"; // 1. Import your hook
import { Camera, Edit2, X, Check } from "lucide-react"; // Import icons

const Profile = () => {
  // 2. Get all profile data and actions from the hook
  const {
    profile,
    displayPictureUrl,
    updateUsername,
    updateProfilePicture,
    isProfileUpdating,
    error,
  } = useProfile();

  // 3. State for managing the username edit mode
  const [isEditingUsername, setIsEditingUsername] = useState(false);
  const [newUsername, setNewUsername] = useState(profile?.username || "");

  // 4. Ref for the hidden file input
  const fileInputRef = useRef(null);

  // 5. Handle loading state
  if (!profile) {
    // A simple loading spinner
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-100 dark:bg-gray-900">
        <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-t-2 border-huddle-orange"></div>
      </div>
    );
  }

  // Handler for file selection
  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (file) {
      await updateProfilePicture(file);
    }
  };

  // Handler to trigger file input click
  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  // Handler for saving the new username
  const handleUsernameSave = async () => {
    if (newUsername.trim() && newUsername !== profile.username) {
      await updateUsername(newUsername.trim());
    }
    setIsEditingUsername(false);
  };

  // 6. Render the styled profile card with edit features
  return (
    <div className="flex min-h-screen justify-center bg-gray-100 dark:bg-gray-900 pt-16 sm:pt-24">
      <div className="w-full max-w-3xl px-4">
        <div className="flex flex-col items-center rounded-lg bg-white p-6 pb-8 dark:bg-gray-800 shadow-md">
          
          {/* Profile Image with Edit Overlay */}
          <div className="relative">
            <img
              className="h-32 w-32 rounded-full object-cover shadow-lg"
              src={displayPictureUrl}
              alt={`${profile.username}'s profile`}
            />
            {/* Hidden File Input */}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
              accept="image/png, image/jpeg, image/gif"
              disabled={isProfileUpdating}
            />
            {/* Camera Icon Overlay Button */}
            <button
              onClick={handleImageClick}
              disabled={isProfileUpdating}
              className="absolute bottom-1 right-1 flex h-9 w-9 items-center justify-center rounded-full bg-gray-900/70 text-white transition-colors hover:bg-gray-900/90 disabled:cursor-not-allowed disabled:bg-gray-500"
              aria-label="Change profile picture"
            >
              <Camera size={18} />
            </button>
          </div>

          {/* Username or Edit Input */}
          <div className="mt-6 flex h-10 items-center justify-center space-x-2">
            {!isEditingUsername ? (
              // Display Username
              <>
                <h1 className="truncate text-3xl font-bold text-gray-900 dark:text-gray-100">
                  {profile.username}
                </h1>
                <button
                  onClick={() => {
                    setIsEditingUsername(true);
                    setNewUsername(profile.username);
                  }}
                  disabled={isProfileUpdating}
                  className="flex-shrink-0 rounded-md p-2 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-100"
                  aria-label="Edit username"
                >
                  <Edit2 size={20} />
                </button>
              </>
            ) : (
              // Edit Username Form
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={newUsername}
                  onChange={(e) => setNewUsername(e.target.value)}
                  className="rounded-md border-gray-300 px-3 py-2 text-lg text-gray-900 shadow-sm focus:border-huddle-orange focus:ring-huddle-orange dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
                  autoFocus
                />
                <button
                  onClick={handleUsernameSave}
                  disabled={isProfileUpdating}
                  className="flex-shrink-0 rounded-md bg-green-600 p-2 text-white transition-colors hover:bg-green-700 disabled:bg-gray-500"
                  aria-label="Save username"
                >
                  <Check size={20} />
                </button>
                <button
                  onClick={() => setIsEditingUsername(false)}
                  disabled={isProfileUpdating}
                  className="flex-shrink-0 rounded-md bg-red-600 p-2 text-white transition-colors hover:bg-red-700 disabled:bg-gray-500"
                  aria-label="Cancel edit username"
                >
                  <X size={20} />
                </button>
              </div>
            )}
          </div>

          {/* Loading and Error Messages */}
          {isProfileUpdating && (
            <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">
              Saving...
            </p>
          )}
          {error && (
            <p className="mt-4 text-sm text-red-600 dark:text-red-500">
              Error: {error}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;