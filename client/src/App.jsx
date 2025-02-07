import React from 'react';
import AppRoutes from './Routes/Routes.jsx';
import Navbar from './components/Navbar/Navbar.jsx';
import Footer from './components/Footer/Footer.jsx';
import './App.css';

function App() {
  return (
    <>
      <Navbar /> 
      <div>
        <AppRoutes /> 
      </div>
      <Footer />
    </>
  );
}

export default App;
