import React, { useContext, useState } from 'react';
import { AppContext } from '../../context/AppContext';
import { useFormValidation } from '../../hooks/useFormValidation';

const EntryForm = ({ 
    type, // 'income' or 'expense'
    title,
    bgColor,
    borderColor,
    buttonColor,
    addActionType,
    editActionType,
    deleteActionType,
    entries 
}) => {
    const { dispatch } = useContext(AppContext);
    const [description, setDescription] = useState('');
    const [amount, setAmount] = useState('');
    const [editingId, setEditingId] = useState(null);
    const { errors, validateEntry, clearErrors } = useFormValidation();

    const resetForm = () => {
        setDescription('');
        setAmount('');
        setEditingId(null);
        clearErrors();
    };

    const handleSubmit = () => {
        if (!validateEntry(description, amount)) {
            return;
        }

        const entry = {
            description: description.trim(),
            amount: parseFloat(amount)
        };

        if (editingId) {
            // Edit existing entry
            dispatch({
                type: editActionType,
                payload: { ...entry, id: editingId }
            });
        } else {
            // Add new entry
            dispatch({
                type: addActionType,
                payload: entry
            });
        }

        resetForm();
    };

    const handleEdit = (entry) => {
        setDescription(entry.description);
        setAmount(entry.amount.toString());
        setEditingId(entry.id);
        clearErrors();
    };

    const handleDelete = (id) => {
        if (window.confirm('Are you sure you want to delete this entry?')) {
            dispatch({
                type: deleteActionType,
                payload: { id }
            });
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSubmit();
        }
    };

    return (
        <div className={`${bgColor} border ${borderColor} rounded-md p-4 w-full max-w-md shadow-lg`}>
            <h2 className="text-2xl font-semibold mb-4">{title}</h2>
            <div className="mb-4">
                <input
                    type="text"
                    placeholder="Description"
                    className={`border p-2 w-full mb-2 rounded ${errors.description ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    onKeyPress={handleKeyPress}
                />
                {errors.description && (
                    <p className="text-red-500 text-xs mb-2">{errors.description}</p>
                )}
                
                <input
                    type="number"
                    placeholder="Amount"
                    step="0.01"
                    min="0"
                    className={`border p-2 w-full mb-2 rounded ${errors.amount ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    onKeyPress={handleKeyPress}
                />
                {errors.amount && (
                    <p className="text-red-500 text-xs mb-2">{errors.amount}</p>
                )}
                
                <div className="flex gap-2">
                    <button
                        className={`${buttonColor} text-white px-4 py-2 rounded flex-1 hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed`}
                        onClick={handleSubmit}
                    >
                        {editingId ? '✓ Update' : `+ Add ${type}`}
                    </button>
                    {editingId && (
                        <button
                            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition-colors"
                            onClick={resetForm}
                        >
                            Cancel
                        </button>
                    )}
                </div>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                    <thead>
                        <tr className="bg-white bg-opacity-50">
                            <th className="border p-2 font-semibold">Description</th>
                            <th className="border p-2 font-semibold">Amount</th>
                            <th className="border p-2 font-semibold">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {entries.map((entry) => (
                            <tr key={entry.id} className={editingId === entry.id ? 'bg-yellow-100' : 'bg-white bg-opacity-30'}>
                                <td className="border p-2">{entry.description}</td>
                                <td className="border p-2 font-mono">${entry.amount.toFixed(2)}</td>
                                <td className="border p-2">
                                    <div className="flex gap-1">
                                        <button
                                            className="bg-blue-500 text-white px-2 py-1 rounded text-xs hover:bg-blue-600 transition-colors"
                                            onClick={() => handleEdit(entry)}
                                            disabled={editingId && editingId !== entry.id}
                                        >
                                            Edit
                                        </button>
                                        <button
                                            className="bg-red-500 text-white px-2 py-1 rounded text-xs hover:bg-red-600 transition-colors"
                                            onClick={() => handleDelete(entry.id)}
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        {entries.length === 0 && (
                            <tr>
                                <td colSpan="3" className="border p-4 text-center text-gray-500 italic bg-white bg-opacity-30">
                                    No {type.toLowerCase()} entries yet. Add your first {type.toLowerCase()} above!
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
            {entries.length > 0 && (
                <div className="mt-2 text-xs text-gray-600 bg-white bg-opacity-30 p-2 rounded">
                    Total entries: {entries.length} | 
                    Total amount: ${entries.reduce((sum, entry) => sum + entry.amount, 0).toFixed(2)}
                </div>
            )}
        </div>
    );
};

export default EntryForm;
