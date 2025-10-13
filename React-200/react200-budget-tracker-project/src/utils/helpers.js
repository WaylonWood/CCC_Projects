// Format currency with proper locale formatting
export const formatCurrency = (amount, locale = 'en-US', currency = 'USD') => {
    return new Intl.NumberFormat(locale, {
        style: 'currency',
        currency: currency,
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(amount);
};

// Generate unique IDs for entries
export const generateId = () => {
    return Date.now() + Math.random().toString(36).substr(2, 9);
};

// Validate entry data
export const validateEntryData = (description, amount) => {
    const errors = {};
    
    if (!description || description.trim().length === 0) {
        errors.description = 'Description is required';
    }
    
    if (!amount || isNaN(amount) || parseFloat(amount) <= 0) {
        errors.amount = 'Amount must be a positive number';
    }
    
    return {
        isValid: Object.keys(errors).length === 0,
        errors
    };
};

// Calculate percentage
export const calculatePercentage = (part, total) => {
    if (total === 0) return 0;
    return ((part / total) * 100);
};

// Sort entries by different criteria
export const sortEntries = (entries, sortBy = 'date', order = 'desc') => {
    return [...entries].sort((a, b) => {
        let comparison = 0;
        
        switch (sortBy) {
            case 'amount':
                comparison = a.amount - b.amount;
                break;
            case 'description':
                comparison = a.description.localeCompare(b.description);
                break;
            case 'date':
            default:
                comparison = (a.id || 0) - (b.id || 0);
                break;
        }
        
        return order === 'desc' ? -comparison : comparison;
    });
};
