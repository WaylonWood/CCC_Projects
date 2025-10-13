import { AppProvider } from './context/AppContext'
import ExpenseEntries from './components/ExpenseEntries'
import IncomeEntries from './components/IncomeEntries'
import Summary from './components/Summary'

function App() {
  return (
    <>
      <AppProvider>
        <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 flex flex-col items-center p-4">
          <div className="w-full max-w-6xl">
            <header className="text-center mb-8">
              <h1 className="text-4xl md:text-5xl font-bold my-6 text-gray-800">
                💰 Budget Tracker
              </h1>
              <p className="text-gray-600 text-lg mb-4">
                Track your income and expenses to manage your finances better
              </p>
            </header>
            
            <main className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full">
                <div className="flex justify-center">
                  <IncomeEntries />
                </div>
                <div className="flex justify-center">
                  <ExpenseEntries />
                </div>
              </div>
              
              <div className="flex justify-center">
                <Summary />
              </div>
            </main>
            
            <footer className="text-center mt-8 text-gray-500 text-sm">
              <p>Built with React, Context API, and Tailwind CSS</p>
            </footer>
          </div>
        </div>
      </AppProvider>
    </>
  )
}

export default App
