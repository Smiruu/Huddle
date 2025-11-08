import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { socket } from '../socket/socket.js'; // Make sure this path is correct
import { MessagePanel } from '../component/Lobby/Messages.jsx';

const Lobby = () => {
  const { id: lobbyId } = useParams();
  const navigate = useNavigate();
  const [participants, setParticipants] = useState([]);

  const participantCount = participants.length;
  
  // 1. Define the placeholder logic
  const placeholderBase = "https://placehold.co/100x100/111827/FF7A59?text=";

  useEffect(() => {
    socket.emit('join_lobby', { lobbyId: lobbyId });

    const onJoinedSuccess = ({ lobbyId: joinedLobbyId, participants }) => {
      if (joinedLobbyId == lobbyId) {
        console.log('Successfully joined lobby, participants:', participants);
        setParticipants(participants);
      }
    };

    const onUserJoined = (newUser) => {
      console.log('A new user joined:', newUser);
      setParticipants((current) => {
        // Prevent duplicates if socket events arrive out of order
        if (current.find(p => p.user_id === newUser.user_id)) {
          return current;
        }
        return [...current, newUser];
      });
    };

    const onUserLeft = ({ userId }) => {
      console.log('A user left:', userId);
      setParticipants((current) =>
        current.filter(p => p.user_id !== userId)
      );
    };

    socket.on('joined_lobby_success', onJoinedSuccess);
    socket.on('user_joined', onUserJoined);
    socket.on('user_left', onUserLeft);

    return () => {
      // When we leave this page, tell the server we left the lobby
      socket.emit('leave_lobby', { lobbyId });

      socket.off('joined_lobby_success', onJoinedSuccess);
      socket.off('user_joined', onUserJoined);
      socket.off('user_left', onUserLeft);
    };
  }, [lobbyId]); // Only run this effect if the lobbyId from the URL changes

  const handleLeaveClick = () => {
    navigate('/');
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 dark:bg-gray-900">
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-xl dark:bg-gray-800">
        <h1 className="mb-2 text-center text-3xl font-bold text-gray-900 dark:text-gray-100">
          Lobby {lobbyId}
        </h1>
        <h3 className="mb-6 text-center text-lg text-gray-600 dark:text-gray-400">
          Participants: ({participantCount})
        </h3>
        
        {/* Participants List */}
        <ul className="mb-8 h-48 max-h-60 space-y-3 overflow-y-auto px-1 py-1">
          {participants.map((p) => {
            // 3. Apply the same logic as useProfile here
            let displayUrl;
            if (p.profiles.avatar_url) {
              displayUrl = p.profiles.avatar_url;
            } else {
              const initial = p.profiles.username?.charAt(0)?.toUpperCase() || '?';
              displayUrl = `${placeholderBase}${initial}`;
            }

            return (
              // 4. Render the list item with the image
              <li 
                key={p.user_id} 
                className="flex items-center space-x-3 rounded-lg bg-gray-100 p-3 dark:bg-gray-700"
              >
                <img
                  src={displayUrl}
                  alt={p.profiles.username}
                  className="h-10 w-10 rounded-full object-cover"
                />
                <span className="font-medium text-gray-800 dark:text-gray-200">
                  {p.profiles.username}
                </span>
              </li>
            );
          })}
        </ul>

        <button
          onClick={handleLeaveClick}
          className="w-full rounded-lg bg-red-600 py-3 text-base font-bold text-white transition hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-800"
        >
          Leave Lobby
        </button>
        
      </div>
      <MessagePanel lobbyId = {lobbyId} />
    </div>
  );
};

export default Lobby;