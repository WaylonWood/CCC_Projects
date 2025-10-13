import { useState } from 'react'
import './App.css'

function App() {
  // State for input fields
  const [balance, setBalance] = useState('')
  const [rate, setRate] = useState('')
  const [term, setTerm] = useState('30')
  const [output, setOutput] = useState('')

  // Calculate function to determine mortgage payment
  const calculate = (balance, rate, term) => {
    const principal = parseFloat(balance)
    const monthlyRate = parseFloat(rate) / 100 / 12
    const numberOfPayments = parseInt(term) * 12

    if (principal <= 0 || monthlyRate <= 0 || numberOfPayments <= 0) {
      setOutput('Please enter valid values')
      return
    }

    // M = P * (r(1 + r)^n) / ((1 + r)^n - 1)
    const monthlyPayment = principal * 
      (monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) / 
      (Math.pow(1 + monthlyRate, numberOfPayments) - 1)

    setOutput(`$${monthlyPayment.toFixed(2)} is your payment`)
  }

  return (
    <>
      <h1>Mortgage Calculator</h1>
      
      <div className="form-container">
        <div className="input-group">
          <label htmlFor="balance">Loan Balance ($)</label>
          <input 
            type="number" 
            data-testid="balance"
            id="balance"
            value={balance}
            onChange={(e) => setBalance(e.target.value)}
            placeholder="Enter loan balance"
          />
        </div>

        <div className="input-group">
          <label htmlFor="rate">Interest Rate (%)</label>
          <input 
            type="number" 
            data-testid="rate"
            id="rate"
            step="0.01"
            value={rate}
            onChange={(e) => setRate(e.target.value)}
            placeholder="Enter interest rate"
          />
        </div>

        <div className="input-group">
          <label htmlFor="term">Loan Term (years)</label>
          <select 
            data-testid="term"
            id="term"
            value={term}
            onChange={(e) => setTerm(e.target.value)}
          >
            <option value="15">15</option>
            <option value="30">30</option>
          </select>
        </div>

        <button 
          data-testid="submit"
          onClick={() => calculate(balance, rate, term)}
        >
          Calculate
        </button>

        <div id="output" data-testid="output" className="output">
          {output}
        </div>
      </div>
    </>
  )
}

export default App
