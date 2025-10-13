import { useState } from 'react';

export const useFormValidation = () => {
    const [errors, setErrors] = useState({});

    const validateEntry = (description, amount) => {
        const newErrors = {};

        if (!description.trim()) {
            newErrors.description = 'Description is required';
        }

        if (!amount || amount <= 0) {
            newErrors.amount = 'Amount must be greater than 0';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const clearErrors = () => {
        setErrors({});
    };

    return { errors, validateEntry, clearErrors };
};
