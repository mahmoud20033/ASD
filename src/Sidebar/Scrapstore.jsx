import React, { useEffect, useState, useRef } from 'react'
import Table from 'react-bootstrap/Table';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import InputGroup from 'react-bootstrap/InputGroup';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa'
import { useSearch } from '../context/SearchContext';

const Scrapstore = () => {
    const { searchQuery } = useSearch();

    // Get JWT token from localStorage
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

    const [Posts, Setpost] = useState([])
    const [editingId, setEditingId] = useState(null)
    const [newScrap, setNewScrap] = useState({
        code: '',
        quantity: '',
        type: '',
        costPerTon: '',
        supplierName: '',
        receiverName: '',
        receivingDate: new Date().toISOString().split('T')[0],
    })
    const [editingRow, setEditingRow] = useState(null);
    const [editedValues, setEditedValues] = useState({});
    const tableRef = useRef(null);

    const fetchScrap = async () => {
        try {
            const res = await fetch('http://localhost:8080/api/Scrap');
            if (!res.ok) {
                throw new Error('Failed to fetch scrap data');
            }
            const data = await res.json();
            Setpost(data);
        } catch (err) {
            console.error('Error fetching scrap:', err);
            alert('Failed to fetch scrap data. Please refresh the page.');
        }
    }

    useEffect(() => {
        fetchScrap()
    }, [])

    const handleInputChange = (event) => {
        const { name, value } = event.target
        setNewScrap({ ...newScrap, [name]: value })
    }

    const handleAddScrap = async () => {
        try {
            const token = getToken();
            if (!token) {
                alert('Please login first');
                return;
            }

            // Validate required fields
            if (!newScrap.type || !newScrap.quantity || !newScrap.costPerTon ||
                !newScrap.supplierName || !newScrap.receiverName || !newScrap.receivingDate) {
                alert('Please fill in all required fields');
                return;
            }

            // Validate numeric fields
            if (isNaN(Number(newScrap.quantity)) || isNaN(Number(newScrap.costPerTon))) {
                alert('Quantity and cost per ton must be numbers');
                return;
            }

            // Validate code if provided
            if (newScrap.code && isNaN(Number(newScrap.code))) {
                alert('Code must be a number');
                return;
            }

            // Validate date
            if (isNaN(Date.parse(newScrap.receivingDate))) {
                alert('Invalid date format');
                return;
            }

            const scrapWithCode = {
                ...newScrap,
                code: newScrap.code ? Number(newScrap.code) : Date.now(),
                quantity: Number(newScrap.quantity),
                costPerTon: Number(newScrap.costPerTon),
                receivingDate: new Date(newScrap.receivingDate).toISOString()
            };

            const res = await fetch('http://localhost:8080/api/Scrap', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(scrapWithCode)
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || 'Failed to add scrap');
            }

            // Update the state with the new data
            Setpost(prevPosts => [...prevPosts, data]);

            // Reset the form
            setNewScrap({
                code: '',
                quantity: '',
                type: '',
                costPerTon: '',
                supplierName: '',
                receiverName: '',
                receivingDate: new Date().toISOString().split('T')[0]
            });

            // Refresh the data from the server
            await fetchScrap();
        } catch (err) {
            console.error('Error adding scrap:', err);
        }
    }

    const handleDelete = async (code) => {
        try {
            const token = getToken();
            if (!token) {
                alert('Please login first');
                return;
            }

            const res = await fetch(`http://localhost:8080/api/Scrap/${code}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || 'فشل في حذف العنصر');
            }

            Setpost(prevPosts => prevPosts.filter(post => post.code !== code));
            await fetchScrap();
        } catch (err) {
            console.error('Error deleting scrap:', err);
        }
    }

    const startEditing = (post) => {
        setEditingRow(post.code)
        setEditedValues({ ...post })
    }

    const saveChanges = async (code) => {
        try {
            const token = getToken();
            if (!token) {
                alert('Please login first');
                return;
            }

            // Validate required fields
            if (!editedValues.type || !editedValues.quantity || !editedValues.costPerTon ||
                !editedValues.supplierName || !editedValues.receiverName || !editedValues.receivingDate) {
                return;
            }

            // Validate numeric fields
            if (isNaN(Number(editedValues.quantity)) || isNaN(Number(editedValues.costPerTon))) {
                return;
            }

            // Validate code if provided
            if (editedValues.code && isNaN(Number(editedValues.code))) {
                return;
            }

            // Validate date
            if (isNaN(Date.parse(editedValues.receivingDate))) {
                return;
            }

            const updatedData = {
                ...editedValues,
                code: Number(editedValues.code),
                quantity: Number(editedValues.quantity),
                costPerTon: Number(editedValues.costPerTon),
                receivingDate: new Date(editedValues.receivingDate).toISOString()
            };

            const res = await fetch(`http://localhost:8080/api/Scrap/${code}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(updatedData)
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || 'Failed to update scrap');
            }

            Setpost(prevPosts => prevPosts.map(post =>
                post.code === code ? data : post
            ));

            setEditingRow(null);
            setEditedValues({});

            // Refresh the data
            await fetchScrap();
        } catch (err) {
            console.error('Error saving changes:', err);
        }
    }

    const cancelEditing = () => {
        setEditingRow(null)
        setEditedValues({})
    }

    const handleCellEdit = (e, field) => {
        setEditedValues({
            ...editedValues,
            [field]: e.target.value
        })
    }

    const handlePrint = () => {
        const printContent = document.getElementById('Scrapstore-table');
        const windowPrint = window.open('', '', 'width=900,height=600');
        windowPrint.document.write(`
                    ${printContent.outerHTML}
        `);
        windowPrint.document.close();
        windowPrint.focus();
        windowPrint.print();
        windowPrint.close();
    };

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

    const filteredPosts = Posts.filter(post =>
        post.type?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.code?.toString().includes(searchQuery)
    )

    return (
        <div className='Suppliers pt-2 px-2'>
            <div className='w-full h-full px-1' >
                <Button className='my-2 bg-black' onClick={handlePrint}>
                    طباعة التقرير
                </Button>
                <InputGroup className="my-3">
                    <Form.Control
                        placeholder="الكود"
                        name="code"
                        value={newScrap.code}
                        onChange={handleInputChange}
                        style={{ display: hasPermission() ? 'block' : 'none' }}
                    />
                    <Form.Control
                        placeholder="الكمية"
                        name="quantity"
                        type="number"
                        step="0.01"
                        value={newScrap.quantity}
                        onChange={handleInputChange}
                        style={{ display: hasPermission() ? 'block' : 'none' }}
                    />
                    <Form.Control
                        placeholder="النوع"
                        name="type"
                        value={newScrap.type}
                        onChange={handleInputChange}
                        style={{ display: hasPermission() ? 'block' : 'none' }}
                    />
                    <Form.Control
                        placeholder="تكلفة الطن"
                        name="costPerTon"
                        type="number"
                        step="0.01"
                        value={newScrap.costPerTon}
                        onChange={handleInputChange}
                        style={{ display: hasPermission() ? 'block' : 'none' }}
                    />
                    <Form.Control
                        placeholder='اسم المورد'
                        name="supplierName"
                        value={newScrap.supplierName}
                        onChange={handleInputChange}
                        style={{ display: hasPermission() ? 'block' : 'none' }}
                    />
                    <Form.Control
                        placeholder="اسم المستلم"
                        name="receiverName"
                        value={newScrap.receiverName}
                        onChange={handleInputChange}
                        style={{ display: hasPermission() ? 'block' : 'none' }}
                    />
                    <Form.Control
                        type="date"
                        name="receivingDate"
                        value={newScrap.receivingDate}
                        onChange={handleInputChange}
                        style={{ display: hasPermission() ? 'block' : 'none' }}
                    />

                </InputGroup>
                <Button className='mb-3 bg-black' onClick={handleAddScrap}
                    style={{ display: hasPermission() ? 'block' : 'none' }}
                >
                    إضافة خردة
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
                        <Table id='Scrapstore-table' striped bordered hover>
                            <thead>
                                <tr>
                                    <th >الكود</th>
                                    <th >الكمية</th>
                                    <th >النوع</th>
                                    <th >تكلفة الطن</th>
                                    <th >اسم المورد</th>
                                    <th >اسم المستلم</th>
                                    <th >موعد الاستلام</th>
                                    <th style={{ display: hasPermission() ? 'block' : 'none' }}>تعديل</th>
                                </tr>
                            </thead>
                            {
                                filteredPosts.map((post) => (
                                    <tbody key={post.code}>
                                        <tr>
                                            <td>{post.code}</td>
                                            <td>
                                                {editingRow === post.code ? (
                                                    <Form.Control
                                                        type="number"
                                                        step="0.01"
                                                        value={editedValues.quantity || ''}
                                                        onChange={(e) => handleCellEdit(e, 'quantity')}
                                                    />
                                                ) : (
                                                    post.quantity
                                                )}
                                            </td>
                                            <td>
                                                {editingRow === post.code ? (
                                                    <Form.Control
                                                        value={editedValues.type || ''}
                                                        onChange={(e) => handleCellEdit(e, 'type')}
                                                    />) : (
                                                    post.type
                                                )}
                                            </td>
                                            <td>
                                                {editingRow === post.code ? (
                                                    <Form.Control
                                                        type="number"
                                                        step="0.01"
                                                        value={editedValues.costPerTon || ''}
                                                        onChange={(e) => handleCellEdit(e, 'costPerTon')}
                                                    />
                                                ) : (
                                                    post.costPerTon
                                                )}
                                            </td>
                                            <td>
                                                {editingRow === post.code ? (
                                                    <Form.Control
                                                        value={editedValues.supplierName || ''}
                                                        onChange={(e) => handleCellEdit(e, 'supplierName')}
                                                    />
                                                ) : post.supplierName}
                                            </td>
                                            <td>
                                                {editingRow === post.code ? (
                                                    <Form.Control
                                                        value={editedValues.receiverName || ''}
                                                        onChange={(e) => handleCellEdit(e, 'receiverName')}
                                                    />
                                                ) : (
                                                    post.receiverName
                                                )}
                                            </td>
                                            <td>
                                                {editingRow === post.code ? (
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
                                                <div className="d-flex gap-2">
                                                    {editingRow === post.code ? (
                                                        <>
                                                            <Button
                                                                variant="outline-success"
                                                                size="sm"
                                                                onClick={() => saveChanges(post.code)}
                                                            >
                                                                حفظ
                                                            </Button>
                                                            <Button
                                                                variant="outline-secondary"
                                                                size="sm"
                                                                onClick={cancelEditing}
                                                            >
                                                                إلغاء
                                                            </Button>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <Button
                                                                variant="outline-primary"
                                                                size="sm"
                                                                onClick={() => startEditing(post)}
                                                            >
                                                                تعديل
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
        </div>
    )
}

export default Scrapstore