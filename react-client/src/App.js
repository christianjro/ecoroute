import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [data, setData] = useState('');
  
  useEffect(() => {
    fetch('/message')
      .then(res => res.json())
      .then(data => setData(data));
  }, []);

  return (
    <div className="App">
      <h1>Final Project</h1>
      <h2>{data.message}</h2>
    </div>
  );
}

export default App;
