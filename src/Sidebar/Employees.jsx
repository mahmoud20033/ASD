// Component for managing employee data and operations
import React, { useEffect, useState } from 'react'
import "./Sidebar.css"
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';

const Employees = () => {
    // State for storing employee records
    const [Posts, Setpost] = useState([])
    // State for search functionality
    const [searchTerm, setSearchTerm] = useState('')
    // States for editing functionality
    const [isEditing, setIsEditing] = useState(false)
    const [editingId, setEditingId] = useState(null)
    const [editedRow, setEditedRow] = useState({})
    // State for new employee data
    const [newSupplier, setNewSupplier] = useState({
        name: '',
        phone: '',
        Type: '',
    })

    // Handle input changes for new employee form
    const handleInputChange = (event) => {
        const { name, value } = event.target
        setNewSupplier({ ...newSupplier, [name]: value })
    }

    // Add new employee to the list
    const handleAddSupplier = () => {
        const newId = Posts.length ? Posts[Posts.length - 1].id + 1 : 1
        const newPost = { id: newId, ...newSupplier }
        Setpost([...Posts, newPost])
        setNewSupplier({ name: '', email: '', Type: '' })
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
        setNewSupplier({ name: '', phone: '', Type: '', id: null })
        setIsEditing(false)
    }

    // Handle search input changes
    const handleSearch = (event) => {
        setSearchTerm(event.target.value)
    }

    // Delete employee record
    const handleDelete = (id) => {
        Setpost(Posts.filter(post => post.id !== id))
    }

    // Filter employees based on search term
    const filteredPosts = Posts.filter(post =>
        post.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.Type.toLowerCase().includes(searchTerm.toLowerCase())
    )

    return (
        <div className=' Navvv_com Suppliers  absolute top-0 left-0 w-10/12 '>
            <div className='Employees px-2 '>
                <div className='w-full h-full px-1' >
                    <div className='w-full'>
                        <span className='w-full '>
                            <Form.Control
                                value={searchTerm}
                                onChange={handleSearch}
                                className='w-full text-center py-2'
                                label="asc"
                                placeholder='البحث عن طريق الاسم او نوع الوظيفة'
                            />
                            <InputGroup className="my-3 w-full">
                                <Form.Control
                                    placeholder="اسم الموظف"
                                    aria-label="اسم الموظف"
                                    name="name"
                                    value={newSupplier.name}
                                    onChange={handleInputChange}
                                />
                                <Form.Control
                                    placeholder="رقم الهاتف"
                                    aria-label="رقم الهاتف"
                                    name="phone"
                                    value={newSupplier.phone}
                                    onChange={handleInputChange}
                                    className='input'
                                />
                                <Form.Select
                                    placeholder="نوع العامل"
                                    aria-label="نوع العامل"
                                    name="Type"
                                    value={newSupplier.Type}
                                    onChange={handleInputChange}
                                    className='input'
                                >
                                    <option value="مشرف عمال">مشرف عمال</option>
                                    <option value="مشرف مخازن">مشرف مخازن</option>
                                    <option value="عامل">عامل</option>

                                </Form.Select>
                            </InputGroup>
                            <Button className="mb-3 bg-black" variant="outline-secondary" onClick={handleAddSupplier}>
                                Add Supplier
                            </Button>
                        </span>
                    </div>
                    <Table striped bordered hover>
                        <thead>
                            <tr>
                                <th className='w-1/8' >الكود</th>
                                <th className='w-3/8' >اسم الموظف</th>
                                <th className='w-2/8' >رقم الهاتف</th>
                                <th className='w-2/8'>نوع الموظف</th>
                                <th className='w-1/8'>تحديث البيانات</th>
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
                                                value={editedRow.phone}
                                                onChange={(e) => handleCellChange(e, 'phone')}
                                            />
                                        ) : post.phone}
                                    </td>
                                    <td>
                                        {editingId === post.id ? (
                                            <Form.Select
                                                value={editedRow.Type}
                                                onChange={(e) => handleCellChange(e, 'Type')}
                                            >
                                                <option value="مشرف عمال">مشرف عمال</option>
                                                <option value="مشرف مخازن">مشرف مخازن</option>
                                                <option value="عامل">عامل</option>
                                            </Form.Select>
                                        ) : post.Type}
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

export default Employees