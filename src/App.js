import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import SalaryForm from './components/SalaryForm';
import SalaryResult from './components/SalaryResult';
import TaxExplanation from './components/TaxExplanation';
import { grossToNet, netToGross } from './utils/salaryCalculator';
import './App.css';

function App() {
  const [theme, setTheme] = useState('light');
  const [result, setResult] = useState(null);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const handleCalculate = ({ direction, salary, ...rest }) => {
    setResult(direction === 'grossToNet' ? grossToNet(salary, rest) : netToGross(salary, rest));
  };

  return (
    <div className="app">
      <Navbar theme={theme} toggleTheme={() => setTheme(t => t === 'dark' ? 'light' : 'dark')} />
      <div className="layout" id="calculator">
        <SalaryForm onCalculate={handleCalculate} />
        <SalaryResult data={result} />
      </div>
      <section id="explanation">
        <TaxExplanation />
      </section>
      <footer className="no-print">
        <p>© {new Date().getFullYear()} VNSalary Calculator — Kết quả mang tính tham khảo.</p>
      </footer>
    </div>
  );
}

export default App;
