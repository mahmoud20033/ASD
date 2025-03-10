import React from 'react';
import { ListGroup, Button } from 'react-bootstrap';
import { useMissionContext } from '../context/MissionContext';

const Missions = () => {
    // const { updateMissionStatus } = useMissionContext();

    // const checkPermission = (action) => {
    //     const userRole = localStorage.getItem('userRole') || 'user';
    //     const permissions = {
    //         admin: ['complete', 'delete'],
    //         supervisor: ['complete'],
    //         user: []
    //     };
    //     return permissions[userRole]?.includes(action) || false;
    // };

    // // Get missions from localStorage
    // const getMissions = () => {
    //     const missions = localStorage.getItem('missions');
    //     return missions ? JSON.parse(missions) : [];
    // };

    // const handleStatus = (missionId, status) => {
    //     const missions = getMissions();
    //     const updatedMissions = missions.map(mission =>
    //         mission.id === missionId ? { ...mission, status } : mission
    //     );
    //     localStorage.setItem('missions', JSON.stringify(updatedMissions));
    //     updateMissionStatus(missionId, status);
    // };

    // const handleDelete = (missionId) => {
    //     const missions = getMissions();
    //     const updatedMissions = missions.filter(mission => mission.id !== missionId);
    //     localStorage.setItem('missions', JSON.stringify(updatedMissions));
    //     // Force re-render by updating state
    //     updateMissionStatus(missionId, 'deleted');
    // };

    // const handleComplete = (mission) => {
    //     // Send to Jobs component via localStorage
    //     const jobs = localStorage.getItem('jobs') || '[]';
    //     const parsedJobs = JSON.parse(jobs);
    //     parsedJobs.push({
    //         id: mission.id,
    //         fromPage: mission.fromPage,
    //         text: mission.text,
    //         completedAt: new Date().toISOString()
    //     });
    //     localStorage.setItem('Jobs', JSON.stringify(parsedJobs));

    //     // Update mission status
    //     handleStatus(mission.id, 'completed');
    // };

    return (
        <div></div>
        // <div className="p-4">
        //     <h3>Received Missions</h3>
        //     <ListGroup>
        //         {getMissions().map(mission => (
        //             <ListGroup.Item key={mission.id}>
        //                 <div>
        //                     <strong>From: {mission.fromPage}</strong>
        //                     <p>{mission.text}</p>
        //                     <div className="d-flex gap-2">
        //                         <Button
        //                             variant="success"
        //                             size="sm"
        //                             onClick={() => handleComplete(mission)}
        //                             disabled={!checkPermission('complete')}
        //                         >
        //                             Complete
        //                         </Button>
        //                         <Button
        //                             variant="danger"
        //                             size="sm"
        //                             onClick={() => handleStatus(mission.id, 'incomplete')}
        //                         >
        //                             Incomplete
        //                         </Button>
        //                         <Button
        //                             variant="secondary"
        //                             size="sm"
        //                             onClick={() => handleDelete(mission.id)}
        //                             disabled={!checkPermission('delete')}
        //                         >
        //                             Delete
        //                         </Button>
        //                     </div>
        //                     {mission.status && (
        //                         <div className="mt-2">
        //                             <small className={`text-${mission.status === 'completed' ? 'success' : 'danger'}`}>
        //                             Status: {mission.status}
        //                         </small>
        //                         </div>
        //                     )}
        //             </div>
        //             </ListGroup.Item>
        //         ))}
        // </ListGroup>
        // </div >
    );
};

export default Missions;
