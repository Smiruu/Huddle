import React, {useEffect} from 'react';
// Added .jsx to imports for clarity
import Filter from "../component/Filter.jsx";
import Card from "../component/Card.jsx";
import { useHuddle } from '../hooks/useHuddle.jsx';
// This dummy data is now correctly inside the Dashboard file
const Dashboard = () => {

    const {huddle, huddleLoading, huddleError, getHuddles} = useHuddle()

    useEffect(() => {
        getHuddles()
    }, [])
    
    return (
        <div className="p-4 md:p-8 max-w-7xl mx-auto">
            <Filter />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {huddle.map(huddle => (
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
