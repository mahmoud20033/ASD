import React, { createContext, useContext, useState, useEffect } from 'react';

const SearchContext = createContext();

export const SearchProvider = ({ children }) => {
    const [searchQuery, setSearchQuery] = useState(() => {
        const saved = localStorage.getItem('globalSearchQuery');
        return saved || '';
    });

    useEffect(() => {
        localStorage.setItem('globalSearchQuery', searchQuery);
    }, [searchQuery]);

    const filterItems = (items, searchFields = ['name']) => {
        if (!searchQuery) return items;
        return items.filter(item =>
            searchFields.some(field =>
                item[field]?.toString().toLowerCase().includes(searchQuery.toLowerCase())
            )
        );
    };

    const clearSearch = () => {
        setSearchQuery('');
        localStorage.removeItem('globalSearchQuery');
    };

    return (
        <SearchContext.Provider value={{ searchQuery, setSearchQuery, filterItems, clearSearch }}>
            {children}
        </SearchContext.Provider>
    );
};

export const useSearch = () => {
    const context = useContext(SearchContext);
    if (!context) {
        throw new Error('useSearch must be used within a SearchProvider');
    }
    return context;
};
