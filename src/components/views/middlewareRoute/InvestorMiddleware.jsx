
import React from 'react';
import { Navigate } from 'react-router-dom';
import InvestorAdmon from '../../../Investor/InvestorAdmon';

export default function InvestorMiddleware({children}) {
    if(!localStorage.getItem('role')){
        return <Navigate to='/login' replace />
    }else {
        if(localStorage.getItem('role')==='constructor'){
            return <Navigate to='/' replace />
        } else {
            if(localStorage.getItem('role')==='admon'){
                return <Navigate to='/admon' replace />   
            }
        }
    }
    return children;
    
}
