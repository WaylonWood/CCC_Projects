import { generateId } from '../utils/helpers';

export const initialState = {
    incomes: [],
    expenses: []
};

export function appReducer(state, action) {
    switch (action.type) {
        case 'ADD_INCOME':
            return {
                ...state,
                incomes: [...state.incomes, { ...action.payload, id: generateId() }]
            };
        case 'ADD_EXPENSE':
            return {
                ...state,
                expenses: [...state.expenses, { ...action.payload, id: generateId() }]
            };
        case 'EDIT_INCOME':
            return {
                ...state,
                incomes: state.incomes.map(income => 
                    income.id === action.payload.id ? action.payload : income
                )
            };
        case 'EDIT_EXPENSE':
            return {
                ...state,
                expenses: state.expenses.map(expense => 
                    expense.id === action.payload.id ? action.payload : expense
                )
            };
        case 'DELETE_INCOME':
            return {
                ...state,
                incomes: state.incomes.filter(income => income.id !== action.payload.id)
            };
        case 'DELETE_EXPENSE':
            return {
                ...state,
                expenses: state.expenses.filter(expense => expense.id !== action.payload.id)
            };
        default:
            return state;
    }
}
