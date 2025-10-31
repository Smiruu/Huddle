// src/screen/Lobby.jsx

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { socket } from '../socket/socket.js'; // Make sure this path is correct

const Lobby = () => {
  const { id: lobbyId } = useParams(); // Gets 'id' from /lobby/:id
  const navigate = useNavigate();
  const [participants, setParticipants] = useState([]);

  const participantCount = participants.length;

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

  // This function is now just for the button
  const handleLeaveClick = () => {
    // We don't need to emit here, the 'return' in useEffect
    // will handle it when the component unmounts.
    navigate('/'); // Just navigate
  };

  return (
    <div>
      <h1>Lobby {lobbyId}</h1>
      <h3>Participants: ({participantCount})</h3>
      <ul>
        {participants.map((p) => (
          <li key={p.user_id}>{p.profiles.username}</li>
        ))}
      </ul>

      <button
        onClick={handleLeaveClick}
        className="bg-red-500 text-white font-bold py-2 px-6 rounded-lg"
      >
        Leave Lobby
      </button>
    </div>
  );
};

export default Lobby;