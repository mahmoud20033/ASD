import React, { useState, useEffect, useCallback } from 'react';
import { Form, Spinner } from 'react-bootstrap';
import { useSearch } from '../context/SearchContext';
import debounce from 'lodash/debounce';

const SearchFilter = () => {
    const { searchQuery, setSearchQuery } = useSearch();
    return (
        <div className="mb-4 relative">
            <Form.Control
                type="text"
                placeholder="بحث..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setShowSuggestions(true)}
                onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                className="text-center border rounded-md min-w-48 max-w-52"
                dir="rtl"
            />
        </div>
    );
};

export default SearchFilter;
