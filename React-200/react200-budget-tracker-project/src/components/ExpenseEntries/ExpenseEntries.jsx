import React, { useContext } from 'react';
import { AppContext } from '../../context/AppContext';
import EntryForm from '../EntryForm';

const ExpenseEntries = () => {
    const { state } = useContext(AppContext);

    return (
        <EntryForm
            type="Expense"
            title="Expense Entries"
            bgColor="bg-red-100"
            borderColor="border-red-500"
            buttonColor="bg-red-500"
            addActionType="ADD_EXPENSE"
            editActionType="EDIT_EXPENSE"
            deleteActionType="DELETE_EXPENSE"
            entries={state.expenses}
        />
    );
};

export default ExpenseEntries;
