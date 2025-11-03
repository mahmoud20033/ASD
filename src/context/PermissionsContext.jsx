import React, { createContext, useContext, useState, useEffect } from 'react';
import { useUser } from './UserContext';

const PermissionsContext = createContext();

export const PermissionsProvider = ({ children }) => {
    const [permissions, setPermissions] = useState({});
    const { user } = useUser();

    useEffect(() => {
        // Fetch permissions when user logs in
        if (user) {
            fetchPermissions();
        }
    }, [user]);

    const fetchPermissions = async () => {
        try {
            // Replace with your API call
            const response = await fetch('/api/permissions');
            const data = await response.json();
            setPermissions(data);
        } catch (error) {
            console.error('Error fetching permissions:', error);
        }
    };

    const hasPermission = (pageId) => {
        if (!user?.role) return false;
        return permissions[user.role]?.[pageId] || false;
    };

    return (
        <PermissionsContext.Provider value={{ permissions, hasPermission, setPermissions }}>
            {children}
        </PermissionsContext.Provider>
    );
};

export const usePermissions = () => useContext(PermissionsContext); 