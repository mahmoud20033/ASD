// Component for managing user permissions and access control
import React, { useEffect, useState } from 'react'
import "./Sidebar.css"
import axios from 'axios';
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import { FaEdit, FaSave, FaTimes } from 'react-icons/fa'

const Pouvoirs = () => {
    // State for storing user permissions
    const [Posts, Setpost] = useState([])
    // State for search functionality
    const [searchTerm, setSearchTerm] = useState('')
    // States for editing functionality
    const [isEditing, setIsEditing] = useState(false)
    // State for new user permissions
    const [newSupplier, setNewSupplier] = useState({
        name: '',
        permissions: {
            canView: false,
            canEdit: false,
            canDelete: false,
            pages: {
                dashboard: false,
                inventory: false,
                sales: false,
                reports: false
            }
        }
    })
    const [editingRow, setEditingRow] = useState(null);

    // Functions for editing operations
    const startEditing = (postId) => {
        setEditingRow(postId);
    };

    const saveChanges = (postId) => {
        setEditingRow(null);
    };

    const cancelEditing = () => {
        setEditingRow(null);
    };

    // useEffect(() => {
    //   axios.get("https://jsonplaceholder.typicode.com/users")
    //     .then((res) => {
    //       Setpost(res.data)
    //       console.log(res.data);
    //     })
    // }, [])

    // Updates the newSupplier state when input fields change
    const handleInputChange = (event) => {
        const { name, value } = event.target
        setNewSupplier({ ...newSupplier, [name]: value })
    }

    // Adds a new supplier to the Posts array with auto-generated ID
    const handleAddSupplier = () => {
        const newId = Posts.length ? Posts[Posts.length - 1].id + 1 : 1
        const newPost = { id: newId, ...newSupplier }
        Setpost([...Posts, newPost])
        setNewSupplier({ name: '', email: '', count: '' })
    }

    // Deletes a supplier from the Posts array
    const handleDelete = (id) => {
        Setpost(Posts.filter(post => post.id !== id))
    }

    // Resets the form and exits edit mode
    // const handleCancel = () => {
    //     setNewSupplier({ name: '', id: null })
    //     setIsEditing(false)
    // }

    // Updates search term state for filtering suppliers
    const handleSearch = (event) => {
        setSearchTerm(event.target.value)
    }

    // Handle printing functionality
    const handlePrint = () => {
        const printContent = document.getElementById('suppliers-table');
        const windowPrint = window.open('', '', 'width=900,height=600');
        windowPrint.document.write(`
              ${printContent.outerHTML}
        `);
        windowPrint.document.close();
        windowPrint.focus();
        windowPrint.print();
        windowPrint.close();
    };

    // Handle permission toggles for users
    const handlePermissionToggle = (userId, permission) => {
        Setpost(Posts.map(post => {
            if (post.id === userId) {
                return {
                    ...post,
                    permissions: {
                        ...post.permissions,
                        [permission]: !post.permissions?.[permission]
                    }
                }
            }
            return post;
        }));
    }

    // Handle page access permissions
    const handlePagePermissionToggle = (userId, page) => {
        Setpost(Posts.map(post => {
            if (post.id === userId) {
                return {
                    ...post,
                    permissions: {
                        ...post.permissions,
                        pages: {
                            ...post.permissions?.pages,
                            [page]: !post.permissions?.pages?.[page]
                        }
                    }
                }
            }
            return post;
        }));
    }

    const filteredPosts = Posts.filter(post =>
        post.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.id.toString().includes(searchTerm)
    );
    return (
        <div className=' Suppliers absolute top-0 left-0 w-10/12 '>
            <div className=' px-1 scroll-p-0	' >
                <div className='w-full h-full px-1' >
                    <div className='w-full'>
                        <div className='flex justify-between mb-3'>
                            <Button className='bg-black' onClick={handlePrint}>
                                طباعة التقرير
                            </Button>
                        </div>
                        <span className='w-full '>
                            <Form.Control
                                value={searchTerm}
                                onChange={handleSearch}
                                className='w-full text-center py-2'
                                label="asc"
                                placeholder='البحث عن طريق الكود او الاسم'
                            />
                            <InputGroup className="my-3 w-full">
                                <Form.Control
                                    placeholder="اسم المورد"
                                    aria-label="اسم المورد"
                                    name="name"
                                    value={newSupplier.name}
                                    onChange={handleInputChange}
                                />
                            </InputGroup>
                            {isEditing ? (
                                <div>
                                    {/* <Button className="mb-3 me-2" variant="outline-primary" onClick={handleUpdateSupplier}>
                                        Update Supplier
                                    </Button> */}
                                    <Button className="mb-3" variant="outline-danger" onClick={handleCancel}>
                                        Cancel
                                    </Button>
                                </div>
                            ) : (
                                <Button className="mb-3 bg-black"  onClick={handleAddSupplier}>
                                    Add Supplier
                                </Button>
                            )}
                        </span>
                    </div>
                    <Table id="suppliers-table" striped bordered hover>
                        <thead>
                            <tr>
                                <th className='w-1/8'>الكود</th>
                                <th className='w-3/8'>اسم العامل</th>
                                <th className='w-1/8'>لوحة التحكم</th>
                                <th className='w-1/8'>عرض</th>
                                <th className='w-1/8'>تعديل</th>
                                <th className='w-1/8'>حذف</th>
                                <th className='w-1/8'>المخزون</th>
                                <th className='w-1/8'>المبيعات</th>
                                <th className='w-1/8'>التقارير</th>
                                <th className='w-1/8'>اجراءات</th>
                            </tr>
                        </thead>
                        {filteredPosts.map((post) => (
                            <tbody key={post.id}>
                                <tr>
                                    <td>{post.id}</td>
                                    <td>
                                        {editingRow === post.id ? (
                                            <div className="d-flex align-items-center">
                                                <Form.Control
                                                    type="text"
                                                    value={post.name}
                                                    onChange={(e) => {
                                                        const updatedPosts = Posts.map(p =>
                                                            p.id === post.id ? { ...p, name: e.target.value } :
                                                                p
                                                        );
                                                        Setpost(updatedPosts);
                                                    }}
                                                    size="sm"
                                                />
                                            </div>
                                        ) : post.name}
                                    </td>
                                    {['canView', 'canEdit', 'canDelete'].map((permission) => (
                                        <td key={permission}>
                                            <div className="d-flex align-items-center justify-content-between">
                                                <Form.Check
                                                    type="checkbox"
                                                    checked={post.permissions?.[permission] || false}
                                                    onChange={() => handlePermissionToggle(post.id, permission)}
                                                    disabled={editingRow !== post.id}
                                                />
                                            </div>
                                        </td>
                                    ))}
                                    {['dashboard', 'inventory', 'sales', 'reports'].map((page) => (
                                        <td key={page}>
                                            <div className="d-flex align-items-center justify-content-between">
                                                <Form.Check
                                                    type="checkbox"
                                                    checked={post.permissions?.pages?.[page] || false}
                                                    onChange={() => handlePagePermissionToggle(post.id, page)}
                                                    disabled={editingRow !== post.id}
                                                />
                                            </div>
                                        </td>
                                    ))}
                                    <td>
                                        <div className="d-flex gap-2">
                                            {editingRow === post.id ? (
                                                <>
                                                    <Button
                                                        variant="outline-success"
                                                        size="sm"
                                                        onClick={() => saveChanges(post.id)}
                                                    >
                                                        <FaSave /> حفظ
                                                    </Button>
                                                    <Button
                                                        variant="outline-danger"
                                                        size="sm"
                                                        onClick={cancelEditing}
                                                    >
                                                        <FaTimes /> الغاء
                                                    </Button>
                                                </>
                                            ) : (
                                                <>
                                                    <Button
                                                        variant="outline-primary"
                                                        size="sm"
                                                        onClick={() => startEditing(post.id)}
                                                    >
                                                        <FaEdit /> تعديل
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
                        ))}
                    </Table>
                </div>
            </div>
        </div>
    )
}

export default Pouvoirs