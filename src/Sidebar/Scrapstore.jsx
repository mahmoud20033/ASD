import React, { useEffect, useState } from 'react'
import "./Sidebar.css"
import Table from 'react-bootstrap/Table';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import InputGroup from 'react-bootstrap/InputGroup';
import { useSearch } from '../context/SearchContext';

/**
 * Scrapstore component manages inventory of scrap materials.
 * Provides functionality for adding, editing, deleting, and searching scrap items.
 * Includes a printable report feature.
 */
const Scrapstore = () => {
    const { searchQuery } = useSearch();
    /**
     * State Management:
     * Posts: Array of all scrap items
     * searchTerm: Current search filter
     * editingRow: ID of row being edited
     * editedValues: Temporary storage for edit changes
     * newScrap: Form data for new scrap entries
     */
    const [Posts, Setpost] = useState([])
    // Stores the current search term for filtering
    // ID of the item being edited (legacy - can be removed)
    const [editingId, setEditingId] = useState(null)
    // State for new scrap item form
    const [newScrap, setNewScrap] = useState({
        Quantity: '',
        Type: 'علب الكنز',
        Cost: '',
        name_receive: '',
        date_send: '',
        date_receive: ''
    })
    // ID of the row currently being edited in the table
    const [editingRow, setEditingRow] = useState(null);
    // Temporarily stores the edited values while editing a row
    const [editedValues, setEditedValues] = useState({});

    /**
     * Row Editing Functions:
     * startEditing: Initiates edit mode for a row
     * saveChanges: Commits edited values to main state
     * cancelEditing: Abandons current edit operation
     * handleCellEdit: Updates temporary edit state
     */
    const startEditing = (post) => {
        setEditingRow(post.id)
        setEditedValues({ ...post })
    }
    // Saves the edited values back to the main Posts state
    const saveChanges = (postId) => {
        const updatedPosts = Posts.map(post =>
            post.id === postId ? editedValues : post
        );
        Setpost(updatedPosts);
        setEditingRow(null);
        setEditedValues({})
    }
    // Cancels the editing mode without saving changes
    const cancelEditing = () => {
        setEditingRow(null);
        setEditedValues({});
    }
    // Handles changes in cell values during editing
    const handleCellEdit = (e, field) => {
        setEditedValues({
            ...editedValues,
            [field]: e.target.value
        })
    }

    /**
     * Generates a printable version of the scrap inventory table
     * Opens in new window for printing
     */
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

    /**
     * Form Handlers:
     * handleSearch: Updates search filter
     * handleInputChange: Updates new scrap form fields
     * handleAddScrap: Creates new scrap entry
     * handleDelete: Removes scrap entry
     */
    const handleInputChange = (event) => {
        const { name, value } = event.target
        setNewScrap({ ...newScrap, [name]: value })
    }

    // Adds a new scrap item to the Posts array
    const handleAddScrap = () => {
        // Add new scrap
        const newId = Posts.length ? Posts[Posts.length - 1].id + 1 : 1
        const newPost = { id: newId, ...newScrap }
        Setpost([...Posts, newPost])

        setNewScrap({
            Quantity: '',
            Type: 'علب الكنز',
            Cost: '',
            name_receive: '',
            date_send: '',
            date_receive: ''
        })
    }

    // Deletes a scrap item from the Posts array
    const handleDelete = (id) => {
        Setpost(Posts.filter(post => post.id !== id))
    }

    // Filters posts based on search term
    const filteredPosts = Posts.filter(post =>
        post.Type?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.id?.toString().includes(searchQuery)
    )
    return (

        // Main container for the scrap store interface
        <div className='Suppliers absolute pt-3 top-0 left-0 w-10/12 '>
            <div className='w-full h-full px-1' >
                {/* Print report button */}
                <Button className='my-2 bg-black' onClick={handlePrint}>
                    طباعة التقرير
                </Button>
                {/* New scrap input form */}
                <InputGroup className="my-3">

                    <Form.Control
                        placeholder="الكمية"
                        name="Quantity"
                        type="number"
                        step="0.01"
                        value={newScrap.Quantity}
                        onChange={handleInputChange}
                    />
                    <Form.Select
                        placeholder="النوع"
                        name="Type"
                        value={newScrap.Type}
                        onChange={handleInputChange}
                    >
                    </Form.Select>
                    <Form.Control
                        placeholder="تكلفة الطن"
                        name="Cost"
                        type="number"
                        step="0.01"
                        value={newScrap.Cost}
                        onChange={handleInputChange}
                    />
                    <Form.Control
                        type="date"
                        name="date_send"
                        value={newScrap.date_send}
                        onChange={handleInputChange}
                    />
                    <Form.Control
                        type="date"
                        name="date_receive"
                        value={newScrap.date_receive}
                        onChange={handleInputChange}
                    />
                    <Form.Control
                        placeholder="اسم المستلم"
                        name="name_receive"
                        value={newScrap.name_receive}
                        onChange={handleInputChange}
                    />
                </InputGroup>
                <Button className='mb-3 bg-black' onClick={handleAddScrap}>
                    إضافة خردة
                </Button>
                {/* Scrap items table */}
                <Table id='Scrapstore-table' striped bordered hover>
                    <thead>
                        <tr>
                            <th className='w-1/12'>الكود</th>
                            <th className='w-1/12'>الكمية</th>
                            <th className='w-1/12'>النوع</th>
                            <th className='w-1/12'>تكلفة الطن</th>
                            <th className='w-1/12'>موعد التسليم</th>
                            <th className='w-1/12'>موعدالاستلام</th>
                            <th className='w-1/12'>اسم المستلم</th>
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
                                                type="number"
                                                step="0.01"
                                                value={editedValues.Quantity || ''}
                                                onChange={(e) => handleCellEdit(e, 'Quantity')}
                                            />
                                        ) : (
                                            post.Quantity
                                        )}
                                    </td>
                                    <td>
                                        {editingRow === post.id ? (
                                            <Form.Select
                                                value={editedValues.Type || ''}
                                                onChange={(e) => handleCellEdit(e, 'Type')}
                                            >
                                                <option value="علب الكنز">علب الكنز</option>
                                                {/* Add more options as needed */}
                                            </Form.Select>
                                        ) : (
                                            post.Type
                                        )}
                                    </td>
                                    <td>
                                        {editingRow === post.id ? (
                                            <Form.Control
                                                type="number"
                                                step="0.01"
                                                value={editedValues.Cost || ''}
                                                onChange={(e) => handleCellEdit(e, 'Cost')}
                                            />
                                        ) : (
                                            post.Cost
                                        )}
                                    </td>
                                    <td>
                                        {editingRow === post.id ? (
                                            <Form.Control
                                                type="date"
                                                value={editedValues.date}
                                                onChange={(e) => handleCellEdit(e, 'date_send')}
                                            />
                                        ) : post.date_send}
                                    </td>
                                    <td>
                                        {editingRow === post.id ? (
                                            <Form.Control
                                                type="date"
                                                value={editedValues.date}
                                                onChange={(e) => handleCellEdit(e, 'date_receive')}
                                            />
                                        ) : post.date_receive}
                                    </td>

                                    <td>
                                        {editingRow === post.id ? (
                                            <Form.Control
                                                value={editedValues.name_receive || ''}
                                                onChange={(e) => handleCellEdit(e, 'name_receive')}
                                            />
                                        ) : (
                                            post.name_receive
                                        )}
                                    </td>
                                    <td>
                                        {editingRow === post.id ? (
                                            <div className="d-flex gap-2">
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
                                            </div>
                                        ) : (
                                            <div className="d-flex gap-2">
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
                                            </div>
                                        )}
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

export default Scrapstore