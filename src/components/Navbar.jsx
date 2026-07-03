import React from 'react';

export default function Navbar({ theme, toggleTheme }) {
  return (
    <nav className="navbar">
      <strong>Tính lương Gross/Net</strong>
      <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
        <a href="#calculator">Bộ tính lương</a>
        <a href="#explanation">Luật & Biểu thuế</a>
        <button onClick={toggleTheme}>{theme === 'dark' ? '☀️' : '🌙'}</button>
      </div>
    </nav>
  );
}
