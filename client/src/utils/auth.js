import React from 'react'
import {jwtDecode} from 'jwt-decode'

export const userId = () => {
 const token=localStorage.getItem('token');
 
 if(!token){
  return null;
 }

 try{
    const decoded=jwtDecode(token);
   
    return decoded.id;
 }catch(error){
    console.error('Error getting user ID:', error);
    return null;
 }

}


