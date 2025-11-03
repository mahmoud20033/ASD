// Employees Component: Manages employee records and operations
import React, { useState, useRef, useEffect } from 'react'
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Card from 'react-bootstrap/Card';
import { useSearch } from '../../context/SearchContext';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import axios from 'axios';

const Manager = () => {
    const { searchQuery } = useSearch()
    const [isEditingManager, setIsEditingManager] = useState(false)
    const [managerDetails, setManagerDetails] = useState({
        name: 'محمود محمد',
    })

    // Get token from localStorage
    const getToken = () => {
        const user = JSON.parse(localStorage.getItem('currentUser'));
        return user ? user.token : null;
    };

    // Get user role for permission checking
    const getUserRole = () => {
        const user = JSON.parse(localStorage.getItem('currentUser'));
        return user ? user.role : null;
    };

    // Check if user has permission (manager or admin)
    const hasPermission = () => {
        const role = getUserRole();
        return role === 'manager' || role === 'admin';
    };

    const handleManagerEdit = (field, value) => {
        setManagerDetails(prev => ({
            ...prev,
            [field]: value
        }));
    }

    // State Management
    // Stores all employee records
    const [Posts, Setpost] = useState([])
    // Controls editing states
    const [isEditing, setIsEditing] = useState(false)
    const [editingcode, setEditingcode] = useState(null)
    const [editedRow, setEditedRow] = useState({})
    // Manages new employee entry form
    const [Manager, setManager] = useState({
        code: '',
        storeSupervisorName: '',
        workerSupervisorName: '',
    })

    // Fetch employees from API using axios
    const fetchManagers = async () => {
        try {
            const response = await axios.get('http://localhost:8080/api/managers');
            Setpost(response.data);
        } catch (err) {
            console.error('Error fetching managers:', err);
        }
    }

    // Add new employee to the list and API using axios
    const handleAddManager = async () => {
        try {
            // Validate required fields
            if (!Manager.code || !Manager.storeSupervisorName || !Manager.workerSupervisorName) {
                alert('Please fill all fields');
                return;
            }

            const token = getToken();
            if (!token) {
                alert('Please login first');
                return;
            }

            const response = await axios.post('http://localhost:8080/api/managers', Manager, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            Setpost([...Posts, response.data]);
            setManager({ code: '', storeSupervisorName: '', workerSupervisorName: '' });
        } catch (err) {
            console.error('Error adding manager:', err);
            alert(err.response?.data?.message || 'Error adding manager');
        }
    }

    useEffect(() => {
        fetchManagers()
    }, [])

    // Start editing an existing employee
    const handleEdit = (Manager) => {
        setEditingcode(Manager.code)
        setEditedRow(Manager)
        setIsEditing(true)
    }

    // Handle changes during editing
    const handleCellChange = (event, field) => {
        setEditedRow({
            ...editedRow,
            [field]: event.target.value
        })
    }

    // Save edited employee data with API
    const handleSave = async () => {
        try {
            const token = getToken();
            if (!token) {
                alert('Please login first');
                return;
            }

            const response = await axios.put(`http://localhost:8080/api/managers/${editingcode}`, editedRow, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            Setpost(Posts.map(post =>
                post.code === editingcode ? response.data : post
            ));
            setEditingcode(null);
            setIsEditing(false);
            setEditedRow({});
        } catch (err) {
            console.error('Error updating manager:', err);
            alert('Failed to update manager');
        }
    }

    // Cancel current operation
    const handleCancel = () => {
        setEditingcode(null)
        setIsEditing(false)
        setEditedRow({})
    }

    // Delete employee record using axios
    const handleDelete = async (code) => {
        try {
            const token = getToken();
            if (!token) {
                alert('Please login first');
                return;
            }

            await axios.delete(`http://localhost:8080/api/managers/${code}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            Setpost(Posts.filter(post => post.code !== code));
        } catch (err) {
            console.error('Error deleting manager:', err);
            alert('Failed to delete manager');
        }
    }

    // Filter employees based on search term
    const filteredPosts = Posts.filter(post =>
        post.code?.toString().includes(searchQuery)
    )
    // Handle report printing
    const handlePrint = () => {
        const printContent = document.getElementById('Employees-table');
        const windowPrint = window.open('', '', 'width=900,height=600');
        windowPrint.document.write(`
                ${printContent.outerHTML}
        `);
        windowPrint.document.close();
        windowPrint.focus();
        windowPrint.print();
        windowPrint.close();
    };

    const tableRef = useRef(null);

    const scroll = (direction) => {
        if (tableRef.current) {
            const scrollAmount = 100;
            if (direction === 'left') {
                tableRef.current.scrollLeft -= scrollAmount;
            } else {
                tableRef.current.scrollLeft += scrollAmount;
            }
        }
    };

    return (
        <div className=' Navvv_com Suppliers pt-3 '>
            <Button className='mr-3 mb-2 bg-black' onClick={handlePrint}>
                طباعة التقرير
            </Button>

            <Card className="mb-4 mx-2">
                <Card.Header className="bg-dark text-white d-flex justify-content-between align-items-center">
                    <span>تفاصيل المدير</span>
                    <Button
                        variant={isEditingManager ? "success" : "light"}
                        size="sm"
                        onClick={() => setIsEditingManager(!isEditingManager)}
                    >
                        {isEditingManager ? 'حفظ' : 'تعديل'}
                    </Button>
                </Card.Header>
                <Card.Body>
                    <div className="grcode grcode-cols-2 gap-4">
                        <div>
                            <p className='text-2xl'>
                                <strong className='font-bold'>الاسم :  </strong>
                                {isEditingManager ? (
                                    <Form.Control
                                        value={managerDetails.name}
                                        onChange={(e) => handleManagerEdit('name', e.target.value)}
                                        size="sm"
                                        className="d-inline-block w-auto ml-2"
                                    />
                                ) : managerDetails.name}
                            </p>
                        </div>
                    </div>
                </Card.Body>
            </Card>

            <div className='Employees px-2 '>
                <div className='w-full h-full px-1' >
                    <div className='w-full'>
                        <span className='w-full '>
                            <InputGroup className="my-3 w-full">
                                <Form.Control
                                    placeholder="الكود"
                                    aria-label="الكود"
                                    name="code"
                                    value={Manager.code}
                                    onChange={(e) => setManager({ ...Manager, code: e.target.value })}
                                    style={{ display: hasPermission() ? 'block' : 'none' }}
                                />
                                <Form.Control
                                    placeholder="اسم مشرف المخازن"
                                    aria-label="اسم مشرف المخازن"
                                    name="storeSupervisorName"
                                    value={Manager.storeSupervisorName}
                                    onChange={(e) => setManager({ ...Manager, storeSupervisorName: e.target.value })}
                                    className='input'
                                    style={{ display: hasPermission() ? 'block' : 'none' }}
                                />
                                <Form.Control
                                    placeholder="اسم مشرف العمال"
                                    aria-label="اسم مشرف العمال"
                                    name="workerSupervisorName"
                                    value={Manager.workerSupervisorName}
                                    onChange={(e) => setManager({ ...Manager, workerSupervisorName: e.target.value })}
                                    className='input'
                                    style={{ display: hasPermission() ? 'block' : 'none' }}
                                />
                            </InputGroup>
                            <Button
                                className="mb-3 bg-black"
                                onClick={handleAddManager}
                                style={{ display: hasPermission() ? 'block' : 'none' }}
                            >
                                اضافة موظف
                            </Button>
                        </span>
                    </div>
                    <div className="relative">
                        <button
                            onClick={() => scroll('left')}
                            className="absolute left-0 top-1/2 z-10 bg-gray-800 text-white p-2 rounded-full opacity-70 hover:opacity-100"
                            style={{ transform: 'translateY(-50%)' }}
                        >
                            <FaChevronLeft />
                        </button>
                        <button
                            onClick={() => scroll('right')}
                            className="absolute right-0 top-1/2 z-10 bg-gray-800 text-white p-2 rounded-full opacity-70 hover:opacity-100"
                            style={{ transform: 'translateY(-50%)' }}
                        >
                            <FaChevronRight />
                        </button>
                        <div
                            ref={tableRef}
                            style={{
                                overflowX: 'auto'
                            }}
                        >
                            <Table id="Employees-table" striped bordered hover>
                                <thead>
                                    <tr>
                                        <th>الكود</th>
                                        <th>اسم مشرف المخازن</th>
                                        <th>اسم مشرف العمال</th>
                                        <th
                                            style={{ display: hasPermission() ? 'block' : 'none' }}
                                        >تحديث البيانات</th>
                                    </tr>
                                </thead>
                                {filteredPosts.map((post) => (
                                    <tbody key={post.code}>
                                        <tr>
                                            <td>{post.code}</td>
                                            <td>
                                                {editingcode === post.code ? (
                                                    <Form.Control
                                                        value={editedRow.storeSupervisorName}
                                                        onChange={(e) => handleCellChange(e, 'storeSupervisorName')}
                                                        size="sm"
                                                    />
                                                ) : post.storeSupervisorName}
                                            </td>
                                            <td>
                                                {editingcode === post.code ? (
                                                    <Form.Control
                                                        value={editedRow.workerSupervisorName}
                                                        onChange={(e) => handleCellChange(e, 'workerSupervisorName')}
                                                        size="sm"
                                                    />
                                                ) : post.workerSupervisorName}
                                            </td>
                                            <td
                                                style={{ display: hasPermission() ? 'block' : 'none' }}
                                            >
                                                {editingcode === post.code ? (
                                                    <>
                                                        <Button
                                                            variant="outline-success"
                                                            size="sm"
                                                            onClick={handleSave}
                                                            className="me-2"
                                                        >
                                                            حفظ
                                                        </Button>
                                                        <Button
                                                            variant="outline-danger"
                                                            size="sm"
                                                            onClick={handleCancel}
                                                        >
                                                            الغاء
                                                        </Button>
                                                    </>
                                                ) : (
                                                    <>
                                                        <Button
                                                            variant="outline-primary"
                                                            size="sm"
                                                            onClick={() => handleEdit(post)}
                                                            className="me-2"
                                                        >
                                                            تحديث
                                                        </Button>
                                                        <Button
                                                            variant="outline-danger"
                                                            size="sm"
                                                            onClick={() => handleDelete(post.code)}
                                                        >
                                                            حذف
                                                        </Button>
                                                    </>
                                                )}
                                            </td>
                                        </tr>
                                    </tbody>
                                ))}
                            </Table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Manager