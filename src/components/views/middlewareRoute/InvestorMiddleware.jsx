
import React from 'react';
import { Navigate } from 'react-router-dom';

export default function InvestorMiddleware({children}) {
    if(!localStorage.getItem('role')){
        return <Navigate to='/login' replace />
    }else {
        if(localStorage.getItem('role')==='constructor'){
            return <Navigate to='/' replace />
        }
        if(localStorage.getItem('role')==='admon'){
            return <Navigate to='/admon' replace />   
        }
        if(localStorage.getItem('role')==='validator'){
            return <Navigate to='/validator_admon' replace />   
        }
    }
    return children;
    
}
