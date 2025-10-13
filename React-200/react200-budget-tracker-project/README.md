# 💰 React Budget Tracker

A comprehensive budget tracking application built with React, Context API, useReducer, and Tailwind CSS. This app allows users to manage their finances by tracking income and expenses with full CRUD (Create, Read, Update, Delete) functionality.

## ✨ Features

### Core Functionality
- **Add Income/Expense Entries**: Add new financial entries with description and amount
- **Edit Entries**: Modify existing entries with inline editing
- **Delete Entries**: Remove unwanted entries with confirmation
- **Real-time Summary**: View total income, expenses, and net balance instantly

### Enhanced User Experience
- **Form Validation**: Comprehensive validation with error messages
- **Responsive Design**: Fully responsive layout that works on all devices
- **Visual Feedback**: Color-coded components (green for income, red for expenses, blue for summary)
- **Interactive Elements**: Hover effects, focus states, and loading states
- **Keyboard Support**: Submit forms using Enter key
- **Confirmation Dialogs**: Confirm before deleting entries

### Advanced Features
- **Savings Rate Calculation**: Automatic calculation of savings percentage
- **Transaction Counter**: Track total number of transactions
- **Entry Highlighting**: Visual indication when editing an entry
- **Empty State Messages**: Helpful messages when no data is present
- **Subtotals**: Per-category totals displayed at the bottom of each component

## 🏗️ Architecture

### Component Structure
```
src/
├── components/
│   ├── EntryForm/          # Reusable form component
│   ├── ExpenseEntries/     # Expense-specific wrapper
│   ├── IncomeEntries/      # Income-specific wrapper
│   └── Summary/            # Financial summary display
├── context/
│   ├── AppContext.jsx      # React Context setup
│   └── reducer.js          # State management with useReducer
├── hooks/
│   └── useFormValidation.js # Custom validation hook
└── utils/
    └── helpers.js          # Utility functions
```

### State Management
- **React Context**: Global state management
- **useReducer**: Predictable state updates
- **Actions**: ADD_INCOME, ADD_EXPENSE, EDIT_INCOME, EDIT_EXPENSE, DELETE_INCOME, DELETE_EXPENSE

### Reusable Components
The `EntryForm` component is highly reusable and configurable:
- Accepts props for styling (colors, borders)
- Configurable action types for different data types
- Built-in form validation and error handling
- Shared logic between income and expense components

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation
```bash
# Clone the repository
git clone <repository-url>

# Navigate to project directory
cd react200-budget-tracker-project

# Install dependencies
npm install

# Start development server
npm run dev
```

### Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run test` - Run tests

## 🎨 Styling

This project uses **Tailwind CSS** for styling with:
- Utility-first approach
- Responsive design classes
- Custom color schemes for different components
- Hover and focus states
- Gradient backgrounds

## 📱 Responsive Design

The application is fully responsive with:
- Mobile-first approach
- Grid layout that adapts to screen size
- Optimized touch targets for mobile devices
- Readable typography across all screen sizes

## 🧪 Technologies Used

- **React 18** - Frontend library
- **Vite** - Build tool and development server
- **Context API + useReducer** - State management
- **Tailwind CSS** - Styling framework
- **Custom Hooks** - Reusable logic
- **ES6+ JavaScript** - Modern JavaScript features

## 🔧 Development Features

- **Hot Module Replacement (HMR)** - Instant updates during development
- **ESLint Configuration** - Code quality and consistency
- **Component-based Architecture** - Modular and maintainable code
- **Custom Hooks** - Reusable stateful logic
- **Utility Functions** - Helper functions for common operations

## 📊 Data Flow

1. User interacts with `EntryForm` component
2. Form validation occurs via `useFormValidation` hook
3. Valid submissions dispatch actions to the reducer
4. Context provides updated state to all components
5. `Summary` component automatically recalculates totals
6. UI updates reflect the new state instantly

## 🎯 Exit Criteria Met

✅ Users can add income and expense entries  
✅ Users can edit existing entries  
✅ Users can delete entries with confirmation  
✅ App displays comprehensive financial summary  
✅ Responsive design works on all devices  
✅ Form validation prevents invalid data  
✅ Shared logic refactored into reusable components  
✅ Clean, maintainable code structure  

## 🚀 Future Enhancements

Potential features for future development:
- Data persistence (localStorage/database)
- Export functionality (CSV, PDF)
- Budget goals and alerts
- Category-based organization
- Date range filtering
- Charts and visualizations
- Multi-currency support
- Recurring transactions

## 📝 License

This project is part of the CCC Projects curriculum.

---

Built with ❤️ using React, Context API, and Tailwind CSS
