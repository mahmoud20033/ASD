import React, { createContext, useContext, useState } from 'react';

const MissionContext = createContext();

export const MissionProvider = ({ children }) => {
    const [missionStatuses, setMissionStatuses] = useState({});

    const updateMissionStatus = (missionId, status) => {
        setMissionStatuses(prev => ({
            ...prev,
            [missionId]: status
        }));
    };

    return (
        <MissionContext.Provider value={{ missionStatuses, updateMissionStatus }}>
            {children}
        </MissionContext.Provider>
    );
};

export const useMissionContext = () => useContext(MissionContext);
