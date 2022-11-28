import { Auth } from 'aws-amplify';
import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import Admon from '../../../Admon/Admon';

export default function AdmonMiddleware({children}) {
    if(!localStorage.getItem('role')){
        return <Navigate to='/login' replace />
    }else {
        if(localStorage.getItem('role')==='constructor'){
            return <Navigate to='/' replace />
        } else {
            if(localStorage.getItem('role')==='investor'){
                return <Navigate to='/investor_admon' replace />   
            }
        }
    }
    return children;
}