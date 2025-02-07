import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Login from '../pages/login/login.jsx';
import Signup from '../pages/signup/Signup.jsx';
import Home from '../pages/home/Home.jsx';

const AppRouter = () => {
  return (
    
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
      </Routes>
   
  );
};

export default AppRouter;
