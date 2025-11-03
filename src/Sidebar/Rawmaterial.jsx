// Raw Materials Component: Manages inventory and transactions of raw materials
import React, { useEffect, useState, useRef } from 'react'
import Table from 'react-bootstrap/Table';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import InputGroup from 'react-bootstrap/InputGroup';
import { useSearch } from '../context/SearchContext';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

const Rawmaterial = () => {
    const { searchQuery } = useSearch();
    const [Posts, Setpost] = useState([])
    const [editingId, setEditingId] = useState(null)
    const [Rawmaterial, setRawmaterial] = useState({
        code: '',
        name: '',
        quantity: '',
        expense: '',
        costPerTon: '',
        exportDate: new Date().toISOString().split('T')[0],
        sorting: '',
        workerName: '',
        workerSupervisorName: '',
        storeSupervisorName: ''
    })
    const [editingRow, setEditingRow] = useState(null);
    const [editedValues, setEditedValues] = useState({});

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
    const fetchRawMaterials = async () => {
        try {
            const res = await fetch('http://localhost:8080/api/Material')
            const data = await res.json()
            Setpost(data)
        } catch (err) {
            console.error('Error fetching raw materials:', err)
        }
    }
    const startEditing = (post) => {
        setEditingRow(post._id);
        setEditedValues({ ...post });
    };
    const saveChanges = async (postId) => {
        try {
            const token = getToken();
            if (!token) {
                alert('Please login first');
                return;
            }

            // Find the material by _id to get its code
            const materialToUpdate = Posts.find(post => post._id === postId);
            if (!materialToUpdate) {
                console.error('Material not found');
                return;
            }

            const res = await fetch(`http://localhost:8080/api/Material/${materialToUpdate.code}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(editedValues)
            });

            if (res.ok) {
                const updatedItem = await res.json();
                const updatedPosts = Posts.map(post =>
                    post._id === postId ? updatedItem : post
                );
                Setpost(updatedPosts);
                setEditingRow(null);
                setEditedValues({});
            } else {
                console.error('Failed to update item');
            }
        } catch (err) {
            console.error('Error updating raw material:', err);
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
    const handleInputChange = (event) => {
        const { name, value } = event.target
        setRawmaterial({ ...Rawmaterial, [name]: value })
    }
    const handleAddRawmaterial = async () => {
        if (editingId !== null) {
            try {
                const token = getToken();
                if (!token) {
                    alert('Please login first');
                    return;
                }

                // Find the material by _id to get its code
                const materialToUpdate = Posts.find(post => post._id === editingId);
                if (!materialToUpdate) {
                    console.error('Material not found');
                    return;
                }

                const res = await fetch(`http://localhost:8080/api/Material/${materialToUpdate.code}`, {
                    method: 'PUT',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(Rawmaterial)
                });

                if (res.ok) {
                    const updatedItem = await res.json();
                    const updatedPosts = Posts.map(post =>
                        post._id === editingId ? updatedItem : post
                    );
                    Setpost(updatedPosts);
                    setEditingId(null);
                }
            } catch (err) {
                console.error('Error updating raw material:', err);
            }
        } else {
            try {
                const token = getToken();
                if (!token) {
                    alert('Please login first');
                    return;
                }

                const newRaw = { ...Rawmaterial }
                const res = await fetch('http://localhost:8080/api/Material', {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(newRaw)
                })
                const saved = await res.json()
                Setpost([...Posts, saved])
            } catch (err) {
                console.error('Error adding raw material:', err)
            }
        }
        setRawmaterial({
            code: '',
            name: '',
            quantity: '',
            expense: '',
            costPerTon: '',
            exportDate: new Date().toISOString().split('T')[0],
            sorting: '',
            workerName: '',
            workerSupervisorName: '',
            storeSupervisorName: ''
        })
    }

    // Delete raw material entry from API
    const handleDelete = async (id) => {
        try {
            const token = getToken();
            if (!token) {
                alert('Please login first');
                return;
            }

            // Find the material by _id to get its code
            const materialToDelete = Posts.find(post => post._id === id);
            if (!materialToDelete) {
                console.error('Material not found');
                return;
            }

            const res = await fetch(`http://localhost:8080/api/Material/${materialToDelete.code}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (res.ok) {
                Setpost(Posts.filter(post => post._id !== id));
            } else {
                console.error('Failed to delete item');
            }
        } catch (err) {
            console.error('Error deleting raw material:', err);
        }
    }

    // Filter materials based on search
    const filteredPosts = Posts.filter(post =>
        post.quantity?.toString().toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.code?.toString().includes(searchQuery)
    )

    // Handle report printing
    const handlePrint = () => {
        const printContent = document.getElementById('Rawmaterial-table');
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

    useEffect(() => {
        fetchRawMaterials()
    }, [])

    return (
        <div className='Suppliers pt-2 px-2'>
            <div className='w-full h-full px-1' >
                <Button className='my-2  bg-black' onClick={handlePrint}>
                    طباعة التقرير
                </Button>
                <InputGroup className="my-3">
                    <Form.Control
                        placeholder="الكود"
                        name="code"
                        value={Rawmaterial.code}
                        onChange={handleInputChange}
                        style={{ display: hasPermission() ? 'block' : 'none' }}

                    />
                    <Form.Control
                        placeholder="الاسم"
                        name="name"
                        value={Rawmaterial.name}
                        onChange={handleInputChange}
                        style={{ display: hasPermission() ? 'block' : 'none' }}

                    />
                    <Form.Control
                        placeholder="الكمية المدخلة"
                        name="quantity"
                        type="number"
                        step="0.01"
                        value={Rawmaterial.quantity}
                        onChange={handleInputChange}
                        style={{ display: hasPermission() ? 'block' : 'none' }}

                    />
                    <Form.Control
                        placeholder="الكمية المنصرفة"
                        name="expense"
                        type="number"
                        step="0.01"
                        value={Rawmaterial.expense}
                        onChange={handleInputChange}
                        style={{ display: hasPermission() ? 'block' : 'none' }}

                    />
                    <Form.Control
                        placeholder="تكلفة الطن"
                        name="costPerTon"
                        type="number"
                        step="0.01"
                        value={Rawmaterial.costPerTon}
                        onChange={handleInputChange}
                        style={{ display: hasPermission() ? 'block' : 'none' }}

                    />
                    <Form.Control
                        type="date"
                        name="exportDate"
                        value={Rawmaterial.exportDate}
                        onChange={handleInputChange}
                        style={{ display: hasPermission() ? 'block' : 'none' }}
                    />
                    <Form.Control
                        placeholder="فرز"
                        name="sorting"
                        value={Rawmaterial.sorting}
                        onChange={handleInputChange}
                        style={{ display: hasPermission() ? 'block' : 'none' }}

                    />


                    <Form.Control
                        placeholder='اسم العامل'
                        name="workerName"
                        value={Rawmaterial.workerName}
                        onChange={handleInputChange}
                        style={{ display: hasPermission() ? 'block' : 'none' }}

                    />
                    <Form.Control
                        placeholder='اسم مشرف العمال'
                        name="workerSupervisorName"
                        value={Rawmaterial.workerSupervisorName}
                        onChange={handleInputChange}
                        style={{ display: hasPermission() ? 'block' : 'none' }}

                    />
                    <Form.Control
                        placeholder='اسم مشرف المخازن'
                        name="storeSupervisorName"
                        value={Rawmaterial.storeSupervisorName}
                        onChange={handleInputChange}
                        style={{ display: hasPermission() ? 'block' : 'none' }}

                    />
                </InputGroup>
                <Button
                    className='mb-3 bg-black'
                    onClick={handleAddRawmaterial}
                    style={{ display: hasPermission() ? 'block' : 'none' }}

                >
                    اضافة مادة خام
                </Button>
                <div className="relative">
                    <button
                        onClick={() => scroll('left')}
                        className="absolute left-0 top-1/2 z-10 bg-gray-800
                         text-white p-2 rounded-full opacity-70 hover:opacity-100"
                        style={{ transform: 'translateY(-50%)' }}
                    >
                        <FaChevronLeft />
                    </button>
                    <button
                        onClick={() => scroll('right')}
                        className="absolute right-0 top-1/2 z-10 bg-gray-800
                         text-white p-2 rounded-full opacity-70 hover:opacity-100"
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
                        <Table id="Rawmaterial-table" striped bordered hover>
                            <thead>
                                <tr className='text-center'>
                                    <th >الكود</th>
                                    <th >الاسم</th>
                                    <th >الكمية</th>
                                    <th >الصرف</th>
                                    <th >تكلفة الطن</th>
                                    <th >موعد التصدير</th>
                                    <th >فرز</th>
                                    <th >اسم العامل</th>
                                    <th >اسم مشرف العمال</th>
                                    <th >اسم مشرف المخازن</th>
                                    <th className='w-full'
                                        style={{
                                            display: hasPermission() ? 'block' : 'none'
                                        }}
                                    >تعديل</th>
                                </tr>
                            </thead>
                            {
                                filteredPosts.map((post) => (
                                    <tbody key={post._id}>
                                        <tr>
                                            <td>{post.code}</td>
                                            <td>
                                                {editingRow === post._id ? (
                                                    <Form.Control
                                                        value={editedValues.name}
                                                        onChange={(e) =>
                                                            handleCellEdit(e, 'name')}
                                                    />
                                                ) : post.name}
                                            </td>
                                            <td>
                                                {editingRow === post._id ? (
                                                    <Form.Control
                                                        type="number"
                                                        step="0.01"
                                                        value={editedValues.quantity}
                                                        onChange={(e) =>
                                                            handleCellEdit(e, 'quantity')}
                                                    />
                                                ) : post.quantity}
                                            </td>
                                            <td>
                                                {editingRow === post._id ? (
                                                    <Form.Control
                                                        type="number"
                                                        step="0.01"
                                                        value={editedValues.expense}
                                                        onChange={(e) =>
                                                            handleCellEdit(e, 'expense')}
                                                    />
                                                ) : post.expense}
                                            </td>
                                            <td>
                                                {editingRow === post._id ? (
                                                    <Form.Control
                                                        type="number"
                                                        step="0.01"
                                                        value={editedValues.costPerTon}
                                                        onChange={(e) =>
                                                            handleCellEdit(e, 'costPerTon')}
                                                    />
                                                ) : post.costPerTon}
                                            </td>

                                            <td>
                                                {editingRow === post._id ? (
                                                    <Form.Control
                                                        type="date"
                                                        value={editedValues.exportDate?.split('T')[0]}
                                                        onChange={(e) =>
                                                            handleCellEdit(e, 'exportDate')}
                                                    />
                                                ) : post.exportDate?.split('T')[0]}
                                            </td>
                                            <td>
                                                {editingRow === post._id ? (
                                                    <Form.Control
                                                        value={editedValues.sorting}
                                                        onChange={(e) =>
                                                            handleCellEdit(e, 'sorting')}
                                                    />
                                                ) : post.sorting}
                                            </td>
                                            <td>
                                                {editingRow === post._id ? (
                                                    <Form.Control
                                                        value={editedValues.workerName}
                                                        onChange={(e) =>
                                                            handleCellEdit(e, 'workerName')}
                                                    />
                                                ) : post.workerName}
                                            </td>
                                            <td>
                                                {editingRow === post._id ? (
                                                    <Form.Control
                                                        value={editedValues.workerSupervisorName}
                                                        onChange={(e) =>
                                                            handleCellEdit(e, 'workerSupervisorName')}
                                                    />
                                                ) : post.workerSupervisorName}
                                            </td>
                                            <td>
                                                {editingRow === post._id ? (
                                                    <Form.Control
                                                        value={editedValues.storeSupervisorName}
                                                        onChange={(e) =>
                                                            handleCellEdit(e, 'storeSupervisorName')}
                                                    />
                                                ) : post.storeSupervisorName}
                                            </td>
                                            <td
                                                style={{ display: hasPermission() ? 'block' : 'none' }}
                                            >
                                                <div className="d-flex gap-2">
                                                    {editingRow === post._id ? (
                                                        <>
                                                            <Button
                                                                variant="outline-success"
                                                                size="sm"
                                                                onClick={() => saveChanges(post._id)}
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

export default Rawmaterial