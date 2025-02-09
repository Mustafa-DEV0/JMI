// import React from 'react';
// import { Navigate } from 'react-router-dom';

// const ProtectedRoute = ({ children }) => {
//   const token = localStorage.getItem('token');
//   const userType = localStorage.getItem('userType');

//   if (!token) {
//     return <Navigate to="/login" />;
//   }

//   // Add specific route protection based on user type if needed
//   const path = window.location.pathname;
//   const isAuthorized = path.includes(`/${userType}`);

//   if (!isAuthorized) {
//     return <Navigate to="/login" />;
//   }

//   return children;
// };

// export default ProtectedRoute;