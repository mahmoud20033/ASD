import React, { createContext, useContext, useState, useEffect } from 'react';

// Default admin account with full permissions
const adminAccount = {
    username: 'admin',
    password: 'admin123',
    role: 'manager',
    permissions: {
        Dashboard: true,
        Manager: true,
        Store_Supervisor: true,
        Foreman_Supervisor: true,
        Workers: true,
        Scrapstore: true,
        Rawmaterial: true,
        Suppliers: true,
        Clients: true,
        Inventory: true,
        Management: true
    }
};

// Create context for user management
const UserContext = createContext();

export const UserProvider = ({ children }) => {
    // State for managing users, initialized from localStorage
    const [users, setUsers] = useState(() => {
        const savedUsers = localStorage.getItem('users');
        if (!savedUsers) {
            // Initialize with empty array instead of admin account
            localStorage.setItem('users', JSON.stringify([]));
            return [];
        }
        return JSON.parse(savedUsers);
    });

    // State for managing inventory items
    const [inventory, setInventory] = useState(() => {
        const savedInventory = localStorage.getItem('inventory');
        return savedInventory ? JSON.parse(savedInventory) : [];
    });

    // Event listener for localStorage changes to keep state in sync
    useEffect(() => {
        const handleStorageChange = (e) => {
            if (e.key === 'users') {
                const newUsers = JSON.parse(e.newValue);
                setUsers(newUsers);
            }
        };

        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, []);

    // Add a new user to the system
    const addUser = (user) => {
        setUsers(prev => {
            const newUsers = [...prev, user];
            localStorage.setItem('users', JSON.stringify(newUsers));
            return newUsers;
        });
    };

    // Update permissions for a specific user
    const updateUserPermissions = (email, permissions) => {
        setUsers(prev => {
            const newUsers = prev.map(user =>
                user.email === email ? { ...user, permissions } : user
            );
            localStorage.setItem('users', JSON.stringify(newUsers));
            return newUsers;
        });
    };

    // Get default permissions based on user role
    const getDefaultPermissions = (role) => {
        switch (role) {
            case 'manager':
                return {
                    Dashboard: true,
                    Manager: true,
                    Store_Supervisor: true,
                    Foreman_Supervisor: true,
                    Workers: true,
                    Scrapstore: true,
                    Rawmaterial: true,
                    Suppliers: true,
                    Clients: true,
                    Inventory: true,
                    Management: true
                };
            case 'supervisor':
                return {
                    Dashboard: false,
                    Manager: false,
                    Store_Supervisor: true,
                    Foreman_Supervisor: true,
                    Workers: true,
                    Scrapstore: true,
                    Rawmaterial: true,
                    Suppliers: true,
                    Clients: true,
                    Inventory: true,
                    Management: false
                };
            default:
                return {
                    Dashboard: false,
                    Manager: false,
                    Store_Supervisor: false,
                    Foreman_Supervisor: false,
                    Workers: false,
                    Scrapstore: false,
                    Rawmaterial: false,
                    Suppliers: false,
                    Clients: false,
                    Inventory: false,
                    Management: false
                };
        }
    };

    // Update user role and set default permissions
    const updateUserRole = (email, role) => {
        setUsers(prev => {
            const newUsers = prev.map(user =>
                user.email === email ? {
                    ...user,
                    role,
                    permissions: getDefaultPermissions(role)
                } : user
            );
            localStorage.setItem('users', JSON.stringify(newUsers));
            return newUsers;
        });
    };

    // Delete user from the system
    const deleteUser = (email) => {
        setUsers(prev => {
            const newUsers = prev.filter(user => user.email !== email);
            localStorage.setItem('users', JSON.stringify(newUsers));
            return newUsers;
        });
    };

    // Update general user information
    const updateUserInfo = (email, updates) => {
        setUsers(prev => {
            const newUsers = prev.map(user =>
                user.email === email ? { ...user, ...updates } : user
            );
            localStorage.setItem('users', JSON.stringify(newUsers));
            return newUsers;
        });
    };

    // Update inventory item details
    const updateInventoryItem = (id, updates) => {
        setInventory(prev => {
            const newInventory = prev.map(item =>
                item.id === id ? { ...item, ...updates } : item
            );
            localStorage.setItem('inventory', JSON.stringify(newInventory));
            return newInventory;
        });
    };

    // Delete item from inventory
    const deleteInventoryItem = (id) => {
        setInventory(prev => {
            const newInventory = prev.filter(item => item.id !== id);
            localStorage.setItem('inventory', JSON.stringify(newInventory));
            return newInventory;
        });
    };

    return (
        // Provide user management functions to children components
        <UserContext.Provider value={{
            users,
            addUser,
            updateUserPermissions,
            updateUserRole,
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
