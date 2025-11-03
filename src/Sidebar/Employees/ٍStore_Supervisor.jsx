import React, { useState, useRef, useEffect } from 'react'
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import { useSearch } from '../../context/SearchContext';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

const Store_Supervisor = () => {
    const { searchQuery } = useSearch()
    const [managerPosts, setManagerPosts] = useState([])
    const tableRef = useRef(null);

    // Fetch managers from API
    const fetchManagers = async () => {
        try {
            const res = await fetch('http://localhost:8080/api/managers');
            if (!res.ok) {
                throw new Error('Failed to fetch managers');
            }
            const data = await res.json();
            setManagerPosts(data);
        } catch (err) {
            console.error('Error fetching managers:', err);
            alert('Failed to fetch managers. Please refresh the page.');
        }
    }

    useEffect(() => {
        fetchManagers();
    }, []);

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

    // Filter manager posts based on search query
    const filteredManagerPosts = managerPosts.filter(post =>
        post.workerSupervisorName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.storeSupervisorName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.code?.toString().includes(searchQuery)
    );

    return (
        <div className='Navvv_com Suppliers pt-3'>
            <Button className='mr-3 mb-2 bg-black' onClick={handlePrint}>
                طباعة التقرير
            </Button>
            <div className='Employees px-2'>
                <div className='w-full h-full px-1'>
                    <div className="relative mt-4">
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
                                        <th className='w-1/12'>الكود</th>
                                        <th className='w-1/12'>اسم مشرف المخازن</th>
                                        <th className='w-1/12'>اسم مشرف العمال</th>
                                    </tr>
                                </thead>
                                {filteredManagerPosts.map((post) => (
                                    <tbody key={post.code}>
                                        <tr>
                                            <td>{post.code}</td>
                                            <td>{post.storeSupervisorName}</td>
                                            <td>{post.workerSupervisorName}</td>
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

export default Store_Supervisor