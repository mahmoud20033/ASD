import React, { useEffect, useState, useRef } from 'react'
import Table from 'react-bootstrap/Table';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import InputGroup from 'react-bootstrap/InputGroup';
import axios from 'axios';
import { useSearch } from '../context/SearchContext';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa'

// Suppliers Component: Manages supplier information and operations
const Suppliers = () => {
  const { searchQuery } = useSearch();
  const [Posts, Setpost] = useState([])
  const [editingId, setEditingId] = useState(null)
  // Manages new supplier entry form
  const [Suppliers, setSuppliers] = useState({
    code: '',
    supplierName: '',
    phoneNumber: '',
    dueAmount: '',
    scrapAmountInTons: ''
  });
  const [editingRow, setEditingRow] = useState(null);
  const [editedValues, setEditedValues] = useState({});
  const tableRef = useRef(null);

  // Get token from localStorage
  const getToken = () => {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    return currentUser ? currentUser.token : null;
  };

  // Get user role for permission checking
  const getUserRole = () => {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    return currentUser ? currentUser.role : null;
  };

  // Check if user has permission (manager or admin)
  const hasPermission = () => {
    const role = getUserRole();
    return role === 'manager' || role === 'admin';
  };

  // Fetch Suppliers from API
  const fetchSuppliers = async () => {
    try {
      const res = await fetch('http://localhost:8080/api/supplier');
      const data = await res.json();
      Setpost(data);
    } catch (err) {
      console.error('Error fetching Suppliers:', err);
    }
  };

  useEffect(() => {
    fetchSuppliers();
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

  // Update supplier data with API
  const saveChanges = async (postId) => {
    try {
      const token = getToken();
      if (!token) {
        alert('Please login first');
        return;
      }

      // Find the supplier by _id to get its code
      const supplierToUpdate = Posts.find(post => post._id === postId);
      if (!supplierToUpdate) {
        console.error('Supplier not found');
        return;
      }

      const res = await fetch(`http://localhost:8080/api/supplier/${supplierToUpdate.code}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(editedValues)
      });

      if (res.ok) {
        const updatedSupplier = await res.json();
        const updatedPosts = Posts.map(post =>
          post._id === postId ? updatedSupplier.data : post
        );
        Setpost(updatedPosts);
        setEditingRow(null);
        setEditedValues({});
      } else {
        console.error('Failed to update supplier');
      }
    } catch (err) {
      console.error('Error updating supplier:', err);
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

  // Handle supplier entry input changes
  const handleInputChange = (event) => {
    const { name, value } = event.target
    setSuppliers({ ...Suppliers, [name]: value })
  }

  // Add new supplier to the list and API
  const handleAddSuppliers = async () => {
    try {
      const token = getToken();
      if (!token) {
        alert('Please login first');
        return;
      }

      const supplierWithCode = {
        ...Suppliers,
        code: Suppliers.code ? parseInt(Suppliers.code) : Date.now()
      }
      const res = await fetch('http://localhost:8080/api/supplier', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(supplierWithCode)
      });
      const data = await res.json();
      Setpost([...Posts, data]);
      setSuppliers({
        code: '',
        supplierName: '',
        phoneNumber: '',
        dueAmount: '',
        scrapAmountInTons: ''
      })
    } catch (err) {
      console.error('Error adding supplier:', err);
    }
  }

  // Delete supplier using API
  const handleDelete = async (id) => {
    try {
      const token = getToken();
      if (!token) {
        alert('Please login first');
        return;
      }

      // Find the supplier by _id to get its code
      const supplierToDelete = Posts.find(post => post._id === id);
      if (!supplierToDelete) {
        console.error('Supplier not found');
        return;
      }

      const res = await fetch(`http://localhost:8080/api/supplier/${supplierToDelete.code}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (res.ok) {
        const updatedPosts = Posts.filter(post => post._id !== id)
        Setpost(updatedPosts)
        if (editingId === id) {
          setEditingId(null)
          setSuppliers({
            code: '',
            supplierName: '',
            phoneNumber: '',
            dueAmount: '',
            scrapAmountInTons: ''
          })
        }
      } else {
        console.error('Failed to delete supplier');
      }
    } catch (err) {
      console.error('Error deleting supplier:', err);
    }
  }

  // Filter Suppliers based on search
  const filteredPosts = Posts.filter(post =>
    post.supplierName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    post.code?.toString().includes(searchQuery)
  )

  // Handle report printing
  const handlePrint = () => {
    const printContent = document.getElementById('Suppliers-table');
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
            value={Suppliers.code}
            onChange={handleInputChange}
            style={{ display: hasPermission() ? 'block' : 'none' }}
          />
          <Form.Control
            placeholder="اسم المورد"
            name="supplierName"
            value={Suppliers.supplierName}
            onChange={handleInputChange}
            style={{ display: hasPermission() ? 'block' : 'none' }}
          />
          <Form.Control
            placeholder="رقم الهاتف"
            name="phoneNumber"
            value={Suppliers.phoneNumber}
            onChange={handleInputChange}
            style={{ display: hasPermission() ? 'block' : 'none' }}
          />
          <Form.Control
            placeholder="المبلغ المستحق"
            name="dueAmount"
            type="number"
            value={Suppliers.dueAmount}
            onChange={handleInputChange}
            style={{ display: hasPermission() ? 'block' : 'none' }}
          />
          <Form.Control
            placeholder="كمية الخردة"
            name="scrapAmountInTons"
            type="number"
            value={Suppliers.scrapAmountInTons}
            onChange={handleInputChange}
            style={{ display: hasPermission() ? 'block' : 'none' }}
          />
        </InputGroup>
        <Button
          className='mb-3 bg-black'
          onClick={handleAddSuppliers}
          style={{ display: hasPermission() ? 'block' : 'none' }}

        >
          اضافة مورد
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
            <Table id='Suppliers-table' striped bordered hover>
              <thead>
                <tr>
                  <th >كود</th>
                  <th >اسم المورد</th>
                  <th >رقم الهاتف</th>
                  <th >المبلغ المستحق</th>
                  <th>كمية الخردة</th>
                  <th style={{ display: hasPermission() ? 'block' : 'none' }}>تعديل</th>
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
                            value={editedValues.supplierName || ''}
                            onChange={(e) => handleCellEdit(e, 'supplierName')}
                          />
                        ) : post.supplierName}
                      </td>
                      <td>
                        {editingRow === post._id ? (
                          <Form.Control
                            value={editedValues.phoneNumber || ''}
                            onChange={(e) => handleCellEdit(e, 'phoneNumber')}
                          />
                        ) : post.phoneNumber}
                      </td>
                      <td>
                        {editingRow === post._id ? (
                          <Form.Control
                            type="number"
                            value={editedValues.dueAmount || ''}
                            onChange={(e) => handleCellEdit(e, 'dueAmount')}
                          />
                        ) : post.dueAmount}
                      </td>
                      <td>
                        {editingRow === post._id ? (
                          <Form.Control
                            type="number"
                            value={editedValues.scrapAmountInTons || ''}
                            onChange={(e) => handleCellEdit(e, 'scrapAmountInTons')}
                          />
                        ) : post.scrapAmountInTons}
                      </td>
                      <td
                        style={{ display: hasPermission() ? 'block' : 'none' }}
                      >
                        <div className="d-flex gap-2" >
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
    </div >)
}

export default Suppliers