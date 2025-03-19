import React, { useEffect, useState } from 'react'
import "./Sidebar.css"
import Table from 'react-bootstrap/Table';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import InputGroup from 'react-bootstrap/InputGroup';
import axios from 'axios';
import { useSearch } from '../context/SearchContext';

// Clients Component: Manages client information and operations
const Clients = () => {
    const { searchQuery } = useSearch();
    // State Management
    // Stores all client records
    const [Posts, Setpost] = useState([])
    // Controls editing states
    const [editingId, setEditingId] = useState(null)
    // Manages new client entry form
    const [newScrap, setNewScrap] = useState({
        name: '',
        Quantity: '',
        date: new Date().toISOString().split('T')[0]
    })
    // Row Editing Logic
    // Tracks current row being edited
    const [editingRow, setEditingRow] = useState(null);
    // Temporarily stores edited values
    const [editedValues, setEditedValues] = useState({});

    // CRUD Operations
    // Initiates row editing
    const startEditing = (post) => {
        setEditingRow(post.id);
        setEditedValues({ ...post });
    };

    // Function to save changes after editing
    const saveChanges = (postId) => {
        const updatedPosts = Posts.map(post =>
            post.id === postId ? { ...editedValues } : post
        );
        Setpost(updatedPosts);
        setEditingRow(null);
        setEditedValues({});
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

    // Handle material entry input changes
    const handleInputChange = (event) => {
        const { name, value } = event.target
        setNewScrap({ ...newScrap, [name]: value })
    }

    // Add or update raw material entry
    const handleAddScrap = () => {
        if (editingId !== null) {
            // Update existing scrap
            const updatedPosts = Posts.map(post =>
                post.id === editingId ? { ...newScrap, id: editingId } : post
            )
            Setpost(updatedPosts)
            setEditingId(null)
        } else {
            // Add new scrap
            const newId = Posts.length ? Posts[Posts.length - 1].id + 1 : 1
            const newPost = { id: newId, ...newScrap }
            Setpost([...Posts, newPost])
        }
        setNewScrap({
            name: '',
            Quantity: '',
            date: new Date().toISOString().split('T')[0]
        })
    }

    // Delete raw material entry
    const handleDelete = (id) => {
        const updatedPosts = Posts.filter(post => post.id !== id)
        Setpost(updatedPosts)
        if (editingId === id) {
            setEditingId(null)
            setNewScrap({
                name: '',
                Quantity: '',
                date: new Date().toISOString().split('T')[0],
            })
        }
    }

    // Filter materials based on search
    const filteredPosts = Posts.filter(post =>
        post.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.id?.toString().includes(searchQuery)
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
        <div className='Suppliers absolute pt-3  top-0 left-0 w-10/12 max-w-50 '>
            <div className='w-full h-full px-1' >
                <Button className='my-2 bg-black' onClick={handlePrint}>
                    طباعة التقرير
                </Button>
                <InputGroup className="my-3">

                    <Form.Control
                        placeholder="الاسم"
                        name="name"
                        value={newScrap.name}
                        onChange={handleInputChange}
                    />
                    <Form.Control
                        placeholder="الكمية"
                        name="Quantity"
                        type="number"
                        step="0.01"
                        value={newScrap.Quantity}
                        onChange={handleInputChange}
                    />
                    <Form.Control
                        type="date"
                        name="date"
                        value={newScrap.date}
                        onChange={handleInputChange}
                    />
                </InputGroup>
                <Button className='mb-3 bg-black' onClick={handleAddScrap}>
                    إضافة عملاء
                </Button>
                <Table id="Clients-table" striped bordered hover>
                    <thead>
                        <tr>
                            <th className='w-1/12'>الكود</th>
                            <th className='w-2/12'>اسم المورد</th>
                            <th className='w-2/12'>الكمية</th>
                            <th className='w-2/12'>تاريخ الاستلام</th>
                            <th className='w-1/12'>تعديل</th>
                        </tr>
                    </thead>
                    {

                        filteredPosts.map((post) => (
                            <tbody key={post.id}>
                                <tr>
                                    <td>{post.id}</td>
                                    <td>
                                        {editingRow === post.id ? (
                                            <Form.Control
                                                value={editedValues.name}
                                                onChange={(e) => handleCellEdit(e, 'name')}
                                            />
                                        ) : post.name}
                                    </td>
                                    <td>
                                        {editingRow === post.id ? (
                                            <Form.Control
                                                type="number"
                                                step="0.01"
                                                value={editedValues.Quantity}
                                                onChange={(e) => handleCellEdit(e, 'Quantity')}
                                            />
                                        ) : post.Quantity}
                                    </td>
                                    <td>
                                        {editingRow === post.id ? (
                                            <Form.Control
                                                type="date"
                                                value={editedValues.date}
                                                onChange={(e) => handleCellEdit(e, 'date')}
                                            />
                                        ) : post.date}
                                    </td>

                                    <td>
                                        <div className="d-flex gap-2">
                                            {editingRow === post.id ? (
                                                <>
                                                    <Button
                                                        variant="outline-success"
                                                        size="sm"
                                                        onClick={() => saveChanges(post.id)}
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
                                                        onClick={() => handleDelete(post.id)}
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
    )

}

export default Clients