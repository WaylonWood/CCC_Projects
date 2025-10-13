import React, { useContext } from 'react';
import { AppContext } from '../../context/AppContext';
import EntryForm from '../EntryForm';

const IncomeEntries = () => {
    const { state } = useContext(AppContext);

    return (
        <EntryForm
            type="Income"
            title="Income Entries"
            bgColor="bg-green-100"
            borderColor="border-green-500"
            buttonColor="bg-green-500"
            addActionType="ADD_INCOME"
            editActionType="EDIT_INCOME"
            deleteActionType="DELETE_INCOME"
            entries={state.incomes}
        />
    );
};

export default IncomeEntries;
