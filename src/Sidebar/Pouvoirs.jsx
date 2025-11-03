// Import necessary dependencies
import React, { useEffect, useState } from 'react'
import "./Sidebar.css"
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { FaLock, FaUnlock, FaTrash, FaUserCog } from 'react-icons/fa'
import { Modal } from 'react-bootstrap';
import { useSearch } from '../context/SearchContext'
import axios from 'axios';

/**
 * Pouvoirs (Permissions) component handles user roles and permissions management.
 * It provides functionality for managing user roles (manager, supervisor, user),
 * setting individual permissions, and managing admin settings.
 */
const Pouvoirs = () => {
    const { searchQuery } = useSearch();
    const [users, setUsers] = useState([]);
    const [currentUser, setCurrentUser] = useState(null);
    // State for manager settings modal
    const [showmanagerModal, setShowmanagerModal] = useState(false);
    // State for manager settings form
    const [managerSettings, setmanagerSettings] = useState({
        currentPassword: '',
        newEmail: '',
        newPassword: '',
        confirmPassword: ''
    });

    // Get token from localStorage
    const getToken = () => {
        const user = JSON.parse(localStorage.getItem('currentUser'));
        return user ? user.token : null;
    };
     const getUserRole = () => {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    return currentUser ? currentUser.role : null;
  };

  // Check if user has permission (manager or admin)
  const hasPermission = () => {
    const role = getUserRole();
    return role === 'manager' || role === 'admin';
  };
    // Fetch current user and all users from backend
    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = getToken();
                if (!token) {
                    console.error('No authentication token found');
                    return;
                }

                // Fetch all users
                const usersResponse = await axios.get('http://localhost:8080/api/users', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                setUsers(usersResponse.data);

                // Set current user from localStorage
                const storedUser = JSON.parse(localStorage.getItem('currentUser'));
                setCurrentUser(storedUser);
            } catch (error) {
                console.error('Error fetching users:', error);
                if (error.response?.status === 401 || error.response?.status === 400) {
                    alert('Session expired. Please login again.');
                    localStorage.removeItem('currentUser');
                    window.location.href = '/';
                }
            }
        };

        fetchData();
    }, []);

    /**
     * Defines the hierarchy of roles where:
     * manager (3) > supervisor (2) > user (1)
     * Used to determine permission modification abilities
     */
    const roleHierarchy = {
        'manager': 3,
        'supervisor': 2,
        'user': 1
    };

    /**
     * Checks if the current user has sufficient privileges to modify another user's role
     * @param {string} targetUserRole - Role of the user being modified
     * @returns {boolean} - Whether modification is allowed
     */
    const canModifyRole = (targetUserRole) => {
        const currentUserLevel = roleHierarchy[currentUser?.role] || 0;
        const targetUserLevel = roleHierarchy[targetUserRole] || 0;
        return currentUserLevel > targetUserLevel;
    };

    /**
     * Handles role changes for users. Ensures only managers can change roles
     * and prevents having multiple managers.
     */
    const handleRoleChange = async (email, newRole) => {
        if (currentUser?.role !== 'manager') {
            alert('Only managers can modify user roles');
            return;
        }

        const targetUser = users.find(u => u.email === email);

        // Check if trying to assign manager role
        if (newRole === 'manager') {
            // Check if there's already a manager (excluding the current target user)
            const existingManager = users.find(u => u.role === 'manager' && u.email !== email);
            if (existingManager) {
                alert('There can only be one manager. Please remove the existing manager first.');
                return;
            }
        }

        if (!canModifyRole(targetUser?.role)) {
            alert('You cannot modify users with equal or higher roles');
            return;
        }

        try {
            const token = getToken();
            await axios.put('http://localhost:8080/api/user/role',
                { email, role: newRole },
                { headers: { 'Authorization': `Bearer ${token}` } }
            );

            // Update local state
            setUsers(users.map(u => u.email === email ? { ...u, role: newRole } : u));
        } catch (error) {
            console.error('Error updating role:', error);
            alert('Failed to update role');
        }
    };

    /**
     * Toggles individual permissions for a specific user
     * Only managers can modify permissions
     */
    const togglePermission = async (email, permission) => {
        if (currentUser?.role !== 'manager') return;

        const user = users.find(u => u.email === email);
        if (user) {
            const newPermissions = {
                ...user.permissions,
                [permission]: !user.permissions[permission]
            };

            try {
                const token = getToken();
                await axios.put('http://localhost:8080/api/user/permissions',
                    { email, permissions: newPermissions },
                    { headers: { 'Authorization': `Bearer ${token}` } }
                );

                // Update local state
                setUsers(users.map(u => u.email === email ? { ...u, permissions: newPermissions } : u));
            } catch (error) {
                console.error('Error updating permissions:', error);
                alert('Failed to update permissions');
            }
        }
    };

    /**
     * Handles user deletion with safety checks:
     * - Only managers can delete users
     * - Cannot delete own account
     * - Requires confirmation for manager deletion
     */
    const handleDeleteUser = async (email) => {
        // Make sure only manager can delete users
        if (currentUser?.role !== 'manager') {
            alert('Only managers can delete users');
            return;
        }

        // Prevent manager from deleting themselves
        if (email === currentUser.email) {
            alert('You cannot delete your own account');
            return;
        }

        // Get the target user
        const targetUser = users.find(u => u.email === email);
        if (!targetUser) return;

        // Additional confirmation for deleting managers
        if (targetUser.role === 'manager') {
            if (!window.confirm('Are you sure you want to delete another manager user?')) {
                return;
            }
        }

        if (window.confirm('Are you sure you want to delete this user?')) {
            try {
                const token = getToken();
                await axios.delete(`http://localhost:8080/api/user/${email}`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });

                // Update local state
                setUsers(users.filter(u => u.email !== email));
            } catch (error) {
                console.error('Error deleting user:', error);
                alert('Failed to delete user');
            }
        }
    };

    /**
     * Updates manager account settings including email and password
     * Validates password confirmation before updating
     */
    const handlemanagerUpdate = async () => {
        if (!currentUser || managerSettings.newPassword !== managerSettings.confirmPassword) {
            alert('Passwords do not match');
            return;
        }

        try {
            const token = getToken();
            await axios.put('http://localhost:8080/api/user/info',
                {
                    email: currentUser.email,
                    newEmail: managerSettings.newEmail || currentUser.email,
                    password: managerSettings.newPassword
                },
                { headers: { 'Authorization': `Bearer ${token}` } }
            );

            setShowmanagerModal(false);
            alert('Manager settings updated successfully');

            // Update localStorage if email changed
            if (managerSettings.newEmail) {
                const updatedUser = { ...currentUser, email: managerSettings.newEmail };
                localStorage.setItem('currentUser', JSON.stringify(updatedUser));
                setCurrentUser(updatedUser);
            }
        } catch (error) {
            console.error('Error updating manager settings:', error);
            alert('Failed to update settings');
        }
    };

    return (
        <div className='w-full pt-2 px-2'>
            <div className='px-1'>
                {/* Manager settings button - only visible to managers */}
                {currentUser?.role === 'manager' && (
                    <Button
                        variant="primary"
                        className="mb-3 ms-2"
                        onClick={() => setShowmanagerModal(true)}
                    >
                        <FaUserCog className="me-1" /> إعدادات المسؤول
                    </Button>
                )}
                {/* User permissions table */}
                <Table striped bordered hover>
                    <thead>
                        {/* Table headers for user information and permissions */}
                        <tr>
                            <th>اسم المستخدم</th>
                            <th>الدور</th>
                            <th>المدير</th>
                            <th>الصلاحيات</th>
                            <th>مشرف العمال</th>
                            <th>مشرف المخازن</th>
                            <th>العمال</th>
                            <th> الخردة</th>
                            <th> المادة الخام</th>
                            <th> صفحة المورد</th>
                            <th> صفحة العميل</th>
                            <th>حذف</th>
                        </tr>
                    </thead>
                    <tbody>
                        {/* Map through filtered users and display their information */}
                        {users.filter(user =>
                            user.email.toLowerCase().includes(searchQuery.toLowerCase())
                        ).map(user => (
                            <tr key={user.email}>
                                <td>{user.username || user.email}</td>
                                <td>
                                    <Form.Select
                                        size="sm"
                                        value={user.role || 'user'}
                                        onChange={(e) => handleRoleChange(user.email, e.target.value)}
                                        disabled={!canModifyRole(user.role)}
                                    >
                                        <option value="user">مستخدم</option>
                                        <option value="supervisor">مشرف</option>
                                        <option value="manager">مدير</option>
                                    </Form.Select>
                                </td>
                                {['Manager', 'Dashboard', 'Foreman_Supervisor', 'Store_Supervisor', 'Workers', 'Scrapstore', 'Rawmaterial', 'Suppliers', 'Clients'].map(permission => (
                                    <td key={permission}>
                                        <Button
                                            variant={user.permissions[permission] ? "success" : "danger"}
                                            size="sm"
                                            onClick={() => togglePermission(user.email, permission)}
                                            disabled={currentUser?.role !== 'manager'}
                                        >
                                            {user.permissions[permission] ? <FaUnlock /> : <FaLock />}
                                        </Button>
                                    </td>
                                ))}
                                <td>
                                    <Button
                                        variant="danger"
                                        size="sm"
                                        onClick={() => handleDeleteUser(user.email)}
                                        disabled={currentUser?.role !== 'manager' ||
                                            user.email === currentUser.email}
                                        title={currentUser?.role !== 'manager' ? 'Only Manager can delete users' : ''}
                                    >
                                        <FaTrash />
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>

                {/* Manager settings modal */}
                <Modal show={showmanagerModal} onHide={() => setShowmanagerModal(false)}>
                    <Modal.Header closeButton>
                        <Modal.Title>إعدادات المسؤول</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        {/* Manager settings form */}
                        <Form>
                            {/* Email update field */}
                            <Form.Group className="mb-3">
                                <Form.Label>البريد الإلكتروني الجديد</Form.Label>
                                <Form.Control
                                    type="email"
                                    value={managerSettings.newEmail}
                                    onChange={(e) => setmanagerSettings({
                                        ...managerSettings,
                                        newEmail: e.target.value
                                    })}
                                />
                            </Form.Group>

                            {/* Current password field */}
                            <Form.Group className="mb-3">
                                <Form.Label>كلمة المرور الحالية</Form.Label>
                                <Form.Control
                                    type="password"
                                    value={managerSettings.currentPassword}
                                    onChange={(e) => setmanagerSettings({
                                        ...managerSettings,
                                        currentPassword: e.target.value
                                    })}
                                />
                            </Form.Group>

                            {/* New password field */}
                            <Form.Group className="mb-3">
                                <Form.Label>كلمة المرور الجديدة</Form.Label>
                                <Form.Control
                                    type="password"
                                    value={managerSettings.newPassword}
                                    onChange={(e) => setmanagerSettings({
                                        ...managerSettings,
                                        newPassword: e.target.value
                                    })}
                                />
                            </Form.Group>

                            {/* Confirm password field */}
                            <Form.Group className="mb-3">
                                <Form.Label>تأكيد كلمة المرور الجديدة</Form.Label>
                                <Form.Control
                                    type="password"
                                    value={managerSettings.confirmPassword}
                                    onChange={(e) => setmanagerSettings({
                                        ...managerSettings,
                                        confirmPassword: e.target.value
                                    })}
                                />
                            </Form.Group>
                        </Form>
                    </Modal.Body>
                    <Modal.Footer>
                        {/* Modal action buttons */}
                        <Button variant="secondary" onClick={() => setShowmanagerModal(false)}>
                            إلغاء
                        </Button>
                        <Button variant="primary" onClick={handlemanagerUpdate}>
                            حفظ التغييرات
                        </Button>
                    </Modal.Footer>
                </Modal>
            </div >
        </div >
    );
};

// Export the component
export default Pouvoirs;