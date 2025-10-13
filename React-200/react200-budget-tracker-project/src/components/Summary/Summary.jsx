import React, { useContext } from 'react';
import { AppContext } from '../../context/AppContext';

const Summary = () => {
    const { state } = useContext(AppContext);

    const calculateTotal = (items) => {
        return items.reduce((total, item) => total + item.amount, 0);
    };

    const totalIncome = calculateTotal(state.incomes);
    const totalExpenses = calculateTotal(state.expenses);
    const balance = totalIncome - totalExpenses;

    const getBalanceColor = () => {
        if (balance > 0) return 'text-green-600';
        if (balance < 0) return 'text-red-600';
        return 'text-gray-600';
    };

    const getBalanceIcon = () => {
        if (balance > 0) return '📈';
        if (balance < 0) return '📉';
        return '➖';
    };

    return (
        <div className="bg-blue-100 border border-blue-500 rounded-md p-6 mt-6 w-full max-w-md shadow-lg">
            <h2 className="text-2xl font-semibold mb-4 text-center">💰 Financial Summary</h2>
            
            <div className="space-y-3">
                <div className="bg-white bg-opacity-50 p-3 rounded">
                    <div className="flex justify-between items-center">
                        <span className="text-green-700 font-medium">💵 Total Income:</span>
                        <span className="font-bold text-green-700 text-lg">${totalIncome.toFixed(2)}</span>
                    </div>
                    <div className="text-xs text-gray-600 mt-1">
                        {state.incomes.length} income {state.incomes.length === 1 ? 'entry' : 'entries'}
                    </div>
                </div>

                <div className="bg-white bg-opacity-50 p-3 rounded">
                    <div className="flex justify-between items-center">
                        <span className="text-red-700 font-medium">💸 Total Expenses:</span>
                        <span className="font-bold text-red-700 text-lg">${totalExpenses.toFixed(2)}</span>
                    </div>
                    <div className="text-xs text-gray-600 mt-1">
                        {state.expenses.length} expense {state.expenses.length === 1 ? 'entry' : 'entries'}
                    </div>
                </div>

                <div className="bg-white bg-opacity-70 p-4 rounded border-2 border-blue-300">
                    <div className="flex justify-between items-center">
                        <span className="font-semibold text-gray-800">
                            {getBalanceIcon()} Net Balance:
                        </span>
                        <span className={`font-bold text-xl ${getBalanceColor()}`}>
                            ${balance.toFixed(2)}
                        </span>
                    </div>
                    <div className="text-xs text-gray-600 mt-2 text-center">
                        {balance > 0 && "Great job! You're saving money! 🎉"}
                        {balance < 0 && "You're spending more than you earn. Consider reviewing your expenses. ⚠️"}
                        {balance === 0 && "You're breaking even. 👍"}
                    </div>
                </div>

                {(state.incomes.length > 0 || state.expenses.length > 0) && (
                    <div className="bg-white bg-opacity-30 p-3 rounded text-center">
                        <div className="text-xs text-gray-600">
                            <div>Savings Rate: {totalIncome > 0 ? ((balance / totalIncome) * 100).toFixed(1) : 0}%</div>
                            <div className="mt-1">
                                Total Transactions: {state.incomes.length + state.expenses.length}
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {state.incomes.length === 0 && state.expenses.length === 0 && (
                <div className="text-center text-gray-500 italic mt-4">
                    Start by adding some income or expense entries above to see your financial summary! 💡
                </div>
            )}
        </div>
    );
};

export default Summary;
