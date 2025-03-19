// Employees Component: Manages employee records and operations
import React, { useEffect, useState } from 'react'
import "../Sidebar.css"
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import { useSearch } from '../../context/SearchContext';

const Store_Supervisor = () => {
    const { searchQuery } = useSearch()
    // State Management
    // Stores all employee records
    const [Posts, Setpost] = useState([])
    // Controls editing states
    const [isEditing, setIsEditing] = useState(false)
    const [editingId, setEditingId] = useState(null)
    const [editedRow, setEditedRow] = useState({})
    // Manages new employee entry form
    const [newSupplier, setNewSupplier] = useState({
        name: '',
        sendreport: '',
        Foreman_Supervisor: ''
    })
    // CRUD Operations
    // Handles form input changes
    const handleInputChange = (event) => {
        const { name, value } = event.target
        setNewSupplier({ ...newSupplier, [name]: value })
    }

    // Add new employee to the list
    const handleAddSupplier = () => {
        const newId = Posts.length ? Posts[Posts.length - 1].id + 1 : 1
        const newPost = { id: newId, ...newSupplier }
        Setpost([...Posts, newPost])
        setNewSupplier({ name: '', email: '', Foreman_Supervisor: '' })
    }

    // Start editing an existing employee
    const handleEdit = (supplier) => {
        setEditingId(supplier.id)
        setEditedRow(supplier)
        setIsEditing(true)
    }

    // Handle changes during editing
    const handleCellChange = (event, field) => {
        setEditedRow({
            ...editedRow,
            [field]: event.target.value
        })
    }

    // Save edited employee data
    const handleSave = () => {
        Setpost(Posts.map(post =>
            post.id === editingId ? editedRow : post
        ))
        setEditingId(null)
        setIsEditing(false)
        setEditedRow({})
    }

    // Cancel current operation
    const handleCancel = () => {
        setEditingId(null)
        setIsEditing(false)
        setEditedRow({})
    }

    // Delete employee record
    const handleDelete = (id) => {
        Setpost(Posts.filter(post => post.id !== id))
    }

    // Filter employees based on search term
    const filteredPosts = Posts.filter(post =>
        post.name.toLowerCase().includes(searchQuery.toLowerCase())
            ||
            post.id?.toString().includes(searchQuery)
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
    return (
        <div className=' Navvv_com Suppliers pt-3  absolute top-0 left-0 w-10/12 '>
            <Button className='mr-3 mb-2 bg-black' onClick={handlePrint}>
                طباعة التقرير
            </Button>
            <div className='Employees px-2 '>
                <div className='w-full h-full px-1' >
                    <div className='w-full'>
                        <span className='w-full '>
                            <InputGroup className="my-3 w-full">
                                <Form.Control
                                    placeholder="اسم مشرف المخازن"
                                    aria-label="اسم مشرف المخازن"
                                    name="name"
                                    value={newSupplier.name}
                                    onChange={handleInputChange}
                                />
                                <Form.Control
                                    placeholder="ارسال تقارير"
                                    aria-label="ارسال تقارير"
                                    name="sendreport"
                                    value={newSupplier.sendreport}
                                    onChange={handleInputChange}
                                    className='input'
                                />
                                <Form.Control
                                    placeholder="اسم مشرف العمال"
                                    aria-label="اسم مشرف العمال"
                                    name="Foreman_Supervisor"
                                    value={newSupplier.Foreman_Supervisor}
                                    onChange={handleInputChange}
                                    className='input'
                                />

                            </InputGroup>
                            <Button className="mb-3 bg-black" onClick={handleAddSupplier}>
                                اضافة موظف
                            </Button>
                        </span>
                    </div>
                    <Table id="Employees-table" striped bordered hover>
                        <thead>
                            <tr>
                                <th className='w-1/12' >الكود</th>
                                <th className='w-1/12' >اسم مشرف المخازن</th>
                                <th className='w-1/12' >ارسال تقارير</th>
                                <th className='w-1/12'>اسم مشرف العمال</th>
                                <th className='w-1/12'>تحديث البيانات</th>
                            </tr>
                        </thead>
                        {filteredPosts.map((post) => (
                            <tbody key={post.id}>
                                <tr>
                                    <td>{post.id}</td>
                                    <td>
                                        {editingId === post.id ? (
                                            <Form.Control
                                                value={editedRow.name}
                                                onChange={(e) => handleCellChange(e, 'name')}
                                            />
                                        ) : post.name}
                                    </td>
                                    <td>
                                        {editingId === post.id ? (
                                            <Form.Control
                                                value={editedRow.sendreport}
                                                onChange={(e) => handleCellChange(e, 'sendreport')}
                                            />
                                        ) : post.sendreport}
                                    </td>
                                    <td>
                                        {editingId === post.id ? (
                                            <Form.Control
                                                value={editedRow.Foreman_Supervisor}
                                                onChange={(e) => handleCellChange(e, 'Foreman_Supervisor')}
                                            />
                                        ) : post.Foreman_Supervisor}
                                    </td>
                                    <td>
                                        {editingId === post.id ? (
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
                                                    onClick={() => handleDelete(post.id)}
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

    )
}

export default Store_Supervisor