import React from 'react';
import Sidebar from '@/app/components/sidebar';
import Header from '@/app/components/header';

export default function Layout (
    {children}
){
    return(
        <div className='grid  xl:grid-cols-6 dark:bg-gray-400' >
        <Sidebar />
        <div className="xl:col-span-5 ">
          <Header />
            {children}
          
        </div>
    </div>
    )
}