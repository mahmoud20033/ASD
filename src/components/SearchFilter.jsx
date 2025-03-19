import React from 'react';
import { Form } from 'react-bootstrap';
import { useSearch } from '../context/SearchContext';
const SearchFilter = () => {
    const { searchQuery, setSearchQuery } = useSearch();

    return (
        <div className="mb-4">
            <Form.Control
                type="text"
                placeholder="بحث..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full p-2 border rounded-md"
                dir="rtl"
            />
        </div>
    );
};

export default SearchFilter;
