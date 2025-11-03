import React, { useEffect, useState, useRef } from 'react'
import Table from 'react-bootstrap/Table';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import InputGroup from 'react-bootstrap/InputGroup';
import axios from 'axios';
import { useSearch } from '../context/SearchContext';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa'

// Clients Component: Manages client information and operations
const Clients = () => {
    const { searchQuery } = useSearch();
    const [Posts, Setpost] = useState([])
    const [editingId, setEditingId] = useState(null)
    // Manages new client entry form
    const [Clients, setClients] = useState({
        code: '',
        clientName: '',
        quantity: '',
        receivingDate: new Date().toISOString().split('T')[0]
    })
    const [editingRow, setEditingRow] = useState(null);
    const [editedValues, setEditedValues] = useState({});
    const tableRef = useRef(null);

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

    // Fetch clients from API
    const fetchClients = async () => {
        try {
            const response = await axios.get('http://localhost:8080/api/client');
            Setpost(response.data);
        } catch (err) {
            console.error('Error fetching clients:', err);
        }
    };

    useEffect(() => {
        fetchClients();
    }, []);

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

    // CRUD Operations
    const startEditing = (post) => {
        setEditingRow(post._id);
        setEditedValues({ ...post });
    };

    // Update client data with API
    const saveChanges = async (postId) => {
        try {
            const token = getToken();
            if (!token) {
                alert('Please login first');
                return;
            }

            // Find the client by _id to get its code
            const clientToUpdate = Posts.find(post => post._id === postId);
            if (!clientToUpdate) {
                console.error('Client not found');
                return;
            }

            const response = await axios.put(`http://localhost:8080/api/client/${clientToUpdate.code}`, editedValues, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (response.status === 200) {
                const updatedPosts = Posts.map((post) => (
                    post._id === postId ? response.data.data : post
                ));
                Setpost(updatedPosts);
                setEditingRow(null);
                setEditedValues({});
            } else {
                console.error('Failed to update client');
            }
        } catch (err) {
            console.error('Error updating client:', err);
        }
    };

    const cancelEditing = () => {
        setEditingRow(null);
        setEditedValues({});
    };

    const handleCellEdit = (event, field) => {
        setEditedValues({
            ...editedValues,
            [field]: event.target.value
        });
    };

    // Handle client entry input changes
    const handleInputChange = (event) => {
        const { name, value } = event.target
        setClients({ ...Clients, [name]: value })
    }

    // Add new client to the list and API
    const handleAddClients = async () => {
        try {
            const token = getToken();
            if (!token) {
                alert('Please login first');
                return;
            }

            const clientWithCode = {
                ...Clients,
                code: Clients.code ? parseInt(Clients.code) : Date.now()
            }
            const response = await axios.post('http://localhost:8080/api/client', clientWithCode, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            Setpost([...Posts, response.data]);
            setClients({
                code: '',
                clientName: '',
                quantity: '',
                receivingDate: new Date().toISOString().split('T')[0]
            })
        } catch (err) {
            console.error('Error adding client:', err);
        }
    }

    // Delete client using API
    const handleDelete = async (id) => {
        try {
            const token = getToken();
            if (!token) {
                alert('Please login first');
                return;
            }

            // Find the client by _id to get its code
            const clientToDelete = Posts.find(post => post._id === id);
            if (!clientToDelete) {
                console.error('Client not found');
                return;
            }

            const response = await axios.delete(`http://localhost:8080/api/client/${clientToDelete.code}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.status === 200) {
                const updatedPosts = Posts.filter(post => post._id !== id)
                Setpost(updatedPosts)
                if (editingId === id) {
                    setEditingId(null)
                    setClients({
                        code: '',
                        clientName: '',
                        quantity: '',
                        receivingDate: new Date().toISOString().split('T')[0],
                    })
                }
            } else {
                console.error('Failed to delete client');
            }
        } catch (err) {
            console.error('Error deleting client:', err);
        }
    }

    // Filter clients based on search
    const filteredPosts = Posts.filter(post =>
        post.clientName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.code?.toString().includes(searchQuery)
    )

    // Handle report printing
    const handlePrint = () => {
        const printContent = document.getElementById('Clients-table');
        const windowPrint = window.open('', '', 'width=900,height=600');
        windowPrint.document.write(`
        ${printContent.outerHTML}
            `);
        windowPrint.document.close();
        windowPrint.focus();
        windowPrint.print();
        windowPrint.close();
    };

    return (
        <div className='w-full pt-2 px-2'>
            <div className=' px-1' >
                <Button className='my-2 bg-black' onClick={handlePrint}>
                    طباعة التقرير
                </Button>
                <InputGroup className="my-3">
                    <Form.Control
                        placeholder="الكود"
                        name="code"
                        type="number"
                        value={Clients.code}
                        onChange={handleInputChange}
                        style={{ display: hasPermission() ? 'block' : 'none' }}
                    />
                    <Form.Control
                        placeholder="اسم العميل"
                        name="clientName"
                        value={Clients.clientName}
                        onChange={handleInputChange}
                        style={{ display: hasPermission() ? 'block' : 'none' }}
                    />
                    <Form.Control
                        placeholder="الكمية"
                        name="quantity"
                        type="number"
                        step="0.01"
                        value={Clients.quantity}
                        onChange={handleInputChange}
                        style={{ display: hasPermission() ? 'block' : 'none' }}
                    />
                    <Form.Control
                        type="date"
                        name="receivingDate"
                        value={Clients.receivingDate}
                        onChange={handleInputChange}
                        style={{ display: hasPermission() ? 'block' : 'none' }}
                    />
                </InputGroup>
                <Button
                    className='mb-3 bg-black'
                    onClick={handleAddClients}
                    style={{ display: hasPermission() ? 'block' : 'none' }}
                >
                    اضافة عميل
                </Button>
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
                        <Table id='Clients-table' striped bordered hover>
                            <thead>
                                <tr style={{ textAlign: "center" }}>
                                    <th >الكود</th>
                                    <th >اسم العميل</th>
                                    <th >الكمية</th>
                                    <th >موعد الاستلام</th>
                                    <th
                                        style={{ display: hasPermission() ? 'block' : 'none' }}
                                    >تعديل</th>
                                </tr>
                            </thead>
                            {
                                filteredPosts.map((post) => (
                                    <tbody key={post._id} className='text-center'>
                                        <tr>
                                            <td>{post.code}</td>
                                            <td>
                                                {editingRow === post._id ? (
                                                    <Form.Control
                                                        value={editedValues.clientName || ''}
                                                        onChange={(e) => handleCellEdit(e, 'clientName')}
                                                    />
                                                ) : post.clientName}
                                            </td>
                                            <td>
                                                {editingRow === post._id ? (
                                                    <Form.Control
                                                        type="number"
                                                        step="0.01"
                                                        value={editedValues.quantity || ''}
                                                        onChange={(e) => handleCellEdit(e, 'quantity')}
                                                    />
                                                ) : post.quantity}
                                            </td>
                                            <td>
                                                {editingRow === post._id ? (
                                                    <Form.Control
                                                        type="date"
                                                        value={editedValues.receivingDate?.split('T')[0] || ''}
                                                        onChange={(e) => handleCellEdit(e, 'receivingDate')}
                                                    />
                                                ) : post.receivingDate?.split('T')[0]}
                                            </td>
                                            <td
                                                style={{ display: hasPermission() ? 'block' : 'none' }}
                                            >
                                                <div className="d-flex gap-2 justify-content-center">
                                                    {editingRow === post._id ? (
                                                        <>
                                                            <Button
                                                                variant="outline-success"
                                                                size="md"
                                                                onClick={() => saveChanges(post._id)}
                                                            >
                                                                حفظ
                                                            </Button>
                                                            <Button
                                                                variant="outline-secondary"
                                                                size="md"
                                                                onClick={cancelEditing}
                                                            >
                                                                إلغاء
                                                            </Button>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <Button
                                                                variant="outline-primary"
                                                                size="md"
                                                                onClick={() => startEditing(post)}
                                                            >
                                                                تعديل
                                                            </Button>
                                                            <Button
                                                                variant="outline-danger"
                                                                size="md"
                                                                onClick={() => handleDelete(post._id)}
                                                            >
                                                                حذف
                                                            </Button>
                                                        </>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    </tbody>
                                ))
                            }
                        </Table>
                    </div>
                </div>
            </div>
        </div>)
}

export default Clients