import { useState } from 'react'
import './App.css'

function App() {
  // State variables for input values
  const [amountDue, setAmountDue] = useState('')
  const [amountReceived, setAmountReceived] = useState('')
  
  // State variables for calculation results
  const [changeDue, setChangeDue] = useState(0)
  const [twenties, setTwenties] = useState(0)
  const [tens, setTens] = useState(0)
  const [fives, setFives] = useState(0)
  const [ones, setOnes] = useState(0)
  const [quarters, setQuarters] = useState(0)
  const [dimes, setDimes] = useState(0)
  const [nickels, setNickels] = useState(0)
  const [pennies, setPennies] = useState(0)
  const [isCalculated, setIsCalculated] = useState(false)

  // Calculate change and denominations
  const handleCalculate = () => {
    const due = parseFloat(amountDue) || 0
    const received = parseFloat(amountReceived) || 0
    const change = received - due

    setChangeDue(change)
    setIsCalculated(true)

    if (change >= 0) {
      // Convert to cents to avoid floating point issues
      let remainingCents = Math.round(change * 100)

      // Calculate each denomination
      const twentyCount = Math.floor(remainingCents / 2000)
      remainingCents %= 2000

      const tenCount = Math.floor(remainingCents / 1000)
      remainingCents %= 1000

      const fiveCount = Math.floor(remainingCents / 500)
      remainingCents %= 500

      const oneCount = Math.floor(remainingCents / 100)
      remainingCents %= 100

      const quarterCount = Math.floor(remainingCents / 25)
      remainingCents %= 25

      const dimeCount = Math.floor(remainingCents / 10)
      remainingCents %= 10

      const nickelCount = Math.floor(remainingCents / 5)
      remainingCents %= 5

      const pennyCount = remainingCents

      // Update state
      setTwenties(twentyCount)
      setTens(tenCount)
      setFives(fiveCount)
      setOnes(oneCount)
      setQuarters(quarterCount)
      setDimes(dimeCount)
      setNickels(nickelCount)
      setPennies(pennyCount)
    } else {
      // Reset denominations when change is negative
      setTwenties(0)
      setTens(0)
      setFives(0)
      setOnes(0)
      setQuarters(0)
      setDimes(0)
      setNickels(0)
      setPennies(0)
    }
  }

  return (
    <div className="container">
      <div className="row">
        <div className="col-12">
          <h1 className="text-center mt-4 mb-4">Change Calculator</h1>
        </div>
      </div>
      
      <div className="row">
        {/* Input Section */}
        <div className="col-md-4">
          <div className="card input-card">
            <div className="card-body">
              <div className="mb-3">
                <label htmlFor="amountDue" className="form-label">How much is due?</label>
                <input
                  id="amountDue"
                  data-testid="amountDue"
                  type="number"
                  step="0.01"
                  className="form-control"
                  value={amountDue}
                  onChange={(e) => setAmountDue(e.target.value)}
                  placeholder="Enter amount due..."
                />
              </div>
              
              <div className="mb-3">
                <label htmlFor="amountReceived" className="form-label">How much was received?</label>
                <input
                  id="amountReceived"
                  data-testid="amountReceived"
                  type="number"
                  step="0.01"
                  className="form-control"
                  value={amountReceived}
                  onChange={(e) => setAmountReceived(e.target.value)}
                  placeholder="Enter amount received..."
                />
              </div>
              
              <button
                data-testid="calculate"
                className="btn btn-primary w-100"
                onClick={handleCalculate}
              >
                Calculate Change
              </button>
            </div>
          </div>
        </div>

        {/* Results Section */}
        <div className="col-md-8">
          {/* Alert Messages */}
          {isCalculated && (
            <div className="mb-4">
              {changeDue >= 0 ? (
                <div className="alert alert-success">
                  The total change due is ${Math.abs(changeDue).toFixed(2)}
                </div>
              ) : (
                <div className="alert alert-danger">
                  Additional money owed is ${Math.abs(changeDue).toFixed(2)}
                </div>
              )}
            </div>
          )}

          {/* Denomination Grid */}
          <div className="row">
            <div className="col-md-3 col-6 mb-3">
              <div className="card text-center denomination-card">
                <div className="card-body">
                  <h5 className="card-title">Twenties</h5>
                  <p className="card-text" data-testid="twenties">{twenties}</p>
                </div>
              </div>
            </div>
            
            <div className="col-md-3 col-6 mb-3">
              <div className="card text-center denomination-card">
                <div className="card-body">
                  <h5 className="card-title">Tens</h5>
                  <p className="card-text" data-testid="tens">{tens}</p>
                </div>
              </div>
            </div>
            
            <div className="col-md-3 col-6 mb-3">
              <div className="card text-center denomination-card">
                <div className="card-body">
                  <h5 className="card-title">Fives</h5>
                  <p className="card-text" data-testid="fives">{fives}</p>
                </div>
              </div>
            </div>
            
            <div className="col-md-3 col-6 mb-3">
              <div className="card text-center denomination-card">
                <div className="card-body">
                  <h5 className="card-title">Ones</h5>
                  <p className="card-text" data-testid="ones">{ones}</p>
                </div>
              </div>
            </div>
            
            <div className="col-md-3 col-6 mb-3">
              <div className="card text-center denomination-card">
                <div className="card-body">
                  <h5 className="card-title">Quarters</h5>
                  <p className="card-text" data-testid="quarters">{quarters}</p>
                </div>
              </div>
            </div>
            
            <div className="col-md-3 col-6 mb-3">
              <div className="card text-center denomination-card">
                <div className="card-body">
                  <h5 className="card-title">Dimes</h5>
                  <p className="card-text" data-testid="dimes">{dimes}</p>
                </div>
              </div>
            </div>
            
            <div className="col-md-3 col-6 mb-3">
              <div className="card text-center denomination-card">
                <div className="card-body">
                  <h5 className="card-title">Nickels</h5>
                  <p className="card-text" data-testid="nickels">{nickels}</p>
                </div>
              </div>
            </div>
            
            <div className="col-md-3 col-6 mb-3">
              <div className="card text-center denomination-card">
                <div className="card-body">
                  <h5 className="card-title">Pennies</h5>
                  <p className="card-text" data-testid="pennies">{pennies}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
