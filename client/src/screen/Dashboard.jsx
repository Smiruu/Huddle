import React from 'react';
// Added .jsx to imports for clarity
import Filter from "../component/Filter.jsx";
import Card from "../component/Card.jsx";

// This dummy data is now correctly inside the Dashboard file
const dummyHuddles = [
    {
        id: 1,
        game: 'Valorant',
        type: 'Competitive',
        title: 'Chill ranked climb, need one more!',
        author: 'AcePlayer',
        skillLevel: 'Diamond',
        slots: { filled: 4, total: 5 },
        tags: ['Competitive', 'MicRequired'],
    },
    {
        id: 2,
        game: 'Apex Legends',
        type: 'Casual',
        title: 'Looking for a chill squad for pubs',
        author: 'LegendLover',
        skillLevel: 'Gold',
        slots: { filled: 2, total: 3 },
        tags: ['Casual', 'NoMic'],
    },
    // ... other huddles
    {
        id: 4,
        game: 'League of Legends',
        type: 'ARAM',
        title: 'ARAM party for evening! All welcome',
        author: 'NexusBreaker',
        skillLevel: 'Any',
        slots: { filled: 4, total: 5 },
        tags: ['ARAM', 'Fun'],
    }
];

const Dashboard = () => {
    return (
        <div className="p-4 md:p-8 max-w-7xl mx-auto">
            <Filter />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {dummyHuddles.map(huddle => (
                    <Card
                        key={huddle.id}
                        game={huddle.game}
                        type={huddle.type}
                        title={huddle.title}
                        author={huddle.author}
                        skillLevel={huddle.skillLevel}
                        slots={huddle.slots}
                        tags={huddle.tags}
                    />
                ))}
            </div>
        </div>
    );
};

export default Dashboard;
