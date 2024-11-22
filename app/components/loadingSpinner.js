"use client";
import React from 'react';

const Spinner = () => {
    return (
      <div className="fixed inset-0 flex justify-center items-center bg-white">
        <div className="flex items-center justify-center h-screen">
            <div className="relative">
                <div className="h-24 w-24 rounded-full border-t-8 border-b-8 border-custom-blues"></div>
                <div className="absolute top-0 left-0 h-24 w-24 rounded-full border-t-8 border-b-8 border-custom-blues animate-spin"></div>
            </div>
            </div>
        </div>
    );
};

export default Spinner;

