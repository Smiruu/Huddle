import React, {useState,useEffect} from 'react';

import Filter from "../component/Filter.jsx";
import Card from "../component/Card.jsx";
import { useHuddle } from '../hooks/useHuddle.jsx';
import { socket } from '../socket/socket.js';


const Dashboard = () => {

    const {huddle, huddleLoading, huddleError, getHuddles} = useHuddle()

    const [liveHuddles, setLiveHuddles] = useState(huddle);

    useEffect(() => {
        getHuddles()
    }, [])
    
    useEffect(() => {
        setLiveHuddles(huddle);
    }, [huddle]);

    useEffect(() => {
        const onLobbyCountUpdate = (data) => {
            setLiveHuddles(currentHuddles => currentHuddles.map(h => {
                if(h.id == data.lobbyId) {
                    return{...h, participant_count:data.count}
                }
                return h
            }))
        }

        socket.on('lobby_count_update', onLobbyCountUpdate)

        return () => {
            socket.off('lobby_count_update', onLobbyCountUpdate);
        };
    },[])

    return (
        <div className="p-4 md:p-8 max-w-7xl mx-auto">
            <Filter />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {liveHuddles.map(huddle => (
                    <Card
                        key={huddle.id}
                        id={huddle.id}
                        game={huddle.game}
                        title={huddle.name}
                        author={huddle.owner_username}
                        skillLevel={huddle.skillLevel}
                        max = {huddle.max_participants}
                        count={huddle.participant_count}
                        tags={huddle.tags}
                    />
                    
                ))}
            </div>
        </div>
    );
};

export default Dashboard;
