// Employees Component: Manages employee records and operations
import React, { useEffect, useState, useRef } from 'react'
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import { useSearch } from '../../context/SearchContext';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

const Workers = () => {
    const { searchQuery } = useSearch()
    const [Posts, Setpost] = useState([])
    const [isEditing, setIsEditing] = useState(false)
    const [editingId, setEditingId] = useState(null)
    const [editedRow, setEditedRow] = useState({})
    // Manages new store supervisor entry form
    const [Workers, setWorkers] = useState({
        code: '',
        workerName: '',
        rawMaterialAmount: '',
        workerSupervisorName: ''
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

    // Fetch workers from API
    const fetchWorkers = async () => {
        try {
            const res = await fetch('http://localhost:8080/api/worker');
            if (!res.ok) {
                throw new Error('Failed to fetch workers');
            }
            const data = await res.json();
            Setpost(data);
        } catch (err) {
            console.error('Error fetching workers:', err);
            alert('Failed to fetch workers. Please refresh the page.');
        }
    }

    useEffect(() => {
        fetchWorkers()
    }, [])

    // Handles form input changes
    const handleInputChange = (event) => {
        const { name, value } = event.target
        setWorkers({ ...Workers, [name]: value })
    }

    // Add new worker to the list and API
    const handleAddWorkers = async () => {
        try {
            // Validate required fields
            if (!Workers.code || !Workers.workerName || !Workers.rawMaterialAmount || !Workers.workerSupervisorName) {
                alert('Please fill in all required fields');
                return;
            }

            const token = getToken();
            if (!token) {
                alert('Please login first');
                return;
            }

            const workerWithCode = {
                ...Workers,
                code: Number(Workers.code),
                rawMaterialAmount: Number(Workers.rawMaterialAmount)
            };

            const res = await fetch('http://localhost:8080/api/worker', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(workerWithCode)
            });

            if (!res.ok) {
                const error = await res.json();
                alert(error.message || 'Failed to add worker');
                return;
            }

            const saved = await res.json();
            Setpost(prevPosts => [...prevPosts, saved]);

            setWorkers({
                code: '',
                workerName: '',
                rawMaterialAmount: '',
                workerSupervisorName: ''
            });

            await fetchWorkers();
        } catch (err) {
            console.error('Error adding worker:', err);
            alert('Failed to add worker. Please try again.');
        }
    }

    // Start editing an existing employee
    const handleEdit = (Workers) => {
        setEditingId(Workers.code)
        setEditedRow(Workers)
        setIsEditing(true)
    }

    // Handle changes during editing
    const handleCellChange = (event, field) => {
        setEditedRow({
            ...editedRow,
            [field]: event.target.value
        })
    }

    // Save edited worker data
    const handleSave = async () => {
        try {
            const token = getToken();
            if (!token) {
                alert('Please login first');
                return;
            }

            const res = await fetch(`http://localhost:8080/api/worker/${editingId}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    ...editedRow,
                    code: Number(editedRow.code),
                    rawMaterialAmount: Number(editedRow.rawMaterialAmount)
                })
            });

            if (!res.ok) {
                const error = await res.json();
                alert(error.message || 'Failed to update worker');
                return;
            }

            const updated = await res.json();
            Setpost(prevPosts => prevPosts.map(post =>
                post.code === editingId ? updated : post
            ));

            setEditingId(null);
            setIsEditing(false);
            setEditedRow({});

            await fetchWorkers();
        } catch (err) {
            console.error('Error updating worker:', err);
            alert('Failed to update worker. Please try again.');
        }
    }

    // Cancel current operation
    const handleCancel = () => {
        setEditingId(null)
        setIsEditing(false)
        setEditedRow({})
    }

    // Delete worker record
    const handleDelete = async (code) => {
        try {
            const token = getToken();
            if (!token) {
                alert('Please login first');
                return;
            }

            const res = await fetch(`http://localhost:8080/api/worker/${code}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!res.ok) {
                throw new Error('Failed to delete worker');
            }

            Setpost(prevPosts => prevPosts.filter(post => post.code !== code));
            await fetchWorkers();
        } catch (err) {
            console.error('Error deleting worker:', err);
            alert('Failed to delete worker.');
        }
    }

    // Filter workers based on search term
    const filteredPosts = Posts.filter(post =>
        post.workerName?.toLowerCase().includes(searchQuery.toLowerCase())
        || post.workerSupervisorName?.toLowerCase().includes(searchQuery.toLowerCase())
        || post.code?.toString().includes(searchQuery)
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
        <div className=' Navvv_com Suppliers pt-3'>
            <Button className='mr-3 mb-2 bg-black' onClick={handlePrint}>
                طباعة التقرير
            </Button>
            <div className='Employees px-2 '>
                <div className='w-full h-full px-1' >
                    <div className='w-full'>
                        <span className='w-full '>
                            <InputGroup className="my-3 w-full">
                                <Form.Control
                                    placeholder="الكود"
                                    aria-label="الكود"
                                    name="code"
                                    value={Workers.code}
                                    onChange={handleInputChange}
                                    style={{ display: hasPermission() ? 'block' : 'none' }}
                                />
                                <Form.Control
                                    placeholder="اسم العامل"
                                    aria-label="اسم العامل"
                                    name="workerName"
                                    value={Workers.workerName}
                                    onChange={handleInputChange}
                                    style={{ display: hasPermission() ? 'block' : 'none' }}
                                />
                                <Form.Control
                                    placeholder="كمية المادة الخام"
                                    name="rawMaterialAmount"
                                    type="number"
                                    step="0.01"
                                    value={Workers.rawMaterialAmount}
                                    onChange={handleInputChange}
                                    style={{ display: hasPermission() ? 'block' : 'none' }}
                                />
                                <Form.Control
                                    placeholder="اسم مشرف العمال"
                                    aria-label="اسم مشرف العمال"
                                    name="workerSupervisorName"
                                    value={Workers.workerSupervisorName}
                                    onChange={handleInputChange}
                                    style={{ display: hasPermission() ? 'block' : 'none' }}
                                />
                            </InputGroup>
                            <Button
                                className="mb-3 bg-black"
                                onClick={handleAddWorkers}
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
                                        <th >الكود</th>
                                        <th >اسم العامل</th>
                                        <th >كمية المادة الخام</th>
                                        <th >اسم مشرف العمال</th>
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
                                                {editingId === post.code ? (
                                                    <Form.Control
                                                        value={editedRow.workerName}
                                                        onChange={(e) => handleCellChange(e, 'workerName')}
                                                    />
                                                ) : post.workerName}
                                            </td>
                                            <td>
                                                {editingId === post.code ? (
                                                    <Form.Control
                                                        type="number"
                                                        step="0.01"
                                                        value={editedRow.rawMaterialAmount}
                                                        onChange={(e) => handleCellChange(e, 'rawMaterialAmount')}
                                                    />
                                                ) : post.rawMaterialAmount}
                                            </td>
                                            <td>
                                                {editingId === post.code ? (
                                                    <Form.Control
                                                        value={editedRow.workerSupervisorName}
                                                        onChange={(e) => handleCellChange(e, 'workerSupervisorName')}
                                                    />
                                                ) : post.workerSupervisorName}
                                            </td>
                                            <td
                                                style={{ display: hasPermission() ? 'block' : 'none' }}

                                            >
                                                {editingId === post.code ? (
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

export default Workers