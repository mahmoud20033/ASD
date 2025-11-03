import React, { createContext, useContext, useState } from 'react';

// Create context for user management
const UserContext = createContext();

export const UserProvider = ({ children }) => {
    // State for managing users
    const [users, setUsers] = useState([]);

    // State for managing inventory items
    const [inventory, setInventory] = useState([]);

    // Add a new user to the system
    const addUser = (user) => {
        setUsers(prev => [...prev, user]);
    };

    // Delete user from the system
    const deleteUser = (email) => {
        setUsers(prev => prev.filter(user => user.email !== email));
    };

    // Update general user information
    const updateUserInfo = (email, updates) => {
        setUsers(prev => prev.map(user =>
            user.email === email ? { ...user, ...updates } : user
        ));
    };

    // Update inventory item details
    const updateInventoryItem = (id, updates) => {
        setInventory(prev => prev.map(item =>
            item.id === id ? { ...item, ...updates } : item
        ));
    };

    // Delete item from inventory
    const deleteInventoryItem = (id) => {
        setInventory(prev => prev.filter(item => item.id !== id));
    };

    return (
        <UserContext.Provider value={{
            users,
            addUser,
            deleteUser,
            updateUserInfo,
            updateInventoryItem,
            deleteInventoryItem
        }}>
            {children}
        </UserContext.Provider>
    );
};

// Custom hook for accessing user context
export const useUsers = () => useContext(UserContext);
